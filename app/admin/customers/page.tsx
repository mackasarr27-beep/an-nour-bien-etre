import AdminHeader from "../../../components/AdminHeader";
import AdminSidebar from "../../../components/AdminSidebar";
import CustomerTable from "../../../components/CustomerTable";

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <div className="flex flex-col lg:flex-row">
        <AdminSidebar />
        <main className="flex-1 p-4 lg:p-8">
          <AdminHeader />
          <section className="mt-6">
            <CustomerTable />
          </section>
        </main>
      </div>
    </div>
  );
}
