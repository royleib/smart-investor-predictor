import { type Language } from "@/utils/i18n";
import { Header } from '@/components/home/Header';
import { Welcome } from '@/components/home/Welcome';
import { Features } from '@/components/home/Features';
import { LoginPage } from '@/components/auth/LoginPage';

interface AuthViewProps {
  session: any;
  handleSignOut: () => void;
  lang: Language;
}

export const AuthView = ({ session, handleSignOut, lang }: AuthViewProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header onSignOut={handleSignOut} isAuthenticated={!!session} currentLang={lang} />
      <div className="space-y-6 md:space-y-8">
        <Welcome lang={lang} />
        <div className="mb-8 md:mb-12">
          <Features lang={lang} />
        </div>
        <LoginPage lang={lang} />
      </div>
    </div>
  );
};