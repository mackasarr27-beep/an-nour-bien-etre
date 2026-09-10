import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:py-14">
      <section className="rounded-[28px] border border-emerald-900/10 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,118,110,0.12)] sm:p-10">
        <Link href="/" className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">AN NOUR BIEN-ÊTRE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Politique de confidentialité</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-slate-600">
          <p>AN NOUR BIEN-ÊTRE utilise les informations transmises via ses formulaires uniquement pour répondre aux demandes, organiser les rendez-vous et traiter les commandes.</p>
          <p>Les informations de compte et d’authentification sont gérées par les services Firebase déjà utilisés par le site. Elles ne sont pas utilisées à d’autres fins que le fonctionnement de votre espace.</p>
          <p>Pour toute question concernant vos informations, vous pouvez contacter AN NOUR BIEN-ÊTRE par téléphone au 78 216 07 41 ou depuis la page Contact.</p>
        </div>
        <Link href="/contact" className="mt-8 inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800">Nous contacter</Link>
      </section>
    </main>
  );
}
