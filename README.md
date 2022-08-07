# reearth-plugin-toolbox

## Overview

This is a reearth plugin project, structure refrenced from https://github.com/eukarya-inc/reearth-plateauview.

## Toolbox - Starter

- Just a simple starter to show some UI elements.

## Toolbox - Tag Cloud

Tag Cloud will be helpful when you want to organize layer data in ONE dimension.

![test reearth dev_published html_alias=chiafhhehd(1440 desktop)](https://user-images.githubusercontent.com/21994748/182887355-a26709cc-d3db-4f47-86ac-c04c021b9207.png)

- Features:
  - Show a certain tag group as tag cloud.
  - Show/hide layers by tags.
  
- Setup:
  - Input the tag group name from Earth Editor.

- Tips:
  - Layer will be visible when any of its tag is enabled.
  - If a layer does not have any tags of selected tag group it will be list in a special tag `...`

## Toolbox - Tag Filter

Tag filter can be useful when show layers with tags in different dimensions. 

![test reearth dev_published html_alias=idchebgbdb(1440 desktop)](https://user-images.githubusercontent.com/21994748/183274570-25c1f150-370d-4403-9efb-4d9e0fdc3ce0.png)

- Features:
  - Show several tag groups as tag filter.
  - Show/hide layers by filter.

- Setup:
  - Add/remove/reorder tag group from Earth Editor.
  - Type in the tag group name.

- Tips:
  - Layer will be visible when it has enabled tag in each group.
  - If a layer does not have any tags of selected tag group it will be list in a special tag `...`


## Toolbox -  Measure Distance

- WIP.

## Known issue

- Build with cdn import is disabled now.
- The layer visibility is not avaliable from plugin API (only show/hide method supported) so the plugin mantains status internally which is not convenient and will lead to some mistakes between multiple plugins who controls the visibility.
- Plugin API needs a event of layers data change.
- Plugin API needs to expose the actual visibility.
