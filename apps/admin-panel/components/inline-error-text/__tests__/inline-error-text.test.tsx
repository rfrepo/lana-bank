import React from 'react'
import { expect, it, describe } from "@jest/globals"
import { render, waitFor } from '@testing-library/react'
import InlineErrorText from '../inline-error-text'

describe('InlineErrorText', () => {
  it('should render error message when message is provided', async () => {
    const { getByText } = render(<InlineErrorText message="Test error message" />)

    await waitFor(() => {
      expect(getByText('Test error message')).toBeDefined()
    })
  })

  it('should not render when message is null', async () => {
    const { container } = render(<InlineErrorText message={null} />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('should not render when message is undefined', async () => {
    const { container } = render(<InlineErrorText />)

    await waitFor(() => {
      expect(container.firstChild).toBeNull()
    })
  })

  it('should render error message in the DOM', async () => {
    const { container } = render(<InlineErrorText message="Custom error occurred" />)

    await waitFor(() => {
      expect(container.textContent).toContain('Custom error occurred')
    })
  })

  it('should render with correct CSS classes', async () => {
    const { getByText } = render(<InlineErrorText message="Error message" />)

    await waitFor(() => {
      const element = getByText('Error message')
      expect(element).toHaveClass('text-destructive')
      expect(element).toHaveClass('text-sm')
    })
  })
})

