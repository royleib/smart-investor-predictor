import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { translations, type Language } from "@/utils/i18n";
import type { AuthError } from '@supabase/supabase-js';

interface LoginPageProps {
  lang: Language;
}

export const LoginPage = ({ lang }: LoginPageProps) => {
  const { toast } = useToast();
  const t = translations[lang];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNUP' && session?.user?.email) {
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
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-montserrat font-bold text-center bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              {t.startTrading}
            </h1>
            <p className="text-blue-600/80 text-center font-medium">
              {t.chooseInvestment}
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 blur-xl"></div>
            <div className="relative">
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#2563eb',
                        brandAccent: '#1d4ed8',
                        brandButtonText: 'white',
                        defaultButtonBackground: '#f8fafc',
                        defaultButtonBackgroundHover: '#f1f5f9',
                        inputBackground: 'white',
                        inputBorder: '#e2e8f0',
                        inputBorderHover: '#94a3b8',
                        inputBorderFocus: '#2563eb',
                      },
                    },
                  },
                  style: {
                    button: {
                      borderWidth: '1px',
                      borderRadius: '0.75rem',
                    },
                    input: {
                      borderWidth: '1px',
                      borderRadius: '0.75rem',
                    },
                  },
                  className: {
                    button: 'hover:scale-[1.02] transform transition-all duration-200',
                    container: 'gap-4',
                    label: 'font-medium text-blue-900/80',
                    input: 'shadow-sm',
                  },
                }}
                providers={[]}
                view="sign_up"
                localization={{
                  variables: {
                    sign_up: {
                      email_label: t.email || 'Email',
                      password_label: t.password || 'Password',
                      button_label: t.signUp || 'Sign up',
                    },
                    sign_in: {
                      email_label: t.email || 'Email',
                      password_label: t.password || 'Password',
                      button_label: t.signIn || 'Sign in',
                    },
                  },
                }}
                additionalData={{
                  full_name: undefined
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};