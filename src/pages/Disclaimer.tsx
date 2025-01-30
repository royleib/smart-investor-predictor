import { Header } from "@/components/home/Header";
import { type Language } from "@/utils/i18n";

interface DisclaimerProps {
  lang: Language;
}

const Disclaimer = ({ lang }: DisclaimerProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header currentLang={lang} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Disclaimer Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-4">1. Investment Risks</h2>
          <p>The predictions and information provided on this platform:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Are not financial advice</li>
            <li>May not be accurate or reliable</li>
            <li>Should not be the sole basis for any investment decision</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">2. No Guarantees</h2>
          <p>We do not guarantee:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>The accuracy of predictions</li>
            <li>Financial returns or profits</li>
            <li>Continuous availability of our services</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6 mb-4">3. User Responsibility</h2>
          <p>Users are solely responsible for their investment decisions and should conduct their own research and consult with financial advisors.</p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;