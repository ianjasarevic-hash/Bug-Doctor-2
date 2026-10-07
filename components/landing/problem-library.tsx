import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/landing/container";
import { Bug } from "@/components/landing/icons";

type Problem = {
  role: "Backend" | "Frontend" | "Full-stack" | "Database" | "AI / LLM" | "DevOps / SRE";
  difficulty: "easy" | "medium" | "hard" | "impossible";
  title: string;
  desc: string;
  log: string;
  stack: string[];
  rating: number;
  solved: number;
};

const problems: Problem[] = [
  {
    role: "Backend",
    difficulty: "hard",
    title: "Pool exhaustion at peak checkout",
    desc: "pg.Pool leaks under sustained 500 rps. p99 climbs past 4s. Pages go off.",
    log: "ERROR pool.query timeout after 30000ms",
    stack: ["Node", "Postgres"],
    rating: 4.8,
    solved: 1284,
  },
  {
    role: "Frontend",
    difficulty: "medium",
    title: "Cart re-renders freeze the tab",
    desc: "Selecting an item triggers 60+ renders. The frame budget is gone.",
    log: "WARN long task: 412ms (blocking main thread)",
    stack: ["React", "Redux"],
    rating: 4.6,
    solved: 982,
  },
  {
    role: "Database",
    difficulty: "hard",
    title: "N+1 on the orders dashboard",
    desc: "Loading 200 orders fires 1,400 queries. The dashboard times out at 30s.",
    log: "SELECT * FROM order_items WHERE order_id = $1 — ×1200",
    stack: ["Postgres", "Prisma"],
    rating: 4.7,
    solved: 654,
  },
  {
    role: "Full-stack",
    difficulty: "impossible",
    title: "Race in the reservation flow",
    desc: "Two users grab the last seat. Both succeed. The seat is sold twice.",
    log: "ERROR duplicate key: reservations_seat_idx",
    stack: ["Next.js", "Postgres"],
    rating: 4.9,
    solved: 211,
  },
  {
    role: "AI / LLM",
    difficulty: "medium",
    title: "Context window blowup in summarizer",
    desc: "The summarizer passes the entire thread every turn. Costs 4x. Quality flat.",
    log: "INFO prompt_tokens=142000 cost_usd=0.42",
    stack: ["Python", "OpenAI"],
    rating: 4.5,
    solved: 487,
  },
  {
    role: "DevOps / SRE",
    difficulty: "hard",
    title: "Pod OOM killed every Sunday 3am",
    desc: "Weekly cron jobs outgrow the 512Mi limit. Restarts loop. Pager fires.",
    log: "OOMKilled container=worker-7 exit_code=137",
    stack: ["Kubernetes"],
    rating: 4.7,
    solved: 372,
  },
];

export function ProblemLibrary() {
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="relative py-24 sm:py-32 border-t border-border"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action">
            Problem library
          </p>
          <h2
            id="library-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight"
          >
            What the problems look like.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            A few examples of the kind of incidents you&apos;ll see — drawn
            from real bug reports and generated scenarios across six roles.
            Problems are grouped by area and difficulty, with hidden checks
            that run against your fix.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((p) => (
            <ProblemCard key={p.title} problem={p} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <article className="group rounded-xl border border-border bg-surface hover:border-action/60 transition-colors overflow-hidden flex flex-col">
      {/* Log "image" */}
      <div className="font-mono text-[12px] leading-5 bg-bg/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-muted text-[11px] uppercase tracking-wider">
          <Bug size={11} />
          <span>incident · {problem.role.toLowerCase()}</span>
        </div>
        <div className="mt-2 text-text truncate">{problem.log}</div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge tone={problem.difficulty}>{problem.difficulty}</Badge>
          <span className="font-mono text-[11px] text-muted">
            {problem.role}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight group-hover:text-action transition-colors">
          {problem.title}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{problem.desc}</p>

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {problem.stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[11px] text-muted border border-border bg-bg rounded px-1.5 py-0.5"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between font-mono text-[12px] text-muted">
          <span>
            <span className="text-text">★ {problem.rating.toFixed(1)}</span>
            <span className="mx-2 text-border">·</span>
            <span>{problem.solved.toLocaleString()} solved</span>
          </span>
          <span className="text-action opacity-0 group-hover:opacity-100 transition-opacity">
            open →
          </span>
        </div>
      </div>
    </article>
  );
}