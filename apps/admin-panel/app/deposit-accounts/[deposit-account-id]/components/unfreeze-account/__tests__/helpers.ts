import { jest } from "@jest/globals"

export const createMockUnfreezeDialogProps = (overrides?: {
  openUnfreezeDialog?: boolean
  depositAccountId?: string
}) => ({
  openUnfreezeDialog: true,
  setOpenUnfreezeDialog: jest.fn(),
  depositAccountId: 'test-id',
  ...overrides,
})

