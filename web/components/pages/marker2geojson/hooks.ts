import type { Theme } from "@web/theme/common";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useCallback, useEffect, useState, useMemo, useReducer } from "react";
import { Infobox, Layer } from "src/apiType";

type MarkerInfo = {
  id: string;
  markerProperty?: Partial<Layer["property"]>;
  infobox?: Infobox;
};

export default () => {
  // Theme
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

  const updateReducer = useCallback(
    (num: number): number => (num + 1) % 1_000_000,
    []
  );
  const [, forceUpdate] = useReducer(updateReducer, 0);

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  // Folders
  const [folders, setFolders] = useState<{ id: string; title: string }[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>();
  const handleSelectFolder = useCallback(
    (folderId: string | number | boolean) => {
      setCurrentFolderId(folderId as string);
    },
    []
  );

  // Marker To GeoJSON
  const [isExporting, setIsExporting] = useState(false);
  const handleExportMarkerAsGeoJSON = useCallback(() => {
    setIsExporting(true);
    postMsg("getMarkersInFolder", currentFolderId);
  }, [currentFolderId]);
  const exportMarkerAsGeoJSON = useCallback((markers: MarkerInfo[]) => {
    const geojson = {
      type: "FeatureCollection",
      features:
        markers.length > 0
          ? markers.map((marker) => ({
              type: "Feature",
              properties: {
                reearthClassicMarker: marker.markerProperty,
                reearthClassicInfobox: marker.infobox,
              },
              geometry: {
                type: "Point",
                coordinates: [
                  marker.markerProperty?.location?.lng,
                  marker.markerProperty?.location?.lat,
                ],
              },
            }))
          : [],
    };
    const blob = new Blob([JSON.stringify(geojson)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "markers.geojson";
    a.click();
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }, []);

  // Message handlers
  const actHandles: actHandles = useMemo(() => {
    return {
      setTheme: ({
        theme,
        overriddenTheme,
      }: {
        theme: string;
        overriddenTheme: Theme;
      }) => {
        setTheme(theme);
        setOverriddenTheme(overriddenTheme);
      },
      setFolders: ({
        folders,
      }: {
        folders: { id: string; title: string }[];
      }) => {
        setFolders(folders);
      },
      setMarkers: ({ markers }: { markers: MarkerInfo[] }) => {
        exportMarkerAsGeoJSON(markers);
      },
    };
  }, [exportMarkerAsGeoJSON]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      if (event.source !== (globalThis as any).parent || !event.data.act)
        return;
      actHandles[event.data.act as keyof actHandles]?.(event.data.payload);
    };
    globalThis.addEventListener("message", messageHandler);

    const autoUpdateFolders = setInterval(() => {
      postMsg("updateFolders");
    }, 1000);

    postMsg("getTheme");
    postMsg("getFolders");

    return () => {
      clearInterval(autoUpdateFolders);
      globalThis.removeEventListener("message", messageHandler);
    };
  }, [actHandles]);

  return {
    theme,
    overriddenTheme,
    folders,
    currentFolderId,
    isExporting,
    handleSelectFolder,
    handleExportMarkerAsGeoJSON,
    onResize,
    forceUpdate,
  };
};
