import { renderHook } from "@testing-library/react"
import { useTranslationRecord } from "./use-translation-record"
import { useTranslations } from "next-intl"

jest.mock("next-intl", () => ({
    useTranslations: jest.fn(),
}))

const mockUseTranslations = useTranslations as jest.MockedFunction<
    typeof useTranslations
>

describe("useTranslationRecord", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should return an object with translated values for flat keys", () => {
        const mockT = jest.fn((key: string) => `translated-${key}`)
        mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

        const { result } = renderHook(() =>
            useTranslationRecord("TestNamespace", ["title", "description"] as const),
        )

        expect(mockUseTranslations).toHaveBeenCalledWith("TestNamespace")
        expect(mockT).toHaveBeenCalledWith("title")
        expect(mockT).toHaveBeenCalledWith("description")
        expect(result.current).toEqual({
            title: "translated-title",
            description: "translated-description",
        })
    })

    it("should return an object with translated values for nested keys", () => {
        const mockT = jest.fn((key: string) => `translated-${key}`)
        mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

        const { result } = renderHook(() =>
            useTranslationRecord("TestNamespace", [
                "table.headers.customer",
                "table.headers.status",
            ] as const),
        )

        expect(mockUseTranslations).toHaveBeenCalledWith("TestNamespace")
        expect(mockT).toHaveBeenCalledWith("table.headers.customer")
        expect(mockT).toHaveBeenCalledWith("table.headers.status")
        expect(result.current).toEqual({
            "table.headers.customer": "translated-table.headers.customer",
            "table.headers.status": "translated-table.headers.status",
        })
    })

    it("should return an object with mixed flat and nested keys", () => {
        const mockT = jest.fn((key: string) => `translated-${key}`)
        mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

        const { result } = renderHook(() =>
            useTranslationRecord("TestNamespace", [
                "title",
                "table.headers.customer",
                "description",
            ] as const),
        )

        expect(mockUseTranslations).toHaveBeenCalledWith("TestNamespace")
        expect(mockT).toHaveBeenCalledWith("title")
        expect(mockT).toHaveBeenCalledWith("table.headers.customer")
        expect(mockT).toHaveBeenCalledWith("description")
        expect(result.current).toEqual({
            title: "translated-title",
            "table.headers.customer": "translated-table.headers.customer",
            description: "translated-description",
        })
    })

    it("should handle empty keys array", () => {
        const mockT = jest.fn((key: string) => `translated-${key}`)
        mockUseTranslations.mockReturnValue(mockT as ReturnType<typeof useTranslations>)

        const { result } = renderHook(() =>
            useTranslationRecord("TestNamespace", [] as const),
        )

        expect(mockUseTranslations).toHaveBeenCalledWith("TestNamespace")
        expect(result.current).toEqual({})
    })
})

