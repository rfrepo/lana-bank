import React from 'react'
import { jest } from '@jest/globals'

export const DetailsCard = jest.fn().mockReturnValue(<div data-testid="details-card" />)
export const DetailItem = jest.fn(({ children }) => <div data-testid="detail-item">{children}</div>)
export const DetailsGroup = jest.fn(({ children }) => <div data-testid="details-group">{children}</div>)
export const DetailItemProps = {}

