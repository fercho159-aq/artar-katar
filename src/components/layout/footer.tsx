"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
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
            <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-primary transition-colors">YouTube</Link>
            <Link href="#" className="hover:text-primary transition-colors">Facebook</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
