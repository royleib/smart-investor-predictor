import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from 'react';
import { AuthChangeEvent } from '@supabase/supabase-js';

export const LoginPage = () => {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'SIGNED_UP' && session?.user?.email) {
        toast({
          title: "Registration Error",
          description: "This email is already registered. Please try logging in instead.",
          variant: "destructive",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

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
              Get Started Today
            </h1>
            <p className="text-blue-600/80 text-center font-medium">
              Join thousands of traders using AI-powered market predictions
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