import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/home/Header';
import { LeadsManager } from '@/components/admin/LeadsManager';
import { MainContent } from '@/components/home/MainContent';
import { PublicView } from '@/components/views/PublicView';
import { AuthView } from '@/components/views/AuthView';
import { useAuthState } from '@/hooks/useAuthState';
import { isValidLanguage, defaultLanguage, type Language } from "@/utils/i18n";

interface IndexProps {
  requireAuth?: boolean;
}

const Index = ({ requireAuth = false }: IndexProps) => {
  const [step, setStep] = useState(1);
  const { session, isAdmin, handleSignOut } = useAuthState();
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    if (!isValidLanguage(lang)) {
      navigate(`/${defaultLanguage}`, { replace: true });
    }
  }, [lang, navigate]);

  // If language is invalid, don't render anything until navigation completes
  if (!lang || !isValidLanguage(lang)) {
    return null;
  }

  // Show main content without auth requirement if requireAuth is false
  if (!requireAuth && !session) {
    return (
      <PublicView
        session={session}
        step={step}
        setStep={setStep}
        handleSignOut={handleSignOut}
        lang={lang as Language}
      />
    );
  }

  // Show login page if auth is required and user is not authenticated
  if (requireAuth && !session) {
    return (
      <AuthView
        session={session}
        handleSignOut={handleSignOut}
        lang={lang as Language}
      />
    );
  }

  // Show admin or authenticated user content
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header onSignOut={handleSignOut} isAuthenticated={!!session} currentLang={lang as Language} />
      {isAdmin ? (
        <LeadsManager />
      ) : (
        <MainContent 
          step={step}
          setStep={setStep}
          session={session}
          lang={lang as Language}
        />
      )}
    </div>
  );
};

export default Index;