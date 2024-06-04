import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from '@/constants/Colors'
const StockIcon = ({color=Colors.blue_6, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="M2.625 18.175L1 17L6 9L9 12.5L13 6L15.725 10.075C15.3417 10.0917 14.9792 10.1375 14.6375 10.2125C14.2958 10.2875 13.9583 10.3917 13.625 10.525L13.075 9.7L9.275 15.875L6.25 12.35L2.625 18.175ZM21.575 23L18.45 19.875C18.1167 20.1083 17.7458 20.2833 17.3375 20.4C16.9292 20.5167 16.5083 20.575 16.075 20.575C14.825 20.575 13.7625 20.1375 12.8875 19.2625C12.0125 18.3875 11.575 17.325 11.575 16.075C11.575 14.825 12.0125 13.7625 12.8875 12.8875C13.7625 12.0125 14.825 11.575 16.075 11.575C17.325 11.575 18.3875 12.0125 19.2625 12.8875C20.1375 13.7625 20.575 14.825 20.575 16.075C20.575 16.5083 20.5167 16.9292 20.4 17.3375C20.2833 17.7458 20.1083 18.125 19.875 18.475L23 21.575L21.575 23ZM16.075 18.575C16.775 18.575 17.3667 18.3333 17.85 17.85C18.3333 17.3667 18.575 16.775 18.575 16.075C18.575 15.375 18.3333 14.7833 17.85 14.3C17.3667 13.8167 16.775 13.575 16.075 13.575C15.375 13.575 14.7833 13.8167 14.3 14.3C13.8167 14.7833 13.575 15.375 13.575 16.075C13.575 16.775 13.8167 17.3667 14.3 17.85C14.7833 18.3333 15.375 18.575 16.075 18.575ZM18.3 10.575C17.9833 10.4417 17.6542 10.3333 17.3125 10.25C16.9708 10.1667 16.6167 10.1167 16.25 10.1L21.375 2L23 3.175L18.3 10.575Z"
  />
  </Svg>
)
export default StockIcon
