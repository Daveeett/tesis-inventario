/* Uso exclusivo con PostgreSQL local. Crea una base nueva de prueba; no modifica ni elimina bases existentes. */
require('dotenv').config();
const { Client } = require('pg');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const os = require('os');

async function main() {
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) throw Error('No se permiten URL remotas en esta prueba.');
  if (!['localhost', '127.0.0.1', '::1'].includes(process.env.DB_HOST || 'localhost')) throw Error('La prueba requiere PostgreSQL local.');
  const database = `innovatecno_prueba_${Date.now()}`;
  const options = { host: process.env.DB_HOST || 'localhost', port: Number(process.env.DB_PORT || 5432), user: process.env.DB_USER || 'postgres', password: process.env.DB_PASSWORD };
  const control = new Client({ ...options, database: 'postgres' });
  await control.connect();
  await control.query(`CREATE DATABASE "${database}"`);
  await control.end();
  process.env.DB_DATABASE = database;
  process.env.NODE_ENV = 'test';
  process.env.BENCHMARK_DISABLE_RATE_LIMIT = 'true';
  process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
  require('reflect-metadata');
  const { AppDataSource } = require('../dist/src/config/data-source');
  const { User } = require('../dist/src/entities/user.entity');
  const { hashPassword } = require('../dist/src/utils/password.util');
  const { createApp } = require('../dist/src/app');
  await AppDataSource.initialize();
  await AppDataSource.query(fs.readFileSync(path.join(__dirname, '../sql/001_product_search_indexes.sql'), 'utf8'));
  await AppDataSource.query(`INSERT INTO products (name, brand, model, serial_number, purchase_price, sale_price, stock, min_stock)
    SELECT CASE WHEN n % 2 = 0 THEN 'Cámara ' ELSE 'Router ' END || n, 'Marca ' || (n % 20), 'Modelo ' || n, 'TEST-' || n, 10, 15, 20, 2
    FROM generate_series(1, 15000) AS n`);
  await AppDataSource.query('ANALYZE products');
  const password = crypto.randomBytes(24).toString('hex');
  const repo = AppDataSource.getRepository(User);
  const admin = await repo.save(repo.create({ name: 'Administrador de prueba', email: 'admin@example.invalid', passwordHash: await hashPassword(password), role: 'ADMIN', isActive: true }));
  await repo.save(repo.create({ name: 'Vendedor de prueba', email: 'vendedor@example.invalid', passwordHash: await hashPassword(password), role: 'VENDEDOR', isActive: true }));
  const server = await new Promise(resolve => { const s = createApp().listen(0, '127.0.0.1', () => resolve(s)); });
  const base = `http://127.0.0.1:${server.address().port}/api`;
  async function request(url, options = {}) { const start = performance.now(); const response = await fetch(base + url, options); const text = await response.text(); let body; try { body = JSON.parse(text); } catch { body = { message: text.slice(0, 200) }; } return { status: response.status, body, ms: performance.now() - start }; }
  async function login(email) { const r = await request('/auth/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); assert.equal(r.status,200); return r.body.data.token; }
  const adminToken = await login('admin@example.invalid');
  const sellerToken = await login('vendedor@example.invalid');
  const headers = token => ({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
  const noAuth = await request('/products/search'); assert.equal(noAuth.status,401);
  const sellerWrite = await request('/products', {method:'POST',headers:headers(sellerToken),body:'{}'}); assert.equal(sellerWrite.status,403);
  const sellerRead = await request('/products/search?search=camara%201000&limit=10', {headers:headers(sellerToken)});
  assert.equal(sellerRead.status,200); assert(sellerRead.body.data.length > 0); assert(!('purchasePrice' in sellerRead.body.data[0]));
  const adminRead = await request('/products/search?search=camara%201000&limit=10', {headers:headers(adminToken)});
  assert.equal(adminRead.status,200); assert('purchasePrice' in adminRead.body.data[0]);
  const id = adminRead.body.data[0].id;
  const directStock = await request(`/products/${id}`, {method:'PUT',headers:headers(adminToken),body:JSON.stringify({stock:999})}); assert.equal(directStock.status,400);
  const adjustment = await request('/inventory/movements', {method:'POST',headers:headers(sellerToken),body:JSON.stringify({productId:id,type:'ADJUSTMENT',quantity:99})}); assert.equal(adjustment.status,403);
  const previous = await AppDataSource.query('SELECT stock FROM products WHERE id=$1',[id]);
  const ids = await AppDataSource.query('SELECT id FROM products WHERE id <> $1 ORDER BY name LIMIT 1',[id]);
  const rollback = await request('/inventory/quick-exit', {method:'POST',headers:headers(sellerToken),body:JSON.stringify({items:[{productId:id,quantity:1},{productId:ids[0].id,quantity:999}],reason:'Prueba de reversión'})});
  assert.equal(rollback.status,400); assert.equal((await AppDataSource.query('SELECT stock FROM products WHERE id=$1',[id]))[0].stock, previous[0].stock);
  const concurrent = await Promise.all([1,2].map(() => request('/inventory/quick-exit', {method:'POST',headers:headers(sellerToken),body:JSON.stringify({items:[{productId:id,quantity:15}],reason:'Prueba concurrente'})})));
  assert.deepEqual(concurrent.map(r => r.status).sort(),[201,400].sort());
  assert.equal((await AppDataSource.query('SELECT stock FROM products WHERE id=$1',[id]))[0].stock, 5);
  const protectedHistory = await request(`/products/${id}`, {method:'DELETE',headers:headers(adminToken)}); assert.equal(protectedHistory.status,409);
  const summary = await request('/products/summary',{headers:headers(adminToken)}); assert.equal(summary.body.data.total,15000);
  const results = [];
  for (const concurrency of [1, 10, 50]) {
    for (let repetition=1; repetition<=3; repetition++) {
      const times=[]; const statuses={}; const start=performance.now();
      await Promise.all(Array.from({length:concurrency}, async () => {
        for(let n=0;n<10;n++) {
          const r=await request('/products/search?search=camara%201000&limit=20', {headers:headers(adminToken)});
          times.push(r.ms); statuses[r.status]=(statuses[r.status]||0)+1;
        }
      }));
      times.sort((a,b)=>a-b); const elapsed=(performance.now()-start)/1000;
      results.push({concurrency,repetition,requests:times.length,seconds:+elapsed.toFixed(2),p50_ms:+times[Math.floor(times.length*.5)].toFixed(2),p95_ms:+times[Math.min(times.length-1,Math.ceil(times.length*.95)-1)].toFixed(2),requests_per_second:+(times.length/elapsed).toFixed(1),statuses});
      console.log(`Medición ${concurrency} usuarios, repetición ${repetition}: ${times.length} peticiones`);
    }
  }
  const plan = await AppDataSource.query("EXPLAIN SELECT id FROM products WHERE public.inventory_search_normalize(name) LIKE '%camara%' AND public.inventory_search_normalize(name) LIKE '%1000%'");
  const logout = await request('/auth/logout',{method:'POST',headers:headers(sellerToken)}); assert.equal(logout.status,200);
  const revoked = await request('/products/search',{headers:headers(sellerToken)}); assert.equal(revoked.status,401);
  const pgVersion = (await AppDataSource.query('SHOW server_version'))[0].server_version;
  const report={generatedAt:new Date().toISOString(),database,products:15000,search:'camara 1000',host:'PostgreSQL local; productos ficticios sin imágenes',environment:{cpu:os.cpus()[0]?.model, logicalCores:os.availableParallelism(), ramGiB:+(os.totalmem()/1024**3).toFixed(1),node:process.version,postgres:pgVersion,platform:os.platform()},method:'10 peticiones por usuario y repetición; tres repeticiones; limitador general desactivado solo en modo test; autenticación activa',security:{anonymousRead:noAuth.status,sellerWrite:sellerWrite.status,sellerPurchasePriceHidden:true,adminDirectStockUpdate:directStock.status,sellerAdjustment:adjustment.status,rollbackInsufficientStock:rollback.status,concurrentExits:concurrent.map(r=>r.status),finalStock:5,deletionWithHistory:protectedHistory.status,revokedSession:revoked.status},summaryMs:+summary.ms.toFixed(2),results,queryPlan:plan.map(r=>r['QUERY PLAN'])};
  fs.writeFileSync(path.join(__dirname,'resultado_15000.json'), JSON.stringify(report,null,2));
  console.log('Resultados guardados; base de prueba conservada:',database);
  await new Promise(resolve => server.close(resolve));
  await AppDataSource.destroy();
}
main().catch(error=>{console.error(error);process.exit(1);});
