import { Facebook, Twitter, Instagram, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ShareButton } from "./ShareButton";

interface SocialShareProps {
  onShareSuccess: () => void;
}

export const SocialShare = ({ onShareSuccess }: SocialShareProps) => {
  const { toast } = useToast();
  const shareText = "Wow! This AI stock prediction is awesome. Try it out!";

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'width=600,height=400');
    onShareSuccess();
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=600,height=400');
    onShareSuccess();
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(shareText + "\n\n" + window.location.href);
    toast({
      title: "Link copied!",
      description: "Open Instagram and paste the link in your story or post.",
    });
    onShareSuccess();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText + "\n\n" + window.location.href);
      toast({
        title: "Link copied to clipboard!",
        description: "Share it with your friends to get unlimited predictions.",
      });
      onShareSuccess();
    } catch (error) {
      toast({
        title: "Error copying link",
        description: "Please try another sharing method.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <ShareButton
        onClick={handleFacebookShare}
        icon={Facebook}
        label="Facebook"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      />
      
      <ShareButton
        onClick={handleTwitterShare}
        icon={Twitter}
        label="Twitter"
        className="w-full bg-sky-500 hover:bg-sky-600 text-white"
      />
      
      <ShareButton
        onClick={handleInstagramShare}
        icon={Instagram}
        label="Instagram"
        className="w-full bg-pink-600 hover:bg-pink-700 text-white"
      />
      
      <ShareButton
        onClick={handleCopyLink}
        icon={Copy}
        label="Copy Link"
        className="w-full"
        variant="outline"
      />
    </div>
  );
};