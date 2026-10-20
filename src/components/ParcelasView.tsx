import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Droplet, 
  Layers, 
  Compass, 
  Check, 
  X, 
  Sprout, 
  Building2, 
  Warehouse, 
  Car, 
  Gauge, 
  CloudSun, 
  Eye, 
  Navigation,
  ExternalLink,
  Info,
  Sparkles,
  Maximize2,
  Table,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  DoorOpen,
  Package
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
  // Navigation tabs within Cuarteles view
  const [activeSubTab, setActiveSubTab] = useState<'mapa' | 'cuarteles_lista' | 'lugares_lista'>('mapa');

  // Map layer: Google Satellite Hybrid vs Esri World Imagery vs Street Map
  const [mapLayer, setMapLayer] = useState<'google_hybrid' | 'esri_sat' | 'osm'>('google_hybrid');
  const [showCuarteles, setShowCuarteles] = useState(true);
  const [showLugares, setShowLugares] = useState(true);

  // Selected item on map
  const [selectedParcelaDetail, setSelectedParcelaDetail] = useState<Parcela | null>(null);

  // Modal Parcela (Add / Edit)
  const [isParcelaModalOpen, setIsParcelaModalOpen] = useState(false);
  const [editingParcela, setEditingParcela] = useState<Parcela | null>(null);
  const [pNombre, setPNombre] = useState('');
  const [pCodigoLote, setPCodigoLote] = useState('');
  const [pSuperficieHa, setPSuperficieHa] = useState<number | ''>(4.5);
  const [pVariedad, setPVariedad] = useState('Hayward (Verde)');
  const [pMarco, setPMarco] = useState('4.5m x 4.0m (555 pl/ha)');
  const [pSistemaConduccion, setPSistemaConduccion] = useState<'Parrón Español / Pérgola' | 'Espaldera en T / Doble T'>('Parrón Español / Pérgola');
  const [pRiego, setPRiego] = useState<'Goteo automatizado' | 'Microaspersión' | 'Aspersión cobertura total' | 'Surco / Gravedad'>('Goteo automatizado');
  const [pTipoSuelo, setPTipoSuelo] = useState('Franco-limoso profundo con buen drenaje');
  const [pAno, setPAno] = useState(2019);
  const [pEstado, setPEstado] = useState<'Floración' | 'En crecimiento' | 'Cuaje / Maduración' | 'Cosecha activa' | 'Receso invernal'>('Floración');
  const [pLat, setPLat] = useState<number>(-35.9820);
  const [pLng, setPLng] = useState<number>(-71.2405);
  const [formError, setFormError] = useState('');

  // Modal Lugar (Add / Edit)
  const [isLugarModalOpen, setIsLugarModalOpen] = useState(false);
  const [editingLugar, setEditingLugar] = useState<LugarPredio | null>(null);
  const [lNombre, setLNombre] = useState('');
  const [lTipo, setLTipo] = useState<LugarPredio['tipo']>('entrada_principal');
  const [lDescripcion, setLDescripcion] = useState('');
  const [lLat, setLLat] = useState<number>(-35.9800);
  const [lLng, setLLng] = useState<number>(-71.2435);

  // In-app Delete Confirmation (NO window.confirm!)
  const [parcelaToDelete, setParcelaToDelete] = useState<Parcela | null>(null);
  const [lugarToDelete, setLugarToDelete] = useState<LugarPredio | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Leaflet map reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Farm Center Coordinates
  const defaultCenter: [number, number] = [-35.9820, -71.2405];

  // Initialize and update Leaflet Map
  useEffect(() => {
    if (activeSubTab !== 'mapa') return;
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      // Create map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 16,
        zoomControl: true,
        attributionControl: false
      });

      leafletMapRef.current = map;
      markersLayerGroupRef.current = L.layerGroup().addTo(map);

      // Click on map to capture coordinates
      map.on('click', (e: L.LeafletMouseEvent) => {
        // Can be used to set coords in modals
        setPLat(Number(e.latlng.lat.toFixed(6)));
        setPLng(Number(e.latlng.lng.toFixed(6)));
        setLLat(Number(e.latlng.lat.toFixed(6)));
        setLLng(Number(e.latlng.lng.toFixed(6)));
      });
    }

    const map = leafletMapRef.current;

    // Update tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = '';
    let maxZoom = 20;

    if (mapLayer === 'google_hybrid') {
      // Google Hybrid satellite + roads/names (works without API key)
      tileUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      maxZoom = 21;
    } else if (mapLayer === 'esri_sat') {
      // Esri World Imagery (High-res satellite)
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      maxZoom = 19;
    } else {
      // OpenStreetMap standard
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
      maxZoom = 19;
    }

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom,
      subdomains: ['a', 'b', 'c']
    }).addTo(map);

    // Render Markers and Cuarteles
    if (markersLayerGroupRef.current) {
      markersLayerGroupRef.current.clearLayers();

      // 1. Render Cuarteles
      if (showCuarteles) {
        parcelas.forEach((p, idx) => {
          // Circle radius approx based on hectares (1 ha ~ 56m radius, 4.5 ha ~ 120m radius)
          const radiusMeters = Math.max(45, Math.sqrt(p.superficieHa * 10000 / Math.PI) * 0.85);

          // Circle representing plot area
          const circle = L.circle([p.latitud, p.longitud], {
            radius: radiusMeters,
            color: '#10b981',
            fillColor: '#059669',
            fillOpacity: 0.35,
            weight: 2
          });

          // Custom HTML Pin Marker with name and hectares
          const pinHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background-color: #064e3b; color: white; border: 2px solid #34d399; border-radius: 9999px; padding: 4px 8px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.4); display: flex; align-items: center; gap: 4px;">
                <span>🥝 ${p.codigoLote}</span>
                <span style="background: rgba(255,255,255,0.25); border-radius: 4px; padding: 1px 4px; font-size: 10px;">${p.superficieHa} ha</span>
              </div>
              <div style="width: 2px; height: 10px; background-color: #34d399;"></div>
              <div style="width: 6px; height: 6px; border-radius: 50%; background-color: #34d399;"></div>
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
              <div><strong>Cultivo:</strong> Kiwi Hayward (${p.superficieHa} ha)</div>
              <div><strong>Conducción:</strong> ${p.sistemaConduccion || 'Parrón Español'}</div>
              <div><strong>Riego:</strong> ${p.sistemaRiego}</div>
              <div><strong>Estado:</strong> <span style="color: #059669; font-weight: 600;">${p.estadoActual}</span></div>
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
            if (editBtn) {
              editBtn.onclick = () => openEditParcelaModal(p);
            }
            if (laborBtn) {
              laborBtn.onclick = () => onRegisterLaborForParcela(p.id);
            }
          });

          markersLayerGroupRef.current?.addLayer(circle);
          markersLayerGroupRef.current?.addLayer(marker);
        });
      }

      // 2. Render Lugares Prediales (Entrada Principal, Bodega, Pozo, etc.)
      if (showLugares) {
        lugares.forEach((lug) => {
          let iconEmoji = '📍';
          let bgColor = '#475569';
          let borderColor = '#94a3b8';

          if (lug.tipo === 'entrada_principal') {
            iconEmoji = '🚪';
            bgColor = '#b45309'; // Golden Amber
            borderColor = '#fbbf24';
          } else if (lug.tipo === 'bodega') {
            iconEmoji = '📦';
            bgColor = '#c2410c'; // Rust Orange
            borderColor = '#fb923c';
          } else if (lug.tipo === 'pozo') {
            iconEmoji = '💧';
            bgColor = '#0369a1'; // Sky Blue
            borderColor = '#38bdf8';
          } else if (lug.tipo === 'estacionamiento') {
            iconEmoji = '🚜';
            bgColor = '#334155'; // Dark Slate
            borderColor = '#94a3b8';
          } else if (lug.tipo === 'cabezal_riego') {
            iconEmoji = '⚙️';
            bgColor = '#047857'; // Emerald
            borderColor = '#34d399';
          } else if (lug.tipo === 'oficina') {
            iconEmoji = '🏢';
            bgColor = '#6d28d9'; // Purple
            borderColor = '#c084fc';
          } else if (lug.tipo === 'estacion_meteo') {
            iconEmoji = '🌤️';
            bgColor = '#ea580c'; // Bright Orange
            borderColor = '#fed7aa';
          }

          const lugarHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="background-color: ${bgColor}; color: white; border: 2px solid ${borderColor}; border-radius: 9999px; padding: 4px 7px; font-weight: bold; font-size: 11px; white-space: nowrap; box-shadow: 0 4px 6px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 4px;">
                <span>${iconEmoji}</span>
                <span>${lug.nombre}</span>
              </div>
              <div style="width: 2px; height: 8px; background-color: ${borderColor};"></div>
            </div>
          `;

          const icon = L.divIcon({
            className: 'custom-lugar-pin',
            html: lugarHtml,
            iconSize: [140, 36],
            iconAnchor: [70, 36]
          });

          const marker = L.marker([lug.latitud, lug.longitud], { icon });

          const popupContent = document.createElement('div');
          popupContent.className = 'text-xs p-1 space-y-1.5';
          popupContent.innerHTML = `
            <div style="font-weight: bold; font-size: 12px; color: ${bgColor}; border-bottom: 1px solid #e5e7eb; padding-bottom: 3px;">
              ${iconEmoji} ${lug.nombre}
            </div>
            <div style="font-size: 11px; color: #4b5563;">
              ${lug.descripcion || 'Punto de infraestructura del predio'}
            </div>
            <div style="font-family: monospace; font-size: 10px; color: #6b7280;">GPS: ${lug.latitud.toFixed(5)}, ${lug.longitud.toFixed(5)}</div>
            <div style="display: flex; gap: 6px; margin-top: 6px;">
              <button id="btn-edit-lug-${lug.id}" style="background-color: #374151; color: white; padding: 3px 6px; border-radius: 4px; border: none; cursor: pointer; font-size: 10px;">
                Editar
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);
          marker.on('popupopen', () => {
            const editBtn = document.getElementById(`btn-edit-lug-${lug.id}`);
            if (editBtn) {
              editBtn.onclick = () => openEditLugarModal(lug);
            }
          });

          markersLayerGroupRef.current?.addLayer(marker);
        });
      }
    }

    // Force map size refresh
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [activeSubTab, mapLayer, parcelas, lugares, showCuarteles, showLugares]);

  // Total Statistics
  const totalHectareas = parcelas.reduce((acc, p) => acc + p.superficieHa, 0).toFixed(1);

  // Parcela Modal Handlers
  const openNewParcelaModal = () => {
    setEditingParcela(null);
    setPNombre(`Cuartel ${parcelas.length + 1} - Kiwi Hayward`);
    setPCodigoLote(`K-0${parcelas.length + 1}-HAY`);
    setPSuperficieHa(4.0);
    setPVariedad('Hayward (Verde)');
    setPMarco('4.5m x 4.0m (555 pl/ha)');
    setPSistemaConduccion('Parrón Español / Pérgola');
    setPRiego('Goteo automatizado');
    setPTipoSuelo('Franco aluvial profundo con buen drenaje');
    setPAno(2020);
    setPEstado('Floración');
    setPLat(-35.9825);
    setPLng(-71.2410);
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
    if (!pSuperficieHa || pSuperficieHa <= 0) {
      setFormError('La superficie debe ser mayor a 0 hectáreas.');
      return;
    }

    if (editingParcela) {
      const updated: Parcela = {
        ...editingParcela,
        nombre: pNombre.trim(),
        codigoLote: pCodigoLote.trim() || editingParcela.codigoLote,
        superficieHa: Number(pSuperficieHa),
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
      showToast(`¡Cuartel "${updated.nombre}" actualizado exitosamente!`);
    } else {
      const nueva: Parcela = {
        id: `parc-${Date.now()}`,
        nombre: pNombre.trim(),
        codigoLote: pCodigoLote.trim() || `K-0${parcelas.length + 1}-HAY`,
        superficieHa: Number(pSuperficieHa),
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
      showToast(`¡Nuevo cuartel "${nueva.nombre}" agregado con éxito!`);
    }

    setIsParcelaModalOpen(false);
  };

  // Lugar Modal Handlers
  const openNewLugarModal = () => {
    setEditingLugar(null);
    setLNombre('');
    setLTipo('entrada_principal');
    setLDescripcion('');
    setLLat(-35.9800);
    setLLng(-71.2435);
    setIsLugarModalOpen(true);
  };

  const openEditLugarModal = (lug: LugarPredio) => {
    setEditingLugar(lug);
    setLNombre(lug.nombre);
    setLTipo(lug.tipo);
    setLDescripcion(lug.descripcion || '');
    setLLat(lug.latitud);
    setLLng(lug.longitud);
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
      showToast(`¡Instalación "${updated.nombre}" actualizada!`);
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
      showToast(`¡Nueva ubicación "${nuevo.nombre}" agregada!`);
    }

    setIsLugarModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          {toastMessage}
        </div>
      )}

      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 rounded-2xl text-white shadow-md">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-600/40">
            <Sprout className="w-3.5 h-3.5 text-emerald-300" />
            100% Cultivar Kiwi Hayward · Fundo La Cabaña
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Mapa Satelital & Gestión de Cuarteles
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mt-1">
            Visualización georreferenciada de cuarteles de kiwi, delimitación de hectariaje, entrada principal e infraestructura predial. Edición completa de datos agronómicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={openNewParcelaModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Cuartel
          </button>
          <button
            onClick={openNewLugarModal}
            className="px-3.5 py-2 bg-stone-700 hover:bg-stone-600 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
          >
            <DoorOpen className="w-4 h-4 text-amber-300" />
            + Punto / Entrada
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('mapa')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'mapa'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Mapa Satelital Interactivo
        </button>

        <button
          onClick={() => setActiveSubTab('cuarteles_lista')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'cuarteles_lista'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Table className="w-4 h-4" />
          Gestión de Cuarteles ({parcelas.length})
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-800 text-emerald-100 font-mono">
            {totalHectareas} ha
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('lugares_lista')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
            activeSubTab === 'lugares_lista'
              ? 'bg-emerald-900 text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Entradas & Puntos Predio ({lugares.length})
        </button>
      </div>

      {/* SUBTAB 1: MAPA SATELITAL INTERACTIVO */}
      {activeSubTab === 'mapa' && (
        <div className="space-y-4">
          {/* Controls Bar for Map */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-stone-200 shadow-2xs text-xs">
            {/* Layer switcher */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-700 flex items-center gap-1 mr-1">
                <Layers className="w-3.5 h-3.5 text-emerald-800" />
                Capa:
              </span>
              <button
                onClick={() => setMapLayer('google_hybrid')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  mapLayer === 'google_hybrid'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🛰️ Google Satélite Híbrido
              </button>
              <button
                onClick={() => setMapLayer('esri_sat')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  mapLayer === 'esri_sat'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🌍 Esri World Imagery
              </button>
              <button
                onClick={() => setMapLayer('osm')}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  mapLayer === 'osm'
                    ? 'bg-emerald-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🗺️ Mapa Calles
              </button>
            </div>

            {/* Marker Visibility Toggles */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={showCuarteles}
                  onChange={(e) => setShowCuarteles(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <span>Cuarteles ({parcelas.length})</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium text-stone-700">
                <input
                  type="checkbox"
                  checked={showLugares}
                  onChange={(e) => setShowLugares(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-700"
                />
                <span>Instalaciones ({lugares.length})</span>
              </label>

              <button
                onClick={() => {
                  if (leafletMapRef.current) {
                    leafletMapRef.current.setView(defaultCenter, 16);
                  }
                }}
                className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                title="Centrar en Fundo La Cabaña"
              >
                <Compass className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real Leaflet Map Container */}
          <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-stone-300 shadow-md">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Map Legend Overlay */}
            <div className="absolute bottom-4 left-4 z-20 bg-stone-900/90 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white text-[11px] space-y-1.5 shadow-xl max-w-xs pointer-events-auto">
              <span className="font-bold block text-emerald-300 text-xs border-b border-white/20 pb-1">
                Fundo La Cabaña · Simbología
              </span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shrink-0"></span>
                <span>Cuarteles Kiwi Hayward ({totalHectareas} ha totales)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0"></span>
                <span>🚪 Entrada Principal / Portón Acceso</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-600 border border-white shrink-0"></span>
                <span>📦 Bodega Insumos · 💧 Pozo · 🚜 Patio Tractores</span>
              </div>
              <div className="text-[10px] text-stone-300 pt-1 border-t border-white/10">
                💡 Haz clic sobre cualquier pin o círculo para ver detalles o editar el cuartel.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GESTIÓN DE CUARTELES (EDITAR Y ADMINISTRAR) */}
      {activeSubTab === 'cuarteles_lista' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Catastro y Fichas Agronómicas de Cuarteles
              </h2>
              <p className="text-xs text-stone-500">
                Todos los cuarteles corresponden a <strong>Kiwi Hayward</strong> (Actinidia deliciosa). Puedes editar marcos de plantación, riego y hectáreas.
              </p>
            </div>
            <button
              onClick={openNewParcelaModal}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Agregar Cuartel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parcelas.map((p) => (
              <div 
                key={p.id}
                className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:border-emerald-500/50 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-950 text-white">
                        {p.codigoLote}
                      </span>
                      <h3 className="font-bold text-base text-stone-900">
                        {p.nombre}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800">
                      Kiwi {p.variedad} · {p.superficieHa} hectáreas
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditParcelaModal(p)}
                      className="p-2 text-stone-600 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Editar información del cuartel"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setParcelaToDelete(p)}
                      className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar cuartel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Conducción</span>
                    <span className="font-semibold">{p.sistemaConduccion || 'Parrón Español'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Sistema Riego</span>
                    <span className="font-semibold">{p.sistemaRiego}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Marco Plantación</span>
                    <span>{p.marcoPlantacion}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Año Plantación</span>
                    <span>{p.anoPlantacion} ({new Date().getFullYear() - p.anoPlantacion} años)</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Tipo de Suelo</span>
                    <span className="text-[11px] text-stone-600">{p.tipoSuelo}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="font-mono text-[11px] text-stone-500">
                    GPS: {p.latitud.toFixed(4)}, {p.longitud.toFixed(4)}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRegisterLaborForParcela(p.id)}
                      className="px-3 py-1.5 bg-emerald-100 text-emerald-950 hover:bg-emerald-200 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-800" />
                      Registrar Labor
                    </button>
                    <button
                      onClick={() => openEditParcelaModal(p)}
                      className="px-3 py-1.5 bg-stone-900 text-white hover:bg-stone-800 font-bold rounded-lg text-xs transition-colors"
                    >
                      Editar Cuartel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: INSTALACIONES & PUNTOS DE INTERÉS */}
      {activeSubTab === 'lugares_lista' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200">
            <div>
              <h2 className="text-sm font-bold text-stone-900">
                Puntos de Infraestructura & Entrada Principal
              </h2>
              <p className="text-xs text-stone-500">
                Puntos georreferenciados como portón de acceso, bodega SAG, pozo profundo y estación meteorológica
              </p>
            </div>
            <button
              onClick={openNewLugarModal}
              className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nuevo Punto de Interés
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lugares.map((lug) => (
              <div key={lug.id} className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {lug.tipo === 'entrada_principal' ? '🚪' :
                       lug.tipo === 'bodega' ? '📦' :
                       lug.tipo === 'pozo' ? '💧' :
                       lug.tipo === 'estacionamiento' ? '🚜' :
                       lug.tipo === 'cabezal_riego' ? '⚙️' :
                       lug.tipo === 'oficina' ? '🏢' : '🌤️'}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 leading-tight">{lug.nombre}</h4>
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                        {lug.tipo.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditLugarModal(lug)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setLugarToDelete(lug)}
                      className="p-1.5 text-stone-400 hover:text-red-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {lug.descripcion && (
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {lug.descripcion}
                  </p>
                )}

                <div className="pt-2 border-t border-stone-100 font-mono text-[10px] text-stone-500">
                  GPS: {lug.latitud.toFixed(5)}, {lug.longitud.toFixed(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR CUARTEL */}
      {isParcelaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm sm:text-base">
                  {editingParcela ? `Editar Cuartel: ${editingParcela.nombre}` : 'Registrar Nuevo Cuartel de Kiwi'}
                </h3>
              </div>
              <button 
                onClick={() => setIsParcelaModalOpen(false)}
                className="p-1 text-emerald-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveParcela} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Nombre del Cuartel *
                  </label>
                  <input
                    type="text"
                    required
                    value={pNombre}
                    onChange={(e) => setPNombre(e.target.value)}
                    placeholder="Ej: Cuartel 5 - Kiwi Hayward Este"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Código de Lote SAG *
                  </label>
                  <input
                    type="text"
                    required
                    value={pCodigoLote}
                    onChange={(e) => setPCodigoLote(e.target.value)}
                    placeholder="Ej: K-05-HAY"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Superficie (ha) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={pSuperficieHa}
                    onChange={(e) => setPSuperficieHa(parseFloat(e.target.value) || '')}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Cultivar / Variedad
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Hayward (100% Exclusivo)"
                    className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-600 font-semibold cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Año de Plantación
                  </label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={pAno}
                    onChange={(e) => setPAno(parseInt(e.target.value) || 2020)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Sistema de Conducción *
                  </label>
                  <select
                    value={pSistemaConduccion}
                    onChange={(e: any) => setPSistemaConduccion(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                  >
                    <option value="Parrón Español / Pérgola">Parrón Español / Pérgola</option>
                    <option value="Espaldera en T / Doble T">Espaldera en T / Doble T</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Sistema de Riego *
                  </label>
                  <select
                    value={pRiego}
                    onChange={(e: any) => setPRiego(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white"
                  >
                    <option value="Goteo automatizado">Goteo automatizado</option>
                    <option value="Microaspersión">Microaspersión</option>
                    <option value="Aspersión cobertura total">Aspersión cobertura total</option>
                    <option value="Surco / Gravedad">Surco / Gravedad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Marco de Plantación (Densidad)
                  </label>
                  <input
                    type="text"
                    value={pMarco}
                    onChange={(e) => setPMarco(e.target.value)}
                    placeholder="Ej: 4.5m x 4.0m (555 pl/ha)"
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Estado Fenológico Actual
                  </label>
                  <select
                    value={pEstado}
                    onChange={(e: any) => setPEstado(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800 bg-white font-medium"
                  >
                    <option value="Floración">Floración</option>
                    <option value="En crecimiento">En crecimiento vegetativo</option>
                    <option value="Cuaje / Maduración">Cuaje / Maduración</option>
                    <option value="Cosecha activa">Cosecha activa</option>
                    <option value="Receso invernal">Receso invernal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descripción del Suelo y Textura
                </label>
                <input
                  type="text"
                  value={pTipoSuelo}
                  onChange={(e) => setPTipoSuelo(e.target.value)}
                  placeholder="Ej: Suelo aluvial profundo franco-limoso con 3.2% de MO"
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-emerald-800"
                />
              </div>

              {/* Coordenadas GPS */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="font-bold text-stone-900 block mb-2">
                  Coordenadas GPS de Georreferenciación (Latitud / Longitud)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">Latitud</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={pLat}
                      onChange={(e) => setPLat(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-stone-300 font-mono text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">Longitud</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={pLng}
                      onChange={(e) => setPLng(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 rounded border border-stone-300 font-mono text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsParcelaModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {editingParcela ? 'Guardar Cambios' : 'Registrar Cuartel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CREAR / EDITAR LUGAR / ENTRADA */}
      {isLugarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">
                  {editingLugar ? 'Editar Ubicación Predial' : 'Agregar Entrada o Instalación'}
                </h3>
              </div>
              <button 
                onClick={() => setIsLugarModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLugar} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Tipo de Punto *
                </label>
                <select
                  value={lTipo}
                  onChange={(e: any) => setLTipo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-stone-900 bg-white font-semibold"
                >
                  <option value="entrada_principal">🚪 Entrada Principal (Portón)</option>
                  <option value="bodega">📦 Bodega de Insumos Fitosanitarios</option>
                  <option value="pozo">💧 Pozo Profundo / Caseta Bomba</option>
                  <option value="estacionamiento">🚜 Patio de Tractores y Maquinaria</option>
                  <option value="cabezal_riego">⚙️ Cabezal de Riego y Fertirriego</option>
                  <option value="oficina">🏢 Oficina Técnica y Administración</option>
                  <option value="estacion_meteo">🌤️ Estación Meteorológica</option>
                  <option value="packing">🏭 Packing Frutícola / Recepción</option>
                  <option value="otro">📍 Otro Punto de Interés</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Nombre Identificatorio *
                </label>
                <input
                  type="text"
                  required
                  value={lNombre}
                  onChange={(e) => setLNombre(e.target.value)}
                  placeholder="Ej: Portón de Acceso Principal Ruta K-60"
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Descripción o Notas
                </label>
                <textarea
                  rows={2}
                  value={lDescripcion}
                  onChange={(e) => setLDescripcion(e.target.value)}
                  placeholder="Detalles sobre acceso, llaves o especificaciones..."
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">Latitud</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lLat}
                    onChange={(e) => setLLat(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded border border-stone-300 font-mono text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-stone-500 mb-0.5">Longitud</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={lLng}
                    onChange={(e) => setLLng(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded border border-stone-300 font-mono text-xs bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLugarModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Guardar Ubicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IN-APP DE CONFIRMACIÓN DE ELIMINACIÓN DE CUARTEL */}
      {parcelaToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-red-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Cuartel</h3>
              </div>
              <button 
                onClick={() => setParcelaToDelete(null)}
                className="p-1 text-red-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-stone-700 text-sm">
                ¿Estás seguro de que deseas eliminar permanentemente el <strong>{parcelaToDelete.nombre}</strong> ({parcelaToDelete.superficieHa} ha)?
              </p>
              <p className="text-stone-500 text-[11px]">
                Esta acción retirará el cuartel del mapa y del catastro del Fundo La Cabaña.
              </p>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setParcelaToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteParcela(parcelaToDelete.id);
                    showToast(`Cuartel "${parcelaToDelete.nombre}" eliminado`);
                    setParcelaToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Eliminar Definitivamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL IN-APP DE CONFIRMACIÓN DE ELIMINACIÓN DE LUGAR */}
      {lugarToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                <h3 className="font-bold text-sm">Eliminar Punto de Infraestructura</h3>
              </div>
              <button 
                onClick={() => setLugarToDelete(null)}
                className="p-1 text-stone-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-stone-700 text-sm">
                ¿Deseas eliminar <strong>{lugarToDelete.nombre}</strong> del predio?
              </p>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setLugarToDelete(null)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-stone-700 font-medium hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteLugar(lugarToDelete.id);
                    showToast(`Punto "${lugarToDelete.nombre}" eliminado`);
                    setLugarToDelete(null);
                  }}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg shadow-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
