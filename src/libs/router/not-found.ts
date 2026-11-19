import { data } from 'react-router';

/** Throw from a route loader/component to render the 404 ErrorPage inside the layout. */
export function notFound(message = 'Not Found'): never {
  throw data({ message }, { status: 404, statusText: 'Not Found' });
}
