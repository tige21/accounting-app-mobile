declare module "*.json";
declare module "*.jpg";
declare module "*.png";
declare module "*.ios.tsx";
declare module "*.android.tsx";
declare module "*.mp3";
declare module "*.tflite";
declare module "*.ttf";

declare module "*.svg" {
  import { FC } from "react";

  import { SvgProps } from "react-native-svg";

  const content: FC<SvgProps>;
  export default content;
}