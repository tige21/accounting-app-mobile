import * as React from "react"
import Svg, { Path } from "react-native-svg"
const OtherIcon = ({color, ...props}: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#969696"
      d="M5 11.5c.417 0 .77-.146 1.063-.438.291-.291.437-.645.437-1.062 0-.417-.146-.77-.438-1.063A1.447 1.447 0 0 0 5 8.5c-.417 0-.77.146-1.063.438A1.447 1.447 0 0 0 3.5 10c0 .417.146.77.438 1.063.291.291.645.437 1.062.437Zm5 0c.417 0 .77-.146 1.063-.438.291-.291.437-.645.437-1.062 0-.417-.146-.77-.438-1.063A1.447 1.447 0 0 0 10 8.5c-.417 0-.77.146-1.063.438A1.447 1.447 0 0 0 8.5 10c0 .417.146.77.438 1.063.291.291.645.437 1.062.437Zm5 0c.417 0 .77-.146 1.063-.438.291-.291.437-.645.437-1.062 0-.417-.146-.77-.438-1.063A1.447 1.447 0 0 0 15 8.5c-.417 0-.77.146-1.063.438A1.446 1.446 0 0 0 13.5 10c0 .417.146.77.438 1.063.291.291.645.437 1.062.437ZM10 20a9.738 9.738 0 0 1-3.9-.788 10.099 10.099 0 0 1-3.175-2.137c-.9-.9-1.612-1.958-2.137-3.175A9.738 9.738 0 0 1 0 10c0-1.383.263-2.683.787-3.9a10.099 10.099 0 0 1 2.138-3.175c.9-.9 1.958-1.612 3.175-2.137A9.738 9.738 0 0 1 10 0c1.383 0 2.683.263 3.9.787a10.098 10.098 0 0 1 3.175 2.138c.9.9 1.613 1.958 2.137 3.175A9.738 9.738 0 0 1 20 10a9.738 9.738 0 0 1-.788 3.9 10.098 10.098 0 0 1-2.137 3.175c-.9.9-1.958 1.613-3.175 2.137A9.738 9.738 0 0 1 10 20Zm0-2c2.233 0 4.125-.775 5.675-2.325C17.225 14.125 18 12.233 18 10c0-2.233-.775-4.125-2.325-5.675C14.125 2.775 12.233 2 10 2c-2.233 0-4.125.775-5.675 2.325C2.775 5.875 2 7.767 2 10c0 2.233.775 4.125 2.325 5.675C5.875 17.225 7.767 18 10 18Z"
    />
  </Svg>
)
export default OtherIcon
