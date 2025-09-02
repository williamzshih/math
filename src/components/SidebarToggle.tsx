"use client";

import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute bottom-4 left-4 z-10 cursor-pointer"
      onClick={toggleSidebar}
    >
      {open ? (
        <ChevronsLeft className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <ChevronsRight className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}
