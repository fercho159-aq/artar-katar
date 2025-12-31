/**
 * Configuración de descuentos para productos
 * 
 * PAQUETE DE PAREJAS: Al comprar 2 del mismo taller, se aplica un precio especial
 */

export type CoupleDiscountConfig = {
    productSku: string;
    productName: string;
    individualPrice: number;
    couplePrice: number;     // Precio por 2 unidades
    minQuantity: number;     // Mínimo para aplicar descuento (normalmente 2)
};

// Configuración de descuentos de parejas por SKU de producto
export const COUPLE_DISCOUNTS: CoupleDiscountConfig[] = [
    {
        productSku: 'taller_5ta_dimension_enero_2025',
        productName: 'MANIFIESTA TU REALIDAD DESDE LA 5TA DIMENSIÓN',
        individualPrice: 1000,
        couplePrice: 1500,     // $1,500 por pareja en lugar de $2,000
        minQuantity: 2,
    },
    // Agrega más talleres con descuento de parejas aquí
];

export type DiscountResult = {
    originalSubtotal: number;
    discountAmount: number;
    finalSubtotal: number;
    appliedDiscounts: AppliedDiscount[];
};

export type AppliedDiscount = {
    productId: string;
    productName: string;
    discountType: 'couple';
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    savings: number;
};

/**
 * Calcula los descuentos aplicables al carrito
 * @param cartItems - Items del carrito con producto y cantidad
 * @returns Resultado con subtotal original, descuento y descuentos aplicados
 */
export function calculateCartDiscounts(
    cartItems: { product: { id: string; name: string; price: number }; quantity: number }[]
): DiscountResult {
    let originalSubtotal = 0;
    let totalDiscount = 0;
    const appliedDiscounts: AppliedDiscount[] = [];

    for (const item of cartItems) {
        const itemTotal = item.product.price * item.quantity;
        originalSubtotal += itemTotal;

        // Buscar si este producto tiene descuento de parejas
        const coupleDiscount = COUPLE_DISCOUNTS.find(
            (d) => item.product.id.includes(d.productSku) ||
                item.product.name.toLowerCase().includes(d.productName.toLowerCase().substring(0, 20))
        );

        if (coupleDiscount && item.quantity >= coupleDiscount.minQuantity) {
            // Calcular cuántas parejas completas hay
            const completeCouples = Math.floor(item.quantity / 2);
            const remainingIndividual = item.quantity % 2;

            // Precio original (sin descuento)
            const originalPriceForThis = item.product.price * item.quantity;

            // Precio con descuento de parejas
            const couplesPriceTotal = completeCouples * coupleDiscount.couplePrice;
            const individualPriceTotal = remainingIndividual * coupleDiscount.individualPrice;
            const discountedPriceForThis = couplesPriceTotal + individualPriceTotal;

            const savings = originalPriceForThis - discountedPriceForThis;

            if (savings > 0) {
                totalDiscount += savings;
                appliedDiscounts.push({
                    productId: item.product.id,
                    productName: item.product.name,
                    discountType: 'couple',
                    quantity: item.quantity,
                    originalPrice: originalPriceForThis,
                    discountedPrice: discountedPriceForThis,
                    savings: savings,
                });
            }
        }
    }

    return {
        originalSubtotal,
        discountAmount: totalDiscount,
        finalSubtotal: originalSubtotal - totalDiscount,
        appliedDiscounts,
    };
}

/**
 * Obtiene un mensaje descriptivo del descuento
 */
export function getDiscountMessage(discount: AppliedDiscount): string {
    if (discount.discountType === 'couple') {
        const couples = Math.floor(discount.quantity / 2);
        return `🎁 Paquete Pareja (${couples}x2): Ahorras $${discount.savings.toFixed(0)} MXN`;
    }
    return '';
}
