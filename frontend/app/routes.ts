import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/GuestLayout.tsx", [
    index("routes/home.tsx"),
    route("register", "routes/register.tsx"),
    route("login", "routes/login.tsx"),
  ]),
  layout("layouts/AuthenticatedLayout.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
