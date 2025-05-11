import { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
    markdownContent: string | undefined;
    isLoading?: boolean;
}

//sample markdown
const sampleMarkdown = "# Sample Content \n\nThis is **bold** and this is *italic*.\n\n## Lists\n\n* Item 1\n* Item 2\n* Item 3\n\n## Code\n\n`const hello = \"world\";`\n\n```js\nfunction example() {\n  return \"This is a code block\";\n}\n```\n\n## Links\n\n[Example Link](https://example.com)";

// Custom markdown parser
const parseMarkdown = (markdown: string) => {
    if (!markdown) return '';

    // Process code blocks first to avoid conflicts with other formatting
    let html = markdown;

    // Code blocks with language
    html = html.replace(/```(\w+)\n([\s\S]*?)```/gm, (match, language, code) => {
        return `<div style="background-color: #f8f8f8; border-radius: 4px; padding: 16px; margin: 12px 0; overflow-x: auto;">
      <pre style="margin: 0;"><code style="font-family: monospace;">${code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
            }</code></pre>
    </div>`;
    });

    // Code blocks without language specification
    html = html.replace(/```([\s\S]*?)```/gm, (match, code) => {
        return `<div style="background-color: #f8f8f8; border-radius: 4px; padding: 16px; margin: 12px 0; overflow-x: auto;">
      <pre style="margin: 0;"><code style="font-family: monospace;">${code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;')
            }</code></pre>
    </div>`;
    });

    // Headers - using inline styles for better email compatibility
    html = html
        .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.05rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.35rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem;">$1</h1>');

    // Bold and Italic
    html = html
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Links - using inline styles
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" style="color: #3b82f6; text-decoration: none;">$1</a>');

    // Lists - using inline styles
    html = html.replace(/^\s*[\*\-] (.*)/gim, (match, item) => {
        return `<ul style="list-style-type: disc; padding-left: 2rem; margin: 0.5rem 0;"><li style="margin: 0.25rem 0;">${item}</li></ul>`;
    });

    // Merge adjacent list items
    html = html.replace(/<\/ul>\s*<ul style="list-style-type: disc; padding-left: 2rem; margin: 0.5rem 0;">/gim, '');

    // Inline code
    html = html.replace(/`([^`]+)`/gim, '<code style="background-color: #f1f1f1; padding: 2px 4px; border-radius: 3px; font-family: monospace;">$1</code>');

    // Paragraphs - handle line breaks and paragraphs
    html = html
        .replace(/\n\n/gim, '</p><p style="margin: 0.75rem 0;">')
        .replace(/^\s*(.+)$/gim, (match, content, index) => {
            // Skip if it's already wrapped in HTML tags
            if (content.match(/^<[a-z]/i) || index === 0) return match;
            return content;
        });

    // Wrap the content in a paragraph if not already
    if (!html.startsWith('<')) {
        html = `<p style="margin: 0.75rem 0;">${html}`;
    }
    if (!html.endsWith('>')) {
        html = `${html}</p>`;
    }

    // Fix any unclosed paragraph tags
    const openTags = (html.match(/<p/g) || []).length;
    const closeTags = (html.match(/<\/p>/g) || []).length;
    if (openTags > closeTags) {
        html = `${html}</p>`;
    }

    // Wrap the whole content in a div with consistent styling for email
    html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; font-size: 14px;">${html}</div>`;

    return html;
};

const MarkdownViewer = ({
    markdownContent,
    isLoading
}: Readonly<Props>) => {
    const [copied, setCopied] = useState(false);
    const [parsedContent, setParsedContent] = useState(sampleMarkdown);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setParsedContent(parseMarkdown(markdownContent ?? sampleMarkdown));
    }, [markdownContent]);

    // Copy the HTML content with formatting preserved
    const copyFormattedContent = () => {
        if (!contentRef.current) return;

        // Create a range
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);

        // Add the range to the selection
        const selection = window.getSelection();
        if (!selection) return;

        selection.removeAllRanges();
        selection.addRange(range);

        // Execute the copy command
        document.execCommand('copy');

        // Remove the selection
        selection.removeAllRanges();

        // Show the copied confirmation
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="w-full relative">
            <Card className="shadow-md relative h-[40rem] overflow-y-auto">
                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="flex flex-col space-y-3 h-[40rem]">
                            <Skeleton className="h-[35px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[25rem]" />
                                <Skeleton className="h-4 w-[20rem]" />
                            </div>
                            <br />
                            <Skeleton className="h-[35px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[25rem]" />
                                <Skeleton className="h-4 w-[20rem]" />
                            </div>
                            <br />
                            <Skeleton className="h-[35px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[25rem]" />
                                <Skeleton className="h-4 w-[20rem]" />
                            </div>
                            <br />
                            <Skeleton className="h-[35px] rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[25rem]" />
                                <Skeleton className="h-4 w-[20rem]" />
                            </div>
                        </div>
                    ) : (
                        <div
                            ref={contentRef}
                            className="prose dark:prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: parsedContent }}
                        />
                    )}
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-end py-3 px-4 sticky bottom-0">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={copyFormattedContent}
                        className="flex items-center gap-2"
                        type='button'
                        disabled={isLoading}
                    >
                        {copied ? (
                            <>
                                <Check className="h-4 w-4" />
                                <span>Copied!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="h-4 w-4 animate-pulse" />
                                <span>Copy Formatted</span>
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default MarkdownViewer;