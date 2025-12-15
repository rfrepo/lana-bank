"use client"

import React from "react"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@lana/web/ui/card"

type PageCardProps = {
    titleKey?: string
    className?: string
    translationKey?: string
    descriptionKey?: string
    children: React.ReactNode
}

export default function PageCard({
    children,
    className,
    translationKey,
    titleKey = "title",
    descriptionKey = "description",
}: PageCardProps) {
    const t = useTranslations(translationKey)

    const cardTitle = t(titleKey)
    const cardDescription = t(descriptionKey)

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    )
}

