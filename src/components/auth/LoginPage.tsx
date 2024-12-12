import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-montserrat font-bold text-center mb-2 text-blue-900">
              Market Prediction AI
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
                      brand: '#1E3A8A',
                      brandAccent: '#2563EB',
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
      </div>
    </div>
  );
};