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

// المناطق الحقيقية لرأس البر
const areas: Area[] = [
  {
    id: "kings-area",
    name: "منطقة الملوك 👑",
    desc: "من مسجد الرحمة للسان - أغلى منطقة في رأس البر بعقارات فاخرة جداً",
    x: 85,
    y: 15,
    properties: 156,
    type: "luxury"
  },
  {
    id: "mercy-mosque",
    name: "المنطقة من شارع 51 لمسجد الرحمة",
    desc: "منطقة سكنية راقية مع عقارات متميزة",
    x: 75,
    y: 25,
    properties: 134,
    type: "residential"
  },
  {
    id: "street-51",
    name: "المنطقة من شارع 109 لشارع 51",
    desc: "منطقة سكنية متوسطة الفخامة مع خدمات جيدة",
    x: 60,
    y: 40,
    properties: 189,
    type: "residential"
  },
  {
    id: "urban-expansion",
    name: "منطقة الإمتداد العمراني",
    desc: "منطقة جديدة قيد التطوير مع مشاريع عمرانية حديثة",
    x: 50,
    y: 55,
    properties: 267,
    type: "residential"
  },
  {
    id: "al-assi",
    name: "منطقة العاصي",
    desc: "من البوابة لكنتاكي - منطقة تجارية وسكنية نشطة",
    x: 35,
    y: 65,
    properties: 198,
    type: "commercial"
  },
  {
    id: "consultants",
    name: "منطقة المستشارين",
    desc: "منطقة سكنية هادئة بعيدة عن الازدحام",
    x: 20,
    y: 50,
    properties: 112,
    type: "residential"
  },
  {
    id: "beach",
    name: "الشاطئ الرئيسي",
    desc: "الواجهة البحرية الساحرة مع فنادق ومطاعم",
    x: 50,
    y: 10,
    properties: 89,
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
  beach: "🌊 شاطئي",
  residential: "🏠 سكني",
  commercial: "🏪 تجاري",
  luxury: "👑 فاخر"
};

export default function Map() {
  const [, setLocation] = useLocation();
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);

  const handleAreaClick = (area: Area) => {
    setSelectedArea(area);
  };

  const handleSearchByArea = (areaName: string) => {
    setLocation(`/properties?location=${encodeURIComponent(areaName)}`);
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

      <div className="container px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">خريطة مناطق رأس البر</h1>
          <p className="text-gray-300 text-lg">اختر منطقة لاستكشاف العقارات المتاحة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl p-6 border border-yellow-500/20">
              <div className="relative w-full aspect-square md:aspect-[4/3] bg-gradient-to-br from-blue-900/30 to-slate-800 rounded-xl overflow-hidden border-2 border-yellow-500/30">
                {/* Map Background - Simplified representation */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    {/* Sea */}
                    <rect width="100" height="100" fill="#1e3a5f" opacity="0.3" />
                    {/* Coastline */}
                    <path d="M 100 0 L 100 100 L 95 100 L 95 0" stroke="#fbbf24" strokeWidth="2" fill="none" />
                    {/* Grid */}
                    <g stroke="#fbbf24" strokeWidth="0.5" opacity="0.2">
                      <line x1="0" y1="25" x2="100" y2="25" />
                      <line x1="0" y1="50" x2="100" y2="50" />
                      <line x1="0" y1="75" x2="100" y2="75" />
                      <line x1="25" y1="0" x2="25" y2="100" />
                      <line x1="50" y1="0" x2="50" y2="100" />
                      <line x1="75" y1="0" x2="75" y2="100" />
                    </g>
                  </svg>
                </div>

                {/* Area Markers */}
                <div className="absolute inset-0">
                  {areas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => handleAreaClick(area)}
                      className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs cursor-pointer transition-all transform hover:scale-125 ${typeColors[area.type]} hover:shadow-lg shadow-md`}
                      style={{
                        left: `${area.x}%`,
                        top: `${area.y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                      title={area.name}
                    >
                      {area.properties}
                    </button>
                  ))}
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 rounded-lg p-3 backdrop-blur-sm border border-yellow-500/30">
                  <p className="text-xs font-bold text-yellow-400 mb-2">المناطق:</p>
                  <div className="space-y-1 text-xs">
                    {Object.entries(typeLabels).map(([type, label]) => (
                      <div key={type} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${typeColors[type as keyof typeof typeColors]}`}></div>
                        <span className="text-gray-300">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Info */}
              <div className="mt-6 bg-slate-600/30 rounded-lg p-4 border border-yellow-500/20">
                <p className="text-sm text-gray-300">
                  💡 <strong>تلميح:</strong> انقر على أي منطقة في الخريطة لعرض التفاصيل والعقارات المتاحة
                </p>
              </div>
            </div>
          </div>

          {/* Areas List & Details */}
          <div className="space-y-4">
            {/* Selected Area Details */}
            {selectedArea && (
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-6 border-2 border-yellow-500/50 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-300 mb-2">{selectedArea.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{selectedArea.desc}</p>
                  </div>
                  <button
                    onClick={() => setSelectedArea(null)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-yellow-500/30">
                  <div>
                    <p className="text-gray-400 text-xs">النوع</p>
                    <p className="text-yellow-300 font-bold">{typeLabels[selectedArea.type]}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">عدد العقارات</p>
                    <p className="text-yellow-300 font-bold">{selectedArea.properties}</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleSearchByArea(selectedArea.name)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold py-2 rounded-lg shadow-lg"
                >
                  <MapPin className="w-4 h-4 ml-2" />
                  البحث عن العقارات
                </Button>
              </div>
            )}

            {/* All Areas List */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-yellow-500/20">
              <h3 className="text-lg font-bold text-yellow-300 mb-4">جميع المناطق</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => handleAreaClick(area)}
                    className={`w-full text-right p-3 rounded-lg border-2 transition-all ${
                      selectedArea?.id === area.id
                        ? "border-yellow-500 bg-yellow-500/20"
                        : "border-yellow-500/30 bg-slate-600/30 hover:bg-slate-600/50 hover:border-yellow-500/50"
                    }`}
                  >
                    <p className="font-bold text-yellow-300 text-sm">{area.name}</p>
                    <p className="text-gray-400 text-xs mt-1">{area.properties} عقار</p>
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
