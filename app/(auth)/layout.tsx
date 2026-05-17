export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream-100)" }}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl font-bold" style={{ color: "var(--forest-800)", fontFamily: "var(--font-display)" }}>
              Aliran
            </span>
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}
