import prisma from '@/prisma/db';
import { Metadata } from 'next';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { notFound } from 'next/navigation';
import { PersonChart } from '../components/charts/PersonChart';
import { Person } from '../components/Person';

export const revalidate = 3600; // revalidate at most every hour

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({ params: { username } }: PageProps): Promise<Metadata> {
  const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_BASE_URL);
  ogImageUrl.searchParams.append('name', username);

  return {
    openGraph: {
      title: `${username}'s stats`,
      images: [
        {
          url: ogImageUrl.href,
          width: 1200,
          height: 630,
          alt: `Open Graph image ${username}'s weight loss journey`,
        },
      ],
      type: 'profile',
    },
  };
}

export default async function Page({ params: { username } }: PageProps) {
  const user = await prisma.user.findUnique({
    where: {
      // Capitalize the first letter of the name
      name: username.charAt(0).toUpperCase() + username.slice(1),
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
    notFound();
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/losers">Overview</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Person user={user} />
        <PersonChart user={user} />
      </div>
    </div>
  );
}
