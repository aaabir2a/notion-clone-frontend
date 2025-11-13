'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Users, Settings as SettingsIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { usePageStore } from '@/store/pageStore';
import { formatRelativeTime } from '@/lib/utils';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as string;

  const { currentWorkspace, fetchWorkspace, isLoading: workspaceLoading } =
    useWorkspaceStore();
  const { pages, fetchPages, isLoading: pagesLoading } = usePageStore();

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace(workspaceId);
      fetchPages(workspaceId);
    }
  }, [workspaceId, fetchWorkspace, fetchPages]);

  if (workspaceLoading || !currentWorkspace) {
    return (
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const canManage =
    currentWorkspace.role === 'OWNER' || currentWorkspace.role === 'ADMIN';

  // Get top-level pages (no parent)
  const topLevelPages = pages.filter((page) => !page.parentId);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-2xl text-primary-foreground">
              {currentWorkspace.icon || currentWorkspace.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentWorkspace.name}</h1>
              <p className="text-muted-foreground mt-1">
                {currentWorkspace.description || 'No description'}
              </p>
            </div>
          </div>

          {canManage && (
            <Button variant="outline" asChild>
              <Link href={`/workspace/${workspaceId}/settings`}>
                <SettingsIcon className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
            <p className="text-xs text-muted-foreground">
              {topLevelPages.length} top-level pages
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentWorkspace._count?.members || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active collaborators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWorkspace.role}</div>
            <p className="text-xs text-muted-foreground">Access level</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Pages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent Pages</h2>
          <Button asChild>
            <Link href={`/page/new?workspaceId=${workspaceId}`}>
              <Plus className="mr-2 h-4 w-4" />
              New Page
            </Link>
          </Button>
        </div>

        {pagesLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No pages yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first page to get started
            </p>
            <Button asChild className="mt-4">
              <Link href={`/page/new?workspaceId=${workspaceId}`}>
                <Plus className="mr-2 h-4 w-4" />
                Create Page
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {pages
              .sort(
                (a, b) =>
                  new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
              )
              .slice(0, 10)
              .map((page) => (
                <Link
                  key={page.id}
                  href={`/page/${page.id}`}
                  className="flex items-center gap-3 rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="text-xl">
                    {page.icon || <FileText className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{page.title || 'Untitled'}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {formatRelativeTime(page.updatedAt)}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    by {page.author.name}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
