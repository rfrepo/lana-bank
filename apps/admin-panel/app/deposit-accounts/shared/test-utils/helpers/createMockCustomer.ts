import type { DepositAccountData } from '@/hooks/deposit-account/use-deposit-account'

export const createMockCustomer = (
  overrides?: Partial<NonNullable<DepositAccountData['customer']>>
): NonNullable<DepositAccountData['customer']> => ({
  id: 'test-customer-id',
  customerId: 'test-customer-uuid',
  publicId: 'test-customer-public-id',
  email: 'test@example.com',
  telegramId: 'test-telegram-id',
  ...overrides,
})

