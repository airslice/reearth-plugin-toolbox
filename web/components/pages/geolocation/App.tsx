import Panel from "@web/components/molecules/Panel";
import ThemeProvider from "@web/theme/provider";

import usehooks from "./hooks";
import InfoCard from "./infoCard";
//import { format } from 'lodash';

const headers = ["Date", "Time", "Latitude", "Longitude"];

const App = () => {
  const {
    theme,
    overriddenTheme,
    handleActiveChange,
    onResize,
    CurrentLocation,
    autoFollow,
    widgetMode,
    markerStyle,
  } = usehooks();

  const items: { [Key: string]: string | number }[] = [
    { ["Date"]: CurrentLocation?.date ?? "0" },
    { ["Time"]: CurrentLocation?.time ?? "0" },
    { ["Latitude"]: CurrentLocation?.latitude ?? "0" },
    { ["Longitude"]: CurrentLocation?.longitude ?? "0" },
  ];

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel
        title="My Location"
        icon="sun"
        fullWidth={208}
        fullHeight={202}
        collapsible={widgetMode == "button" ? false : true}
        onResize={onResize}
        onFoldChange={handleActiveChange}
      >
        <InfoCard headers={headers} items={items} />
        <div>{autoFollow}</div>
        <div>{widgetMode}</div>
        <div>{markerStyle?.style}</div>
      </Panel>
    </ThemeProvider>
  );
};

export default App;
