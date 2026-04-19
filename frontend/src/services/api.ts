import { VendorCategory } from '../types';
import type { Vendor, VendorCreate } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = {
  async getVendors(category?: VendorCategory): Promise<Vendor[]> {
    const url = new URL(`${API_BASE_URL}/vendors`);
    if (category) {
      url.searchParams.append('category', category);
    }
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('Failed to fetch vendors');
    }
    return response.json();
  },

  async createVendor(vendor: VendorCreate): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendor),
    });
    if (!response.ok) {
      throw new Error('Failed to create vendor');
    }
    return response.json();
  },

  async approveVendor(id: string): Promise<Vendor> {
    const response = await fetch(`${API_BASE_URL}/vendors/${id}/approve`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to approve vendor');
    }
    return response.json();
  },
};
