"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Instagram, Youtube, Facebook } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import Image from 'next/image';
import { useLanguage } from "@/context/LanguageContext";

const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Por favor, introduce un número de WhatsApp válido." }),
});

export function Footer() {
  const { toast } = useToast();
  const { translations } = useLanguage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Newsletter subscription:", values);
    toast({
      title: "¡Suscripción exitosa!",
      description: "Gracias por unirte a nuestro boletín.",
      variant: "default"
    });
    form.reset();
  }

  return (
    <footer className="bg-card border-t">
      <div className="container grid grid-cols-1 lg:grid-cols-3 gap-10 py-16">
        <div className="flex flex-col items-start gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="Astar Katar Logo" width={50} height={50} className="h-12 w-auto" />
            <span className="font-bold text-2xl font-headline text-primary sr-only">
              Astar Katar
            </span>
          </Link>
          <p className="text-muted-foreground">{translations.footer.description}</p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-headline text-xl font-semibold mb-4 text-foreground">{translations.footer.subscribeTitle}</h3>
          <p className="text-muted-foreground mb-6">{translations.footer.subscribeDescription}</p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <Label className="sr-only">{translations.footer.nameLabel}</Label>
                    <FormControl>
                      <Input placeholder={translations.footer.namePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <Label className="sr-only">WhatsApp</Label>
                    <FormControl>
                      <Input placeholder={translations.footer.whatsappPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">{translations.footer.subscribeButton}</Button>
            </form>
          </Form>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col sm:flex-row items-center justify-between py-6 text-sm text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} Astar Katar. {translations.footer.rights}</p>
          <div className="flex space-x-4">
            <Link href="https://www.instagram.com/portalviviente/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="https://www.youtube.com/@astarkatar-portalviviente" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="YouTube">
              <Youtube className="w-5 h-5" />
            </Link>
            <Link href="https://www.facebook.com/portal.viviente" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook Portal Viviente">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://www.facebook.com/portal.cristico.de.luz/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook Portal Crístico de Luz">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="https://www.tiktok.com/@portal_viviente0" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="TikTok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
