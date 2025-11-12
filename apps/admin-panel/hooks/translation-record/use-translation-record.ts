import { useTranslations } from "next-intl"

type ExtractPropertyName<T extends string> = T extends `${string}.${infer Rest}`
  ? ExtractPropertyName<Rest>
  : T

type TranslationRecord<T extends readonly string[]> = {
  [K in T[number]as ExtractPropertyName<K>]: string
}

export function useTranslationRecord<
  TKeys extends readonly string[],
>(namespace: string, keys: TKeys): TranslationRecord<TKeys> {
  const t = useTranslations(namespace)

  return keys.reduce(
    (acc, key) => {
      const propertyName = key.split(".").pop() as ExtractPropertyName<
        TKeys[number]
      >
      acc[propertyName] = t(key)
      return acc
    },
    {} as TranslationRecord<TKeys>,
  )
}

