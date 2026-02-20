import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-toolkit";

import type { CreateUnitInput } from "@/modules/units/units.schema";

import { propertiesRepository } from "@/modules/properties/properties.repository";
import {
  type CreatePropertyInput,
  type UpdatePropertyInput,
} from "@/modules/properties/properties.schema";
import { unitsRepository } from "@/modules/units/units.repository";

export const propertiesService = {
  list: async (ownerId: number) => {
    return await propertiesRepository.findManyByOwnerId(ownerId);
  },

  create: async (ownerId: number, data: CreatePropertyInput) => {
    const created = await propertiesRepository.create(ownerId, data);

    if (!created) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Failed to create property",
      });
    }

    return created;
  },

  get: async (propertyId: number, ownerId: number) => {
    const property = await propertiesRepository.findByIdAndOwnerId(
      propertyId,
      ownerId,
    );

    if (!property) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Property not found",
      });
    }

    return property;
  },

  update: async (
    propertyId: number,
    ownerId: number,
    data: UpdatePropertyInput,
  ) => {
    const updated = await propertiesRepository.update(
      propertyId,
      ownerId,
      data,
    );

    if (!updated) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Property not found or unauthorized",
      });
    }

    return updated;
  },

  listUnits: async (propertyId: number, ownerId: number) => {
    const property = await propertiesRepository.findByIdAndOwnerId(
      propertyId,
      ownerId,
    );

    if (!property) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Property not found",
      });
    }

    return await unitsRepository.findManyByPropertyId(propertyId);
  },

  createUnit: async (
    propertyId: number,
    ownerId: number,
    data: CreateUnitInput,
  ) => {
    const property = await propertiesRepository.findByIdAndOwnerId(
      propertyId,
      ownerId,
    );

    if (!property) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Property not found",
      });
    }

    const created = await unitsRepository.create(propertyId, data);

    if (!created) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Failed to create unit",
      });
    }

    return created;
  },
};
