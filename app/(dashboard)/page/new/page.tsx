'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { usePageStore } from '@/store/pageStore';
import { toast } from 'sonner';

export default function NewPagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspaceId');
  const { createPage } = usePageStore();

  useEffect(() => {
    const createNewPage = async () => {
      if (!workspaceId) {
        toast.error('Workspace ID is required');
        router.push('/dashboard');
        return;
      }

      try {
        const page = await createPage({
          title: 'Untitled',
          workspaceId,
        });

        toast.success('Page created!');
        router.push(`/page/${page.id}`);
      } catch (error) {
        toast.error('Failed to create page');
        router.push(`/workspace/${workspaceId}`);
      }
    };

    createNewPage();
  }, [workspaceId, createPage, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Creating new page...</p>
      </div>
    </div>
  );
}
