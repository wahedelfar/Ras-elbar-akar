import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { MapPin, Phone, MessageCircle, Share2, Heart, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";
import { PropertySchema } from "@/components/PropertySchema";

// دالة تحويل الأرقام من إنجليزية إلى عربية
const convertToArabicNumbers = (str: string): string => {
  const arabicMap: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };
  return str.replace(/[0-9]/g, (digit) => arabicMap[digit] || digit);
};

// دالة لتنسيق رقم الهاتف
const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+2020')) {
    cleaned = cleaned.replace('+2020', '+20');
  }
  return cleaned;
};

// دالة تنسيق السعر بفواصل
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
  return convertToArabicNumbers(formatted);
};

export default function PropertyDetailAdvanced() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/property/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: property, isLoading } = trpc.properties.getById.useQuery(propertyId || 0, {
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (propertyId && property) {
      // تحديث عدد المشاهدات يتم تلقائياً عند جلب البيانات
    }
  }, [propertyId, property]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <h1 className="text-2xl font-bold mb-4 text-foreground">العقار غير موجود</h1>
        <Button onClick={() => setLocation("/properties")} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
          العودة للبحث
        </Button>
      </div>
    );
  }

  const images = property.images || [];
  const currentImage = images[selectedImageIndex]?.imageUrl || "/placeholder.jpg";

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      apartment: "شقة",
      villa: "فيلا",
      house: "منزل",
      land: "أرض",
      commercial: "تجاري",
      other: "أخرى",
    };
    return typeMap[type] || type;
  };

  const getOperationLabel = (op: string) => {
    return op === "sale" ? "بيع" : "إيجار";
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {property && <PropertySchema property={property} />}
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-lg">
        <div className="container px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/properties")} className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>العودة</span>
          </button>
          <h1 className="text-xl font-bold text-foreground">{property.title}</h1>
          <div className="flex gap-2">
            <button onClick={() => setIsFavorite(!isFavorite)} className={`p-2 rounded-lg transition-colors ${isFavorite ? "bg-red-500/20 text-red-500" : "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent"}`}>
              <Heart className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-muted rounded-xl overflow-hidden aspect-video cursor-pointer group" onClick={() => setShowLightbox(true)}>
                <img src={currentImage} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {images.length > 1 && (
                  <>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {images.map((image, index) => (
                    <button key={index} onClick={() => setSelectedImageIndex(index)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex ? "border-accent" : "border-border hover:border-accent/50"}`}>
                      <img src={image.imageUrl} alt={`thumbnail-${index}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-6">
              {/* Key Info */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">النوع</p>
                  <p className="text-lg font-bold text-accent">{getTypeLabel(property.type)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">العملية</p>
                  <p className="text-lg font-bold text-accent">{getOperationLabel(property.operationType)}</p>
                </div>
                <div className="text-center">
                  <p className="text-muted-foreground text-sm">المساحة</p>
                  <p className="text-lg font-bold text-accent">{property.area || "N/A"} م²</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">الوصف</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description || "لا يوجد وصف متاح"}</p>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-3">الموقع</h3>
                <div className="flex items-start gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-foreground">{property.location}</p>
                </div>

                {/* Map */}
                <div className="h-80 rounded-lg overflow-hidden border border-border">
                  <MapView
                    initialCenter={{ lat: 31.2654, lng: 31.5497 }}
                    initialZoom={13}
                    className="w-full h-full"
                  />
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-muted-foreground text-sm">تاريخ الإضافة</p>
                  <p className="text-foreground font-semibold">{new Date(property.createdAt).toLocaleDateString("ar-EG")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">عدد المشاهدات</p>
                  <p className="text-foreground font-semibold">{property.viewCount || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-accent/10 border border-accent rounded-xl p-6 sticky top-24">
              <p className="text-muted-foreground text-sm mb-2">السعر</p>
              <p className="text-4xl font-bold text-orange-600 mb-4">{formatPrice(property.price)}</p>
              <p className="text-muted-foreground text-sm mb-4">ج.م</p>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <a href={`tel:${property.phoneNumber}`} className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-lg transition-colors">
                  <Phone className="w-5 h-5" />
                  اتصل الآن
                </a>
                <a href={`https://wa.me/${property.whatsappNumber || property.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  واتساب
                </a>
              </div>
            </div>

            {/* Advertiser Info */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">معلومات المعلن</h3>
              <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">رقم الهاتف</span>
                    <a href={`tel:${property.phoneNumber}`} className="text-accent hover:text-accent/80 font-semibold text-orange-600">
                      {convertToArabicNumbers(formatPhoneNumber(property.phoneNumber))}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">الواتساب</span>
                    <a href={`https://wa.me/${property.whatsappNumber || property.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent/80 font-semibold text-orange-600">
                      {convertToArabicNumbers(formatPhoneNumber(property.whatsappNumber || property.phoneNumber))}
                    </a>
                  </div>
              </div>
            </div>

            {/* Report Button */}
            <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
              الإبلاغ عن الإعلان
            </Button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" dir="ltr">
          <button onClick={() => setShowLightbox(false)} className="absolute top-4 right-4 text-white hover:text-gray-300">
            <X className="w-8 h-8" />
          </button>

          <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img src={currentImage} alt="fullscreen" className="max-w-4xl max-h-[90vh] object-contain" />

          <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
