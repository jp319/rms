import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-toolkit";

import {
  createPropertySchema,
  getPropertyWithFullRelationshipSchema,
  selectPropertySchema,
  updatePropertySchema,
} from "@/modules/properties/properties.schema";
import {
  createPropertyImageSchema,
  getUploadUrlSchema,
  selectPropertyImageSchema,
} from "@/modules/property-images/property-images.schema";
import {
  createUnitSchema,
  selectUnitSchema,
} from "@/modules/units/units.schema";
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
  path: "/api/owners/properties",
  method: "get",
  tags: ["Properties"],
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(getPropertyWithFullRelationshipSchema),
      }),
      "List of properties",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const create = createRoute({
  path: "/api/owners/properties",
  method: "post",
  tags: ["Properties"],
  request: {
    body: jsonContentRequired(createPropertySchema, "Create a new property"),
  },
  responses: {
    [StatusCodes.CREATED]: jsonContent(
      z.object({
        data: selectPropertySchema,
      }),
      "Created property",
    ),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createPropertySchema),
      "The validation error(s)",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
    [StatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(internalServerErrorSchema),
      "Internal Server Error",
    ),
  },
});

export const getOne = createRoute({
  path: "/api/owners/properties/{id}",
  method: "get",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: selectPropertySchema,
      }),
      "Property details",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const update = createRoute({
  path: "/api/owners/properties/{id}",
  method: "patch",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(updatePropertySchema, "Update a property"),
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: selectPropertySchema,
      }),
      "Updated property",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updatePropertySchema).or(
        createErrorSchema(IdParamsSchema),
      ),
      "Validation error(s)",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const listUnits = createRoute({
  path: "/api/owners/properties/{id}/units",
  method: "get",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({
        data: z.array(selectUnitSchema),
      }),
      "List of units",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid ID",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const createUnit = createRoute({
  path: "/api/owners/properties/{id}/units",
  method: "post",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(createUnitSchema, "Create a unit"),
  },
  responses: {
    [StatusCodes.CREATED]: jsonContent(
      z.object({
        data: selectUnitSchema,
      }),
      "Created unit",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createUnitSchema).or(createErrorSchema(IdParamsSchema)),
      "Validation error(s)",
    ),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
    [StatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      createErrorSchema(internalServerErrorSchema),
      "Internal Server Error",
    ),
  },
});

export const getImageUploadUrl = createRoute({
  path: "/api/owners/properties/{id}/images/presigned-url",
  method: "post",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(getUploadUrlSchema, "Create image upload URL"),
  },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({ uploadUrl: z.string(), key: z.string() }),
      "Presigned URL generated",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const createPropertyImage = createRoute({
  path: "/api/owners/properties/{id}/images",
  method: "post",
  tags: ["Properties"],
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(createPropertyImageSchema, "Image metadata"),
  },
  responses: {
    [StatusCodes.CREATED]: jsonContent(
      z.object({ data: selectPropertyImageSchema }),
      "Image saved",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});

export const listPropertyImages = createRoute({
  path: "/api/owners/properties/{id}/images",
  method: "get",
  tags: ["Properties"],
  request: { params: IdParamsSchema },
  responses: {
    [StatusCodes.OK]: jsonContent(
      z.object({ data: z.array(selectPropertyImageSchema) }),
      "List images",
    ),
    [StatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Property not found"),
    [StatusCodes.UNAUTHORIZED]: jsonContent(unauthorizedSchema, "Unauthorized"),
  },
});
