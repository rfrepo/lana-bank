import { jest } from "@jest/globals"
import { useApolloClient } from "@apollo/client"
import { toast } from "sonner"

import {
    useCreateDepositMutation,
} from "@/lib/graphql/generated"
import { currencyConverter } from "@/lib/utils"

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
}

jest.mock("@apollo/client", () => {
    const actualApollo = jest.requireActual("@apollo/client") as Record<string, unknown>
    return {
        ...actualApollo,
        useApolloClient: jest.fn(),
        gql: jest.fn(),
    }
})

jest.mock("next/navigation", () => ({
    useRouter: () => mockRouter,
}))

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
    },
}))

jest.mock("@/lib/utils", () => ({
    currencyConverter: {
        centsToUsd: jest.fn(),
        btcToSatoshi: jest.fn(),
        satoshiToBtc: jest.fn(),
        usdToCents: jest.fn(),
    },
}))

jest.mock("@/lib/graphql/generated", () => {
    const actual = jest.requireActual("@/lib/graphql/generated") as Record<string, unknown>
    return {
        ...actual,
        useCreateDepositMutation: jest.fn(),
    }
})

export const getMockUseApolloClient = () => {
    const mockedModule = jest.requireMock("@apollo/client") as {
        useApolloClient: jest.MockedFunction<typeof useApolloClient>
    }
    return mockedModule.useApolloClient
}

export const getMockUseCreateDepositMutation = () => {
    const mockedModule = jest.requireMock("@/lib/graphql/generated") as {
        useCreateDepositMutation: jest.MockedFunction<typeof useCreateDepositMutation>
    }
    return mockedModule.useCreateDepositMutation
}

export const getMockToast = () => {
    const mockedModule = jest.requireMock("sonner") as {
        toast: jest.Mocked<typeof toast>
    }
    return mockedModule.toast
}

export const getMockCurrencyConverter = () => {
    const mockedModule = jest.requireMock("@/lib/utils") as {
        currencyConverter: jest.Mocked<typeof currencyConverter>
    }
    return mockedModule.currencyConverter
}

export { mockRouter }

