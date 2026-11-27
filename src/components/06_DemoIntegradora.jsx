import { useState, useEffect } from 'react';
import ResumenKPIs from './ResumenKPIs.jsx';

// ============================================================================
// [CLAVE EXPOSICIÓN 6] DEMO INTEGRADORA DE TODAS LAS CARACTERÍSTICAS DE JSX
// ----------------------------------------------------------------------------
// Este componente reúne en un caso real de aula:
// - Fragmentos (<>...</>) y atributos camelCase (className, onClick, onChange)
// - Expresiones JS { } y estilos en línea dinámicos style={{ }}
// - Renderizado condicional (ternario + && booleano seguro)
// - Listas con .map() y key única estable
// - Comunicación mediante props y composición de componentes
// ============================================================================

const STORAGE_KEY = 'm10_expedientes_dam2';

const EXPEDIENTES_INICIALES = [
  { id: 101, nombre: 'Lucía Serrano', nota: 8.7, modulos: ['DI', 'PSP', 'AD'] },
  { id: 102, nombre: 'Marcos Vega', nota: 4.3, modulos: ['DI', 'SGE'] },
  { id: 103, nombre: 'Sofía Navarro', nota: 9.5, modulos: ['DI', 'PSP', 'AD', 'PMDM'] }
];

function TarjetaExpediente({ alumno, seleccionado, onSeleccionar }) {
  const aprobado = alumno.nota >= 5;

  return (
    <article
      className="box"
      style={{
        borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
        borderWidth: seleccionado ? '2px' : '1px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{alumno.nombre}</h3>
        <span className={`badge ${aprobado ? 'badge-ok' : 'badge-fail'}`}>
          {aprobado ? `Aprobado (${alumno.nota})` : `Pendiente (${alumno.nota})`}
        </span>
      </div>

      {alumno.modulos.length > 0 && (
        <div className="btn-row" style={{ marginTop: '0.6rem' }}>
          {alumno.modulos.map((mod, idx) => (
            <span key={`${alumno.id}-${mod}-${idx}`} className="code-inline">
              {mod}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button type="button" className="btn" onClick={() => onSeleccionar(alumno)}>
          {seleccionado ? 'Expediente seleccionado' : 'Seleccionar expediente'}
        </button>
      </div>
    </article>
  );
}

export default function DemoIntegradora() {
  // Ticket 08 y 10: Estado inicializado desde localStorage
  const [expedientes, setExpedientes] = useState(() => {
    try {
      const guardados = localStorage.getItem(STORAGE_KEY);
      return guardados ? JSON.parse(guardados) : EXPEDIENTES_INICIALES;
    } catch {
      return EXPEDIENTES_INICIALES;
    }
  });

  // Ticket 07: Filtros y ordenación
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [orden, setOrden] = useState('nota-desc');
  const [seleccionado, setSeleccionado] = useState(null);

  // Ticket 08: Estados del formulario de alta
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaNota, setNuevaNota] = useState('');
  const [nuevosModulos, setNuevosModulos] = useState('');
  const [errorForm, setErrorForm] = useState('');

  // Ticket 10: Guardado automático en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expedientes));
  }, [expedientes]);

  const handleAgregarExpediente = (e) => {
    e.preventDefault();
    const nombreLimpio = nuevoNombre.trim();
    const notaNumerica = Number(nuevaNota);

    if (!nombreLimpio) {
      setErrorForm('El nombre completo del alumno es obligatorio.');
      return;
    }

    if (nuevaNota === '' || Number.isNaN(notaNumerica) || notaNumerica < 0 || notaNumerica > 10) {
      setErrorForm('La nota debe ser un número válido entre 0 y 10.');
      return;
    }

    const modulosArray = nuevosModulos
      .split(',')
      .map((m) => m.trim().toUpperCase())
      .filter(Boolean);

    const nuevoExpediente = {
      id: Date.now(),
      nombre: nombreLimpio,
      nota: notaNumerica,
      modulos: modulosArray
    };

    setExpedientes((prev) => [...prev, nuevoExpediente]);
    setNuevoNombre('');
    setNuevaNota('');
    setNuevosModulos('');
    setErrorForm('');
  };

  const handleRestablecerDatos = () => {
    localStorage.removeItem(STORAGE_KEY);
    setExpedientes(EXPEDIENTES_INICIALES);
    setSeleccionado(null);
    setBusquedaNombre('');
    setSoloAprobados(false);
    setOrden('nota-desc');
    setErrorForm('');
  };

  // Filtrado combinado (nombre + solo aprobados) y ordenación
  const listaFiltrada = expedientes
    .filter((alumno) => {
      const coincideNombre = alumno.nombre
        .toLowerCase()
        .includes(busquedaNombre.trim().toLowerCase());
      const coincideAprobado = soloAprobados ? alumno.nota >= 5 : true;
      return coincideNombre && coincideAprobado;
    })
    .sort((a, b) => {
      if (orden === 'nota-desc') return b.nota - a.nota;
      if (orden === 'nota-asc') return a.nota - b.nota;
      return a.nombre.localeCompare(b.nombre);
    });

  return (
    <>
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>
            <p className="subtitle" style={{ marginBottom: 0 }}>
              Composición de componentes reutilizables aplicando todas las reglas de JSX.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={handleRestablecerDatos}
          >
            Restablecer datos iniciales
          </button>
        </div>

        {/* Ticket 09: Cuadro de mando KPI conectado a la lista filtrada */}
        <div style={{ marginTop: '1.1rem' }}>
          <ResumenKPIs alumnos={listaFiltrada} />
        </div>

        {/* Ticket 08: Formulario controlado de alta dinámica */}
        <form onSubmit={handleAgregarExpediente} className="box" style={{ marginBottom: '1.15rem' }}>
          <h3 style={{ marginTop: 0 }}>Alta de Nuevo Expediente</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem', alignItems: 'end' }}>
            <div>
              <label htmlFor="alta-nombre">Nombre completo *:</label>
              <input
                id="alta-nombre"
                type="text"
                className="input"
                placeholder="Ej.: Elena Martínez"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="alta-nota">Nota (0 - 10) *:</label>
              <input
                id="alta-nota"
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="input"
                placeholder="Ej.: 8.5"
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="alta-modulos">Módulos (separados por comas):</label>
              <input
                id="alta-modulos"
                type="text"
                className="input"
                placeholder="Ej.: DI, PSP, AD"
                value={nuevosModulos}
                onChange={(e) => setNuevosModulos(e.target.value)}
              />
            </div>

            <button type="submit" className="btn" style={{ height: '38px' }}>
              + Añadir expediente
            </button>
          </div>

          {errorForm && (
            <p role="alert" style={{ color: 'var(--red)', fontWeight: 600, fontSize: '0.88rem', marginTop: '0.6rem' }}>
              {errorForm}
            </p>
          )}
        </form>

        {/* Ticket 07: Buscador, filtro de aprobados y ordenación */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="search"
            className="input"
            style={{ flex: '1 1 220px', marginTop: 0 }}
            placeholder="Buscar alumno por nombre..."
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
          />

          <select
            aria-label="Ordenar expedientes"
            className="input"
            style={{ width: 'auto', minWidth: '190px', marginTop: 0 }}
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="nota-desc">Nota (mayor a menor)</option>
            <option value="nota-asc">Nota (menor a mayor)</option>
            <option value="nombre-asc">Nombre (A-Z)</option>
          </select>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSoloAprobados((prev) => !prev)}
          >
            {soloAprobados ? 'Mostrar todos los alumnos' : 'Filtrar solo aprobados (>= 5)'}
          </button>

          {seleccionado && (
            <span className="pill">
              Seleccionado: {seleccionado.nombre} (ID #{seleccionado.id})
            </span>
          )}
        </div>

        {/* Renderizado del grid o estado vacío */}
        {listaFiltrada.length === 0 ? (
          <div className="box box-warn" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontWeight: 600, color: 'var(--muted)' }}>
              No se encontraron expedientes con esos criterios
            </p>
          </div>
        ) : (
          <div className="grid-2">
            {listaFiltrada.map((alumno) => (
              <TarjetaExpediente
                key={alumno.id}
                alumno={alumno}
                seleccionado={seleccionado?.id === alumno.id}
                onSeleccionar={setSeleccionado}
              />
            ))}
          </div>
        )}

        <p className="file-hint">
          Archivo para mostrar en VS Code: <code className="code-inline">src/components/06_DemoIntegradora.jsx</code>
        </p>
      </section>
    </>
  );
}