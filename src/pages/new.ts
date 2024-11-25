import type { APIRoute } from 'astro';
import { createApology } from '@/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const json = await request.json();

    const { status, data = [{ id: undefined }] } = await createApology(
      json.data,
      json.img
    );

    const id = data?.[0]?.id;

    if (status >= 400 || !id) {
      throw new Error(`400 error data: ${JSON.stringify(json.data)}`);
    }

    return new Response(id, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch(err) {
    console.error(err);
    return new Response('you are not sincerely enough', {
      status: 418,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
