import { useState } from "react"
import { gql } from "@apollo/client"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { useWithdrawalInitiateMutation } from "@/lib/graphql/generated"
import { currencyConverter } from "@/lib/utils"

gql`
  mutation WithdrawalInitiate($input: WithdrawalInitiateInput!) {
    withdrawalInitiate(input: $input) {
      withdrawal {
        ...WithdrawalFields
        account {
          customer {
            id
            depositAccount {
              withdrawals {
                ...WithdrawalFields
              }
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

type UseCreateWithdrawalParams = {
  depositAccountId: string
  onSuccess?: () => void
}

type UseCreateWithdrawalReturn = {
  amount: string
  reference: string
  error: string | null
  loading: boolean
  setAmount: (value: string) => void
  setReference: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  reset: () => void
}

/**
 * Hook for creating a withdrawal
 * Handles form state, mutation, and success/error handling
 */
export function useCreateWithdrawal({
  depositAccountId,
  onSuccess,
}: UseCreateWithdrawalParams): UseCreateWithdrawalReturn {
  const t = useTranslations("Withdrawals.WithdrawalInitiateDialog")
  const router = useRouter()

  const [initiateWithdrawal, { loading, reset: resetMutation }] =
    useWithdrawalInitiateMutation({
      update: (cache) => {
        cache.modify({
          fields: {
            withdrawals: (_, { DELETE }) => DELETE,
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
      const result = await initiateWithdrawal({
        variables: {
          input: {
            depositAccountId,
            amount: currencyConverter.usdToCents(parseFloat(amount)),
            reference,
          },
        },
      })
      if (result.data) {
        toast.success(t("success"))
        router.push(
          `/withdrawals/${result.data.withdrawalInitiate.withdrawal.publicId}`
        )
        onSuccess?.()
      } else {
        throw new Error(t("errors.noData"))
      }
    } catch (error) {
      console.error("Error initiating withdrawal:", error)
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

