import { nanoid } from "nanoid";

const kv = await Deno.openKv();

export interface Event {
  what: string;
  where: string;
  when: Date;
}

export async function createEvent(
  event: Event,
): Promise<string> {
  const id = nanoid(10);
  const key = ["events", id];

  const res = await kv.atomic()
    // Make sure the id has not been used yet
    .check({ key, versionstamp: null })
    .set(key, event)
    .commit();

  // This will probably never happen,
  // but if it does the code above needs to be refactored like in `addItem`.
  if (!res.ok) throw new Error(`Event with  id "${id}" already exists.`);

  return id;
}

export async function getEvent(id: string): Promise<Event | null> {
  const item = await kv.get<Event>(["events", id]);
  return item.value;
}

export interface Item {
  who: string;
  what: string;
  quantity?: string;
}

export async function addItem(eventId: string, item: Item): Promise<void> {
  // This makes sure that if two items are created at the exact same moment
  // one is stored after the other.
  let res: Awaited<ReturnType<Deno.AtomicOperation["commit"]>>;
  do {
    // Keys orderd by time created
    const key = ["items", eventId, Date.now()];
    res = await kv.atomic()
      .check({ key, versionstamp: null })
      .set(key, item)
      .commit();
  } while (!res.ok);
}

export async function getItems(eventId: string): Promise<Item[]> {
  const items: Item[] = [];
  for await (const item of kv.list<Item>({ prefix: ["items", eventId] })) {
    items.push(item.value);
  }
  return items;
}
