import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  layout("layouts/GuestLayout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
  ]),
  layout("layouts/AuthenticatedLayout.tsx", [
    route("products", "routes/products.tsx"),
    route("products/:id", "routes/product-detail.tsx"),
  ]),
] satisfies RouteConfig;
