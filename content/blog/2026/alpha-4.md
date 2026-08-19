---
Title: "Alpha 4 de VasakOS"
tags: [release, alpha, vasakos, vasak-desktop, wayland, novedades]
date: "2026-08-19"
img: "https://i.postimg.cc/c18gdn1B/image.png"
---

Llega el Alpha 4, y es la actualización más grande que publicamos hasta ahora. No es una lista de retoques: buena parte del escritorio dejó de depender de piezas prestadas de otros entornos y pasó a tener las suyas —llavero, permisos, notificaciones, pantalla de inicio y de bloqueo—, todas dibujadas con los mismos colores, el mismo radio de esquina y la misma tipografía que elegiste vos.

> Sigue siendo Alpha: se instala, se usa todos los días, y vas a encontrar cosas incompletas. Los reportes son bienvenidos y son, literalmente, de dónde salió buena parte de esta lista.

## Lo primero que vas a notar

Las notificaciones ahora hacen lo que prometen. Tocar una notificación que ofrece abrir algo —un mensaje, una descarga, una página— abre eso. Antes el cartel simplemente se iba: la acción existía, viajaba por el sistema y no la ejecutaba nadie.

La bandeja del sistema funciona de verdad. Los iconos aparecen, responden al clic, tienen su menú con el clic derecho, se ven nítidos y con los colores correctos. Varias aplicaciones directamente no mostraban su icono o no abrían su menú.

El escritorio está traducido y arranca en el idioma del sistema, igual que la terminal, el gestor de archivos, la galería y Configuración. El menú de aplicaciones muestra cada programa con su nombre en tu idioma, y la búsqueda ya encuentra escribiendo con mayúsculas.

Varios monitores. Conectar, desconectar o cambiar un monitor rehace los escritorios y el panel sin reiniciar la sesión, y el monitor principal se lo pregunta al sistema en vez de adivinarlo. La pantalla de inicio de sesión también funciona con varios monitores.

El panel dejó de mentir: el indicador de batería se actualiza, el icono de red muestra Wi-Fi cuando estás en Wi-Fi, la lista de redes entra en la pantalla y los controles de música responden al reproductor.

## Ya podés instalarlo

La ISO trae Calamares, así que VasakOS se instala de forma persistente en el disco. El teclado que elegís durante la instalación ahora llega al escritorio —antes la sesión arrancaba siempre en teclado de EE.UU.— y el arranque de sesión quedó administrado por systemd, que es lo que permite que los servicios del escritorio se levanten y se apaguen ordenadamente.

## Tu sesión, de principio a fin

- La pantalla de bloqueo es la misma que la de inicio de sesión, con tu fondo de pantalla detrás. Antes, bloquear con Super+L daba una pantalla gris distinta a la que aparecía al volver de la suspensión.
- La sesión elegida se recuerda por cuenta, y cada cuenta muestra su nombre real en vez de «User».
- El llavero se abre solo al iniciar sesión. Tu contraseña de acceso lo desbloquea a través de PAM, sin pedirte nada dos veces.
- Cerrar sesión cierra la sesión completa, sin dejar procesos dando vueltas.

## Aplicaciones nuevas

* **Permisos.** Las aplicaciones ahora te piden permiso antes de usar tus cuentas en línea, con un cartel que es del escritorio y no el genérico del portal. Lo que decidís queda fuera del alcance de los programas que corren como vos.
* **Llavero.** VasakOS tiene su propio llavero cifrado (AES-256-GCM/Argon2id) que habla el protocolo estándar de Linux, así que las aplicaciones que guardan contraseñas funcionan sin instalar el de GNOME ni el de KDE. Se desbloquea al iniciar sesión, y si algo lo encuentra cerrado, te lo pide con un diálogo del sistema.
* **Cuentas en línea.** Un servicio que guarda los tokens de tus cuentas en el llavero y los entrega de a uno, preguntándote antes. Ninguna aplicación se queda con una copia.
* **Teléfono Android.** Enchufás el celular y sus aplicaciones se abren como ventanas del escritorio, con un menú propio en el panel y una tarjeta de estado en el centro de notificaciones. El teléfono se detecta al conectarlo, y mientras no haya ninguno el servicio no consume nada.
* **Acentos manteniendo la tecla.** Como en macOS: sostenés la a y aparecen á, à, â, ä… para elegir con un número o con el mouse. Escribe la variante que elijas sin depender de que tu distribución de teclado la tenga, así que funciona igual en un teclado latinoamericano que en uno inglés.
* **Notificaciones.** El servidor de notificaciones del sistema es propio: guarda el historial, agrupa por aplicación y muestra los carteles con el tema del escritorio.

