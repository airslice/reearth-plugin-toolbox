// import Button from "@web/components/atoms/Button";
import Button from "@web/components/atoms/Button";
import Group from "@web/components/atoms/Group";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import { useEffect, useState, useCallback, useMemo, useReducer } from "react";

import "./app.css";

type Tag = {
  id: string;
  name: string;
  layerIds: string[];
};

type TagGroup = {
  id: string;
  name: string;
  tags: Tag[];
};

const App = () => {
  const [tags, setTags] = useState<TagGroup[]>([]);
  const [tagStatus] = useState(new Map());
  const [layerTags] = useState(new Map());
  const [tagLayers] = useState(new Map());

  const updateReducer = useCallback(
    (num: number): number => (num + 1) % 1_000_000,
    []
  );
  const [, forceUpdate] = useReducer(updateReducer, 0);

  const toggleTag = useCallback(
    (tagId: string) => {
      const status = tagStatus.get(tagId);
      const show = !status;
      if (show) {
        (globalThis as any).parent.postMessage(
          {
            act: "showLayers",
            payload: tagLayers.get(tagId),
          },
          "*"
        );
      } else {
        const hideLayerIds: string[] = [];
        const layerIds = tagLayers.get(tagId);
        layerIds.forEach((lid: string) => {
          const tagIds = layerTags
            .get(lid)
            .filter((tid: string) => tid !== tagId);
          let canHide = true;
          tagIds.forEach((tid: string) => {
            if (tagStatus.get(tid) === true) canHide = false;
          });
          if (canHide) hideLayerIds.push(lid);
        });
        if (hideLayerIds) {
          (globalThis as any).parent.postMessage(
            {
              act: "hideLayers",
              payload: hideLayerIds,
            },
            "*"
          );
        }
      }

      tagStatus.set(tagId, !status);
      forceUpdate();
    },
    [tagStatus, layerTags, tagLayers]
  );

  const onResize = (width: number, height: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  };

  const actHandles: actHandles = useMemo(() => {
    return {
      tags: (tagsdata: TagGroup[]) => {
        tagsdata.forEach((tg) => {
          tg.tags.forEach((t) => {
            if (!tagStatus.has(t.id)) {
              tagStatus.set(t.id, true);
            }

            tagLayers.set(t.id, t.layerIds);

            layerTags.clear();
            t.layerIds.forEach((lid) => {
              if (!layerTags.has(lid)) {
                layerTags.set(lid, []);
              }
              layerTags.get(lid).push(t.id);
            });
          });
        });

        setTags(tagsdata);
      },
    };
  }, [tagStatus, layerTags, tagLayers]);

  const init = useCallback(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });

    (globalThis as any).parent.postMessage({ act: "getTags" }, "*");
  }, [actHandles]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Panel title="Tag Cloud" icon="tag" onResize={onResize}>
      <>
        {tags.map((tagGroup) => (
          <Group title={tagGroup.name} key={tagGroup.id}>
            {tagGroup.tags.map((tag) => (
              <Button
                text={tag.name}
                key={tag.id}
                status={tagStatus.get(tag.id) ? "on" : "off"}
                onClick={() => {
                  toggleTag(tag.id);
                }}
              />
            ))}
          </Group>
        ))}
        {/* <Group title="Default">
          <Button text="Coffee" status="off" />
          <Button text="Books" />
          <Button text="Cameras" />
        </Group>
        <Group title="Tag Group A"></Group> */}
      </>
    </Panel>
  );
};

export default App;
