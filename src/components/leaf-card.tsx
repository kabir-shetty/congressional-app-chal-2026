import { View, type ViewProps } from "react-native";

import { useColors, type ColorName } from "@/theme/colors";
import { leaf } from "@/theme/shape";

type LeafCardProps = ViewProps & {
  // Background token; defaults to the plain surface.
  fill?: ColorName;
  // 2pt border token; none when omitted.
  border?: ColorName;
};

// The one container shape: a leaf (three round corners, one tight).
// Padding and gap are left to the caller since they vary per use.
export function LeafCard({ fill = "surface", border, style, ...props }: LeafCardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        leaf,
        { backgroundColor: colors[fill] },
        border && { borderWidth: 2, borderColor: colors[border] },
        style,
      ]}
      {...props}
    />
  );
}
