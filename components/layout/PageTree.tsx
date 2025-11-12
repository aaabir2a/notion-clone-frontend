'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronDown,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { usePageStore } from '@/store/pageStore';
import type { Page } from '@/types';
import { toast } from 'sonner';

interface PageTreeProps {
  workspaceId: string;
}

interface PageTreeItemProps {
  page: Page;
  level?: number;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function PageTreeItem({ page, level = 0, onDelete, onDuplicate }: PageTreeItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const isActive = pathname === `/page/${page.id}`;
  const hasChildren = page.children && page.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 rounded-md py-1 pr-2 transition-colors hover:bg-accent',
          isActive && 'bg-accent',
          level > 0 && 'ml-4'
        )}
      >
        {/* Expand/Collapse Button */}
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        ) : (
          <div className="w-6" />
        )}

        {/* Page Icon */}
        <div className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
          {page.icon || <FileText className="h-4 w-4 text-muted-foreground" />}
        </div>

        {/* Page Title */}
        <Link
          href={`/page/${page.id}`}
          className={cn(
            'flex-1 truncate text-sm',
            isActive ? 'font-medium' : 'text-muted-foreground'
          )}
        >
          {page.title || 'Untitled'}
        </Link>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              New sub-page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(page.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(page.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {page.children?.map((child) => (
            <PageTreeItem
              key={child.id}
              page={child}
              level={level + 1}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function PageTree({ workspaceId }: PageTreeProps) {
  const { pages, fetchPages, deletePage, duplicatePage } = usePageStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPages = async () => {
      setIsLoading(true);
      await fetchPages(workspaceId);
      setIsLoading(false);
    };

    loadPages();
  }, [workspaceId, fetchPages]);

  const handleDelete = async (pageId: string) => {
    try {
      await deletePage(pageId);
      toast.success('Page deleted', {
        description: 'The page has been moved to trash.',
      });
    } catch (error) {
      toast.error('Failed to delete page', {
        description: 'Please try again.',
      });
    }
  };

  const handleDuplicate = async (pageId: string) => {
    try {
      await duplicatePage(pageId);
      toast.success('Page duplicated', {
        description: 'A copy of the page has been created.',
      });
    } catch (error) {
      toast.error('Failed to duplicate page', {
        description: 'Please try again.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2 px-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  // Filter top-level pages (no parent)
  const topLevelPages = pages.filter((page) => !page.parentId);

  if (topLevelPages.length === 0) {
    return (
      <div className="px-3 py-4 text-center">
        <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">No pages yet</p>
        <Button variant="ghost" size="sm" className="mt-2">
          <Plus className="mr-2 h-4 w-4" />
          Create your first page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {topLevelPages.map((page) => (
        <PageTreeItem
          key={page.id}
          page={page}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ))}
    </div>
  );
}
