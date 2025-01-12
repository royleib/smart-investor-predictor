import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { AuthChangeEvent } from '@supabase/supabase-js';

export const GoogleTagManager = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent) => {
      if (event === 'SIGNED_UP' as AuthChangeEvent) {
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-11552566208/P_X3CML49oIaEMDX2IQr',
            'value': 1.0,
            'currency': 'ILS'
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return null;
};