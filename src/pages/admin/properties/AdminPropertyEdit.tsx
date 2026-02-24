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
  const rteRef = useRef<HTMLDivElement | null>(null);
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
  const [units, setUnits] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [pois, setPOIs] = useState<any[]>([]);
  const [unitForm, setUnitForm] = useState<any>({ name: "", bedrooms: "", bathrooms: "", squareFeet: "", price: "", currency: "NGN", withBq: false, categoryName: "", displayOrder: 0 });
  const [planForm, setPlanForm] = useState<any>({ planType: "", name: "", downPaymentPercent: "", tenureMonths: "", interestRatePercent: "", notes: "", promoEndsAt: "" });
  const [videoForm, setVideoForm] = useState<any>({ videoUrl: "", displayOrder: 0 });
  const [documentForm, setDocumentForm] = useState<any>({ title: "", fileUrl: "", displayOrder: 0 });
  const [poiForm, setPoiForm] = useState<any>({ title: "", poiType: "", distanceKm: "", description: "" });

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    setForm((prev) => ({ ...prev, description: rteRef.current?.innerHTML || "" }));
  };
  const syncHtml = () => {
    setForm((prev) => ({ ...prev, description: rteRef.current?.innerHTML || "" }));
  };

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

  const reloadExtended = async () => {
    if (!id || id === "new") return;
    const s = usePropertiesStore.getState();
    await Promise.all([
      s.fetchPropertyUnits(id),
      s.fetchPropertyPlans(id),
      s.fetchPropertyVideos(id),
      s.fetchPropertyDocuments(id),
      s.fetchPropertyPOIs(id),
    ]);
    setUnits(usePropertiesStore.getState().propertyUnits || []);
    setPlans(usePropertiesStore.getState().propertyPaymentPlans || []);
    setVideos(usePropertiesStore.getState().propertyVideos || []);
    setDocuments(usePropertiesStore.getState().propertyDocuments || []);
    setPOIs(usePropertiesStore.getState().propertyPOIs || []);
  };
  useEffect(() => {
    if (id && id !== "new") reloadExtended();
  }, [id]);

  const addUnit = async () => {
    if (!id || id === "new" || !unitForm.name || !unitForm.price) return;
    try {
      await usePropertiesStore.getState().addPropertyUnit(id, {
        ...unitForm,
        bedrooms: unitForm.bedrooms ? Number(unitForm.bedrooms) : undefined,
        bathrooms: unitForm.bathrooms ? Number(unitForm.bathrooms) : undefined,
        squareFeet: unitForm.squareFeet ? Number(unitForm.squareFeet) : undefined,
        price: Number(unitForm.price),
      });
      setUnitForm({ name: "", bedrooms: "", bathrooms: "", squareFeet: "", price: "", currency: "NGN", withBq: false, categoryName: "", displayOrder: 0 });
      await reloadExtended();
      toast.success("Unit added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add unit");
    }
  };
  const deleteUnit = async (uid: string) => {
    if (!id || id === "new") return;
    await usePropertiesStore.getState().deletePropertyUnit(id, uid);
    setUnits(usePropertiesStore.getState().propertyUnits || []);
  };

  const addPlan = async () => {
    if (!id || id === "new" || !planForm.planType) return;
    try {
      await usePropertiesStore.getState().addPropertyPlan(id, {
        ...planForm,
        downPaymentPercent: planForm.downPaymentPercent ? Number(planForm.downPaymentPercent) : undefined,
        tenureMonths: planForm.tenureMonths ? Number(planForm.tenureMonths) : undefined,
        interestRatePercent: planForm.interestRatePercent ? Number(planForm.interestRatePercent) : undefined,
      });
      setPlanForm({ planType: "", name: "", downPaymentPercent: "", tenureMonths: "", interestRatePercent: "", notes: "", promoEndsAt: "" });
      await reloadExtended();
      toast.success("Payment plan added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add plan");
    }
  };
  const deletePlan = async (pid: string) => {
    if (!id || id === "new") return;
    await usePropertiesStore.getState().deletePropertyPlan(id, pid);
    setPlans(usePropertiesStore.getState().propertyPaymentPlans || []);
  };

  const addVideoItem = async () => {
    if (!id || id === "new" || !videoForm.videoUrl) return;
    await usePropertiesStore.getState().addPropertyVideo(id, videoForm);
    setVideoForm({ videoUrl: "", displayOrder: 0 });
    await reloadExtended();
  };
  const deleteVideoItem = async (vid: string) => {
    if (!id || id === "new") return;
    await usePropertiesStore.getState().deletePropertyVideo(id, vid);
    setVideos(usePropertiesStore.getState().propertyVideos || []);
  };

  const addDocumentItem = async () => {
    if (!id || id === "new" || !documentForm.title || !documentForm.fileUrl) return;
    await usePropertiesStore.getState().addPropertyDocument(id, documentForm);
    setDocumentForm({ title: "", fileUrl: "", displayOrder: 0 });
    await reloadExtended();
  };
  const deleteDocumentItem = async (docId: string) => {
    if (!id || id === "new") return;
    await usePropertiesStore.getState().deletePropertyDocument(id, docId);
    setDocuments(usePropertiesStore.getState().propertyDocuments || []);
  };

  const addPoiItem = async () => {
    if (!id || id === "new" || !poiForm.title) return;
    await usePropertiesStore.getState().addPropertyPOI(id, {
      ...poiForm,
      distanceKm: poiForm.distanceKm ? Number(poiForm.distanceKm) : undefined,
    });
    setPoiForm({ title: "", poiType: "", distanceKm: "", description: "" });
    await reloadExtended();
  };
  const deletePoiItem = async (poiId: string) => {
    if (!id || id === "new") return;
    await usePropertiesStore.getState().deletePropertyPOI(id, poiId);
    setPOIs(usePropertiesStore.getState().propertyPOIs || []);
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
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <div className="border rounded-md">
            <div className="flex flex-wrap gap-2 p-2 border-b bg-slate-50">
              <button type="button" onClick={() => exec("bold")} className="px-2 py-1 text-sm border rounded bg-white">B</button>
              <button type="button" onClick={() => exec("italic")} className="px-2 py-1 text-sm border rounded bg-white"><em>I</em></button>
              <button type="button" onClick={() => exec("underline")} className="px-2 py-1 text-sm border rounded bg-white"><u>U</u></button>
              <button type="button" onClick={() => exec("insertUnorderedList")} className="px-2 py-1 text-sm border rounded bg-white">• List</button>
              <button type="button" onClick={() => exec("insertOrderedList")} className="px-2 py-1 text-sm border rounded bg-white">1. List</button>
              <button type="button" onClick={() => { const url = prompt("Link URL"); if (url) exec("createLink", url); }} className="px-2 py-1 text-sm border rounded bg-white">Link</button>
              <button type="button" onClick={() => exec("removeFormat")} className="px-2 py-1 text-sm border rounded bg-white">Clear</button>
            </div>
            <div
              ref={rteRef}
              contentEditable
              className="min-h-[160px] p-3 focus:outline-none prose max-w-none"
              onInput={syncHtml}
              dangerouslySetInnerHTML={{ __html: form.description || "" }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">Rich text supported. HTML is stored.</p>
        </div>
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Units</h2>
          {id === 'new' ? <p className="text-slate-600">Save the property first to manage units.</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
                <Input placeholder="Name" value={unitForm.name} onChange={(e: any) => setUnitForm({ ...unitForm, name: e.target.value })} />
                <Input type="number" placeholder="Beds" value={unitForm.bedrooms} onChange={(e: any) => setUnitForm({ ...unitForm, bedrooms: e.target.value })} />
                <Input type="number" placeholder="Baths" value={unitForm.bathrooms} onChange={(e: any) => setUnitForm({ ...unitForm, bathrooms: e.target.value })} />
                <Input type="number" placeholder="Sqft" value={unitForm.squareFeet} onChange={(e: any) => setUnitForm({ ...unitForm, squareFeet: e.target.value })} />
                <Input type="number" placeholder="Price" value={unitForm.price} onChange={(e: any) => setUnitForm({ ...unitForm, price: e.target.value })} />
                <button onClick={addUnit} className="btn btn-primary">Add</button>
              </div>
              {units.length === 0 ? <p className="text-slate-600">No units yet.</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50"><th className="text-left p-2">Name</th><th className="text-left p-2">Specs</th><th className="text-left p-2">Price</th><th className="p-2">Actions</th></tr></thead>
                    <tbody>
                      {units.map((u) => (
                        <tr key={u.id} className="border-t">
                          <td className="p-2 font-medium">{u.name}</td>
                          <td className="p-2 text-slate-600">{[u.bedrooms && `${u.bedrooms} bed`, u.bathrooms && `${u.bathrooms} bath`, u.square_feet && `${u.square_feet} sqft`].filter(Boolean).join(" · ")}</td>
                          <td className="p-2">{new Intl.NumberFormat("en-NG", { style: "currency", currency: u.currency || "NGN", minimumFractionDigits: 0 }).format(u.price)}</td>
                          <td className="p-2 text-right">
                            <button onClick={() => deleteUnit(u.id)} className="text-rose-600 hover:underline">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Payment Plans</h2>
          {id === 'new' ? <p className="text-slate-600">Save the property first to manage plans.</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
                <Select value={planForm.planType} onChange={(e: any) => setPlanForm({ ...planForm, planType: e.target.value })}>
                  <option value="">Type</option>
                  <option value="mortgage">Mortgage</option>
                  <option value="rent_to_own">Rent-to-Own</option>
                  <option value="promo">Promo</option>
                </Select>
                <Input placeholder="Name (optional)" value={planForm.name} onChange={(e: any) => setPlanForm({ ...planForm, name: e.target.value })} />
                <Input type="number" placeholder="Down %" value={planForm.downPaymentPercent} onChange={(e: any) => setPlanForm({ ...planForm, downPaymentPercent: e.target.value })} />
                <Input type="number" placeholder="Tenure (months)" value={planForm.tenureMonths} onChange={(e: any) => setPlanForm({ ...planForm, tenureMonths: e.target.value })} />
                <Input type="number" placeholder="Interest %" value={planForm.interestRatePercent} onChange={(e: any) => setPlanForm({ ...planForm, interestRatePercent: e.target.value })} />
                <button onClick={addPlan} className="btn btn-primary">Add</button>
              </div>
              <Textarea placeholder="Notes" value={planForm.notes} onChange={(e: any) => setPlanForm({ ...planForm, notes: e.target.value })} />
              {plans.length === 0 ? <p className="text-slate-600 mt-3">No plans yet.</p> : (
                <div className="overflow-x-auto mt-3">
                  <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50"><th className="text-left p-2">Type</th><th className="text-left p-2">Summary</th><th className="p-2">Actions</th></tr></thead>
                    <tbody>
                      {plans.map((p) => (
                        <tr key={p.id} className="border-t">
                          <td className="p-2 capitalize">{p.plan_type}</td>
                          <td className="p-2 text-slate-600">{[p.name, p.down_payment_percent && `Down ${p.down_payment_percent}%`, p.tenure_months && `${p.tenure_months} mo`, p.interest_rate_percent && `${p.interest_rate_percent}%`].filter(Boolean).join(" · ")}</td>
                          <td className="p-2 text-right"><button onClick={() => deletePlan(p.id)} className="text-rose-600 hover:underline">Delete</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Videos</h2>
          {id === 'new' ? <p className="text-slate-600">Save the property first to manage videos.</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                <Input placeholder="Video URL" value={videoForm.videoUrl} onChange={(e: any) => setVideoForm({ ...videoForm, videoUrl: e.target.value })} />
                <Input type="number" placeholder="Display order" value={videoForm.displayOrder} onChange={(e: any) => setVideoForm({ ...videoForm, displayOrder: Number(e.target.value || 0) })} />
                <button onClick={addVideoItem} className="btn btn-primary">Add</button>
              </div>
              {videos.length === 0 ? <p className="text-slate-600">No videos yet.</p> : (
                <div className="flex flex-wrap gap-3">
                  {videos.map((v) => (
                    <div key={v.id} className="border rounded p-2 w-64">
                      <div className="text-xs text-slate-600 mb-1">Order {v.display_order}</div>
                      <div className="truncate text-blue-700">{v.video_url}</div>
                      <div className="mt-2 text-right"><button onClick={() => deleteVideoItem(v.id)} className="text-rose-600 hover:underline text-sm">Delete</button></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>
          {id === 'new' ? <p className="text-slate-600">Save the property first to manage documents.</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
                <Input placeholder="Title" value={documentForm.title} onChange={(e: any) => setDocumentForm({ ...documentForm, title: e.target.value })} />
                <Input placeholder="File URL" value={documentForm.fileUrl} onChange={(e: any) => setDocumentForm({ ...documentForm, fileUrl: e.target.value })} />
                <Input type="number" placeholder="Display order" value={documentForm.displayOrder} onChange={(e: any) => setDocumentForm({ ...documentForm, displayOrder: Number(e.target.value || 0) })} />
                <button onClick={addDocumentItem} className="btn btn-primary">Add</button>
              </div>
              {documents.length === 0 ? <p className="text-slate-600">No documents yet.</p> : (
                <div className="flex flex-wrap gap-3">
                  {documents.map((d) => (
                    <div key={d.id} className="border rounded p-2 w-64">
                      <div className="font-semibold truncate">{d.title}</div>
                      <div className="text-xs text-blue-700 truncate">{d.file_url}</div>
                      <div className="mt-2 text-right"><button onClick={() => deleteDocumentItem(d.id)} className="text-rose-600 hover:underline text-sm">Delete</button></div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold mb-4">Points of Interest</h2>
          {id === 'new' ? <p className="text-slate-600">Save the property first to manage POIs.</p> : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
                <Input placeholder="Title" value={poiForm.title} onChange={(e: any) => setPoiForm({ ...poiForm, title: e.target.value })} />
                <Input placeholder="Type" value={poiForm.poiType} onChange={(e: any) => setPoiForm({ ...poiForm, poiType: e.target.value })} />
                <Input type="number" placeholder="Distance (km)" value={poiForm.distanceKm} onChange={(e: any) => setPoiForm({ ...poiForm, distanceKm: e.target.value })} />
                <Input placeholder="Description" value={poiForm.description} onChange={(e: any) => setPoiForm({ ...poiForm, description: e.target.value })} />
                <button onClick={addPoiItem} className="btn btn-primary">Add</button>
              </div>
              {pois.length === 0 ? <p className="text-slate-600">No POIs yet.</p> : (
                <div className="flex flex-wrap gap-2">
                  {pois.map((p) => (
                    <span key={p.id} className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {p.title}{p.distance_km ? ` • ${p.distance_km}km` : ""}
                      <button onClick={() => deletePoiItem(p.id)} className="text-blue-900 hover:text-rose-600">×</button>
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
