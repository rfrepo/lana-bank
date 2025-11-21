import { jest } from '@jest/globals'

const mockFreezeMutation = jest.fn()
const mockReset = jest.fn()

jest.mock('@/lib/graphql/generated', () => ({
  GetCustomerBasicDetailsDocument: {},
  useDepositAccountFreezeMutation: jest.fn(() => [
    mockFreezeMutation,
    { loading: false, reset: mockReset },
  ]),
  GetCustomerBasicDetailsQuery: {},
}))

export { mockFreezeMutation, mockReset }

