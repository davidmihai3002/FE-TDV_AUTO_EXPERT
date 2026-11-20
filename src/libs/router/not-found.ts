import { data } from 'react-router';

export function notFound(message = 'Not Found'): never {
  throw data({ message }, { status: 404, statusText: 'Not Found' });
}
