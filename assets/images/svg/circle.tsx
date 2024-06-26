import * as React from "react"
import Svg, { Circle, SvgProps } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg fill="none" width={20}
    height={20} {...props}>
    <Circle cx={10} cy={10} r={9} stroke="#989FAC" />
  </Svg>
)
export default SvgComponent
