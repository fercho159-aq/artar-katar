import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un email válido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.formErrors.fieldErrors }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return NextResponse.json({ message: 'El email ya está en uso.' }, { status: 409 });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      const uid = `user_${Date.now()}`; // Simple UID generation

      // Insert new user
      const result = await client.query(
        'INSERT INTO users (uid, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, uid, name, email, created_at',
        [uid, name, email, password_hash]
      );
      
      const newUser = result.rows[0];

      return NextResponse.json(newUser, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Failed to create user', error: errorMessage }, { status: 500 });
  }
}
