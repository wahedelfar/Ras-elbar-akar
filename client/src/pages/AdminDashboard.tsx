import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Waves, Trash2, Eye, EyeOff, Loader2, Users, Building2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">إجمالي الإعلانات</p>
                <p className="text-4xl font-bold text-primary">{totalProperties}</p>
              </div>
              <Building2 className="w-12 h-12 text-primary/20" />
            </div>
          </div>
          <div className="card-elevated p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">الإعلانات المفعلة</p>
                <p className="text-4xl font-bold text-accent">{activeProperties}</p>
              </div>
              <Eye className="w-12 h-12 text-accent/20" />
            </div>
          </div>
        </div>

        {/* Properties Management */}
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
                <div key={property.id} className="card-elevated p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleActive.mutate(property.id)}
                      disabled={toggleActive.isPending}
                    >
                      {property.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteProperty.mutate(property.id)}
                      disabled={deleteProperty.isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
