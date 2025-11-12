type InlineErrorTextProps = {
    message?: string | null
}

const InlineErrorText = ({ message }: InlineErrorTextProps) => message ? <p className="text-destructive text-sm" > { message } </p> : null

export default InlineErrorText

