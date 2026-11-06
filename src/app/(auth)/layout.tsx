import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="p-6">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Influence<span className="text-primary">X</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="text-center text-sm text-muted-foreground p-6">
        © {new Date().getFullYear()} InfluenceX. All rights reserved.
      </footer>
    </div>
  );
}