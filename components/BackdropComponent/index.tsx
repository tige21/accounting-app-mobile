import React, { memo } from "react";

import { BottomSheetBackdrop, BottomSheetBackdropProps } from "@gorhom/bottom-sheet";

const BackdropComponent = (backdropProps: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} {...backdropProps} />
);

export default memo(BackdropComponent);
