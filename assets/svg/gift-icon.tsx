import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from '@/constants/Colors'
const GiftIcon = ({color=Colors.red_3, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="M4 22V11H2V5H7.2C7.11667 4.85 7.0625 4.69167 7.0375 4.525C7.0125 4.35833 7 4.18333 7 4C7 3.16667 7.29167 2.45833 7.875 1.875C8.45833 1.29167 9.16667 1 10 1C10.3833 1 10.7417 1.07083 11.075 1.2125C11.4083 1.35417 11.7167 1.55 12 1.8C12.2833 1.53333 12.5917 1.33333 12.925 1.2C13.2583 1.06667 13.6167 1 14 1C14.8333 1 15.5417 1.29167 16.125 1.875C16.7083 2.45833 17 3.16667 17 4C17 4.18333 16.9833 4.35417 16.95 4.5125C16.9167 4.67083 16.8667 4.83333 16.8 5H22V11H20V22H4ZM14 3C13.7167 3 13.4792 3.09583 13.2875 3.2875C13.0958 3.47917 13 3.71667 13 4C13 4.28333 13.0958 4.52083 13.2875 4.7125C13.4792 4.90417 13.7167 5 14 5C14.2833 5 14.5208 4.90417 14.7125 4.7125C14.9042 4.52083 15 4.28333 15 4C15 3.71667 14.9042 3.47917 14.7125 3.2875C14.5208 3.09583 14.2833 3 14 3ZM9 4C9 4.28333 9.09583 4.52083 9.2875 4.7125C9.47917 4.90417 9.71667 5 10 5C10.2833 5 10.5208 4.90417 10.7125 4.7125C10.9042 4.52083 11 4.28333 11 4C11 3.71667 10.9042 3.47917 10.7125 3.2875C10.5208 3.09583 10.2833 3 10 3C9.71667 3 9.47917 3.09583 9.2875 3.2875C9.09583 3.47917 9 3.71667 9 4ZM4 7V9H11V7H4ZM11 20V11H6V20H11ZM13 20H18V11H13V20ZM20 9V7H13V9H20Z"
  />
  </Svg>
)
export default GiftIcon