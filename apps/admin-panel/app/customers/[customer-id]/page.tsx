"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CustomerPage({
  params,
}: {
  params: Promise<{ "customer-id": string }>
}) {
  const { "customer-id": customerId } = use(params)
  const router = useRouter()

  useEffect(() => {
    router.replace(`/customers/${customerId}/credit-facilities`)
  }, [customerId, router])

  return null
}
