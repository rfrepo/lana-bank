import { renderHook } from "@testing-library/react"
import { expect, it, describe, beforeEach, jest } from "@jest/globals"

import { useTranslations } from "next-intl"

import { useTranslationRecord } from "../use-translation-record"

const mockUseTranslations = useTranslations as jest.MockedFunction<
  typeof useTranslations
>

describe("useTranslationRecord", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const renderHookAndAssertTranslationRecord = ({
    namespace,
    keys,
    expectedResult,
    expectedTranslationCalls,
  }: {
    namespace: string
    keys: readonly string[]
    expectedResult: string[]
    expectedTranslationCalls: string[]
  }) => {
    const mockT = jest.fn((key: string) => `translated-${key}`)
    mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

    const { result } = renderHook(() =>
      useTranslationRecord(namespace, keys),
    )

    expect(mockUseTranslations).toHaveBeenCalledWith(namespace)
    expectedTranslationCalls.forEach((key) => {
      expect(mockT).toHaveBeenCalledWith(key)
    })
    expect(result.current).toEqual(expectedResult)
  }

  it("should return an array with translated values for flat keys", () => {
    renderHookAndAssertTranslationRecord({
      namespace: "TestNamespace",
      keys: ["title", "description"] as const,
      expectedResult: [
        "translated-title",
        "translated-description",
      ],
      expectedTranslationCalls: ["title", "description"],
    })
  })

  it("should return an array with translated values for nested keys", () => {
    renderHookAndAssertTranslationRecord({
      namespace: "TestNamespace",
      keys: ["table.headers.customer", "table.headers.status"] as const,
      expectedResult: [
        "translated-table.headers.customer",
        "translated-table.headers.status",
      ],
      expectedTranslationCalls: ["table.headers.customer", "table.headers.status"],
    })
  })

  it("should return an array with mixed flat and nested keys", () => {
    renderHookAndAssertTranslationRecord({
      namespace: "TestNamespace",
      keys: ["title", "table.headers.customer", "description"] as const,
      expectedResult: [
        "translated-title",
        "translated-table.headers.customer",
        "translated-description",
      ],
      expectedTranslationCalls: ["title", "table.headers.customer", "description"],
    })
  })

  it("should handle empty keys array", () => {
    const mockT = jest.fn((key: string) => `translated-${key}`)
    mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

    const { result } = renderHook(() =>
      useTranslationRecord("TestNamespace", [] as const),
    )

    expect(mockUseTranslations).toHaveBeenCalledWith("TestNamespace")
    expect(result.current).toEqual([])
  })
})

