import { gql } from "@apollo/client"

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFields on PageInfo {
    endCursor
    startCursor
    hasNextPage
    hasPreviousPage
  }
`

