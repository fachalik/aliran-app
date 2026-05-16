import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Nav() {
  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <nav
        className="flex items-center gap-1 rounded-full px-3 py-1.5"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-2)",
          paddingLeft: 18,
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 pr-3 no-underline"
          style={{
            color: "var(--text)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "-0.01em",
          }}
        >
          <span
            className="grid place-items-center text-lg italic"
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "var(--forest-900)",
              color: "var(--cream-50)",
              fontFamily: "var(--font-display)",
            }}
          >
            a
          </span>
          <span>Aliran</span>
        </Link>

        <div
          className="flex gap-1 pl-2"
          style={{ borderLeft: "1px solid var(--line)" }}
        >
          {[
            ["#features", "Fitur"],
            ["#how", "Cara kerja"],
            ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-3.5 py-2 text-sm no-underline transition-colors hover:bg-[var(--cream-200)]"
              style={{ color: "var(--ink-700)" }}
            >
              {label}
            </a>
          ))}
        </div>

        <Button size="sm" className="ml-2 rounded-full px-5">
          <a href="/signup">Coba gratis</a>
        </Button>
      </nav>
    </div>
  );
}
