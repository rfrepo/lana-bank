import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import DepositAccountPageLoadError from '../deposit-account-page-load-error'

import { createMockError } from './helpers'


describe('DepositAccountPageLoadError', () => {

  const renderErrorAnErrorText = async ({
    error,
    expectedText,
  }: {
    error: ReturnType<typeof createMockError>
    expectedText: string
  }) => {
    const { getByText, getByRole } = render(
      <DepositAccountPageLoadError error={error} />
    )

    await waitFor(() => {
      expect(getByRole('alert')).toBeDefined()
      expect(getByText(expectedText)).toBeDefined()
    })
  }

  it('should render error message', async () => {
    await renderErrorAnErrorText({ error: createMockError('Test error message'), expectedText: 'Test error message' })
  })

  it('should render default error message when error message is empty', async () => {
    await renderErrorAnErrorText({ error: createMockError(''), expectedText: 't-loadError' })
  })
})
