import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Waves, HomeIcon } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

// دالة تحويل الأرقام من إنجليزية إلى عربية
const convertToArabicNumbers = (str: string): string => {
  const arabicMap: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };
  return str.replace(/[0-9]/g, (digit) => arabicMap[digit] || digit);
};

// دالة تنسيق السعر بدون فاصلة عشرية
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
  return convertToArabicNumbers(formatted);
};

// دالة تحويل رموز الموقع إلى أسماء عربية
const getLocationLabel = (locationCode: string): string => {
  const locationMap: { [key: string]: string } = {
    'kings': 'منطقة الملوك',
    '51-mercy': 'من شارع 51 لمسجد الرحمة',
    '109-51': 'من شارع 109 لشارع 51',
    'expansion': 'منطقة الإمتداد العمراني',
    'elassi': 'منطقة العاصي',
    'consultants': 'منطقة المستشارين',
  };
  return locationMap[locationCode] || locationCode;
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  // Fetch all properties
  const { data: properties = [], isLoading } = trpc.properties.list.useQuery({
    operationType: "sale",
  });

  return (
    <div className="min-h-screen bg-background" dir="rtl">

      {/* Header - Luxury Design */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-lg">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center shadow-lg">
              <Waves className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground">عقارات رأس البر</span>
              <p className="text-xs text-muted-foreground">الخيار الأول للعقارات الفاخرة</p>
            </div>
          </div>
          <nav className="flex items-center gap-6">
            <button onClick={() => setLocation("/properties")} className="text-foreground hover:text-accent font-medium transition-colors">العقارات</button>
            <button onClick={() => setLocation("/map")} className="text-foreground hover:text-accent font-medium transition-colors">الخريطة</button>
            {isAuthenticated ? (
              <>
                <button onClick={() => setLocation("/dashboard")} className="text-foreground hover:text-accent font-medium transition-colors">لوحتي</button>
                <button onClick={() => setLocation("/profile")} className="text-foreground hover:text-accent font-medium transition-colors">حسابي</button>
              </>
            ) : (
              <a href={getLoginUrl()} className="text-foreground hover:text-accent font-medium transition-colors">دخول</a>
            )}
          </nav>
        </div>
      </header>

      {/* Simple Banner with Villa */}
      <section className="bg-card py-8 px-4">
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
            <h2 className="text-2xl md:text-4xl font-bold text-accent">
              كن من مؤسسي الموقع وأضف إعلانك
            </h2>
          </div>
        </div>
      </section>

      {/* Hero Section - Search */}
      <section className="relative h-96 md:h-[500px] bg-primary overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-accent">ابحث عن عقارك</h2>
          <p className="text-lg md:text-xl opacity-80 mb-8 text-foreground">اكتشف أرقى العقارات للشراء أو الاستئجار في رأس البر</p>
          <div className="flex gap-4">
            <button onClick={() => setLocation("/properties")} className="px-6 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all shadow-lg">ابحث عن عقارك</button>
            <button onClick={() => setLocation("/map")} className="px-6 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent/10 font-bold rounded-lg transition-all">اكتشف على الخريطة</button>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-background py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8 text-center">استكشف رأس البر على الخريطة</h2>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-accent h-96">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110903.65524821505!2d31.37!3d31.27!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583e1e1e1e1e1d%3A0x1e1e1e1e1e1e1e1e!2sRas%20El%20Bar%2C%20Damietta%20Governorate!5e0!3m2!1sar!2seg!4v1234567890"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="bg-background py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-8 text-center">العقارات المميزة</h2>

          {isLoading ? (
            <div className="text-center text-gray-400">جاري التحميل...</div>
          ) : properties.length === 0 ? (
            <div className="text-center text-gray-400">لا توجد عقارات حالياً</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.slice(0, 6).map((property) => (
                <div key={property.id} className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-border hover:border-accent cursor-pointer" onClick={() => setLocation(`/property/${property.id}`)}>
                  {/* Image */}
                  <div className="h-48 bg-muted overflow-hidden">
                    {(property as any).images && (property as any).images.length > 0 ? (
                      <img 
                        src={(property as any).images[0].imageUrl} 
                        alt={property.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <HomeIcon className="w-12 h-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-accent">{property.title}</h4>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">{(property as any).referenceNumber || 'RB-' + property.id}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{getLocationLabel(property.location)}</p>

                    {/* Stats */}
                    <div className="flex justify-between mb-4 pb-4 border-b border-border">
                      <div className="text-center">
                        <p className="text-accent font-bold">{formatPrice(property.price)}</p>
                        <p className="text-muted-foreground text-xs">ج.م</p>
                      </div>
                      <div className="text-center">
                        <p className="text-accent font-bold">
                          {property.type === 'apartment' ? 'شقة' : 
                           property.type === 'villa' ? 'فيلا' : 
                           property.type === 'house' ? 'منزل' : 
                           property.type === 'land' ? 'أرض' : 
                           property.type === 'commercial' ? 'تجاري' : property.type}
                        </p>
                        <p className="text-muted-foreground text-xs">نوع</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <a href={`https://wa.me/20${property.whatsappNumber?.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs bg-secondary/20 hover:bg-secondary/30 text-secondary py-2 rounded transition-colors text-center">واتس</a>
                      <a href={`tel:+20${property.phoneNumber?.replace(/^0/, '')}`} className="flex-1 text-xs bg-primary/20 hover:bg-primary/30 text-primary py-2 rounded transition-colors text-center">اتصل</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <button onClick={() => setLocation("/properties")} className="px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all shadow-lg">
              عرض جميع العقارات
            </button>
          </div>
        </div>
      </section>

      {/* Paid Ads Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-12 text-center">شركاؤنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Ad Banner 1 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 bg-gradient-to-br from-blue-500 to-blue-700">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">إعلان مدفوع</div>
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-white">
                <div className="text-4xl font-bold mb-2">🏢</div>
                <h3 className="text-xl font-bold mb-2">شركة النيل للعقارات</h3>
                <p className="text-sm opacity-90">أفضل الخدمات العقارية</p>
              </div>
            </div>

            {/* Ad Banner 2 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 bg-gradient-to-br from-emerald-500 to-emerald-700">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">إعلان مدفوع</div>
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-white">
                <div className="text-4xl font-bold mb-2">🏠</div>
                <h3 className="text-xl font-bold mb-2">عقارات الساحل</h3>
                <p className="text-sm opacity-90">تطوير عقاري متميز</p>
              </div>
            </div>

            {/* Ad Banner 3 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 bg-gradient-to-br from-purple-500 to-purple-700">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">إعلان مدفوع</div>
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-white">
                <div className="text-4xl font-bold mb-2">🌆</div>
                <h3 className="text-xl font-bold mb-2">رأس البر للاستثمار</h3>
                <p className="text-sm opacity-90">فرص استثمارية ذهبية</p>
              </div>
            </div>

            {/* Ad Banner 4 */}
            <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 h-64 bg-gradient-to-br from-orange-500 to-orange-700">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">إعلان مدفوع</div>
              <div className="h-full flex flex-col items-center justify-center text-center px-4 text-white">
                <div className="text-4xl font-bold mb-2">🏗️</div>
                <h3 className="text-xl font-bold mb-2">مقاولون رأس البر</h3>
                <p className="text-sm opacity-90">بناء وتطوير عقاري</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-background py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-accent mb-8 text-center">عن رأس البر</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-4xl font-bold text-accent mb-2">300+</div>
              <p className="text-foreground">يوم مشمس في السنة</p>
              <p className="text-muted-foreground text-sm mt-2">مناخ ساحلي معتدل طوال العام</p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-4xl font-bold text-accent mb-2">6</div>
              <p className="text-foreground">مناطق رئيسية</p>
              <p className="text-muted-foreground text-sm mt-2">كل منطقة بطابعها الخاص</p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="text-4xl font-bold text-accent mb-2">∞</div>
              <p className="text-foreground">وجهة سياحية عالمية</p>
              <p className="text-muted-foreground text-sm mt-2">شواطئ ذهبية وحياة ليلية راقية</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-card py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-accent mb-4">هل تريد إضافة عقارك؟</h3>
          <p className="text-foreground mb-6">انضم إلى آلاف المعلنين الذين يثقون بنا</p>
          {isAuthenticated ? (
            <button onClick={() => setLocation("/add-property")} className="px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all shadow-lg">
              أضف عقارك الآن
            </button>
          ) : (
            <a href={getLoginUrl()} className="px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-lg transition-all shadow-lg inline-block">
              سجل دخول وأضف عقارك
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
