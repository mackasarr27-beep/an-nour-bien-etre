import Image from "next/image";
import Link from "next/link";

const values = [
  { title: "Bienveillance", text: "Chaque visite est pensée pour vous offrir calme, écoute et confort." },
  { title: "Nature", text: "Nous privilégions des soins efficaces, doux et respectueux de votre peau." },
  { title: "Excellence", text: "Une expérience premium, soignée jusqu’au moindre détail." },
];

const team = [
  { name: "Dr. Amina", role: "Responsable soins visage" },
  { name: "Nadia", role: "Spécialiste massages" },
  { name: "Salma", role: "Conseillère beauté" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <section className="grid gap-8 rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600">À propos</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">An Nour Bien-Être, un espace de soins pensé pour votre équilibre</h1>
          <p className="mt-4 text-base leading-8 text-gray-600">
            Chez An Nour Bien-Être, nous créons des moments de détente et de beauté à travers des soins personnalisés, naturels et adaptés à chaque besoin. Notre cabinet réunit expertise, douceur et élégance pour offrir une expérience premium.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/appointments" className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Prendre rendez-vous</Link>
            <Link href="/services" className="rounded-full border border-gray-300 px-5 py-3 text-sm font-semibold">Découvrir nos soins</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-[24px]">
          <Image src="/Bannière.png" alt="Cabinet An Nour Bien-Être" width={800} height={640} className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Notre histoire</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">Né de la volonté de créer un lieu de bien-être à la fois moderne, doux et rassurant, An Nour Bien-Être accompagne chaque client vers un moment d’harmonie.</p>
        </div>
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Notre mission</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">Proposer des soins de qualité, des gestes précis et un service attentionné pour révéler votre éclat naturel.</p>
        </div>
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Pourquoi nous choisir</h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">Cabinet premium, environnement apaisant, équipe qualifiée et accompagnement personnalisé à chaque étape.</p>
        </div>
      </section>

      <section className="mt-10 rounded-[32px] border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold">Nos valeurs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-[20px] bg-white p-5 shadow-sm">
              <h3 className="font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-7 text-gray-600">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Notre équipe</h2>
          <div className="mt-6 space-y-4">
            {team.map((person) => (
              <div key={person.name} className="rounded-[18px] border border-gray-100 p-4">
                <div className="font-semibold">{person.name}</div>
                <div className="mt-1 text-sm text-gray-500">{person.role}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold">Galerie</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="overflow-hidden rounded-[20px]">
                <Image src="/Bannière.png" alt={`Galerie ${item}`} width={600} height={420} className="h-40 w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
