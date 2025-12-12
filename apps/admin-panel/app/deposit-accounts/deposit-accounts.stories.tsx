import type { Meta, StoryObj } from "@storybook/nextjs"
import { ApolloError } from "@apollo/client"
import { MockedProvider } from "@apollo/client/testing"

import DepositAccountsPage from "./page"

import {
  DepositAccountStatus,
  DepositAccountsDocument,
} from "@/lib/graphql/generated"

const baseMocks = [
  {
    request: {
      query: DepositAccountsDocument,
      variables: {
        first: 10,
      },
    },
    result: {
      data: {
        depositAccounts: {
          __typename: "DepositAccountConnection",
          edges: [
            {
              node: {
                __typename: "DepositAccount",
                id: "1",
                depositAccountId: "DEP001",
                publicId: "DA-001",
                status: DepositAccountStatus.Active,
                balance: {
                  __typename: "DepositAccountBalance",
                  settled: 100000,
                  pending: 5000,
                },
                customer: {
                  __typename: "Customer",
                  customerId: "CUST001",
                  email: "customer1@example.com",
                },
              },
              cursor: "cursor1",
            },
            {
              node: {
                __typename: "DepositAccount",
                id: "2",
                depositAccountId: "DEP002",
                publicId: "DA-002",
                status: DepositAccountStatus.Frozen,
                balance: {
                  __typename: "DepositAccountBalance",
                  settled: 50000,
                  pending: 0,
                },
                customer: {
                  __typename: "Customer",
                  customerId: "CUST002",
                  email: "customer2@example.com",
                },
              },
              cursor: "cursor2",
            },
          ],
          pageInfo: {
            __typename: "PageInfo",
            endCursor: "cursor2",
            startCursor: "cursor1",
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      },
    },
  },
]

const meta = {
  title: "Pages/DepositAccounts",
  component: DepositAccountsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof DepositAccountsPage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <MockedProvider mocks={baseMocks} addTypename={false}>
        <Story />
      </MockedProvider>
    ),
  ],
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts",
      },
    },
  },
}

export const Error: Story = {
  decorators: [
    (Story) => (
      <MockedProvider
        mocks={[
          {
            request: {
              query: DepositAccountsDocument,
              variables: {
                first: 10,
              },
            },
            error: new ApolloError({ errorMessage: "An error occurred" }),
          },
        ]}
        addTypename={false}
      >
        <Story />
      </MockedProvider>
    ),
  ],
}

export const Empty: Story = {
  decorators: [
    (Story) => (
      <MockedProvider
        mocks={[
          {
            request: {
              query: DepositAccountsDocument,
              variables: {
                first: 10,
              },
            },
            result: {
              data: {
                depositAccounts: {
                  edges: [],
                  pageInfo: {
                    endCursor: null,
                    startCursor: null,
                    hasNextPage: false,
                    hasPreviousPage: false,
                  },
                },
              },
            },
          },
        ]}
        addTypename={false}
      >
        <Story />
      </MockedProvider>
    ),
  ],
}

const LoadingStory = () => {
  const mocks = [
    {
      request: {
        query: DepositAccountsDocument,
        variables: {
          first: 10,
        },
      },
      delay: Infinity,
    },
  ]

  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <DepositAccountsPage />
    </MockedProvider>
  )
}

export const Loading: Story = {
  render: LoadingStory,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts",
      },
    },
  },
}
