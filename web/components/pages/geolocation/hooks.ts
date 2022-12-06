import type { Theme } from "@web/theme/common";
import type {
  actHandles,
  CurrentLocationInfo,
  MarkerStyle,
  WidgetMode,
} from "@web/types";
import { dateFormat, postMsg, timeFormat } from "@web/utils/common";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useRef,
  useReducer,
} from "react";

export default () => {
  const isActive = useRef(false);
  const [theme, setTheme] = useState("dark");
  const [autoFollowClicked, setAutoFollowClicked] = useState(false);
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();
  const [CurrentLocation, setCurentLocation] = useState<CurrentLocationInfo>();
  const [autoFollow, setAutoFollow] = useState(false);
  const [markerStyle, setMarkerStyle] = useState<MarkerStyle>();
  const [widgetMode, setWidgetMode] = useState<WidgetMode>();

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const updateReducer = useCallback(
    (num: number): number => (num + 1) % 1_000_000,
    []
  );
  const [, forceUpdate] = useReducer(updateReducer, 0);

  const onClose = useCallback(() => {}, []);

  const handleActiveChange = useCallback(
    (active: boolean) => {
      if (widgetMode == "button") {
        setAutoFollowClicked(true);
        return;
      }
      isActive.current = active;
      if (!isActive.current) {
        onClose();
      }
    },
    [onClose, widgetMode]
  );

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

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

      SetWidgetValues: ({
        mode,
        autoFollow,
        markerStyle,
      }: {
        mode: WidgetMode;
        autoFollow: boolean;
        markerStyle: MarkerStyle;
      }) => {
        setAutoFollow(autoFollow);
        setWidgetMode(mode);
        setMarkerStyle(markerStyle);
      },
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      if (!autoFollow) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            setCurentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude ?? 100,
              date: dateFormat.format(new Date()),
              time: timeFormat.format(new Date()),
            });
          },
          function (error) {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      } else {
        navigator.geolocation.watchPosition(
          function (position) {
            setCurentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: position.coords.altitude ?? 100,
              date: dateFormat.format(new Date()),
              time: timeFormat.format(new Date()),
            });
          },
          function (error) {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      }
    }
  }, [autoFollow, CurrentLocation]);
  postMsg("getTheme");
  postMsg("getWidgetValues");
  postMsg("flyTo", CurrentLocation);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
  }, []);

  return {
    isActive,
    theme,
    autoFollow,
    overriddenTheme,
    toggleTheme,
    forceUpdate,
    markerStyle,
    widgetMode,
    handleActiveChange,
    onResize,
    CurrentLocation,
    autoFollowClicked,
  };
};
