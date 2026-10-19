# Datos de demostración

| Archivo | Filas | Contenido |
|---|---|---|
| `jugadores.csv` | 10 | `player_id, nickname, nivel, elo, pais, fecha_alta, indice_sospecha, estado, motivos, origen` |
| `estadisticas_partidas.csv` | 200 | `player_id, nickname, match_id, mapa, fecha, kills, deaths, assists, headshots, hs_pct, kd, kr, adr, mvps, triple_kills, quadro_kills, penta_kills, multikills, resultado, sospechosa` |

Codificación UTF-8 con BOM. `hs_pct` está en **porcentaje (0–100)**, que es la escala que usa la regla del índice.

> ⚠️ Son los CSV que se prepararon **antes del evento** (jugadores simulados como NovaPeak o Txuri_Gorri). La demo final usó otros 10 jugadores cargados directamente en Dataverse (ShadowFox, xX_Headhunter_Xx, Nov, Jav, Kira…), con unas 174 partidas, 13 reportes y 4 casos con informe de IA. Si se exportan esas tablas desde Dataverse, conviene sustituir estos archivos.
