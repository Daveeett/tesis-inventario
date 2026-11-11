/**
 * Crea (o recrea) la base de datos de prueba "innovatecno_1000" con 1.000 productos ficticios.
 * No modifica la base de desarrollo (innovatecno_inventario).
 *
 * Uso:   npm run seed:1000            -> crea la base si no existe y la llena si está vacía
 *        npm run seed:1000 -- --reset -> la borra y la vuelve a crear desde cero
 *
 * Después, para usarla:  DB_NAME=innovatecno_1000 npm run dev
 * (en Claude Code: configuración "backend-1000" de .claude/launch.json)
 */
require("dotenv").config();
const { Client } = require("pg");

const DB = "innovatecno_1000";
const RESET = process.argv.includes("--reset");
const cfg = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
};

const CATEGORIAS = ["Periféricos y Accesorios", "Componentes de PC", "Computadoras y Laptops", "Redes y Conectividad", "Celulares y Móviles", "Audio y Video"];
const TIPOS = [
    ["Mouse", 0], ["Teclado Mecánico", 0], ["Audífonos", 0], ["Monitor", 0],
    ["Memoria RAM", 1], ["Disco SSD", 1], ["Tarjeta de Video", 1], ["Fuente de Poder", 1],
    ["Laptop", 2], ["PC de Escritorio", 2], ["Router Wi-Fi", 3], ["Switch de Red", 3],
    ["Celular", 4], ["Cargador", 4], ["Parlante Bluetooth", 5], ["Cámara Web", 5],
];
const MARCAS = ["Logitech", "Razer", "HyperX", "Corsair", "Kingston", "Samsung", "ASUS", "MSI", "Lenovo", "HP", "Dell", "TP-Link", "Xiaomi", "Sony", "JBL", "Redragon"];

async function main() {
    const admin = new Client({ ...cfg, database: "postgres" });
    await admin.connect();
    if (RESET) await admin.query(`DROP DATABASE IF EXISTS ${DB} WITH (FORCE)`);
    const exists = await admin.query("SELECT 1 FROM pg_database WHERE datname = $1", [DB]);
    if (exists.rowCount === 0) await admin.query(`CREATE DATABASE ${DB}`);
    await admin.end();

    // Crear las tablas con las entidades del proyecto (TypeORM synchronize)
    process.env.DB_NAME = DB;
    process.env.DB_DATABASE = DB;
    process.env.NODE_ENV = "production"; // sin registro de consultas SQL en consola
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    require("ts-node").register({ transpileOnly: true });
    const { AppDataSource } = require("../config/data-source");
    await AppDataSource.initialize();

    const count = await AppDataSource.query("SELECT COUNT(*)::int AS n FROM products");
    if (count[0].n > 0) {
        console.log(`La base ${DB} ya tiene ${count[0].n} productos. Use --reset para recrearla.`);
        await AppDataSource.destroy();
        return;
    }

    const catIds = [];
    for (const name of CATEGORIAS) {
        const r = await AppDataSource.query("INSERT INTO categories(name) VALUES ($1) RETURNING id", [name]);
        catIds.push(r[0].id);
    }
    const subIds = [];
    for (const [name, ci] of TIPOS) {
        const r = await AppDataSource.query("INSERT INTO subcategories(name, category_id) VALUES ($1, $2) RETURNING id", [name, catIds[ci]]);
        subIds.push(r[0].id);
    }
    const values = [];
    const params = [];
    for (let i = 0; i < 1000; i++) {
        const ti = i % TIPOS.length;
        const marca = MARCAS[(i * 7) % MARCAS.length];
        params.push(
            `${TIPOS[ti][0]} ${marca} Serie ${100 + i}`, marca, `MOD-${1000 + i}`, `SN-${50000 + i}`,
            (15 + (i % 40) * 12.5).toFixed(2), (10 + (i % 40) * 9).toFixed(2), i % 30, subIds[ti],
        );
        const b = params.length - 8;
        values.push(`($${b + 1},$${b + 2},$${b + 3},$${b + 4},$${b + 5},$${b + 6},$${b + 7},$${b + 8})`);
    }
    await AppDataSource.query(
        `INSERT INTO products(name, brand, model, serial_number, sale_price, purchase_price, stock, subcategory_id) VALUES ${values.join(",")}`,
        params,
    );
    console.log(`Base ${DB} creada: ${CATEGORIAS.length} categorías, ${TIPOS.length} subcategorías y 1000 productos.`);
    await AppDataSource.destroy();
}

main().catch((e) => {
    console.error("Error al crear la base de prueba:", e.message);
    process.exit(1);
});
