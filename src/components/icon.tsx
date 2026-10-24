import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { View, type ColorValue } from "react-native";

// Every icon the app uses, named once here: SF Symbols on iOS, Material
// Symbols on Android/web. Screens refer to icons by key so the platform
// names (and their typos) live in one place.
const icons = {
  home: { ios: "house.fill", android: "home", web: "home" },
  search: { ios: "magnifyingglass", android: "search", web: "search" },
  quiz: { ios: "questionmark.circle.fill", android: "help", web: "help" },
  sparkles: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  addPhoto: { ios: "photo.badge.plus", android: "add_photo_alternate", web: "add_photo_alternate" },
  check: { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" },
  chevron: { ios: "chevron.right", android: "chevron_right", web: "chevron_right" },
  shield: { ios: "checkmark.shield.fill", android: "verified_user", web: "verified_user" },
  arrow: { ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" },
  refresh: { ios: "arrow.clockwise", android: "refresh", web: "refresh" },
  play: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
  flag: { ios: "flag.fill", android: "flag", web: "flag" },
  moon: { ios: "moon.fill", android: "dark_mode", web: "dark_mode" },
  sun: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" },
} satisfies Record<string, SymbolViewProps["name"]>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  color: ColorValue;
  size?: number;
};

// Icons are decorative: each sits beside a text label or inside a control
// that carries its own accessibilityLabel, so they're hidden from screen
// readers to avoid announcing them twice.
export function Icon({ name, color, size = 24 }: IconProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SymbolView name={icons[name]} tintColor={color} size={size} />
    </View>
  );
}
