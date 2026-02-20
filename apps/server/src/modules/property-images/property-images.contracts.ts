import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-toolkit";

import {
  IdParamsSchema,
  jsonContent,
  notFoundSchema,
  unauthorizedSchema,
} from "@/shared/openapi-helpers";

export const deleteImage = createRoute({
  path: "/api/owners/property-images/{id}",
  method: "delete",
  tags: ["Property Images"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({ success: z.boolean() }),
      "Image deleted",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Property Image not found",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});
