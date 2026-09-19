import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Product } from "./product.entity";
import { MovementType } from "./enums/movement-type.enum";

/**
 * Registro de movimientos de inventario.
 * Registra entradas, salidas y ajustes con trazabilidad completa.
 */
@Entity("inventory_movements")
export class InventoryMovement extends BaseEntity {
    @Column({ type: "varchar", length: 20 })
    type: string;

    @Column({ type: "integer" })
    quantity: number;

    @Column({ type: "text", nullable: true })
    reason: string;

    @Column({ name: "previous_stock", type: "integer" })
    previousStock: number;

    @Column({ name: "new_stock", type: "integer" })
    newStock: number;

    // Relación: Muchos movimientos pertenecen a un producto
    @ManyToOne(() => Product, (product) => product.movements, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "product_id" })
    product: Product;

    @Column({ name: "product_id" })
    productId: string;
}
