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
  } = usehooks();

  const items: { [Key: string]: string | number }[] = [
    { ["Date"]: CurrentLocation?.date ?? " " },
    { ["Time"]: CurrentLocation?.time ?? "10:10" },
    { ["Latitude"]: CurrentLocation?.latitude ?? "84848484" },
    { ["Longitude"]: CurrentLocation?.longitude ?? "7474747" },
  ];

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel
        title="My Location"
        icon="sun"
        fullWidth={208}
        fullHeight={202}
        onResize={onResize}
        onFoldChange={handleActiveChange}
      >
        <InfoCard headers={headers} items={items} />
      </Panel>
    </ThemeProvider>
  );
};

export default App;
