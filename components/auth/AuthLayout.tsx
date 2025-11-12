'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold">{APP_NAME}</span>
            </div>
          </Link>

          {children}
        </div>
      </div>

      {/* Right side - Image/Info */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary to-primary/80">
        <div className="flex flex-col justify-center px-12 text-primary-foreground">
          <h2 className="text-4xl font-bold mb-4">
            Collaborate with your team in real-time
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Create beautiful documents, wikis, and projects together. Everything you
            need to stay organized and productive.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Real-time collaboration</h3>
                <p className="text-sm opacity-80">
                  Work together with your team in real-time
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Powerful editor</h3>
                <p className="text-sm opacity-80">
                  Rich text editing with blocks and markdown support
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-sm">✓</span>
              </div>
              <div>
                <h3 className="font-semibold">Organized workspaces</h3>
                <p className="text-sm opacity-80">
                  Keep everything organized in dedicated workspaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
