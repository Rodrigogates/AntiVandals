# AntiVandals (VAR.gg)
 
Consola de moderación antitrampas para torneos amateur de CS2, construida en 6 horas sobre Microsoft Power Platform durante la Hackathon Bizz Summit ES 2026 — 2º puesto. A partir de las estadísticas de cada partida calcula un índice de sospecha por reglas y genera un informe explicable con IA; la sanción la decide siempre un moderador humano.
 
## Cómo funciona
 
- Tras cada partida, un índice de sospecha (0–100) se calcula comparando las 3 partidas más recientes del jugador con sus 17 anteriores, puntuando headshot rate, antigüedad de la cuenta, K/D, ADR y multikills.
- Un semáforo (verde / ámbar / rojo) prioriza qué casos revisar primero.
- Un flujo de Power Automate con AI Builder (GPT-4.1-mini) genera un informe legible del caso para el moderador.
- La IA explica y recomienda, nunca falla el veredicto: la sanción la firma siempre una persona.
## Resultado
 
2º puesto en la Hackathon Bizz Summit ES 2026 (U-tad), reto de Microsoft Power Platform resuelto en 6 horas por un equipo de 7 personas. Mi responsabilidad fue liderar los flujos de detección e IA: el cálculo del índice de sospecha y la generación automática de informes.
 
## Estado actual
 
Exportado como solución no administrada de Power Platform (app de modelo-driven + Dataverse). Los flujos de Power Automate no están incluidos en este export, y la página generativa, que falló durante el evento, tiene un fix pendiente de verificar.
 
## Próximos pasos
 
- Incluir los flujos de Power Automate y el prompt en la solución exportada.
- Automatizar el lanzamiento de los flujos (hoy se ejecutan a mano).
- Implementar las acciones de "Contestar" y "Banear" sobre un caso.
- Limpiar las tablas y apps heredadas de la v1.
## Stack técnico
 
Microsoft Power Platform (Power Apps, Power Automate, Dataverse) · AI Builder (GPT-4.1-mini)
 
