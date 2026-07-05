import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut, Home, Mail, Phone } from "lucide-react";

export default function Footer() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8" dir="rtl">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">عن الموقع</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              منصة متخصصة في بيع وإيجار العقارات في رأس البر. نوفر أفضل الخدمات العقارية بأسعار تنافسية.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/properties" className="text-muted-foreground hover:text-accent transition-colors">
                  البحث عن عقارات
                </a>
              </li>
              <li>
                <a href="/add-property" className="text-muted-foreground hover:text-accent transition-colors">
                  إضافة إعلان
                </a>
              </li>
              <li>
                <a href="/" className="text-muted-foreground hover:text-accent transition-colors">
                  الرئيسية
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">تواصل معنا</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>01026569682</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>raas.elbar@yahoo.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Home className="w-4 h-4" />
                <span>رأس البر، دمياط</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 عقارات رأس البر. جميع الحقوق محفوظة.
          </p>

          {/* Logout Button */}
          {user && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
