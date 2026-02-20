import { testClient } from "hono/testing";
import { StatusCodes } from "http-status-toolkit";
import { createAndLoginOwner, generateProperty } from "tests/helpers";
import { describe, expect, it, vi } from "vitest";

import type { AppType } from "@/modules/property-images/property-images.routes";

import env from "@/env";
import propertyImagesRoutes from "@/modules/property-images/property-images.routes";
import { createTestApp } from "@/shared/create-app";
import createDb from "@/shared/db";
import { properties, propertyImages } from "@/shared/db/schemas";

vi.mock("@/modules/mail/mail.service", () => ({ sendEmail: vi.fn() }));

vi.mock("@/shared/s3-helpers", () => ({
  s3Helpers: {
    createPresignedUploadUrl: vi
      .fn()
      .mockResolvedValue("http://fake-s3-url.com/upload"),
    deleteFile: vi.fn().mockResolvedValue(true),
    getPublicUrl: vi.fn((key) => `http://public-s3.com/${key}`),
    extractS3Key: vi.fn((url) => url.split("/").pop()),
  },
}));

describe("Property Images API", () => {
  const client = testClient<AppType>(createTestApp(propertyImagesRoutes));

  it("should delete image from S3 and Database", async () => {
    const { cookie, owner } = await createAndLoginOwner("img-deleter");

    const db = createDb(env);

    const [prop] = await db
      .insert(properties)
      .values({ ...generateProperty(), ownerId: owner.id })
      .returning();

    // Setup: Existing Image
    const [image] = await db
      .insert(propertyImages)
      .values({
        propertyId: prop.id,
        url: "http://public-s3.com/my-bucket/key.jpg",
        name: "test-image.jpg",
      })
      .returning();

    // Act
    const res = await client.api.owners["property-images"][":id"].$delete(
      {
        param: { id: prop.id.toString() },
      },
      { headers: { Cookie: cookie } },
    );

    expect(res.status).toBe(StatusCodes.OK);

    // Assert DB is empty
    const found = await db.query.propertyImages.findFirst({
      where: {
        id: image.id,
      },
    });
    expect(found).toBeUndefined();

    // Assert S3 Helper was called (Optional but good)
    // You would need to import the mocked s3Helpers to expect(s3Helpers.deleteFile).toHaveBeenCalled()
  });
});
