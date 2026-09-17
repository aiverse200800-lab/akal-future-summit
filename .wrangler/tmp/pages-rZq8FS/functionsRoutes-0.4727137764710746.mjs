import { onRequestPost as __api_register_ts_onRequestPost } from "E:\\Akal-Future-Founders-Summit\\functions\\api\\register.ts"

export const routes = [
    {
      routePath: "/api/register",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_register_ts_onRequestPost],
    },
  ]