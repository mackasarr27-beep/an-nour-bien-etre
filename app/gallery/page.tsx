import SectionTitle from "../../components/SectionTitle";

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionTitle title="Galerie" subtitle="Nos moments & réalisations" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4"></div>
    </div>
  );
}
