import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { LoginPage } from '@/components/auth/LoginPage';
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from 'react-router-dom';
import { Features } from '@/components/home/Features';
import { Header } from '@/components/home/Header';
import { Welcome } from '@/components/home/Welcome';
import { MainContent } from '@/components/home/MainContent';
import { isValidLanguage, defaultLanguage, type Language } from "@/utils/i18n";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { lang } = useParams();
  
  useEffect(() => {
    if (!isValidLanguage(lang)) {
      navigate(`/${defaultLanguage}`, { replace: true });
      return;
    }

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => subscription.unsubscribe();
  }, [lang, navigate]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setStep(1);
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isValidLanguage(lang)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header onSignOut={handleSignOut} isAuthenticated={!!session} currentLang={lang as Language} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!session ? (
          <>
            <Welcome lang={lang as Language} />
            <div className="mb-12">
              <Features lang={lang as Language} />
            </div>
            <LoginPage lang={lang as Language} />
          </>
        ) : (
          <MainContent 
            step={step}
            setStep={setStep}
            session={session}
            lang={lang as Language}
          />
        )}
      </main>
    </div>
  );
};

export default Index;