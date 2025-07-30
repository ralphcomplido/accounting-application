import { AppRoute } from "../../core/routing/models/app-route";

export const Routes: AppRoute[] = [
  { path: "", title: "User | Home", data: { alias: "user-home" }, loadComponent: () => import("./index/index.component").then(m => m.IndexComponent) },
];
