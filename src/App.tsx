import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import { defaultLanguage } from "./utils/i18n";

const queryClient = new QueryClient();

const ConversionPixel = () => {
  return <div style={{ width: '1px', height: '1px' }}></div>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/:lang?/auth" element={<Index requireAuth={true} />} />
          <Route path="/:lang?" element={<Index requireAuth={false} />} />
          <Route path="/conversion/:conversionId" element={<ConversionPixel />} />
          <Route path="*" element={<Navigate to={`/${defaultLanguage}`} />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
};

export default App;