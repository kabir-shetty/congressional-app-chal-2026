import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/app-button";
import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { InstructionStrip } from "@/components/instruction-strip";
import { ListGroup, ListRow } from "@/components/list-group";
import { Screen } from "@/components/screen";
import { makeStyles, spacing } from "@/constants/theme";

// Landing screen: a welcoming teal band, the one main action (check a
// message), the rule that stops most scams, then the other two tabs as a
// native grouped list. With typedRoutes on, a typo in an href is a compile
// error, not a dead link.
export default function Index() {
  const styles = useStyles();
  const { top } = useSafeAreaInsets();
  return (
    <View style={styles.root}>
      {/* Pinned teal strip under the status bar: the band below scrolls,
          and the status bar icons are light, so content must never slide
          under them on the pale ground. */}
      <View style={[styles.statusInset, { height: top }]} />
      <Screen
        header={
          <View style={styles.band}>
            <AppText
              variant="largeTitle"
              tone="onHeader"
              accessibilityRole="header"
            >
              Hello. How can we help today?
            </AppText>
            <AppText variant="callout" tone="onHeaderMuted">
              Porch Watch · Know the signs before they reach your door.
            </AppText>
          </View>
        }
      >
        <Card>
          <AppText variant="title" accessibilityRole="header">
            Check a message
          </AppText>
          <AppText tone="textMuted">
            Paste it or add a screenshot. We'll explain it plainly.
          </AppText>
          <AppButton
            title="Start a check"
            icon="search"
            onPress={() => router.navigate("/check")}
            fullWidth
          />
        </Card>

        <Card>
          <AppText variant="headline" accessibilityRole="header">
            Before you reply to anyone
          </AppText>
          <InstructionStrip tone="warning" bleed>
            Never pay with gift cards, wire transfers, or cryptocurrency.
            Real banks, agencies, and family won't ask you to.
          </InstructionStrip>
        </Card>

        <ListGroup>
          <ListRow
            href="/quiz"
            title="Spot the Scam"
            detail="Practice with 5 messages"
          />
          <ListRow
            href="/ai-scams"
            title="What AI scams look like"
            detail="Cloned voices, fake photos, and more"
          />
        </ListGroup>
      </Screen>
    </View>
  );
}

const useStyles = makeStyles((c) => ({
  root: {
    flex: 1,
  },
  statusInset: {
    backgroundColor: c.header,
  },
  band: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: c.header,
  },
}));
