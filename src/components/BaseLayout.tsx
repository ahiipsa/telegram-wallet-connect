import * as React from 'react'
import {Box} from "grommet";

export const BaseLayout: React.FunctionComponent<{children: React.ReactNode}> = ({children}) => {
  return <Box pad="16px" fill align="center" justify="center">{children}</Box>
}