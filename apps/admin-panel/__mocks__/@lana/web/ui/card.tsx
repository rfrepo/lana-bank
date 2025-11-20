import React from 'react'
import { jest } from '@jest/globals'

export const Card = jest.fn(({ children, className, ...props }) => (
  <div data-testid="card" className={className} {...props}>
    {children}
  </div>
))

export const CardHeader = jest.fn(({ children, className, ...props }) => (
  <div data-testid="card-header" className={className} {...props}>
    {children}
  </div>
))

export const CardTitle = jest.fn(({ children, className, ...props }) => (
  <h3 data-testid="card-title" className={className} {...props}>
    {children}
  </h3>
))

export const CardContent = jest.fn(({ children, className, ...props }) => (
  <div data-testid="card-content" className={className} {...props}>
    {children}
  </div>
))

