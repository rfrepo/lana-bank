import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import { createMockFreezeDialogProps } from './helpers'

// eslint-disable-next-line import/no-unassigned-import
import './mocks'

describe('FreezeDepositAccountDialog', () => {
  const renderDialog = async (openFreezeDialog: boolean) => {
    const props = createMockFreezeDialogProps({ openFreezeDialog })
    const FreezeDepositAccountDialogComponent = (await import('../freeze-deposit-account')).default
    return render(
      <FreezeDepositAccountDialogComponent {...props} />
    )
  }

  it('should render dialog when open', async () => {
    const { getByRole, getByText } = await renderDialog(true)

    await waitFor(() => {
      expect(getByRole('dialog')).toBeDefined()
      expect(getByText(/t-title/)).toBeDefined()
      expect(getByText(/t-description/)).toBeDefined()
      expect(getByText(/t-settledBalance/)).toBeDefined()
      expect(getByText(/t-pendingBalance/)).toBeDefined()
      expect(getByRole('button', { name: /t-freeze/ })).toBeDefined()
    })
  })

  it('should not render dialog when closed', async () => {
    const { queryByRole } = await renderDialog(false)

    await waitFor(() => {
      expect(queryByRole('dialog')).toBeNull()
    })
  })
})
