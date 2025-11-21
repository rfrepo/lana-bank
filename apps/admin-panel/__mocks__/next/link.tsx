import React from 'react'
import { jest } from '@jest/globals'

const Link = jest.fn(({ children, href, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
))

export default Link

