import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEventsStore } from "../../../stores/events";
import Spinner from "../../../components/Spinner";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminEventSchedule() {
  const { id } = useParams();
  const { currentEventDetails, fetchAdminEventById, fetchEventSessions, addEventSession, updateEventSession, deleteEventSession, loading } = useEventsStore();
  const [form, setForm] = useState<any>({ title: "", locationName: "", startAt: "", endAt: "", displayOrder: 0, description: "" });
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      await fetchAdminEventById(id);
      await fetchEventSessions(id);
    })();
  }, [id, fetchAdminEventById, fetchEventSessions]);

  const sessions = currentEventDetails?.sessions || [];

  const toInputValue = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const submit = async () => {
    if (!id) return;
    if (!form.startAt || !form.endAt) {
      toast.error("Please set start and end");
      return;
    }
    try {
      setWorking(true);
      await addEventSession(id, {
        title: form.title || undefined,
        description: form.description || undefined,
        locationName: form.locationName || undefined,
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
        displayOrder: Number(form.displayOrder || 0),
      });
      await fetchEventSessions(id);
      setForm({ title: "", locationName: "", startAt: "", endAt: "", displayOrder: 0, description: "" });
      toast.success("Session added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add session");
    } finally {
      setWorking(false);
    }
  };

  const remove = async (sid: string) => {
    if (!id) return;
    await deleteEventSession(id, sid);
    await fetchEventSessions(id);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold">Event Schedule</h1>
          <p className="text-slate-600">Manage sessions across multiple days with precise start/end times.</p>
        </div>
        <Link to={`/admin/events/${id}`} className="text-blue-700 hover:underline">Back to Event</Link>
      </div>

      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-semibold mb-3">Add Session</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Location (optional)" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })} />
          <input type="datetime-local" className="border rounded px-3 py-2" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} />
          <input type="datetime-local" className="border rounded px-3 py-2" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} />
          <input type="number" className="border rounded px-3 py-2" placeholder="Display Order" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value || 0) })} />
          <textarea className="border rounded px-3 py-2 md:col-span-2" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-3">
          <button disabled={working} onClick={submit} className="btn btn-primary">{working ? "Saving..." : "Add Session"}</button>
        </div>
      </div>

      <div className="bg-white rounded border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Sessions</h2>
          {loading && <div className="text-slate-600 text-sm inline-flex items-center gap-2"><Spinner size={16}/> Loading...</div>}
        </div>
        {sessions.length === 0 ? (
          <div className="text-slate-600">No sessions yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left p-2">When</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">Order</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s: any) => (
                  <tr key={s.id} className="border-t">
                    <td className="p-2">{toInputValue(s.start_at).replace("T", " ")} – {toInputValue(s.end_at).split("T")[1]}</td>
                    <td className="p-2">{s.title || "-"}</td>
                    <td className="p-2">{s.location_name || "-"}</td>
                    <td className="p-2">{s.display_order}</td>
                    <td className="p-2 text-right">
                      <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1 text-rose-600 hover:underline">
                        <Trash2 size={14}/> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
