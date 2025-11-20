import React from 'react'
import { jest } from '@jest/globals'

export const Dialog = jest.fn(({ children, open }) => (
  open ? <div role="dialog" data-testid="dialog">{children}</div> : null
))
export const DialogContent = jest.fn(({ children }) => <div data-testid="dialog-content">{children}</div>)
export const DialogDescription = jest.fn(({ children }) => <div data-testid="dialog-description">{children}</div>)
export const DialogFooter = jest.fn(({ children }) => <div data-testid="dialog-footer">{children}</div>)
export const DialogHeader = jest.fn(({ children }) => <div data-testid="dialog-header">{children}</div>)
export const DialogTitle = jest.fn(({ children }) => <div data-testid="dialog-title">{children}</div>)

