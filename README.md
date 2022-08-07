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
  - Input the tag group name from Re:earth Earth Editor.

- Tips:
  - Layer will be visible when any of its tag is enabled.
  - If a layer does not have any tags of selected tag group it will be list in a special tag `...`

## Toolbox - Tag Filter

Tag filter can be useful when show layers with tags in different dimensions. 

![test reearth dev_published html_alias=idchebgbdb(1440 desktop) (1)](https://user-images.githubusercontent.com/21994748/183280643-7f183826-d48a-4faa-a5f6-93089ca91867.png)

- Features:
  - Show several tag filter base on selected tag groups.
  - Each filter can be enable/disabled independently.
  - Filter layers (show/hide).

- Setup:
  - Add/remove/reorder tag group from Re:earth Earth Editor.
  - Type in the tag group name.

- Tips:
  - Layer will be visible when it has enabled tag in each enabled filter.
  - If a layer does not have any tags of selected tag group it will be list in a special tag `...`


## Toolbox -  Measure Distance

A tool to measure distance.

![test reearth dev_published html_alias=jgdaegajfd(1440 desktop)](https://user-images.githubusercontent.com/21994748/183281314-8f3bf7d9-a488-49e1-b740-7dab7c67767d.png)

- Features:
  - Measure distance on earth surface.
  - Support segmentation.
  - Support switch unit between kilometers and miles.

- Setup:
  - Point color & line color can be customized from Re:earth Earth Editor.

- Tips:
  - Right click can also finish current measurement.
  - For some reason render the line on TEST ENV needs some time but on PROD should be okey.

## Known issue & Suggestions

- Sometimes on published (and preview) page marker renders without an update.
- Build with cdn import is disabled now.
- Plugin API needs a event of layers data change.
  - Plugin will want to get noticed when layers data changed to update itself. Currently can only use on update which is triggered too often.
- Plugin API needs to expose the actual visibility.
  - The layer visibility is not avaliable from plugin API (only show/hide method supported) so the plugin mantains status internally which is not convenient and will lead to some mistakes between multiple plugins who controls the visibility.
- Plugin API needs to support fix camera.
  - Sometimes plugin may want to drag something on earth; Either provide an API to fix camera or support DnD on dynamic added layers is enough. The first way seems simpler.
