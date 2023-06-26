import { Handlers } from "$fresh/server.ts";
import { addItem, Item } from "@lib/db.ts";

export const handler: Handlers = {
  GET: (_req, ctx) => {
    const channel = new BroadcastChannel(ctx.params.event);

    const stream = new ReadableStream({
      start: (controller) => {
        channel.onmessage = (message) => {
          const body = `data: ${JSON.stringify(message.data)}\n\n`;
          controller.enqueue(body);
        };
      },
      cancel: channel.close,
    });

    return new Response(stream.pipeThrough(new TextEncoderStream()), {
      headers: { "content-type": "text/event-stream" },
    });
  },
  POST: async (req, ctx) => {
    const eventId = ctx.params.event;
    const channel = new BroadcastChannel(eventId);

    const item = (await req.json()) as Item;

    // In the future I probably want to do this using the messaging API
    channel.postMessage(item);
    channel.close();
    await addItem(eventId, item);

    return new Response(null, { status: 201 });
  },
};
