import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Select = (props: any) => <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminEventCouponCreate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCoupon, loading } = useEventsStore();
  const [form, setForm] = useState<any>({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    maxUses: "",
    minPurchaseAmount: "",
    validFrom: "",
    validUntil: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.code.trim()) {
      toast.error("Code is required");
      return;
    }
    setSaving(true);
    try {
      await createCoupon(id, {
        code: form.code,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        minPurchaseAmount: form.minPurchaseAmount ? Number(form.minPurchaseAmount) : undefined,
        validFrom: form.validFrom ? new Date(form.validFrom).toISOString() : undefined,
        validUntil: form.validUntil ? new Date(form.validUntil).toISOString() : undefined,
      });
      toast.success("Coupon created");
      navigate(`/admin/events/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create Coupon</h1>
        <Link to={`/admin/events/${id}`} className="text-sm text-blue-700 hover:underline">Back to event</Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Code</label><Input name="code" value={form.code} onChange={handleChange} /></div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <Select name="discountType" value={form.discountType} onChange={handleChange}>
              <option value="percentage">percentage</option>
              <option value="fixed">fixed</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Value</label><Input type="number" name="discountValue" value={form.discountValue} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Max Uses</label><Input type="number" name="maxUses" value={form.maxUses} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Min Purchase</label><Input type="number" name="minPurchaseAmount" value={form.minPurchaseAmount} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Valid From</label><Input type="datetime-local" name="validFrom" value={form.validFrom} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Valid Until</label><Input type="datetime-local" name="validUntil" value={form.validUntil} onChange={handleChange} /></div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Creating..." : "Create Coupon"}
          </button>
        </div>
      </form>
    </div>
  );
}
