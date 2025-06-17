import type { ReactNode } from 'react';
import Image from 'next/image';
import { Icons } from '@/components/icons';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-body">
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="mx-auto w-full max-w-md space-y-6">
           <Link href="/" className="flex items-center justify-center gap-2 mb-8">
              <Icons.Logo className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-headline font-bold text-primary">
                RetailFlow
              </h1>
          </Link>
          {children}
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-12 relative overflow-hidden">
        <Image
          src="https://placehold.co/800x1000.png"
          alt="Modern retail store interior with point of sale system"
          width={800}
          height={1000}
          priority
          className="object-cover w-full h-full rounded-lg shadow-2xl opacity-80"
          data-ai-hint="retail store"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent"></div>
         <div className="absolute bottom-10 left-10 right-10 p-8 bg-card/90 backdrop-blur-md rounded-xl shadow-xl border border-border">
          <h2 className="text-3xl font-headline font-semibold text-card-foreground mb-3">
            Elevate Your Retail Experience
          </h2>
          <p className="text-muted-foreground text-lg">
            Join RetailFlow to seamlessly manage sales, inventory, and customer interactions. Sign in or create an account to unlock powerful tools for your business.
          </p>
        </div>
      </div>
    </div>
  );
}
