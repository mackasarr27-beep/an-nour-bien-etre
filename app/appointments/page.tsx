import Link from "next/link";
import SectionTitle from "../../components/SectionTitle";
import AppointmentForm from "../../components/AppointmentForm";

export default function AppointmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">← Retour</Link>
      <SectionTitle title="Rendez-vous" subtitle="Prise de rendez-vous" />
      <p className="mt-4 text-gray-600">Réservez votre soin en remplissant le formulaire ci-dessous.</p>
      <div className="mt-6">
        <AppointmentForm />
      </div>
    </div>
  );
}
