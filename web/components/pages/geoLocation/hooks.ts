import type { Theme } from "@web/theme/common";
import type { actHandles, CurrentLocationInfo } from "@web/types";
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
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();
  const [CurrentLocation, setCurentLocation] = useState<CurrentLocationInfo>();
  const [autoFollow, setAutoFollow] = useState(true);

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
      isActive.current = active;
      if (!isActive.current) {
        onClose();
      }
    },
    [onClose]
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
      setAutoFollow: ({ autoFollow }: { autoFollow: boolean }) => {
        setAutoFollow(autoFollow);
      },
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setCurentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            date: dateFormat.format(new Date()),
            time: timeFormat.format(new Date()),
          });
        },
        function (error) {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      console.log("No");
    }
  }, [autoFollow]);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
    postMsg("getTheme");
    postMsg("getAutofollowValue");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isActive,
    theme,
    overriddenTheme,
    toggleTheme,
    forceUpdate,
    handleActiveChange,
    onResize,
    CurrentLocation,
  };
};
