"use client";

import { Mail, PackageSearch, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

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
              <Link href="/docs">
                <Button variant="ghost" size="icon">
                  <BookOpen className="h-4 w-4" />
                  <span className="sr-only">Documentation</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Documentation</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open("https://github.com/istealersn-dev/package-analyzer", "_blank")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 .5C5.7.5 0 6.2 0 12.9c0 5.4 3.5 10 8.2 11.6.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.6-1.2-1.6-.9-.6 0-.6 0-.6 1 0 1.6 1 1.6 1 1.2 2 3.1 1.4 3.9 1 .1-.9.5-1.4.9-1.7-2.8-.3-5.7-1.4-5.7-6.2 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.5.1-3.1 0 0 1.1-.4 3.5 1.4 1-.3 2.1-.5 3.2-.5 1.1 0 2.2.2 3.2.5 2.4-1.8 3.5-1.4 3.5-1.4.7 1.6.2 2.8.1 3.1.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.9-5.7 6.2.5.4.9 1.2.9 2.4v3.6c0 .3.2.7.8.6C20.5 22.9 24 18.3 24 12.9 24 6.2 18.3.5 12 .5z" />
                </svg>
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