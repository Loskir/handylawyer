import { Button } from "@/components/ui/button";
import { Shield, Zap, Clock } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-muted py-32">
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center space-y-10">
          <div className="space-y-6">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl [animation:slideUp_0.5s_ease-out_0.2s_both]">
              AI-Powered Legal Notice Generator
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl [animation:slideUp_0.5s_ease-out_0.4s_both]">
              Get professional legal notices generated instantly for your specific situation.
              Currently available for the Netherlands.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center [animation:slideUp_0.5s_ease-out_0.6s_both]">
            <Button
              size="lg"
              className="rounded-full px-8 text-base"
              asChild
            >
              <Link href="/generator">
                Get Started
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 text-base"
            >
              <a href="#features">
                Learn More
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 pt-4 [animation:slideUp_0.5s_ease-out_0.8s_both]">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4" />
              Secure & Private
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              AI-Powered
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Instant Delivery
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
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
      `}</style>
    </div>
  );
}; 