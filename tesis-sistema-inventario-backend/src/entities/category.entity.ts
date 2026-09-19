import { Entity, Column, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Subcategory } from "./subcategory.entity";

/**
 * Categoría principal de productos.
 * Ejemplo: "Computadoras", "Celulares", "Accesorios"
 */
@Entity("categories")
export class Category extends BaseEntity {
    @Column({ type: "varchar", length: 100, unique: true })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean;

    // Relación: Una categoría tiene muchas subcategorías
    @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
        cascade: true,
    })
    subcategories: Subcategory[];
}
