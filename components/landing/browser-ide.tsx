"use client";

import { Container } from "@/components/landing/container";
import { CodeBlock, type Line } from "@/components/landing/code-block";

// Full-container-width IDE moment. No copy column, no CTA — just the IDE.
// Tabs: pool.ts (active), incident.md, preview. Terminal at bottom.
//
// The "preview" tab is the browser-IDE's live preview pane — the same
// checkout endpoint that pool.ts feeds. While the user is editing code, the
// preview re-runs against the patched module.

const poolLines: Line[] = [
  { tokens: [{ text: "import ", tone: "kw" }, { text: "{ Pool }", tone: "punct" }, { text: " from ", tone: "kw" }, { text: '"pg"', tone: "str" }, { text: ";", tone: "punct" }] },
  { tokens: [] },
  { tokens: [{ text: "export ", tone: "kw" }, { text: "const ", tone: "kw" }, { text: "pool", tone: "fn" }, { text: " = ", tone: "muted" }, { text: "new", tone: "kw" }, { text: " ", tone: "muted" }, { text: "Pool", tone: "fn" }, { text: "({", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "max", tone: "fn" }, { text: ": ", tone: "muted" }, { text: "20", tone: "num" }, { text: ",", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "idleTimeoutMillis", tone: "fn" }, { text: ": ", tone: "muted" }, { text: "10000", tone: "num" }, { text: ",", tone: "punct" }] },
  { tokens: [{ text: "});", tone: "punct" }] },
  { tokens: [] },
  { tokens: [{ text: "export ", tone: "kw" }, { text: "async ", tone: "kw" }, { text: "function ", tone: "kw" }, { text: "query", tone: "fn" }, { text: "(sql, params) {", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "try", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "return ", tone: "kw" }, { text: "await ", tone: "kw" }, { text: "pool", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "} ", tone: "punct" }, { text: "finally", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "/* always release the client */", tone: "cmt" }] },
  { tokens: [{ text: "  ", tone: "muted" }, { text: "}", tone: "punct" }] },
  { tokens: [{ text: "}", tone: "punct" }] },
];

export function BrowserIDE() {
  return (
    <section
      id="ide"
      aria-labelledby="ide-heading"
      className="relative py-24 sm:py-32"
    >
      <Container>
        <h2
          id="ide-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight"
        >
          The same IDE you&apos;d run on prod — in your browser.
        </h2>

        <div className="mt-10 rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center justify-between border-b border-border bg-bg/60 px-4 py-2 font-mono text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="h-2 w-2 rounded-full bg-border" />
              <span className="ml-3 text-muted">
                bug.dr · checkout / services / checkout
              </span>
            </div>
            <span className="text-muted">⌘R · run</span>
          </div>

          {/* Body */}
          <div className="grid grid-cols-12">
            {/* File tree */}
            <div className="col-span-3 border-r border-border bg-bg/40 p-3 font-mono text-[11px] leading-6">
              <div className="text-muted mb-1">services</div>
              <ul className="space-y-0.5">
                <li className="text-muted">↳ auth</li>
                <li className="text-text">∈ checkout</li>
                <li className="text-action bg-action/10 rounded px-1.5 -ml-1.5">
                  &nbsp;&nbsp;pool.ts
                </li>
                <li className="text-muted pl-5">tx.ts</li>
                <li className="text-muted pl-5">discount.ts</li>
                <li className="text-muted">↳ payments</li>
                <li className="text-muted">↳ shipping</li>
                <li className="text-muted">↳ notifications</li>
                <li className="text-muted">↳ storefront</li>
              </ul>
              <div className="mt-4 text-muted">tests</div>
              <ul className="space-y-0.5 mt-1">
                <li className="text-muted pl-5">checkout.spec.ts</li>
              </ul>
            </div>

            {/* Right: tabs + editor + terminal */}
            <div className="col-span-9 flex flex-col min-w-0">
              {/* Tabs */}
              <div className="flex border-b border-border bg-bg/30 font-mono text-[11px]">
                <Tab label="pool.ts" active />
                <Tab label="incident.md" />
                <Tab label="preview" />
              </div>

              {/* Editor area */}
              <div className="bg-bg px-5 py-3 flex-1 overflow-x-auto">
                <CodeBlock lines={poolLines} />
              </div>

              {/* Terminal */}
              <div className="border-t border-border bg-bg/80 px-4 py-2 font-mono text-[11px] leading-6">
                <div className="text-muted mb-1">terminal</div>
                <div className="text-muted">
                  <span className="text-action">$</span> npm test
                </div>
                <div className="text-success">✓ 14 passing</div>
                <div className="text-muted">✓ checkout.spec.ts</div>
                <div className="text-muted">
                  <span className="text-action">$</span> <span>bugdr check</span>
                </div>
                <div className="text-muted">running 4 production checks…</div>
                <div>
                  <span className="text-action">$</span>{" "}
                  <span className="inline-block w-2 h-3 bg-text align-middle animate-blink" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Tab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "px-3 py-2 border-r border-border",
        active ? "text-text bg-bg" : "text-muted bg-bg/30",
      ].join(" ")}
    >
      {label}
    </div>
  );
}