import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border rounded px-3 py-2" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border rounded px-3 py-2" {...props} />;
const Select = (props: any) => <select className="w-full border rounded px-3 py-2" {...props} />;
const Checkbox = (props: any) => (
  <input type="checkbox" className="h-4 w-4 border rounded" {...props} />
);

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || id === 'new') {
      setForm({
        title: "",
        description: "",
        propertyType: "",
        status: "available",
        price: "",
        currency: "NGN",
        address: "",
        city: "",
        state: "",
        country: "Nigeria",
        zipCode: "",
        latitude: "",
        longitude: "",
        bedrooms: "",
        bathrooms: "",
        squareFeet: "",
        yearBuilt: "",
        listingType: "",
        featured: false,
      });
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/properties/${id}`);
        const item = res.data?.data?.item || res.data?.data;
        setForm({
          title: item?.title ?? "",
          description: item?.description ?? "",
          propertyType: item?.property_type ?? "",
          status: item?.status ?? "available",
          price: item?.price ?? "",
          currency: item?.currency ?? "NGN",
          address: item?.address ?? "",
          city: item?.city ?? "",
          state: item?.state ?? "",
          country: item?.country ?? "Nigeria",
          zipCode: item?.zip_code ?? "",
          latitude: item?.latitude ?? "",
          longitude: item?.longitude ?? "",
          bedrooms: item?.bedrooms ?? "",
          bathrooms: item?.bathrooms ?? "",
          squareFeet: item?.square_feet ?? "",
          yearBuilt: item?.year_built ?? "",
          listingType: item?.listing_type ?? "",
          featured: item?.featured ?? false,
        });
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load property");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        propertyType: form.propertyType || undefined,
        status: form.status || undefined,
        price: form.price ? Number(form.price) : undefined,
        currency: form.currency || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        zipCode: form.zipCode || undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        squareFeet: form.squareFeet ? Number(form.squareFeet) : undefined,
        yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
        listingType: form.listingType || undefined,
        featured: Boolean(form.featured),
      };
      const promise = id === 'new' ? api.post('/properties', payload) : api.patch(`/properties/${id}`, payload);
      await promise;
      toast.success(`Property ${id === 'new' ? 'created' : 'updated'} successfully`);
      navigate(`/admin/properties`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">{id === 'new' ? 'Create Property' : 'Edit Property'}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div><label className="block text-sm font-medium mb-1">Title</label><Input name="title" value={form.title || ''} onChange={handleChange} /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description || ''} onChange={handleChange} rows={5} /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Property Type</label>
            <Select name="propertyType" value={form.propertyType || ''} onChange={handleChange}>
              <option value="">Select type</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="service_outlet">Service Outlet</option>
              <option value="airbnb">Airbnb</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Listing Type</label>
            <Select name="listingType" value={form.listingType || ''} onChange={handleChange}>
              <option value="">Select listing</option>
              <option value="sale">Sale</option>
              <option value="rent">Rent</option>
              <option value="lease">Lease</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select name="status" value={form.status || 'available'} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div><label className="block text-sm font-medium mb-1">Price</label><Input type="number" name="price" value={form.price || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Currency</label><Input name="currency" value={form.currency || 'NGN'} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Bedrooms</label><Input type="number" name="bedrooms" value={form.bedrooms || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Bathrooms</label><Input type="number" name="bathrooms" value={form.bathrooms || ''} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Square Feet</label><Input type="number" name="squareFeet" value={form.squareFeet || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Year Built</label><Input type="number" name="yearBuilt" value={form.yearBuilt || ''} onChange={handleChange} /></div>
          <div className="flex items-center gap-2 pt-6">
            <Checkbox name="featured" checked={Boolean(form.featured)} onChange={handleCheckbox} />
            <span className="text-sm">Featured</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Address</label><Input name="address" value={form.address || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">City</label><Input name="city" value={form.city || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">State</label><Input name="state" value={form.state || ''} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Country</label><Input name="country" value={form.country || ''} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Zip Code</label><Input name="zipCode" value={form.zipCode || ''} onChange={handleChange} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Latitude</label><Input name="latitude" value={form.latitude || ''} onChange={handleChange} /></div>
            <div><label className="block text-sm font-medium mb-1">Longitude</label><Input name="longitude" value={form.longitude || ''} onChange={handleChange} /></div>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </form>
    </div>
  );
}
