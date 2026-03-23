import { render, screen } from '@testing-library/react'
import Todo from './Todo'

test('renders todo text', () => {
  render(<Todo todo={{ text: 'Testaa testi', done: false }} />)
  expect(screen.getByText(/Testaa testi/)).toBeDefined()
})
