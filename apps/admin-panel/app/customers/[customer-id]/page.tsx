"use client"

import { use } from "react"

import CustomerCreditFacilities from "./credit-facilities/customer-credit-facilities"

export default function CustomerTransactionsPage({
  params,
}: {
  params: Promise<{ "customer-id": string }>
}) {
  use(params)

  return <div className="space-y-6">
    <CustomerCreditFacilities params={params} />
  </div>
}
