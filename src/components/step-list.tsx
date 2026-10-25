import { StyleSheet, Text, View } from "react-native";

import { AppText } from "@/components/app-text";
import { makeStyles } from "@/theme/colors";
import { fonts } from "@/theme/type";

type StepListProps = {
  steps: string[];
};

// Numbered steps with yellow circle markers ("What to do now").
export function StepList({ steps }: StepListProps) {
  const styles = useStyles();
  return (
    <View style={layout.list} accessibilityRole="list">
      {steps.map((step, i) => (
        <View key={i} style={layout.item}>
          <View style={styles.marker} accessibilityElementsHidden>
            <Text style={styles.number} maxFontSizeMultiplier={1.3}>
              {i + 1}
            </Text>
          </View>
          <AppText
            style={layout.text}
            accessibilityLabel={`Step ${i + 1}: ${step}`}
          >
            {step}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const layout = StyleSheet.create({
  list: { gap: 12 },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  text: { flex: 1 },
});

const useStyles = makeStyles((c) => ({
  marker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.check,
  },
  number: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: c.onCheck,
  },
}));
