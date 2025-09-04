import React, { FC, useCallback, useEffect } from "react";
import { TextInputProps, NativeSyntheticEvent, TextInputFocusEventData } from "react-native";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";
import CommonInput from "../CommonInput";

interface IBottomSheetInput extends TextInputProps {
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const BottomSheetInput: FC<IBottomSheetInput> = ({ onFocus, onBlur, ...props }) => {
  const { shouldHandleKeyboardEvents } = useBottomSheetInternal();

  useEffect(
    () => () => {
      shouldHandleKeyboardEvents.value = false;
    },
    [shouldHandleKeyboardEvents],
  );

  const handleOnFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = true;
      onFocus?.(e);
    },
    [onFocus, shouldHandleKeyboardEvents],
  );

  const handleOnBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      shouldHandleKeyboardEvents.value = false;
      onBlur?.(e);
    },
    [onBlur, shouldHandleKeyboardEvents],
  );

  return (
    <CommonInput 
      onFocus={handleOnFocus} 
      onBlur={handleOnBlur} 
      placeholder=""
      {...props} 
    />
  );
};

export default BottomSheetInput; 