---
title: 'Estado Actual del Proyecto: "Core Backend Complete"'
description: 'El proyecto se encuentra en una fase de desarrollo activa, con una base sólida y funcional. Nuestro backend core está 100% completo.'
slug: estado-proyecto-v0-8
authors: [jordypirata, chekin, angel402]
tags: [desarrollo, backend, bitcoin, lightning-network, pos]
---

### **Estado Actual del Proyecto: Hito v0.8 - "Core Backend Complete"**

El proyecto se encuentra en una fase de desarrollo activa, con una base sólida y funcional. Nuestro backend core está 100% completo, sentando las bases para las funcionalidades futuras.

<!-- truncate -->

## **¿Qué está listo y funcional?**

Gracias a un desarrollo enfocado, hemos completado módulos esenciales que forman el corazón de Ambrosia-POS:

### **Sistema de Autenticación y Gestión de Usuarios**
Plataforma segura con autenticación mediante JWT y gestión de roles (administrador, supervisor, mesero) totalmente funcional.

### **Gestión de Mesas y Pedidos**
La lógica del backend para administrar mesas, tomar pedidos y rastrear su estado está implementada.

### **Punto de Venta (Backend)**
El sistema puede procesar órdenes y generar la lógica para los tickets de venta.

### **Gestión Financiera**
El backend para el registro de transacciones, corte de caja y generación de reportes financieros está completo.

### **Integración Nativa con Bitcoin/Lightning Network**
Hemos integrado con éxito **phoenixd** para procesar pagos en Lightning. El sistema ya cuenta con los endpoints necesarios para crear facturas (invoices) y verificar pagos, ofreciendo una alternativa de pago soberana y de bajo costo.

---

## **Módulos en Desarrollo y Próximos Pasos**

Somos transparentes sobre nuestro progreso. Los siguientes módulos y distribuciones son nuestra prioridad para alcanzar la versión 1.0:

### **Módulo de Inventario Completo**
Aunque los endpoints del backend están listos, el siguiente paso es conectar la interfaz de usuario para permitir una gestión completa de productos, insumos, proveedores y recetas con descuento automático de stock.

### **Punto de Venta Web con NWC**
Estamos trabajando en una interfaz web que permitirá generar invoices de Lightning a través de una conexión **Nostr Wallet Connect (NWC)** en modo de solo lectura. Esto facilitará los pagos en Bitcoin desde cualquier dispositivo.

### **Integración con Impresoras Térmicas**
Un sistema POS no está completo sin la capacidad de imprimir. El desarrollo del SDK y los controladores para la impresión física de tickets de cocina y cliente es un hito crítico.

### **Liberación de la Beta Pública**
Una vez se estabilicen las funcionalidades clave, lanzaremos una versión Beta para recibir retroalimentación de la comunidad y pulir la experiencia de usuario.

### **Instaladores Simplificados**
Para facilitar la adopción del sistema, estamos desarrollando:

- Un **script de instalación único para Linux** que automatizará todo el proceso de configuración.
- Un **instalador para Windows** que permitirá una implementación rápida y sencilla en los entornos más comunes.

---

## **¿Cómo puedes contribuir?**

¡Nos encanta la colaboración de la comunidad! Si quieres ser parte del futuro de los pagos con Bitcoin, puedes:

- **Revisar nuestro código** en [GitHub](https://github.com/btcgdl/Ambrosia-POS)
- **Reportar bugs** o sugerir mejoras
- **Contribuir con ideas** para nuevas funcionalidades
- **Probar la beta** cuando esté disponible

---

**¡Mantente conectado para más actualizaciones!**

Síguenos en nuestras redes sociales y únete a la comunidad de desarrolladores y empresarios que están construyendo el futuro de los pagos con Bitcoin.
