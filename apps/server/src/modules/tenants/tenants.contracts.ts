import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-toolkit";

import { selectLeaseSchema } from "@/modules/leases/leases.schema";
import {
  createTenantSchema,
  selectTenantSchema,
  updateTenantSchema,
} from "@/modules/tenants/tenants.schema";
import {
  IdParamsSchema,
  createErrorSchema,
  internalServerErrorSchema,
  jsonContent,
  jsonContentRequired,
  notFoundSchema,
  unauthorizedSchema,
} from "@/shared/openapi-helpers";

export const list = createRoute({
  path: "/api/owners/tenants",
  method: "get",
  tags: ["Tenants"],
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(selectTenantSchema),
      }),
      "List of tenants",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const create = createRoute({
  path: "/api/owners/tenants",
  method: "post",
  tags: ["Tenants"],
  request: {
    body: jsonContentRequired(createTenantSchema, "Create tenant"),
  },
  responses: {
    [StatusCodes.CREATED]: jsonContent(
      z.object({
        data: selectTenantSchema,
      }),
      "Created tenant",
    ),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createTenantSchema),
      "Validation error(s)",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
    [StatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      internalServerErrorSchema,
      "Internal server error",
    ),
  },
});

export const getOne = createRoute({
  path: "/api/owners/tenants/{id}",
  method: "get",
  tags: ["Tenants"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: selectTenantSchema,
      }),
      "Tenant details",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Tenant not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid tenant ID",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const update = createRoute({
  path: "/api/owners/tenants/{id}",
  method: "patch",
  tags: ["Tenants"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updateTenantSchema, "Update tenant"),
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: selectTenantSchema,
      }),
      "Updated tenant",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Tenant not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateTenantSchema).or(
        createErrorSchema(IdParamsSchema),
      ),
      "Validation error(s)",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const listLeases = createRoute({
  path: "/api/owners/tenants/{id}/leases",
  method: "get",
  tags: ["Tenants"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(selectLeaseSchema),
      }),
      "Tenant leases",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Tenant not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid tenant ID",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Internal server error",
    ),
  },
});
