export default function ResumenKPIs({ alumnos }) {
  const totalAlumnos = alumnos.length;

  const notaMedia =
    totalAlumnos > 0
      ? (alumnos.reduce((suma, alumno) => suma + Number(alumno.nota), 0) / totalAlumnos).toFixed(2)
      : '0.00';

  const aprobados = alumnos.filter((alumno) => Number(alumno.nota) >= 5).length;
  const porcentajeAprobados =
    totalAlumnos > 0 ? Math.round((aprobados / totalAlumnos) * 100) : 0;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}
    >
      <div className="box" style={{ textAlign: 'center', borderTop: '3px solid var(--primary)' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Total de alumnos</span>
        <p style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--primary)', margin: '0.2rem 0 0' }}>
          {totalAlumnos}
        </p>
      </div>

      <div className="box" style={{ textAlign: 'center', borderTop: '3px solid var(--purple)' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Nota media del grupo</span>
        <p style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--purple)', margin: '0.2rem 0 0' }}>
          {notaMedia}
        </p>
      </div>

      <div className="box" style={{ textAlign: 'center', borderTop: '3px solid var(--green)' }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Porcentaje de aprobados</span>
        <p style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--green)', margin: '0.2rem 0 0' }}>
          {porcentajeAprobados}%
        </p>
      </div>
    </div>
  );
}