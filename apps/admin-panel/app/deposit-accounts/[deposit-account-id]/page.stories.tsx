import type { Meta, StoryObj } from "@storybook/nextjs"
import { ApolloError } from "@apollo/client"
import { MockedProvider } from "@apollo/client/testing"

import DepositAccountPage from "./page"

import faker from "@/.storybook/faker"

import {
    GetDepositAccountByPublicIdDocument,
    DepositAccountStatus,
} from "@/lib/graphql/generated"

import {
    mockDepositAccount,
    mockCustomer,
    mockDepositAccountBalance,
    mockDepositAccountLedgerAccounts,
} from "@/lib/graphql/generated/mocks"
import { UsdCents } from "@/types"

interface DepositAccountPageStoryArgs {
    status: DepositAccountStatus
    settledBalance: number
    pendingBalance: number
    publicId: string
}

const DEFAULT_ARGS: DepositAccountPageStoryArgs = {
    status: DepositAccountStatus.Active,
    settledBalance: faker.number.int({ min: 1000, max: 100000 }),
    pendingBalance: faker.number.int({ min: 0, max: 5000 }),
    publicId: faker.string.alphanumeric(8),
}

const createMocks = (args: DepositAccountPageStoryArgs) => {
    return [
        {
            request: {
                query: GetDepositAccountByPublicIdDocument,
                variables: {
                    publicId: args.publicId,
                },
            },
            result: {
                data: {
                    publicIdTarget: mockDepositAccount({
                        publicId: args.publicId,
                        status: args.status,
                        balance: mockDepositAccountBalance({
                            settled: args.settledBalance as UsdCents,
                            pending: args.pendingBalance as UsdCents,
                        }),
                        customer: mockCustomer({
                            email: faker.internet.email(),
                        }),
                        ledgerAccounts: mockDepositAccountLedgerAccounts({
                            depositAccountId: faker.string.uuid(),
                            frozenDepositAccountId: faker.string.uuid(),
                        }),
                    }),
                },
            },
        },
    ]
}

const DepositAccountPageStory = (args: DepositAccountPageStoryArgs) => {
    const mocks = createMocks(args)

    return (
        <MockedProvider mocks={mocks} addTypename={false} key={JSON.stringify(args)}>
            <DepositAccountPage
                params={Promise.resolve({ "deposit-account-id": args.publicId })}
            />
        </MockedProvider>
    )
}

const meta: Meta<typeof DepositAccountPageStory> = {
    title: "Pages/DepositAccountDetails",
    component: DepositAccountPageStory,
    parameters: { layout: "fullscreen", nextjs: { appDirectory: true } },
    argTypes: {
        status: {
            control: "select",
            options: [
                DepositAccountStatus.Active,
                DepositAccountStatus.Frozen,
                DepositAccountStatus.Inactive,
            ],
            description: "Status of the deposit account",
        },
        settledBalance: {
            control: { type: "number", min: 0, max: 1000000, step: 1 },
            description: "Settled balance (in USD cents)",
        },
        pendingBalance: {
            control: { type: "number", min: 0, max: 100000, step: 1 },
            description: "Pending balance (in USD cents)",
        },
        publicId: {
            control: "text",
            description: "Public ID of the deposit account",
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
                pathname: `/deposit-accounts/${DEFAULT_ARGS.publicId}`,
            },
        },
    },
}

export const Frozen: Story = {
    args: {
        ...DEFAULT_ARGS,
        status: DepositAccountStatus.Frozen,
    },
    parameters: {
        nextjs: {
            navigation: {
                pathname: `/deposit-accounts/${DEFAULT_ARGS.publicId}`,
            },
        },
    },
}

export const Inactive: Story = {
    args: {
        ...DEFAULT_ARGS,
        status: DepositAccountStatus.Inactive,
    },
    parameters: {
        nextjs: {
            navigation: {
                pathname: `/deposit-accounts/${DEFAULT_ARGS.publicId}`,
            },
        },
    },
}

export const HighBalance: Story = {
    args: {
        ...DEFAULT_ARGS,
        settledBalance: 500000,
        pendingBalance: 25000,
    },
    parameters: {
        nextjs: {
            navigation: {
                pathname: `/deposit-accounts/${DEFAULT_ARGS.publicId}`,
            },
        },
    },
}

export const NotFound: Story = {
    args: DEFAULT_ARGS,
    render: () => {
        const mocks = [
            {
                request: {
                    query: GetDepositAccountByPublicIdDocument,
                    variables: {
                        publicId: DEFAULT_ARGS.publicId,
                    },
                },
                result: {
                    data: {
                        publicIdTarget: null,
                    },
                },
            },
        ]

        return (
            <MockedProvider mocks={mocks} addTypename={false}>
                <DepositAccountPage
                    params={Promise.resolve({
                        "deposit-account-id": DEFAULT_ARGS.publicId,
                    })}
                />
            </MockedProvider>
        )
    },
}

export const Error: Story = {
    args: DEFAULT_ARGS,
    render: () => {
        const errorMocks = [
            {
                request: {
                    query: GetDepositAccountByPublicIdDocument,
                    variables: {
                        publicId: DEFAULT_ARGS.publicId,
                    },
                },
                error: new ApolloError({ errorMessage: faker.lorem.sentence() }),
            },
        ]

        return (
            <MockedProvider mocks={errorMocks} addTypename={false}>
                <DepositAccountPage
                    params={Promise.resolve({
                        "deposit-account-id": DEFAULT_ARGS.publicId,
                    })}
                />
            </MockedProvider>
        )
    },
}

const LoadingStory = () => {
    const mocks = [
        {
            request: {
                query: GetDepositAccountByPublicIdDocument,
                variables: {
                    publicId: DEFAULT_ARGS.publicId,
                },
            },
            delay: Infinity,
        },
    ]

    return (
        <MockedProvider mocks={mocks} addTypename={false}>
            <DepositAccountPage
                params={Promise.resolve({
                    "deposit-account-id": DEFAULT_ARGS.publicId,
                })}
            />
        </MockedProvider>
    )
}

export const Loading: Story = {
    args: DEFAULT_ARGS,
    render: LoadingStory,
    parameters: {
        nextjs: {
            navigation: {
                pathname: `/deposit-accounts/${DEFAULT_ARGS.publicId}`,
            },
        },
    },
}










