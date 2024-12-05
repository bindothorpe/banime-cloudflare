"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/custom-ui/command";
import { DialogDescription, DialogTitle } from "@/components/custom-ui/dialog";
import { Search } from "lucide-react";

export default function SearchCommand({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isMobile) return;
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isMobile]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    router.push(`/search/${encodeURIComponent(searchQuery.trim())}`);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className={`justify-between text-muted-foreground text-sm font-normal ${
          isMobile ? "flex-1 mx-4" : "w-full pr-2"
        }`}
        onClick={() => setOpen(true)}
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>{isMobile ? "Search..." : "Search anime..."}</span>
        </div>
        {!isMobile && (
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="dark:bg-popover/90 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-popover/90 bg-popover/80 supports-[backdrop-filter]:bg-popover/80"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>
        <DialogDescription className="sr-only">
          Search for anime titles
        </DialogDescription>
        <Command className="bg-transparent">
          <CommandInput
            className="bg-transparent"
            placeholder="Search anime..."
            value={query}
            onValueChange={setQuery}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(query);
              }
            }}
          />
          <CommandList className="bg-transparent">
            <CommandEmpty>Press enter to search</CommandEmpty>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
