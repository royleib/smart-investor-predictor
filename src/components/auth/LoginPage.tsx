import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { type Language, translations } from "@/utils/i18n";
import type { AuthChangeEvent } from '@supabase/supabase-js';
import { LoginHeader } from "./LoginHeader";
import { LoginForm } from "./LoginForm";
import { Shield, Zap, Users } from 'lucide-react';

interface LoginPageProps {
  lang: Language;
}

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="flex items-start space-x-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm border border-blue-100/20">
    <Icon className="w-6 h-6 text-blue-600 mt-1" />
    <div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row items-center justify-center gap-8 px-4 py-8 md:py-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center md:text-left mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {t.welcome}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {t.chooseInvestment}
          </p>
        </div>

        <div className="space-y-4">
          <FeatureCard 
            icon={Shield}
            title="Enterprise Security"
            description="Bank-grade encryption and security protocols to protect your data"
          />
          <FeatureCard 
            icon={Zap}
            title="Real-time Updates"
            description="24/7 market monitoring and instant alerts for market changes"
          />
          <FeatureCard 
            icon={Users}
            title="Active Community"
            description="Join thousands of traders making smarter decisions together"
          />
        </div>

        <div className="mt-8 text-center md:text-left">
          <div className="inline-flex items-center space-x-2">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Joined by 10,000+ traders worldwide
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
          <div className="p-8">
            <LoginHeader lang={lang} />
            <LoginForm lang={lang} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};