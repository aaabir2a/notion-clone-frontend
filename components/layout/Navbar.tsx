'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserMenu } from '@/components/auth/UserMenu';
import { APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Menu Button (Mobile) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">N</span>
          </div>
          <span className="hidden md:inline-block font-bold">{APP_NAME}</span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* New Page Button */}
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
