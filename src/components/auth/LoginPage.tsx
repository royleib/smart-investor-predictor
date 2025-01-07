import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { type Language, translations } from "@/utils/i18n";
import type { AuthChangeEvent } from '@supabase/supabase-js';
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  lang: Language;
}

export const LoginPage = ({ lang }: LoginPageProps) => {
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'SIGNED_IN' && session?.user && !session.user.email_confirmed_at) {
        toast({
          title: t.error,
          description: t.emailAlreadyRegistered,
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, t]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      <div className="glass-effect rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
        <div className="p-8">
          <LoginHeader lang={lang} />
          <LoginForm lang={lang} />
        </div>
      </div>
    </motion.div>
  );
};