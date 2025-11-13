'use client';

import { useState } from 'react';
import { ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageCoverProps {
  coverImage?: string | null;
  onCoverChange?: (url: string | null) => void;
  editable?: boolean;
}

export function PageCover({ coverImage, onCoverChange, editable = true }: PageCoverProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleRemoveCover = () => {
    onCoverChange?.(null);
  };

  const handleChangeCover = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      onCoverChange?.(url);
    }
  };

  if (!coverImage && !editable) return null;

  return (
    <div
      className={cn(
        'relative w-full h-60 bg-gradient-to-r from-blue-400 to-purple-500',
        coverImage && 'bg-cover bg-center'
      )}
      style={coverImage ? { backgroundImage: `url(${coverImage})` } : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {editable && (isHovered || !coverImage) && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {!coverImage ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleChangeCover}
              className="bg-background/90 backdrop-blur"
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              Add Cover
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleChangeCover}
                className="bg-background/90 backdrop-blur"
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Change Cover
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleRemoveCover}
                className="bg-background/90 backdrop-blur"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
