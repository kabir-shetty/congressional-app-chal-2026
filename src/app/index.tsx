import { Link } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

// Landing screen: a menu of links out to each info topic, the scam
// checker, and the quiz. With typedRoutes on, Expo Router checks these
// hrefs against actual route files at build time, so a typo here is a
// compile error rather than a dead link.
export default function Index() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/info/ai-scams">AI Scams</Link>
      <Link href="/check">Scam Checker</Link>
      <Link href="/quiz">AI or Not Quiz</Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
  },
});
