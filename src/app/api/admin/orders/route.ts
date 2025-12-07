import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

/**
 * GET /api/admin/orders
 * Get all orders (admin only)
 */
export async function GET(request: Request) {
    const client = await pool.connect();

    try {
        // Get admin UID from query params (in a real app, use session/JWT)
        const { searchParams } = new URL(request.url);
        const adminUid = searchParams.get('adminUid');
        const statusFilter = searchParams.get('status'); // Optional filter

        if (!adminUid) {
            return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
        }

        // Verify the user is an admin
        const adminCheck = await client.query(
            'SELECT is_admin FROM users WHERE uid = $1',
            [adminUid]
        );

        if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
            return NextResponse.json({ message: 'No tienes permisos de administrador' }, { status: 403 });
        }

        // Build query based on status filter
        let query = `
      SELECT 
        o.id as order_id,
        o.order_date,
        o.total_amount,
        o.status,
        o.payment_reference,
        o.shipping_name,
        o.shipping_phone,
        o.shipping_street,
        o.shipping_city,
        o.shipping_state,
        o.shipping_postal_code,
        o.shipping_country,
        o.shipping_notes,
        u.name as customer_name,
        u.email as customer_email,
        u.uid as customer_uid
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `;

        const params: string[] = [];

        if (statusFilter && statusFilter !== 'all') {
            query += ' WHERE o.status = $1';
            params.push(statusFilter);
        }

        query += ' ORDER BY o.order_date DESC';

        const ordersResult = await client.query(query, params);

        // Get order items for each order
        const ordersWithItems = await Promise.all(
            ordersResult.rows.map(async (order) => {
                const itemsResult = await client.query(
                    `SELECT 
            oi.quantity,
            oi.price_at_purchase,
            COALESCE(p.name, 'Producto Digital') as product_name,
            COALESCE(p.product_sku, 'N/A') as product_sku,
            COALESCE(p.image_url, '') as image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = $1`,
                    [order.order_id]
                );

                return {
                    ...order,
                    items: itemsResult.rows,
                };
            })
        );

        return NextResponse.json(ordersWithItems);

    } catch (error) {
        console.error('Admin Orders API Error:', error);
        return NextResponse.json(
            { message: 'Error al obtener las órdenes' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
