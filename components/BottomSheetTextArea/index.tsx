import React, { FC, useCallback, useEffect } from "react";
import { 
  TextInputProps, 
  NativeSyntheticEvent, 
  TextInputFocusEventData,
  StyleSheet,
  View, 
  TextInput
} from "react-native";
import { useBottomSheetInternal } from "@gorhom/bottom-sheet";

interface IBottomSheetTextArea extends TextInputProps {
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
}

const BottomSheetTextArea: FC<IBottomSheetTextArea> = ({ 
  onFocus, 
  onBlur, 
  style,
  ...props 
}) => {
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
    <View style={styles.container}>
      <TextInput 
        onFocus={handleOnFocus} 
        onBlur={handleOnBlur}
        multiline
        style={[styles.input, style]}
        {...props} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    backgroundColor: 'teal',
    borderRadius: 12,
  },
  input: {
    height: '100%',
    paddingTop: 12,
    paddingBottom: 12,
  }
});

export default BottomSheetTextArea; 