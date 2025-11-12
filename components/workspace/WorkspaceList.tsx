'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FolderKanban, Users, FileText, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';

export function WorkspaceList() {
  const { workspaces, fetchWorkspaces, isLoading } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (workspaces.length === 0) {
    return (
      <Card className="p-12 text-center">
        <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">No workspaces yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first workspace
        </p>
        <CreateWorkspaceDialog>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Workspace
          </Button>
        </CreateWorkspaceDialog>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {workspaces.map((workspace) => (
        <Card
          key={workspace.id}
          className="hover:shadow-md transition-shadow group relative"
        >
          <Link href={`/workspace/${workspace.id}`}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                  {workspace.icon || workspace.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{workspace.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {workspace.role}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {workspace.description || 'No description'}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {workspace._count?.pages || 0} pages
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {workspace._count?.members || 0} members
                </span>
              </div>
            </CardContent>
          </Link>

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/workspace/${workspace.id}/settings`;
            }}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
