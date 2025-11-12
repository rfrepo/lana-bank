import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
import NoDepositAccount from '../no-deposit-account'

jest.mock('next-intl', () => ({
  useTranslations: jest.fn((namespace: string) => (key: string) => {
    if (key === 'notFound') {
      return 'The deposit account you are looking for could not be found.'
    }
    return `${namespace}.${key}`
  }),
}))

describe('NoDepositAccount', () => {
  it('should render not found message', async () => {
    const { getByText, getByRole } = render(<NoDepositAccount />)

    await waitFor(() => {
      expect(getByRole('alert')).toBeDefined()
      expect(getByText('Deposit Account Not Found')).toBeDefined()
      expect(getByText(/The deposit account you are looking for could not be found/)).toBeDefined()
    })
  })

  it('should render with correct aria attributes', async () => {
    const { getByRole } = render(<NoDepositAccount />)

    await waitFor(() => {
      const alert = getByRole('alert')
      expect(alert).toBeDefined()
      expect(alert).toHaveAttribute('aria-atomic', 'true')
      expect(alert).toHaveAttribute('aria-live', 'polite')
    })
  })

  it('should render heading and description in the DOM', async () => {
    const { container } = render(<NoDepositAccount />)

    await waitFor(() => {
      expect(container.textContent).toContain('Deposit Account Not Found')
      expect(container.textContent).toContain('The deposit account you are looking for could not be found')
    })
  })
})

