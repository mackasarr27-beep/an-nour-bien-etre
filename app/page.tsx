import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import Footer from "../components/Footer";
import ServicesGrid from "../components/ServicesGrid";
import SectionTitle from "../components/SectionTitle";
import TestimonialCard from "../components/TestimonialCard";
import CTASection from "../components/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="flex-1">
        <HeroBanner />

        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionTitle title="Nos soins" subtitle="Des protocoles pensés pour votre bien-être" />
          <ServicesGrid />
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <SectionTitle title="Présentation du cabinet" subtitle="Notre approche" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <p className="text-gray-700 dark:text-gray-300">Notre cabinet propose des soins naturels et personnalisés, réalisés par des experts expérimentés. L'espace a été conçu pour offrir calme et confort pour une expérience premium.</p>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg animate-[fadeIn_600ms_ease]" />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 rounded-md">
          <SectionTitle title="Témoignages" subtitle="Ils ont testé nos soins" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard name="Marie" quote="Un moment exceptionnel, je recommande !" />
            <TestimonialCard name="Paul" quote="Ambiance apaisante et équipe très professionnelle." />
            <TestimonialCard name="Sophie" quote="Des résultats visibles et un accueil chaleureux." />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <CTASection />
        </div>

      </main>
      <Footer />
    </div>
  );
}
