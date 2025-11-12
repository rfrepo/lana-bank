import '@testing-library/jest-dom'

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

// Mock next-intl globally to avoid ESM transformation issues
jest.mock('next-intl', () => ({
    useTranslations: jest.fn((namespace: string) => (key: string) => `${namespace}.${key}`),
    useFormatter: jest.fn(() => ({
        dateTime: jest.fn(),
        number: jest.fn(),
        relativeTime: jest.fn(),
    })),
    NextIntlClientProvider: jest.fn(({ children }) => children),
}))

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
        ...actualApollo,
        gql: jest.fn(),
        ApolloProvider: jest.fn(({ children }) => children),
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


