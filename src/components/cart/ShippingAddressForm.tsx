'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface ShippingAddress {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    notes: string;
}

const MEXICAN_STATES = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
];

interface ShippingAddressFormProps {
    address: ShippingAddress;
    onChange: (address: ShippingAddress) => void;
    disabled?: boolean;
}

export function ShippingAddressForm({ address, onChange, disabled }: ShippingAddressFormProps) {
    const updateField = (field: keyof ShippingAddress, value: string) => {
        onChange({ ...address, [field]: value });
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dirección de Envío</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="shipping-name">Nombre completo *</Label>
                    <Input
                        id="shipping-name"
                        placeholder="Nombre y apellidos"
                        value={address.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        disabled={disabled}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shipping-phone">Teléfono *</Label>
                    <Input
                        id="shipping-phone"
                        placeholder="10 dígitos"
                        value={address.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        disabled={disabled}
                        required
                        maxLength={10}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="shipping-street">Calle, número y colonia *</Label>
                <Input
                    id="shipping-street"
                    placeholder="Ej: Av. Reforma 123, Col. Centro"
                    value={address.street}
                    onChange={(e) => updateField('street', e.target.value)}
                    disabled={disabled}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="shipping-city">Ciudad *</Label>
                    <Input
                        id="shipping-city"
                        placeholder="Ciudad"
                        value={address.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        disabled={disabled}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shipping-state">Estado *</Label>
                    <Select
                        value={address.state}
                        onValueChange={(value) => updateField('state', value)}
                        disabled={disabled}
                    >
                        <SelectTrigger id="shipping-state">
                            <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                            {MEXICAN_STATES.map((state) => (
                                <SelectItem key={state} value={state}>
                                    {state}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="shipping-postal">Código Postal *</Label>
                    <Input
                        id="shipping-postal"
                        placeholder="C.P."
                        value={address.postalCode}
                        onChange={(e) => updateField('postalCode', e.target.value)}
                        disabled={disabled}
                        required
                        maxLength={5}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="shipping-notes">Notas de envío (opcional)</Label>
                <Textarea
                    id="shipping-notes"
                    placeholder="Referencias adicionales, instrucciones de entrega..."
                    value={address.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    disabled={disabled}
                    rows={2}
                />
            </div>
        </div>
    );
}

export const emptyShippingAddress: ShippingAddress = {
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'México',
    notes: '',
};

export function isShippingAddressValid(address: ShippingAddress): boolean {
    return !!(
        address.name.trim() &&
        address.phone.trim().length >= 10 &&
        address.street.trim() &&
        address.city.trim() &&
        address.state.trim() &&
        address.postalCode.trim().length >= 5
    );
}
