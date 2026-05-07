import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Waves, Upload, Loader2, X, ExternalLink, Info } from "lucide-react";
import { getLoginUrl } from "@/const";

// Country codes for WhatsApp
const COUNTRY_CODES = [
  { code: "+20", country: "مصر 🇪🇬" },
  { code: "+966", country: "السعودية 🇸🇦" },
  { code: "+971", country: "الإمارات 🇦🇪" },
  { code: "+965", country: "الكويت 🇰🇼" },
  { code: "+974", country: "قطر 🇶🇦" },
  { code: "+973", country: "البحرين 🇧🇭" },
  { code: "+968", country: "عمان 🇴🇲" },
  { code: "+212", country: "المغرب 🇲🇦" },
  { code: "+216", country: "تونس 🇹🇳" },
  { code: "+213", country: "الجزائر 🇩🇿" },
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
  const [countryCode, setCountryCode] = useState("+20");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProperty = trpc.properties.create.useMutation();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/^\+?\d+/, "").trim()}`;
      const fullWhatsappNumber = whatsappNumber 
        ? `${countryCode}${whatsappNumber.replace(/^\+?\d+/, "").trim()}`
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

      // Upload local images
      for (const image of images) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = event.target?.result as string;
          const base64Data = base64.split(',')[1];
          if (propertyId) {
            await uploadImage.mutateAsync({
              propertyId: propertyId,
              imageBase64: base64Data,
              mimeType: image.type,
            });
          }
        };
        reader.readAsDataURL(image);
      }

      // Note: URL-based images can be added as external links in the future

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

      <div className="container px-4 py-8 max-w-3xl" dir="rtl">
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

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-yellow-300">الموقع *</label>
              <Input
                required
                placeholder="مثال: حي الشرقية، رأس البر"
                value={location}
                onChange={(e) => setPropertyLocation(e.target.value)}
                dir="rtl"
                className="bg-slate-600/50 border border-yellow-500/30 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Phone Numbers with Country Code */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-yellow-300">مفتاح الدولة *</label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="bg-slate-600/50 border border-yellow-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border border-yellow-500/30 max-h-60">
                    {COUNTRY_CODES.map((item) => (
                      <SelectItem key={item.code} value={item.code} className="text-white">
                        {item.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Local Images Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-yellow-300">صور العقار - رفع من الجهاز</label>
              <div className="border-2 border-dashed border-yellow-500/30 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-500/50 transition-colors bg-slate-600/20">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="font-semibold text-white">اضغط لتحميل الصور</p>
                  <p className="text-sm text-gray-400">أو اسحب الصور هنا</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image URLs Section */}
            <div className="bg-slate-600/30 rounded-lg p-4 border border-yellow-500/20">
              <div className="flex items-start gap-2 mb-4">
                <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-yellow-300 mb-2">إضافة صور من روابط مباشرة</p>
                  <p className="text-sm text-gray-300 mb-3">
                    إذا كانت لديك صور مرفوعة على الإنترنت، يمكنك إضافة رابطها مباشرة هنا. استخدم مواقع رفع الصور المجانية أدناه:
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
                  placeholder="https://example.com/image.jpg"
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
                  <p className="text-sm font-semibold text-yellow-300">الروابط المضافة:</p>
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-700 p-3 rounded-lg">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-300 text-sm truncate flex-1"
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
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
