import { useEffect, useMemo, useState } from "react";
import data from "../data/fidelidad.json";

type Seccion = (typeof data.secciones)[number];

type Registro = {
  id: string;
  monto: number;
  puntos: number;
  fecha: string;
  nota?: string;
};

type Mensaje = {
  tipo: "exito" | "error" | "info";
  texto: string;
};

const STORAGE_KEY = "fidelidad-historial";

function calcularPuntos(monto: number) {
  const base = Math.floor((monto / data.conversion.montoBase) * data.conversion.puntosPorMonto);
  const puntosConBonus = base + (monto === 0 ? 0 : data.conversion.bonusPrimerCompra);
  return Math.min(puntosConBonus, data.conversion.maximoPorCompra);
}

const FidelidadPage = () => {
  const [montoCompra, setMontoCompra] = useState<string>("");
  const [puntosCalculados, setPuntosCalculados] = useState<number | null>(null);
  const [historial, setHistorial] = useState<Registro[]>([]);
  const [mensaje, setMensaje] = useState<Mensaje | null>(null);
  const [nota, setNota] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const guardado = window.localStorage.getItem(STORAGE_KEY);
    if (guardado) {
      try {
        setHistorial(JSON.parse(guardado));
      } catch (error) {
        console.error("No se pudo leer el historial", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(historial));
  }, [historial]);

  const balance = useMemo(() => historial.reduce((acc, item) => acc + item.puntos, 0), [historial]);

  const notificar = (tipo: Mensaje["tipo"], texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleCalcular = () => {
    const monto = Number(montoCompra);
    if (Number.isNaN(monto) || monto <= 0) {
      notificar("error", data.mensajes.error);
      setPuntosCalculados(null);
      return;
    }
    const puntos = calcularPuntos(monto);
    setPuntosCalculados(puntos);
    notificar("exito", `Se calcularon ${puntos} puntos`);
  };

  const handleRegistrar = () => {
    const monto = Number(montoCompra);
    if (Number.isNaN(monto) || monto <= 0) {
      notificar("error", data.mensajes.error);
      return;
    }
    const puntos = puntosCalculados ?? calcularPuntos(monto);
    const nuevo: Registro = {
      id: crypto.randomUUID(),
      monto,
      puntos,
      nota,
      fecha: new Date().toLocaleString(),
    };
    setHistorial((prev) => [nuevo, ...prev]);
    setPuntosCalculados(puntos);
    notificar("exito", data.mensajes.exito);
  };

  const handleLimpiar = () => {
    setMontoCompra("");
    setPuntosCalculados(null);
    setHistorial([]);
    setNota("");
    notificar("info", data.mensajes.limpieza);
  };

  const handleNavegar = (seccion: Seccion) => {
    const anchor = document.getElementById(seccion.id);
    if (anchor) {
      anchor.focus();
      anchor.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Inter, system-ui, sans-serif" }}>
      <header>
        <h1>{data.programa}</h1>
        <p>
          Calcula puntos de fidelidad, registra tus compras y revisa las reglas y dependencias del
          ecosistema.
        </p>
      </header>

      <section aria-labelledby="formulario-title" style={{ marginTop: "1.5rem" }}>
        <h2 id="formulario-title">Gestor de puntos</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCalcular();
          }}
          style={{ display: "grid", gap: "1rem", maxWidth: 640 }}
        >
          <label style={{ display: "grid", gap: "0.25rem" }}>
            Monto de compra (ARS)
            <input
              aria-label="Monto de compra"
              name="monto"
              type="number"
              min={0}
              value={montoCompra}
              onChange={(e) => setMontoCompra(e.target.value)}
              required
            />
          </label>

          <label style={{ display: "grid", gap: "0.25rem" }}>
            Nota u observación
            <input
              aria-label="Nota"
              name="nota"
              type="text"
              placeholder="Ej: Pago con tarjeta"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
          </label>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="submit">Calcular</button>
            <button type="button" onClick={handleRegistrar}>
              Registrar compra
            </button>
            <button type="button" onClick={handleLimpiar}>
              Limpiar datos
            </button>
          </div>
        </form>
        {puntosCalculados !== null && (
          <p role="status" aria-live="polite" style={{ marginTop: "0.5rem" }}>
            Balance estimado: <strong>{puntosCalculados}</strong> puntos
          </p>
        )}
        {mensaje && (
          <div
            role={mensaje.tipo === "error" ? "alert" : "status"}
            style={{ marginTop: "0.5rem", color: mensaje.tipo === "error" ? "#b91c1c" : "#15803d" }}
            aria-live={mensaje.tipo === "error" ? "assertive" : "polite"}
          >
            {mensaje.texto}
          </div>
        )}
      </section>

      <section aria-labelledby="historial-title" style={{ marginTop: "2rem" }}>
        <h2 id="historial-title">Historial local</h2>
        <p>Total de puntos acumulados: {balance}</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Fecha</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Monto</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Puntos</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {historial.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "0.5rem 0" }}>
                  No hay registros. Calcula y registra una compra para empezar.
                </td>
              </tr>
            )}
            {historial.map((item) => (
              <tr key={item.id}>
                <td style={{ padding: "0.5rem 0" }}>{item.fecha}</td>
                <td style={{ padding: "0.5rem 0" }}>${item.monto.toFixed(2)}</td>
                <td style={{ padding: "0.5rem 0" }}>{item.puntos}</td>
                <td style={{ padding: "0.5rem 0" }}>{item.nota || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section aria-labelledby="secciones-title" style={{ marginTop: "2rem" }}>
        <h2 id="secciones-title">Secciones, reglas y dependencias</h2>
        <p>{data.conversion.nota}</p>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {data.secciones.map((seccion) => (
            <article
              key={seccion.id}
              id={seccion.id}
              tabIndex={-1}
              style={{ border: "1px solid #e5e7eb", padding: "1rem", borderRadius: 8 }}
            >
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3>{seccion.titulo}</h3>
                  <p>{seccion.descripcion}</p>
                </div>
                <button type="button" onClick={() => handleNavegar(seccion)}>
                  Ir a sección
                </button>
              </header>
              <div style={{ marginTop: "0.5rem" }}>
                <strong>Reglas clave</strong>
                <ul>
                  {seccion.reglas.map((regla) => (
                    <li key={regla}>{regla}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Dependencias:</strong> {seccion.dependencias.join(", ")}</p>
              <p><strong>Referencias Jira:</strong> {seccion.referencias.join(", ")}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FidelidadPage;
