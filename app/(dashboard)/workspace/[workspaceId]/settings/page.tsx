'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkspaceSettings } from '@/components/workspace/WorkspaceSettings';
import { MemberList } from '@/components/workspace/MemberList';

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/workspace/${workspaceId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workspace
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Workspace Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your workspace settings and members
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <WorkspaceSettings workspaceId={workspaceId} />
        </TabsContent>

        <TabsContent value="members">
          <MemberList workspaceId={workspaceId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
