/* Comprueba la actualización exclusivamente en la última base sintética del informe de carga. */
require('dotenv').config();
const assert = require('assert/strict');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const report = JSON.parse(fs.readFileSync(path.join(__dirname,'resultado_15000.json'),'utf8'));
if (!/^innovatecno_prueba_\d+$/.test(report.database) || !['localhost','127.0.0.1','::1'].includes(process.env.DB_HOST || 'localhost') || process.env.DATABASE_URL || process.env.POSTGRES_URL) throw Error('Solo se admite la base sintética local');
process.env.DB_DATABASE = report.database;
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
require('reflect-metadata');
const { AppDataSource } = require('../dist/src/config/data-source');
const { User } = require('../dist/src/entities/user.entity');
const { hashPassword } = require('../dist/src/utils/password.util');
const { createApp } = require('../dist/src/app');
async function main() {
  await AppDataSource.initialize();
  const password=crypto.randomBytes(20).toString('hex');
  const email=`test-${crypto.randomBytes(6).toString('hex')}@example.invalid`;
  const repo=AppDataSource.getRepository(User);
  await repo.save(repo.create({name:'Verificación sintética',email,passwordHash:await hashPassword(password),role:'ADMIN',isActive:true}));
  const server=await new Promise(resolve=>{const s=createApp().listen(0,'127.0.0.1',()=>resolve(s));});
  const base=`http://127.0.0.1:${server.address().port}/api`;
  async function request(url,options={}) { const r=await fetch(base+url,options); return {status:r.status,body:await r.json()}; }
  const json={'Content-Type':'application/json'};
  assert.equal((await request('/auth/login',{method:'POST',headers:json,body:'{}'})).status,400);
  const login=await request('/auth/login',{method:'POST',headers:json,body:JSON.stringify({email,password})}); assert.equal(login.status,200);
  const headers={...json,Authorization:`Bearer ${login.body.data.token}`};
  assert.equal((await request('/products',{headers})).status,410);
  assert.equal((await request('/products',{method:'POST',headers,body:JSON.stringify({name:'X',brand:'',purchasePrice:-1})})).status,400);
  const created=await request('/products',{method:'POST',headers,body:JSON.stringify({name:'Verificación Zod',brand:'Prueba',purchasePrice:1,salePrice:2,stock:1,minStock:0,specifications:{color:'azul'}})});
  assert.equal(created.status,201); assert.equal(created.body.data.specifications.color,'azul');
  assert.equal((await request(`/products/${created.body.data.id}`,{method:'PUT',headers,body:JSON.stringify({stock:10})})).status,400);
  assert.equal((await request('/products/search?search=Verificaci%C3%B3n%20Zod&limit=10',{headers})).status,200);
  assert.equal((await request('/inventory/quick-register',{method:'POST',headers,body:JSON.stringify({items:[{productId:created.body.data.id,quantity:2}]})})).status,201);
  assert.equal((await request('/auth/logout',{method:'POST',headers})).status,200);
  assert.equal((await request('/products/search',{headers})).status,401);
  fs.writeFileSync(path.join(__dirname,'resultado_actualizacion.json'),JSON.stringify({fecha:new Date().toISOString(),database:report.database,zod:require('zod/package.json').version,estado:'aprobado',casos:['login inválido','login válido','bloqueo del listado ilimitado','producto inválido','producto válido con especificaciones','rechazo de edición directa de stock','búsqueda','entrada de inventario','revocación de sesión']},null,2));
  await new Promise(resolve=>server.close(resolve)); await AppDataSource.destroy();
  console.log('Nueve comprobaciones de actualización aprobadas');
}
main().catch(e=>{console.error(e);process.exit(1);});
