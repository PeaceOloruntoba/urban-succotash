import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { Building2 } from "lucide-react";
import { usePropertiesStore } from "../../../stores/properties";

const Input = (props: any) => <input className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800" {...props} />;
const Select = (props: any) => <select className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800" {...props} />;
const Checkbox = (props: any) => <input type="checkbox" className="h-4 w-4 border-slate-300 rounded" {...props} />;

export default function AdminPropertyCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
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
    featured: false,
  });

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
      const createProperty = usePropertiesStore.getState().createProperty;
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
      const item = await createProperty(payload);
      const createdId = item?.id;
      toast.success("Property created");
      navigate(`/admin/properties/${createdId}/edit`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Create Property</h1>
            <p className="text-slate-600">Add a new property and then upload images.</p>
          </div>
          <Link to="/admin/properties" className="text-blue-800 hover:underline">Back to list</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-blue-900">Basics</h2>
            </div>
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <Input name="title" value={form.title} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Property Type</label>
                <Select name="propertyType" value={form.propertyType} onChange={handleChange} required>
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="service_outlet">Service Outlet</option>
                  <option value="airbnb">Airbnb</option>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <Textarea name="description" value={form.description} onChange={handleChange} rows={5} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-blue-900">Pricing & Status</h2>
            </div>
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Listing Type</label>
                <Select name="listingType" value={form.listingType} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="sale">Sale</option>
                  <option value="rent">Rent</option>
                  <option value="lease">Lease</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <Select name="status" value={form.status} onChange={handleChange}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                  <option value="pending">Pending</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                <Input type="number" name="price" value={form.price} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <Input name="currency" value={form.currency} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bedrooms</label>
                <Input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bathrooms</label>
                <Input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Square Feet</label>
                <Input type="number" name="squareFeet" value={form.squareFeet} onChange={handleChange} />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox name="featured" checked={Boolean(form.featured)} onChange={handleCheckbox} />
                <span className="text-sm text-slate-700">Featured</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-blue-900">Location</h2>
            </div>
            <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <Input name="address" value={form.address} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                <Input name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                <Input name="state" value={form.state} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <Input name="country" value={form.country} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Zip Code</label>
                <Input name="zipCode" value={form.zipCode} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                  <Input name="latitude" value={form.latitude} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                  <Input name="longitude" value={form.longitude} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-600">
              <Building2 size={18} />
              <span className="text-sm">You can upload images after creating the property.</span>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-blue-800 text-white hover:bg-blue-900 shadow-md"
            >
              {saving ? <span className="inline-flex items-center gap-2"><Spinner size={16}/> Saving...</span> : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
