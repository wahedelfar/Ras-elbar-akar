import { useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Waves, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Area {
  id: string;
  name: string;
  desc: string;
  x: number;
  y: number;
  properties: number;
  type: "beach" | "residential" | "commercial" | "luxury";
}

const areas: Area[] = [
  {
    id: "main-beach",
    name: "الشاطئ الرئيسي",
    desc: "المنطقة الأكثر حيوية مع فنادق ومطاعم عالمية",
    x: 50,
    y: 30,
    properties: 245,
    type: "beach"
  },
  {
    id: "tourism",
    name: "حي السياحة",
    desc: "منطقة سكنية هادئة قريبة من الشاطئ",
    x: 60,
    y: 50,
    properties: 189,
    type: "residential"
  },
  {
    id: "commercial",
    name: "المنطقة التجارية",
    desc: "مركز تجاري حديث مع متاجر وخدمات",
    x: 40,
    y: 55,
    properties: 156,
    type: "commercial"
  },
  {
    id: "villas",
    name: "حي الفيلات",
    desc: "منطقة فاخرة للعقارات السكنية الراقية",
    x: 70,
    y: 70,
    properties: 98,
    type: "luxury"
  },
  {
    id: "east",
    name: "المنطقة الشرقية",
    desc: "منطقة سكنية جديدة قيد التطوير",
    x: 75,
    y: 40,
    properties: 142,
    type: "residential"
  },
  {
    id: "harbor",
    name: "حي الميناء",
    desc: "منطقة تاريخية مع إطلالات بحرية خلابة",
    x: 30,
    y: 35,
    properties: 87,
    type: "beach"
  }
];

const typeColors = {
  beach: "bg-blue-500",
  residential: "bg-green-500",
  commercial: "bg-orange-500",
  luxury: "bg-purple-500"
};

const typeLabels = {
  beach: "شاطئي",
  residential: "سكني",
  commercial: "تجاري",
  luxury: "فاخر"
};

export default function Map() {
  const [, setLocation] = useLocation();
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleAreaClick = (area: Area) => {
    setSelectedArea(area);
  };

  const handleSearch = (area: Area) => {
    setLocation(`/properties?location=${encodeURIComponent(area.name)}`);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            ← العودة
          </Button>
          <h1 className="font-bold text-xl flex items-center gap-2">
            <Waves className="w-6 h-6" />
            خريطة مناطق رأس البر
          </h1>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl overflow-hidden shadow-lg relative" style={{ aspectRatio: "16/10" }}>
              {/* SVG Background */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Water effect */}
                <defs>
                  <pattern id="water" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="rgba(59, 130, 246, 0.1)" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#water)" />
                
                {/* Coastline */}
                <path d="M 0 20 Q 25 15 50 25 T 100 20 L 100 0 L 0 0 Z" fill="rgba(59, 130, 246, 0.2)" />
                
                {/* Grid */}
                <g stroke="rgba(59, 130, 246, 0.1)" strokeWidth="0.5">
                  {[...Array(10)].map((_, i) => (
                    <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} />
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" />
                  ))}
                </g>
              </svg>

              {/* Areas Markers */}
              <div className="absolute inset-0">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaClick(area)}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                      selectedArea?.id === area.id ? "scale-125" : "scale-100"
                    }`}
                    style={{ left: `${area.x}%`, top: `${area.y}%` }}
                    title={area.name}
                  >
                    <div className={`${typeColors[area.type]} rounded-full p-3 shadow-lg hover:shadow-xl text-white font-bold text-sm flex items-center justify-center w-12 h-12 cursor-pointer`}>
                      <MapPin className="w-6 h-6" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="font-bold mb-4">وسيلة الإيضاح</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`${typeColors[type as keyof typeof typeColors]} w-4 h-4 rounded-full`}></div>
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Area Details */}
          <div className="lg:col-span-1">
            {selectedArea ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className={`${typeColors[selectedArea.type]} text-white p-6`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedArea.name}</h2>
                      <p className="text-sm opacity-90 mt-1">{typeLabels[selectedArea.type]}</p>
                    </div>
                    <button
                      onClick={() => setSelectedArea(null)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-600 mb-2">الوصف</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedArea.desc}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 text-sm">عدد العقارات</span>
                      <span className="font-bold text-2xl text-primary">{selectedArea.properties}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${typeColors[selectedArea.type]} h-2 rounded-full`}
                        style={{ width: `${(selectedArea.properties / 245) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-bold text-sm text-gray-600 mb-3">الميزات</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedArea.type === "beach" && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-500">🌊</span>
                            <span>إطلالات بحرية خلابة</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-yellow-500">☀️</span>
                            <span>شواطئ رملية ذهبية</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">🏖️</span>
                            <span>أنشطة سياحية متنوعة</span>
                          </li>
                        </>
                      )}
                      {selectedArea.type === "residential" && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-green-500">🏠</span>
                            <span>منطقة سكنية هادئة</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-500">🌳</span>
                            <span>مساحات خضراء</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-500">👨‍👩‍👧‍👦</span>
                            <span>مناسبة للعائلات</span>
                          </li>
                        </>
                      )}
                      {selectedArea.type === "commercial" && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-orange-500">🏪</span>
                            <span>متاجر وخدمات</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-red-500">🍽️</span>
                            <span>مطاعم وكافيهات</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-500">🚗</span>
                            <span>مواقف سيارات</span>
                          </li>
                        </>
                      )}
                      {selectedArea.type === "luxury" && (
                        <>
                          <li className="flex items-center gap-2">
                            <span className="text-purple-500">👑</span>
                            <span>عقارات فاخرة</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-gold-500">✨</span>
                            <span>خدمات عالية الجودة</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-blue-500">🏊</span>
                            <span>مرافق حصرية</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleSearch(selectedArea)}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg"
                  >
                    ابحث عن عقارات في {selectedArea.name}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center sticky top-24">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 font-medium mb-2">اختر منطقة على الخريطة</p>
                <p className="text-gray-500 text-sm">
                  انقر على أي منطقة لعرض التفاصيل والعقارات المتاحة
                </p>
              </div>
            )}

            {/* All Areas List */}
            <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold">جميع المناطق</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaClick(area)}
                    className={`w-full text-right px-6 py-3 hover:bg-gray-50 transition-colors ${
                      selectedArea?.id === area.id ? "bg-blue-50 border-r-4 border-primary" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{area.name}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{area.properties}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
