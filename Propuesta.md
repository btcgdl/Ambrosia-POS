# Sistema de Punto de Venta para Restaurantes con Compose Multiplatform

## Descripción General

El sistema descrito es una aplicación de punto de venta (POS) para restaurantes, desarrollada en Kotlin utilizando Compose Multiplatform, un framework que permite compartir código de interfaz de usuario (UI) entre múltiples plataformas, incluyendo escritorio (Windows y Linux). Este sistema está diseñado para optimizar las operaciones diarias de un restaurante, como la gestión de pedidos, mesas y finanzas, con una interfaz moderna y reactiva. A continuación, se detallan los módulos del sistema, considerando las características solicitadas: inicio de sesión, selección de mesas, historial de pedidos, gestión de usuarios y asignación de permisos, creación de platillos, impresión de tickets y retirada de fondos. 

## Módulos Principales

### Autenticación
- **Propósito**: Gestionar el acceso seguro de los usuarios al sistema mediante autenticación y manejo de sesiones.
- **Funcionalidades**:
  - Pantalla de inicio de sesión con credenciales (nombre de usuario y contraseña).
  - Soporte para diferentes roles de usuario (administrador, mesero).
  - Gestión de sesiones activas y opciones de cierre de sesión.

### Gestión de Usuarios
- **Propósito**: Administrar las cuentas de los empleados y asignar roles a los usuarios.
- **Funcionalidades**:
  - Crear, editar y eliminar cuentas de usuario.
  - Asignar roles y permisos específicos (por ejemplo, acceso a gestión de menús o retirada de fondos).

### Gestión de Mesas
- **Propósito**: Gestionar las mesas del restaurante, su estado y asignación.
- **Funcionalidades**:
  - Visualización del plano del restaurante con estados de mesas (disponible, ocupada).
  - Asignación de mesas a pedidos y actualización en tiempo real.
  - Interfaz visual para selección rápida de mesas.

### Gestión de Menús
- **Propósito**: Administrar los platillos disponibles en el menú del restaurante.
- **Funcionalidades**:
  - Agregar, editar y eliminar platillos con detalles (nombre, descripción, precio, categoría).
  - Organización de platillos por categorías para facilitar la navegación.

### Gestión de Pedidos
- **Propósito**: Registrar, rastrear y almacenar los pedidos de los clientes, incluyendo un historial para consultas.
- **Funcionalidades**:
  - Toma de pedidos asociados a mesas o para llevar.
  - Rastreo del estado del pedido (pendiente, en preparación, servido, pagado).
  - Historial de pedidos para reportes y consultas.

### Punto de Venta
- **Propósito**: Procesar pagos y generar tickets para los clientes.
- **Funcionalidades**:
  - Procesamiento de pagos en efectivo y Bitcoin.
  - Generación e impresión de tickets para clientes y cocina.
  - Manejo de devoluciones o anulaciones.

### Gestión Financiera
- **Propósito**: Manejar las transacciones financieras del restaurante, incluyendo la retirada de fondos.
- **Funcionalidades**:
  - Registro de ingresos y egresos diarios.
  - Retirada de fondos desde la cartera de Lightning.
  - Generación de reportes financieros (ingresos por día o mes).

### Punto de Venta Web
- **Propósito**: Proporcionar una interfaz web para generar invoices de Lightning Network, permitiendo pagos en Bitcoin.
- **Funcionalidades**:
  - Conexión a cartera web de Lightning vía NWC en modo de solo lectura.
  - Generación de invoices para pagos en Bitcoin.
  - Visualización del estado de los pagos.
  - Integración con Gestión de Pedidos para asociar pagos a pedidos.
