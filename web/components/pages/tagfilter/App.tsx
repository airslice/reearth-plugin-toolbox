import Button from "@web/components/atoms/Button";
import EmptyInfo from "@web/components/atoms/EmptyInfo";
import Line from "@web/components/atoms/Line";
import DropdownBox from "@web/components/molecules/DropdownBox";
import Panel from "@web/components/molecules/Panel";
import type { actHandles } from "@web/types";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { mockTagsData } from "./mock";

import "@web/components/molecules/Common/common.css";
import "./app.css";

type Tag = {
  id: string;
  name: string;
  layerIds: string[];
};

export type TagGroup = {
  id: string;
  name: string;
  tags: Tag[];
};

const App = () => {
  const [tags, setTags] = useState<TagGroup[]>([]);

  const tagStatus = useRef(new Map());
  const tagGroupEnabled = useRef(new Map());
  const layerTags = useRef(new Map());
  const tagLayers = useRef(new Map());

  const updateReducer = useCallback(
    (num: number): number => (num + 1) % 1_000_000,
    []
  );
  const [, forceUpdate] = useReducer(updateReducer, 0);

  const [tagRenderKey, updateTagRenderKey] = useReducer(updateReducer, 0);

  const filter = useCallback(() => {
    const visibleLayers: string[] = [];
    const invisibleLayers: string[] = [];

    const alive: Set<string>[] = [];
    tags.forEach((tagGroup) => {
      if (tagGroupEnabled.current.get(tagGroup.id)) {
        const aliveInThisGroup = new Set<string>();
        tagGroup.tags.forEach((tag) => {
          if (tagStatus.current.get(tag.id)) {
            tagLayers.current.get(tag.id).forEach((layerId: string) => {
              aliveInThisGroup.add(layerId);
            });
          }
        });
        alive.push(aliveInThisGroup);
      }
    });

    [...layerTags.current.keys()].forEach((layerId: string) => {
      let visible = true;

      alive.forEach((groupAliveSet) => {
        if (!groupAliveSet.has(layerId)) visible = false;
      });

      if (visible) {
        visibleLayers.push(layerId);
      } else {
        invisibleLayers.push(layerId);
      }
    });

    (globalThis as any).parent.postMessage(
      {
        act: "showLayers",
        payload: visibleLayers,
      },
      "*"
    );
    (globalThis as any).parent.postMessage(
      {
        act: "hideLayers",
        payload: invisibleLayers,
      },
      "*"
    );
  }, [tags, layerTags, tagLayers]);

  const toggleTag = useCallback(
    (tagId: string) => {
      const status = tagStatus.current.get(tagId);
      tagStatus.current.set(tagId, !status);
      updateTagRenderKey();
    },
    [tagStatus, updateTagRenderKey]
  );

  useEffect(() => {
    forceUpdate();
  }, [tagRenderKey]);

  const onResize = useCallback((width: number, height: number) => {
    (globalThis as any).parent.postMessage(
      {
        act: "resize",
        payload: [width, height],
      },
      "*"
    );
  }, []);

  const handleTagGroupEnableChange = useCallback(
    (tagGroupId: string | undefined, enabled: boolean) => {
      if (tagGroupId) {
        tagGroupEnabled.current.set(tagGroupId, enabled);
      }
    },
    []
  );

  const processTagsData = useCallback(
    (tagsdata: TagGroup[]) => {
      layerTags.current.clear();
      tagGroupEnabled.current.clear();

      tagsdata.forEach((tg) => {
        tagGroupEnabled.current.set(tg.id, false);

        tg.tags.forEach((t) => {
          if (!tagStatus.current.has(t.id)) {
            tagStatus.current.set(t.id, false);
          }

          tagLayers.current.set(t.id, t.layerIds);

          t.layerIds.forEach((lid) => {
            if (!layerTags.current.has(lid)) {
              layerTags.current.set(lid, []);
            }
            layerTags.current.get(lid).push(t.id);
          });
        });
      });

      setTags(tagsdata);
    },
    [layerTags, tagLayers, tagStatus]
  );

  const actHandles: actHandles = useMemo(() => {
    return {
      tags: processTagsData,
    };
  }, [processTagsData]);

  const init = useCallback(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });

    (globalThis as any).parent.postMessage({ act: "getTags" }, "*");

    if (import.meta.env.MODE === "development") {
      processTagsData(mockTagsData);
    }
  }, [actHandles, processTagsData]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Panel title="Tag Filter" icon="filter" onResize={onResize}>
      <>
        {tags.length > 0 ? (
          <>
            {tags.map((tagGroup) => (
              <DropdownBox
                key={tagGroup.id}
                title={tagGroup.name}
                contentId={tagGroup.id}
                switcher={true}
                fixedContent={tagGroup.tags
                  .filter((tag) => tagStatus.current.get(tag.id) === true)
                  .map((tag) => (
                    <Button
                      text={tag.name}
                      key={tag.id}
                      buttonType="tag"
                      compact={true}
                      status={tagStatus.current.get(tag.id) ? "on" : "off"}
                      onClick={() => {
                        toggleTag(tag.id);
                      }}
                    />
                  ))}
                mainContent={tagGroup.tags
                  .filter((tag) => tagStatus.current.get(tag.id) === false)
                  .map((tag) => (
                    <Button
                      text={tag.name}
                      key={tag.id}
                      buttonType="tag"
                      buttonStyle="secondary"
                      compact={true}
                      status={tagStatus.current.get(tag.id) ? "on" : "off"}
                      onClick={() => {
                        toggleTag(tag.id);
                      }}
                    />
                  ))}
                onResize={forceUpdate}
                onSwitchChange={handleTagGroupEnableChange}
              ></DropdownBox>
            ))}
            <Line>
              <Button
                buttonStyle="secondary"
                extendWidth
                text="Filter"
                onClick={filter}
              />
            </Line>
          </>
        ) : (
          <EmptyInfo text="NO TAG GROUP SELECTED" />
        )}
      </>
    </Panel>
  );
};

export default App;
