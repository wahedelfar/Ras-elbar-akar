import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Waves, LogOut, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";

export default function Profile() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <Waves className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول أولاً</h1>
        <a href={getLoginUrl()}>
          <Button>تسجيل الدخول</Button>
        </a>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <a href="/">
            <Button variant="outline">العودة</Button>
          </a>
        </div>
      </header>

      <div className="container py-8 max-w-2xl">
        <div className="card-elevated p-8">
          <h1 className="text-4xl font-bold mb-8">الملف الشخصي</h1>

          {/* User Info */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-semibold mb-2">الاسم</label>
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  dir="rtl"
                />
              ) : (
                <p className="text-lg text-foreground">{user?.name || "غير محدد"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">البريد الإلكتروني</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  dir="rtl"
                />
              ) : (
                <p className="text-lg text-foreground">{user?.email || "غير محدد"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">رقم الهاتف</label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966501234567"
                  className="w-full"
                  dir="rtl"
                />
              ) : (
                <p className="text-lg text-foreground">{phone || "غير محدد"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">دور المستخدم</label>
              <p className="text-lg text-foreground capitalize">
                {user?.role === 'admin' ? 'مسؤول' : 'مستخدم عادي'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-primary hover:bg-primary/90 flex-1"
                >
                  حفظ التغييرات
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="flex-1"
                >
                  إلغاء
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 flex-1"
              >
                تعديل البيانات
              </Button>
            )}
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </Button>
          </div>

          {/* Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-bold mb-4">الروابط السريعة</h3>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-primary hover:underline">
                لوحة التحكم الخاصة بي
              </a>
              <a href="/add-property" className="block text-primary hover:underline">
                إضافة إعلان جديد
              </a>
              <a href="/properties" className="block text-primary hover:underline">
                استعراض جميع العقارات
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
