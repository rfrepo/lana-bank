import { useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"

import { isPathAllowed, type ContextMenuAllowedPath } from "../../utils/context-menu-utils"
import { useClearContextMenuButtonProps } from "../../store/context-menu-actions-store"

type ConfigWithAllowedPaths = {
    allowedPaths: ContextMenuAllowedPath[]
}

export const useShouldShowContextMenu = (
    configs: ConfigWithAllowedPaths[]
): boolean => {
    const pathname = usePathname()
    const clearButtonProps = useClearContextMenuButtonProps()

    const shouldShow = useMemo(() => {
        return configs.some((config) =>
            isPathAllowed(config.allowedPaths, pathname)
        )
    }, [configs, pathname])

    useEffect(() => {
        if (!shouldShow) {
            clearButtonProps()
        }
    }, [shouldShow, clearButtonProps])

    return shouldShow
}

