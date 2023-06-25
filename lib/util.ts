import { RedirectStatus, Status } from "$std/http/http_status.ts";

export function redirect(
  location: string,
  status: Status.Created | RedirectStatus = Status.Found,
) {
  return new Response(null, { headers: { location }, status });
}
