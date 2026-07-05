import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Waves, Loader2, X, ExternalLink, Info, Upload, Image as ImageIcon } from "lucide-react";
import { getLoginUrl } from "@/const";

// Country codes for WhatsApp - مصر فقط
const COUNTRY_CODES = [
  { code: "+20", country: "مصر 🇪🇬" },
];

// Locations in Ras El Bar
const RAS_EL_BAR_LOCATIONS = [
  { value: "kings", label: "منطقة الملوك" },
  { value: "51-mercy", label: "من شارع 51 لمسجد الرحمة" },
  { value: "109-51", label: "من شارع 109 لشارع 51" },
  { value: "expansion", label: "منطقة الإمتداد العمراني" },
  { value: "elassi", label: "منطقة العاصي" },
  { value: "consultants", label: "منطقة المستشارين" },
];

// Free image hosting sites
const FREE_IMAGE_HOSTS = [
  { name: "Imgur", url: "https://imgur.com", icon: "🖼️" },
  { name: "Imgbb", url: "https://imgbb.com", icon: "📸" },
  { name: "Postimages", url: "https://postimages.org", icon: "🌅" },
  { name: "Tinypic", url: "https://tinypic.com", icon: "📷" },
];

export default function AddProperty() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [operationType, setOperationType] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [location, setPropertyLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode] = useState("+20"); // مصر فقط
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string; key?: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});

  const createProperty = trpc.properties.create.useMutation();
  const addExternalImage = trpc.propertyImages.addExternalUrl.useMutation();
  const uploadImage = trpc.propertyImages.upload.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800" dir="rtl">
        <Waves className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">يجب تسجيل الدخول أولاً</h1>
        <p className="text-gray-300 mb-6">لإضافة إعلان عقاري، يجب أن تكون مسجل دخول</p>
        <a href={getLoginUrl()}>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">تسجيل الدخول</Button>
        </a>
      </div>
    );
  }



  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert('يرجى اختيار ملفات صور فقط');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setUploadedImages((prev) => [...prev, { file, preview }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // إزالة أي مسافات وعلامات خاصة من الأرقام
      const cleanPhone = phoneNumber.replace(/\D/g, "").trim();
      const cleanWhatsapp = whatsappNumber ? whatsappNumber.replace(/\D/g, "").trim() : "";
      
      const fullPhoneNumber = `${countryCode}${cleanPhone}`;
      const fullWhatsappNumber = cleanWhatsapp 
        ? `${countryCode}${cleanWhatsapp}`
        : fullPhoneNumber;

      const propertyResult = await createProperty.mutateAsync({
        title,
        description,
        type: type as any,
        operationType: operationType as any,
        price: parseFloat(price),
        area: area ? parseInt(area) : undefined,
        location,
        phoneNumber: fullPhoneNumber,
        whatsappNumber: fullWhatsappNumber,
      });

      const propertyId = (propertyResult as any)?.id || (propertyResult as any)?.[0]?.insertId;

      // Add external image URLs
      for (const url of imageUrls) {
        if (propertyId) {
          await addExternalImage.mutateAsync({
            propertyId: propertyId,
            imageUrl: url,
          });
        }
      }

      // Upload file-based images - wait for all uploads to complete
      if (uploadedImages.length > 0) {
        const uploadPromises = uploadedImages.map((imgData, i) => {
          return new Promise<void>((resolve) => {
            const { file } = imgData;
            if (propertyId && file) {
              const reader = new FileReader();
              reader.onload = async (event) => {
                const base64 = event.target?.result as string;
                const base64Data = base64.split(',')[1];
                try {
                  await uploadImage.mutateAsync({
                    propertyId: propertyId,
                    imageBase64: base64Data,
                    mimeType: file.type,
                  });
                  setUploadProgress((prev) => ({ ...prev, [i]: 100 }));
                } catch (error) {
                  console.error('Error uploading image:', error);
                }
                resolve();
              };
              reader.readAsDataURL(file);
            } else {
              resolve();
            }
          });
        });

        // Wait for all uploads to complete before redirecting
        await Promise.all(uploadPromises);
      }

      setLocation("/dashboard");
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-yellow-500/20">
        <div className="container px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">عقارات رأس البر</span>
          </a>
          <a href="/">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">العودة</Button>
          </a>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-4xl" dir="rtl">
        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl p-8 border border-yellow-500/20">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">إضافة إعلان عقاري</h1>
          <p className="text-gray-300 mb-8">أضف تفاصيل العقار الخاص بك بشكل كامل</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-yellow-300">عنوان الإعلان *</label>
              <Input
                required
                placeholder="مثال: شقة فاخرة بإطلالة بحرية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                dir="rtl"
                className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-yellow-300">الوصف التفصيلي *</label>
              <Textarea
                required
                placeholder="اكتب وصفاً مفصلاً للعقار..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                dir="rtl"
                className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Property Type & Operation Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">نوع العقار *</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-slate-600/50 border border-yellow-500/30 text-white">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border border-yellow-500/30">
                    <SelectItem value="apartment" className="text-white">شقة</SelectItem>
                    <SelectItem value="villa" className="text-white">فيلا</SelectItem>
                    <SelectItem value="house" className="text-white">منزل</SelectItem>
                    <SelectItem value="land" className="text-white">أرض</SelectItem>
                    <SelectItem value="commercial" className="text-white">تجاري</SelectItem>
                    <SelectItem value="other" className="text-white">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">نوع العملية *</label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="bg-slate-600/50 border border-yellow-500/30 text-white">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border border-yellow-500/30">
                    <SelectItem value="sale" className="text-white">بيع</SelectItem>
                    <SelectItem value="rent" className="text-white">إيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price & Area */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">السعر (ج.م) *</label>
                <Input
                  required
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">المساحة (م²)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Location - Select instead of Input */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-yellow-300">الموقع *</label>
              <Select value={location} onValueChange={setPropertyLocation}>
                <SelectTrigger className="bg-slate-600/50 border border-yellow-500/30 text-white">
                  <SelectValue placeholder="اختر المنطقة" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border border-yellow-500/30">
                  {RAS_EL_BAR_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value} className="text-white">
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Phone Numbers with Country Code */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">مفتاح الدولة *</label>
                <div className="bg-slate-600/50 border border-yellow-500/30 text-white px-3 py-2 rounded-md flex items-center">
                  <span className="text-white font-semibold">{countryCode} - مصر</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">رقم الهاتف *</label>
                <Input
                  required
                  type="tel"
                  placeholder="501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">رقم واتساب (اختياري)</label>
                <Input
                  type="tel"
                  placeholder="501234567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
                />
              </div>
            </div>



            {/* Image URLs Section */}
            <div className="bg-slate-600/30 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-start gap-2 mb-4">
                <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-300 mb-2">إضافة صور من روابط مباشرة</p>
                  <p className="text-sm text-gray-300 mb-3">
                    أضف روابط الصور المباشرة (مثل: https://i.ibb.co/...png). يدعم جميع مواقع الصور الموثوقة:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                    {FREE_IMAGE_HOSTS.map((host) => (
                      <a
                        key={host.url}
                        href={host.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-yellow-400 px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <span>{host.icon}</span>
                        <span>{host.name}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <label className="block text-sm font-semibold mb-2 text-yellow-300">رابط الصورة</label>
              <div className="flex gap-2 mb-4">
                <Input
                  type="url"
                  placeholder="https://i.ibb.co/G4Rnmt0L/file.png"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  dir="ltr"
                  className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold whitespace-nowrap"
                >
                  إضافة
                </Button>
              </div>

              {imageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-yellow-300">الصور المضافة:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="relative w-full h-24 bg-slate-700 rounded-lg border border-yellow-500/20 overflow-hidden">
                          <img
                            src={url}
                            alt={`url-preview-${index}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                              }
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold py-3 rounded-lg text-lg shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  جاري الإضافة...
                </>
              ) : (
                "إضافة الإعلان"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
