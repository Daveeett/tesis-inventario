/**
 * Enum para los tipos de movimiento de inventario
 * IN: Entrada de mercadería
 * OUT: Salida de mercadería (venta u otro)
 * ADJUSTMENT: Ajuste manual de stock
 */
export enum MovementType {
    IN = "IN",
    OUT = "OUT",
    ADJUSTMENT = "ADJUSTMENT",
}
