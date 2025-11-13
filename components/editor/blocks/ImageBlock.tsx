'use client';

import { useState } from 'react';
import { ImageIcon, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ImageBlockProps {
  content: { url?: string; caption?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

export function ImageBlock({ content, onChange }: ImageBlockProps) {
  const [isEditingUrl, setIsEditingUrl] = useState(!content.url);

  if (!content.url || isEditingUrl) {
    return (
      <Card className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Paste image URL..."
            value={content.url || ''}
            onChange={(e) => onChange({ ...content, url: e.target.value })}
            autoFocus
          />
          <Button
            size="sm"
            onClick={() => {
              if (content.url) {
                setIsEditingUrl(false);
              }
            }}
            disabled={!content.url}
          >
            Add
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative group">
        <img
          src={content.url}
          alt={content.caption || 'Image'}
          className="w-full rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect width="400" height="300" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af"%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsEditingUrl(true)}
            className="bg-background/90 backdrop-blur"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Input
        type="text"
        placeholder="Add a caption..."
        value={content.caption || ''}
        onChange={(e) => onChange({ ...content, caption: e.target.value })}
        className="text-sm text-center text-muted-foreground"
      />
    </div>
  );
}
