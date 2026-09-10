import AdminHeader from "../../../components/AdminHeader";
import AdminSidebar from "../../../components/AdminSidebar";
import AppointmentAdminBoard from "../../../components/AppointmentAdminBoard";

export default function AdminAppointmentsPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <AdminHeader />
          <section className="mt-6">
            <AppointmentAdminBoard />
          </section>
        </main>
      </div>
    </div>
  );
}
