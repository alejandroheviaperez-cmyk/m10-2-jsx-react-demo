import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//      ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - Si un atacante introduce `<script>` o `<img onerror=...>`, React lo
//      pinta como texto plano seguro sin ejecutar código JavaScript.
// ============================================================================

const PAYLOADS_XSS = [
  {
    etiqueta: 'Cargar payload XSS de prueba 1 (<script>)',
    payload: "<script>alert('Ataque XSS ejecutado')</script>"
  },
  {
    etiqueta: 'Cargar payload XSS de prueba 2 (<img onerror>)',
    payload: "<img src=x onerror=\"alert('Robo de sesión')\" />"
  },
  {
    etiqueta: 'Cargar payload XSS de prueba 3 (<svg onload>)',
    payload: "<svg/onload=alert(document.cookie)>"
  }
];

export default function EventosYSeguridadXSS() {
  const [historial, setHistorial] = useState([]);
  const [entradaUsuario, setEntradaUsuario] = useState(
    "<img src=x onerror='alert('Ataque XSS')' /> <script>alert('Hack')</script>"
  );

  // Registra un evento conservando únicamente los últimos 5
  const registrarEvento = (descripcion) => {
    const nuevoEvento = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      hora: new Date().toLocaleTimeString(),
      descripcion
    };
    setHistorial((prev) => [nuevoEvento, ...prev].slice(0, 5));
  };

  // Manejador sin parámetros (se pasa como referencia: onClick={manejarClickSimple})
  const manejarClickSimple = () => {
    registrarEvento('Clic simple registrado mediante onClick={fn}');
  };

  // Manejador con parámetros (requiere función flecha: onClick={() => manejarConParametro(...)})
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  const manejarCargaPayload = (item) => {
    setEntradaUsuario(item.payload);
    registrarEvento(`Vector cargado: ${item.etiqueta}`);
  };

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>
      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">
        <div className="box box-success">
          <h3>Auditoría de Eventos (Synthetic Events)</h3>

          <div className="btn-row">
            {/* Referencia directa a la función */}
            <button type="button" className="btn" onClick={manejarClickSimple}>
              onClick=&#123;fn&#125;
            </button>
            {/* Función flecha para pasar argumentos sin ejecutar en el render */}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setHistorial([])}
              disabled={historial.length === 0}
              style={historial.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
            >
              Limpiar historial
            </button>
          </div>

          <h4 style={{ marginTop: '1rem', fontSize: '0.92rem', color: 'var(--primary)' }}>
            Últimos 5 eventos registrados ({historial.length}/5):
          </h4>

          {historial.length === 0 ? (
            <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.4rem' }}>
              No hay eventos registrados todavía. Pulsa algún botón para auditar acciones.
            </p>
          ) : (
            <ul className="list">
              {historial.map((ev) => (
                <li key={ev.id} className="list-item" style={{ fontSize: '0.85rem' }}>
                  <span>{ev.descripcion}</span>
                  <span className="pill">{ev.hora}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="box box-warn">
          <h3>Banco de Pruebas y Escapado contra XSS</h3>

          <div className="btn-row" style={{ marginBottom: '0.75rem', marginTop: 0 }}>
            {PAYLOADS_XSS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-secondary"
                onClick={() => manejarCargaPayload(item)}
              >
                {item.etiqueta}
              </button>
            ))}
          </div>

          <label htmlFor="xss-input">Introduce HTML o un payload XSS:</label>
          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />
          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all'
            }}
          >
            {/* JSX escapa automáticamente esta cadena: NO se ejecuta el script */}
            Salida renderizada segura: {entradaUsuario}
          </div>
        </div>
      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code: <code className="code-inline">src/components/05_EventosYSeguridadXSS.jsx</code>
      </p>
    </section>
  );
}