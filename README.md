# VAR.gg · AntiVandals

Consola de moderación anti-trampas para torneos de **Counter-Strike 2**, construida en **Power Platform** durante la **Hackathon BizzSummit 2026** (2 de octubre de 2026).

> **Resultado: 2º puesto.** Al jurado le encantó el pitch. Además, el responsable de la base de datos se fue a mitad del evento y el equipo dedicó unas 4 horas a rescatar el modelo de datos.

**Idea central:** después de cada partida, un **índice de sospecha** calculado con reglas sobre las estadísticas del jugador, y un **informe de IA** que explica el patrón al moderador. La IA explica y recomienda; **la decisión siempre la toma un humano**.

---

## Estructura del repositorio

| Carpeta | Contenido |
|---|---|
| `solution/` | Solución de Power Platform **VARgg 1.0.0.1** (no administrada) descomprimida, y los pasos para exportarla y desempaquetarla |
| `data/` | CSV de demostración (jugadores y estadísticas de partida) |
| `prompts/` | Prompt del informe "Árbitro" |
| `docs/` | Presentación y memoria final |

---

## Arquitectura

```
Estadísticas de partida (Dataverse)
        │
        ▼
Flujo "Calcular indice"  ──►  Jugador: índice de sospecha + motivos
        │
        ▼
Flujo "Informe VAR"  ──►  Prompt de AI Builder "Árbitro" (gpt-4.1-mini)  ──►  Caso con informe de IA
        │
        ▼
App ModeratorView (basada en modelo)  ──►  el moderador revisa y decide la sanción
```

- **Plataforma:** Power Platform, entorno `sinosorganizamos`, prefijo de publicador `cr5c8_`.
- **IA:** prompt de AI Builder en lugar de Azure OpenAI (por coste). Avisos por correo en lugar de Teams.
- **Agente conversacional:** agente de Copilot Studio "Árbitro_VAR" (`cr5c8_rbitro`), conectado a las tablas, para preguntas del moderador.

### Tablas de Dataverse (modelo v2)

| Tabla | Nombre interno | Contenido |
|---|---|---|
| Jugador | `cr5c8_jugador1` | nickname, nivel, ELO, país, fecha_alta, estado (Limpio / En revisión / Sancionado), índice de sospecha, motivos, pantalla_url |
| Estadística de partida | `cr5c8_estadisticadepartida1` | kills, deaths, HS%, K/D, ADR, multikills, mapa; enlazada a Jugador |
| Caso | `cr5c8_caso1` | índice, patrón, confianza, recomendación, informe_ia (4000 caracteres), estado y sanción |
| Reporte | `cr5c8_reportejugador` | reportero, jugador reportado, categoría, gravedad, descripción, captura, clip, revisado, decisión, respuesta y enlace a Caso |

Las tablas de la v1 siguen en el entorno renombradas como "(v1 obsoleta)". No se pudieron borrar porque las bloquean configuraciones de Copilot (AI Skill Config) y un perfil offline.

### Regla del índice de sospecha (máximo 100)

Se comparan las **3 partidas recientes** con las **17 anteriores** (base).

| Señal | Puntos | Condición |
|---|---|---|
| HS | 35 | HS reciente − HS base ≥ 20, **o** cuenta de menos de 90 días con HS reciente ≥ 65 |
| Cuenta nueva | 20 | Menos de 90 días |
| K/D | 20 | K/D reciente / K/D base ≥ 1,5, **o** K/D reciente ≥ 2,0 |
| ADR | 15 | ADR reciente / ADR base ≥ 1,4, **o** ADR reciente ≥ 120 |
| Multikills | 10 | Quads + ases en las 3 últimas ≥ 3 |

**Semáforo:** 60 o más rojo · de 1 a 59 ámbar · 0 verde.

### Flujos de Power Automate

Se ejecutan **a mano y en este orden**, porque el informe usa el índice ya guardado:

1. **Calcular indice** (entrada: `jugador_id`). Aplica la regla, protegida contra divisiones entre cero y valores vacíos, y guarda en el Jugador el índice y los motivos (`HS | K/D | …`).
2. **Informe VAR** (entrada: `jugador_id`). Reúne perfil, medias y últimas 3 partidas, llama al prompt "Árbitro" ([prompts/arbitro.md](prompts/arbitro.md)) y crea un Caso con titular, patrón, confianza, recomendación, informe y evidencias.

> ⚠️ Los flujos están solo en la solución por defecto del entorno y **no van en esta exportación**. Ver [solution/README.md](solution/README.md).

### Interfaz

- **App ModeratorView** (basada en modelo): AntiVandals Moderación, Jugadores, Reportes, Casos y Partidas. Vistas por gravedad y por índice; el formulario de Caso muestra sus reportes.
- **Página generativa "AntiVandals Moderación"** (tema oscuro, pestañas Pantallas, Jugadores y Reportes). Durante el evento quedó rota con el error `PantallasTab is not defined`; el código de la exportación ya define ese componente, pero no se ha comprobado que funcione.

---

## Cómo importar la solución

1. Comprime el **contenido** de `solution/VARgg/` en un `.zip` (con `solution.xml` en la raíz), o empaquétalo con `pac solution pack` (ver [solution/README.md](solution/README.md)).
2. En [make.powerapps.com](https://make.powerapps.com) elige el entorno de destino → **Soluciones** → **Importar solución** → selecciona el `.zip`.
3. Antes de importar, crea en el destino lo que falta en esta exportación (sobre todo la tabla `cr5c8_reportejugador`), o la importación fallará por dependencias.
4. Después, crea o importa el prompt "Árbitro" y los dos flujos, y carga los CSV de `data/`.

---

## Equipo

Equipo de 7 personas:

- **Frontend** (pareja): app y pantallas.
- **Estadística** (pareja): regla del índice, validación de datos y números del pitch.
- **Programador 1:** modelo de datos y carga en Dataverse.
- **Programador 2 (Rodrigo):** flujos de detección e informe de IA.
- **Programador 3:** agente y entrega.

---

## Lecciones aprendidas

- **Un solo modelo de datos.** Tener la v1 y la v2 en paralelo causó la mayoría de errores de enlace.
- **No depender de una sola persona para los datos.** Cuando se fue el responsable, hubo que rescatar el modelo en plena hackathon.
- **Validar contra un cálculo manual.** Así apareció que el HS% estaba en escala 0–1 y la condición de HS no se cumplía nunca.
- **Páginas generativas:** el agente falla con prompts largos y, con prompts cortos, puede borrar partes de la página. Conviene guardar copias.
- **Diseño responsable:** la IA explica y recomienda, el moderador decide. El prompt prohíbe afirmar que alguien hace trampas.

## Pendiente

- Meter los flujos y el prompt en la solución VARgg y volver a exportar.
- Lanzar los flujos automáticamente al entrar una partida nueva.
- En la página: implementar "Contestar" y que "Banear" cambie el estado del jugador.
- Borrar la v1, las apps sobrantes ("Vista de moderador", "Sistema de reportes de usuarios") y el jugador vacío "mmm".
