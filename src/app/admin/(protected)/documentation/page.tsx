import { BookOpen } from "lucide-react";
import Link from "next/link";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { adminDocs, getAdminDoc, readAdminDoc } from "@/lib/admin-docs";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function paramValue(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDocumentationPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireSuperAdmin();
  const params = await searchParams;
  const activeDoc = getAdminDoc(paramValue(params, "doc"));
  const markdown = await readAdminDoc(activeDoc);

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center gap-3">
          <BookOpen className="size-5 text-blue-700" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Documentation
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Super Admin documentation loaded from the repository. These docs
              are not exposed publicly.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200 xl:sticky xl:top-24 xl:self-start">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Documentation files
          </h3>
          <nav className="mt-3 space-y-1">
            {adminDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/admin/documentation?doc=${doc.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold ${
                  doc.slug === activeDoc.slug
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-100 hover:text-blue-700"
                }`}
              >
                {doc.title}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <MarkdownView markdown={markdown} />
        </article>
      </div>
    </div>
  );
}

function MarkdownView({ markdown }: { markdown: string }) {
  const blocks = toBlocks(markdown);

  return (
    <div className="space-y-4 text-slate-700">
      {blocks.map((block, index) => {
        if (block.type === "h1") {
          return (
            <h1 key={index} className="text-3xl font-semibold text-slate-950">
              {block.text}
            </h1>
          );
        }

        if (block.type === "h2") {
          return (
            <h2 key={index} className="pt-4 text-2xl font-semibold text-slate-950">
              {block.text}
            </h2>
          );
        }

        if (block.type === "h3") {
          return (
            <h3 key={index} className="pt-3 text-xl font-semibold text-slate-950">
              {block.text}
            </h3>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm leading-6 text-slate-50"
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 text-sm leading-7">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{formatInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5 text-sm leading-7">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{formatInline(item.replace(/^\d+\.\s+/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (block.type === "p") {
          return (
            <p key={index} className="text-sm leading-7 text-slate-700">
              {formatInline(block.text)}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
}

type MarkdownBlock =
  | { type: "h1" | "h2" | "h3" | "p" | "code"; text: string }
  | { type: "ul" | "ol"; items: string[] };

function toBlocks(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let code: string[] = [];
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length) {
      blocks.push({ type: "p", text: paragraph.join(" ") });
      paragraph = [];
    }
  }

  function flushList() {
    if (listType && list.length) {
      blocks.push({ type: listType, items: list });
      list = [];
      listType = null;
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        blocks.push({ type: "code", text: code.join("\n") });
        code = [];
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h3", text: trimmed.replace(/^###\s+/, "") });
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: trimmed.replace(/^##\s+/, "") });
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h1", text: trimmed.replace(/^#\s+/, "") });
      continue;
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph();
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      list.push(trimmed.replace(/^-\s+/, ""));
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      list.push(trimmed);
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (code.length) {
    blocks.push({ type: "code", text: code.join("\n") });
  }

  return blocks;
}

function formatInline(text: string) {
  const parts = text.split(/(`[^`]+`)/g);

  return parts.map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={index}
        className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.85em] font-semibold text-slate-900"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
