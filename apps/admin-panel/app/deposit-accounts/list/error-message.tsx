type ErrorMessageProps = {
    error?: Error | null
}

export const ErrorMessage = ({ error }: ErrorMessageProps) => error
    ? <p className="text-destructive text-sm">{error.message}</p>
    : null 