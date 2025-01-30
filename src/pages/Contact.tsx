import { Header } from "@/components/home/Header";
import { type Language } from "@/utils/i18n";

interface ContactProps {
  lang: Language;
}

const Contact = ({ lang }: ContactProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header currentLang={lang} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="mb-6 text-gray-600">
            Have questions or need assistance? We're here to help. Reach out to us using any of the following methods:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <mail className="w-5 h-5 text-blue-500 mr-3" />
              <span>support@marketsprophet.com</span>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Office Hours</h2>
            <p className="text-gray-600">
              Monday - Friday: 9:00 AM - 5:00 PM (EST)<br />
              Saturday - Sunday: Closed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;