## Configuración creció mucho

Secciones nuevas: Usuarios (crear, borrar, renombrar, contraseñas y permisos de administrador), Fecha y hora, Brillo y luz nocturna, Monitores, Escritorios, Ventanas, Efectos, Autoinicio, Idioma y teclado, Teléfonos y Privacidad y seguridad.

Dos cambios que valen aparte:

- Ya se puede cambiar la distribución del teclado. No se podía, y tampoco se podía tocar nada que viviera en la configuración de Wayfire: un solo byte inválido en ese archivo hacía que la aplicación se negara a leerlo entero. Además, las variantes que se ofrecían eran las de las 99 distribuciones juntas, así que era fácil elegir una que no existe para la tuya y quedarte sin cambio alguno, sin ningún aviso.
- Cada interruptor de Privacidad dice si realmente bloquea algo. Un control que parece protección y no lo es, es peor que no tener control.

Y el bloqueo por inactividad se configura desde Energía: minutos hasta bloquear, apagado de pantalla y bloqueo al suspender. Antes vivía escondido en una línea de un archivo de texto.

## Las aplicaciones del sistema

![](https://i.postimg.cc/vHNNfCFv/image.png)

* **Archivos.** Copiar, mover y eliminar muestran progreso y se pueden cancelar —incluso en medio de una carpeta grande—, hay un centro de tareas en la barra superior, Ctrl+Z deshace copiar, mover, renombrar, crear, comprimir y enviar a la papelera, y podés comprimir una selección en zip, tar.gz, tar.xz, tar.bz2, tar o 7z. El arrastrar y soltar ahora es el nativo de Wayland.
* **Terminal.** Modo overlay, control del tamaño de letra, y se terminaron los cierres inesperados al recibir acentos o emoji.
* **Música.** Listas de reproducción, controles para las radios, y reproducir un disco largo dejó de reservar más de 1 GB de memoria: ahora se transmite a medida que suena.
* **Galería.** Las fotos se ordenan por su fecha real de captura (EXIF), no por la fecha del archivo, que cambia al copiarlas.

## Claves SSH

Si usás claves SSH con frase de contraseña, ahora la escribís una sola vez: el sistema levanta el agente al iniciar sesión y guarda la frase en el llavero, que ya se desbloquea con tu inicio de sesión. Ni git push ni ninguna aplicación gráfica vuelven a pedírtela.

## Seguridad

- La autenticación de las tareas administrativas se hacía en un proceso sin privilegios; ahora la valida quien corresponde.
- El canal cifrado entre las aplicaciones y el llavero estaba mal construido y se rehízo.
- La contraseña de las conexiones SMB viajaba en la línea de comandos, visible para cualquier usuario del equipo. Las conexiones sshfs no verificaban la clave del servidor.
- El control remoto del reproductor de música escuchaba sin autenticación.
- Después de tres contraseñas equivocadas, el llavero deja de contestar por un rato.
- Todos los paquetes se verifican antes de publicarse: se comprueba que corran en cualquier procesador de 64 bits, y no sólo en la máquina que los compiló.

## Más liviano

El escritorio consume bastante menos que en el Alpha 3. Entre otras cosas: el menú abre al instante, el deslizador de volumen dejó de congelar el panel, la salida del terminal ya no se consulta 60 veces por segundo, el reloj despierta una vez por minuto, los registros dejaron de escribirse a disco línea por línea, y los plugins del compositor que no usás se pueden apagar. La portada del sitio, de paso, pasó de 3,9 MB a unos 200 KB.

## ¿Dónde la consigo?

En el [área de descargas](/downloads). El detalle completo, cambio por cambio y paquete por paquete, está en el [changelog oficial](/changelogs/14062026/).

## ¿Dónde reporto errores?

En [el grupo de Telegram](https://t.me/VasakOS) o directamente en los repositorios de [GitHub](https://github.com/Vasak-OS). Contar qué no funciona, en qué máquina y qué esperabas que pasara es la forma más concreta de empujar el proyecto: casi todo lo que arreglamos en este ciclo salió de ahí.