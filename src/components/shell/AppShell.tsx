import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { TopBar } from "./TopBar";
import { LanguageProvider } from "@/lib/i18n/context";
import { UnitProvider } from "@/lib/units/context";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <UnitProvider>
      <div className="relative min-h-dvh bg-paper">
        <div className="relative z-10 flex min-h-dvh">
          <Sidebar />
          <div className="flex min-h-dvh w-full flex-col lg:pl-[260px]">
            <TopBar />
            <main className="flex-1 px-4 pb-28 pt-4 sm:px-6 lg:px-10 lg:pb-12 lg:pt-6">
              {/* Sentinel observed by TopBar to detect scroll — must live outside sticky header */}
              <div id="scroll-sentinel" aria-hidden className="h-0 w-0 overflow-hidden" />
              <div className="mx-auto w-full max-w-[1320px]">{children}</div>
            </main>
          </div>
        </div>

        <BottomNav />
      </div>
      </UnitProvider>
    </LanguageProvider>
  );
}
