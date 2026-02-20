import type { Context } from "hono";

import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-toolkit";

import type { AppBindings } from "@/shared/types";

import * as contracts from "@/modules/property-images/property-images.contracts";
import { propertyImagesService } from "@/modules/property-images/property-images.service";
import { createRouter } from "@/shared/create-app";

const checkOwner = (c: Context<AppBindings>) => {
  const owner = c.get("owner");
  if (!owner)
    throw new HTTPException(StatusCodes.UNAUTHORIZED, {
      message: "Unauthorized",
    });
  return owner;
};

const router = createRouter().openapi(contracts.deleteImage, async (c) => {
  const owner = checkOwner(c);
  const { id } = c.req.valid("param");
  await propertyImagesService.delete(id, owner.id);
  return c.json({ success: true }, StatusCodes.OK);
});

export type AppType = typeof router;

export default router;
