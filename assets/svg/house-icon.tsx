import * as React from "react"
import Svg, { Path } from "react-native-svg"
const HouseIcon = ({color, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="M2 16h3v-6h6v6h3V7L8 2.5 2 7v9Zm-2 2V6l8-6 8 6v12H9v-6H7v6H0Z"
    />
  </Svg>
)
export default HouseIcon
