import Catalogue from "@/lib/components/Catalogue";
import Footer from "@/lib/components/Footer";
import Shelf from "@/lib/components/Shelf";

export default function Page({ cartCount = 0 }: { cartCount?: number }) {
  return (
    <div className="bg-stone-800">
      <Shelf />
      <Catalogue />
      <Footer />
    </div>
  );
}