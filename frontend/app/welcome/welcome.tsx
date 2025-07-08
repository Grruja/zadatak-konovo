import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

const frontendTech = [
  "React",
  "React Router",
  "Tailwind CSS",
  "Shadcn UI",
  "Tanstack Query",
];
const backendTech = ["PHP", "Laravel", "MySQL"];

export function Welcome() {
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

          <div className="mt-6">
            <h3 className="text-xl font-medium">Frontend</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {frontendTech.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-medium">Backend</h3>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
              {backendTech.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button variant="outline" asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild size="lg">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
