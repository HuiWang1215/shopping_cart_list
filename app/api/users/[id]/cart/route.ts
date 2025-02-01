import { connectToDb } from "@/app/api/db";
import { NextRequest } from "next/server";

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { db } = await connectToDb();
  const userId = params.id;
  const userCart = await db.collection("carts").findOne({ userId });

  if (!userCart) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }
  const cardProducts = await db
    .collection("products")
    .find({ id: { $in: userCart.cartIds } })
    .toArray();

  return new Response(JSON.stringify(cardProducts), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

interface CartBody {
  productId: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { db } = await connectToDb();
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;
  const updatedCart = await db
    .collection("carts")
    .findOneAndUpdate(
      { userId },
      { $push: { cartIds: productId } },
      { upsert: true, returnDocument: "after" }
    );
  const cardProducts = await db
    .collection("products")
    .find({ id: { $in: updatedCart.cartIds } })
    .toArray();
  return new Response(JSON.stringify(cardProducts), {
    status: 201,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { db } = await connectToDb();
  const userId = params.id;
  const body: CartBody = await request.json();
  const productId = body.productId;
  const updatedCart = await db
    .collection("carts")
    .findOneAndUpdate(
      { userId },
      { $pull: { cartIds: productId } },
      { returnDocument: "after" }
    );

  if (!updatedCart) {
    return new Response(JSON.stringify([]), {
      status: 202,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const cardProducts = await db
    .collection("products")
    .find({ id: { $in: updatedCart.cartIds } })
    .toArray();
  return new Response(JSON.stringify(cardProducts), {
    status: 202,
    headers: {
      "content-type": "application/json",
    },
  });
}
