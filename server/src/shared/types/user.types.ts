export interface UserResponse {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserWithRole extends UserResponse {
  role: {
    id: string;
    name: string;
    slug: string;
  };
}
