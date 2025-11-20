import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'

import InlineErrorText from '../inline-error-text'

describe('InlineErrorText', () => {
  const renderAndAssertMessage = async ({
    message,
    expectedText,
  }: {
    message?: string | null
    expectedText: string
  }) => {
    const { getByText } = render(<InlineErrorText message={message} />)

    await waitFor(() => {
      const element = getByText(expectedText)
      expect(element).toBeDefined()
      expect(element).toHaveClass('text-destructive')
      expect(element).toHaveClass('text-sm')
    })
  }

  const renderAndAssertNotRendered = async ({
    message,
  }: {
    message?: string | null
  }) => {
    const { container } = render(<InlineErrorText message={message} />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  }

  it('should render error message when message is provided', async () => {
    await renderAndAssertMessage({
      message: 'Test error message',
      expectedText: 'Test error message',
    })
  })

  it('should not render when message is null', async () => {
    await renderAndAssertNotRendered({ message: null })
  })

  it('should not render when message is undefined', async () => {
    await renderAndAssertNotRendered({ message: undefined })
  })
})




