import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

export const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-8">
        <h1 className="text-3xl font-montserrat font-bold text-center mb-2 text-gray-900">
          Get Started
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign in to access advanced market predictions powered by artificial intelligence
        </p>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#222222',
                  brandAccent: '#333333',
                },
              },
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
  );
};