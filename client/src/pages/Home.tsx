import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Home as HomeIcon, Waves } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [searchLocation, setSearchLocation] = useState("");
  const [operationType, setOperationType] = useState<"sale" | "rent" | "">("");
  const [propertyType, setPropertyType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append("location", searchLocation);
    if (operationType) params.append("operationType", operationType);
    if (propertyType) params.append("type", propertyType);
    
    setLocation(`/properties?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Waves className="w-8 h-8" />
              <h1 className="text-2xl font-bold">عقارات رأس البر</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-foreground hover:text-primary transition-colors">الرئيسية</a>
            <a href="/properties" className="text-foreground hover:text-primary transition-colors">العقارات</a>
            {isAuthenticated && (
              <>
                <a href="/dashboard" className="text-foreground hover:text-primary transition-colors">لوحة التحكم</a>
                {user?.role === 'admin' && (
                  <a href="/admin" className="text-foreground hover:text-primary transition-colors">الإدارة</a>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <a href="/profile">
                  <Button variant="outline" size="sm">{user?.name || "الملف الشخصي"}</Button>
                </a>
                <a href="/add-property">
                  <Button size="sm" className="bg-accent hover:bg-accent/90">إضافة إعلان</Button>
                </a>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm">تسجيل الدخول</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-coastal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-5xl font-bold mb-4">اكتشف عقارات رأس البر</h2>
            <p className="text-xl opacity-90">منصتك الموثوقة للبحث عن أفضل العقارات في مدينة رأس البر السياحية</p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location Input */}
              <div className="flex items-center gap-2 bg-input rounded-lg px-4 py-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="المنطقة أو الموقع"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="border-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  dir="rtl"
                />
              </div>

              {/* Property Type */}
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="bg-input border-0 rounded-lg">
                  <HomeIcon className="w-5 h-5 text-primary mr-2" />
                  <SelectValue placeholder="نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">شقة</SelectItem>
                  <SelectItem value="villa">فيلا</SelectItem>
                  <SelectItem value="house">منزل</SelectItem>
                  <SelectItem value="land">أرض</SelectItem>
                  <SelectItem value="commercial">تجاري</SelectItem>
                </SelectContent>
              </Select>

              {/* Operation Type */}
              <Select value={operationType} onValueChange={(val) => setOperationType(val as "sale" | "rent" | "")}>
                <SelectTrigger className="bg-input border-0 rounded-lg">
                  <SelectValue placeholder="بيع أو إيجار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">بيع</SelectItem>
                  <SelectItem value="rent">إيجار</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                بحث
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4">أحدث العقارات</h3>
            <p className="text-lg text-muted-foreground">اكتشف أحدث الإعلانات العقارية في رأس البر</p>
          </div>

          <FeaturedPropertiesList />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">بحث متقدم</h4>
              <p className="text-muted-foreground">ابحث عن العقارات بسهولة باستخدام فلاتر متقدمة</p>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-xl font-bold mb-2">إعلانات موثوقة</h4>
              <p className="text-muted-foreground">جميع الإعلانات موثوقة ومن مالكين حقيقيين</p>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="w-8 h-8 text-secondary" />
              </div>
              <h4 className="text-xl font-bold mb-2">اتصال مباشر</h4>
              <p className="text-muted-foreground">تواصل مباشرة مع المعلنين عبر واتساب</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-sunset text-white">
        <div className="container text-center">
          <h3 className="text-4xl font-bold mb-4">هل لديك عقار للبيع أو الإيجار؟</h3>
          <p className="text-xl mb-8 opacity-90">انضم إلى آلاف المعلنين الذين يستخدمون منصتنا</p>
          <a href={isAuthenticated ? "/add-property" : getLoginUrl()}>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90">
              ابدأ الآن
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4 flex items-center gap-2">
                <Waves className="w-5 h-5" />
                عقارات رأس البر
              </h5>
              <p className="text-sm opacity-70">منصة موثوقة للعقارات في رأس البر</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">الروابط</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="/" className="hover:opacity-100">الرئيسية</a></li>
                <li><a href="/properties" className="hover:opacity-100">العقارات</a></li>
                <li><a href="/about" className="hover:opacity-100">عن الموقع</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">المساعدة</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:opacity-100">التواصل</a></li>
                <li><a href="#" className="hover:opacity-100">الشروط</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">المتابعة</h5>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100">فيسبوك</a></li>
                <li><a href="#" className="hover:opacity-100">تويتر</a></li>
                <li><a href="#" className="hover:opacity-100">إنستجرام</a></li>
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
  const { data: properties, isLoading } = trpc.properties.list.useQuery({ });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted rounded-lg h-64 animate-pulse"></div>
        ))}
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
          <div className="card-elevated overflow-hidden h-full">
            <div className="bg-gradient-coastal h-48 flex items-center justify-center text-white">
              <HomeIcon className="w-12 h-12 opacity-50" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{property.title}</h4>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{property.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-primary font-bold">{property.price} ريال</span>
                <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">
                  {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{property.location}</span>
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
