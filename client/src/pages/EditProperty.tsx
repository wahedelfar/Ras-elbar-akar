import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Waves, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function EditProperty() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/edit-property/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment" as "apartment" | "villa" | "house" | "land" | "commercial" | "other",
    operationType: "sale" as "sale" | "rent",
    price: "",
    area: "",
    location: "",
    phoneNumber: "",
    whatsappNumber: "",
    imageUrls: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: property, isLoading } = trpc.properties.getById.useQuery(
    propertyId || 0,
    { enabled: !!propertyId && isAuthenticated }
  );

  const updateProperty = trpc.properties.update.useMutation({
    onSuccess: () => {
      setLocation("/dashboard");
    },
  });

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        description: property.description || "",
        type: property.type as "apartment" | "villa" | "house" | "land" | "commercial" | "other",
        operationType: property.operationType as "sale" | "rent",
        price: property.price.toString(),
        area: property.area?.toString() || "",
        location: property.location,
        phoneNumber: property.phoneNumber,
        whatsappNumber: property.whatsappNumber || "",
        imageUrls: property.images?.map((img) => img.imageUrl) || [],
      });
    }
  }, [property]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
        <Waves className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">يجب تسجيل الدخول أولاً</h1>
        <Button onClick={() => setLocation("/")} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
          العودة للرئيسية
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <Loader2 className="animate-spin text-yellow-400" size={48} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
        <h1 className="text-2xl font-bold mb-4 text-white">الإعلان غير موجود</h1>
        <Button onClick={() => setLocation("/dashboard")} className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
          العودة لوحة التحكم
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      updateProperty.mutate({
        id: propertyId || 0,
        title: formData.title,
        description: formData.description,
        type: formData.type,
        operationType: "sale",
        price: parseInt(formData.price),
        area: formData.area ? parseInt(formData.area) : undefined,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        whatsappNumber: formData.whatsappNumber,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl border-b border-yellow-500/20">
        <div className="container px-4 py-4 flex items-center justify-between">
          <button onClick={() => setLocation("/")} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">عقارات رأس البر</span>
              <p className="text-xs text-yellow-400/60">الخيار الأول للعقارات</p>
            </div>
          </button>
          <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span>العودة</span>
          </button>
        </div>
      </header>

      <div className="container px-4 py-8 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-white">تعديل الإعلان</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">العنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 min-h-24"
              required
            />
          </div>

          {/* Type and Operation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">نوع العقار</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "apartment" | "villa" | "house" | "land" | "commercial" | "other" })}
              className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="apartment">شقة</option>
              <option value="villa">فيلا</option>
              <option value="house">منزل</option>
              <option value="land">أرض</option>
              <option value="commercial">تجاري</option>
            </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">نوع العملية</label>
            <select
              value={formData.operationType}
              onChange={(e) => setFormData({ ...formData, operationType: e.target.value as "sale" | "rent" })}
              className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
            >
              <option value="sale">بيع</option>
              <option value="rent">إيجار</option>
            </select>
            </div>
          </div>

          {/* Price and Area */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">السعر (ج.م)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">المساحة (م²)</label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">الموقع</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white focus:outline-none focus:border-yellow-400"
              required
            >
              <option value="">اختر المنطقة</option>
              <option value="منطقة الملوك">منطقة الملوك</option>
              <option value="المنطقة من شارع 51 لمسجد الرحمة">المنطقة من شارع 51 لمسجد الرحمة</option>
              <option value="المنطقة من شارع 109 لشارع 51">المنطقة من شارع 109 لشارع 51</option>
              <option value="منطقة الإمتداد العمراني">منطقة الإمتداد العمراني</option>
              <option value="منطقة العاصي">منطقة العاصي</option>
              <option value="منطقة المستشارين">منطقة المستشارين</option>
              <option value="الشاطئ الرئيسي">الشاطئ الرئيسي</option>
            </select>
          </div>

          {/* Phone and WhatsApp */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="01001234567"
                className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">رقم الواتساب</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="01001234567"
                className="w-full px-4 py-2 bg-slate-700 border border-yellow-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting || updateProperty.isPending}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2"
            >
              {isSubmitting || updateProperty.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                "حفظ التغييرات"
              )}
            </Button>
            <Button
              type="button"
              onClick={() => setLocation("/dashboard")}
              variant="outline"
              className="flex-1 border-yellow-500/20 text-gray-300 hover:bg-slate-700"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
