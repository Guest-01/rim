import EventEmitter from 'events';
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

class Counter extends EventEmitter {
  count: number;

  constructor(count = 0) {
    super();
    this.count = count;
    return;
  }

  setCount(count: number) {
    this.count = count;
    this.emit("change", this.count);
  }
}

export const counter = new Counter(0);

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  counter.addListener("change", (count) => {
    console.log("change!", count);
    res.write(`data: ${count}\n\n`);
  })

  res.on('close', () => {
    res.end();
  })
}