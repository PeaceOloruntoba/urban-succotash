import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";
import { toast } from "sonner";

const Input = (props: any) => <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;
const Textarea = (props: any) => <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 shadow-sm focus:ring-2 focus:ring-blue-800 focus:border-transparent" {...props} />;

export default function AdminEventTicketEdit() {
  const { id, ticketId } = useParams();
  const navigate = useNavigate();
  const { fetchAdminEventById, createTicket, updateTicket, loading } = useEventsStore();
  const editing = !!ticketId;
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    price: 0,
    currency: "NGN",
    quantityAvailable: undefined,
    maxPerUser: undefined,
    saleStartDate: "",
    saleEndDate: "",
    displayOrder: 0,
    isFree: false,
    categoryName: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const details = await fetchAdminEventById(id);
      if (editing) {
        const t = details?.tickets?.find((x: any) => x.id === ticketId);
        if (t) {
          setForm({
            name: t.name || "",
            description: t.description || "",
            price: t.price || 0,
            currency: t.currency || "USD",
            quantityAvailable: t.quantity_available ?? undefined,
            maxPerUser: t.max_per_user ?? undefined,
            saleStartDate: t.sale_start_date ? new Date(t.sale_start_date).toISOString().slice(0,16) : "",
            saleEndDate: t.sale_end_date ? new Date(t.sale_end_date).toISOString().slice(0,16) : "",
            displayOrder: t.display_order || 0,
            isFree: t.is_free || false,
            categoryName: t.category_name || "",
          });
        }
      }
    })();
  }, [id, ticketId, editing, fetchAdminEventById]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    setForm((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const payload: any = {
        name: form.name,
        description: form.description || undefined,
        price: form.isFree ? 0 : Number(form.price),
        currency: form.currency,
        quantityAvailable: form.quantityAvailable ? Number(form.quantityAvailable) : undefined,
        maxPerUser: form.maxPerUser ? Number(form.maxPerUser) : undefined,
        saleStartDate: form.saleStartDate ? new Date(form.saleStartDate).toISOString() : undefined,
        saleEndDate: form.saleEndDate ? new Date(form.saleEndDate).toISOString() : undefined,
        displayOrder: form.displayOrder ? Number(form.displayOrder) : 0,
        isFree: !!form.isFree,
        categoryName: form.categoryName || undefined,
      };
      if (editing) {
        await updateTicket(id, ticketId!, payload);
        toast.success("Ticket updated");
      } else {
        await createTicket(id, payload);
        toast.success("Ticket created");
      }
      navigate(`/admin/events/${id}/tickets`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save ticket");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{editing ? "Edit Ticket" : "Add Ticket"}</h1>
        <Link to={`/admin/events/${id}/tickets`} className="text-sm text-blue-700 hover:underline">Back to tickets</Link>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Name</label><Input name="name" value={form.name} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><Input name="categoryName" value={form.categoryName} onChange={handleChange} placeholder="VIP, General, etc." /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description</label><Textarea name="description" value={form.description} onChange={handleChange} rows={3} /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Price</label><Input type="number" name="price" value={form.price} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Currency</label><Input name="currency" value={form.currency} onChange={handleChange} /></div>
          <div className="flex items-end"><label className="inline-flex items-center gap-2"><input type="checkbox" name="isFree" checked={!!form.isFree} onChange={handleChange} /><span className="text-sm">Free ticket</span></label></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium mb-1">Quantity Available</label><Input type="number" name="quantityAvailable" value={form.quantityAvailable ?? ""} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Max Per User</label><Input type="number" name="maxPerUser" value={form.maxPerUser ?? ""} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Display Order</label><Input type="number" name="displayOrder" value={form.displayOrder} onChange={handleChange} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Sale Start</label><Input type="datetime-local" name="saleStartDate" value={form.saleStartDate} onChange={handleChange} /></div>
          <div><label className="block text-sm font-medium mb-1">Sale End</label><Input type="datetime-local" name="saleEndDate" value={form.saleEndDate} onChange={handleChange} /></div>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={saving || loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            {(saving || loading) && <Spinner size={16} />} {(saving || loading) ? "Saving..." : (editing ? "Save Changes" : "Create Ticket")}
          </button>
        </div>
      </form>
    </div>
  );
}
