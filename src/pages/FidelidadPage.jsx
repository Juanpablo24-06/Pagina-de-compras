import './PageStyles.css';

function FidelidadPage() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Nueva sección</p>
        <h1 className="page-title">Programa de Fidelidad</h1>
        <p className="page-lead">
          Aquí podrás desarrollar la página dedicada al programa de fidelidad. Usa este
          espacio para presentar beneficios, puntos acumulados y próximas recompensas.
        </p>
      </header>
      <div className="info-card">
        <h2>¿Qué sigue?</h2>
        <ul className="bullet-list">
          <li>Agregar componentes específicos para la experiencia de fidelidad.</li>
          <li>Conectar la ruta a datos reales cuando estén disponibles.</li>
          <li>Definir indicadores y llamadas a la acción para los usuarios.</li>
        </ul>
      </div>
    </section>
  );
}

export default FidelidadPage;
