import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Text,
  Input,
  Divider,
  Dropdown,
  Option,
  Tag,
  ProgressBar,
} from "@fluentui/react-components";
import {
  SearchRegular,
  ArrowClockwiseRegular,
  DismissRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  AddRegular,
} from "@fluentui/react-icons";
import type {
  GeneratedComponentProps,
  cr5c8_jugador1,
  cr5c8_reportejugador,
  ReadableTableRow,
  WritableTableRow,
} from "./RuntimeTypes";

// --- Localization Setup ---
const langMap: Record<number, { code: string; name: string; isRtl: boolean }> = {
  3082: { code: "es-ES", name: "Español (España)", isRtl: false },
  1033: { code: "en-US", name: "English (United States)", isRtl: false },
};
const translations: Record<string, Record<string, string>> = {
  "es-ES": {
    pantallas: "Pantallas",
    jugadores: "Jugadores",
    reportes: "Reportes",
    todos: "Todos",
    limpio: "Limpio",
    enRevision: "En revisión",
    sancionado: "Sancionado",
    buscar: "Buscar...",
    filtroEstado: "Estado",
    indice: "Índice",
    nivel: "Nivel",
    elo: "ELO",
    pais: "País",
    estado: "Estado",
    motivos: "Motivos",
    cerrar: "Cerrar",
    actualizarAhora: "Actualizar ahora",
    ultimaActualizacion: "Última actualización",
    noJugadores: "No hay jugadores todavía",
    noReportes: "No hay reportes todavía",
    agregarJugador: "Agregar jugador",
    exitoAgregar: "Jugador agregado correctamente.",
    exitoBorrar: "Jugador borrado correctamente.",
    errorAgregar: "Error al agregar jugador.",
    errorBorrar: "Error al borrar jugador.",
    campoObligatorio: "Campo obligatorio",
    id: "ID",
    player_id: "Player ID",
    fecha_alta: "Fecha de alta",
    indiceSospecha: "Índice de sospecha",
    nivelLabel: "Nivel",
    eloLabel: "ELO",
    paisLabel: "País",
    estadoLabel: "Estado",
    motivosLabel: "Motivos",
    barraIndiceLabel: "Índice de sospecha",
    sinNickname: "Sin nickname",
    sinNivel: "Sin nivel",
    sinELO: "Sin ELO",
    sinPais: "Sin país",
    sinEstado: "Sin estado",
    sinMotivos: "Sin motivos",
    sinJugador: "Selecciona un jugador",
    antiguedad: "Antigüedad",
    dias: "días",
    limpiar: "Limpiar",
    semaforoVerde: "Limpio",
    semaforoAmbar: "Sospecha media",
    semaforoRojo: "Sospecha alta",
    logo: "AntiVandals",
    actualizar: "Actualizar",
    media: "Media",
    motivoNoDisponible: "Motivo no disponible",
    sinJugadorSeleccionado: "Selecciona un jugador",
    ultimaActualizacionLabel: "Última actualización",
    playerId: "Player ID",
    indiceSospechaLabel: "Índice de sospecha",
    limpiarCampos: "Limpiar campos",
    agregar: "Agregar",
    cancelar: "Cancelar",
    obligatorio: "Obligatorio",
    exito: "Éxito",
    error: "Error",
    confirmacion: "Confirmación",
    fechaAltaPlaceholder: "Fecha de alta (YYYY-MM-DD)",
    nivelPlaceholder: "Nivel (número)",
    eloPlaceholder: "ELO (opcional)",
    indiceSospechaPlaceholder: "Índice de sospecha (0-100)",
    motivosPlaceholder: "Motivos (separados por | )",
    paisPlaceholder: "País",
    nicknamePlaceholder: "Nickname",
    estadoPlaceholder: "Estado",
    playerIdPlaceholder: "Player ID",
    errorCamposObligatorios: "Por favor, rellena todos los campos obligatorios.",
    errorFormatoFecha: "Formato de fecha inválido.",
    errorFormatoNumero: "Debe ser un número válido.",
    pendientes: "Pendientes",
    categoria: "Categoría",
    gravedad: "Gravedad",
    descripcion: "Descripción",
    reportero: "Reportero",
    jugadorReportado: "Jugador reportado",
    captura: "Captura",
    clip: "Clip",
    ignorar: "Ignorar",
    avisar: "Avisar",
    banear: "Banear",
    revisado: "Revisado",
    revisadoOk: "Reporte marcado como revisado.",
    errorRevisado: "Error al marcar como revisado.",
    sinSeleccion: "Selecciona un reporte",
    sinCategoria: "Sin categoría",
    sinDescripcion: "Sin descripción",
    sinCaptura: "Sin captura",
    sinClip: "Sin clip",
    sinReportero: "Sin reportero",
    sinJugadorReportado: "Sin jugador reportado",
  },
  "en-US": {},
};

