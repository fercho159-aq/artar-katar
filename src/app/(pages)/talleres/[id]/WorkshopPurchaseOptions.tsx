'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Users, User } from 'lucide-react';
import { useCart, type Product as CartProduct } from '@/context/CartContext';
import { Product } from '@/lib/types';

interface WorkshopPurchaseOptionsProps {
    workshop: Product;
    imageUrl: string;
}

export default function WorkshopPurchaseOptions({ workshop, imageUrl }: WorkshopPurchaseOptionsProps) {
    const [isCoupleOption, setIsCoupleOption] = useState(false);
    const { addToCart } = useCart();

    const currentPrice = isCoupleOption && workshop.couple_price ? workshop.couple_price : workshop.price;

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
            {workshop.couple_price && (
                <div className="mb-6">
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
                                ${workshop.price} USD
                            </span>
                        </button>
                        <button
                            onClick={() => setIsCoupleOption(true)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-2 relative overflow-hidden ${isCoupleOption
                                    ? 'border-primary bg-primary/10 shadow-md'
                                    : 'border-muted-foreground/30 hover:border-primary/50'
                                }`}
                        >
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                                ¡Oferta!
                            </div>
                            <Users className={`w-6 h-6 ${isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className={`font-semibold ${isCoupleOption ? 'text-primary' : 'text-foreground'}`}>Parejas</span>
                            <span className={`text-lg font-bold ${isCoupleOption ? 'text-primary' : 'text-muted-foreground'}`}>
                                ${workshop.couple_price} USD
                            </span>
                            <span className="text-xs text-muted-foreground">2 personas</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Precio seleccionado y botón de compra */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Precio total:</p>
                        <p className="text-3xl font-bold text-primary">
                            ${currentPrice} USD
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
