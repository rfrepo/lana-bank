import '@testing-library/jest-dom'

import { jest } from '@jest/globals'

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

// Mock next-intl globally with trackable mock function
const mockUseTranslations = jest.fn(() => {
    const mockT = jest.fn((key: string) => {
        // Extract the last segment of the key (e.g., "fields.pendingBalance" -> "pendingBalance")
        const keyParts = key.split('.')
        const lastKey = keyParts[keyParts.length - 1]
        return `t-${lastKey}`
    })
    return mockT
})

jest.mock('next-intl', () => ({
    useTranslations: mockUseTranslations,
    useFormatter: jest.fn(() => ({
        dateTime: jest.fn(),
        number: jest.fn(),
        relativeTime: jest.fn(),
    })),
    NextIntlClientProvider: jest.fn(({ children }) => children),
}))

// Export for use in tests that need to track translation calls
export { mockUseTranslations }

// Mock Next.js navigation globally
jest.mock('next/navigation', () => {
    const mockRouter = {
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        prefetch: jest.fn(),
    }
    return {
        useRouter: () => mockRouter,
        usePathname: () => '/',
        useSearchParams: () => new URLSearchParams(),
    }
})

// Mock Apollo Client globally
jest.mock('@apollo/client', () => {
    const actualApollo = jest.requireActual('@apollo/client')
    return {
        ...(actualApollo as Record<string, unknown>),
        gql: jest.fn(),
        ApolloProvider: jest.fn(({ children }) => children),
        useApolloClient: jest.fn(),
        useQuery: jest.fn(() => ({
            data: null,
            loading: false,
            error: null,
            refetch: jest.fn(),
            fetchMore: jest.fn(),
        })),
        useMutation: jest.fn(() => [
            jest.fn(),
            { loading: false, error: null, reset: jest.fn() },
        ]),
    }
})

// Mock sonner globally (manual mock from __mocks__)
jest.mock('sonner')


