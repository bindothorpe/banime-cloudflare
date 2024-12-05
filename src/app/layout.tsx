import "@/app/globals.css";
import NavigationBar from "@/components/global/navigation-bar";
import { ThemeProvider } from "@/components/global/theme-provider";

export const metadata = {
  title: "Banime",
  description: "Watch anime for free",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <NavigationBar />
            {/* Main content */}
            <main className="flex-1 pt-20">
              <div className="container mx-auto px-4 max-w-7xl">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
