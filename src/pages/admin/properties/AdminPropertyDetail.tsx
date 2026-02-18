import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../../lib/axios";
import Spinner from "../../../components/Spinner";
import { Building2, MapPin, DollarSign, Bed, Bath, Trash2, Star, Upload } from "lucide-react";

export default function AdminPropertyDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/properties/${id}`);
        setItem(res.data?.data?.item || null);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load property details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setImgLoading(true);
      setImgError(null);
      try {
        const res = await api.get(`/properties/${id}/images`);
        setImages(res.data?.data?.images || []);
      } catch (err: any) {
        setImgError(err?.response?.data?.message || "Failed to load images");
      } finally {
        setImgLoading(false);
      }
    })();
  }, [id]);

  const uploadImage = async () => {
    if (!file || !id) return;
    try {
      setImgLoading(true);
      const b64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await api.post(`/properties/${id}/images`, {
        imageBase64: b64,
        isPrimary,
        displayOrder,
      });
      const res = await api.get(`/properties/${id}/images`);
      setImages(res.data?.data?.images || []);
      setFile(null);
      setIsPrimary(false);
      setDisplayOrder(0);
    } catch (err: any) {
      setImgError(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setImgLoading(false);
    }
  };

  const setPrimary = async (image: any) => {
    if (!id) return;
    try {
      setImgLoading(true);
      await api.post(`/properties/${id}/images`, {
        imageUrl: image.image_url,
        isPrimary: true,
        displayOrder: 0,
      });
      const res = await api.get(`/properties/${id}/images`);
      setImages(res.data?.data?.images || []);
    } catch (err: any) {
      setImgError(err?.response?.data?.message || "Failed to set primary image");
    } finally {
      setImgLoading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    if (!id) return;
    if (!confirm("Delete this image?")) return;
    try {
      setImgLoading(true);
      await api.delete(`/properties/${id}/images/${imageId}`);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err: any) {
      setImgError(err?.response?.data?.message || "Failed to delete image");
    } finally {
      setImgLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 flex items-center gap-2"><Spinner /> Loading property...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }
  if (!item) {
    return <div className="p-6 text-slate-600">Property not found.</div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{item.title}</h1>
        <Link to={`/admin/properties/${id}/edit`} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Edit Property</Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <p className="text-slate-600">{item.description}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><Building2 size={16} className="text-slate-500"/> <strong>Type:</strong> {item.property_type}</div>
          <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-500"/> <strong>Location:</strong> {item.address}, {item.city}</div>
          <div className="flex items-center gap-2"><DollarSign size={16} className="text-slate-500"/> <strong>Price:</strong> {new Intl.NumberFormat('en-NG', { style: 'currency', currency: item.currency || 'NGN', minimumFractionDigits: 0 }).format(item.price)}</div>
          <div className="flex items-center gap-2"><Bed size={16} className="text-slate-500"/> <strong>Bedrooms:</strong> {item.bedrooms ?? '-'}</div>
          <div className="flex items-center gap-2"><Bath size={16} className="text-slate-500"/> <strong>Bathrooms:</strong> {item.bathrooms ?? '-'}</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Images</h2>
        {imgLoading ? (
          <div className="flex items-center gap-2"><Spinner /> Working...</div>
        ) : imgError ? (
          <div className="text-red-600">{imgError}</div>
        ) : (
          <>
            {images.length === 0 ? (
              <div className="text-slate-600 mb-4">No images yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {images.map((img) => (
                  <div key={img.id} className="border rounded-lg overflow-hidden">
                    <div className="relative aspect-video bg-slate-100">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      {img.is_primary && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">Primary</span>
                      )}
                    </div>
                    <div className="p-2 flex items-center justify-between">
                      <button onClick={() => setPrimary(img)} className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-slate-50 text-sm">
                        <Star size={14} /> Set Primary
                      </button>
                      <button onClick={() => removeImage(img.id)} className="inline-flex items-center gap-1 px-2 py-1 rounded border hover:bg-red-50 text-red-600 text-sm">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} />
                  <span className="text-sm">Set as Primary</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Number(e.target.value || 0))}
                    className="w-24 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={uploadImage}
                  disabled={!file}
                  className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2"
                >
                  <Upload size={16} /> Add Image
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
