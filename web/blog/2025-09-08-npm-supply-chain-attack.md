---
title: 'Análisis de Seguridad'
authors: jordypirata
tags: [seguridad, npm, javascript, supply-chain]
date: 2025-09-08
---
## Ataque a la Cadena de Suministro en NPM y su Impacto en Ambrosia
Recientemente, la comunidad de JavaScript ha estado en alerta por un ataque a la cadena de suministro (supply-chain attack) que ha afectado a docenas de paquetes populares en el registro de NPM.

El ataque se originó cuando la cuenta de NPM del desarrollador `qix` fue comprometida, lo que permitió la publicación de versiones maliciosas de paquetes fundamentales como `chalk`, `strip-ansi`, y `color-convert`.

<!--truncate-->

## Resumen del Incidente

*   **¿Qué pasó?** Un atacante obtuvo acceso a una cuenta de desarrollador de NPM con alta reputación y publicó versiones maliciosas de docenas de paquetes.
*   **¿Cuál fue el impacto?** Los paquetes afectados suman más de mil millones de descargas semanales, representando un riesgo significativo para todo el ecosistema de JavaScript.
*   **¿Qué hace el malware?** El código malicioso es un "crypto-clipper". Su objetivo es robar criptomonedas interceptando y modificando transacciones. Reemplaza las direcciones de las billeteras de los usuarios por las de los atacantes de forma sigilosa.
*   **¿Cómo funciona?** El malware utiliza dos vectores de ataque:
    1.  **Intercambio Pasivo de Direcciones:** Si no detecta una billetera de criptomonedas, modifica las funciones `fetch` y `XMLHttpRequest` del navegador para interceptar todas las peticiones de red. Usando el algoritmo de distancia de Levenshtein, busca una dirección de billetera del atacante que sea visualmente similar a la del usuario para que el cambio sea difícil de detectar.
    2.  **Secuestro Activo de Transacciones:** Si detecta una billetera como MetaMask, parchea sus métodos de comunicación. Cuando el usuario va a firmar una transacción, el malware la modifica en memoria, cambiando la dirección del destinatario por la del atacante. Si el usuario no revisa meticulosamente, aprobará el envío de fondos al atacante.

## Código Ofuscado: Una Señal de Alerta

El código malicioso estaba ofuscado para dificultar su análisis, pero contenía funciones con nombres sospechosos como `checkethereumw`.

```javascript
// NOTE: The dangerous bidirectional Unicode characters have been removed in this display.
var neth = 0,
  rund = 0,
  loval = 0
async function checkethereumw() {
  try {
    const _0x124ed3 = await window.ethereum.request({ method: 'eth_accounts' })
    _0x124ed3.length > 0
      ? (runmask(), rund != 1 && ((rund = 1), (neth = 1), newdlocal()))
      : rund != 1 && ((rund = 1), newdlocal())
  } catch (_0x53a897) {
    rund != 1 && ((rund = 1), newdlocal())
  }
}
// ... resto del código malicioso (saneado)
```
*El código original contenía caracteres Unicode bidireccionales para ofuscar aún más su intención, una técnica conocida como "Trojan Source".*

## Impacto en Ambrosia POS: Análisis y Conclusión

Al enterarnos de este incidente, el equipo de Ambrosia realizó una auditoría de seguridad inmediata de nuestras dependencias para determinar si nuestro proyecto había sido vulnerado.

Nuestra investigación confirmó que Ambrosia POS, a través de dependencias de la interfaz de usuario, utiliza tres de los paquetes mencionados en las alertas de seguridad: `simple-swizzle`, `color-name` y `color-convert`.

Afortunadamente, podemos confirmar lo siguiente:

1.  **Versiones No Vulneradas:** Las versiones de estos paquetes utilizadas en nuestro proyecto **no son las versiones comprometidas**.
    *   `simple-swizzle`: Usamos la versión `0.2.2`. La versión maliciosa era la `0.2.3`.
    *   `color-name`: Usamos la versión `1.1.4`. La versión maliciosa era la `2.0.1`.
    *   `color-convert`: Usamos la versión `2.0.1`. La versión maliciosa era la `3.1.1`.

2.  **Paquetes Eliminados:** El equipo de seguridad de NPM actuó rápidamente y, en colaboración con los mantenedores, eliminó las versiones maliciosas del registro.

**En conclusión, el proyecto Ambrosia POS no se ha visto afectado por este ataque a la cadena de suministro. No se requiere ninguna acción por parte de los desarrolladores ni de los usuarios.**

Este incidente subraya la importancia de la vigilancia constante en el ecosistema de código abierto. Seguiremos aplicando las mejores prácticas de seguridad para proteger la integridad de nuestro software.

## Más Información

Para un análisis técnico detallado del ataque, puedes consultar el post de [Aikido Security](https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised).
