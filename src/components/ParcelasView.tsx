import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers, 
  Compass, 
  Check, 
  X, 
  Sprout, 
  Building2, 
  Navigation,
  Table,
  CheckCircle2,
  AlertTriangle,
  DoorOpen
} from 'lucide-react';
import L from 'leaflet';
import { Parcela, LugarPredio } from '../types/campo';

interface ParcelasViewProps {
  parcelas: Parcela[];
  lugares: LugarPredio[];
  onAddParcela: (parcela: Parcela) => void;
  onUpdateParcela: (parcela: Parcela) => void;
  onDeleteParcela: (id: string) => void;
  onAddLugar: (lugar: LugarPredio) => void;
  onDeleteLugar: (id: string) => void;
  onRegisterLaborForParcela: (parcelaId: string) => void;
}

export const ParcelasView: React.FC<ParcelasViewProps> = ({
  parcelas,
  lugares,
  onAddParcela,
  onUpdateParcela,
  onDeleteParcela,
  onAddLugar,
  onDeleteLugar,
  onRegisterLaborForParcela
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mapa' | 'cuarteles_lista' | 'lugares_lista'>('mapa');
  const [mapLayer, setMapLayer] = useState<'google_hybrid' | 'esri_sat' | 'osm'>('google_hybrid');
  const [showCuarteles, setShowCuarteles] = useState(true);
  const [showLugares, setShowLugares] = useState(true);

  // Modales
  const [isParcelaModalOpen, setIsParcelaModalOpen] = useState(false);
  const [editingParcela, setEditingParcela] = useState<Parcela | null>(null);
  const [pNombre, setPNombre] = useState('');
  const [pCodigoLote, setPCodigoLote] = useState('');
  const [pSuperficieHa, setPSuperficieHa] = useState<number | ''>(4.0);
  const [pVariedad, setPVariedad] = useState('Hayward (Verde)');
  const [pMarco, setPMarco] = useState('4.5m x 4.0m (555 pl/ha)');
  const [pSistemaConduccion, setPSistemaConduccion] = useState<'Parrón Español / Pérgola' | 'Espaldera en T / Doble T'>('Parrón Español / Pérgola');
  const [pRiego, setPRiego] = useState<'Goteo automatizado' | 'Microaspersión' | 'Aspersión cobertura total' | 'Surco / Gravedad'>('Goteo automatizado');
  const [pTipoSuelo, setPTipoSuelo] = useState('Franco profundo');
  const [pAno, setPAno] = useState(2020);
  const [pEstado, setPEstado] = useState<'Floración' | 'En crecimiento' | 'Cuaje / Maduración' | 'Cosecha activa' | 'Receso invernal'>('Floración');
  const [pLat, setPLat] = useState<number>(-35.9820);
  const [pLng, setPLng] = useState<number>(-71.2405);
  const [formError, setFormError] = useState('');

  const [isLugarModalOpen, setIsLugarModalOpen] = useState(false);
  const [editingLugar, setEditingLugar] = useState<LugarPredio | null>(null);
  const [lNombre, setLNombre] = useState('');
  const [lTipo, setLTipo] = useState<LugarPredio['tipo']>('entrada_principal');
  const [lDescripcion, setLDescripcion] = useState('');
  const [lLat, setLLat] = useState<number>(-35.9800);
  const [lLng, setLLng] = useState<number>(-71.2435);

  const [parcelaToDelete, setParcelaToDelete] = useState<Parcela | null>(null);
  const [lugarToDelete, setLugarToDelete] = useState<LugarPredio | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Calcula automáticamente el centro según los cuarteles que existan
  const getInitialCenter = (): [number, number] => {
    const validParcelas = parcelas.filter(p => p.latitud && p.longitud);
    if (validParcelas.length > 0) {
      const avgLat = validParcelas.reduce((acc, p) => acc + p.latitud, 0) / validParcelas.length;
      const avgLng = validParcelas.reduce((acc, p) => acc + p.longitud, 0) / validParcelas.length;
      return [avgLat, avgLng];
    }
    const validLugares = lugares.filter(l => l.latitud && l.longitud);
    if (validLugares.length > 0) {
      return [validLugares[0].latitud, validLugares[0].longitud];
    }
    return [-35.9820, -71.2405];
  };

  // Centrar el mapa con el GPS real del teléfono o computador
  const handleCenterOnUserGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu dispositivo no soporta geolocalización.');
      return;
    }
    showToast('Obteniendo tu ubicación satelital...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([userLat, userLng], 17);
        }
        showToast('📍 Mapa enfocado en tu ubicación actual');
      },
      (err) => {
        alert('No se pudo obtener la ubicación: ' + err.message);
      },
      { enableHighAccuracy: true }
    );
  };

  // Inicializar mapa de Leaflet
  useEffect(() => {
    if (activeSubTab !== 'mapa') return;
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const startCenter = getInitialCenter();
      const map = L.map(mapContainerRef.current, {
        center: startCenter,
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      leafletMapRef.current = map;
      markersLayerGroupRef.current = L.layerGroup().addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        setPLat(Number(e.latlng.lat.toFixed(6)));
        setPLng(Number(e.latlng.lng.toFixed(6)));
        setLLat(Number(e.latlng.lat.toFixed(6)));
        setLLng(Number(e.latlng.lng.toFixed(6)));
      });
    }

    const map = leafletMapRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let maxZoom = 20;

    if (mapLayer === 'google_hybrid') {
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      maxZoom = 21;
    } else if (mapLayer === 'esri_sat') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 19;
    } else {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Pintar cuarteles y lugares
    if (markersLayerGroupRef.current) {
      markersLayerGroupRef.current.clearLayers();

      if (showCuarteles) {
        parcelas.forEach((p) => {
          if (!p.latitud || !p.longitud) return;
          const radiusMeters = Math.max(45, Math.sqrt((p.superficieHa || 1) * 10000 / Math.PI) * 0.85);

          const circle = L.circle([p.latitud, p.longitud], {
            radius: radiusMeters,
            color: '#10b981',
            fillColor: '#059669',
            fillOpacity: 0.35,
            weight: 2
          });

          const pinHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background-color: #064e3b; color: white; border: 2px solid #34d399; border-radius: 9999px; padding: 4px 8px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px;">
                <span>🥝 ${p.codigoLote || p.nombre}</span>
                <span style="background: rgba(255,255,255,0.25); border-radius: 4px; padding: 1px 4px; font-size: 10px;">${p.superficieHa} ha</span>
              </div>
              <div style="width: 2px; height: 10px; background-color: #34d399;"></div>
            </div>
          `;

          const pinIcon = L.divIcon({
            className: 'custom-cuartel-pin',
            html: pinHtml,
            iconSize: [120, 42],
            iconAnchor: [60, 42]
          });

          const marker = L.marker([p.latitud, p.longitud], { icon: pinIcon });

          const popupContent = document.createElement('div');
          popupContent.className = 'text-xs p-1 space-y-2';
          popupContent.innerHTML = `
            <div style="font-weight: bold; font-size: 13px; color: #064e3b; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">
              ${p.nombre}
            </div>
            <div style="font-size: 11px; color: #374151; line-height: 1.4;">
              <div><strong>Cultivo:</strong> Kiwi ${p.variedad} (${p.superficieHa} ha)</div>
              <div><strong>Conducción:</strong> ${p.sistemaConduccion || 'Parrón Español'}</div>
              <div><strong>Riego:</strong> ${p.sistemaRiego}</div>
              <div style="font-family: monospace; font-size: 10px; color: #6b7280; margin-top: 4px;">GPS: ${p.latitud.toFixed(5)}, ${p.longitud.toFixed(5)}</div>
            </div>
            <div style="display: flex; gap: 6px; margin-top: 8px;">
              <button id="btn-edit-${p.id}" style="background-color: #065f46; color: white; padding: 4px 8px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 11px;">
                ✏️ Editar
              </button>
              <button id="btn-labor-${p.id}" style="background-color: #d97706; color: white; padding: 4px 8px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 11px;">
                ➕ Labor
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          circle.bindPopup(popupContent);

          marker.on('popupopen', () => {
            const editBtn = document.getElementById(`btn-edit-${p.id}`);
            const laborBtn = document.getElementById(`btn-labor-${p.id}`);
            if (editBtn) editBtn.onclick = () => openEditParcelaModal(p);
            if (laborBtn) laborBtn.onclick = () => onRegisterLaborForParcela(p.id);
          });

          markersLayerGroupRef.current?.addLayer(circle);
          markersLayerGroupRef.current?.addLayer(marker);
        });
      }

      if (showLugares) {
        lugares.forEach((lug) => {
          if (!lug.latitud || !lug.longitud) return;
          const iconEmoji = lug.tipo === 'entrada_principal' ? '🚪' : lug.tipo === 'pozo' ? '💧' : '📍';
          const bgColor = lug.tipo === 'entrada_principal' ? '#b45309' : lug.tipo === 'pozo' ? '#0369a1' : '#475569';

          const lugarHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background-color: ${bgColor}; color: white; border: 2px solid white; border-radius: 9999px; padding: 4px 7px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">
                <span>${iconEmoji} ${lug.nombre}</span>
              </div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'custom-lugar-pin',
            html: lugarHtml,
            iconSize: [140, 36],
            iconAnchor: [70, 36]
          });

          const marker = L.marker([lug.latitud, lug.longitud], { icon });
          markersLayerGroupRef.current?.addLayer(marker);
        });
      }
    }

    // Centrado inteligente en los cuarteles del usuario
    const validPoints = parcelas.filter(p => p.latitud && p.longitud).map(p => [p.latitud, p.longitud] as [number, number]);
    if (validPoints.length > 0) {
      const bounds = L.latLngBounds(validPoints);
      map.fitBounds(bounds, { maxZoom: 17, padding: [50, 50] });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

  }, [activeSubTab, mapLayer, parcelas, lugares, showCuarteles, showLugares]);

  const totalHectareas = parcelas.reduce((acc, p) => acc + p.superficieHa, 0).toFixed(1);

  // Al crear un nuevo cuartel, toma el centro donde está puesto el mapa
  const openNewParcelaModal = () => {
    const center = leafletMapRef.current ? leafletMapRef.current.getCenter() : { lat: -35.9825, lng: -71.2410 };
    setEditingParcela(null);
    setPNombre(`Cuartel ${parcelas.length + 1} - Kiwi Hayward`);
    setPCodigoLote(`K-0${parcelas.length + 1}-HAY`);
    setPSuperficieHa(4.0);
    setPVariedad('Hayward (Verde)');
    setPMarco('4.5m x 4.0m (555 pl/ha)');
    setPSistemaConduccion('Parrón Español / Pérgola');
    setPRiego('Goteo automatizado');
    setPTipoSuelo('Franco profundo');
    setPAno(2020);
    setPEstado('Floración');
    setPLat(Number(center.lat.toFixed(6)));
    setPLng(Number(center.lng.toFixed(6)));
    setFormError('');
    setIsParcelaModalOpen(true);
  };

  const openEditParcelaModal = (p: Parcela) => {
    setEditingParcela(p);
    setPNombre(p.nombre);
    setPCodigoLote(p.codigoLote);
    setPSuperficieHa(p.superficieHa);
    setPVariedad(p.variedad);
    setPMarco(p.marcoPlantacion);
    setPSistemaConduccion(p.sistemaConduccion || 'Parrón Español / Pérgola');
    setPRiego(p.sistemaRiego as any);
    setPTipoSuelo(p.tipoSuelo);
    setPAno(p.anoPlantacion);
    setPEstado(p.estadoActual as any);
    setPLat(p.latitud);
    setPLng(p.longitud);
    setFormError('');
    setIsParcelaModalOpen(true);
  };

  const handleSaveParcela = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNombre.trim()) {
      setFormError('Por favor ingrese el nombre del cuartel.');
      return;
    }

    if (editingParcela) {
      const updated: Parcela = {
        ...editingParcela,
        nombre: pNombre.trim(),
        codigoLote: pCodigoLote.trim() || editingParcela.codigoLote,
        superficieHa: Number(pSuperficieHa) || 1,
        cultivo: 'Kiwi',
        variedad: 'Hayward (Verde)',
        marcoPlantacion: pMarco.trim(),
        sistemaConduccion: pSistemaConduccion,
        sistemaRiego: pRiego,
        tipoSuelo: pTipoSuelo.trim(),
        anoPlantacion: Number(pAno),
        estadoActual: pEstado,
        latitud: Number(pLat),
        longitud: Number(pLng)
      };
      onUpdateParcela(updated);
      showToast(`¡Cuartel "${updated.nombre}" actualizado!`);
    } else {
      const nueva: Parcela = {
        id: `parc-${Date.now()}`,
        nombre: pNombre.trim(),
        codigoLote: pCodigoLote.trim() || `K-0${parcelas.length + 1}-HAY`,
        superficieHa: Number(pSuperficieHa) || 1,
        cultivo: 'Kiwi',
        variedad: 'Hayward (Verde)',
        marcoPlantacion: pMarco.trim(),
        sistemaConduccion: pSistemaConduccion,
        sistemaRiego: pRiego,
        tipoSuelo: pTipoSuelo.trim(),
        anoPlantacion: Number(pAno),
        estadoActual: pEstado,
        latitud: Number(pLat),
        longitud: Number(pLng)
      };
      onAddParcela(nueva);
      showToast(`¡Nuevo cuartel agregado!`);
    }

    setIsParcelaModalOpen(false);
  };

  const openNewLugarModal = () => {
    const center = leafletMapRef.current ? leafletMapRef.current.getCenter() : { lat: -35.9800, lng: -71.2435 };
    setEditingLugar(null);
    setLNombre('');
    setLTipo('entrada_principal');
    setLDescripcion('');
    setLLat(Number(center.lat.toFixed(6)));
    setLLng(Number(center.lng.toFixed(6)));
    setIsLugarModalOpen(true);
  };

  const handleSaveLugar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lNombre.trim()) return;

    if (editingLugar) {
      onDeleteLugar(editingLugar.id);
      const updated: LugarPredio = {
        id: editingLugar.id,
        nombre: lNombre.trim(),
        tipo: lTipo,
        descripcion: lDescripcion.trim() || undefined,
        latitud: Number(lLat),
        longitud: Number(lLng)
      };
      onAddLugar(updated);
    } else {
      const nuevo: LugarPredio = {
        id: `lug-${Date.now()}`,
        nombre: lNombre.trim(),
        tipo: lTipo,
        descripcion: lDescripcion.trim() || undefined,
        latitud: Number(lLat),
        longitud: Number(lLng)
      };
      onAddLugar(nuevo);
    }

    setIsLugarModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            Cultivar Kiwi Hayward · Fundo La Cabaña
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Mapa Satelital & Gestión de Cuarteles
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Visualización georreferenciada de cuarteles. El mapa se ajusta automáticamente a las hectáreas reales de tu predio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={openNewParcelaModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cuartel
          </button>
          <button
            onClick={openNewLugarModal}
            className="px-3.5 py-2 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <DoorOpen className="w-4 h-4 text-amber-300" />
            + Entrada / Punto
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('mapa')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'mapa'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Mapa Satelital
        </button>

        <button
          onClick={() => setActiveSubTab('cuarteles_lista')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'cuarteles_lista'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Table className="w-4 h-4" />
          Lista de Cuarteles ({parcelas.length})
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100 font-mono">
            {totalHectareas} ha
          </span>
        </button>
      </div>

      {/* SUBTAB 1: MAPA */}
      {activeSubTab === 'mapa' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-700 flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-emerald-800" />
                Capa:
              </span>
              <button
                onClick={() => setMapLayer('google_hybrid')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  mapLayer === 'google_hybrid' ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🛰️ Google Satélite
              </button>
              <button
                onClick={() => setMapLayer('esri_sat')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  mapLayer === 'esri_sat' ? 'bg-emerald-900 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🌍 Esri Satélite
              </button>
            </div>

            {/* BOTÓN IR AL GPS REAL DEL USUARIO */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCenterOnUserGPS}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                title="Centrar el mapa donde estás parado con tu celular o computador"
              >
                <Navigation className="w-3.5 h-3.5" />
                📍 Ir a mi ubicación real (GPS)
              </button>

              <button
                onClick={() => {
                  const valid = parcelas.filter(p => p.latitud && p.longitud).map(p => [p.latitud, p.longitud] as [number, number]);
                  if (valid.length > 0 && leafletMapRef.current) {
                    leafletMapRef.current.fitBounds(L.latLngBounds(valid), { padding: [50, 50] });
                  } else {
                    handleCenterOnUserGPS();
                  }
                }}
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer"
                title="Centrar en mis cuarteles"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-stone-300 shadow-md">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            <div className="absolute bottom-4 left-4 z-20 bg-stone-900/90 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-[11px] space-y-1 shadow-xl max-w-xs">
              <span className="font-bold block text-emerald-300 text-xs border-b border-white/20 pb-1">
                Fundo La Cabaña · Huertos
              </span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shrink-0"></span>
                <span>Cuarteles de Kiwi ({totalHectareas} ha totales)</span>
              </div>
              <div className="text-[10px] text-stone-300 pt-1">
                💡 Haz clic en cualquier parte del mapa para marcar coordenadas al crear cuarteles.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: LISTA DE CUARTELES */}
      {activeSubTab === 'cuarteles_lista' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcelas.map((p) => (
              <div key={p.id} className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base text-stone-900">{p.nombre}</h3>
                    <span className="text-xs font-semibold text-emerald-800">
                      Kiwi {p.variedad} · {p.superficieHa} hectáreas
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditParcelaModal(p)}
                      className="p-1.5 text-stone-600 hover:text-emerald-900 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setParcelaToDelete(p)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                  <div><strong>Conducción:</strong> {p.sistemaConduccion || 'Parrón Español'}</div>
                  <div><strong>Riego:</strong> {p.sistemaRiego}</div>
                  <div className="col-span-2 font-mono text-[10px] text-stone-500">
                    GPS: {p.latitud?.toFixed(5)}, {p.longitud?.toFixed(5)}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => onRegisterLaborForParcela(p.id)}
                    className="px-3 py-1.5 bg-emerald-100 text-emerald-950 font-bold rounded-lg text-xs"
                  >
                    + Registrar Labor
                  </button>
                  <button
                    onClick={() => openEditParcelaModal(p)}
                    className="px-3 py-1.5 bg-stone-900 text-white font-bold rounded-lg text-xs"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CUARTEL */}
      {isParcelaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-stone-200 overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingParcela ? `Editar Cuartel: ${editingParcela.nombre}` : 'Nuevo Cuartel de Kiwi'}
              </h3>
              <button onClick={() => setIsParcelaModalOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParcela} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nombre Cuartel *</label>
                  <input
                    type="text"
                    required
                    value={pNombre}
                    onChange={(e) => setPNombre(e.target.value)}
                    placeholder="Ej: Cuartel 1 - Parrón Norte"
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Superficie (ha) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={pSuperficieHa}
                    onChange={(e) => setPSuperficieHa(parseFloat(e.target.value) || '')}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sistema de Conducción</label>
                  <select
                    value={pSistemaConduccion}
                    onChange={(e: any) => setPSistemaConduccion(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Parrón Español / Pérgola">Parrón Español / Pérgola</option>
                    <option value="Espaldera en T / Doble T">Espaldera en T / Doble T</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sistema de Riego</label>
                  <select
                    value={pRiego}
                    onChange={(e: any) => setPRiego(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                  >
                    <option value="Goteo automatizado">Goteo automatizado</option>
                    <option value="Microaspersión">Microaspersión</option>
                    <option value="Aspersión cobertura total">Aspersión cobertura total</option>
                    <option value="Surco / Gravedad">Surco / Gravedad</option>
                  </select>
                </div>
              </div>

              {/* COORDENADAS GPS AUTOMÁTICAS */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-900">Coordenadas del Cuartel (Latitud / Longitud)</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          setPLat(Number(pos.coords.latitude.toFixed(6)));
                          setPLng(Number(pos.coords.longitude.toFixed(6)));
                          showToast('Coordenadas fijadas desde tu GPS');
                        });
                      }
                    }}
                    className="text-emerald-800 font-bold text-[11px] hover:underline"
                  >
                    📍 Usar mi GPS ahora
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-500 text-[10px] uppercase font-bold">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={pLat}
                      onChange={(e) => setPLat(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-stone-300 font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-500 text-[10px] uppercase font-bold">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={pLng}
                      onChange={(e) => setPLng(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-stone-300 font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsParcelaModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Guardar Cuartel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR CUARTEL */}
      {parcelaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs text-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 p-5 space-y-3">
            <h3 className="font-bold text-sm text-stone-900">¿Deseas eliminar este cuartel?</h3>
            <p className="text-stone-600">Se eliminará permanentemente <strong>{parcelaToDelete.nombre}</strong>.</p>
            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button onClick={() => setParcelaToDelete(null)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button
                onClick={() => {
                  onDeleteParcela(parcelaToDelete.id);
                  setParcelaToDelete(null);
                }}
                className="px-4 py-2 bg-red-700 text-white font-bold rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
