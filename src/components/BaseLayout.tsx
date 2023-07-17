import {Box} from "grommet";

export const BaseLayout: React.FC = ({children}) => {
  return <Box pad="16px">{children}</Box>
}