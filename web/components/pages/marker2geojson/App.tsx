import Button from "@web/components/atoms/Button";
import Selector from "@web/components/atoms/Selector";
import Panel from "@web/components/molecules/Panel";
import ThemeProvider from "@web/theme/provider";

import useHooks from "./hooks";

const App = () => {
  const {
    theme,
    overriddenTheme,
    folders,
    currentFolderId,
    handleSelectFolder,
    exportMarkerAsGeoJSON,
    onResize,
    forceUpdate,
  } = useHooks();

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel title="Marker to GeoJSON" onResize={onResize} icon="exportGeoJSON">
        <Selector
          title="Choose a folder"
          placeholder="folder"
          options={folders?.map((f) => ({ title: f.title, value: f.id }))}
          onResize={forceUpdate}
          onSelect={handleSelectFolder}
        />
        <Button
          text="Export to GeoJSON"
          onClick={exportMarkerAsGeoJSON}
          disabled={!currentFolderId}
        />
      </Panel>
    </ThemeProvider>
  );
};

export default App;
