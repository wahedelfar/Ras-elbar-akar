import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Home as HomeIcon, Waves, ChevronLeft, ChevronRight } from "lucide-react";

export default function Properties() {
  const [, setLocation] = useLocation();
  const [type, setType] = useState("");
  const [operationType, setOperationType] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);

  const { data: properties = [], isLoading } = trpc.properties.list.useQuery({
    type: type && type !== "all" ? type : undefined,
    operationType: (operationType && operationType !== "all" ? operationType : undefined) as "sale" | "rent" | undefined,
    location: searchLocation || undefined,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
  });

  const itemsPerPage = 12;
  const sortedProperties = properties ? [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return parseFloat(a.price.toString()) - parseFloat(b.price.toString());
      case "price-desc":
        return parseFloat(b.price.toString()) - parseFloat(a.price.toString());
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) : [];

  const paginatedProperties = sortedProperties.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(sortedProperties.length / itemsPerPage);

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
          <button onClick={() => setLocation("/")} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold rounded-lg transition-all">
            العودة للرئيسية
          </button>
        </div>
      </header>

      <div className="container px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">البحث عن العقارات</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-yellow-500/20 p-6 space-y-6 sticky top-24 rounded-lg">
              <h3 className="font-bold text-lg text-white">الفلاتر</h3>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">الموقع</label>
                <Input
                  placeholder="ابحث عن موقع"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  dir="rtl"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">نوع العقار</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
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
                <label className="block text-sm font-semibold mb-2 text-gray-300">نوع العملية</label>
                <Select value={operationType} onValueChange={setOperationType}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="sale">بيع</SelectItem>
                    <SelectItem value="rent">إيجار</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">نطاق السعر</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    placeholder="السعر الأدنى"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  <Input
                    type="number"
                    placeholder="السعر الأعلى"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">الترتيب</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
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
                  setPage(1);
                }}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold"
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
                  <div key={i} className="bg-slate-700 rounded-lg h-96 animate-pulse"></div>
                ))}
              </div>
            ) : paginatedProperties.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 border border-yellow-500/20 rounded-lg">
                <HomeIcon className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
                <p className="text-lg text-gray-300">لا توجد عقارات تطابق معايير البحث</p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-gray-300">
                    عدد النتائج: <span className="font-bold text-yellow-400">{sortedProperties.length}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {paginatedProperties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => setLocation(`/property/${property.id}`)}
                      className="group text-left hover:opacity-90 transition-opacity"
                    >
                      <div className="bg-slate-800 border border-yellow-500/20 overflow-hidden h-full flex flex-col rounded-lg hover:shadow-2xl transition-shadow hover:border-yellow-500/50">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-48 flex items-center justify-center text-white relative overflow-hidden">
                          {(property as any).images && (property as any).images.length > 0 ? (
                            <img
                              src={(property as any).images[0].imageUrl}
                              alt={property.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <HomeIcon className="w-12 h-12 opacity-30" />
                          )}
                          <div className="absolute top-3 right-3 bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.operationType === 'sale' ? 'بيع' : 'إيجار'}
                          </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h4 className="font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors line-clamp-2 text-white">
                            {property.title}
                          </h4>
                          <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">
                            {property.description}
                          </p>
                          <div className="space-y-3 border-t border-slate-700 pt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-yellow-400 font-bold text-lg">{property.price.toLocaleString()} ج.م</span>
                              {property.area && (
                                <span className="text-sm text-gray-400">{property.area} م²</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">{property.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
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
                      className="bg-slate-800 border-yellow-500/20 text-white hover:bg-slate-700"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className={page === p ? "bg-yellow-500 text-slate-900" : "bg-slate-800 border-yellow-500/20 text-white hover:bg-slate-700"}
                      >
                        {p}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="bg-slate-800 border-yellow-500/20 text-white hover:bg-slate-700"
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
