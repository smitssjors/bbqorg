import { Head } from "$fresh/runtime.ts";
import { Handlers } from "$fresh/server.ts";
import { createEvent } from "@lib/db.ts";
import { redirect } from "@lib/util.ts";

export const handler: Handlers = {
  POST: async (req) => {
    const form = await req.formData();

    const what = form.get("what")!.toString();
    const where = form.get("where")!.toString();
    const when = new Date(form.get("when")!.toString());

    const id = await createEvent({ what, where, when });
    return redirect(`/${id}`);
  },
};

export default function New() {
  return (
    <>
      <Head>
        <title>New event</title>
      </Head>
      <form method="post">
        <label>
          What: <input required type="text" name="what" />
        </label>
        <label>
          Where: <input required type="text" name="where" />
        </label>
        <label>
          When: <input required type="datetime-local" name="when" />
        </label>
        <button>Submit</button>
      </form>
    </>
  );
}
