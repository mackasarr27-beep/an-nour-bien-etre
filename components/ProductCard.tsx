import React from "react";
import Image from "next/image";

type Props = {
  title: string;
  price?: string;
  img?: string;
};

export default function ProductCard({ title, price, img }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {img && (
        <div className="w-full h-44 relative">
          <Image src={img} alt={title} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-medium">{title}</h4>
        {price && <p className="text-sm text-gray-600">{price}</p>}
      </div>
    </div>
  );
}
