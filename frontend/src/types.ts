export enum VendorCategory {
  STAFFING_AGENCY = "Staffing Agency",
  FREELANCE_PLATFORM = "Freelance Platform",
  CONSULTANT = "Consultant",
}

export enum VendorStatus {
  PENDING = "Pending Approval",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export type Vendor = {
  id: string;
  name: string;
  category: VendorCategory;
  contact_email: string;
  status: VendorStatus;
}

export type VendorCreate = {
  name: string;
  category: VendorCategory;
  contact_email: string;
}
