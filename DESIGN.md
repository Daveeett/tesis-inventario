---
name: InnovaTecno Inventario Design System
description: Sistema de diseño limpio, profesional y de alta densidad para la gestión eficiente de inventarios
colors:
  primary: "#1A3D63"
  primary-dark: "#0A1931"
  secondary: "#4A7FA7"
  accent: "#B3CFE5"
  neutral-bg: "#F6FAFD"
  card-bg: "#FFFFFF"
  text-main: "#0A1931"
  success: "#10B981"
  warning: "#F59E0B"
  error: "#EF4444"
typography:
  display:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: "2.25rem"
  headline:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: "2rem"
  body:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: "1.25rem"
  label:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  card-surface:
    backgroundColor: "{colors.card-bg}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

# Design System: InnovaTecno Inventario

## 1. Overview

**Creative North Star: "The Precision Operations Control"**

Un sistema de diseño orientado a operaciones de inventario en tiempo real. Combina la sobriedad del azul marino profundo con superficies limpias en blanco y tonos azulados suaves para lograr alta claridad y mínima fatiga visual durante jornadas prolongadas.

Rechaza explícitamente los patrones antiguos de Bootstrap, sombras excesivas y tablas saturadas sin jerarquía. Cada componente está optimizado para brindar una respuesta visual inmediata en registros de stock, alertas de inventario y consulta de catálogos.

### Key Characteristics:
- **Estructura clara**: Bordes sutiles y contraste optimizado para rápida lectura de existencias.
- **Acción ágil**: Botones principales contrastados en Azul Marino Profundo (`#1A3D63`).
- **Estado semántico destacado**: Indicadores claros para stock normal, bajo stock y agotado.

## 2. Colors

La paleta se organiza bajo la estrategia *Restrained / Committed*: tonos neutros marinos limpios con acentos de estado muy enfocados.

### Primary
- **Navy Ocean** (`#1A3D63`): Color principal de la marca y elementos interactivos clave (botones principales, navegación activa, encabezados principales).
- **Navy Dark** (`#0A1931`): Color de fondo oscuro para contrastes profundos y estado hover de botones de acción principal.

### Secondary
- **Blue Slate** (`#4A7FA7`): Usado en elementos secundarios, bordes activos, pestañas y botones secundarios.

### Accent
- **Blue Ice** (`#B3CFE5`): Acento suave para estados seleccionados, fondos de badges y resaltados de tabla.

### Neutral
- **Blue Soft / Surface** (`#F6FAFD`): Fondo general de la aplicación para reducir el brillo directo.
- **Card Base** (`#FFFFFF`): Superficie blanca para tarjetas, contenedores y filas de tablas.
- **Text Primary** (`#0A1931`): Texto principal de alta legibilidad.

### Semantics
- **Success** (`#10B981`): Confirmaciones de entrada de stock y existencias óptimas.
- **Warning** (`#F59E0B`): Stock bajo o reorden pendiente.
- **Error** (`#EF4444`): Salidas no autorizadas, stock agotado o errores de validación.

### Named Rules
**The Single Accent Rule.** El color primario Navy Ocean lidera la interfaz; los colores semánticos solo se utilizan cuando indican un estado real de inventario (éxito, advertencia, peligro).

## 3. Typography

**Display Font:** Geist, sans-serif  
**Body Font:** Geist, sans-serif  
**Mono Font:** JetBrains Mono, monospace  

La combinación de Geist para interfaces modernas con JetBrains Mono para datos numéricos y códigos SKUs garantiza una lectura matemática impecable.

### Hierarchy
- **Display** (Bold 700, 1.875rem / 30px, 2.25rem line-height): Encabezados de dashboards y títulos principales de sección.
- **Headline** (SemiBold 600, 1.5rem / 24px, 2rem line-height): Títulos de módulos, tarjetas principales y formularios.
- **Title** (Medium 500, 1.125rem / 18px, 1.75rem line-height): Subtítulos y nombres de productos.
- **Body** (Regular 400, 0.875rem / 14px, 1.25rem line-height): Texto explicativo y celdas de tabla.
- **Label / SKU Mono** (Medium 500 Mono, 0.75rem / 12px, 0.05em letter-spacing): Códigos de producto, SKUs, precios y fechas.

## 4. Elevation

El sistema utiliza una elevación plana y limpia (*Flat with Tonal Layering*). Los elementos se separan mediante fondos suaves y bordes de 1px en lugar de sombras pesadas.

### Named Rules
**The Flat-By-Default Rule.** Las tarjetas y tablas permanecen planas en reposo con bordes limpios en `#E2E8F0` o `#B3CFE5`. Las sombras solo aparecen en elevación flotante o modales (`0 10px 15px -3px rgba(10, 25, 49, 0.1)`).

## 5. Components

### Buttons
- **Shape:** Bordes redondeados suaves (`rounded-md` / 8px).
- **Primary:** Fondo `#1A3D63`, texto blanco, padding `10px 20px`.
- **Hover / Focus:** Transición a `#0A1931` con foco en anillo `#4A7FA7`.
- **Secondary:** Fondo transparente con borde `#4A7FA7` y texto `#1A3D63`.

### Cards / Containers
- **Corner Style:** `rounded-lg` (12px).
- **Background:** `#FFFFFF` sobre lienzo `#F6FAFD`.
- **Border:** `1px solid #E2E8F0`.
- **Internal Padding:** `20px` (o `16px` en vista densa).

### Inputs / Fields
- **Style:** Fondo `#FFFFFF`, borde `1px solid #CBD5E1`, bordes `6px`.
- **Focus:** Anillo sutil en `#1A3D63` con leve resplandor azul Slate.

### Tables & Data Grids
- **Header:** Fondo `#F6FAFD`, texto en mayúsculas `JetBrains Mono` semibold en `#4A7FA7`.
- **Rows:** Alternadas o con borde inferior sutil `1px solid #F1F5F9`. Hover suave en `#F8FAFC`.

## 6. Do's and Don'ts

### Do:
- **Do** mantener el uso de JetBrains Mono para códigos SKU, existencias numéricas y precios.
- **Do** utilizar badges con icono + texto para representar estados de stock.
- **Do** agrupar las acciones principales de registro en la parte superior derecha de cada módulo.

### Don't:
- **Don't** utilizar modales invasivos para acciones simples de registro rápido cuando un formulario en línea o drawer es más rápido.
- **Don't** aplicar bordes laterales gruesos ni sombras pesadas estilo Bootstrap 3.
- **Don't** usar gradientes de texto ni efectos de vidrio (glassmorphism) decorativos que dificulten la lectura de datos.
