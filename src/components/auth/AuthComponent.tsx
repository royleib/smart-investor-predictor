import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { type Language, translations } from "@/utils/i18n";

interface AuthComponentProps {
  lang: Language;
}

export const AuthComponent = ({ lang }: AuthComponentProps) => {
  const t = translations[lang];

  return (
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
  );
};