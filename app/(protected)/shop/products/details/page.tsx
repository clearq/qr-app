import { auth } from "@/auth";
import { ProductPublicSingle } from "@/components/ProductPublicSingle";
import React from "react";

const ProductDetails = async () => {
  const session = await auth();
  return (
    <div>
      <ProductPublicSingle user={session?.user} />
    </div>
  );
};

export default ProductDetails;
