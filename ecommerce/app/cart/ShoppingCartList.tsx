"use client";

import { useState } from "react";
import { Product } from "../product-data";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export default function ShoppingCartList({
  initialCartProducts,
}: {
  initialCartProducts: Product[];
}) {
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  async function removeFromCart(productId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/2/cart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    const updatedCartProducts = await response.json();
    setCartProducts(updatedCartProducts);
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <ul className="space-y-4">
        {cartProducts.map((product) => (
          <li
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300"
          >
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600">${product.price}</p>
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={(e) => {
                    e.preventDefault();
                    removeFromCart(product.id);
                  }}
                >
                  Remove from Cart
                </button>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
