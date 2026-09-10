import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-4 py-12">
      <section className="w-full max-w-lg rounded-[28px] border border-emerald-900/10 bg-white/95 p-8 text-center shadow-[0_24px_70px_rgba(15,118,110,0.12)] sm:p-10">
        <p className="text-6xl font-semibold tracking-tight text-emerald-100">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-slate-900">Page introuvable</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Cette page n&apos;existe pas ou n&apos;est plus disponible.</p>
        <Link href="/" className="mt-7 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">← Retour à l&apos;accueil</Link>
      </section>
    </main>
  );
}
