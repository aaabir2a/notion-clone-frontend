'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  FolderKanban,
  Settings,
  ChevronDown,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { PageTree } from './PageTree';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { workspaces, currentWorkspace, fetchWorkspaces, setCurrentWorkspace } =
    useWorkspaceStore();
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Trash', href: '/trash', icon: Trash2 },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Close button (mobile) */}
          <div className="flex h-14 items-center justify-between px-4 md:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Workspace Selector */}
          <div className="px-3 py-2">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs text-primary-foreground">
                  {currentWorkspace?.icon || currentWorkspace?.name.charAt(0) || 'W'}
                </div>
                <span className="truncate">
                  {currentWorkspace?.name || 'Select Workspace'}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isWorkspaceDropdownOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Workspace Dropdown */}
            {isWorkspaceDropdownOpen && (
              <div className="mt-2 space-y-1 rounded-lg border bg-popover p-2">
                {workspaces.map((workspace) => (
                  <button
                    key={workspace.id}
                    onClick={() => {
                      setCurrentWorkspace(workspace);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent',
                      currentWorkspace?.id === workspace.id && 'bg-accent'
                    )}
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs">
                      {workspace.icon || workspace.name.charAt(0)}
                    </div>
                    <span className="truncate">{workspace.name}</span>
                  </button>
                ))}
                <Separator className="my-2" />
                <Link
                  href="/workspace/new"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Workspace</span>
                </Link>
              </div>
            )}
          </div>

          <Separator />

          {/* Navigation Links */}
          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4" />

            {/* Pages Section */}
            {currentWorkspace && (
              <div>
                <div className="mb-2 flex items-center justify-between px-3">
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground">
                    Pages
                  </h3>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <PageTree workspaceId={currentWorkspace.id} />
              </div>
            )}
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}
