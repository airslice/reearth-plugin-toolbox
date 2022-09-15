import Button from "@web/components/atoms/Button";
import Line from "@web/components/atoms/Line";
import Tag from "@web/components/atoms/Tag";
import TextArea from "@web/components/atoms/TextArea";
import DropdownBox from "@web/components/molecules/DropdownBox";
import Panel from "@web/components/molecules/Panel";
import type { Theme } from "@web/theme/common";
import ThemeProvider from "@web/theme/provider";
import type { actHandles } from "@web/types";
import { postMsg } from "@web/utils/common";
import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useReducer,
  useRef,
} from "react";

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

    postMsg("showLayers", visibleLayers);
    postMsg("hideLayers", invisibleLayers);
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
    postMsg("resize", [width, height]);
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
                      <Tag
                        text={tag.name}
                        key={tag.id}
                        status={tagStatus.current.get(tag.id) ? "on" : "off"}
                        onClick={() => {
                          toggleTag(tag.id);
                        }}
                      />
                    ))}
                  mainContent={tagGroup.tags
                    .filter((tag) => tagStatus.current.get(tag.id) === false)
                    .map((tag) => (
                      <Tag
                        text={tag.name}
                        key={tag.id}
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
                <Button extendWidth text="Search" onClick={filter} />
              </Line>
            </>
          ) : (
            <TextArea text="NO TAG GROUP SELECTED" />
          )}
        </>
      </Panel>
    </ThemeProvider>
  );
};

export default App;
