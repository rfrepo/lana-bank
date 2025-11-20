import React from 'react'
import { jest } from '@jest/globals'

import { mockUseTranslations } from '@/jest.setup'

export const getMockBadge = () => {
    const badgeModule = jest.requireMock('@lana/web/ui/badge') as { 
        Badge: jest.MockedFunction<React.ComponentType<unknown>> 
    }
    return badgeModule.Badge
}

jest.mock('../../freeze-account/freeze-deposit-account', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="freeze-deposit-account-dialog" />),
    FreezeDepositAccountDialog: jest.fn(() => <div data-testid="freeze-deposit-account-dialog" />),
}))

jest.mock('../../unfreeze-account/unfreeze-deposit-account', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="unfreeze-deposit-account-dialog" />),
    UnfreezeDepositAccountDialog: jest.fn(() => <div data-testid="unfreeze-deposit-account-dialog" />),
}))

jest.mock('@/lib/graphql/generated', () => {
    const actual = jest.requireActual('@/lib/graphql/generated')
    return {
        ...(actual as Record<string, unknown>),
        useDepositAccountFreezeMutation: jest.fn(() => [
            jest.fn(),
            { loading: false, reset: jest.fn() },
        ]),
        useDepositAccountUnfreezeMutation: jest.fn(() => [
            jest.fn(),
            { loading: false, reset: jest.fn() },
        ]),
        GetCustomerBasicDetailsDocument: {},
    }
})

export { mockUseTranslations }

