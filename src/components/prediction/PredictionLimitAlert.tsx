import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Share2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Market Prediction AI',
        text: 'Check out this amazing AI-powered market prediction tool!',
        url: window.location.href
      });
      toast({
        title: "Thanks for sharing!",
        description: "You now have unlimited predictions.",
      });
      onClose();
    } catch (error) {
      // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard!",
        description: "Share it with your friends to get unlimited predictions.",
      });
    }
  };

  if (predictionsCount < PREDICTION_LIMIT) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
        <h3 className="text-xl font-semibold text-center">You've reached the prediction limit!</h3>
        <p className="text-gray-600 text-center">
          Share this app with your friends to unlock unlimited predictions.
        </p>
        <div className="flex justify-center">
          <Button onClick={handleShare} className="gradient-bg text-white">
            <Share2 className="mr-2 h-4 w-4" />
            Share and Unlock
          </Button>
        </div>
      </div>
    </div>
  );
};