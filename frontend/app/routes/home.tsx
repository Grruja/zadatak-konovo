import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Konovo Zadatak" },
    { name: "description", content: "Konovo Zadatak" },
  ];
}

export default function Home() {
  return <Welcome />;
}
