# Solución VARgg

`VARgg/` contiene la solución **VARgg 1.0.0.1** (no administrada) exportada del entorno `sinosorganizamos`.

> Se ha **descomprimido tal cual** el `.zip` exportado, sin `pac solution unpack`. Por eso `customizations.xml` está entero en un solo archivo. Cuando se pueda, conviene sustituir esta carpeta por la salida de `pac solution unpack` (pasos abajo), que separa cada componente en su propio archivo y genera diffs más legibles.

## Qué contiene esta exportación

| Componente | Detalle |
|---|---|
| Tablas | Jugador (`cr5c8_jugador1`), Estadística de partida (`cr5c8_estadisticadepartida1`), Caso (`cr5c8_caso1`), con formularios y relaciones |
| Apps basadas en modelo | **ModeratorView** (con su mapa del sitio) y **Sistema de reportes de usuarios** (sobrante) |
| Agente de Copilot Studio | **Árbitro_VAR** (`bots/cr5c8_rbitro`, `botcomponents/`), con instrucciones en `botcomponents/cr5c8_rbitro.gpt.default/data` |
| Página generativa | **AntiVandals Moderación** (`uxagentprojects/…/page.tsx`), con datos de las 4 tablas v2 |
| Búsqueda en tablas | `dvtablesearchs/`, `dvtablesearchentities/` (conocimiento del agente) |

## Qué falta (y hay que añadir antes de reexportar)

- **Tabla Reporte (`cr5c8_reportejugador`).** No está en la solución, pero Caso, Jugador y ModeratorView dependen de ella (`MissingDependencies` en `solution.xml`). **Sin ella la importación en otro entorno falla.**
- **Flujos "Calcular indice" e "Informe VAR".** Siguen solo en la solución por defecto.
- **Prompt de AI Builder "Árbitro".** No aparece en la exportación (el texto está en [../prompts/arbitro.md](../prompts/arbitro.md)).
- **Mapa del sitio de "Sistema de reportes de usuarios"** (o quitar esa app de la solución, que no se usa).

## Cómo exportar de nuevo

1. [make.powerapps.com](https://make.powerapps.com) → entorno `sinosorganizamos` → **Soluciones** → abre **VARgg**.
2. **Agregar existente** → **Tabla** → *Reporte* (`cr5c8_reportejugador`).
3. **Agregar existente** → **Automatización** → **Flujo de nube** → *Calcular indice* e *Informe VAR*.
4. **Agregar existente** → **IA** → **Prompt de AI Builder** → *Árbitro*.
5. Quita la app "Sistema de reportes de usuarios" si no la quieres.
6. **Publicar todas las personalizaciones** y luego **Exportar** → *No administrada*. Sube la versión (por ejemplo 1.0.0.2).
7. Guarda el `.zip` **fuera del repo** o déjalo en `solution/`, que el `.gitignore` ignora los `.zip`.

## Cómo desempaquetar con pac

Requiere [Power Platform CLI](https://learn.microsoft.com/power-platform/developer/cli/introduction) (`winget install Microsoft.PowerAppsCLI` o la extensión de VS Code).

```powershell
cd C:\Users\rodri\Desktop\Repos\AntiVandals
# Borra la carpeta descomprimida a mano antes, para que no queden archivos viejos
Remove-Item -Recurse -Force solution\VARgg
pac solution unpack --zipfile ruta\a\VARgg_1_0_0_2.zip --folder solution\VARgg --packagetype Unmanaged --allowDelete --allowWrite
```

Para volver a generar el `.zip` desde la carpeta:

```powershell
pac solution pack --zipfile VARgg.zip --folder solution\VARgg --packagetype Unmanaged
```
