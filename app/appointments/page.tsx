import SectionTitle from "../../components/SectionTitle";
import AppointmentForm from "../../components/AppointmentForm";

export default function AppointmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionTitle title="Rendez-vous" subtitle="Prise de rendez-vous" />
      <p className="mt-4 text-gray-600">Réservez votre soin en remplissant le formulaire ci-dessous.</p>
      <div className="mt-6">
        <AppointmentForm />
      </div>
    </div>
  );
}
