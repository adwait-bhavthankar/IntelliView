import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Image
        src="/logo.png"
        alt="IntelliView Logo"
        width={180}
        height={100}
        className="mb-6 drop-shadow-md"
      />

      {/* Title + Tagline */}
      <h1 className="text-5xl font-extrabold tracking-tight text-center text-indigo-600 dark:text-indigo-300 drop-shadow-sm">
        IntelliView
      </h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300 text-center max-w-xl">
        Smart. Scalable. Automated Interviews — Powered by AI.
      </p>

      {/* Navigation Cards */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        <HomeCard
          title="Client Login"
          href="/client/dashboard"
          description="Create or manage interviews"
        />
        <HomeCard
  title="Candidate Portal"
  href="/candidate" // ✅ just send to /candidate, and maybe let them input the code
  description="Join interview using code"
/>
        <HomeCard
          title="Admin Panel"
          href="/admin/dashboard"
          description="Monitor analytics & user data"
        />
      </div>

      {/* Footer */}
      <footer className="mt-16 text-xs text-slate-400 dark:text-slate-500 text-center">
        © 2025 IntelliView. Built for smarter hiring.
      </footer>
    </main>
  );
}

function HomeCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-xl p-6 shadow-md hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-300 transition cursor-pointer">
        <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">{title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{description}</p>
      </div>
    </Link>
  );
}
