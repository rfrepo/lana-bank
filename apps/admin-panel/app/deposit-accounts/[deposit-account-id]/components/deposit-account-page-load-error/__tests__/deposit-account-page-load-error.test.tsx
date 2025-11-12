import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
import DepositAccountPageLoadError from '../deposit-account-page-load-error'
import { createMockError } from './helpers'

describe('DepositAccountPageLoadError', () => {
  it('should render error message', async () => {
    const error = createMockError('Test error message')
    const { getByText, getByRole } = render(
      <DepositAccountPageLoadError error={error} />
    )

    await waitFor(() => {
      expect(getByRole('alert')).toBeDefined()
      expect(getByText('Test error message')).toBeDefined()
    })
  })

  it('should render default error message when error message is empty', async () => {
    const error = createMockError('')
    const { getByText, getByRole } = render(
      <DepositAccountPageLoadError error={error} />
    )

    await waitFor(() => {
      expect(getByRole('alert')).toBeDefined()
      expect(getByText('An error occurred while loading the deposit account')).toBeDefined()
    })
  })

  it('should render error message in the DOM', async () => {
    const error = createMockError('Custom error occurred')
    const { container } = render(
      <DepositAccountPageLoadError error={error} />
    )

    await waitFor(() => {
      expect(container.textContent).toContain('Custom error occurred')
    })
  })
})
