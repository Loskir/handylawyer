'use client';

import { AnimateOnScroll } from '@/components/AnimateOnScroll';
import { UnifiedNoticeGenerator } from '@/components/UnifiedNoticeGeneratorMock';

export default function GeneratorPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="w-full py-24 bg-background">
        <div className="container mx-auto px-4">
        <AnimateOnScroll delay={100}>
            <UnifiedNoticeGenerator />
        </AnimateOnScroll>
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