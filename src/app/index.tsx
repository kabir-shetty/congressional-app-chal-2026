import { ScrollView, StyleSheet, View } from "react-native";
import type { Href } from "expo-router";

import { AppLinkButton } from "@/components/app-link-button";
import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { colors, fontSize, spacing } from "@/constants/theme";

type Notice = {
  href: Href;
  title: string;
  body: string;
  action: string;
};

// Each menu item is framed as a short notice rather than a bare button, so
// the home screen explains what it's offering before asking for a tap.
const notices: Notice[] = [
  {
    href: "/info/ai-scams",
    title: "What AI scams look like",
    body: "Cloned voices, faked photos, and messages written to sound just like someone you trust.",
    action: "Learn the signs",
  },
  {
    href: "/check",
    title: "Not sure about something?",
    body: "Paste a message or add a screenshot. We'll give you a plain answer.",
    action: "Check a message",
  },
  {
    href: "/quiz",
    title: "AI or Not",
    body: "Practice telling real from fake, with honest feedback after every guess.",
    action: "Start practicing",
  },
];

// Landing screen: a short bulletin of what the app offers, each notice
// linking out to its own screen. With typedRoutes on, Expo Router checks
// each AppLinkButton's href against actual route files at build time, so a
// typo here is a compile error rather than a dead link.
export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <HeadingText style={styles.heroTitle}>Porch Watch</HeadingText>
        <BodyText style={styles.heroSubtitle}>
          Know the signs before they reach your door.
        </BodyText>
      </View>

      {notices.map((notice) => (
        <View key={notice.title} style={styles.notice}>
          <HeadingText style={styles.noticeTitle}>{notice.title}</HeadingText>
          <BodyText style={styles.noticeBody}>{notice.body}</BodyText>
          <View style={styles.noticeAction}>
            <AppLinkButton href={notice.href} title={notice.action} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: colors.background,
  },
  hero: {
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: fontSize.display,
  },
  heroSubtitle: {
    color: colors.secondary,
  },
  notice: {
    gap: spacing.sm,
    paddingTop: spacing.lg,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  noticeTitle: {
    fontSize: fontSize.title,
  },
  noticeBody: {
    color: colors.text,
  },
  noticeAction: {
    alignSelf: "flex-start",
    marginTop: spacing.sm,
  },
});
