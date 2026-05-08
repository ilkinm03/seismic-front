import L, {
  type Map as LMap,
  type LatLngBoundsExpression,
  type LatLngTuple,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DELAWARE_BASIN } from "@/lib/geo";
import { cn } from "@/lib/cn";

export interface MapBaseHandle {
  getMap: () => LMap | null;
  flyTo: (latlng: LatLngTuple, zoom?: number) => void;
  fitBounds: (bounds: LatLngBoundsExpression) => void;
}

export interface MapBaseProps {
  /** Render-prop for adding layers/controls AFTER the map mounts. */
  children?: (map: LMap) => ReactNode;
  className?: string;
  initialCenter?: LatLngTuple;
  initialZoom?: number;
  variant?: "dark" | "light" | "satellite";
}

const TILE_URL_DARK =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_URL_LIGHT =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const SATELLITE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const SATELLITE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community";

/**
 * Generic Leaflet container.
 *
 * Imperative pattern intentionally preserved from the original `MapView.tsx` —
 * full control over markers, popups, fly-to, and tile filters without
 * paying for react-leaflet's component layer.
 */
export const MapBase = forwardRef<MapBaseHandle, MapBaseProps>(function MapBase(
  { children, className, initialCenter, initialZoom, variant = "dark" },
  ref,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<LMap | null>(null);

  useEffect(() => {
    if (!containerRef.current || map) return;
    const instance = L.map(containerRef.current, {
      center: initialCenter ?? [
        DELAWARE_BASIN.centerLat,
        DELAWARE_BASIN.centerLon,
      ],
      zoom: initialZoom ?? DELAWARE_BASIN.defaultZoom,
      zoomControl: true,
      attributionControl: false,
      preferCanvas: true,
    });
    setMap(instance);

    // Initial tile layer
    const getUrl = () => {
      if (variant === "satellite") return SATELLITE_URL;
      if (variant === "light") return TILE_URL_LIGHT;
      return TILE_URL_DARK;
    };
    const getAttr = () => {
      if (variant === "satellite") return SATELLITE_ATTRIBUTION;
      return ATTRIBUTION;
    };

    const tiles = L.tileLayer(getUrl(), {
      maxZoom: 18,
      attribution: getAttr(),
      updateWhenIdle: true,
      keepBuffer: 2,
    }).addTo(instance);

    // Track for cleanup/updates
    (instance as any)._baseLayer = tiles;

    // Container may not have final dimensions yet at mount — double-RAF ensures tiles fill correctly
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        instance.invalidateSize();
      });
    });

    return () => {
      instance.remove();
      setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update layer when variant changes
  useEffect(() => {
    if (!map) return;
    const instance = map as any;
    if (instance._baseLayer) instance.removeLayer(instance._baseLayer);

    const getUrl = () => {
      if (variant === "satellite") return SATELLITE_URL;
      if (variant === "light") return TILE_URL_LIGHT;
      return TILE_URL_DARK;
    };
    const getAttr = () => {
      if (variant === "satellite") return SATELLITE_ATTRIBUTION;
      return ATTRIBUTION;
    };

    const next = L.tileLayer(getUrl(), {
      maxZoom: 18,
      attribution: getAttr(),
    }).addTo(map);

    instance._baseLayer = next;
  }, [map, variant]);

  // Invalidate map size whenever the container resizes (flex layout changes, panel open/close, etc.)
  useEffect(() => {
    if (!map || !containerRef.current) return;
    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [map]);

  useImperativeHandle(
    ref,
    () => ({
      getMap: () => map,
      flyTo: (latlng, zoom) => {
        if (!map) return;
        map.flyTo(latlng, zoom ?? map.getZoom(), { duration: 0.7 });
      },
      fitBounds: (bounds) => map?.fitBounds(bounds, { padding: [40, 40] }),
    }),
    [map],
  );

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div ref={containerRef} className="h-full w-full" />
      {map && children ? children(map) : null}
    </div>
  );
});
