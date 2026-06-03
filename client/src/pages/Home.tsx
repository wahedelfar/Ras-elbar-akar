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

      {/* Simple Banner with Villa */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-8 px-4">
        <div className="container mx-auto flex items-center gap-6">
          {/* Villa Image */}
          <div className="flex-shrink-0 w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663186633304/6UCDbA76Zm6ZGNxM24Hfvy/luxury-villa-3-floors-m2DLRJq8fHsM3cJeyTAyLT.webp"
              alt="فيلا فاخرة"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              إنتظروا أول وأقوي موقع إعلاني برأس البر
            </h2>
          </div>
        </div>
      </section>

      {/* Hero Section - Search */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 41, 59, 0.85)), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%230f172a%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E")'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">ابحث عن عقارك</h2>
          <p className="text-lg md:text-xl opacity-80 mb-8 text-gray-200">اكتشف أرقى العقارات للشراء أو الاستئجار في رأس البر</p>
          <div className="flex gap-4">
            <button onClick={() => setLocation("/properties")} className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">استعرض العقارات</button>
            <button onClick={() => setLocation("/map")} className="px-6 py-3 bg-transparent border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 font-bold rounded-lg transition-all">اكتشف على الخريطة</button>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-12 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 shadow-2xl border border-yellow-500/20">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6 text-center">ابحث عن عقارك سواء تمليك أو إيجار</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">نوع العقار</label>
                <select className="w-full bg-slate-700 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400">
                  <option value="">جميع الأنواع</option>
                  <option value="villa">فيلا</option>
                  <option value="apartment">شقة</option>
                  <option value="land">أرض</option>
                  <option value="townhouse">تاون هاوس</option>
                </select>
              </div>

              {/* Operation Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">نوع العملية</label>
                <select className="w-full bg-slate-700 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400">
                  <option value="">الكل</option>
                  <option value="sale">بيع</option>
                  <option value="rent">إيجار</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">المنطقة</label>
                <select className="w-full bg-slate-700 border border-yellow-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400">
                  <option value="">جميع المناطق</option>
                  <option value="kings">منطقة الملوك</option>
                  <option value="51-mercy">من شارع 51 لمسجد الرحمة</option>
                  <option value="109-51">من شارع 109 لشارع 51</option>
                  <option value="expansion">منطقة الإمتداد العمراني</option>
                  <option value="elassi">منطقة العاصي</option>
                  <option value="consultants">منطقة المستشارين</option>
                </select>
              </div>
            </div>

            <button onClick={() => setLocation("/properties")} className="w-full mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">
              ابدأ البحث
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-yellow-400 mb-8 text-center">العقارات المميزة</h3>
          
          {isLoading ? (
            <div className="text-center text-gray-400">جاري التحميل...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-gray-400">لا توجد عقارات حالياً</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <div key={property.id} className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-yellow-500/20 hover:border-yellow-400/50 cursor-pointer" onClick={() => setLocation(`/property/${property.id}`)}>
                  {/* Image */}
                  <div className="h-48 bg-slate-600 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
                      <HomeIcon className="w-12 h-12 text-yellow-400/50" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-yellow-400 mb-2">{property.title}</h4>
                    <p className="text-gray-400 text-sm mb-4">{property.location}</p>

                    {/* Stats */}
                    <div className="flex justify-between mb-4 pb-4 border-b border-yellow-500/20">
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{property.price.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">ج.م</p>
                      </div>
                      <div className="text-center">
                        <p className="text-yellow-400 font-bold">{property.type}</p>
                        <p className="text-gray-400 text-xs">نوع</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <a href={`https://wa.me/20${property.whatsappNumber?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-400 py-2 rounded transition-colors text-center">واتس</a>
                      <a href={`tel:+20${property.phoneNumber?.replace(/^0/, '')}`} className="flex-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 py-2 rounded transition-colors text-center">اتصل</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button onClick={() => setLocation("/properties")} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">
              عرض جميع العقارات
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 py-12 px-4 border-t border-yellow-500/20">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-yellow-400 mb-8 text-center">عن رأس البر</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-yellow-500/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">300+</div>
              <p className="text-gray-300">يوم مشمس في السنة</p>
              <p className="text-gray-400 text-sm mt-2">مناخ ساحلي معتدل طوال العام</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-yellow-500/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">6</div>
              <p className="text-gray-300">مناطق رئيسية</p>
              <p className="text-gray-400 text-sm mt-2">كل منطقة بطابعها الخاص</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-yellow-500/20">
              <div className="text-4xl font-bold text-yellow-400 mb-2">∞</div>
              <p className="text-gray-300">وجهة سياحية عالمية</p>
              <p className="text-gray-400 text-sm mt-2">شواطئ ذهبية وحياة ليلية راقية</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 py-12 px-4 border-t border-yellow-500/20">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-yellow-400 mb-4">هل تريد إضافة عقارك؟</h3>
          <p className="text-gray-300 mb-6">انضم إلى آلاف المعلنين الذين يثقون بنا</p>
          {isAuthenticated ? (
            <button onClick={() => setLocation("/add-property")} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">
              أضف عقارك الآن
            </button>
          ) : (
            <a href={getLoginUrl()} className="inline-block px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all shadow-lg">
              سجل دخول وأضف عقارك
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
