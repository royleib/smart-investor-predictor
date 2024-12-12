import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Share2, Facebook, Twitter, Instagram, Copy, X } from 'lucide-react';
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

  const handleShareSuccess = async () => {
    toast({
      title: "Thanks for sharing!",
      description: "You now have unlimited predictions.",
    });
    onClose();
  };

  const handleFacebookShare = () => {
    const shareText = "Wow! This AI stock prediction is awesome. Try it out!";
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    handleShareSuccess();
  };

  const handleTwitterShare = () => {
    const shareText = "Wow! This AI stock prediction is awesome. Try it out!";
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    handleShareSuccess();
  };

  const handleInstagramShare = () => {
    // Since Instagram doesn't have a direct web share API,
    // we'll copy the link and show instructions
    const shareText = "Wow! This AI stock prediction is awesome. Try it out!\n\n";
    navigator.clipboard.writeText(shareText + window.location.href);
    toast({
      title: "Link copied!",
      description: "Open Instagram and paste the link in your story or post.",
    });
    handleShareSuccess();
  };

  const handleCopyLink = async () => {
    try {
      const shareText = "Wow! This AI stock prediction is awesome. Try it out!\n\n";
      await navigator.clipboard.writeText(shareText + window.location.href);
      toast({
        title: "Link copied to clipboard!",
        description: "Share it with your friends to get unlimited predictions.",
      });
      handleShareSuccess();
    } catch (error) {
      toast({
        title: "Error copying link",
        description: "Please try another sharing method.",
        variant: "destructive",
      });
    }
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
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleFacebookShare}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
          
          <Button
            onClick={handleTwitterShare}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
          
          <Button
            onClick={handleInstagramShare}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Instagram className="mr-2 h-4 w-4" />
            Instagram
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </div>
    </div>
  );
};