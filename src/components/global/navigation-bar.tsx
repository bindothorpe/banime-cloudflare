import { Menu } from "lucide-react";
import Link from "next/link";
import SearchCommand from "@/components/global/search-command";
import ThemeButton from "@/components/global/theme-button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Continue", href: "/continue" },
  { name: "Saved", href: "/saved" },
];

export default function NavigationBar() {
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between px-4 py-2 border-b fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 z-50">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold">
            BANIME
          </Link>
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <SearchCommand />
          <ThemeButton />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-between p-4 border-b fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80 z-50">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-24 bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/80">
            <DrawerHeader>
              <DrawerTitle>Navigation</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col space-y-4 px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
        <SearchCommand isMobile />
        <ThemeButton />
      </nav>
    </>
  );
}
