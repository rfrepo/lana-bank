"use client"

import Link from "next/link"
import { HiArrowRight } from "react-icons/hi"
import { useTranslations } from "next-intl"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@lana/web/ui/card"
import { Button } from "@lana/web/ui/button"

import type { DepositAccountData } from "@/hooks/deposit-account/use-deposit-account"

type CustomerCardProps = {
    customer: NonNullable<DepositAccountData["customer"]>
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
    const t = useTranslations("DepositAccounts.CustomerCard")

    return (
        <Card className="w-full md:w-1/4 py-3">
            <CardHeader className="py-0 my-0 mb-3" >
                <CardTitle className="text-md font-semibold">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent className="py-1 my-0 ">
                <div className="flex flex-col gap-11">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                {t("labels.email")}:
                            </span>
                            <span className="text-sm">{customer.email}</span>
                        </div>
                        {customer.telegramId && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {t("labels.telegram")}:
                                </span>
                                <span className="text-sm">{customer.telegramId}</span>
                            </div>
                        )}
                    </div>

                    <Link href={`/customers/${customer.publicId}`}>
                        <Button variant="outline">
                            {t("buttonText")}
                            <HiArrowRight />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export default CustomerCard

