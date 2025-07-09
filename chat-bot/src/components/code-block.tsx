
'use client';

interface CodeBlockProps {
  code: string;
}

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
      <code className="font-code text-muted-foreground text-sm">
        {code}
      </code>
    </pre>
  );
}
