import { axiosInstance } from ".";

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  phone: string | null;
  taxId: string | null;
  address: string | null;
  businessType: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export const sellerApi = {
  getProfile() {
    return axiosInstance.get<SellerProfile>("/seller/profile");
  },
};