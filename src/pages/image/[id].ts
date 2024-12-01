import type { APIRoute } from 'astro';
import { uploadImage } from '@/db';


export const POST: APIRoute = async ({ request }) => {
  try {
    const blob = await request.blob();

    console.log('request.url', request.url);

    const [id] = request.url.match(/\/[^\/]+$/) ?? [];

    if (!id) {
      return new Response(null, {
        status: 406,
      });
    }

    const uploadRes = await uploadImage(blob, `${id}.jpg`);

    if (uploadRes.error) {
      return new Response(null, {
        status: 406,
      });
    }

    return new Response(null, {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response('you are not sincere enough', {
      status: 418,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
};
