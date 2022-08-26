import html from "../../dist/web/eventtester/index.html?raw";

(globalThis as any).reearth.ui.show(html, { width: 312, height: 46 });

(globalThis as any).reearth.on("mousemove", (mousedata: any) => {
  (globalThis as any).reearth.ui.postMessage(mousedata);
});
