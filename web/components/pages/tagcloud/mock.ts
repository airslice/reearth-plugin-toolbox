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
    ],
  },
];
