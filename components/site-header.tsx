"use client";

import { Github, Mail, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-4xl flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <PackageSearch className="h-6 w-6" />
          <span className="text-h4 tracking-tight">PackageAnalyzer</span>
        </div>
        <nav className="flex items-center space-x-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open("https://github.com/istealersn-dev/package-analyzer", "_blank")}
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>GitHub</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open("mailto:istealersn.dev@gmail.com", "_blank")}
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Contact</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Contact</TooltipContent>
          </Tooltip>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}