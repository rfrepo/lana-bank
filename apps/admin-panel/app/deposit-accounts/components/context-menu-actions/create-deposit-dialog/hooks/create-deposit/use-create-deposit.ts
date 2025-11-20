import { useState } from "react"
import { gql, useApolloClient } from "@apollo/client"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  GetCustomerBasicDetailsDocument,
  useCreateDepositMutation,
} from "@/lib/graphql/generated"
import { currencyConverter } from "@/lib/utils"

gql`
  mutation CreateDeposit($input: DepositRecordInput!) {
    depositRecord(input: $input) {
      deposit {
        ...DepositFields
        account {
          customer {
            id
            customerId
            depositAccount {
              id
              deposits {
                ...DepositFields
              }
            }
            depositAccount {
              id
              balance {
                settled
                pending
              }
            }
          }
        }
      }
    }
  }
`

type UseCreateDepositParams = {
  depositAccountId: string
  onSuccess?: () => void
}

type UseCreateDepositReturn = {
  amount: string
  reference: string
  error: string | null
  loading: boolean
  setAmount: (value: string) => void
  setReference: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
}


export function useCreateDeposit({
  depositAccountId,
  onSuccess,
}: UseCreateDepositParams): UseCreateDepositReturn {
  const t = useTranslations("Deposits.CreateDepositDialog")
  const router = useRouter()
  const client = useApolloClient()

  const [createDeposit, { loading, reset: resetMutation }] = useCreateDepositMutation({
    update: (cache) => {
      cache.modify({
        fields: {
          deposits: (_, { DELETE }) => DELETE,
        },
      })
      cache.gc()
    },
  })

  const [amount, setAmount] = useState<string>("")
  const [reference, setReference] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const result = await createDeposit({
        variables: {
          input: {
            depositAccountId,
            amount: currencyConverter.usdToCents(parseFloat(amount)),
            reference,
          },
        },
      })
      if (result.data) {
        await client.query({
          query: GetCustomerBasicDetailsDocument,
          variables: {
            id: result.data.depositRecord.deposit.account.customer.customerId,
          },
          fetchPolicy: "network-only",
        })
        toast.success(t("success"))
        router.push(`/deposits/${result.data.depositRecord.deposit.publicId}`)
        onSuccess?.()
      } else {
        throw new Error(t("errors.noData"))
      }
    } catch (error) {
      console.error("Error creating deposit:", error)
      setError(error instanceof Error ? error.message : t("errors.unknown"))
    }
  }

  const reset = () => {
    setAmount("")
    setReference("")
    setError(null)
    resetMutation()
  }

  return {
    amount,
    reference,
    error,
    loading,
    setAmount,
    setReference,
    handleSubmit,
    reset,
  }
}

