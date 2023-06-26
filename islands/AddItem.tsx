import { useSignal } from "@preact/signals";
import { JSX } from "preact";

interface AddItemProps {
  eventId: string;
}

export default function AddItem(props: AddItemProps) {
  const who = useSignal("");
  const what = useSignal("");
  const quantity = useSignal<number | null>(null);

  function submit(e: JSX.TargetedEvent) {
    e.preventDefault();
    try {
      fetch(`/api/events/${props.eventId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "who": who.value,
          "what": what.value,
          "quantity": quantity.value,
        }),
      });
    } catch (error) {
      console.error("Failed to create item", error);
    }
  }
  return (
    <form onSubmit={submit}>
      <label>
        Who:{" "}
        <input
          required
          type="text"
          name="who"
          value={who}
          onChange={(e) => who.value = e.currentTarget.value}
        />
      </label>
      <label>
        What:{" "}
        <input
          required
          type="text"
          name="what"
          value={what}
          onChange={(e) => what.value = e.currentTarget.value}
        />
      </label>
      <label>
        How many:{" "}
        <input
          type="number"
          name="quantity"
          onChange={(e) => quantity.value = Number(e.currentTarget.value)}
        />
      </label>
      <button>Submit</button>
    </form>
  );
}
