---
title: 'Estado Actual del Proyecto'
description: 'El proyecto se encuentra en una fase de desarrollo activa, con una base sólida y funcional. Nuestro backend core está 100% completo.'
slug: estado-proyecto-v0-8
authors: [jordypirata, chekin, angel402]
tags: [desarrollo, backend, bitcoin, lightning-network, pos]
---

# 🚀 Core Backend Complete

<div class="alert alert--success">
  <strong>¡Excelentes noticias!</strong> El proyecto se encuentra en una fase de desarrollo activa, con una base sólida y funcional. Nuestro backend core está 100% completo, sentando las bases para las funcionalidades futuras.
</div>

<!-- truncate -->

## ¿Qué está listo y funcional?

Gracias a un desarrollo enfocado, hemos completado módulos esenciales que forman el corazón de Ambrosia-POS:

<div class="row">
  <div class="col col--6">

### 🔐 Sistema de Autenticación y Gestión de Usuarios
Plataforma segura con autenticación mediante JWT y gestión de roles (administrador, supervisor, mesero) totalmente funcional.

### 🍽️ Gestión de Mesas y Pedidos
La lógica del backend para administrar mesas, tomar pedidos y rastrear su estado está implementada.

  </div>
  <div class="col col--6">

### 💰 Punto de Venta (Backend)
El sistema puede procesar órdenes y generar la lógica para los tickets de venta.

### 📊 Gestión Financiera
El backend para el registro de transacciones, corte de caja y generación de reportes financieros está completo.

  </div>
</div>

:::tip Integración Nativa con Bitcoin/Lightning Network
Hemos integrado con éxito **phoenixd** para procesar pagos en Lightning. El sistema ya cuenta con los endpoints necesarios para crear facturas (invoices) y verificar pagos, ofreciendo una alternativa de pago soberana y de bajo costo.
:::

---

## Módulos en Desarrollo y Próximos Pasos

<div class="alert alert--info">
  <strong>Transparencia total:</strong> Somos transparentes sobre nuestro progreso. Los siguientes módulos y distribuciones son nuestra prioridad para alcanzar la versión 1.0:
</div>

### 📦 Módulo de Inventario Completo
Aunque los endpoints del backend están listos, el siguiente paso es conectar la interfaz de usuario para permitir una gestión completa de productos, insumos, proveedores y recetas con descuento automático de stock.

### 🌐 Punto de Venta Web con NWC
Estamos trabajando en una interfaz web que permitirá generar invoices de Lightning a través de una conexión **Nostr Wallet Connect (NWC)** en modo de solo lectura. Esto facilitará los pagos en Bitcoin desde cualquier dispositivo.

### 🖨️ Integración con Impresoras Térmicas
Un sistema POS no está completo sin la capacidad de imprimir. El desarrollo del SDK y los controladores para la impresión física de tickets de cocina y cliente es un hito crítico.

### 🧪 Liberación de la Beta Pública
Una vez se estabilicen las funcionalidades clave, lanzaremos una versión Beta para recibir retroalimentación de la comunidad y pulir la experiencia de usuario.

### 📥 Instaladores Simplificados
Para facilitar la adopción del sistema, estamos desarrollando:

<div class="row">
  <div class="col col--6">
    <div class="card">
      <div class="card__header">
        <h4>🐧 Linux</h4>
      </div>
      <div class="card__body">
        <p>Un <strong>script de instalación único para Linux</strong> que automatizará todo el proceso de configuración.</p>
      </div>
    </div>
  </div>
  <div class="col col--6">
    <div class="card">
      <div class="card__header">
        <h4>🪟 Windows</h4>
      </div>
      <div class="card__body">
        <p>Un <strong>instalador para Windows</strong> que permitirá una implementación rápida y sencilla en los entornos más comunes.</p>
      </div>
    </div>
  </div>
</div>

---

## ¿Cómo puedes contribuir?

<div class="alert alert--warning">
  <strong>¡Nos encanta la colaboración de la comunidad!</strong> Si quieres ser parte del futuro de los pagos con Bitcoin, puedes:
</div>

<div class="row margin-top--lg">
  <div class="col col--3">
    <div class="text--center">
      <h4>👨‍💻 Revisar Código</h4>
      <p><strong>Revisar nuestro código</strong> en <a href="https://github.com/btcgdl/Ambrosia-POS">GitHub</a></p>
    </div>
  </div>
  <div class="col col--3">
    <div class="text--center">
      <h4>🐛 Reportar Bugs</h4>
      <p><strong>Reportar bugs</strong> o sugerir mejoras</p>
    </div>
  </div>
  <div class="col col--3">
    <div class="text--center">
      <h4>💡 Contribuir Ideas</h4>
      <p><strong>Contribuir con ideas</strong> para nuevas funcionalidades</p>
    </div>
  </div>
  <div class="col col--3">
    <div class="text--center">
      <h4>🧪 Probar Beta</h4>
      <p><strong>Probar la beta</strong> cuando esté disponible</p>
    </div>
  </div>
</div>

---

<div class="text--center">
  <h2>🌟 ¡Mantente conectado para más actualizaciones!</h2>
  <p><em>Síguenos en nuestras redes sociales y únete a la comunidad de desarrolladores y empresarios que están construyendo el futuro de los pagos con Bitcoin.</em></p>
</div>
