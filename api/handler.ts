import type { IncomingMessage, ServerResponse } from "http";
import app from "../artifacts/api-server/src/app";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return app(req as any, res as any);
}
