import Link from "next/link";

interface MissionCardProps {
  title: string;
  author: string;
  date: string;
  summary: string;
  href: string;
}

export function MissionCard({
  title,
  author,
  date,
  summary,
  href,
}: MissionCardProps) {
  return (
    <article>
      <header className="pb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{author}</span>
          <span>•</span>
          <span>{date}</span>
        </div>
        <h3 className="text-lg">{title}</h3>
      </header>
      <main className="py-0">
        <p>{summary}</p>
      </main>
      <footer className="pt-2">
        <Link
          href={href}
          className="text-blue-600 hover:underline text-sm font-medium w-fit"
        >
          Read mission &rarr;
        </Link>
      </footer>
    </article>
  );
}
