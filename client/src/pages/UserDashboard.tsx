import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Waves, Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function UserDashboard() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: properties, isLoading, refetch } = trpc.properties.myProperties.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const toggleActive = trpc.properties.toggleActive.useMutation({
    onSuccess: () => refetch(),
  });
  const deleteProperty = trpc.properties.delete.useMutation({
    onSuccess: () => refetch(),
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
        <Waves className="w-16 h-16 text-yellow-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-white">يجب تسجيل الدخول أولاً</h1>
        <a href={getLoginUrl()}>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">تسجيل الدخول</Button>
        </a>
      </div>
    );
  }

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
              <p className="text-xs text-yellow-400/60">الخيار الأول للعقارات الفاخرة</p>
            </div>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">مرحباً، {user?.name}</span>
            <button onClick={() => setLocation("/add-property")}>
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                <Plus className="w-4 h-4 ml-2" />
                إعلان جديد
              </Button>
            </button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">لوحة التحكم</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-yellow-400" size={48} />
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="bg-slate-800 border border-yellow-500/20 p-12 text-center rounded-lg">
            <Waves className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">لا توجد إعلانات</h2>
            <p className="text-gray-400 mb-6">لم تضف أي إعلانات عقارية بعد</p>
            <button onClick={() => setLocation("/add-property")}>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                <Plus className="w-4 h-4 ml-2" />
                إضافة إعلان
              </Button>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="bg-slate-800 border border-yellow-500/20 p-6 rounded-lg hover:border-yellow-500/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-white">{property.title}</h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{property.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">النوع</p>
                        <p className="font-semibold text-white capitalize">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">السعر</p>
                        <p className="font-semibold text-yellow-400">{property.price.toLocaleString()} ج.م</p>
                      </div>
                      <div>
                        <p className="text-gray-500">الموقع</p>
                        <p className="font-semibold text-white">{property.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">الحالة</p>
                        <p className={`font-semibold ${property.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {property.isActive ? 'مفعل' : 'معطل'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive.mutate(property.id)}
                      disabled={toggleActive.isPending}
                      className="bg-slate-700 border-yellow-500/20 text-gray-300 hover:bg-slate-600"
                    >
                      {property.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <button onClick={() => setLocation(`/property/${property.id}`)}>
                      <Button variant="outline" size="sm" className="bg-slate-700 border-yellow-500/20 text-gray-300 hover:bg-slate-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </button>
                    <button onClick={() => setLocation(`/edit-property/${property.id}`)}>
                      <Button variant="outline" size="sm" className="bg-slate-700 border-yellow-500/20 text-gray-300 hover:bg-slate-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
                          deleteProperty.mutate(property.id);
                        }
                      }}
                      disabled={deleteProperty.isPending}
                      className="bg-slate-700 border-yellow-500/20 text-red-400 hover:bg-slate-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
