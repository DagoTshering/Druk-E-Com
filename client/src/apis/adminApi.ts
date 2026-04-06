import { axiosInstance } from ".";

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface PendingSeller {
  id: string;
  userId: string;
  businessName: string;
  phone: string | null;
  taxId: string | null;
  address: string | null;
  businessType: string | null;
  status: "pending";
  rejectionReason: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
}

export const adminApi = {
  getUsers() {
    return axiosInstance.get<User[]>("/admin/users");
  },
  getPendingSellers() {
    return axiosInstance.get<PendingSeller[]>("/admin/sellers/pending");
  },
  approveSeller(userId: string) {
    return axiosInstance.patch(`/admin/sellers/${userId}/approve`);
  },
  rejectSeller(userId: string, reason: string) {
    return axiosInstance.patch(`/admin/sellers/${userId}/reject`, { reason });
  },
};