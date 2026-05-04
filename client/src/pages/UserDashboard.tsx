import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Waves, Plus, Edit2, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function UserDashboard() {
  const { isAuthenticated, user } = useAuth();
  const { data: properties, isLoading } = trpc.properties.myProperties.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const toggleActive = trpc.properties.toggleActive.useMutation();
  const deleteProperty = trpc.properties.delete.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background" dir="rtl">
        <Waves className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-2xl font-bold mb-2">يجب تسجيل الدخول أولاً</h1>
        <a href={getLoginUrl()}>
          <Button>تسجيل الدخول</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-foreground">مرحباً، {user?.name}</span>
            <a href="/add-property">
              <Button size="sm" className="bg-accent hover:bg-accent/90">
                <Plus className="w-4 h-4 ml-2" />
                إعلان جديد
              </Button>
            </a>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">لوحة التحكم</h1>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="card-elevated p-12 text-center">
            <Waves className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-2">لا توجد إعلانات</h2>
            <p className="text-muted-foreground mb-6">لم تضف أي إعلانات عقارية بعد</p>
            <a href="/add-property">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 ml-2" />
                إضافة إعلان
              </Button>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="card-elevated p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{property.description}</p>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">النوع</p>
                        <p className="font-semibold capitalize">{property.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">السعر</p>
                        <p className="font-semibold">{property.price} ريال</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">الموقع</p>
                        <p className="font-semibold">{property.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">الحالة</p>
                        <p className={`font-semibold ${property.isActive ? 'text-green-600' : 'text-red-600'}`}>
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
                    >
                      {property.isActive ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <a href={`/property/${property.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
