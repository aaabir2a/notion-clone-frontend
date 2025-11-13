'use client';

import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CodeBlockProps {
  content: { code?: string; language?: string };
  onChange: (content: any) => void;
  onMenuToggle: () => void;
}

const languages = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'csharp',
  'go',
  'rust',
  'html',
  'css',
  'json',
  'markdown',
  'bash',
  'sql',
];

export function CodeBlock({ content, onChange, onMenuToggle }: CodeBlockProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          value={content.language || 'javascript'}
          onValueChange={(language) => onChange({ ...content, language })}
        >
          <SelectTrigger className="w-[180px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Textarea
        value={content.code || ''}
        onChange={(e) => onChange({ ...content, code: e.target.value })}
        placeholder="Write your code here..."
        className="font-mono text-sm min-h-[100px] bg-muted"
        rows={10}
      />
    </div>
  );
}
