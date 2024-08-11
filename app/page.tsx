export default function Home() {
  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">vanbeek.dev</h1>
          <p className="text-muted-foreground">
            Hi! 👋🏼 my name is Bjorn van beek,
            {' '}
            <br />
            {' '}
            I&apos;m a dev from 🇳🇱
          </p>
        </div>
      </div>
    </main>
  );
}
