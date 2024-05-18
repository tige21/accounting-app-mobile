import * as React from "react"
import Svg, { SvgProps, Circle, Path } from "react-native-svg"

const SvgComponent = (props: SvgProps) => (
  <Svg
    width={70}
    height={70}
    fill="none"
    {...props}
  >
    <Circle cx={35} cy={35} r={35} fill="#E8E9FF" />
    <Circle cx={34.5} cy={34.5} r={25.5} fill="#3D42C4" />
    <Path
      fill="#fff"
      d="M33.916 36.083h-6.5v-2.166h6.5v-6.5h2.167v6.5h6.5v2.166h-6.5v6.5h-2.166v-6.5Z"
    />
  </Svg>
)
export default SvgComponent
