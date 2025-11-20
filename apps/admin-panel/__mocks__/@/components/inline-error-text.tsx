import React from 'react'
import { jest } from '@jest/globals'

const InlineErrorText = jest.fn().mockReturnValue(<div data-testid="inline-error-text" />)

export default InlineErrorText

