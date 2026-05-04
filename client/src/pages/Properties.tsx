import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home as HomeIcon, Waves, ChevronLeft, ChevronRight } from "lucide-react";

export default function Properties() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  const [type, setType] = useState(searchParams.get("type") || "");
  const [operationType, setOperationType] = useState(searchParams.get("operationType") || "");
  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const { data: properties, isLoading } = trpc.properties.list.useQuery({
    type: type || undefined,
    operationType: operationType as "sale" | "rent" | undefined,
    location: searchLocation || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  });

  const itemsPerPage = 12;
  const sortedProperties = properties ? [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-desc":
        return parseFloat(b.price) - parseFloat(a.price);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

  const paginatedProperties = sortedProperties.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="container flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-2 text-primary hover:text-primary/80">
            <Waves className="w-8 h-8" />
            <span className="font-bold text-xl">عقارات رأس البر</span>
          </a>
          <a href="/">
            <Button variant="outline">العودة للرئيسية</Button>
          </a>
        </div>
      </header>

      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-8">البحث عن العقارات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="card-elevated p-6 space-y-6 sticky top-24">
              <h3 className="font-bold text-lg">الفلاتر</h3>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-2">الموقع</label>
                <Input
                  placeholder="ابحث عن موقع"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  dir="rtl"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">نوع العقار</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">الكل</SelectItem>
                    <SelectItem value="apartment">شقة</SelectItem>
                    <SelectItem value="villa">فيلا</SelectItem>
                    <SelectItem value="house">منزل</SelectItem>
                    <SelectItem value="land">أرض</SelectItem>
                    <SelectItem value="commercial">تجاري</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Operation Type */}
              <div>
                <label className="block text-sm font-semibold mb-2">نوع العملية</label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">الكل</SelectItem>
                    <SelectItem value="sale">بيع</SelectItem>
                    <SelectItem value="rent">إيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-2">نطاق السعر</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="السعر الأدنى"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="السعر الأعلى"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2">الترتيب</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">الأحدث</SelectItem>
                    <SelectItem value="price-asc">السعر: الأقل أولاً</SelectItem>
                    <SelectItem value="price-desc">السعر: الأعلى أولاً</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={() => {
                  setType("");
                  setOperationType("");
                  setSearchLocation("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
                variant="outline"
                className="w-full"
              >
                مسح الفلاتر
              </Button>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-muted rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            ) : paginatedProperties.length === 0 ? (
              <div className="text-center py-12 card-elevated">
                <HomeIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg text-muted-foreground">لا توجد عقارات تطابق معايير البحث</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    عدد النتائج: <span className="font-bold">{sortedProperties.length}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedProperties.map((property) => (
                    <a key={property.id} href={`/property/${property.id}`} className="group">
                      <div className="card-elevated overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow">
                        <div className="bg-gradient-coastal h-48 flex items-center justify-center text-white relative overflow-hidden">
                          <HomeIcon className="w-12 h-12 opacity-30" />
                          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {property.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {property.description}
                          </p>
                          <div className="space-y-3 border-t border-border pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-primary font-bold text-lg">{property.price} ريال</span>
                              {property.area && (
                                <span className="text-sm text-muted-foreground">{property.area} م²</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">{property.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
