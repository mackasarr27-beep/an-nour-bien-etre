import SectionTitle from "../../components/SectionTitle";

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionTitle title="Blog" subtitle="Articles & conseils" />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6"></div>
    </div>
  );
}
