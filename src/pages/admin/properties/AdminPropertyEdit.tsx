import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePropertiesStore } from "../../../stores/properties";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { Upload, Trash2, Star } from "lucide-react";

const Input = (props: any) => <input className="w-full border rounded px-3 py-2" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border rounded px-3 py-2" {...props} />;
const Select = (props: any) => <select className="w-full border rounded px-3 py-2" {...props} />;
const Checkbox = (props: any) => (
  <input type="checkbox" className="h-4 w-4 border rounded" {...props} />
);

type EditForm = {
  title: string;
  description: string;
  propertyType: string;
  status: string;
  price: string;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  latitude: string;
  longitude: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  yearBuilt: string;
  listingType: string;
  featured: boolean;
};

export default function AdminPropertyEdit() {
  const { id } = useParams();
  const [form, setForm] = useState<EditForm>({
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrls = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [features, setFeatures] = useState<any[]>([]);
  const [featureName, setFeatureName] = useState("");

  useEffect(() => {
    if (!id || id === 'new') {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchPropertyDetail = usePropertiesStore.getState().fetchPropertyDetail;
        await fetchPropertyDetail(id);
        const item = usePropertiesStore.getState().propertyDetail;
        setForm({
          title: item?.title ?? "",
          description: item?.description ?? "",
          propertyType: item?.property_type ?? "",
          status: item?.status ?? "available",
          price: (item?.price ?? "") as any,
          currency: item?.currency ?? "NGN",
          address: item?.address ?? "",
          city: item?.city ?? "",
          state: item?.state ?? "",
          country: item?.country ?? "Nigeria",
          zipCode: item?.zip_code ?? "",
          latitude: item?.latitude != null ? String(item.latitude) : "",
          longitude: item?.longitude != null ? String(item.longitude) : "",
          bedrooms: item?.bedrooms != null ? String(item.bedrooms) : "",
          bathrooms: item?.bathrooms != null ? String(item.bathrooms) : "",
          squareFeet: item?.square_feet != null ? String(item.square_feet) : "",
          yearBuilt: item?.year_built != null ? String(item.year_built) : "",
          listingType: item?.listing_type ?? "",
          featured: item?.featured ?? false,
        });
        setImages(usePropertiesStore.getState().propertyImages || []);
        setFeatures(usePropertiesStore.getState().propertyFeatures || []);
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
      const updateProperty = usePropertiesStore.getState().updateProperty;
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
      if (id && id !== 'new') {
        await updateProperty(id, payload);
        toast.success("Property updated successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save property");
    } finally {
      setSaving(false);
    }
  };

  const reloadImages = async () => {
    if (!id || id === 'new') return;
    const fetchPropertyImages = usePropertiesStore.getState().fetchPropertyImages;
    await fetchPropertyImages(id);
    setImages(usePropertiesStore.getState().propertyImages || []);
  };
  const uploadImage = async () => {
    if (!files.length || !id || id === 'new') return;
    try {
      setImgLoading(true);
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      const b64s = await Promise.all(files.map((f) => toBase64(f)));
      const uploadPropertyImage = usePropertiesStore.getState().uploadPropertyImage;
      for (let i = 0; i < b64s.length; i++) {
        await uploadPropertyImage(id, {
          imageBase64: b64s[i],
          isPrimary: i === 0 ? isPrimary : false,
          displayOrder: Number(displayOrder) + i,
        });
      }
      await reloadImages();
      setFiles([]);
      setIsPrimary(false);
      setDisplayOrder(0);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setImgLoading(false);
    }
  };
  const setPrimary = async (image: any) => {
    if (!id || id === 'new') return;
    try {
      setImgLoading(true);
      const setPrimaryImage = usePropertiesStore.getState().setPrimaryImage;
      await setPrimaryImage(id, image.image_url);
      await reloadImages();
      toast.success("Primary image updated");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to set primary");
    } finally {
      setImgLoading(false);
    }
  };
  const removeImage = async (imageId: string) => {
    if (!id || id === 'new') return;
    try {
      setImgLoading(true);
      const deletePropertyImage = usePropertiesStore.getState().deletePropertyImage;
      await deletePropertyImage(id, imageId);
      setImages(usePropertiesStore.getState().propertyImages || []);
      toast.success("Image deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete image");
    } finally {
      setImgLoading(false);
    }
  };
  const loadFeatures = async () => {
    if (!id || id === 'new') return;
    const fetchPropertyFeatures = usePropertiesStore.getState().fetchPropertyFeatures;
    await fetchPropertyFeatures(id);
    setFeatures(usePropertiesStore.getState().propertyFeatures || []);
  };
  const addFeature = async () => {
    if (!featureName.trim() || !id || id === 'new') return;
    try {
      const addPropertyFeature = usePropertiesStore.getState().addPropertyFeature;
      await addPropertyFeature(id, featureName);
      setFeatureName("");
      await loadFeatures();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add feature");
    }
  };
  const removeFeature = async (featureId: number) => {
    if (!id || id === 'new') return;
    try {
      const deletePropertyFeature = usePropertiesStore.getState().deletePropertyFeature;
      await deletePropertyFeature(id, featureId);
      setFeatures(usePropertiesStore.getState().propertyFeatures || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete feature");
    }
  };

  if (loading) return <div className="p-6"><Spinner /></div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Edit Property</h1>
          <p className="text-slate-600">Update details, upload images, and manage features.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-blue-900">Basics</h2>
          </div>
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
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-blue-900">Pricing & Details</h2>
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
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 space-y-4">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="text-lg font-semibold text-blue-900">Location</h2>
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
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-blue-800 text-white hover:bg-blue-900 shadow-md flex items-center gap-2">
            {saving && <Spinner size={16} />} {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
      <div className="mt-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Images</h2>
            {imgLoading && <div className="flex items-center gap-2 text-slate-600 text-sm"><Spinner size={14}/> Working...</div>}
          </div>
          {id === 'new' ? (
            <p className="text-slate-600">Save the property first to upload images.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {images.map((img) => (
                  <div key={img.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-slate-100">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Primary</span>
                      )}
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <button onClick={() => setPrimary(img)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50">
                        <Star size={12} /> Set Primary
                      </button>
                      <button onClick={() => removeImage(img.id)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-red-50 text-red-600">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <div
                  className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer bg-slate-50 hover:bg-slate-100"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const list = e.dataTransfer.files;
                    if (list && list.length) {
                      setFiles((prev) => [...prev, ...Array.from(list)]);
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles((prev) => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])])}
                  />
                  <Upload size={18} className="mx-auto mb-2 text-slate-600" />
                  <div className="text-slate-700 font-medium">Drag & drop to upload</div>
                  <div className="text-slate-500 text-sm">or click to select an image</div>
                </div>
              </div>
              {files.length > 0 && (
                <div className="mb-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, idx) => (
                      <div key={idx} className="rounded-lg border overflow-hidden bg-slate-50">
                        <div className="aspect-video bg-black/5">
                          <img src={url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-xs text-slate-600">#{idx + 1}</span>
                          <button
                            onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-xs px-2 py-1 rounded border hover:bg-slate-100"
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                      <span className="text-sm">Set first as primary</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium mb-1">Starting Display Order</label>
                      <input
                        type="number"
                        value={displayOrder}
                        onChange={(e) => setDisplayOrder(Number(e.target.value || 0))}
                        className="w-28 border rounded px-2 py-1"
                      />
                    </div>
                    <div className="ml-auto">
                      <button
                        onClick={uploadImage}
                        disabled={!files.length || imgLoading}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                        type="button"
                      >
                        <Upload size={16} /> {imgLoading ? "Uploading..." : "Upload All"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Features</h2>
          {id === 'new' ? (
            <p className="text-slate-600">Save the property first to manage features.</p>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add feature (e.g., Parking, Pool)"
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                />
                <button onClick={addFeature} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Add</button>
              </div>
              {features.length === 0 ? (
                <p className="text-slate-600">No features yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {features.map((f) => (
                    <span key={f.id} className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {f.feature_name}
                      <button onClick={() => removeFeature(f.id)} className="text-blue-900 hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
