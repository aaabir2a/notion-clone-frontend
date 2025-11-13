"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page/PageHeader";
import { PageCover } from "@/components/page/PageCover";
import { PageTitle } from "@/components/page/PageTitle";
import { BlockEditor } from "@/components/editor/BlockEditor";
import { usePage } from "@/hooks/usePage";
import { useSocket } from "@/hooks/useSocket";
import { usePresence } from "@/hooks/usePresence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;

  const { currentPage, fetchPage, updatePage, isLoading, error } =
    usePage(pageId);
  const { isConnected } = useSocket();
  const { activeUsers } = usePresence(pageId);

  useEffect(() => {
    if (pageId) {
      fetchPage(pageId);
    }
  }, [pageId, fetchPage]);

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-destructive">
            Error loading page
          </p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading || !currentPage) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>
    );
  }

  // Make sure page has all required data
  if (!currentPage.id || !currentPage.workspaceId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Page data incomplete</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleTitleChange = async (title: string) => {
    await updatePage(pageId, { title });
  };

  const handleIconChange = async (icon: string | null) => {
    await updatePage(pageId, { icon });
  };

  const handleCoverChange = async (coverImage: string | null) => {
    await updatePage(pageId, { coverImage });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader page={currentPage} />

      {/* Active Users (Collaboration) */}
      {activeUsers.length > 0 && (
        <div className="fixed top-20 right-6 z-50">
          <div className="flex items-center gap-2 bg-background border rounded-full px-3 py-2 shadow-sm">
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 3).map((user) => (
                <Avatar
                  key={user.id}
                  className="h-6 w-6 border-2 border-background"
                >
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {activeUsers.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{activeUsers.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Back to Workspace */}
      <div className="container mx-auto px-6 pt-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/workspace/${currentPage.workspaceId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Link>
        </Button>
      </div>

      {/* Cover Image */}
      <PageCover
        coverImage={currentPage.coverImage}
        onCoverChange={handleCoverChange}
      />

      {/* Page Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Title */}
        <PageTitle
          title={currentPage.title}
          icon={currentPage.icon}
          onTitleChange={handleTitleChange}
          onIconChange={handleIconChange}
        />

        {/* Editor */}
        <div className="mt-8">
          <BlockEditor pageId={pageId} />
        </div>
      </div>
    </div>
  );
}
