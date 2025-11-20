import { useEffect } from "react"

import {
  type ContextMenuButtonProps,
  useSetContextMenuButtonProps,
} from "../../store/context-menu-actions-store"

export const useSetupContextMenuActionsUIProps = (
    props: ContextMenuButtonProps | null
) => {
    const setButtonProps = useSetContextMenuButtonProps()

    useEffect(() => {
        setButtonProps(props)
    }, [props, setButtonProps])
}

