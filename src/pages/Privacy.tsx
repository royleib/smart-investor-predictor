import { Header } from "@/components/home/Header";
import { type Language } from "@/utils/i18n";

interface PrivacyProps {
  lang: Language;
}

const Privacy = ({ lang }: PrivacyProps) => {
  const handleSignOut = () => {
    // Empty function since these pages don't need sign out functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header currentLang={lang} onSignOut={handleSignOut} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Create an account</li>
            <li>Use our prediction services</li>
            <li>Contact us for support</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Send you technical notices and updates</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;