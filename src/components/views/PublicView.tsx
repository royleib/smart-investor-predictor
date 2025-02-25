import { type Language } from "@/utils/i18n";
import { Header } from '@/components/home/Header';
import { MainContent } from '@/components/home/MainContent';
import { Footer } from '@/components/home/Footer';

interface PublicViewProps {
  session: any;
  step: number;
  setStep: (step: number) => void;
  handleSignOut: () => void;
  lang: Language;
}

export const PublicView = ({ session, step, setStep, handleSignOut, lang }: PublicViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header onSignOut={handleSignOut} isAuthenticated={!!session} currentLang={lang} />
      <div className="flex-grow">
        <MainContent 
          step={step}
          setStep={setStep}
          session={session}
          lang={lang}
        />
      </div>
      <Footer />
    </div>
  );
};