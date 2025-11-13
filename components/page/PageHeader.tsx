"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Star,
  Copy,
  Trash2,
  Share2,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePageStore } from "@/store/pageStore";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import type { Page } from "@/types";

interface PageHeaderProps {
  page: Page;
}

export function PageHeader({ page }: PageHeaderProps) {
  const router = useRouter();
  const { duplicatePage, deletePage } = usePageStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDuplicate = async () => {
    try {
      await duplicatePage(page.id);
      toast.success("Page duplicated", {
        description: "A copy of the page has been created.",
      });
    } catch (error) {
      toast.error("Failed to duplicate page");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this page?")) return;

    try {
      setIsDeleting(true);
      await deletePage(page.id);
      toast.success("Page deleted", {
        description: "The page has been moved to trash.",
      });
      router.push(`/workspace/${page.workspaceId}`);
    } catch (error) {
      toast.error("Failed to delete page");
      setIsDeleting(false);
    }
  };

  // Safety check for author
  const author = page.author || { name: "Unknown", avatar: null };

  return (
    <div className="border-b bg-background sticky top-14 z-40">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Page Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.avatar || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(author.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              <span>Updated {formatRelativeTime(page.updatedAt)}</span>
              {" • "}
              <span>by {author.name}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Share Button */}
            <Button variant="ghost" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>

            {/* Favorite Button */}
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>

            {/* More Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="mr-2 h-4 w-4" />
                  Version History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
