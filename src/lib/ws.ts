export type WSMessage = { channel?: string; type?: string; sessionId?: string; payload?: any };

export const connectWs = () => {
  const loc = window.location;
  const proto = loc.protocol === "https:" ? "wss" : "ws";
  const base = `${proto}://${loc.host}`;
  const url = `${base}/api/v1/ws`;
  return new WebSocket(url);
};
