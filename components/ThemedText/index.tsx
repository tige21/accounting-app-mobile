import React from "react";
import { StyleSheet, Text, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link" | "caption" | "body" | "heading" | "primary" | "secondary" | "tertiary" | "disabled";
  colorName?: "text" | "textPrimary" | "textSecondary" | "textTertiary" | "textDisabled" | "primary" | "success" | "warning" | "error";
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  colorName,
  ...rest
}: ThemedTextProps) {
  // Определяем цвет на основе типа или colorName
  let resolvedColorName: ThemedTextProps["colorName"] = "text";
  
  if (colorName) {
    resolvedColorName = colorName;
  } else {
    switch (type) {
      case "primary":
        resolvedColorName = "textPrimary";
        break;
      case "secondary":
        resolvedColorName = "textSecondary";
        break;
      case "tertiary":
        resolvedColorName = "textTertiary";
        break;
      case "disabled":
        resolvedColorName = "textDisabled";
        break;
      case "link":
        resolvedColorName = "primary";
        break;
      case "heading":
      case "title":
        resolvedColorName = "textPrimary";
        break;
      default:
        resolvedColorName = "text";
    }
  }

  const color = useThemeColor({ light: lightColor, dark: darkColor }, resolvedColorName);

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        type === "caption" ? styles.caption : undefined,
        type === "body" ? styles.body : undefined,
        type === "heading" ? styles.heading : undefined,
        type === "primary" ? styles.primary : undefined,
        type === "secondary" ? styles.secondary : undefined,
        type === "tertiary" ? styles.tertiary : undefined,
        type === "disabled" ? styles.disabled : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 28,
  },
  primary: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  secondary: {
    fontSize: 14,
    lineHeight: 20,
  },
  tertiary: {
    fontSize: 12,
    lineHeight: 16,
  },
  disabled: {
    fontSize: 16,
    lineHeight: 24,
  },
});
