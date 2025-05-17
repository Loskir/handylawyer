import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Copy, Check } from "lucide-react";
import { AnimateOnScroll } from './AnimateOnScroll';

interface LegalNoticeResponseProps {
  response: {
    status: 'success' | 'insufficient_data';
    message: string;
    data?: {
      notice: string;
      generatedAt: string;
    };
  };
  onRetry: () => void;
}

export const LegalNoticeResponse = ({ response, onRetry }: LegalNoticeResponseProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (response.data?.notice) {
      await navigator.clipboard.writeText(response.data.notice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (response.status === 'insufficient_data') {
    return (
      <AnimateOnScroll delay={100}>
        <Card className="border-destructive/50 max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-destructive">More Information Needed</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{response.message}</p>
            <Button onClick={onRetry} variant="outline">
              Provide More Details
            </Button>
          </CardContent>
        </Card>
      </AnimateOnScroll>
    );
  }

  return (
    <AnimateOnScroll delay={100}>
      <Card>
        <CardHeader>
          <CardTitle>Generated Legal Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="relative">
              <pre className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap text-sm">
                {response.data?.notice}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Generated on {response.data?.generatedAt}
            </p>
          </div>
        </CardContent>
      </Card>
    </AnimateOnScroll>
  );
}; 