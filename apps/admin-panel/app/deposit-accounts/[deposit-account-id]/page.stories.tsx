import type { Meta, StoryObj } from "@storybook/nextjs"
import { ApolloError } from "@apollo/client"
import { MockedProvider } from "@apollo/client/testing"

import DepositAccountPage from "./page"

import {
  GetDepositAccountDetailsPageDocument,
  GetDepositAccountTransactionHistoryDocument,
  DepositAccountStatus,
  DepositStatus,
  Activity,
  CustomerType,
} from "@/lib/graphql/generated"

import { CreateContextProvider } from "@/app/create"

const mockPublicId = "DA-001"

const baseMocks = [
  {
    request: {
      query: GetDepositAccountDetailsPageDocument,
      variables: {
        publicId: mockPublicId,
      },
    },
    result: {
      data: {
        publicIdTarget: {
          __typename: "DepositAccount",
          id: "DepositAccount:1",
          depositAccountId: "dep-account-001",
          publicId: mockPublicId,
          status: DepositAccountStatus.Active,
          balance: {
            __typename: "DepositAccountBalance",
            settled: 100000,
            pending: 5000,
          },
          customer: {
            __typename: "Customer",
            id: "Customer:1",
            customerId: "cust-001",
            email: "customer1@example.com",
            telegramId: "@customer1",
            activity: Activity.Active,
            customerType: CustomerType.Individual,
            createdAt: "2024-01-01T00:00:00Z",
            publicId: "CUST-001",
          },
          ledgerAccounts: {
            __typename: "DepositAccountLedgerAccounts",
            depositAccountId: "ledger-dep-001",
            frozenDepositAccountId: "ledger-frozen-001",
          },
        },
      },
    },
  },
  {
    request: {
      query: GetDepositAccountTransactionHistoryDocument,
      variables: {
        publicId: mockPublicId,
        first: 100,
      },
    },
    result: {
      data: {
        publicIdTarget: {
          __typename: "DepositAccount",
          history: {
            __typename: "DepositAccountHistoryEntryConnection",
            pageInfo: {
              __typename: "PageInfo",
              endCursor: null,
              startCursor: null,
              hasNextPage: false,
              hasPreviousPage: false,
            },
            edges: [
              {
                __typename: "DepositAccountHistoryEntryEdge",
                cursor: "cursor1",
                node: {
                  __typename: "DepositEntry",
                  recordedAt: "2024-01-15T10:00:00Z",
                  deposit: {
                    __typename: "Deposit",
                    id: "Deposit:1",
                    amount: 50000,
                    status: DepositStatus.Confirmed,
                    publicId: "DEP-001",
                    depositId: "dep-001",
                    accountId: "dep-account-001",
                    createdAt: "2024-01-15T10:00:00Z",
                    reference: "REF-001",
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
]

const meta = {
  title: "Pages/DepositAccounts/DepositAccount/Details",
  component: DepositAccountPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof DepositAccountPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    params: Promise.resolve({ "deposit-account-id": mockPublicId }),
  },
  decorators: [
    (Story) => (
      <CreateContextProvider>
        <MockedProvider mocks={baseMocks} addTypename={false}>
          <Story />
        </MockedProvider>
      </CreateContextProvider>
    ),
  ],
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts/[deposit-account-id]",
      },
    },
  },
}

export const Error: Story = {
  args: {
    params: Promise.resolve({ "deposit-account-id": mockPublicId }),
  },
  decorators: [
    (Story) => (
      <CreateContextProvider>
        <MockedProvider
          mocks={[
            {
              request: {
                query: GetDepositAccountDetailsPageDocument,
                variables: {
                  publicId: mockPublicId,
                },
              },
              error: new ApolloError({ errorMessage: "An error occurred" }),
            },
          ]}
          addTypename={false}
        >
          <Story />
        </MockedProvider>
      </CreateContextProvider>
    ),
  ],
}

export const NotFound: Story = {
  args: {
    params: Promise.resolve({ "deposit-account-id": mockPublicId }),
  },
  decorators: [
    (Story) => (
      <CreateContextProvider>
        <MockedProvider
          mocks={[
            {
              request: {
                query: GetDepositAccountDetailsPageDocument,
                variables: {
                  publicId: mockPublicId,
                },
              },
              result: {
                data: {
                  publicIdTarget: null,
                },
              },
            },
          ]}
          addTypename={false}
        >
          <Story />
        </MockedProvider>
      </CreateContextProvider>
    ),
  ],
}

const LoadingStory = () => {
  const mocks = [
    {
      request: {
        query: GetDepositAccountDetailsPageDocument,
        variables: {
          publicId: mockPublicId,
        },
      },
      delay: Infinity,
    },
  ]

  return (
    <CreateContextProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <DepositAccountPage
          params={Promise.resolve({ "deposit-account-id": mockPublicId })}
        />
      </MockedProvider>
    </CreateContextProvider>
  )
}

export const Loading: Story = {
  args: {
    params: Promise.resolve({ "deposit-account-id": mockPublicId }),
  },
  render: LoadingStory,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts/[deposit-account-id]",
      },
    },
  },
}
