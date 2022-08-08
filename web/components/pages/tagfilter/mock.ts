import type { TagGroup } from "./App";

export const mockTagsData: TagGroup[] = [
  {
    name: "Group A",
    id: "ga",
    tags: [
      {
        id: "a1",
        name: "A1",
        layerIds: ["l1", "l2"],
      },
      {
        id: "a2",
        name: "A2",
        layerIds: ["l3"],
      },
      {
        id: "a3",
        name: "A3",
        layerIds: ["l3"],
      },
      {
        id: "a4",
        name: "A4",
        layerIds: ["l3"],
      },
    ],
  },
  {
    name: "Group B",
    id: "gb",
    tags: [
      {
        id: "b1",
        name: "B1",
        layerIds: ["l1", "l2"],
      },
      {
        id: "b2",
        name: "B2",
        layerIds: ["l3"],
      },
    ],
  },
  {
    name: "Group C",
    id: "gc",
    tags: [
      {
        id: "c1",
        name: "C1",
        layerIds: ["l1", "l2"],
      },
      {
        id: "c2",
        name: "C2",
        layerIds: ["l3"],
      },
    ],
  },
];
