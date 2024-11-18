"use client";

import { Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VulnerabilitiesTabProps {
  issues: Array<{
    severity: string;
    message: string;
    category: string;
  }>;
}

export function VulnerabilitiesTab({ issues }: VulnerabilitiesTabProps) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-500">
            <Shield className="h-5 w-5" />
            <p className="text-lg font-medium">No security vulnerabilities found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>{issues.length} Security {issues.length === 1 ? 'Issue' : 'Issues'} Found</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {issues.map((issue, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  issue.severity === 'high' ? 'bg-red-500' :
                  issue.severity === 'medium' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <div>
                  <p className="font-medium">{issue.message}</p>
                  <p className="text-sm text-muted-foreground">
                    Severity: {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}