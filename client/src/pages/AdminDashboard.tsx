import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Waves, Trash2, Eye, EyeOff, Loader2, Users, Building2, BarChart3 } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";

// دالة تحويل الأرقام من إنجليزية إلى عربية
const convertToArabicNumbers = (str: string): string => {
  const arabicMap: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };
  return str.replace(/[0-9]/g, (digit) => arabicMap[digit] || digit);
};

// دالة تنسيق السعر بدون فاصلة عشرية
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  const formatted = new Intl.NumberFormat('ar-EG', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
  return convertToArabicNumbers(formatted);
};

// دالة تحويل رموز الموقع إلى أسماء عربية
const getLocationLabel = (locationCode: string): string => {
  const locationMap: { [key: string]: string } = {
    'kings': 'منطقة الملوك',
    '51-mercy': 'من شارع 51 لمسجد الرحمة',
    '109-51': 'من شارع 109 لشارع 51',
    'expansion': 'منطقة الإمتداد العمراني',
    'elassi': 'منطقة العاصي',
    'consultants': 'منطقة المستشارين',
  };
  return locationMap[locationCode] || locationCode;
};

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'properties' | 'stats'>('properties');
  
  const { data: properties, isLoading: propertiesLoading } = trpc.properties.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === 'admin',
  });
  
  const deleteProperty = trpc.properties.delete.useMutation();
  const toggleActive = trpc.properties.toggleActive.useMutation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <Waves className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">لا توجد صلاحية للوصول</h1>
        <p className="text-muted-foreground mb-6">هذه الصفحة مخصصة للمسؤولين فقط</p>
        <a href={getLoginUrl()}>
          <Button>تسجيل الدخول</Button>
        </a>
      </div>
    );
  }

  const totalProperties = properties?.length || 0;
  const activeProperties = properties?.filter(p => p.isActive).length || 0;
  const inactiveProperties = totalProperties - activeProperties;
  
  // Statistics
  const saleProperties = properties?.filter(p => p.operationType === 'sale').length || 0;
  const rentProperties = properties?.filter(p => p.operationType === 'rent').length || 0;
  const villaCount = properties?.filter(p => p.type === 'villa').length || 0;
  const apartmentCount = properties?.filter(p => p.type === 'apartment').length || 0;
  const landCount = properties?.filter(p => p.type === 'land').length || 0;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <span className="text-foreground">مرحباً، {user?.name} (مسؤول)</span>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">لوحة التحكم الإدارية</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">إجمالي الإعلانات</p>
                <p className="text-3xl font-bold text-primary">{totalProperties}</p>
              </div>
              <Building2 className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">مفعلة</p>
                <p className="text-3xl font-bold text-green-600">{activeProperties}</p>
              </div>
              <Eye className="w-10 h-10 text-green-600/20" />
            </div>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">معطلة</p>
                <p className="text-3xl font-bold text-red-600">{inactiveProperties}</p>
              </div>
              <EyeOff className="w-10 h-10 text-red-600/20" />
            </div>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">بيع / إيجار</p>
                <p className="text-3xl font-bold text-blue-600">{saleProperties} / {rentProperties}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-blue-600/20" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border">
          <Button
            variant={activeTab === 'properties' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('properties')}
            className="rounded-b-none"
          >
            إدارة الإعلانات
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('stats')}
            className="rounded-b-none"
          >
            الإحصائيات المفصلة
          </Button>
        </div>

        {/* Properties Management */}
        {activeTab === 'properties' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">إدارة الإعلانات</h2>
          {propertiesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : !properties || properties.length === 0 ? (
            <div className="card-elevated p-12 text-center">
              <p className="text-muted-foreground">لا توجد إعلانات</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {properties.map((property) => (
                <div key={property.id} className="card-elevated p-4 flex items-center justify-between hover:bg-accent/5 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{property.title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{getLocationLabel(property.location)} • {formatPrice(property.price)} ج.م</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive.mutate(property.id)}
                      disabled={toggleActive.isPending}
                      title={property.isActive ? 'إيقاف' : 'تفعيل'}
                    >
                      {property.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProperty.mutate(property.id)}
                      disabled={deleteProperty.isPending}
                      className="text-destructive hover:text-destructive"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Statistics */}
        {activeTab === 'stats' && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">الإحصائيات المفصلة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Operation Type Stats */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-lg mb-4">توزيع نوع العملية</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">بيع</span>
                    <span className="text-sm font-bold text-primary">{saleProperties}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (saleProperties / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">إيجار</span>
                    <span className="text-sm font-bold text-accent">{rentProperties}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (rentProperties / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Type Stats */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-lg mb-4">توزيع نوع العقار</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">فيلا</span>
                    <span className="text-sm font-bold">{villaCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (villaCount / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">شقة</span>
                    <span className="text-sm font-bold">{apartmentCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (apartmentCount / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">أرض</span>
                    <span className="text-sm font-bold">{landCount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (landCount / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Stats */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-lg mb-4">حالة الإعلانات</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">مفعلة</span>
                    <span className="text-sm font-bold text-green-600">{activeProperties}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (activeProperties / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">معطلة</span>
                    <span className="text-sm font-bold text-red-600">{inactiveProperties}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${totalProperties > 0 ? (inactiveProperties / totalProperties) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="card-elevated p-6">
              <h3 className="font-bold text-lg mb-4">ملخص سريع</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>متوسط السعر</span>
                  <span className="font-bold">
                    {properties && properties.length > 0
                      ? Math.round(
                          properties.reduce((sum, p) => sum + parseFloat(p.price), 0) / properties.length
                        ).toLocaleString()
                      : 0} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>أعلى سعر</span>
                  <span className="font-bold">
                    {properties && properties.length > 0
                      ? Math.max(...properties.map(p => parseFloat(p.price))).toLocaleString()
                      : 0} ج.م
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>أقل سعر</span>
                  <span className="font-bold">
                    {properties && properties.length > 0
                      ? Math.min(...properties.map(p => parseFloat(p.price))).toLocaleString()
                      : 0} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
