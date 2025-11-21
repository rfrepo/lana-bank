export type ContextMenuAllowedPath = string | RegExp

export const isPathAllowed = (
  allowedPaths: ContextMenuAllowedPath[],
  currentPath: string,
): boolean =>
  allowedPaths.some((path) => {
    if (typeof path === "string") return path === currentPath
    if (path instanceof RegExp) return path.test(currentPath)
    return false
  })

