import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Waves, HomeIcon } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Fetch all properties
  const { data: properties = [], isLoading } = trpc.properties.list.useQuery({
    operationType: "sale",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">

      {/* Header - Luxury Design */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-yellow-500/20">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">عقارات رأس البر</span>
              <p className="text-xs text-yellow-400/60">الخيار الأول للعقارات الفاخرة</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => setLocation("/properties")} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">العقارات</button>
            <button onClick={() => setLocation("/map")} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">الخريطة</button>
            {isAuthenticated ? (
              <>
                <button onClick={() => setLocation("/dashboard")} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">لوحتي</button>
                <button onClick={() => setLocation("/profile")} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">حسابي</button>
              </>
            ) : (
              <a href={getLoginUrl()} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">دخول</a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section - Luxury */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85)), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%230f172a%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E")'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">البحث عن المنازل الفاخرة</h2>
          <p className="text-lg md:text-xl opacity-80 mb-8 text-gray-200">اكتشف أرقى العقارات للشراء أو الاستئجار في رأس البر</p>
          <div className="flex gap-4">
            <button onClick={() => setLocation("/properties")} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">استعرض العقارات</button>
            <button onClick={() => setLocation("/map")} className="px-6 py-3 bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold rounded-lg transition-all">اكتشف على الخريطة</button>
          </div>
        </div>
      </section>

      {/* Premium Banner Section - Villa Showcase */}
      <section className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 py-0 overflow-hidden">
        <div className="container px-4 py-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
            {/* Image Side */}
            <div className="relative h-96 md:h-full overflow-hidden rounded-r-3xl shadow-2xl">
              <img 
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663186633304/6UCDbA76Zm6ZGNxM24Hfvy/luxury-villa-3-floors-m2DLRJq8fHsM3cJeyTAyLT.webp"
                alt="فيلا فاخرة"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-slate-900/40"></div>
            </div>

            {/* Text Side */}
            <div className="px-8 md:px-12 py-12 md:py-16 text-right">
              <div className="space-y-6">
                <div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent leading-tight">
                    إنتظروا أول وأقوي موقع إعلاني برأس البر
                  </h3>
                  <div className="h-1 w-24 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed">
                  منصة عقارية متخصصة تجمع أفضل العقارات الفاخرة في رأس البر. اكتشف فيلاك الحلم مع أسهل وأسرع طريقة للبحث والتواصل المباشر مع المعلنين.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/30">
                    <p className="text-2xl font-bold text-yellow-400">100+</p>
                    <p className="text-sm text-gray-300">عقار فاخر</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/30">
                    <p className="text-2xl font-bold text-yellow-400">6</p>
                    <p className="text-sm text-gray-300">مناطق رئيسية</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/30">
                    <p className="text-2xl font-bold text-yellow-400">24/7</p>
                    <p className="text-sm text-gray-300">دعم مباشر</p>
                  </div>
                </div>

                <button 
                  onClick={() => setLocation("/properties")}
                  className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold rounded-lg transition-all shadow-lg hover:shadow-2xl text-lg"
                >
                  ابدأ البحث الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-slate-900">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">العقارات المميزة</h2>
            <p className="text-gray-300 text-lg">اكتشف أفضل العقارات المتاحة حالياً</p>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-400">جاري التحميل...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-gray-400 py-12">لا توجد عقارات متاحة حالياً</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <div
                  key={property.id}
                  onClick={() => setLocation(`/property/${property.id}`)}
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-yellow-500/20 hover:border-yellow-500/50 group"
                >
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-600 to-slate-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <HomeIcon className="w-16 h-16 text-yellow-400/30" />
                    </div>
                    <div className="absolute top-4 right-4 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                      {property.operationType === "sale" ? "بيع" : "إيجار"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-yellow-300 mb-2 line-clamp-2">{property.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{property.location}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{property.area}</p>
                        <p className="text-gray-400 text-xs">م²</p>
                      </div>
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{property.price.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">ج.م</p>
                      </div>
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{property.type}</p>
                        <p className="text-gray-400 text-xs">نوع</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-yellow-500/20">
                      <button className="flex-1 text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 py-2 rounded transition-colors">
                        اتصال
                      </button>
                      <button className="flex-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded transition-colors">
                        واتس
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <button 
              onClick={() => setLocation("/properties")}
              className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold rounded-lg transition-all shadow-lg"
            >
              عرض جميع العقارات
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-yellow-500/20 py-8">
        <div className="container px-4 text-center text-gray-400">
          <p>© 2026 عقارات رأس البر. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
