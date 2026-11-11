const { AppDataSource } = require('./dist/src/config/data-source');
const { Product } = require('./dist/src/entities/product.entity');
const { InventoryMovement } = require('./dist/src/entities/inventory-movement.entity');
const { User } = require('./dist/src/entities/user.entity');
const { signToken } = require('./dist/src/utils/jwt.util');
const { createApp } = require('./dist/src/app');
const products = new Map();
const movements = [];
const testUser = {id:'33333333-3333-4333-8333-333333333333', isActive:true, sessionToken:'test-session', role:'ADMIN'};
const token = signToken({userId:testUser.id, role:testUser.role, sessionToken:testUser.sessionToken});
const id1 = '11111111-1111-4111-8111-111111111111';
const id2 = '22222222-2222-4222-8222-222222222222';
const productRepo = {
  findOne: async ({where}) => products.get(where.id) || null,
  save: async p => { products.set(p.id, p); return p; },
};
const movementRepo = {
  create: p => ({...p}),
  save: async m => { movements.push(m); return m; },
  find: async () => movements,
};
AppDataSource.getRepository = entity => {
  if (entity === Product) return productRepo;
  if (entity === InventoryMovement) return movementRepo;
  if (entity === User) return {findOne: async () => testUser};
  throw new Error('Repositorio no simulado: ' + entity.name);
};
AppDataSource.transaction = async callback => {
  const oldProducts = new Map([...products].map(([id, value]) => [id, {...value}]));
  const oldLength = movements.length;
  try { return await callback({getRepository: entity => AppDataSource.getRepository(entity)}); }
  catch (err) { products.clear(); for (const [id, value] of oldProducts) products.set(id, value); movements.length = oldLength; throw err; }
};
const results = [];
async function run() {
  const server = createApp().listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}/api`;
  async function request(path, body, authorized = true) {
    const headers = {'content-type':'application/json', ...(authorized ? {authorization:`Bearer ${token}`} : {})};
    const response = await fetch(base+path, body === undefined ? {headers} : {method:'POST',headers,body:JSON.stringify(body)});
    return {status:response.status, body:await response.json()};
  }
  function check(name, expected, actual, passed) { results.push({name, expected, actual, passed}); }
  try {
    let r = await request('/health');
    check('Servicio operativo', 'HTTP 200 y success verdadero', `HTTP ${r.status}, success ${r.body.success}`, r.status===200 && r.body.success===true);
    r = await request('/products', {name:'X',brand:'',purchasePrice:-1,salePrice:10});
    check('Datos de producto inválidos', 'HTTP 400', `HTTP ${r.status}`, r.status===400);
    products.set(id1,{id:id1,name:'Producto ficticio A',stock:10});
    products.set(id2,{id:id2,name:'Producto ficticio B',stock:2});
    r = await request('/inventory/movements',{productId:id1,type:'IN',quantity:5});
    check('Entrada de inventario', 'HTTP 201; stock 10 a 15', `HTTP ${r.status}; stock ${products.get(id1).stock}`,r.status===201 && products.get(id1).stock===15 && r.body.data.previousStock===10);
    r = await request('/inventory/movements',{productId:id1,type:'OUT',quantity:4});
    check('Salida de inventario', 'HTTP 201; stock 15 a 11', `HTTP ${r.status}; stock ${products.get(id1).stock}`,r.status===201 && products.get(id1).stock===11);
    r = await request('/inventory/movements',{productId:id1,type:'OUT',quantity:12});
    check('Salida superior al stock', 'HTTP 400; stock 11', `HTTP ${r.status}; stock ${products.get(id1).stock}`,r.status===400 && products.get(id1).stock===11);
    r = await request('/inventory/movements',{productId:id1,type:'IN',quantity:0});
    check('Cantidad cero', 'HTTP 400; stock 11', `HTTP ${r.status}; stock ${products.get(id1).stock}`,r.status===400 && products.get(id1).stock===11);
    r = await request('/inventory/quick-exit',{items:[{productId:id1,quantity:1},{productId:id2,quantity:3}]});
    check('Salida múltiple con stock insuficiente', 'HTTP 400; sin cambios en ambos productos', `HTTP ${r.status}; stock A ${products.get(id1).stock}, B ${products.get(id2).stock}`,r.status===400 && products.get(id1).stock===11 && products.get(id2).stock===2);
    r = await request('/inventory/movements',{productId:id1,type:'IN',quantity:1},false);
    check('Protección de movimientos sin iniciar sesión', 'rechazo HTTP 401 o 403', `HTTP ${r.status}`,r.status===401 || r.status===403);
    r = await request('/inventory/quick-exit',{items:[{productId:id1,quantity:-2}]});
    check('Salida con cantidad negativa', 'HTTP 400; stock sin cambio', `HTTP ${r.status}; stock ${products.get(id1).stock}`,r.status===400 && products.get(id1).stock===11);
    r = await request('/inventory/quick-exit',{items:[{productId:id1,quantity:2},{productId:id2,quantity:1}]});
    check('Salida múltiple válida', 'HTTP 201; stock A 9, B 1', `HTTP ${r.status}; stock A ${products.get(id1).stock}, B ${products.get(id2).stock}`,r.status===201 && products.get(id1).stock===9 && products.get(id2).stock===1);
  } finally { server.close(); }
  console.log(JSON.stringify({timestamp:new Date().toISOString(),environment:'API Express y repositorios simulados en memoria; sin base de datos ni interfaz',results},null,2));
}
run().catch(e => {console.error(e); process.exitCode=1;});
