// Code renderer that keeps whitespace between tokens.
//
// Why: the previous version had `<span>foo</span><span>bar</span>` which
// renders as "foobar" because JSX strips the inter-element newline and
// `display: flex` (or anything that isn't `space`) eats the inter-token
// whitespace. Here every token's `text` includes its own trailing space, and
// `white-space: pre` on the <pre> keeps them intact. `font-variant-ligatures:
// none` stops "=>" rendering as "⇒".

type Tone =
  | "kw"      // keywords (export, function, const, return, ...)
  | "fn"      // identifiers / function names
  | "str"     // strings
  | "num"     // numbers
  | "cmt"     // comments
  | "punct"   // punctuation ( ) { } ;
  | "muted"   // default muted (operators, plain tokens)
  | "text"    // body text on dark
  | "bug"     // highlighted buggy line
  | "add"     // diff-added
  | "del"     // diff-removed
  | "lineno" // gutter line numbers
  | "gutter-marker"; // + / − gutter icons in diffs

const TONE_CLASS: Record<Tone, string> = {
  kw: "text-action",
  fn: "text-text",
  str: "text-text",
  num: "text-action",
  cmt: "text-muted italic",
  punct: "text-muted",
  muted: "text-muted",
  text: "text-text",
  bug: "text-text",
  add: "text-text",
  del: "text-muted line-through",
  lineno: "text-muted/70",
  "gutter-marker": "text-muted",
};

export type Token = { text: string; tone?: Tone };
export type Line = { tokens: Token[] };

export function CodeBlock({
  lines,
  showLineNumbers = true,
  className,
}: {
  lines: Line[];
  showLineNumbers?: boolean;
  className?: string;
}) {
  return (
    <pre
      className={`font-mono whitespace-pre ${className ?? ""}`}
      style={{
        fontVariantLigatures: "none",
        WebkitFontFeatureSettings: '"liga" 0, "calt" 0',
        fontFeatureSettings: '"liga" 0, "calt" 0',
      }}
    >
      {lines.map((line, i) => (
        <div key={i} className="flex">
          {showLineNumbers ? (
            <span
              className={
                `shrink-0 text-right pr-3 select-none w-10 ` +
                TONE_CLASS.lineno
              }
            >
              {i + 1}
            </span>
          ) : null}
          <span className="min-w-0">
            {line.tokens.length === 0 ? (
              <span> </span>
            ) : (
              line.tokens.map((tok, j) => (
                <span key={j} className={TONE_CLASS[tok.tone ?? "muted"]}>
                  {tok.text}
                </span>
              ))
            )}
          </span>
        </div>
      ))}
    </pre>
  );
}

// Convenience: a single "buggy line" wrapper, used inside a code block to add
// the highlight bar + background on the whole row.
export function BuggyLine({
  lines,
  showLineNumbers = true,
}: {
  lines: Line[];
  showLineNumbers?: boolean;
}) {
  return (
    <div className="-mx-4 px-4 bg-[#1a1c20] border-l-2 border-text">
      <CodeBlock lines={lines} showLineNumbers={showLineNumbers} />
    </div>
  );
}