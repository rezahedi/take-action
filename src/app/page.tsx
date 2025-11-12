import { MissionCard } from "@/components/ui/MissionCard";
import { getMissions } from "@/lib/data/missions";

export default async function Home() {
  const missions = await getMissions();
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        {missions.map(({ id, title, createdAt, author, summary }) => (
          <MissionCard
            title={title}
            author={author ? author : "Unknown"}
            date={createdAt}
            summary={summary ?? ""}
            href={`/mission/${id}`}
            key={id}
          />
        ))}
      </main>
    </div>
  );
}
