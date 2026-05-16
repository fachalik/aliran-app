import { Separator } from "@/components/ui/separator";

const PRODUCT_LINKS = [
  ["#features", "Fitur"],
  ["#how", "Cara kerja"],
  ["#faq", "FAQ"],
];
const CONTACT_LINKS = [
  ["mailto:halo@aliran.app", "halo@aliran.app"],
  // ["#", "Privacy"], ["#", "Terms"]
];

export function Footer() {
  return (
    <footer
      style={{ padding: "64px 24px 32px", background: "var(--cream-50)" }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto 48px",
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-10"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 7,
                background: "var(--forest-900)",
                color: "var(--cream-50)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: 18,
              }}
            >
              a
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "-0.01em",
              }}
            >
              Aliran
            </span>
          </div>
          <p
            style={{
              fontSize: 13.5,
              color: "var(--ink-500)",
              maxWidth: 320,
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            Lacak uangmu. Bot yang nagih temanmu. Tanpa drama.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-500)",
              margin: "0 0 16px",
            }}
          >
            Produk
          </h4>
          <ul
            className="flex flex-col gap-2.5 p-0"
            style={{ listStyle: "none" }}
          >
            {PRODUCT_LINKS.map(([href, label]) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    color: "var(--ink-700)",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink-500)",
              margin: "0 0 16px",
            }}
          >
            Kontak
          </h4>
          <ul
            className="flex flex-col gap-2.5 p-0"
            style={{ listStyle: "none" }}
          >
            {CONTACT_LINKS.map(([href, label]) => (
              <li key={label}>
                <a
                  href={href}
                  style={{
                    color: "var(--ink-700)",
                    textDecoration: "none",
                    fontSize: 14,
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Separator style={{ background: "var(--line)", marginBottom: 24 }} />
        <div
          className="flex flex-wrap items-center justify-between gap-2"
          style={{ fontSize: 12, color: "var(--ink-500)" }}
        >
          <span>© 2026 Aliran. Dibuat di Jakarta.</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
            v0.1 · Draft · Bukan financial advice
          </span>
        </div>
      </div>
    </footer>
  );
}
