import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Search, Waves, Heart, Settings, HomeIcon, Anchor, Umbrella, Users } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [searchLocation, setSearchLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (priceMin) params.append("minPrice", priceMin);
    if (priceMax) params.append("maxPrice", priceMax);
    setLocation(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waves className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </div>
          <nav className="flex items-center gap-4">
            <button onClick={() => setLocation("/properties")} className="text-gray-600 hover:text-primary font-medium">العقارات</button>
            <button onClick={() => setLocation("/map")} className="text-gray-600 hover:text-primary font-medium">الخريطة</button>
            {isAuthenticated ? (
              <>
                <button onClick={() => setLocation("/dashboard")} className="text-gray-600 hover:text-primary font-medium">لوحتي</button>
                <button onClick={() => setLocation("/profile")} className="text-gray-600 hover:text-primary font-medium">حسابي</button>
              </>
            ) : (
              <a href={getLoginUrl()} className="text-gray-600 hover:text-primary font-medium">دخول</a>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7), rgba(139, 69, 19, 0.7)), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%231e3a8a%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E")'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">البحث عن المنازل يبدأ هنا</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">اكتشف عقارات للشراء أو الاستئجار في رأس البر</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="container px-4">
          {/* Tabs */}
          <Tabs defaultValue="sale" className="w-full mb-6" dir="rtl">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-gray-100">
              <TabsTrigger value="sale">للبيع</TabsTrigger>
              <TabsTrigger value="rent">للإيجار</TabsTrigger>
            </TabsList>

            <TabsContent value="sale" className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Location Input */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="ابحث عن منطقة أو اسم البناء"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-foreground placeholder:text-gray-500 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  {/* Price Min */}
                  <Input
                    type="number"
                    placeholder="السعر من"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg"
                    dir="rtl"
                  />
                  {/* Price Max */}
                  <Input
                    type="number"
                    placeholder="السعر إلى"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg"
                    dir="rtl"
                  />
                  {/* Search Button */}
                  <Button
                    onClick={handleSearch}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rent" className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="ابحث عن منطقة أو اسم البناء"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-foreground placeholder:text-gray-500 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="الإيجار من"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg"
                    dir="rtl"
                  />
                  <Input
                    type="number"
                    placeholder="الإيجار إلى"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="bg-gray-100 border-0 rounded-lg"
                    dir="rtl"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 h-12"
                  >
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* About Ras El Bar Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">عن مدينة رأس البر</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            مدينة ساحلية سياحية جميلة تقع على ساحل البحر المتوسط، تتمتع برمال ذهبية وشواطئ نظيفة وطقس معتدل طوال العام
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Tourism Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Anchor className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">وجهة سياحية عالمية</h3>
              <p className="text-gray-600 text-sm">
                تستقطب آلاف السياح سنوياً للاستمتاع بشواطئها الخلابة والأنشطة البحرية المتنوعة
              </p>
            </div>

            {/* Climate Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Umbrella className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">مناخ معتدل</h3>
              <p className="text-gray-600 text-sm">
                طقس دافئ في الصيف وبارد معتدل في الشتاء، مما يجعلها مثالية للعيش طوال السنة
              </p>
            </div>

            {/* Community Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">مجتمع حيوي</h3>
              <p className="text-gray-600 text-sm">
                مجتمع متنوع من السكان والسياح، مع خدمات عامة متطورة وفرص استثمارية عديدة
              </p>
            </div>
          </div>

          {/* Key Facts */}
          <div className="bg-gradient-coastal rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6 text-center">حقائق عن رأس البر</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">📍</p>
                <p className="text-sm mt-2">تقع على البحر المتوسط</p>
              </div>
              <div>
                <p className="text-3xl font-bold">🌊</p>
                <p className="text-sm mt-2">شواطئ رملية ذهبية</p>
              </div>
              <div>
                <p className="text-3xl font-bold">☀️</p>
                <p className="text-sm mt-2">300 يوم مشمس سنوياً</p>
              </div>
              <div>
                <p className="text-3xl font-bold">🏖️</p>
                <p className="text-sm mt-2">وجهة سياحية عالمية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Neighborhoods */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">المناطق الشهيرة في رأس البر</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "الشاطئ الرئيسي", desc: "المنطقة الأكثر حيوية مع فنادق ومطاعم عالمية" },
              { name: "حي السياحة", desc: "منطقة سكنية هادئة قريبة من الشاطئ" },
              { name: "المنطقة التجارية", desc: "مركز تجاري حديث مع متاجر وخدمات" },
              { name: "حي الفيلات", desc: "منطقة فاخرة للعقارات السكنية الراقية" },
              { name: "المنطقة الشرقية", desc: "منطقة سكنية جديدة قيد التطوير" },
              { name: "حي الميناء", desc: "منطقة تاريخية مع إطلالات بحرية خلابة" },
            ].map((area, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <h3 className="font-bold text-lg mb-2 text-blue-900">{area.name}</h3>
                <p className="text-gray-700 text-sm">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">ابدأ البحث عن عقارك الآن</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            اكتشف أفضل العقارات في رأس البر مع أسعار تنافسية وخدمة عملاء متميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/map")}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-lg"
            >
              اكتشف على الخريطة
            </Button>
            <Button
              onClick={() => setLocation("/properties")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg"
            >
              استعرض العقارات
            </Button>
            {!isAuthenticated ? (
              <a href={getLoginUrl()}>
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg">
                  أضف إعلانك
                </Button>
              </a>
            ) : (
              <Button
                onClick={() => setLocation("/add-property")}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg"
              >
                أضف إعلانك
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5" />
                عقارات رأس البر
              </h4>
              <p className="text-sm text-gray-400">
                منصة عقارات موثوقة متخصصة في بيع وإيجار العقارات في رأس البر
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">الروابط السريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setLocation("/properties")} className="hover:text-white">البحث عن عقارات</button></li>
                <li><button onClick={() => setLocation("/add-property")} className="hover:text-white">أضف إعلان</button></li>
                <li><button onClick={() => setLocation("/dashboard")} className="hover:text-white">لوحة التحكم</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">عن رأس البر</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>مدينة ساحلية سياحية</li>
                <li>على البحر المتوسط</li>
                <li>وجهة عالمية</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 +20 123 456 7890</li>
                <li>📧 info@raselbar.eg</li>
                <li>📍 رأس البر، مصر</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 عقارات رأس البر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
