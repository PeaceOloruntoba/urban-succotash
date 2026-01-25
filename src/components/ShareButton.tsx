import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

type ShareButtonProps = {
  url: string;
  title: string;
  description?: string;
  showQR?: boolean;
};

export default function ShareButton({ url, title, description, showQR = true }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url: fullUrl,
        });
        setShowMenu(false);
      } catch (err) {
        // User cancelled or error
      }
    } else {
      handleCopy();
    }
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${title} - ${fullUrl}`)}`,
      "_blank"
    );
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
      >
        <Share2 size={18} />
        Share Event
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-20 p-4">
            <div className="space-y-2">
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <Share2 size={18} className="text-blue-800" />
                <span>Share via...</span>
              </button>
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                {copied ? (
                  <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} className="text-blue-800" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <div className="border-t border-slate-200 my-2" />
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <span className="text-blue-500 font-semibold">X</span>
                <span>Share on X (Twitter)</span>
              </button>
              <button
                onClick={shareToFacebook}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <span className="text-blue-600 font-semibold">f</span>
                <span>Share on Facebook</span>
              </button>
              <button
                onClick={shareToLinkedIn}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <span className="text-blue-700 font-semibold">in</span>
                <span>Share on LinkedIn</span>
              </button>
              <button
                onClick={shareToWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
              >
                <span className="text-green-600 font-semibold">WA</span>
                <span>Share on WhatsApp</span>
              </button>
              {showQR && (
                <>
                  <div className="border-t border-slate-200 my-2" />
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-2 text-center">Scan QR Code</p>
                    <div className="flex justify-center">
                      <QRCodeSVG value={fullUrl} size={120} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
