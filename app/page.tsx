import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight">vanbeek.dev</h1>
          <p className="text-muted-foreground">
            Hi! 👋🏼 my name is Bjorn van beek,
            {' '}
            <br />
            {' '}
            I&apos;m a dev from 🇳🇱
          </p>

          <div className="grid gap-2">
            <h2 className="text-xl font-bold">Projects</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/card-counter" className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Card Counter</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">A simple app to track scores during a physical cardgame</p>
              </Link>
              <Link href="/losers" className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Weightloss Dashboard</h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">A page to work towards a weightloss goal together!</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
