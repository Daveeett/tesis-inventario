import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { Category } from "./category.entity";
import { Product } from "./product.entity";

/**
 * Subcategoría de productos, pertenece a una Categoría.
 * Ejemplo: Categoría "Computadoras" -> Subcategoría "Laptops", "Desktops"
 */
@Entity("subcategories")
export class Subcategory extends BaseEntity {
    @Column({ type: "varchar", length: 100 })
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: "is_active", type: "boolean", default: true })
    isActive: boolean;

    // Relación: Muchas subcategorías pertenecen a una categoría
    @ManyToOne(() => Category, (category) => category.subcategories, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "category_id" })
    category: Category;

    @Column({ name: "category_id" })
    categoryId: string;

    // Relación: Una subcategoría tiene muchos productos
    @OneToMany(() => Product, (product) => product.subcategory, {
        cascade: true,
    })
    products: Product[];
}
