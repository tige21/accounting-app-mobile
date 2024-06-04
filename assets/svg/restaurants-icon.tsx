import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from '@/constants/Colors'
const RestaurantsIcon = ({color=Colors.yellow, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={18}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="m2.375 18-1.4-1.4 10.25-10.25c-.3-.7-.342-1.492-.125-2.375.217-.883.692-1.675 1.425-2.375.883-.883 1.867-1.4 2.95-1.55 1.083-.15 1.967.117 2.65.8.683.683.95 1.567.8 2.65-.15 1.083-.667 2.067-1.55 2.95-.7.733-1.492 1.208-2.375 1.425-.883.217-1.675.175-2.375-.125L11.375 9l7.6 7.6-1.4 1.4-7.6-7.55-7.6 7.55Zm2.95-8.55-3-3c-.9-.9-1.35-1.975-1.35-3.225S1.425.9 2.325 0l6.2 6.25-3.2 3.2Z"
    />
  </Svg>
)
export default RestaurantsIcon
