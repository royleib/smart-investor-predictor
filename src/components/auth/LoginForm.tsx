import { type Language } from "@/utils/i18n";
import { GoogleTagManager } from "./GoogleTagManager";
import { AuthComponent } from "./AuthComponent";

interface LoginFormProps {
  lang: Language;
}

export const LoginForm = ({ lang }: LoginFormProps) => {
  return (
    <div className="relative">
      <GoogleTagManager />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50 blur-xl"></div>
      <div className="relative">
        <AuthComponent lang={lang} />
      </div>
    </div>
  );
};