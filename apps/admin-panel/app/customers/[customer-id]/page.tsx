"use client"

import { use } from "react"

export default function CustomerTransactionsPage({
  params,
}: {
  params: Promise<{ "customer-id": string }>
}) {
  use(params)

  return <div className="space-y-6"></div>
}
