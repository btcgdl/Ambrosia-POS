# Sistema de Punto de Venta para Restaurantes

## Descripción General

El sistema descrito es una aplicación de punto de venta (POS) para restaurantes.
El frontend del sistema utiliza **React** y **Electron** para proporcionar una experiencia moderna y reactiva en entornos de escritorio. Además, el backend está desarrollado en Kotlin con soporte para **Gradle** como herramienta de construcción.

Este sistema está diseñado para optimizar las operaciones diarias de un restaurante, como la gestión de pedidos, mesas, inventario y finanzas, con una interfaz moderna y reactiva. A continuación, se detallan los módulos del sistema, considerando las características solicitadas: inicio de sesión, selección de mesas, historial de pedidos, gestión de usuarios y asignación de permisos, gestión de inventario (incluyendo productos, insumos, proveedores y recetas), creación de platillos, impresión de tickets, retirada de fondos, corte de caja y soporte para pagos en Bitcoin mediante **Lightning Network**.

## Módulos Principales

### Autenticación
- **Propósito**: Gestionar el acceso seguro de los usuarios al sistema mediante autenticación y manejo de sesiones.
- **Funcionalidades**:
  - Pantalla de inicio de sesión con credenciales (nombre de usuario y contraseña).
  - Soporte para diferentes roles de usuario (administrador, supervisor, mesero).
  - Gestión de sesiones activas y opciones de cierre de sesión.

### Gestión de Usuarios
- **Propósito**: Administrar las cuentas de los empleados y asignar roles a los usuarios.
- **Funcionalidades**:
  - Crear, editar y eliminar cuentas de usuario.
  - Asignar roles y permisos específicos (por ejemplo, acceso a gestión de menús, gestión de inventario o retirada de fondos).
  - **Roles de Usuario**:
    - Administrador
    - Supervisor
    - Mesero

### Gestión de Mesas
- **Propósito**: Gestionar las mesas del restaurante, su estado y asignación.
- **Funcionalidades**:
  - Visualización del plano del restaurante con estados de mesas (disponible, ocupada).
  - Asignación de mesas a pedidos y actualización en tiempo real.
  - Interfaz visual para selección rápida de mesas.

### Gestión de Inventario
- **Propósito**: Administrar los productos, insumos y proveedores del restaurante, así como el control de stock.
- **Funcionalidades**:
  - **Control de Inventarios**: Registrar entradas y salidas de productos e insumos. Seguimiento de niveles de stock.
  - **Productos**: Gestionar el inventario de productos terminados o de reventa.
  - **Presentaciones de Insumos**: Definir y gestionar las unidades de medida (presentaciones) para los diferentes ingredientes y materiales (ej. gramos, kilos, litros, unidades).
  - **Proveedores del Inventario**: Registrar y gestionar la información de los proveedores de productos e insumos.
  - **Recetas**: Definir las recetas para los platillos, especificando los insumos necesarios y sus cantidades.
    - **Generación de Recetas descontando del inventario**: Al vender un platillo, el sistema descuenta automáticamente los insumos correspondientes del inventario según su receta.

### Gestión de Menús
- **Propósito**: Administrar los platillos disponibles en el menú del restaurante.
- **Funcionalidades**:
  - Agregar, editar y eliminar platillos con detalles (nombre, descripción, precio, categoría).
  - Asociación de platillos con recetas definidas en la Gestión de Inventario.
  - Organización de platillos por categorías para facilitar la navegación.

### Gestión de Pedidos
- **Propósito**: Registrar, rastrear y almacenar los pedidos de los clientes, incluyendo un historial para consultas.
- **Funcionalidades**:
  - Toma de pedidos asociados a mesas o para llevar.
  - Adición de platillos del menú a los pedidos, vinculando con las recetas.
  - Rastreo del estado del pedido (pendiente, en preparación, servido, pagado).
  - Historial de pedidos para reportes y consultas.

### Punto de Venta
- **Propósito**: Procesar pagos y generar tickets para los clientes.
- **Funcionalidades**:
  - Procesamiento de pagos en efectivo y Bitcoin.
  - Generación e impresión de tickets para clientes y cocina.
  - Manejo de devoluciones o anulaciones.
  - **Integración con caja física**: Apertura y cierre de la caja registradora física controlada por el sistema.

### Gestión Financiera
- **Propósito**: Manejar las transacciones financieras del restaurante, incluyendo la retirada de fondos y el cierre de caja.
- **Funcionalidades**:
  - Registro de ingresos y egresos diarios.
  - Retirada de fondos desde la cartera de Lightning.
  - **Corte de caja**: Proceso de cierre de turno o día, registrando el total de ventas, efectivo en caja, transacciones con tarjeta y otras formas de pago, para verificar y cuadrar los montos.
  - Generación de reportes financieros (ingresos por día o mes, reporte de corte de caja).

### Punto de Venta Web
- **Propósito**: Proporcionar una interfaz web para generar invoices de Lightning Network, permitiendo pagos en Bitcoin.
- **Funcionalidades**:
  - Conexión a cartera web de Lightning vía NWC en modo de solo lectura.
  - Generación de invoices para pagos en Bitcoin.
  - Visualización del estado de los pagos.
  - Integración con Gestión de Pedidos para asociar pagos a pedidos.