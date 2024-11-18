"use client";

import { Badge } from "@/components/ui/badge";

interface PackageHeaderProps {
  name: string;
  version: string;
  description?: string;
}

function formatPackageName(name: string): string {
  // Remove leading special characters and transform to title case
  return name
    .replace(/^[>_\s]+|^[^a-zA-Z0-9]+/, '')
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PackageHeader({ name, version, description }: PackageHeaderProps) {
  const formattedName = formatPackageName(name);
  
  return (
    <div className="space-y-6 pb-8 border-b">
      <div className="space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">{formattedName}</h1>
        {description && (
          <p className="text-xl text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Badge variant="secondary" className="px-3 py-1">
          v{version}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          MIT
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          JavaScript
        </Badge>
      </div>
    </div>
  );
}