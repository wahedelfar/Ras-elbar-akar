import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Waves, Upload, Loader2, X } from "lucide-react";
import { getLoginUrl } from "@/const";

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
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProperty = trpc.properties.create.useMutation();
  const uploadImage = trpc.propertyImages.upload.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <Waves className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول أولاً</h1>
        <p className="text-muted-foreground mb-6">لإضافة إعلان عقاري، يجب أن تكون مسجل دخول</p>
        <a href={getLoginUrl()}>
          <Button>تسجيل الدخول</Button>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const propertyResult = await createProperty.mutateAsync({
        title,
        description,
        type: type as any,
        operationType: operationType as any,
        price: parseFloat(price),
        area: area ? parseInt(area) : undefined,
        location,
        phoneNumber,
        whatsappNumber: whatsappNumber || phoneNumber,
      });

      const propertyId = (propertyResult as any)?.id || (propertyResult as any)?.[0]?.insertId;

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

      setLocation("/dashboard");
    } catch (error) {
      console.error("Error creating property:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <a href="/">
            <Button variant="outline">العودة</Button>
          </a>
        </div>
      </header>

      <div className="container py-8 max-w-2xl">
        <div className="card-elevated p-8">
          <h1 className="text-4xl font-bold mb-2">إضافة إعلان عقاري</h1>
          <p className="text-muted-foreground mb-8">أضف تفاصيل العقار الخاص بك</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">عنوان الإعلان *</label>
              <Input
                required
                placeholder="مثال: شقة فاخرة بإطلالة بحرية"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                dir="rtl"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">الوصف التفصيلي *</label>
              <Textarea
                required
                placeholder="اكتب وصفاً مفصلاً للعقار..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">نوع العقار *</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">شقة</SelectItem>
                    <SelectItem value="villa">فيلا</SelectItem>
                    <SelectItem value="house">منزل</SelectItem>
                    <SelectItem value="land">أرض</SelectItem>
                    <SelectItem value="commercial">تجاري</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">نوع العملية *</label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">بيع</SelectItem>
                    <SelectItem value="rent">إيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">السعر (ريال) *</label>
                <Input
                  required
                  type="number"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">المساحة (م²)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">الموقع *</label>
              <Input
                required
                placeholder="مثال: حي الشرقية، رأس البر"
                value={location}
                onChange={(e) => setPropertyLocation(e.target.value)}
                dir="rtl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">رقم الهاتف *</label>
                <Input
                  required
                  type="tel"
                  placeholder="+966501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">رقم واتساب (اختياري)</label>
                <Input
                  type="tel"
                  placeholder="+966501234567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">صور العقار</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="font-semibold">اضغط لتحميل الصور</p>
                  <p className="text-sm text-muted-foreground">أو اسحب الصور هنا</p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`preview-${index}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !title || !description || !type || !operationType || !price || !location || !phoneNumber}
              className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {isSubmitting ? "جاري الإضافة..." : "إضافة الإعلان"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
