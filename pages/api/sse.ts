import EventEmitter from 'events';
import type { NextApiRequest, NextApiResponse } from 'next';

export const notifySSE = new EventEmitter();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  res.write(`data: SSE connected\n\n`);

  const notifyListener = (msg: any) => {
    if (res.writableEnded) return;

    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  };

  notifySSE.addListener('notify', notifyListener);

  res.on('close', () => {
    notifySSE.removeListener('notify', notifyListener);
    res.end();
  });
}
