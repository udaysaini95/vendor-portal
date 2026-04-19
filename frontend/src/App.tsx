import { useState, useEffect } from 'react';
import { api } from './services/api';
import { VendorCategory, VendorStatus } from './types';
import type { Vendor } from './types';
import './index.css';

function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    category: VendorCategory.STAFFING_AGENCY,
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const data = await api.getVendors();
      setVendors(data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createVendor(formData);
      setFormData({
        name: '',
        contact_email: '',
        category: VendorCategory.STAFFING_AGENCY,
      });
      await fetchVendors();
    } catch (error) {
      console.error('Error creating vendor:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.approveVendor(id);
      await fetchVendors();
    } catch (error) {
      console.error('Error approving vendor:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Vendor Portal</h1>
        <p className="subtitle">Seamless vendor onboarding and management</p>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Register Vendor</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Business Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter business name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Contact Email</label>
              <input
                id="email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as VendorCategory })}
              >
                {Object.values(VendorCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Registering...' : 'Register Vendor'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Existing Vendors</h2>
          {loading ? (
            <div className="loading">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="empty-state">
              <p>No vendors registered yet.</p>
            </div>
          ) : (
            <div className="vendor-list">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="vendor-item">
                  <div className="vendor-info">
                    <h3>{vendor.name}</h3>
                    <p>{vendor.category} • {vendor.contact_email}</p>
                    <span className={`badge ${vendor.status === VendorStatus.APPROVED ? 'badge-approved' : 'badge-pending'}`}>
                      {vendor.status}
                    </span>
                  </div>
                  {vendor.status === VendorStatus.PENDING && (
                    <button 
                      className="approve-btn"
                      onClick={() => handleApprove(vendor.id)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
