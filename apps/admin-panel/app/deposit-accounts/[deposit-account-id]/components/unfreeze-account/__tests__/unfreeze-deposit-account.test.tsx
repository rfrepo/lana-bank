import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import { createMockUnfreezeDialogProps } from './helpers'

// eslint-disable-next-line import/no-unassigned-import
import './mocks'

describe('UnfreezeDepositAccountDialog', () => {
  const renderDialog = async (openUnfreezeDialog: boolean) => {
    const props = createMockUnfreezeDialogProps({ openUnfreezeDialog })
    const UnfreezeDepositAccountDialogComponent = (await import('../unfreeze-deposit-account')).default
    return render(
      <UnfreezeDepositAccountDialogComponent {...props} />
    )
  }

  it('should render dialog when open', async () => {
    const { getByRole, getByText } = await renderDialog(true)

    await waitFor(() => {
      expect(getByRole('dialog')).toBeDefined()
      expect(getByText(/t-title/)).toBeDefined()
      expect(getByText(/t-description/)).toBeDefined()
      expect(getByRole('button', { name: /t-unfreeze/ })).toBeDefined()
    })
  })

  it('should not render dialog when closed', async () => {
    const { queryByRole } = await renderDialog(false)

    await waitFor(() => {
      expect(queryByRole('dialog')).toBeNull()
    })
  })
})
