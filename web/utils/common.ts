export function postMsg(act: string, payload?: any) {
  (globalThis as any).parent.postMessage(
    {
      act,
      payload,
    },
    "*"
  );
}