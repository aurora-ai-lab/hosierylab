import Link from "next/link";
import type { ReactNode } from "react";

function safeHref(href: string) {
  if (href.startsWith("/compare") || href.match(/^\/hosiery\/hl-/i)) return "/hosiery";
  if (href.startsWith("/") || href.startsWith("https://") || href.startsWith("http://")) return href;
  return "#";
}

function inline(text: string): ReactNode[] {
  const tokens = text.split(/(\[[^\]]+\]\([^\)]+\)|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).filter(Boolean);
  return tokens.map((token, index) => {
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <Link href={safeHref(link[2])} key={index}>{inline(link[1])}</Link>;
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{inline(token.slice(2, -2))}</strong>;
    if (token.startsWith("*") && token.endsWith("*")) return <em key={index}>{inline(token.slice(1, -1))}</em>;
    if (token.startsWith("`") && token.endsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>;
    return <span key={index}>{token}</span>;
  });
}

function cells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

export function MarkdownArticle({ body }: { body: string }) {
  const lines = body.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let index = 0;
  let paragraph: string[] = [];
  let list: string[] = [];
  let ordered = false;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(<p key={`p-${blocks.length}`}>{inline(paragraph.join(" ").trim())}</p>);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (!list.length) return;
    const items = list.map((item, itemIndex) => <li key={itemIndex}>{inline(item)}</li>);
    blocks.push(ordered ? <ol key={`ol-${blocks.length}`}>{items}</ol> : <ul key={`ul-${blocks.length}`}>{items}</ul>);
    list = [];
  };

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) { flushParagraph(); flushList(); index += 1; continue; }
    if (line.trim().startsWith("```")) {
      flushParagraph(); flushList();
      const code: string[] = []; index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) { code.push(lines[index]); index += 1; }
      blocks.push(<pre key={`pre-${blocks.length}`}><code>{code.join("\n")}</code></pre>);
      index += 1; continue;
    }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      const level = heading[1].length;
      const Heading = level === 2 ? "h2" : "h3";
      blocks.push(<Heading key={`h-${blocks.length}`}>{inline(heading[2])}</Heading>);
      index += 1; continue;
    }
    if (/^---+$/.test(line.trim())) { flushParagraph(); flushList(); blocks.push(<hr key={`hr-${blocks.length}`} />); index += 1; continue; }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) { flushParagraph(); flushList(); blocks.push(<blockquote key={`q-${blocks.length}`}>{inline(quote[1])}</blockquote>); index += 1; continue; }
    if (line.trim().startsWith("|") && index + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      flushParagraph(); flushList();
      const headers = cells(line); const rows: string[][] = []; index += 2;
      while (index < lines.length && lines[index].trim().startsWith("|")) { rows.push(cells(lines[index])); index += 1; }
      blocks.push(<div className="article-table-wrap" key={`table-${blocks.length}`}><table className="article-table"><thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{inline(cell)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{headers.map((_, cellIndex) => <td key={cellIndex}>{inline(row[cellIndex] ?? "")}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const number = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (bullet || number) {
      flushParagraph();
      if (!list.length) ordered = Boolean(number);
      list.push((bullet ?? number)![1]); index += 1; continue;
    }
    flushList(); paragraph.push(line.trim()); index += 1;
  }
  flushParagraph(); flushList();
  return <div className="markdown-body">{blocks}</div>;
}