// --- Utility Functions ---
function getSemaforoColor(indice: number): { color: string; text: string; textColor: string } {
  if (indice >= 60)
    return { color: "#FF3B3B", text: "Sospecha alta", textColor: "#FFFFFF" };
  if (indice > 0)
    return { color: "#FFB020", text: "Sospecha media", textColor: "#222222" };
  return { color: "#39FF14", text: "Limpio", textColor: "#222222" };
}
function pad2(n: number) {
  return n < 10 ? "0" + n : n;
}
function formatDateTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}
function calcularAntiguedad(fechaAlta: string | Date | undefined): number {
  if (!fechaAlta) return 0;
  const d = fechaAlta instanceof Date ? fechaAlta : new Date(fechaAlta);
  if (isNaN(d.getTime())) return 0;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// --- Hamburger Icon (Three Lines) ---
function HamburgerIcon({ color = "#E6E6E6", size = 32 }: { color?: string; size?: number }) {
  const lineHeight = Math.max(3, Math.round(size * 0.13));
  const gap = Math.max(5, Math.round(size * 0.18));
  return (
    <div
      aria-label="Menú"
      style={{
        width: size,
        height: size,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: gap - lineHeight,
        padding: 0,
      }}
    >
      <div
        style={{
          width: size * 0.75,
          height: lineHeight,
          background: color,
          borderRadius: lineHeight,
          margin: 0,
        }}
      />
      <div
        style={{
          width: size * 0.75,
          height: lineHeight,
          background: color,
          borderRadius: lineHeight,
          margin: 0,
        }}
      />
      <div
        style={{
          width: size * 0.75,
          height: lineHeight,
          background: color,
          borderRadius: lineHeight,
          margin: 0,
        }}
      />
    </div>
  );
}

// --- PantallasTab Component ---
function PantallasTab({
  jugadores,
  loading,
  error,
  t,
  colors,
  onCardClick,
}: {
  jugadores: ReadableTableRow<cr5c8_jugador1>[];
  loading: boolean;
  error: string | null;
  t: (k: string) => string;
  colors: any;
  onCardClick: (jugador: ReadableTableRow<cr5c8_jugador1>) => void;
}) {
  // Ordenar por indice_sospecha de mayor a menor
  const jugadoresOrdenados = (jugadores || []).slice().sort(
    (a, b) => (Number(b.cr5c8_indice_sospecha) || 0) - (Number(a.cr5c8_indice_sospecha) || 0)
  );

  return (
    <div
      style={{
        flex: 1,
        width: "100%",
        minHeight: 0,
        background: colors.fondo,
        padding: "32px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Text as="h2" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
        {t("pantallas")}
      </Text>
      {loading ? (
        <Text>{t("actualizar")}...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : jugadoresOrdenados.length === 0 ? (
        <Text>{t("noJugadores")}</Text>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            width: "100%",
            minHeight: 0,
            overflowY: "auto",
            paddingBottom: 24,
          }}
        >
          {jugadoresOrdenados.map((jugador) => {
            const semaforo = getSemaforoColor(Number(jugador.cr5c8_indice_sospecha) || 0);
            return (
              <div
                key={jugador.cr5c8_jugador1id}
                tabIndex={0}
                role="button"
                aria-label={jugador.cr5c8_nickname || t("sinNickname")}
                onClick={() => onCardClick(jugador)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" || e.key === " ") onCardClick(jugador);
                }}
                style={{
                  background: colors.tarjeta,
                  borderRadius: colors.radio,
                  boxShadow: colors.sombra,
                  border: `3px solid ${semaforo.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "24px",
                  cursor: "pointer",
                  minHeight: 320,
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  outline: "none",
                }}
              >
                {/* Imagen grande */}
                {jugador.cr5c8_pantalla_url ? (
                  <img
                    src={jugador.cr5c8_pantalla_url}
                    alt={jugador.cr5c8_nickname || t("sinNickname")}
                    style={{
                      width: "100%",
                      maxWidth: 220,
                      height: 140,
                      objectFit: "cover",
                      borderRadius: colors.radioSmall,
                      marginBottom: 16,
                      boxShadow: colors.sombra,
                      background: colors.superficie,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 220,
                      height: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: colors.superficie,
                      borderRadius: colors.radioSmall,
                      marginBottom: 16,
                      color: colors.texto,
                      fontWeight: 700,
                      fontSize: 28,
                      boxShadow: colors.sombra,
                    }}
                  >
                    {jugador.cr5c8_nickname || t("sinNickname")}
                  </div>
                )}
                {/* Nickname */}
                <Text
                  size={500}
                  weight="semibold"
                  style={{
                    color: colors.texto,
                    fontSize: 22,
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  {jugador.cr5c8_nickname || t("sinNickname")}
                </Text>
                {/* Nivel, ELO, País */}
                <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                  <Tag
                    style={{
                      background: colors.superficie,
                      color: colors.texto,
                      borderRadius: colors.radioSmall,
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "2px 10px",
                    }}
                  >
                    {t("nivel")}: {jugador.cr5c8_nivel ?? "-"}
                  </Tag>
                  <Tag
                    style={{
                      background: colors.superficie,
                      color: colors.texto,
                      borderRadius: colors.radioSmall,
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "2px 10px",
                    }}
                  >
                    {t("elo")}: {jugador.cr5c8_elo ?? "-"}
                  </Tag>
                  <Tag
                    style={{
                      background: colors.superficie,
                      color: colors.texto,
                      borderRadius: colors.radioSmall,
                      fontWeight: 600,
                      fontSize: 16,
                      padding: "2px 10px",
                    }}
                  >
                    {t("pais")}: {jugador.cr5c8_pais || "-"}
                  </Tag>
                </div>
                {/* Semáforo etiqueta */}
                <Tag
                  style={{
                    background: semaforo.color,
                    color: semaforo.textColor,
                    borderRadius: colors.radioSmall,
                    fontWeight: 700,
                    fontSize: 16,
                    padding: "2px 10px",
                    marginBottom: 8,
                  }}
                >
                  {t("indice")}: {jugador.cr5c8_indice_sospecha ?? 0}
                </Tag>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Menu Item ---
function MenuItem({
  label,
  active,
  color,
  onClick,
  badge,
  horizontal,
}: {
  label: string;
  active: boolean;
  color: any;
  onClick: () => void;
  badge?: number;
  horizontal?: boolean;
}) {
  return (
    <div
      tabIndex={0}
      role="menuitem"
      aria-label={label}
      onClick={onClick}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: horizontal ? "12px 28px" : "12px 24px",
        cursor: "pointer",
        background: active ? color.superficie : "transparent",
        color: active ? color.verde : color.texto,
        fontWeight: active ? 700 : 500,
        fontSize: 18,
        border: "none",
        outline: "none",
        borderRight: horizontal ? "1px solid #2224" : undefined,
        borderBottom: !horizontal ? "1px solid #2224" : undefined,
        position: "relative",
        transition: "background 0.2s, color 0.2s",
        minWidth: 90,
        justifyContent: "center",
        ...(horizontal
          ? { borderRight: undefined }
          : {}),
      }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          style={{
            background: "#FF3B3B",
            color: "#FFFFFF",
            borderRadius: 12,
            minWidth: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 14,
            marginLeft: 8,
            boxShadow: "0 2px 8px #0006",
            border: "2px solid #1A1D24",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

// --- Reportes Tab ---
function ReportesTab({
  reportes,
  loading,
  error,
  t,
  colors,
  filtro,
  setFiltro,
  seleccionado,
  setSeleccionado,
  onMarcarRevisado,
}: {
  reportes: ReadableTableRow<cr5c8_reportejugador>[];
  loading: boolean;
  error: string | null;
  t: (k: string) => string;
  colors: any;
  filtro: "Pendientes" | "Todos";
  setFiltro: (v: "Pendientes" | "Todos") => void;
  seleccionado: ReadableTableRow<cr5c8_reportejugador> | null;
  setSeleccionado: (r: ReadableTableRow<cr5c8_reportejugador>) => void;
  onMarcarRevisado: (r: ReadableTableRow<cr5c8_reportejugador>) => Promise<void>;
}) {
  // Categoría labels
  const categoriaLabels: Record<number, string> = {
    500340000: "Aimbot",
    500340001: "Wallhack",
    500340002: "Smurf",
    500340003: "Toxicidad",
    500340004: "Griefing",
    500340005: "Otro",
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "row",
        background: colors.fondo,
        minHeight: 0,
        height: "100%",
        padding: "32px",
        gap: "32px",
      }}
    >
      {/* Lista de reportes */}
      <div
        style={{
          flex: 1,
          minWidth: 280,
          maxWidth: 400,
          background: colors.tarjeta,
          borderRadius: colors.radio,
          boxShadow: colors.sombra,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Text as="h2" style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
          {t("reportes")}
        </Text>
        <Dropdown
          value={filtro}
          onOptionSelect={(_, data) => setFiltro(data.optionValue as "Pendientes" | "Todos")}
          style={{
            marginBottom: 12,
            background: colors.superficie,
            color: colors.texto,
            borderRadius: colors.radioSmall,
            fontWeight: 500,
            fontSize: 16,
            border: `2px solid ${colors.superficie}`,
          }}
          placeholder={t("pendientes")}
        >
          <Option value="Pendientes">{t("pendientes")}</Option>
          <Option value="Todos">{t("todos")}</Option>
        </Dropdown>
        <Divider style={{ margin: "12px 0", background: colors.superficie }} />
        {loading ? (
          <Text>{t("actualizar")}...</Text>
        ) : error ? (
          <Text>{error}</Text>
        ) : reportes.length === 0 ? (
          <Text>{t("noReportes")}</Text>
        ) : (
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 220px)" }}>
            {reportes.map((r) => {
              let gravedadColor = colors.verde;
              if (r.cr5c8_gravedad >= 4) gravedadColor = colors.rojo;
              else if (r.cr5c8_gravedad >= 2) gravedadColor = colors.ambar;
              return (
                <div
                  key={r.cr5c8_reportejugadorid}
                  tabIndex={0}
                  role="button"
                  aria-label={r.cr5c8_titulo}
                  onClick={() => setSeleccionado(r)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSeleccionado(r);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: "1px solid #2224",
                    cursor: "pointer",
                    borderLeft: `4px solid ${gravedadColor}`,
                    background:
                      seleccionado?.cr5c8_reportejugadorid === r.cr5c8_reportejugadorid
                        ? colors.superficie
                        : "transparent",
                    color: colors.texto,
                    fontWeight: seleccionado?.cr5c8_reportejugadorid === r.cr5c8_reportejugadorid ? 700 : 500,
                  }}
                >
                  <Tag
                    style={{
                      background: gravedadColor,
                      color: gravedadColor === colors.rojo ? "#FFF" : "#222",
                      borderRadius: colors.radioSmall,
                      fontWeight: 700,
                      fontSize: 16,
                      padding: "2px 10px",
                      minWidth: 36,
                      textAlign: "center",
                    }}
                  >
                    {r.cr5c8_gravedad ?? 0}
                  </Tag>
                  <span style={{ flex: 1 }}>
                    {r["cr5c8_jugador_reportado@OData.Community.Display.V1.FormattedValue"] ||
                      t("sinJugadorReportado")}
                  </span>
                  <Tag
                    style={{
                      background: colors.superficie,
                      color: colors.texto,
                      borderRadius: colors.radioSmall,
                      fontWeight: 600,
                      fontSize: 14,
                      padding: "2px 8px",
                    }}
                  >
                    {categoriaLabels[r.cr5c8_categoria as number] || t("sinCategoria")}
                  </Tag>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Detalle del reporte seleccionado */}
      <div
        style={{
          flex: 2,
          minWidth: 320,
          background: colors.tarjeta,
          borderRadius: colors.radio,
          boxShadow: colors.sombra,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {seleccionado ? (
          <>
            <Text as="h2" style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              {seleccionado.cr5c8_titulo || t("sinCategoria")}
            </Text>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("reportero")}:</Text>{" "}
              <span>
                {seleccionado["cr5c8_reportero@OData.Community.Display.V1.FormattedValue"] ||
                  t("sinReportero")}
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("jugadorReportado")}:</Text>{" "}
              <span>
                {seleccionado["cr5c8_jugador_reportado@OData.Community.Display.V1.FormattedValue"] ||
                  t("sinJugadorReportado")}
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("categoria")}:</Text>{" "}
              <span>
                {categoriaLabels[seleccionado.cr5c8_categoria as number] || t("sinCategoria")}
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("gravedad")}:</Text>{" "}
              <span>{seleccionado.cr5c8_gravedad ?? 0}</span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("descripcion")}:</Text>
              <div
                style={{
                  color: colors.texto,
                  fontSize: 16,
                  background: colors.superficie,
                  borderRadius: colors.radioSmall,
                  padding: "8px 12px",
                  marginTop: 4,
                  minHeight: 40,
                }}
              >
                {seleccionado.cr5c8_descripcion || t("sinDescripcion")}
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("captura")}:</Text>
              {seleccionado.cr5c8_captura ? (
                <img
                  src={seleccionado.cr5c8_captura}
                  alt={t("captura")}
                  style={{
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: colors.radioSmall,
                    marginTop: 4,
                    boxShadow: colors.sombra,
                  }}
                />
              ) : (
                <div
                  style={{
                    color: colors.texto,
                    fontSize: 16,
                    background: colors.superficie,
                    borderRadius: colors.radioSmall,
                    padding: "8px 12px",
                    marginTop: 4,
                  }}
                >
                  {t("sinCaptura")}
                </div>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 600 }}>{t("clip")}:</Text>
              {seleccionado.cr5c8_clip ? (
                <video
                  src={seleccionado.cr5c8_clip}
                  controls
                  style={{
                    width: "100%",
                    maxWidth: 320,
                    borderRadius: colors.radioSmall,
                    marginTop: 4,
                    boxShadow: colors.sombra,
                  }}
                />
              ) : (
                <div
                  style={{
                    color: colors.texto,
                    fontSize: 16,
                    background: colors.superficie,
                    borderRadius: colors.radioSmall,
                    padding: "8px 12px",
                    marginTop: 4,
                  }}
                >
                  {t("sinClip")}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
              <Button
                appearance="secondary"
                style={{
                  background: colors.superficie,
                  color: colors.texto,
                  borderRadius: colors.radioSmall,
                  fontWeight: 700,
                  minWidth: 100,
                }}
                onClick={() => onMarcarRevisado(seleccionado)}
              >
                {t("ignorar")}
              </Button>
              <Button
                appearance="primary"
                style={{
                  background: colors.ambar,
                  color: "#222222",
                  borderRadius: colors.radioSmall,
                  fontWeight: 700,
                  minWidth: 100,
                }}
                onClick={() => onMarcarRevisado(seleccionado)}
              >
                {t("avisar")}
              </Button>
              <Button
                appearance="primary"
                style={{
                  background: colors.rojo,
                  color: "#FFFFFF",
                  borderRadius: colors.radioSmall,
                  fontWeight: 700,
                  minWidth: 100,
                }}
                onClick={() => onMarcarRevisado(seleccionado)}
              >
                {t("banear")}
              </Button>
            </div>
          </>
        ) : (
          <Text>{t("sinSeleccion")}</Text>
        )}
      </div>
    </div>
  );
}

const GeneratedComponent = (props: GeneratedComponentProps) => {
  // --- Localization ---
  const language = React.useMemo(() => {
    const uiLanguageId =
      (typeof Xrm !== "undefined" &&
        Xrm.Utility?.getGlobalContext()?.userSettings?.languageId) ||
      3082;
    return langMap[uiLanguageId]?.code || "es-ES";
  }, []);
  const t = (key: string): string =>
    translations[language]?.[key] ||
    translations["es-ES"]?.[key] ||
    key;

  // --- Theme Colors ---
  const colors = {
    fondo: "#0F1115",
    tarjeta: "#1A1D24",
    texto: "#E6E6E6",
    superficie: "#222222",
    verde: "#39FF14",
    ambar: "#FFB020",
    rojo: "#FF3B3B",
    sombra: "0 2px 8px #0006",
    radio: 16,
    radioSmall: 12,
    radioLarge: 18,
  };

  // --- Estado Options (for filters and labels) ---
  const estadoOptions = [
    { value: 500340000, label: t("limpio") },
    { value: 500340001, label: t("enRevision") },
    { value: 500340002, label: t("sancionado") },
  ];

  // --- Tabs ---
  const [tab, setTab] = useState<"pantallas" | "jugadores" | "reportes">("pantallas");
  // --- Notification ---
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null);

  // --- Data State ---
  const [jugadores, setJugadores] = useState<ReadableTableRow<cr5c8_jugador1>[]>([]);
  const [jugadoresLoading, setJugadoresLoading] = useState(false);
  const [jugadoresError, setJugadoresError] = useState<string | null>(null);

  // --- Estado para filtros y selección ---
  const [jugadorFiltro, setJugadorFiltro] = useState<string>("Todos");
  const [jugadorBusqueda, setJugadorBusqueda] = useState<string>("");
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState<ReadableTableRow<cr5c8_jugador1> | null>(null);

  // --- Modal Pantalla ---
  const [pantallaModal, setPantallaModal] = useState<{ jugador: ReadableTableRow<cr5c8_jugador1>; index: number; jugadores: ReadableTableRow<cr5c8_jugador1>[] } | null>(null);

  // --- Hamburger Menu ---
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // --- Add Jugador Modal State ---
  const [addJugadorOpen, setAddJugadorOpen] = useState(false);

  // --- Actualización periódica ---
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  useEffect(() => {
    let timer: any;
    const fetchAll = async () => {
      await fetchJugadores();
      setLastUpdate(new Date());
    };
    fetchAll();
    timer = setInterval(fetchAll, 10000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, []);

  // --- Fetch Jugadores ---
  async function fetchJugadores() {
    setJugadoresLoading(true);
    setJugadoresError(null);
    try {
      if (!props.dataApi) {
        setJugadores([]);
        setJugadoresLoading(false);
        return;
      }
      const result = await props.dataApi.queryTable("cr5c8_jugador1", {
        select: [
          "cr5c8_jugador1id",
          "cr5c8_nickname",
          "cr5c8_nivel",
          "cr5c8_elo",
          "cr5c8_pais",
          "cr5c8_indice_sospecha",
          "cr5c8_estado",
          "cr5c8_fecha_alta",
          "cr5c8_motivos",
          "cr5c8_player_id",
        ],
        orderBy: "cr5c8_indice_sospecha desc",
        pageSize: 100,
      });
      setJugadores(result.rows || []);
    } catch (e: any) {
      setJugadoresError(e?.message || t("error"));
    }
    setJugadoresLoading(false);
  }

  // --- Reportes State ---
  const [reportes, setReportes] = useState<ReadableTableRow<cr5c8_reportejugador>[]>([]);
  const [reportesLoading, setReportesLoading] = useState(false);
  const [reportesError, setReportesError] = useState<string | null>(null);
  const [reporteFiltro, setReporteFiltro] = useState<"Pendientes" | "Todos">("Pendientes");
  const [reporteSeleccionado, setReporteSeleccionado] = useState<ReadableTableRow<cr5c8_reportejugador> | null>(null);

  // --- Fetch Reportes ---
  async function fetchReportes() {
    setReportesLoading(true);
    setReportesError(null);
    try {
      if (!props.dataApi) {
        setReportes([]);
        setReportesLoading(false);
        return;
      }
      const filter =
        reporteFiltro === "Pendientes"
          ? "cr5c8_revisado eq 0"
          : undefined;
      const result = await props.dataApi.queryTable("cr5c8_reportejugador", {
        select: [
          "cr5c8_reportejugadorid",
          "cr5c8_titulo",
          "cr5c8_descripcion",
          "cr5c8_reportero",
          "_cr5c8_reportero_value",
          "cr5c8_jugador_reportado",
          "_cr5c8_jugador_reportado_value",
          "cr5c8_categoria",
          "cr5c8_gravedad",
          "cr5c8_captura",
          "cr5c8_clip",
          "cr5c8_revisado",
        ],
        orderBy: "cr5c8_gravedad desc",
        pageSize: 100,
        filter,
      });
      setReportes(result.rows || []);
      // If the selected report is no longer present, deselect
      if (
        reporteSeleccionado &&
        !result.rows.find((r) => r.cr5c8_reportejugadorid === reporteSeleccionado.cr5c8_reportejugadorid)
      ) {
        setReporteSeleccionado(null);
      }
    } catch (e: any) {
      setReportesError(e?.message || t("error"));
    }
    setReportesLoading(false);
  }

  // --- Fetch Reportes on tab/filtro change ---
  useEffect(() => {
    if (tab === "reportes") {
      fetchReportes();
    }
    // eslint-disable-next-line
  }, [tab, reporteFiltro]);

  // --- Barra Superior ---
  const pendingReportsCount = React.useMemo(
    () => reportes.filter((r) => r.cr5c8_revisado === 0).length,
    [reportes]
  );

  // --- Handlers ---
  const handleTab = (tabId: "pantallas" | "jugadores" | "reportes") => {
    setTab(tabId);
    setJugadorSeleccionado(null);
    setMenuOpen(false);
    if (tabId === "reportes") {
      fetchReportes();
    }
  };

  // --- Add/Delete Handlers ---
  async function handleAddJugador(formData: WritableTableRow<cr5c8_jugador1>) {
    try {
      await props.dataApi.createRow("cr5c8_jugador1", formData);
      setNotification({ type: "success", message: t("exitoAgregar") });
      await fetchJugadores();
    } catch (e: any) {
      setNotification({ type: "error", message: t("errorAgregar") });
    }
  }
  async function handleDeleteJugador(jugadorId: string) {
    try {
      await props.dataApi.deleteRow("cr5c8_jugador1", jugadorId);
      setNotification({ type: "success", message: t("exitoBorrar") });
      setJugadorSeleccionado(null);
      await fetchJugadores();
    } catch (e: any) {
      setNotification({ type: "error", message: t("errorBorrar") });
    }
  }

  // --- Pantallas Navigation Modal Logic ---
  const jugadoresOrdenadosPantallas = (jugadores || []).slice().sort((a, b) => (Number(b.cr5c8_indice_sospecha) || 0) - (Number(a.cr5c8_indice_sospecha) || 0));
  function openPantallaModal(jugador: ReadableTableRow<cr5c8_jugador1>) {
    const idx = jugadoresOrdenadosPantallas.findIndex(j => j.cr5c8_jugador1id === jugador.cr5c8_jugador1id);
    setPantallaModal({ jugador, index: idx, jugadores: jugadoresOrdenadosPantallas });
  }
  function closePantallaModal() {
    setPantallaModal(null);
  }
  function goToPantallaModal(index: number) {
    const total = jugadoresOrdenadosPantallas.length;
    if (total === 0) return;
    const newIndex = (index + total) % total;
    setPantallaModal({
      jugador: jugadoresOrdenadosPantallas[newIndex],
      index: newIndex,
      jugadores: jugadoresOrdenadosPantallas,
    });
  }

  // --- Hamburger Menu Outside Click ---
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // --- Marcar reporte como revisado ---
  async function marcarRevisado(reporte: ReadableTableRow<cr5c8_reportejugador>) {
    try {
      await props.dataApi.updateRow("cr5c8_reportejugador", reporte.cr5c8_reportejugadorid, {
        cr5c8_revisado: 1,
      });
      setNotification({ type: "success", message: t("revisadoOk") });
      await fetchReportes();
    } catch (e: any) {
      setNotification({ type: "error", message: t("errorRevisado") });
    }
  }

  // --- Render ---
  return (
    <div
      dir="ltr"
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: colors.fondo,
        color: colors.texto,
        fontFamily: "Segoe UI, Arial, sans-serif",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Barra superior */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: colors.tarjeta,
          height: 64,
          minHeight: 64,
          width: "100%",
          display: "flex",
          alignItems: "center",
          boxShadow: colors.sombra,
          borderBottom: `2px solid ${colors.superficie}`,
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: colors.verde,
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: 1,
            marginLeft: 32,
            marginRight: 8,
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            position: "relative",
            height: 64,
          }}
        >
          {t("logo")}
          {/* Hamburger */}
          <Button
            appearance="transparent"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen((open) => !open)}
            style={{
              marginLeft: 12,
              color: colors.texto,
              background: "transparent",
              border: "none",
              borderRadius: colors.radioSmall,
              fontSize: 28,
              minWidth: 36,
              minHeight: 36,
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "none",
            }}
            tabIndex={0}
          >
            <HamburgerIcon color={colors.texto} size={32} />
          </Button>
          {/* Menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              style={{
                position: "absolute",
                left: "100%",
                top: "50%",
                transform: "translateY(-50%)",
                minWidth: 180,
                maxWidth: 420,
                background: colors.tarjeta,
                borderRadius: colors.radioSmall,
                boxShadow: colors.sombra,
                padding: "8px 0",
                zIndex: 100,
                border: `2px solid ${colors.superficie}`,
                display: "flex",
                flexDirection: "row", // Horizontal menu
                gap: 24, // Space between menu items
                marginLeft: 16,
                alignItems: "center",
                height: "auto",
                overflowX: "auto", // Enable horizontal scroll
                overflowY: "hidden",
              }}
            >
              <MenuItem
                label={t("pantallas")}
                active={tab === "pantallas"}
                color={colors}
                onClick={() => handleTab("pantallas")}
                horizontal
              />
              <MenuItem
                label={t("jugadores")}
                active={tab === "jugadores"}
                color={colors}
                onClick={() => handleTab("jugadores")}
                horizontal
              />
              <MenuItem
                label={t("reportes")}
                active={tab === "reportes"}
                color={colors}
                onClick={() => handleTab("reportes")}
                badge={pendingReportsCount > 0 ? pendingReportsCount : undefined}
                horizontal
              />
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {tab === "pantallas" && (
          <PantallasTab
            jugadores={jugadores}
            loading={jugadoresLoading}
            error={jugadoresError}
            t={t}
            colors={colors}
            onCardClick={openPantallaModal}
          />
        )}
        {tab === "jugadores" && (
          <JugadoresTab
            jugadores={jugadores.filter((j) => {
              if (jugadorFiltro !== "Todos" && j.cr5c8_estado !== Number(jugadorFiltro)) return false;
              if (
                jugadorBusqueda &&
                !j.cr5c8_nickname?.toLowerCase().includes(jugadorBusqueda.toLowerCase())
              )
                return false;
              return true;
            }).sort((a, b) => (Number(b.cr5c8_indice_sospecha) || 0) - (Number(a.cr5c8_indice_sospecha) || 0))}
            jugadoresRaw={jugadores}
            loading={jugadoresLoading}
            error={jugadoresError}
            t={t}
            colors={colors}
            estadoOptions={estadoOptions}
            filtro={jugadorFiltro}
            setFiltro={setJugadorFiltro}
            busqueda={jugadorBusqueda}
            setBusqueda={setJugadorBusqueda}
            seleccionado={jugadorSeleccionado}
            setSeleccionado={setJugadorSeleccionado}
            lastUpdate={lastUpdate}
            onActualizar={async () => {
              await fetchJugadores();
              setLastUpdate(new Date());
            }}
            onAddJugador={() => setAddJugadorOpen(true)}
            onDeleteJugador={handleDeleteJugador}
          />
        )}
        {tab === "reportes" && (
          <ReportesTab
            reportes={reportes}
            loading={reportesLoading}
            error={reportesError}
            t={t}
            colors={colors}
            filtro={reporteFiltro}
            setFiltro={setReporteFiltro}
            seleccionado={reporteSeleccionado}
            setSeleccionado={setReporteSeleccionado}
            onMarcarRevisado={marcarRevisado}
          />
        )}
      </div>

      {/* Modal Pantalla */}
      {pantallaModal && (
        <JugadorCardModal
          jugador={pantallaModal.jugador}
          onClose={closePantallaModal}
          t={t}
          colors={colors}
          showArrows
          onPrev={() => goToPantallaModal(pantallaModal.index - 1)}
          onNext={() => goToPantallaModal(pantallaModal.index + 1)}
        />
      )}

      {/* Add Jugador Modal */}
      {addJugadorOpen && (
        <AddJugadorModal
          open={addJugadorOpen}
          onClose={() => setAddJugadorOpen(false)}
          onAdd={async (data) => {
            await handleAddJugador(data);
            setAddJugadorOpen(false);
          }}
          t={t}
          colors={colors}
          estadoOptions={estadoOptions}
        />
      )}

      {/* Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              notification.type === "success"
                ? colors.verde
                : notification.type === "warning"
                ? colors.ambar
                : notification.type === "info"
                ? colors.superficie
                : colors.rojo,
            color:
              notification.type === "success"
                ? "#222222"
                : notification.type === "warning"
                ? "#222222"
                : notification.type === "info"
                ? colors.texto
                : "#FFFFFF",
            borderRadius: colors.radio,
            boxShadow: colors.sombra,
            padding: "16px 32px",
            fontWeight: 600,
            fontSize: 18,
            zIndex: 1000,
            minWidth: 240,
            textAlign: "center",
            transition: "opacity 0.3s",
          }}
        >
          {notification.message}
          <Button
            appearance="subtle"
            style={{
              marginLeft: 16,
              color: colors.texto,
              background: "transparent",
              border: "none",
              minWidth: 32,
            }}
            icon={<DismissRegular />}
            onClick={() => setNotification(null)}
            aria-label="Cerrar notificación"
          />
        </div>
      )}
    </div>
  );
};

export default GeneratedComponent;