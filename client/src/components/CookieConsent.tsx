import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // التحقق من وجود موافقة سابقة
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setIsVisible(true);
    } else {
      setIsAccepted(cookieConsent === 'accepted');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsAccepted(true);
    setIsVisible(false);
    
    // تفعيل Google Analytics عند الموافقة
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsAccepted(false);
    setIsVisible(false);
    
    // تعطيل Google Analytics عند الرفض
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-2xl" dir="rtl">
      <div className="container px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground mb-2">ملفات تعريف الارتباط (Cookies)</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام الموقع. بالموافقة، تسمح لنا باستخدام Google Analytics لفهم سلوك الزوار بشكل أفضل.
          </p>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <Button
            onClick={handleReject}
            variant="outline"
            size="sm"
            className="text-xs whitespace-nowrap"
          >
            رفض
          </Button>
          <Button
            onClick={handleAccept}
            size="sm"
            className="text-xs whitespace-nowrap bg-accent hover:bg-accent/90"
          >
            قبول
          </Button>
        </div>

        <button
          onClick={handleReject}
          className="absolute top-2 right-2 p-1 hover:bg-muted rounded transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
