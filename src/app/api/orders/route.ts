import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const orderItemSchema = z.object({
  product: z.object({
    id: z.string(), // This is the product_sku
    name: z.string(),
    price: z.number(),
    image: z.string().optional(),
  }),
  quantity: z.number().min(1),
});

const shippingAddressSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  street: z.string().min(1, 'Calle requerida'),
  city: z.string().min(1, 'Ciudad requerida'),
  state: z.string().min(1, 'Estado requerido'),
  postalCode: z.string().min(5, 'Código postal inválido'),
  country: z.string().default('México'),
  notes: z.string().optional(),
});

const orderSchema = z.object({
  userId: z.string(), // This is the public uid
  items: z.array(orderItemSchema),
  totalAmount: z.number(),
  paymentReference: z.string().optional(),
  paymentStatus: z.string().optional(),
  shippingAddress: shippingAddressSchema.optional(), // Optional for digital products
  requiresShipping: z.boolean().default(false),
});


export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const body = await request.json();
    const validation = orderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Entrada inválida', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { userId, items, totalAmount, paymentReference, paymentStatus, shippingAddress, requiresShipping } = validation.data;

    // Validate shipping address is provided for physical products
    if (requiresShipping && !shippingAddress) {
      return NextResponse.json({ message: 'Se requiere dirección de envío para productos físicos.' }, { status: 400 });
    }

    // Start a transaction
    await client.query('BEGIN');

    // 1. Get the internal user ID from the public UID
    const userResult = await client.query('SELECT id FROM users WHERE uid = $1', [userId]);
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }
    const internalUserId = userResult.rows[0].id;

    // 2. Create the order in the `orders` table with shipping info
    const orderInsertResult = await client.query(
      `INSERT INTO orders (
        user_id, 
        total_amount, 
        status,
        payment_reference,
        shipping_name,
        shipping_phone,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country,
        shipping_notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        internalUserId,
        totalAmount,
        paymentStatus || 'Completado',
        paymentReference || null,
        shippingAddress?.name || null,
        shippingAddress?.phone || null,
        shippingAddress?.street || null,
        shippingAddress?.city || null,
        shippingAddress?.state || null,
        shippingAddress?.postalCode || null,
        shippingAddress?.country || 'México',
        shippingAddress?.notes || null,
      ]
    );
    const orderId = orderInsertResult.rows[0].id;

    // 3. For each item in the cart, create a record in the `order_items` table
    for (const item of items) {
      // Find the internal product ID from its SKU (works for all product types)
      const productResult = await client.query('SELECT id FROM products WHERE product_sku = $1', [item.product.id]);
      
      if (productResult.rows.length === 0) {
        // If a product is not found, rollback the transaction
        await client.query('ROLLBACK');
        return NextResponse.json({ message: `Producto con SKU ${item.product.id} no encontrado.` }, { status: 400 });
      }
      const productId = productResult.rows[0].id;

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ($1, $2, $3, $4)',
        [orderId, productId, item.quantity, item.product.price]
      );
    }

    // Commit the transaction
    await client.query('COMMIT');

    return NextResponse.json({ message: 'Pedido creado exitosamente', orderId: orderId }, { status: 201 });

  } catch (error) {
    // If any error occurs, rollback the transaction
    await client.query('ROLLBACK');
    console.error('API Create Order Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió';
    return NextResponse.json({ message: 'Fallo al crear el pedido', error: errorMessage }, { status: 500 });
  } finally {
    client.release();
  }
}
