import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Home as HomeIcon, Waves, Menu, Heart, Settings } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [operationType, setOperationType] = useState<"sale" | "rent">("sale");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    params.append("operationType", operationType);
    if (priceMin) params.append("priceMin", priceMin);
    if (priceMax) params.append("priceMax", priceMax);
    
    setLocation(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Top Status Bar */}
      <div className="bg-foreground text-background text-xs px-4 py-2 flex justify-between items-center">
        <div className="flex gap-2">
          <span>%0V</span>
          <span>📱</span>
          <span>📶📶</span>
          <span>📡</span>
        </div>
        <div className="flex gap-2">
          <span>9:06</span>
          <span>📞</span>
          <span>📘</span>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white px-4 py-3 flex justify-between items-center">
        <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">تنزيل</Button>
        <div className="text-center flex-1">
          <h3 className="font-bold">بروبرتي فايندر</h3>
          <div className="flex justify-center gap-1">⭐⭐⭐⭐⭐</div>
          <p className="text-xs">مجاني - 2.5 مليون تحميل</p>
        </div>
        <div className="bg-red-500 rounded-full w-10 h-10 flex items-center justify-center">❤️</div>
      </div>

      {/* Header/Navigation */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="container px-4 py-4 flex items-center justify-between">
          <Menu className="w-6 h-6 md:hidden" />
          
          <div className="flex items-center gap-3 flex-1 md:flex-none">
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">P</div>
              <h1 className="text-xl font-bold hidden md:block">بروبرتي فايندر</h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 justify-center">
            <button className="p-2 hover:bg-gray-100 rounded-lg">❤️</button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">⚙️</button>
            <div className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-full text-sm">
              <span>🔍</span>
              <span>propertyfinder.eg</span>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">🏠</button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Heart className="w-5 h-5" />
            <Settings className="w-5 h-5" />
            <HomeIcon className="w-5 h-5" />
          </div>
        </div>
      </header>

      {/* Hero Section with Background Image */}
      <section className="relative h-96 md:h-[500px] bg-cover bg-center overflow-hidden" style={{
        backgroundImage: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7), rgba(139, 69, 19, 0.7)), url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 600%22%3E%3Crect fill=%22%231e3a8a%22 width=%221200%22 height=%22600%22/%3E%3C/svg%3E")'
      }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">البحث عن المنازل يبدأ هنا</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">اكتشف عقارات للشراء أو الاستئجار أو الاستثمار</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="container px-4">
          {/* Tabs */}
          <Tabs defaultValue="sale" className="w-full mb-6" dir="rtl">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-100">
              <TabsTrigger value="sale">للبيع</TabsTrigger>
              <TabsTrigger value="rent">للإيجار</TabsTrigger>
              <TabsTrigger value="new">مشاريع جديدة</TabsTrigger>
            </TabsList>

            <TabsContent value="sale" className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Location Input */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="أدخل المدينة أو المنطقة أو اسم البناء"
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
                      placeholder="أدخل المدينة أو المنطقة"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-foreground placeholder:text-gray-500 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  <Input type="number" placeholder="السعر من" className="bg-gray-100 border-0 rounded-lg" dir="rtl" />
                  <Input type="number" placeholder="السعر إلى" className="bg-gray-100 border-0 rounded-lg" dir="rtl" />
                  <Button onClick={handleSearch} className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 h-12">
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="new" className="mt-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="أدخل المدينة أو المنطقة"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="border-0 bg-transparent text-foreground placeholder:text-gray-500 focus:outline-none text-sm"
                      dir="rtl"
                    />
                  </div>
                  <Input type="number" placeholder="السعر من" className="bg-gray-100 border-0 rounded-lg" dir="rtl" />
                  <Input type="number" placeholder="السعر إلى" className="bg-gray-100 border-0 rounded-lg" dir="rtl" />
                  <Button onClick={handleSearch} className="bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center gap-2 h-12">
                    <Search className="w-5 h-5" />
                    بحث
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">أحدث العقارات</h2>
          <FeaturedPropertiesList />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">عقارات رأس البر</h5>
              <p className="text-sm opacity-70">منصة موثوقة للعقارات في رأس البر</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">الروابط</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="/" className="hover:opacity-100">الرئيسية</a></li>
                <li><a href="/properties" className="hover:opacity-100">العقارات</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">المساعدة</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><span className="text-xs bg-accent/20 px-2 py-1 rounded">قريباً</span></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">المتابعة</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><span className="text-xs bg-accent/20 px-2 py-1 rounded">قريباً</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm opacity-70">
            <p>&copy; 2026 عقارات رأس البر. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeaturedPropertiesList() {
  const { data: properties, isLoading, error } = trpc.properties.list.useQuery({ });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted rounded-lg h-64 animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 card-elevated">
        <p className="text-destructive text-lg mb-4">حدث خطأ في تحميل الإعلانات</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">لا توجد إعلانات حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {properties.slice(0, 6).map((property) => (
        <a key={property.id} href={`/property/${property.id}`} className="group">
          <div className="card-elevated overflow-hidden h-full hover:shadow-lg transition-shadow">
            <div className="bg-gradient-coastal h-48 flex items-center justify-center text-white relative">
              <HomeIcon className="w-12 h-12 opacity-50" />
              <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">{property.title}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{property.description}</p>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-bold text-primary">{property.price.toLocaleString()} ريال</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.location}</span>
              </div>
              {property.area && (
                <p className="text-xs text-muted-foreground">المساحة: {property.area} م²</p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
