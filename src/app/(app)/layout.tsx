import { AppShell } from "@/components/shell/AppShell";

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
