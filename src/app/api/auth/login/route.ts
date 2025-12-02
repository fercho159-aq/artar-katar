'use server';

import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, introduce un email válido.' }),
  password: z.string().min(1, { message: 'La contraseña es requerida.' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Entrada inválida', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { email, password } = validation.data;
    const client = await pool.connect();

    try {
      // Find user by email
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' }, { status: 401 });
      }

      const user = result.rows[0];

      // Compare password with hash
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Credenciales inválidas. Por favor, inténtalo de nuevo.' }, { status: 401 });
      }

      // Don't send password hash to the client
      const { password_hash, ...userWithoutPassword } = user;

      return NextResponse.json(userWithoutPassword, { status: 200 });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API Login Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Un error desconocido ocurrió';
    return NextResponse.json({ message: 'Fallo al iniciar sesión', error: errorMessage }, { status: 500 });
  }
}
