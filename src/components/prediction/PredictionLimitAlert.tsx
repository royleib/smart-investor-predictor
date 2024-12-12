import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { SocialShare } from "../sharing/SocialShare";

interface PredictionLimitAlertProps {
  userId: string;
  onClose: () => void;
}

export const PredictionLimitAlert = ({ userId, onClose }: PredictionLimitAlertProps) => {
  const { toast } = useToast();
  const [predictionsCount, setPredictionsCount] = useState(0);
  const PREDICTION_LIMIT = 2;

  useEffect(() => {
    fetchPredictionsCount();
  }, [userId]);

  const fetchPredictionsCount = async () => {
    const { count, error } = await supabase
      .from('user_predictions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (!error && count !== null) {
      setPredictionsCount(count);
    }
  };

  const handleShareSuccess = async () => {
    toast({
      title: "Thanks for sharing!",
      description: "You now have unlimited predictions.",
    });
    onClose();
  };

  if (predictionsCount < PREDICTION_LIMIT) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>
        
        <h3 className="text-xl font-semibold text-center">You've reached the prediction limit!</h3>
        <p className="text-gray-600 text-center">
          Share this app with your friends to unlock unlimited predictions.
        </p>
        
        <SocialShare onShareSuccess={handleShareSuccess} />
      </div>
    </div>
  );
};