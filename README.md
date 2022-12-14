# reearth-plugin-toolbox
## Overview

This is a reearth plugin project, structure refrenced https://github.com/eukarya-inc/reearth-plateauview.

Main content is on branch `starter`.

Every plugin has its on branch base on `starter`.

## Usage

- Clone the `starter` branch.
- Make a new branch base on `starter`.
- Run `yarn`.
- Run `yarn createwidget ${newWidgetId}`.
- Develop Web:
  - Run `yarn start:${newWidgetId}`
  - Working with `web/components/pages/${newWidgetId}/*`.
- Develop Plugin:
  - Working with `src/widgets/${newWidgetId}.ts`.
- Package:
  - Run `yarn package`.
- Test:
  - Install and test your plugin with packaged .zip file.

## Plugin list

[**Tag Cloud**](https://github.com/airslice/reearth-plugin-tag-cloud)
```
https://github.com/airslice/reearth-plugin-tag-cloud
```

[**Tag Filter**](https://github.com/airslice/reearth-plugin-tag-filter)
```
https://github.com/airslice/reearth-plugin-tag-filter
```

[**Distance Measurement**](https://github.com/airslice/reearth-plugin-distance-measurement)
```
https://github.com/airslice/reearth-plugin-distance-measurement
```

[**Layer Exporter**](https://github.com/airslice/reearth-plugin-layer-exporter)
```
https://github.com/airslice/reearth-plugin-layer-exporter
```

[**Pedestrian**](https://github.com/airslice/reearth-plugin-pedestrian)
```
https://github.com/airslice/reearth-plugin-pedestrian
```

[**Screen Save**](https://github.com/airslice/reearth-plugin-screen-save)
```
https://github.com/airslice/reearth-plugin-screen-save
```

## Known issue

- Sometimes on published (and preview) page marker renders without an update.
- Build with cdn import is disabled now.
- Multiple instance of tag cloud / tag filter may not working well with each other.
- Mobile UI is not supported for now.
