import * as React from "react"
import Svg, { Path } from "react-native-svg"
import Colors from '@/constants/Colors'
const HealthIcon = ({color=Colors.red_1, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={color}
      d="M12 21C11.7 21 11.4125 20.9458 11.1375 20.8375C10.8625 20.7292 10.6167 20.5667 10.4 20.35L3.7 13.625C3.11667 13.0417 2.6875 12.375 2.4125 11.625C2.1375 10.875 2 10.0917 2 9.275C2 7.55833 2.55833 6.08333 3.675 4.85C4.79167 3.61667 6.18333 3 7.85 3C8.65 3 9.40417 3.15833 10.1125 3.475C10.8208 3.79167 11.45 4.23333 12 4.8C12.5333 4.23333 13.1542 3.79167 13.8625 3.475C14.5708 3.15833 15.325 3 16.125 3C17.7917 3 19.1875 3.61667 20.3125 4.85C21.4375 6.08333 22 7.55 22 9.25C22 10.0667 21.8583 10.85 21.575 11.6C21.2917 12.35 20.8667 13.0167 20.3 13.6L13.575 20.35C13.3583 20.5667 13.1167 20.7292 12.85 20.8375C12.5833 20.9458 12.3 21 12 21ZM13 8C13.1667 8 13.325 8.04167 13.475 8.125C13.625 8.20833 13.7417 8.31667 13.825 8.45L15.525 11H19.675C19.7917 10.7167 19.8792 10.4292 19.9375 10.1375C19.9958 9.84583 20.025 9.55 20.025 9.25C19.9917 8.1 19.6083 7.1125 18.875 6.2875C18.1417 5.4625 17.225 5.05 16.125 5.05C15.6083 5.05 15.1125 5.15 14.6375 5.35C14.1625 5.55 13.75 5.84167 13.4 6.225L12.725 6.95C12.6417 7.05 12.5333 7.12917 12.4 7.1875C12.2667 7.24583 12.1333 7.275 12 7.275C11.8667 7.275 11.7333 7.24583 11.6 7.1875C11.4667 7.12917 11.35 7.05 11.25 6.95L10.575 6.225C10.225 5.84167 9.81667 5.54167 9.35 5.325C8.88333 5.10833 8.38333 5 7.85 5C6.75 5 5.83333 5.42083 5.1 6.2625C4.36667 7.10417 4 8.1 4 9.25C4 9.55 4.025 9.84583 4.075 10.1375C4.125 10.4292 4.20833 10.7167 4.325 11H9C9.16667 11 9.325 11.0417 9.475 11.125C9.625 11.2083 9.74167 11.3167 9.825 11.45L10.7 12.75L12.05 8.7C12.1167 8.5 12.2375 8.33333 12.4125 8.2C12.5875 8.06667 12.7833 8 13 8ZM13.3 11.25L11.95 15.3C11.8833 15.5 11.7583 15.6667 11.575 15.8C11.3917 15.9333 11.1917 16 10.975 16C10.8083 16 10.65 15.9583 10.5 15.875C10.35 15.7917 10.2333 15.6833 10.15 15.55L8.45 13H5.9L11.825 18.925C11.8583 18.9583 11.8875 18.9792 11.9125 18.9875C11.9375 18.9958 11.9667 19 12 19C12.0333 19 12.0625 18.9958 12.0875 18.9875C12.1125 18.9792 12.1417 18.9583 12.175 18.925L18.075 13H15C14.8333 13 14.675 12.9583 14.525 12.875C14.375 12.7917 14.25 12.6833 14.15 12.55L13.3 11.25Z"
    />
  </Svg>
)
export default HealthIcon

