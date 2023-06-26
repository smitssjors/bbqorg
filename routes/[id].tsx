import { Handlers, PageProps } from "$fresh/server.ts";
import AddItem from "../islands/AddItem.tsx";
import ItemList from "../islands/ItemList.tsx";
import { Event, getEvent, getItems, Item } from "@lib/db.ts";

interface EventPageData {
  event: Event;
  items: Item[];
}

export const handler: Handlers<EventPageData> = {
  GET: async (_req, ctx) => {
    const { id } = ctx.params;
    const [event, items] = await Promise.all([getEvent(id), getItems(id)]);
    return event ? ctx.render({ event, items }) : ctx.renderNotFound();
  },
};

export default function Event(props: PageProps<EventPageData>) {
  const { event, items } = props.data;
  const dateFormatter = new Intl.DateTimeFormat("en-UK", {
    timeStyle: "short",
    dateStyle: "short",
  });

  return (
    <>
      <p>What: {event.what}</p>
      <p>Where: {event.where}</p>
      <p>When: {dateFormatter.format(event.when)}</p>
      <AddItem eventId={props.params.id} />
      <ItemList eventId={props.params.id} initialItems={items} />
    </>
  );
}
