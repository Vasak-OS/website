---
title: "Errores y registros en el monitor"
description: "Dónde ver los errores de VasakOS: la pantalla Registros del monitor del sistema, con filtro por aplicación y la casilla «Sólo errores»."
weight: 40
---

Cuando algo no funciona, el primer lugar donde mirar es el **Monitor del sistema**. Además
del consumo y los servicios, es donde están **los registros, con los errores**.

## Abrir el monitor

Está en el menú como **Monitor del sistema** (el paquete es `vasak-monitor`) y tiene cinco
pantallas: **Recursos**, **Aplicaciones**, **Servicios**, **Limpieza** y **Registros**.

## Registros: dónde están los errores

La pantalla **Registros** muestra, de lo más nuevo a lo más viejo, los mensajes que las
aplicaciones y los servicios escriben en el diario del sistema: la hora local, quién lo
escribió y el mensaje.

### Elegir qué mirar

El selector **Aplicación** acota la lista de tres maneras:

- **Todo el ecosistema**: sólo las aplicaciones y los servicios de VasakOS. Es lo que se
  mira cuando algo del sistema se porta raro.
- **Una aplicación**, por ejemplo `vasak-keyring`. El catálogo trae el ecosistema entero
  aunque una aplicación todavía no haya escrito nada, para que no parezca que el monitor
  no la conoce.
- **Todo el sistema**: el diario completo, con todo lo que no es de VasakOS. Es lo último a
  lo que recurrir, porque son muchas líneas.

### Ver sólo los errores

La casilla **Sólo errores** deja las entradas de nivel error o peor: emergencia, alerta,
crítico y error. Es el primer filtro que conviene activar cuando se busca qué se rompió;
apagada, la lista muestra también los avisos.

Los programas que escriben su propio nivel —Wayfire, por ejemplo, que marca cada línea con
`EE`, `WW` o `II`— se respetan: una línea `EE` cuenta como error aunque el diario la tenga
como informativa.

### Buscar

El campo de búsqueda acota por texto el mensaje y el origen. Sirve para ir directo a un
servicio o a una palabra concreta.

### De dónde salen los mensajes

Los mensajes salen del **diario** de systemd, del arranque actual, tanto del sistema como de
la sesión del escritorio. Un servicio aparece con el nombre de su unidad
(`vasak-keyring.service`); una aplicación que abres desde el menú escribe en el diario de
la sesión. Si eliges una aplicación y la lista queda vacía, puede que no haya escrito nada
desde que encendiste el equipo.

## Servicios

La pantalla **Servicios** lista los servicios del sistema y deja **arrancar**, **detener** y
**reiniciar** cada uno. Una casilla limita la lista a los de VasakOS, y los que están en
fallo se marcan. Es el lugar para reiniciar un servicio que dejó de responder sin abrir una
terminal.

## Aplicaciones

La pantalla **Aplicaciones** agrupa los procesos de un mismo programa —un navegador son
diez— y los ordena por consumo, con los que tienen ventana primero. **Cerrar** le pide al
programa que se cierre y le da tiempo a guardar; no lo mata.

## Recursos y Limpieza

**Recursos** muestra procesador, memoria, swap, red y discos, con los últimos minutos.
**Limpieza** mide lo que se puede recuperar —cachés, papelera, paquetes, el diario viejo— y
lo libera cuando lo pides.

El monitor no se mide de más: sólo **Recursos** y **Aplicaciones** se actualizan solos;
**Servicios**, **Limpieza** y **Registros** se consultan al abrirlos. Y con la ventana tapada
no mide: sería el primero en su propia lista.

## Antes de reportar

Cuando algo falla y vas a [reportarlo](/docs/user/report-bugs/), los **Registros** son la
fuente: elige **Todo el ecosistema**, activa **Sólo errores** y copia los mensajes del
momento en que ocurrió.
