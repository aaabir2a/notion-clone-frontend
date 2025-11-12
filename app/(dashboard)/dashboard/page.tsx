"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Plus, FolderKanban, Users, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useAuthStore } from "@/store/authStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { workspaces, fetchWorkspaces, isLoading } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your workspaces today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workspaces
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces.length}</div>
            <p className="text-xs text-muted-foreground">
              Your collaborative spaces
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workspaces.reduce((acc, w) => acc + (w._count?.pages || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Documents created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workspaces.reduce((acc, w) => acc + (w._count?.members || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Collaborators</p>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Workspaces</h2>
          <Button asChild>
            <Link href="/workspace/new">
              <Plus className="mr-2 h-4 w-4" />
              New Workspace
            </Link>
          </Button>
        </div>

        {isLoading ? (
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
        ) : workspaces.length === 0 ? (
          <Card className="p-12 text-center">
            <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No workspaces yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first workspace
            </p>
            <Button asChild className="mt-4">
              <Link href="/workspace/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((workspace) => (
              <Card
                key={workspace.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <Link href={`/workspace/${workspace.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-xl text-primary-foreground">
                        {workspace.icon || workspace.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {workspace.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {workspace.role}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {workspace.description || "No description"}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
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
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
