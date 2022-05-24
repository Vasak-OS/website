---
Title: "JADE no es mas nuestra base"
tags: ["jade", "de", "manjaro", "desktop"]
date: "2022-04-04"
img: "https://github.com/Manjaro-WebDad/jde/raw/master/jade.jpg"
---

Durante el inicio de este proyecto se decidió realizar un Fork de JADE el escritorio desarrollado para Manjaro que utilizaba tecnologías web.
Sin embargo después de mucho trabajo sobre este Desktop, llegamos a la conclusión que sus limitaciones eran muy complejas de corregir y no iba acorde a la idea de proyecto final. Por lo cual se utilizó todo lo aprendido en ese momento para migrar a una nueva base propia.

### JADE ¿Un mal Desktop?

No, no y no. Simplemente el rumbo de este escritorio no era el mismo que Lynx buscaba posicionar. Por lo cual la independencia de una base es útil cuando la base misma y el proyecto en si no van dirigidos a lados similares.

## Nuevo rumbo

Como nuevo rumbo seguimos planeando el uso de las tecnologías webs, creemos que el poder aprovechar sus bondades en un escritorio nos permitirán obtener una experiencia de usuario más acorde a la que busca LynxOS.

{{< img src="https://github.com/neutralinojs/evaluation/raw/master/media/linux-apps.JPG">}}

También es una revolución en la forma de realizar aplicaciones “nativas” si podemos acercar la web a nuestro escritorio. También creemos que es mucho más extensible.

Por otro lado estamos haciendo pruebas para saber cual de las siguientes tecnologías vamos a estar utilizando.

|   | NWJS | Electron | NeutralinoJS |
|---|:---:|:---:|:---:|
| Build package | - | 51.53 MB | - |
| node_modules count | - | 147 | - |
| File count of project | 5 | 1539 | 11 |
| Project size | 1 KB | 136.4 MB | - |
| Application bundle | 97.2 MB | 128.6 MB | - |
| Application bundle (zipped) | 36.9 MB | 51.5 MB | - |
| Zipped SDK size | 95.8 MB | - | 1.1 MB |
| Memory consumption | ~ 40 - 42 MB | ~ 62 - 65 MB | ~ 8 - 9 MB |

