import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('Página de compras', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('renderiza las secciones provenientes del CSV', () => {
    render(<App />)
    expect(screen.getByText('Usuarios y cuentas')).toBeInTheDocument()
    expect(screen.getByText('Carrito y compras')).toBeInTheDocument()
    expect(screen.getByText('Pagos y pedidos')).toBeInTheDocument()
  })

  it('calcula puntos (1 por $1000) y registra el historial local', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByTestId('description-input'), 'Compra de teclado')
    await user.type(screen.getByTestId('amount-input'), '2500')
    await user.selectOptions(screen.getByTestId('section-select'), 'Carrito y compras')
    await user.click(screen.getByRole('button', { name: /guardar transacción/i }))

    expect(screen.getByTestId('total-points')).toHaveTextContent('2')
    expect(screen.getByTestId('history')).toHaveTextContent('Compra de teclado')
    expect(JSON.parse(window.localStorage.getItem('purchase-history')).length).toBe(1)
  })

  it('limpia el historial y permite navegar entre secciones', async () => {
    const user = userEvent.setup()
    render(<App />)

    // llenar historial
    await user.type(screen.getByTestId('description-input'), 'Compra de monitor')
    await user.type(screen.getByTestId('amount-input'), '3000')
    await user.click(screen.getByRole('button', { name: /guardar transacción/i }))

    // limpiar
    await user.click(screen.getByRole('button', { name: /limpiar historial/i }))
    expect(screen.getByTestId('history')).toHaveTextContent('Aún no registras transacciones')

    // navegar
    const current = screen.getByTestId('current-section')
    expect(current).toHaveTextContent('Usuarios y cuentas')
    await user.click(screen.getByRole('button', { name: /siguiente sección/i }))
    expect(current).toHaveTextContent('Carrito y compras')
    await user.click(screen.getByRole('button', { name: /sección anterior/i }))
    expect(current).toHaveTextContent('Usuarios y cuentas')
  })
})
