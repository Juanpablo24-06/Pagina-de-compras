import { useMemo, useState } from 'react';
import './AdminDashboard.css';

const userDirectory = [
  { name: 'Laura Méndez', role: 'Administradora', status: 'Activo', lastLogin: 'Hoy 10:24', sessions: 2, risk: 'Bajo', flags: ['2FA', 'IP segura'] },
  { name: 'Carlos Ruiz', role: 'Soporte', status: 'Activo', lastLogin: 'Hoy 09:55', sessions: 1, risk: 'Medio', flags: ['Intento fallido'] },
  { name: 'Andrea Soto', role: 'Auditoría', status: 'Revisión', lastLogin: 'Ayer 22:14', sessions: 0, risk: 'Medio', flags: ['Requiere cambio de clave'] },
  { name: 'Valeria Torres', role: 'Operaciones', status: 'Suspendido', lastLogin: 'Ayer 18:42', sessions: 0, risk: 'Alto', flags: ['Bloqueo por intentos'] },
  { name: 'Diego Pardo', role: 'Analista', status: 'Activo', lastLogin: 'Hoy 08:30', sessions: 3, risk: 'Bajo', flags: ['2FA', 'Trusted device'] },
];

const auditTrail = [
  { label: 'Roles sincronizados', detail: 'Perfil Operaciones ajustado con permisos de reembolso', time: '10:15', severity: 'info' },
  { label: 'Sesión forzada a logout', detail: 'Cuenta Valeria Torres cerrada por bloqueo 2FA', time: '10:04', severity: 'critical' },
  { label: 'Política reforzada', detail: 'Contraseñas expiran cada 90 días con historial', time: '09:45', severity: 'info' },
  { label: 'Revisión manual', detail: 'Tickets de fraude marcados para monitoreo continuo', time: '09:10', severity: 'warning' },
];

const checkoutAlerts = [
  { area: 'Checkout', metric: 'Errores 500', value: '2', trend: '-60% vs ayer', status: 'stable' },
  { area: 'Pagos', metric: 'Fallback a cash', value: '3', trend: '+1 incidente', status: 'warning' },
  { area: 'Carrito', metric: 'Timeouts API', value: '0', trend: 'OK', status: 'healthy' },
  { area: 'Puntos', metric: 'Desalineación saldo', value: '1', trend: 'Caso abierto', status: 'warning' },
];

const hardeningChecklist = [
  'Bloqueo de sesión compartida y cierre remoto',
  'Limitación de intentos fallidos con enfriamiento',
  '2FA obligatorio para admin y operaciones críticas',
  'Bitácora de cambios en roles y permisos',
  'Alertas en vivo cuando checkout emite errores 4xx/5xx',
];

function AdminDashboard() {
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    return userDirectory.filter((user) => {
      const matchesRole = roleFilter ? user.role === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      const matchesSearch = search
        ? user.name.toLowerCase().includes(search.toLowerCase()) || user.role.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, search]);

  const activeUsers = userDirectory.filter((user) => user.status === 'Activo').length;
  const riskyUsers = userDirectory.filter((user) => user.risk !== 'Bajo').length;

  return (
    <section className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Equipo B — Gobernanza y observabilidad</p>
          <h1 className="page-title">Panel de administración y monitoreo</h1>
          <p className="page-lead">
            Control de usuarios, roles y sesiones, más auditoría y alertas de errores provenientes de carrito y checkout.
          </p>
        </div>
        <div className="header-actions">
          <button className="primary-button">Desplegar modo seguro</button>
          <button className="ghost-button">Exportar reporte</button>
        </div>
      </header>

      <div className="kpis">
        <div className="kpi-card">
          <p className="kpi-label">Usuarios activos</p>
          <strong className="kpi-value">{activeUsers}</strong>
          <span className="kpi-meta">Sesiones persistentes verificadas</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Riesgos abiertos</p>
          <strong className="kpi-value kpi-warning">{riskyUsers}</strong>
          <span className="kpi-meta">Cuentas a revisar con Equipo A</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Auditorías hoy</p>
          <strong className="kpi-value">4</strong>
          <span className="kpi-meta">Bitácora firmada y sellada</span>
        </div>
        <div className="kpi-card">
          <p className="kpi-label">Alertas checkout</p>
          <strong className="kpi-value">{checkoutAlerts.filter((alert) => alert.status !== 'healthy').length}</strong>
          <span className="kpi-meta">Enviadas a canal #ops-alerts</span>
        </div>
      </div>

      <div className="admin-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Control de identidades</p>
              <h2>Usuarios, roles y estados</h2>
            </div>
            <div className="filters">
              <input
                className="input"
                type="search"
                placeholder="Buscar por nombre o rol"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="input" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">Rol: todos</option>
                <option value="Administradora">Administradora</option>
                <option value="Soporte">Soporte</option>
                <option value="Auditoría">Auditoría</option>
                <option value="Operaciones">Operaciones</option>
                <option value="Analista">Analista</option>
              </select>
              <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Estado: todos</option>
                <option value="Activo">Activo</option>
                <option value="Revisión">Revisión</option>
                <option value="Suspendido">Suspendido</option>
              </select>
            </div>
          </div>

          <div className="user-table">
            <div className="user-table__head">
              <span>Usuario</span>
              <span>Rol</span>
              <span>Estado</span>
              <span>Último acceso</span>
              <span>Sesiones</span>
              <span>Controles</span>
            </div>
            {filteredUsers.map((user) => (
              <div key={user.name} className="user-table__row">
                <div>
                  <strong>{user.name}</strong>
                  <p className="muted">Riesgo: {user.risk}</p>
                </div>
                <span className="pill">{user.role}</span>
                <span className={`pill pill-${user.status.toLowerCase()}`}>{user.status}</span>
                <span>{user.lastLogin}</span>
                <span>{user.sessions}</span>
                <div className="controls">
                  <button className="ghost-button small">Ver bitácora</button>
                  <button className="primary-button small">Forzar logout</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Hardening y postura</p>
              <h2>Recomendaciones aplicadas</h2>
            </div>
            <button className="ghost-button">Sincronizar con IAM</button>
          </div>
          <ul className="checklist">
            {hardeningChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="actions-row">
            <button className="primary-button">Activar modo mantenimiento</button>
            <button className="ghost-button">Notificar a Seguridad</button>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Checkout & carrito</p>
              <h2>Alertas y errores priorizados</h2>
            </div>
            <button className="ghost-button">Ver log completo</button>
          </div>

          <div className="alert-grid">
            {checkoutAlerts.map((alert) => (
              <article key={alert.metric} className={`alert-card alert-${alert.status}`}>
                <p className="eyebrow">{alert.area}</p>
                <h3>{alert.metric}</h3>
                <p className="alert-value">{alert.value}</p>
                <p className="muted">{alert.trend}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Auditoría continua</p>
              <h2>Bitácora con sello horario</h2>
            </div>
            <button className="ghost-button">Descargar CSV</button>
          </div>

          <div className="timeline">
            {auditTrail.map((event) => (
              <div key={event.label} className={`timeline-item timeline-${event.severity}`}>
                <div>
                  <strong>{event.label}</strong>
                  <p className="muted">{event.detail}</p>
                </div>
                <span className="pill">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
