import Button from "@web/components/atoms/Button";
import Group from "@web/components/atoms/Group";
import Line from "@web/components/atoms/Line";
import Tag from "@web/components/atoms/Tag";
import TextArea from "@web/components/atoms/TextArea";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import { useEffect, useState, useCallback, useMemo, useReducer } from "react";

import { mockTagsData } from "./mock";

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
  const [theme, setTheme] = useState("dark");
  const [overriddenTheme, setOverriddenTheme] = useState<Theme>();

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
        postMsg("showLayers", tagLayers.get(tagId));
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
          postMsg("hideLayers", hideLayerIds);
        }
      }

      tagStatus.set(tagId, !status);
      forceUpdate();
    },
    [tagStatus, layerTags, tagLayers]
  );

  const showAll = useCallback(() => {
    tagStatus.forEach((v, k) => {
      tagStatus.set(k, true);
    });
    postMsg("showAll");
    forceUpdate();
  }, [tagStatus]);

  const hideAll = useCallback(() => {
    tagStatus.forEach((v, k) => {
      tagStatus.set(k, false);
    });
    postMsg("hideAll");
    forceUpdate();
  }, [tagStatus]);

  const onResize = useCallback((width: number, height: number) => {
    postMsg("resize", [width, height]);
  }, []);

  const processTagsData = useCallback(
    (tagsdata: TagGroup[]) => {
      layerTags.clear();
      tagsdata.forEach((tg) => {
        tg.tags.forEach((t) => {
          if (!tagStatus.has(t.id)) {
            tagStatus.set(t.id, true);
          }

          tagLayers.set(t.id, t.layerIds);

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
    [layerTags, tagLayers, tagStatus]
  );

  const actHandles: actHandles = useMemo(() => {
    return {
      tags: processTagsData,
      setTheme: ({
        theme,
        overriddenTheme,
      }: {
        theme: string;
        overriddenTheme: Theme;
      }) => {
        setTheme(theme);
        setOverriddenTheme(overriddenTheme);
      },
    };
  }, [processTagsData]);

  useEffect(() => {
    (globalThis as any).addEventListener("message", (msg: any) => {
      if (msg.source !== (globalThis as any).parent || !msg.data.act) return;
      actHandles[msg.data.act as keyof actHandles]?.(msg.data.payload);
    });
    postMsg("getTheme");
    postMsg("getTags");

    if (import.meta.env.MODE === "development") {
      processTagsData(mockTagsData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme} overriddenTheme={overriddenTheme}>
      <Panel title="Tag Cloud" icon="tag" onResize={onResize}>
        <>
          {tags.length > 0 ? (
            <>
              {tags.map((tagGroup) => (
                <Group key={tagGroup.id} noBorder={true}>
                  {tagGroup.tags.map((tag) => (
                    <Tag
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
              <Line>
                <Button
                  text="Show All"
                  buttonStyle="secondary"
                  extendWidth
                  onClick={showAll}
                />
                <Button
                  text="Hide All"
                  buttonStyle="secondary"
                  extendWidth
                  onClick={hideAll}
                />
              </Line>
            </>
          ) : (
            <TextArea minHeight={60} text="NO TAG GROUP SELECTED" />
          )}
        </>
      </Panel>
    </ThemeProvider>
  );
};

export default App;
