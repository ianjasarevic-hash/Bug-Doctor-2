"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
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
  { tokens: [{ text: "    ", tone: "muted" }, { text: "return ", tone: "muted" }, { text: "await ", tone: "kw" }, { text: "pool", tone: "fn" }, { text: ".query(sql, params);", tone: "punct" }] },
  { tokens: [{ text: "  } ", tone: "punct" }, { text: "finally", tone: "kw" }, { text: " {", tone: "punct" }] },
  { tokens: [{ text: "    ", tone: "muted" }, { text: "/* always release the client */", tone: "cmt" }] },
  { tokens: [{ text: "  }", tone: "punct" }] },
  { tokens: [{ text: "}", tone: "punct" }] },
];

// Terminal "script" — each line is a tuple of [text, delayBeforeRevealMs].
// The terminal types out the lines with a blinking cursor at the end of
// the active line, exactly like a real IDE.
const terminalScript: { text: string; tone: string; delay: number }[] = [
  { text: "$ npm test", tone: "prompt", delay: 0 },
  { text: "✓ 14 passing", tone: "ok", delay: 600 },
  { text: "✓ checkout.spec.ts", tone: "muted", delay: 850 },
  { text: "$ bugdr check", tone: "prompt", delay: 1400 },
  { text: "running 4 production checks…", tone: "muted", delay: 1900 },
  { text: "✓ p99 latency 142ms", tone: "ok", delay: 2400 },
  { text: "✓ pool size 16/20", tone: "ok", delay: 2700 },
  { text: "✓ connection leaks 0", tone: "ok", delay: 3000 },
  { text: "✓ test suite 14/14", tone: "ok", delay: 3300 },
  { text: "→ score 672 XP · prod-ready 94%", tone: "accent", delay: 3700 },
];

export function BrowserIDE() {
  return (
    <section
      id="ide"
      aria-labelledby="ide-heading"
      className="relative py-24 sm:py-32"
    >
      <Container>
        <motion.h2
          id="ide-heading"
          className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          The same IDE you&apos;d run on prod — in your browser.
        </motion.h2>

        <motion.div
          className="mt-10 rounded-xl border border-border bg-surface shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
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
            {/* File tree — entries stagger in from the left */}
            <FileTree />

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

              {/* Terminal — animated typing */}
              <Terminal />
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function FileTree() {
  const reduce = useReducedMotion();
  const tree = [
    { text: "services", muted: true, depth: 0 },
    { text: "↳ auth", muted: true, depth: 1 },
    { text: "↳ checkout", muted: false, depth: 1 },
    { text: "pool.ts", muted: false, depth: 2, active: true },
    { text: "tx.ts", muted: true, depth: 2 },
    { text: "discount.ts", muted: true, depth: 2 },
    { text: "↳ payments", muted: true, depth: 1 },
    { text: "↳ shipping", muted: true, depth: 1 },
    { text: "↳ notifications", muted: true, depth: 1 },
    { text: "↳ storefront", muted: true, depth: 1 },
  ];
  return (
    <div className="col-span-3 border-r border-border bg-bg/40 p-3 font-mono text-[11px] leading-6">
      <motion.div
        className="text-muted mb-1"
        initial={{ opacity: 0, x: reduce ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        services
      </motion.div>
      <ul className="space-y-0.5">
        {tree.slice(1).map((row, i) => (
          <motion.li
            key={row.text}
            className={[
              row.muted ? "text-muted" : "text-text",
              row.active ? "text-action bg-action/10 rounded px-1.5 -ml-1.5" : "",
              row.depth === 2 ? "pl-5" : "",
            ].join(" ")}
            initial={{ opacity: 0, x: reduce ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.4,
              delay: 0.05 + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {row.text}
          </motion.li>
        ))}
      </ul>
      <motion.div
        className="mt-4 text-muted"
        initial={{ opacity: 0, x: reduce ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        tests
      </motion.div>
      <motion.ul
        className="space-y-0.5 mt-1"
        initial={{ opacity: 0, x: reduce ? 0 : -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <li className="text-muted pl-5">checkout.spec.ts</li>
      </motion.ul>
    </div>
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

function Terminal() {
  // How many characters of the current line to show. The "type" advances
  // 30ms per character once the line is "active".
  const [activeLine, setActiveLine] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (activeLine >= terminalScript.length) return;
    const line = terminalScript[activeLine];

    // Wait until this line's delay has passed before starting.
    const startDelay = line.delay - (activeLine > 0 ? terminalScript[activeLine - 1].delay : 0);
    const start = setTimeout(() => {
      if (line.text.length === 0) {
        // Empty line: reveal immediately and move on after a beat.
        setCharCount(0);
        const next = setTimeout(() => {
          setActiveLine((n) => n + 1);
          setCharCount(0);
        }, 200);
        return () => clearTimeout(next);
      }
      setCharCount(0);
      const interval = setInterval(() => {
        setCharCount((c) => {
          if (c >= line.text.length) {
            clearInterval(interval);
            // Pause briefly, then advance to the next line.
            setTimeout(() => {
              setActiveLine((n) => n + 1);
              setCharCount(0);
            }, 350);
            return c;
          }
          return c + 1;
        });
      }, 28);
      return () => clearInterval(interval);
    }, Math.max(0, startDelay));

    return () => clearTimeout(start);
  }, [activeLine]);

  return (
    <div className="border-t border-border bg-bg/80 px-4 py-2 font-mono text-[11px] leading-6">
      <div className="text-muted mb-1">terminal</div>
      {terminalScript.slice(0, activeLine).map((line, i) => (
        <div
          key={i}
          className={
            line.tone === "ok"
              ? "text-success"
              : line.tone === "accent"
                ? "text-action"
                : line.tone === "muted"
                  ? "text-muted"
                  : "text-muted"
          }
        >
          {line.tone === "prompt" ? (
            <>
              <span className="text-action">$</span>{" "}
              <span className="text-text">{line.text.replace(/^\$\s*/, "")}</span>
            </>
          ) : (
            line.text
          )}
        </div>
      ))}
      {activeLine < terminalScript.length && (
        <div
          className={
            terminalScript[activeLine].tone === "ok"
              ? "text-success"
              : terminalScript[activeLine].tone === "accent"
                ? "text-action"
                : "text-muted"
          }
        >
          {terminalScript[activeLine].tone === "prompt" ? (
            <>
              <span className="text-action">$</span>{" "}
              <span className="text-text">
                {terminalScript[activeLine].text.replace(/^\$\s*/, "").slice(0, charCount)}
              </span>
            </>
          ) : (
            terminalScript[activeLine].text.slice(0, charCount)
          )}
          <span className="inline-block w-2 h-3 bg-text align-middle ml-0.5 animate-blink" />
        </div>
      )}
    </div>
  );
}
