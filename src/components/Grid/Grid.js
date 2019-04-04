import React from 'react'
import { Row } from 'antd'
import { gutters } from './responsive'

const Grid = ({ col = 4, gutter = 1, children, ...restProps }) => {
  const column = col
  const space = gutters[gutter] || gutter
  return (
    <Row gutter={space} {...restProps}>
      {React.Children.map(children, child =>
        child ? React.cloneElement(child, { column }) : child
      )}
    </Row>
  )
}

export default Grid
