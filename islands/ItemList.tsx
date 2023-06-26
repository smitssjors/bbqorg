import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";

import type { Item } from "@lib/db.ts";

interface ItemListProps {
  eventId: string;
  initialItems: Item[];
}

export default function ItemList(props: ItemListProps) {
  const items = useSignal(props.initialItems);

  function addItem(item: Item) {
    items.value = [...items.value, item];
  }

  useEffect(() => {
    const events = new EventSource(`/api/events/${props.eventId}/items`);
    console.log("Opened sse");

    const listener = (event: MessageEvent) => {
      const item = JSON.parse(event.data) as Item;
      addItem(item);
    };

    events.addEventListener("message", listener);
    return () => events.removeEventListener("message", listener);
  });

  return (
    <>
      {items.value.length > 0 && (
        <ul>
          {items.value.map((item, index) => (
            <li key={index}>
              {item.who}, {item.what}
              {item.quantity ? `, ${item.quantity}` : ""}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
