import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { MapPin, Waves, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/Map";

export default function MapPage() {
  const [, setLocation] = useLocation();
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const areas = [
    { id: "kings-area", name: "منطقة الملوك 👑", lat: 31.4950, lng: 31.8250, properties: 156 },
    { id: "mercy-mosque", name: "المنطقة من شارع 51 لمسجد الرحمة", lat: 31.4930, lng: 31.8230, properties: 134 },
    { id: "street-51", name: "المنطقة من شارع 109 لشارع 51", lat: 31.4910, lng: 31.8210, properties: 189 },
    { id: "urban-expansion", name: "منطقة الإمتداد العمراني", lat: 31.4890, lng: 31.8190, properties: 112 },
    { id: "elassi", name: "منطقة العاصي (من البوابة لكنتاكي)", lat: 31.4870, lng: 31.8170, properties: 98 },
    { id: "advisors", name: "منطقة المستشارين", lat: 31.4850, lng: 31.8150, properties: 76 },
    { id: "beach", name: "الشاطئ الرئيسي", lat: 31.4830, lng: 31.8130, properties: 45 },
  ];

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    
    // إضافة علامات للمناطق
    const newMarkers = areas.map((area) => {
      const marker = new google.maps.Marker({
        position: { lat: area.lat, lng: area.lng },
        map: mapInstance,
        title: area.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
      });

      marker.addListener("click", () => {
        setSelectedArea(area.id);
      });

      return marker;
    });

    setMarkers(newMarkers);
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
          <button onClick={() => setLocation("/")} className="text-gray-300 hover:text-yellow-400 transition-colors">
            ✕
          </button>
        </div>
      </header>

      <div className="container px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-white">خريطة مناطق رأس البر</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* خريطة جوجل */}
          <div className="lg:col-span-3">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-yellow-500/20 h-96">
            <MapView
              initialCenter={{ lat: 31.4918, lng: 31.8166 }}
              initialZoom={14}
              onMapReady={handleMapReady}
            />
            </div>
          </div>

          {/* قائمة المناطق */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">المناطق</h2>
            {areas.map((area) => (
              <button
                key={area.id}
                onClick={() => {
                  setSelectedArea(area.id);
                  if (map) {
                    map.panTo({ lat: area.lat, lng: area.lng });
                    map.setZoom(16);
                  }
                }}
                className={`w-full p-3 rounded-lg text-right transition-all ${
                  selectedArea === area.id
                    ? "bg-yellow-500 text-slate-900 shadow-lg"
                    : "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-yellow-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{area.name}</span>
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-xs mt-1 opacity-75">{area.properties} عقار</p>
              </button>
            ))}
          </div>
        </div>

        {/* تفاصيل المنطقة المختارة */}
        {selectedArea && (
          <div className="mt-8 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 border border-yellow-500/20 shadow-xl">
            {(() => {
              const area = areas.find((a) => a.id === selectedArea);
              return area ? (
                <div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-3">{area.name}</h3>
                  <p className="text-gray-300 mb-4">
                    عدد العقارات المتاحة: <span className="text-yellow-400 font-bold">{area.properties}</span>
                  </p>
                  <Button
                    onClick={() => setLocation(`/properties?location=${encodeURIComponent(area.name)}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold"
                  >
                    عرض العقارات في هذه المنطقة
                  </Button>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
