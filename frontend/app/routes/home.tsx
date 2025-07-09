import type { Route } from "./+types/home";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

const technologies = [
  "React",
  "React Router",
  "Tailwind CSS",
  "Shadcn UI",
  "Tanstack Query",
  "PHP",
];

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Konovo Zadatak" },
    { name: "description", content: "Konovo Zadatak" },
  ];
}

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Zadatak - Konovo
        </h1>

        <Separator className="my-12" />

        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Technologies Used
          </h2>

          <ul className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {technologies.map((tech) => (
              <li key={tech}>
                <Badge variant="secondary">{tech}</Badge>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
