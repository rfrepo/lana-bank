import React from 'react'
import { expect, it, describe, jest, beforeEach } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
import { useTranslations } from 'next-intl'

const mockUseTranslations = useTranslations as jest.MockedFunction<typeof useTranslations>

import NoDepositAccount from '../no-deposit-account'

describe('NoDepositAccount', () => {
  beforeEach(() => {
    mockUseTranslations.mockImplementation(((namespace?: string) => {
      const mockT = (key: string) => {
        if (key === 'notFound.title') {
          return 'Deposit Account Not Found'
        }
        if (key === 'notFound.message') {
          return 'The deposit account you are looking for could not be found.'
        }
        return `${namespace}.${key}`
      }
      return mockT as ReturnType<typeof useTranslations>
    }) as jest.MockedFunction<typeof useTranslations>)
  })
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
      expect(alert.getAttribute('aria-atomic')).toBe('true')
      expect(alert.getAttribute('aria-live')).toBe('polite')
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

