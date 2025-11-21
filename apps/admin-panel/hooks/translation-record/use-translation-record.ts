import { useTranslations } from "next-intl"

export function useTranslationRecord<
  TKeys extends readonly string[],
>(namespace: string, keys: TKeys): string[] {
  const t = useTranslations(namespace)

  return keys.map((key) => t(key))
}

