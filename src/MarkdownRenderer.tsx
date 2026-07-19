import { useState, useMemo, type ReactNode } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-powershell";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";

type MarkdownRendererProps = {
  markdown: string;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .trim()
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}

function escapeHtml(code: string): string {
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getInlineLanguage(code: string): string {
  if (/^(npm|pnpm|yarn|npx)\s/.test(code)) {
    return "bash";
  }

  return "tsx";
}

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1);
      const language = getInlineLanguage(code);

      return (
        <code
          className={`inline-code language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
          key={index}
        />
      );
    }

    return part;
  });
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);
}

function parseTableRow(line: string) {
  const trimmed = line.trim();
  const row = trimmed.startsWith("|") ? trimmed.slice(1) : trimmed;
  const withoutTrailingPipe = row.endsWith("|") ? row.slice(0, -1) : row;
  const cells: string[] = [];
  let currentCell = "";
  let inCodeSpan = false;

  for (let index = 0; index < withoutTrailingPipe.length; index += 1) {
    const char = withoutTrailingPipe[index];
    const nextChar = withoutTrailingPipe[index + 1];

    if (char === "\\" && nextChar === "|") {
      currentCell += "|";
      index += 1;
      continue;
    }

    if (char === "`") {
      inCodeSpan = !inCodeSpan;
      currentCell += char;
      continue;
    }

    if (char === "|" && !inCodeSpan) {
      cells.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  cells.push(currentCell.trim());
  return cells;
}

function highlightCode(code: string, language?: string): string {
  if (!language) return code;

  const langMap: Record<string, string> = {
    ts: "typescript",
    typescript: "typescript",
    tsx: "tsx",
    js: "javascript",
    javascript: "javascript",
    jsx: "jsx",
    powershell: "powershell",
    bash: "bash",
    shell: "bash",
    py: "python",
    python: "python",
    json: "json",
  };

  const prismLangName = langMap[language.toLowerCase()];
  const grammar = prismLangName ? Prism.languages[prismLangName] : null;

  if (grammar) {
    return Prism.highlight(code, grammar, prismLangName || language);
  }
  return escapeHtml(code);
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const highlightedHtml = useMemo(() => {
    return highlightCode(code, language);
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <div className="code-card">
      <div className="code-card-header">
        {language ? <span className="code-language">{language}</span> : <span />}
        <button className="copy-button" onClick={handleCopy} type="button" aria-label="Copy code to clipboard">
          {copied ? (
            <span className="copy-success">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </span>
          ) : (
            <span className="copy-text">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </span>
          )}
        </button>
      </div>
      <pre>
        {language ? (
          <code dangerouslySetInnerHTML={{ __html: highlightedHtml }} />
        ) : (
          <code>{code}</code>
        )}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.replace("```", "").trim();
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }

      const codeContent = codeLines.join("\n");

      nodes.push(
        <CodeBlock
          key={`code-${index}`}
          code={codeContent}
          language={language}
        />
      );
      index += 1;
      continue;
    }

    if (line.startsWith("|") && lines[index + 1] && isTableSeparator(lines[index + 1])) {
      const headers = parseTableRow(line);
      const rows: string[][] = [];
      index += 2;

      while (index < lines.length && lines[index].startsWith("|")) {
        rows.push(parseTableRow(lines[index]));
        index += 1;
      }

      nodes.push(
        <div className="table-wrap" key={`table-${index}`}>
          <table>
            <thead>
              <tr>
                {headers.map((header, hIdx) => (
                  <th key={`th-${hIdx}`}>{renderInline(header)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={`${rowIndex}-${cellIndex}`}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      const text = line.slice(2);
      nodes.push(<h1 id={slugify(text)} key={`h1-${index}`}>{renderInline(text)}</h1>);
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      const text = line.slice(3);
      nodes.push(<h2 id={slugify(text)} key={`h2-${index}`}>{renderInline(text)}</h2>);
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const text = line.slice(4);
      nodes.push(<h3 id={slugify(text)} key={`h3-${index}`}>{renderInline(text)}</h3>);
      index += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];

      while (index < lines.length && lines[index].startsWith("- ")) {
        items.push(lines[index].slice(2));
        index += 1;
      }

      nodes.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIdx) => (
            <li key={`li-${itemIdx}`}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [line.trim()];
    index += 1;

    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].startsWith("#") &&
      !lines[index].startsWith("|") &&
      !lines[index].startsWith("```") &&
      !lines[index].startsWith("- ")
    ) {
      paragraph.push(lines[index].trim());
      index += 1;
    }

    nodes.push(<p key={`p-${index}`}>{renderInline(paragraph.join(" "))}</p>);
  }

  return <div className="markdown">{nodes}</div>;
}
