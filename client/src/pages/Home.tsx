import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Search, Waves, Heart, Settings, HomeIcon, Anchor, Umbrella, Users, Phone, MessageCircle } from "lucide-react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [searchLocation, setSearchLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [operationType, setOperationType] = useState<"sale" | "rent">("sale");

  // Fetch properties
  const { data: properties = [], isLoading } = trpc.properties.list.useQuery({
    operationType: operationType,
    location: searchLocation || undefined,
    minPrice: priceMin ? Number(priceMin) : undefined,
    maxPrice: priceMax ? Number(priceMax) : undefined,
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (priceMin) params.append("minPrice", priceMin);
    if (priceMax) params.append("maxPrice", priceMax);
    params.append("operationType", operationType);
    setLocation(`/properties?${params.toString()}`);
  };

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

      {/* Search Section - Luxury */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 py-8 md:py-12 border-b border-yellow-500/20">
        <div className="container px-4">
          <Tabs value={operationType} onValueChange={(v) => setOperationType(v as "sale" | "rent")} className="w-full mb-6" dir="rtl">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-slate-700 border border-yellow-500/30">
              <TabsTrigger value="sale" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">للبيع</TabsTrigger>
              <TabsTrigger value="rent" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-slate-900">للإيجار</TabsTrigger>
            </TabsList>

            <TabsContent value="sale" className="mt-6">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-yellow-500/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 bg-slate-600/50 rounded-lg px-4 py-3 border border-yellow-500/30">
                    <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="ابحث عن منطقة أو اسم البناء"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-white placeholder:text-gray-400 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="السعر من"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="bg-slate-600/50 border border-yellow-500/30 rounded-lg text-white placeholder:text-gray-400"
                    dir="rtl"
                  />
                  <Input
                    type="number"
                    placeholder="السعر إلى"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="bg-slate-600/50 border border-yellow-500/30 rounded-lg text-white placeholder:text-gray-400"
                    dir="rtl"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 rounded-lg flex items-center justify-center gap-2 h-12 font-bold shadow-lg"
                  >
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rent" className="mt-6">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-yellow-500/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 bg-slate-600/50 rounded-lg px-4 py-3 border border-yellow-500/30">
                    <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="ابحث عن منطقة أو اسم البناء"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-white placeholder:text-gray-400 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder="الإيجار من"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="bg-slate-600/50 border border-yellow-500/30 rounded-lg text-white placeholder:text-gray-400"
                    dir="rtl"
                  />
                  <Input
                    type="number"
                    placeholder="الإيجار إلى"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="bg-slate-600/50 border border-yellow-500/30 rounded-lg text-white placeholder:text-gray-400"
                    dir="rtl"
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 rounded-lg flex items-center justify-center gap-2 h-12 font-bold shadow-lg"
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
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">{property.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{property.description}</p>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-yellow-500/20">
                      <div>
                        <p className="text-gray-400 text-xs">السعر</p>
                        <p className="text-yellow-400 font-bold text-lg">{property.price.toLocaleString()} ج.م</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">المساحة</p>
                        <p className="text-yellow-400 font-bold text-lg">{property.area} م²</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 mb-4 text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-1" />
                      <span>{property.location}</span>
                    </div>

                    {/* Contact Buttons */}
                    <div className="flex gap-2">
                      <a
                        href={`tel:${property.phoneNumber}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                        اتصل
                      </a>
                      {property.whatsappNumber && (
                        <a
                          href={`https://wa.me/${property.whatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="w-4 h-4" />
                          واتس
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {properties.length > 6 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setLocation("/properties")}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
              >
                عرض جميع العقارات
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Ras El Bar Section */}
      <section className="py-16 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">عن مدينة رأس البر</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            مدينة ساحلية سياحية جميلة تقع على ساحل البحر المتوسط، تتمتع برمال ذهبية وشواطئ نظيفة وطقس معتدل طوال العام
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all border border-yellow-500/20 hover:border-yellow-500/50">
              <Anchor className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 text-yellow-300">وجهة سياحية عالمية</h3>
              <p className="text-gray-300 text-sm">
                تستقطب آلاف السياح سنوياً للاستمتاع بشواطئها الخلابة والأنشطة البحرية المتنوعة
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all border border-yellow-500/20 hover:border-yellow-500/50">
              <Umbrella className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 text-yellow-300">مناخ معتدل</h3>
              <p className="text-gray-300 text-sm">
                طقس دافئ في الصيف وبارد معتدل في الشتاء، مما يجعلها مثالية للعيش طوال السنة
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all border border-yellow-500/20 hover:border-yellow-500/50">
              <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2 text-yellow-300">مجتمع حيوي</h3>
              <p className="text-gray-300 text-sm">
                مجتمع متنوع من السكان والسياح، مع خدمات عامة متطورة وفرص استثمارية عديدة
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-xl p-8 text-white">
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-t border-yellow-500/20">
        <div className="container px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">ابدأ البحث عن عقارك الفاخر الآن</h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto text-gray-300">
            اكتشف أفضل العقارات في رأس البر مع أسعار تنافسية وخدمة عملاء متميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/map")}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
            >
              اكتشف على الخريطة
            </Button>
            <Button
              onClick={() => setLocation("/properties")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
            >
              استعرض العقارات
            </Button>
            {!isAuthenticated ? (
              <a href={getLoginUrl()}>
                <Button className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg shadow-lg w-full">
                  أضف إعلانك
                </Button>
              </a>
            ) : (
              <Button
                onClick={() => setLocation("/add-property")}
                className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg shadow-lg"
              >
                أضف إعلانك
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-300 py-12 border-t border-yellow-500/20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 flex items-center gap-2 text-yellow-400">
                <Waves className="w-5 h-5" />
                عقارات رأس البر
              </h4>
              <p className="text-sm text-gray-400">
                منصة عقارات موثوقة متخصصة في بيع وإيجار العقارات الفاخرة في رأس البر
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">الروابط السريعة</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => setLocation("/properties")} className="hover:text-yellow-400 transition-colors">البحث عن عقارات</button></li>
                <li><button onClick={() => setLocation("/add-property")} className="hover:text-yellow-400 transition-colors">أضف إعلان</button></li>
                <li><button onClick={() => setLocation("/dashboard")} className="hover:text-yellow-400 transition-colors">لوحة التحكم</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">عن رأس البر</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>مدينة ساحلية سياحية</li>
                <li>على البحر المتوسط</li>
                <li>وجهة عالمية</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-yellow-400">تواصل معنا</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📞 +20 123 456 7890</li>
                <li>📧 info@raselbar.eg</li>
                <li>📍 رأس البر، مصر</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-yellow-500/20 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2026 عقارات رأس البر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
