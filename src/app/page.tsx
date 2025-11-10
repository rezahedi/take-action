import { MissionCard } from "@/components/ui/MissionCard";
import { getMissions } from "@/lib/data/missions";

export default async function Home() {
  const articles = await getMissions();
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        {articles.map(({ title, id, createdAt, content, author }) => (
          <MissionCard
            title={title}
            author={author ? author : "Unknown"}
            date={createdAt}
            summary={content.substring(0, 200)} // temporary
            href={`/mission/${id}`}
            key={id}
          />
        ))}
      </main>
    </div>
  );
}
