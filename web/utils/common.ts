export function postMsg(act: string, payload?: any) {
  (globalThis as any).parent.postMessage(
    {
      act,
      payload,
    },
    "*"
  );
}
export const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  year: "2-digit",
  month: "short",
});

export const timeFormat = new Intl.DateTimeFormat("ja-JP-u-ca-japanese", {
  timeStyle: "long",
});
