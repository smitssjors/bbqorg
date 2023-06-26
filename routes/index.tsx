import { Head } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>BBQ Org</title>
      </Head>
      <p class="my-6">Here you can organize events</p>
      <a href="/new">New event</a>
    </>
  );
}
