import * as React from "react"
import Svg, { Path } from "react-native-svg"
const EducationIcon = ({color, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="m11 18-7-3.8v-6L0 6l11-6 11 6v8h-2V7.1l-2 1.1v6L11 18Zm0-8.3L17.85 6 11 2.3 4.15 6 11 9.7Zm0 6.025 5-2.7V9.25L11 12 6 9.25v3.775l5 2.7Z"
    />
  </Svg>
)
export default EducationIcon
