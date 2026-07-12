import SectionTitle from "../../components/SectionTitle";
import ProductGrid from "../../components/ProductGrid";
import { CartProvider } from "../../components/CartContext";

export default function ShopPage() {
  return (
    <CartProvider>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <SectionTitle title="Boutique" subtitle="Produits disponibles" />
        <ProductGrid />
      </div>
    </CartProvider>
  );
}
