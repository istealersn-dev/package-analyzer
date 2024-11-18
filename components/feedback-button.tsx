"use client";

import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function FeedbackButton() {
  return (
    <div className="fixed bottom-[calc(4.5rem+1rem)] right-4 z-50">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            className="rounded-full shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl bg-primary"
            onClick={() => window.open("https://github.com/istealersn-dev/package-analyzer/issues", "_blank")}
          >
            <MessageSquarePlus className="h-5 w-5 mr-2" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Help us improve by sharing your feedback!
        </TooltipContent>
      </Tooltip>
    </div>
  );
}