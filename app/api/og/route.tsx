import prisma from '@/prisma/db';
import { ImageResponse } from 'next/og';
import { WeightLossOgImage } from '@/components/WeightLossOgImage';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const name = searchParams.get('name');

    if (!name) {
      return new Response('Missing name parameter', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        // Capitalize the first letter of the name
        name: name.charAt(0).toUpperCase() + name.slice(1),
      },
      include: {
        measurements: {
          orderBy: {
            date: 'asc',
          },
        },
      },
    });

    if (!user) {
      return new Response('User not found', { status: 404 });
    }

    return new ImageResponse(
      (
        <WeightLossOgImage user={user} />
      ),
      {
        width: 400,
        height: 300,
      },
    );
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
