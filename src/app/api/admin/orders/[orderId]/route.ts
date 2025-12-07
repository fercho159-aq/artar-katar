import 'dotenv/config';
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { z } from 'zod';

const updateStatusSchema = z.object({
    adminUid: z.string(),
    status: z.enum(['Pendiente', 'Completado', 'Enviado', 'Cancelado', 'Reembolsado']),
});

/**
 * PATCH /api/admin/orders/[orderId]
 * Update order status (admin only)
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    const client = await pool.connect();

    try {
        const { orderId } = await params;
        const body = await request.json();
        const validation = updateStatusSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: 'Datos inválidos', errors: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { adminUid, status } = validation.data;

        // Verify the user is an admin
        const adminCheck = await client.query(
            'SELECT is_admin FROM users WHERE uid = $1',
            [adminUid]
        );

        if (adminCheck.rows.length === 0 || !adminCheck.rows[0].is_admin) {
            return NextResponse.json(
                { message: 'No tienes permisos de administrador' },
                { status: 403 }
            );
        }

        // Update the order status
        const updateResult = await client.query(
            'UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, status',
            [status, orderId]
        );

        if (updateResult.rows.length === 0) {
            return NextResponse.json(
                { message: 'Orden no encontrada' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: 'Estado actualizado correctamente',
            order: updateResult.rows[0],
        });

    } catch (error) {
        console.error('Admin Update Order API Error:', error);
        return NextResponse.json(
            { message: 'Error al actualizar la orden' },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
