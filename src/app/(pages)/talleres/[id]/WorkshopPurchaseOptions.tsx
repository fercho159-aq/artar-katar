'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Users, User, Heart, Info } from 'lucide-react';
import { useCart, type Product as CartProduct } from '@/context/CartContext';
import { Product } from '@/lib/types';

interface WorkshopPurchaseOptionsProps {
    workshop: Product;
    imageUrl: string;
}

export default function WorkshopPurchaseOptions({ workshop, imageUrl }: WorkshopPurchaseOptionsProps) {
    const [isCoupleOption, setIsCoupleOption] = useState(false);
    const { addToCart } = useCart();

    // Precios fijos: Individual $1000 MXN, Parejas $1500 MXN
    const individualPrice = workshop.price || 1000;
    const couplePrice = workshop.couple_price || 1500;
    const currentPrice = isCoupleOption ? couplePrice : individualPrice;

    const handleAddToCart = () => {
        const product: CartProduct = {
            id: isCoupleOption ? `${workshop.id}-couple` : String(workshop.id),
            name: isCoupleOption ? `${workshop.name} (Parejas)` : workshop.name,
            price: currentPrice,
            image: imageUrl,
        };
        addToCart(product);
    };

    return (
        <div className="mb-6">
            {/* Selector de opción Individual/Parejas */}
            <div className="mb-4">
                <p className="text-sm font-medium text-muted-foreground mb-3">Selecciona tu opción:</p>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setIsCoupleOption(false)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 ${!isCoupleOption
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-muted-foreground/30 hover:border-primary/50'
                            }`}
                    >
                        <User className={`w-6 h-6 ${!isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-semibold ${!isCoupleOption ? 'text-primary' : 'text-foreground'}`}>Individual</span>
                        <span className={`text-lg font-bold ${!isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`}>
                            ${individualPrice.toLocaleString('es-MX')} MXN
                        </span>
                    </button>
                    <button
                        onClick={() => setIsCoupleOption(true)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 relative overflow-hidden ${isCoupleOption
                            ? 'border-primary bg-primary/10 shadow-md'
                            : 'border-muted-foreground/30 hover:border-primary/50'
                            }`}
                    >
                        <div className="absolute top-1 right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <Heart className="w-3 h-3" /> ¡Oferta Parejas!
                        </div>
                        <Users className={`w-6 h-6 ${isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-semibold ${isCoupleOption ? 'text-primary' : 'text-foreground'}`}>Parejas</span>
                        <span className={`text-lg font-bold ${isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`}>
                            ${couplePrice.toLocaleString('es-MX')} MXN
                        </span>
                        <span className="text-xs text-muted-foreground">2 personas</span>
                    </button>
                </div>
            </div>

            {/* Nota informativa sobre la oferta de parejas */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200 dark:border-pink-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-pink-800 dark:text-pink-300">
                            💑 Oferta especial para parejas
                        </p>
                        <p className="text-sm text-pink-700 dark:text-pink-400 mt-1">
                            ¡Inscríbanse juntos y ahorren! El precio de <strong>${couplePrice.toLocaleString('es-MX')} MXN</strong> incluye
                            la inscripción para <strong>2 personas</strong>. El precio individual es de ${individualPrice.toLocaleString('es-MX')} MXN por persona.
                        </p>
                    </div>
                </div>
            </div>

            {/* Precio seleccionado y botón de compra */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Precio total:</p>
                        <p className="text-3xl font-bold text-primary">
                            ${currentPrice.toLocaleString('es-MX')} MXN
                            {isCoupleOption && <span className="text-sm ml-2 text-muted-foreground">(2 personas)</span>}
                        </p>
                    </div>
                    <Button
                        size="lg"
                        onClick={handleAddToCart}
                        className="min-w-[180px]"
                    >
                        <ShoppingCart className="mr-2" />
                        {isCoupleOption ? 'Inscribir Parejas' : 'Inscribirme'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
