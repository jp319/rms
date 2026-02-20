import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-toolkit";

import type {
  CreateTenantInput,
  UpdateTenantInput,
} from "@/modules/tenants/tenants.schema";

import { leasesRepository } from "@/modules/leases/leases.repository";
import { tenantsRepository } from "@/modules/tenants/tenants.repository";

export const tenantsService = {
  list: async (ownerId: number) => {
    return await tenantsRepository.findManyByOwnerId(ownerId);
  },
  create: async (ownerId: number, input: CreateTenantInput) => {
    const created = await tenantsRepository.create(ownerId, input);

    if (!created) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Failed to create property",
      });
    }

    return created;
  },
  get: async (id: number, ownerId: number) => {
    const tenant = await tenantsRepository.findByIdAndOwnerId(id, ownerId);

    if (!tenant) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Tenant not found",
      });
    }

    return tenant;
  },
  update: async (id: number, ownerId: number, input: UpdateTenantInput) => {
    const tenant = await tenantsRepository.findByIdAndOwnerId(id, ownerId);

    if (!tenant) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Tenant not found",
      });
    }

    const udpated = await tenantsRepository.update(id, input);

    if (!udpated) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Failed to update tenant",
      });
    }

    return udpated;
  },
  listLeases: async (id: number, ownerId: number) => {
    const tenant = await tenantsRepository.findByIdAndOwnerId(id, ownerId);

    if (!tenant) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Tenant not found",
      });
    }

    const leases = await leasesRepository.findManyByOwnerAndTenantId(
      ownerId,
      id,
    );

    return leases;
  },
};
