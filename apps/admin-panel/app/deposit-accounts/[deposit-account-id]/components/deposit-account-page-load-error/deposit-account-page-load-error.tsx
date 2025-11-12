"use client"

interface DepositAccountPageLoadErrorProps {
    error: Error
}

export default function DepositAccountPageLoadError({
    error,
}: DepositAccountPageLoadErrorProps) {
    return (
        <main className="max-w-7xl m-auto">
            <div className="text-destructive" role="alert">
                {error.message || "An error occurred while loading the deposit account"}
            </div>
        </main>
    )
}

