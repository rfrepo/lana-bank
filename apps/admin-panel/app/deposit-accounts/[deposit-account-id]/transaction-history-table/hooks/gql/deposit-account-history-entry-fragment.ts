import { gql } from "@apollo/client"

export const DEPOSIT_ACCOUNT_HISTORY_ENTRY_FRAGMENT = gql`
  fragment DepositAccountHistoryEntryFields on DepositAccountHistoryEntry {
    ... on DepositEntry {
      recordedAt
      deposit {
        id
        amount
        status
        publicId
        depositId
        accountId
        createdAt
        reference
      }
    }
    ... on DisbursalEntry {
      recordedAt
      disbursal {
        id
        amount
        status
        publicId
        createdAt
        disbursalId
      }
    }
    ... on PaymentEntry {
      recordedAt
      payment {
        id
        amount
        createdAt
        paymentAllocationId
      }
    }
    ... on WithdrawalEntry {
      recordedAt
      withdrawal {
        id
        amount
        status
        publicId
        accountId
        createdAt
        reference
        withdrawalId
      }
    }
    ... on CancelledWithdrawalEntry {
      recordedAt
      withdrawal {
        id
        amount
        status
        publicId
        accountId
        createdAt
        reference
        withdrawalId
      }
    }
  }
`
