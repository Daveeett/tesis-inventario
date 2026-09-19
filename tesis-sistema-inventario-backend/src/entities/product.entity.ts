import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Subcategory } from "./subcategory.entity";
import { InventoryMovement } from "./inventory-movement.entity";

/**
 * Producto del catálogo de INNOVATECNO.
 * Incluye especificaciones técnicas, número de serie, precios y control de stock.
 */
@Entity("products")
export class Product extends BaseEntity {
    @Column({ type: "varchar", length: 200 })
    name: string;

    @Column({ type: "varchar", length: 100 })
    brand: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    model: string;

    @Column({ name: "serial_number", type: "varchar", length: 100, nullable: true, unique: true })
    serialNumber: string;

    @Column({ type: "text", nullable: true })
    description: string;

    /** Imagen del producto almacenada como Base64 comprimida (< 150KB) */
    @Column({ name: "image_base64", type: "text", nullable: true })
    imageBase64: string;

    /**
     * Especificaciones técnicas almacenadas como JSON.
     * Ejemplo: { "ram": "16GB", "storage": "512GB SSD", "processor": "Intel i7" }
     */
    @Column({ type: "simple-json", nullable: true })
    specifications: any;

    @Column({ name: "purchase_price", type: "decimal", precision: 10, scale: 2, default: 0 })
    purchasePrice: number;

    @Column({ name: "sale_price", type: "decimal", precision: 10, scale: 2, default: 0 })
    salePrice: number;

    @Column({ type: "integer", default: 0 })
    stock: number;

    @Column({ name: "min_stock", type: "integer", default: 1 })
    minStock: number;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean;

    // Relación: Muchos productos pertenecen a una subcategoría
    @ManyToOne(() => Subcategory, (subcategory) => subcategory.products, {
        onDelete: "SET NULL",
        nullable: true,
    })
    @JoinColumn({ name: "subcategory_id" })
    subcategory: Subcategory;

    @Column({ name: "subcategory_id", nullable: true })
    subcategoryId: string;

    // Relación: Un producto tiene muchos movimientos de inventario
    @OneToMany(() => InventoryMovement, (movement) => movement.product)
    movements: InventoryMovement[];
}
