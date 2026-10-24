import { AppText } from "@/components/app-text";

// Small uppercase blue tag above a heading.
export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText variant="label" tone="primary">
      {children}
    </AppText>
  );
}
