"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lana/web/ui/card"

import type { TransactionTableCardProps } from "./types"
import { TransactionTable } from "./transaction-table"

export function TransactionTableCard({
  title,
  description,
  ...tableProps
}: TransactionTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <TransactionTable {...tableProps} />
      </CardContent>
    </Card>
  )
}

