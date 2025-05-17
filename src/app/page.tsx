'use client';

import { useState } from 'react';
import { Hero } from '@/components/Hero';
import { LegalNoticeForm } from '@/components/LegalNoticeForm';
import { LegalNoticeResponse } from '@/components/LegalNoticeResponse';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield } from "lucide-react";
import { AnimateOnScroll } from '@/components/AnimateOnScroll';

// Mock API call
const mockGenerateLegalNotice = async (data: { country: string; problem: string }) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Randomly return success or insufficient data for testing
  if (Math.random() > 0.5) {
    return {
      status: 'success' as const,
      message: 'Legal notice generated successfully',
      data: {
        notice: `LEGAL NOTICE

To Whom It May Concern:

This notice is being sent in accordance with the laws of ${data.country}.

RE: ${data.problem}

We hereby demand that you take immediate action to address the above-mentioned matter. Failure to respond within 14 days may result in further legal action.

Sincerely,
[Your Name]`,
        generatedAt: new Date().toLocaleString()
      }
    };
  }

  return {
    status: 'insufficient_data' as const,
    message: 'Please provide more specific details about your situation, including dates, amounts, and any relevant documentation.'
  };
};

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<Awaited<ReturnType<typeof mockGenerateLegalNotice>> | null>(null);

  const handleSubmit = async (data: { country: string; problem: string }) => {
    setIsLoading(true);
    try {
      const result = await mockGenerateLegalNotice(data);
      setResponse(result);
    } catch (error) {
      console.error('Error generating legal notice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setResponse(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      
      <section id="features" className="w-full py-24 bg-muted/30">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="space-y-4 mb-12">
            <AnimateOnScroll delay={100}>
              <h2 className="text-3xl font-bold text-center">
                Why Choose Our Legal Notice Generator?
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                Experience the future of legal document generation with our advanced AI-powered platform
              </p>
            </AnimateOnScroll>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimateOnScroll delay={300}>
              <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
                <CardHeader className="h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>AI-Powered</CardTitle>
                  <CardDescription className="flex-grow">
                    Advanced AI technology ensures accurate and relevant legal notices tailored to your specific situation
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimateOnScroll>
            <AnimateOnScroll delay={400}>
              <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
                <CardHeader className="h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Instant Delivery</CardTitle>
                  <CardDescription className="flex-grow">
                    Get your legal notice generated in seconds, not days. Save time and get peace of mind quickly
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimateOnScroll>
            <AnimateOnScroll delay={500}>
              <Card className="transition-all duration-300 hover:shadow-lg hover:scale-[1.02] h-full">
                <CardHeader className="h-full">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription className="flex-grow">
                    Your data is encrypted and handled with utmost confidentiality. Your privacy is our priority
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      <section id="form" className="w-full py-24 bg-background">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="space-y-4 mb-12">
            <AnimateOnScroll delay={100}>
              <h2 className="text-3xl font-bold text-center">
                Generate Your Legal Notice
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="text-center text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below to get started with your legal notice generation. Our AI will analyze your situation and create a professional legal notice.
              </p>
            </AnimateOnScroll>
          </div>
          <div className="space-y-8">
            <AnimateOnScroll delay={300}>
              <LegalNoticeForm onSubmit={handleSubmit} isLoading={isLoading} />
            </AnimateOnScroll>
            {response && (
              <AnimateOnScroll delay={400}>
                <LegalNoticeResponse response={response} onRetry={handleRetry} />
              </AnimateOnScroll>
            )}
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </main>
  );
}
