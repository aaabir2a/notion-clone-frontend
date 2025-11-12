'use client';

import { useEffect, useState } from 'react';
import { MoreHorizontal, UserPlus, Crown, Shield, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { getInitials } from '@/lib/utils';
import { AddMemberDialog } from './AddMemberDialog';
import type { WorkspaceRole } from '@/types';

interface MemberListProps {
  workspaceId: string;
}

const roleIcons = {
  OWNER: Crown,
  ADMIN: Shield,
  MEMBER: UserPlus,
  VIEWER: Eye,
};

const roleColors = {
  OWNER: 'bg-yellow-500',
  ADMIN: 'bg-blue-500',
  MEMBER: 'bg-green-500',
  VIEWER: 'bg-gray-500',
};

export function MemberList({ workspaceId }: MemberListProps) {
  const {
    currentWorkspace,
    members,
    fetchWorkspace,
    removeMember,
    isLoading,
  } = useWorkspaceStore();

  useEffect(() => {
    fetchWorkspace(workspaceId);
  }, [workspaceId, fetchWorkspace]);

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember(workspaceId, memberId);
      
      toast.success('Member removed', {
        description: 'The member has been removed from the workspace.',
      });
    } catch (error: any) {
      toast.error('Failed to remove member', {
        description: error.response?.data?.message || 'Please try again.',
      });
    }
  };

  if (isLoading || !currentWorkspace) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const canManageMembers =
    currentWorkspace.role === 'OWNER' || currentWorkspace.role === 'ADMIN';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {members.length} member{members.length !== 1 ? 's' : ''} in this workspace
            </CardDescription>
          </div>
          {canManageMembers && (
            <AddMemberDialog workspaceId={workspaceId}>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </AddMemberDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => {
            const RoleIcon = roleIcons[member.role];
            
            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.user.avatar} />
                    <AvatarFallback>{getInitials(member.user.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.user.name}</p>
                      <Badge variant="outline" className="gap-1">
                        <RoleIcon className="h-3 w-3" />
                        {member.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                {canManageMembers && member.role !== 'OWNER' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>
                        Change role (Coming soon)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
