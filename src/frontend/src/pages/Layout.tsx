// Modified Layout.tsx
import { ThemeProvider } from "@/providers/theme-provider";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
      <div className="w-full h-screen flex flex-col bg-slate-50 dark:bg-slate-950 dark:text-slate-50">
        {children}
      </div>
    </ThemeProvider>
  );
}