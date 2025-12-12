import type { Meta, StoryObj } from "@storybook/nextjs"
import { MockedProvider } from "@apollo/client/testing"

import CustomerLayout from "./layout"

import CustomerTransactionsPage from "./page"

import {
  GetCustomerBasicDetailsDocument,
  KycVerification,
  Activity,
} from "@/lib/graphql/generated"

const meta = {
  title: "Pages/Customers/Customer/Transactions",
  component: CustomerTransactionsPage,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
} satisfies Meta<typeof CustomerTransactionsPage>

export default meta
type Story = StoryObj<typeof meta>

const mockParams = { "customer-id": "4178b451-c9cb-4841-b248-5cc20e7774a6" }

const layoutMocks = [
  {
    request: {
      query: GetCustomerBasicDetailsDocument,
      variables: {
        id: "4178b451-c9cb-4841-b248-5cc20e7774a6",
      },
    },
    result: {
      data: {
        customer: {
          id: "Customer:4178b451-c9cb-4841-b248-5cc20e7774a6",
          customerId: "4178b451-c9cb-4841-b248-5cc20e7774a6",
          email: "test@lana.com",
          telegramId: "test",
          kycVerification: KycVerification.Rejected,
          activity: Activity.Active,
          level: "NOT_KYCED",
          createdAt: "2024-11-25T06:23:56.549713Z",
        },
      },
    },
  },
]

export const Default: Story = {
  args: {
    params: Promise.resolve(mockParams),
  },
  decorators: [
    (Story) => (
      <MockedProvider mocks={layoutMocks} addTypename={false}>
        <CustomerLayout params={Promise.resolve(mockParams)}>
          <Story />
        </CustomerLayout>
      </MockedProvider>
    ),
  ],
}
