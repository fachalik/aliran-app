export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cream-100)" }}
    >
      <div className="w-full" style={{ maxWidth: 360 }}>
        <div className="text-center" style={{ marginBottom: 44 }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                fontWeight: 400,
                color: "var(--forest-800)",
                letterSpacing: "-0.02em",
              }}
            >
              Aliran
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
