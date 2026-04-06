import { eq, and } from "drizzle-orm";
import { db } from "../../../shared/database/connection";
import { BadRequestException, NotFoundException, ForbiddenException } from "../../../shared/errors/error.core";
import { sellerProfiles } from "../models";
import bcrypt from "bcrypt";
import { users } from "../../auth/models";
import { RegisterSellerPayload, ApplyAsSellerPayload } from "../schemas/seller.schema";
import { assignRoleToUser } from "../../../shared/utils/assignRole";
import { jwtproviders } from "../../../shared/utils/jwt.provider";
import { getUserAccess } from "../../../shared/utils/getUserAccess";

class SellerService {
  public async registerSeller(data: RegisterSellerPayload) {
    const { name, email, password, businessName, phone, taxId, address, businessType } = data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashPassword,
        isActive: true,
      })
      .returning();

    await db
      .insert(sellerProfiles)
      .values({
        userId: newUser.id,
        businessName,
        phone,
        taxId,
        address,
        businessType,
        status: "pending",
      })
      .returning();

    await assignRoleToUser(newUser.id, "customer");

    const { roles, permissions } = await getUserAccess(newUser.id);

    const payload = {
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      roles,
      permissions,
    };

    const accessToken = await jwtproviders.generateToken(payload);
    const refreshToken = await jwtproviders.generateRefreshToken(payload);

    return { accessToken, refreshToken, payload };
  }

  public async applyAsSeller(userId: string, data: ApplyAsSellerPayload) {
    const { businessName, phone, taxId, address, businessType } = data;

    const existingProfile = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId));

    if (existingProfile.length > 0) {
      const profile = existingProfile[0];

      if (profile.status === "pending") {
        throw new BadRequestException("You already have a pending seller application");
      }

      if (profile.status === "approved") {
        throw new BadRequestException("You are already an approved seller");
      }

      await db
        .update(sellerProfiles)
        .set({
          businessName,
          phone,
          taxId,
          address,
          businessType,
          status: "pending",
          rejectionReason: null,
          rejectedAt: null,
        })
        .where(eq(sellerProfiles.userId, userId));

      return {
        message: "Your seller application has been resubmitted and is pending approval",
      };
    }

    await db
      .insert(sellerProfiles)
      .values({
        userId,
        businessName,
        phone,
        taxId,
        address,
        businessType,
        status: "pending",
      })
      .returning();

    return {
      message: "Your seller application has been submitted and is pending approval",
    };
  }

  public async getSellerProfile(userId: string) {
    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId));

    if (!profile) {
      return null;
    }

    const [user] = await db
      .select({ name: users.name, email: users.email })
      .from(users)
      .where(eq(users.id, userId));

    return {
      id: profile.id,
      userId: profile.userId,
      businessName: profile.businessName,
      phone: profile.phone,
      taxId: profile.taxId,
      address: profile.address,
      businessType: profile.businessType,
      status: profile.status,
      rejectionReason: profile.rejectionReason,
      createdAt: profile.createdAt,
      user: user || null,
    };
  }

  public async getPendingSellers() {
    const pendingProfiles = await db
      .select({
        id: sellerProfiles.id,
        businessName: sellerProfiles.businessName,
        phone: sellerProfiles.phone,
        taxId: sellerProfiles.taxId,
        address: sellerProfiles.address,
        businessType: sellerProfiles.businessType,
        status: sellerProfiles.status,
        createdAt: sellerProfiles.createdAt,
        userId: sellerProfiles.userId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(sellerProfiles)
      .leftJoin(users, eq(sellerProfiles.userId, users.id))
      .where(eq(sellerProfiles.status, "pending"));

    return pendingProfiles;
  }

  public async approveSeller(userId: string) {
    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId));

    if (!profile) {
      throw new NotFoundException("Seller profile not found");
    }

    if (profile.status === "approved") {
      throw new BadRequestException("This seller is already approved");
    }

    if (profile.status === "rejected") {
      throw new BadRequestException("This seller was rejected. They must reapply before approval.");
    }

    await db
      .update(sellerProfiles)
      .set({
        status: "approved",
        updatedAt: new Date(),
      })
      .where(eq(sellerProfiles.userId, userId));

    await assignRoleToUser(userId, "seller");

    return {
      message: "Seller has been approved successfully",
    };
  }

  public async rejectSeller(userId: string, reason: string) {
    const [profile] = await db
      .select()
      .from(sellerProfiles)
      .where(eq(sellerProfiles.userId, userId));

    if (!profile) {
      throw new NotFoundException("Seller profile not found");
    }

    if (profile.status === "rejected") {
      throw new BadRequestException("This seller is already rejected");
    }

    if (profile.status === "pending") {
      await db
        .update(sellerProfiles)
        .set({
          status: "rejected",
          rejectionReason: reason,
          rejectedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(sellerProfiles.userId, userId));

      return {
        message: "Seller application has been rejected",
      };
    }

    throw new BadRequestException("Only pending sellers can be rejected");
  }
}

export const sellerService = new SellerService();
