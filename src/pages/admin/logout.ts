import type { APIRoute } from 'astro';
import { createLogoutCookie } from '../../lib/auth';

export const POST: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/login',
      'Set-Cookie': createLogoutCookie(),
    },
  });
};
