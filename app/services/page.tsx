import Link from "next/link";
import SectionTitle from "../../components/SectionTitle";
import ServiceCard from "../../components/ServiceCard";

const services = [
  { title: "Soin visage premium", description: "Routine personnalisée pour un éclat naturel et une peau resplendissante." },
  { title: "Massage relaxant", description: "Un moment de détente profond avec des gestes apaisants et précis." },
  { title: "Aromathérapie", description: "Huiles essentielles et ambiance soignée pour un bien-être total." },
  { title: "Soin corps", description: "Hydratation, douceur et confort pour une peau sublime." },
  { title: "Beauté naturelle", description: "Des soins pensés pour révéler votre éclat sans agressivité." },
  { title: "Équilibre émotionnel", description: "Un accompagnement global pour retrouver sérénité et énergie." },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <section className="rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <SectionTitle title="Nos soins" subtitle="Des soins premium, personnalisés et naturels" />
        <p className="mt-3 max-w-3xl text-base leading-8 text-gray-600">
          Chaque soin est conçu pour répondre à vos attentes avec attention, qualité et une approche holistique. Que vous cherchiez détente, éclat ou rééquilibrage, nous vous accompagnons avec bienveillance.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} title={service.title} description={service.description} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/appointments" className="inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">Prendre rendez-vous</Link>
        </div>
      </section>
    </div>
  );
}
