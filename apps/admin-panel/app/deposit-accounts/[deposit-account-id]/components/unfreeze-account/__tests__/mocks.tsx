import { jest } from '@jest/globals'

const mockUnfreezeMutation = jest.fn()
const mockReset = jest.fn()

jest.mock('@/lib/graphql/generated', () => ({
  GetCustomerBasicDetailsDocument: {},
  useDepositAccountUnfreezeMutation: jest.fn(() => [
    mockUnfreezeMutation,
    { loading: false, reset: mockReset },
  ]),
}))

export { mockUnfreezeMutation, mockReset }

