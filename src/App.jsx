import { useEffect, useMemo, useState } from 'react'
import csvRaw from './data/sections.csv?raw'
import { parseCsv } from './utils/parseCsv'

const HISTORY_KEY = 'purchase-history'
const pointsForAmount = (amount) => Math.floor(amount / 1000)

export default function App() {
  const sections = useMemo(() => parseCsv(csvRaw), [])
  const [currentSection, setCurrentSection] = useState(0)
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({
    description: '',
    amount: '',
    section: sections[0]?.Section ?? ''
  })

  useEffect(() => {
    const saved = window.localStorage.getItem(HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        // ignore corrupted state
      }
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history])

  useEffect(() => {
    if (!form.section && sections.length) {
      setForm((prev) => ({ ...prev, section: sections[0].Section }))
    }
  }, [sections, form.section])

  const totalPoints = history.reduce((sum, item) => sum + item.points, 0)

  const handleSubmit = (event) => {
    event.preventDefault()
    const parsedAmount = Number(form.amount)
    if (!form.description.trim() || Number.isNaN(parsedAmount)) return

    const points = pointsForAmount(parsedAmount)
    const nextEntry = {
      description: form.description.trim(),
      amount: parsedAmount,
      section: form.section,
      points
    }
    setHistory((prev) => [nextEntry, ...prev])
    setForm((prev) => ({ ...prev, description: '', amount: '' }))
  }

  const handleNavigate = (direction) => {
    setCurrentSection((prev) => {
      const nextIndex = (prev + direction + sections.length) % sections.length
      return nextIndex
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <main>
      <h1>Resumen de compras</h1>

      <section aria-label="Secciones del CSV">
        <h2>Secciones detectadas</h2>
        <p data-testid="current-section">Sección actual: {sections[currentSection]?.Section}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="secondary" onClick={() => handleNavigate(-1)}>
            Sección anterior
          </button>
          <button type="button" className="secondary" onClick={() => handleNavigate(1)}>
            Siguiente sección
          </button>
        </div>
        <ul data-testid="section-list">
          {sections.map((section) => (
            <li key={section.Section}>
              <strong>{section.Section}</strong>: {section.Description}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Registro de transacciones">
        <h2>Registrar transacción</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Descripción
            <input
              name="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe la compra"
              data-testid="description-input"
            />
          </label>
          <label>
            Monto ($)
            <input
              name="amount"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="0"
              data-testid="amount-input"
            />
          </label>
          <label>
            Sección
            <select
              name="section"
              value={form.section}
              onChange={(e) => setForm((prev) => ({ ...prev, section: e.target.value }))}
              data-testid="section-select"
            >
              {sections.map((section) => (
                <option key={section.Section} value={section.Section}>
                  {section.Section}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit">Guardar transacción</button>
            <button type="button" className="secondary" onClick={clearHistory}>
              Limpiar historial
            </button>
          </div>
        </form>
        <p>
          Total de puntos acumulados: <strong data-testid="total-points">{totalPoints}</strong>
        </p>
      </section>

      <section aria-label="Historial local">
        <h2>Historial local</h2>
        <div className="history" data-testid="history">
          {history.length === 0 ? (
            <p>Aún no registras transacciones.</p>
          ) : (
            <ul>
              {history.map((item, index) => (
                <li key={`${item.description}-${index}`}>
                  {item.description} — ${item.amount} — {item.section} — {item.points} puntos
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  )
}
