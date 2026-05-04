import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, MessageCircle, Waves, Home as HomeIcon, Loader2 } from "lucide-react";

export default function PropertyDetail() {
  const [match, params] = useRoute("/property/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;

  const { data: property, isLoading } = trpc.properties.getById.useQuery(propertyId || 0, {
    enabled: !!propertyId,
  });

  if (!match) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <HomeIcon className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-bold mb-2">العقار غير موجود</h1>
        <p className="text-muted-foreground mb-6">العقار الذي تبحث عنه غير متاح حالياً</p>
        <a href="/properties">
          <Button>العودة للعقارات</Button>
        </a>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${property.whatsappNumber || property.phoneNumber}?text=مرحباً، أنا مهتم بالعقار: ${property.title}`;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <a href="/properties">
            <Button variant="outline">العودة للعقارات</Button>
          </a>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="card-elevated overflow-hidden mb-8">
              <div className="bg-gradient-coastal h-96 flex items-center justify-center text-white">
                {property.images && property.images.length > 0 ? (
                  <img 
                    src={property.images[0].imageUrl} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <HomeIcon className="w-24 h-24 opacity-30" />
                )}
              </div>
              {property.images && property.images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {property.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.imageUrl}
                      alt={`صورة ${idx + 1}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="card-elevated p-8 mb-8">
              <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-sm text-muted-foreground">نوع العملية</p>
                  <p className="font-semibold text-lg">
                    {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">نوع العقار</p>
                  <p className="font-semibold text-lg capitalize">{property.type}</p>
                </div>
                {property.area && (
                  <div>
                    <p className="text-sm text-muted-foreground">المساحة</p>
                    <p className="font-semibold text-lg">{property.area} م²</p>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">الوصف</h2>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {property.description}
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">معلومات الموقع</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-lg font-semibold">{property.location}</p>
                    <p className="text-sm text-muted-foreground">رأس البر، مصر</p>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/10 rounded-lg p-6">
                <h3 className="font-bold mb-2">معلومات إضافية</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">تاريخ الإضافة</p>
                    <p className="font-semibold">
                      {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">عدد المشاهدات</p>
                    <p className="font-semibold">{property.viewCount || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="card-elevated p-8 mb-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">السعر</p>
              <p className="text-5xl font-bold text-primary mb-4">{property.price}</p>
              <p className="text-muted-foreground">ريال سعودي</p>
            </div>

            {/* Contact Card */}
            <div className="card-elevated p-8 space-y-4">
              <h3 className="font-bold text-lg">تواصل مع المعلن</h3>
              
              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">رقم الهاتف</p>
                <p className="font-bold text-lg">{property.phoneNumber}</p>
              </div>

              <a href={`tel:${property.phoneNumber}`}>
                <Button className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  اتصل الآن
                </Button>
              </a>

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  واتساب
                </Button>
              </a>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  تأكد من التحقق من البيانات قبل التواصل
                </p>
              </div>
            </div>

            {/* Report Card */}
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center">
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                الإبلاغ عن الإعلان
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
