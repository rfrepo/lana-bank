import type { Meta, StoryObj } from "@storybook/nextjs"
import { ApolloError } from "@apollo/client"
import { MockedProvider } from "@apollo/client/testing"

import DepositAccountsPage from "./page"

import faker from "@/.storybook/faker"

import {
  CustomersWithDepositAccountsDocument,
  DepositAccountStatus,
} from "@/lib/graphql/generated"

import {
  mockCustomerConnection,
  mockCustomerEdge,
  mockCustomer,
  mockDepositAccount,
  mockPageInfo,
} from "@/lib/graphql/generated/mocks"
import { UsdCents } from "@/types"

interface DepositAccountsPageStoryArgs {
  numberOfAccounts: number
  showEmptyState: boolean
}

const DEFAULT_ARGS: DepositAccountsPageStoryArgs = {
  numberOfAccounts: faker.number.int({ min: 5, max: 15 }),
  showEmptyState: false,
}

const createDepositAccountEdges = (args: DepositAccountsPageStoryArgs) => {
  if (args.showEmptyState) return []

  return Array.from({ length: args.numberOfAccounts }, (_, index) => {
    return mockCustomerEdge({
      cursor: `cursor-${index}`,
      node: mockCustomer({
        email: faker.internet.email(),
        depositAccount: mockDepositAccount({
          publicId: faker.string.alphanumeric(8),
          status: faker.helpers.arrayElement([
            DepositAccountStatus.Active,
            DepositAccountStatus.Frozen,
            DepositAccountStatus.Inactive,
          ]),
          balance: {
            settled: faker.number.int({ min: 0, max: 100000 }) as UsdCents,
            pending: faker.number.int({ min: 0, max: 10000 }) as UsdCents,
          },
        }),
      }),
    })
  })
}

const createMocks = (args: DepositAccountsPageStoryArgs) => {
  const edges = createDepositAccountEdges(args)

  return [
    {
      request: {
        query: CustomersWithDepositAccountsDocument,
        variables: {
          first: 1,
          after: undefined,
          sort: undefined,
          filter: undefined,
        },
      },
      result: {
        data: {
          customers: mockCustomerConnection({
            edges,
            pageInfo: mockPageInfo({
              hasNextPage: args.numberOfAccounts > 10,
              hasPreviousPage: false,
            }),
          }),
        },
      },
    },
  ]
}

const DepositAccountsPageStory = (args: DepositAccountsPageStoryArgs) => {
  const mocks = createMocks(args)

  return (
    <MockedProvider mocks={mocks} addTypename={false} key={JSON.stringify(args)}>
      <DepositAccountsPage />
    </MockedProvider>
  )
}

const meta: Meta<typeof DepositAccountsPageStory> = {
  title: "Pages/DepositAccounts",
  component: DepositAccountsPageStory,
  parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
  argTypes: {
    numberOfAccounts: {
      control: { type: "number", min: 0, max: 50 },
      description: "Number of deposit accounts to display",
    },
    showEmptyState: {
      control: "boolean",
      description: "Show empty state when no accounts exist",
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: DEFAULT_ARGS,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts",
      },
    },
  },
}

export const Empty: Story = {
  args: {
    ...DEFAULT_ARGS,
    showEmptyState: true,
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts",
      },
    },
  },
}

export const Error: Story = {
  args: DEFAULT_ARGS,
  render: () => {
    const errorMocks = [
      {
        request: {
          query: CustomersWithDepositAccountsDocument,
          variables: {
            first: 1,
            after: undefined,
            sort: undefined,
            filter: undefined,
          },
        },
        error: new ApolloError({ errorMessage: faker.lorem.sentence() }),
      },
    ]

    return (
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <DepositAccountsPage />
      </MockedProvider>
    )
  },
}

const LoadingStory = () => {
  const mocks = [
    {
      request: {
        query: CustomersWithDepositAccountsDocument,
        variables: {
          first: 1,
          after: undefined,
          sort: undefined,
          filter: undefined,
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
  args: DEFAULT_ARGS,
  render: LoadingStory,
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/deposit-accounts",
      },
    },
  },
}

