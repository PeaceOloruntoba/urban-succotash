import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useEventsStore } from "../../../stores/events";
import Spinner from "../../../components/Spinner";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminEventSchedule() {
  const { id } = useParams();
  const {
    currentEventDetails,
    fetchAdminEventById,
    fetchEventSessions,
    addEventSession,
    updateEventSession,
    deleteEventSession,
    fetchEventDays,
    addEventDay,
    updateEventDay,
    deleteEventDay,
    loading
  } = useEventsStore();
  const [form, setForm] = useState<any>({ title: "", locationName: "", startAt: "", endAt: "", displayOrder: 0, description: "" });
  const [working, setWorking] = useState(false);
  const [dayForm, setDayForm] = useState<any>({ dayIndex: 1, date: "", startTime: "", endTime: "" });
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editSessionForm, setEditSessionForm] = useState<any>({ title: "", locationName: "", startAt: "", endAt: "", displayOrder: 0, description: "" });
  const [editingDayId, setEditingDayId] = useState<string | null>(null);
  const [editDayForm, setEditDayForm] = useState<any>({ dayIndex: 1, date: "", startTime: "", endTime: "" });

  useEffect(() => {
    if (!id) return;
    (async () => {
      await fetchAdminEventById(id);
      await fetchEventSessions(id);
      await fetchEventDays(id);
    })();
  }, [id, fetchAdminEventById, fetchEventSessions, fetchEventDays]);

  const sessions = currentEventDetails?.sessions || [];
  const days = currentEventDetails?.days || [];

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

  const saveEditSession = async () => {
    if (!id || !editingSessionId) return;
    try {
      setWorking(true);
      await updateEventSession(id, editingSessionId, {
        title: editSessionForm.title || undefined,
        description: editSessionForm.description || undefined,
        locationName: editSessionForm.locationName || undefined,
        startAt: editSessionForm.startAt ? new Date(editSessionForm.startAt).toISOString() : undefined,
        endAt: editSessionForm.endAt ? new Date(editSessionForm.endAt).toISOString() : undefined,
        displayOrder: editSessionForm.displayOrder != null ? Number(editSessionForm.displayOrder) : undefined,
      });
      await fetchEventSessions(id);
      setEditingSessionId(null);
      toast.success("Session updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update session");
    } finally {
      setWorking(false);
    }
  };

  const remove = async (sid: string) => {
    if (!id) return;
    await deleteEventSession(id, sid);
    await fetchEventSessions(id);
  };

  const dayToIso = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return "";
    return new Date(`${dateStr}T${timeStr}`).toISOString();
  };
  const submitDay = async () => {
    if (!id) return;
    if (!dayForm.date || !dayForm.startTime || !dayForm.endTime) {
      toast.error("Please set date and time range");
      return;
    }
    try {
      setWorking(true);
      await addEventDay(id, {
        dayIndex: Number(dayForm.dayIndex || 1),
        dayStartAt: dayToIso(dayForm.date, dayForm.startTime),
        dayEndAt: dayToIso(dayForm.date, dayForm.endTime),
      });
      await fetchEventDays(id);
      setDayForm({ dayIndex: 1, date: "", startTime: "", endTime: "" });
      toast.success("Day added");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to add day");
    } finally {
      setWorking(false);
    }
  };
  const saveEditDay = async () => {
    if (!id || !editingDayId) return;
    try {
      setWorking(true);
      await updateEventDay(id, editingDayId, {
        dayIndex: Number(editDayForm.dayIndex || 1),
        dayStartAt: dayToIso(editDayForm.date, editDayForm.startTime),
        dayEndAt: dayToIso(editDayForm.date, editDayForm.endTime),
      });
      await fetchEventDays(id);
      setEditingDayId(null);
      toast.success("Day updated");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update day");
    } finally {
      setWorking(false);
    }
  };
  const removeDay = async (did: string) => {
    if (!id) return;
    await deleteEventDay(id, did);
    await fetchEventDays(id);
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
        <h2 className="font-semibold mb-3">Event Days (Top-level)</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="number" className="border rounded px-3 py-2" placeholder="Day #" value={dayForm.dayIndex} onChange={(e) => setDayForm({ ...dayForm, dayIndex: Number(e.target.value || 1) })} />
          <input type="date" className="border rounded px-3 py-2" value={dayForm.date} onChange={(e) => setDayForm({ ...dayForm, date: e.target.value })} />
          <input type="time" className="border rounded px-3 py-2" value={dayForm.startTime} onChange={(e) => setDayForm({ ...dayForm, startTime: e.target.value })} />
          <input type="time" className="border rounded px-3 py-2" value={dayForm.endTime} onChange={(e) => setDayForm({ ...dayForm, endTime: e.target.value })} />
          <button disabled={working} onClick={submitDay} className="btn btn-primary">{working ? "Saving..." : "Add Day"}</button>
        </div>
        <div className="mt-4 overflow-x-auto">
          {days.length === 0 ? (
            <div className="text-slate-600">No days defined. Days summarize daily event windows; sessions handle the detailed program.</div>
          ) : (
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50"><th className="text-left p-2">Day</th><th className="text-left p-2">Start</th><th className="text-left p-2">End</th><th className="p-2">Actions</th></tr></thead>
              <tbody>
                {days.map((d: any) => {
                  const startVal = toInputValue(d.day_start_at);
                  const endVal = toInputValue(d.day_end_at);
                  const [dDate, dTime] = startVal.split("T");
                  const [, eTime] = endVal.split("T");
                  const isEditing = editingDayId === d.id;
                  return (
                    <tr key={d.id} className="border-t">
                      <td className="p-2">{isEditing ? (
                        <input type="number" className="border rounded px-2 py-1 w-20" value={editDayForm.dayIndex} onChange={(e) => setEditDayForm({ ...editDayForm, dayIndex: Number(e.target.value || 1) })} />
                      ) : (<>Day {d.day_index}</>)}</td>
                      <td className="p-2">{isEditing ? (
                        <div className="flex gap-2">
                          <input type="date" className="border rounded px-2 py-1" value={editDayForm.date} onChange={(e) => setEditDayForm({ ...editDayForm, date: e.target.value })} />
                          <input type="time" className="border rounded px-2 py-1" value={editDayForm.startTime} onChange={(e) => setEditDayForm({ ...editDayForm, startTime: e.target.value })} />
                        </div>
                      ) : (<>{dDate} {dTime}</>)}</td>
                      <td className="p-2">{isEditing ? (
                        <input type="time" className="border rounded px-2 py-1" value={editDayForm.endTime} onChange={(e) => setEditDayForm({ ...editDayForm, endTime: e.target.value })} />
                      ) : (<>{eTime}</>)}</td>
                      <td className="p-2 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-2">
                            <button onClick={saveEditDay} className="text-blue-700 hover:underline">Save</button>
                            <button onClick={() => setEditingDayId(null)} className="text-slate-600 hover:underline">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingDayId(d.id);
                                setEditDayForm({
                                  dayIndex: d.day_index,
                                  date: dDate,
                                  startTime: dTime,
                                  endTime: eTime,
                                });
                              }}
                              className="text-blue-700 hover:underline"
                            >
                              Edit
                            </button>
                            <button onClick={() => removeDay(d.id)} className="inline-flex items-center gap-1 text-rose-600 hover:underline">
                              <Trash2 size={14}/> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
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
                    <td className="p-2">
                      {editingSessionId === s.id ? (
                        <div className="flex gap-2">
                          <input type="datetime-local" className="border rounded px-2 py-1" value={editSessionForm.startAt} onChange={(e) => setEditSessionForm({ ...editSessionForm, startAt: e.target.value })} />
                          <input type="datetime-local" className="border rounded px-2 py-1" value={editSessionForm.endAt} onChange={(e) => setEditSessionForm({ ...editSessionForm, endAt: e.target.value })} />
                        </div>
                      ) : (
                        <>
                          {toInputValue(s.start_at).replace("T", " ")} – {toInputValue(s.end_at).split("T")[1]}
                        </>
                      )}
                    </td>
                    <td className="p-2">
                      {editingSessionId === s.id ? (
                        <input className="border rounded px-2 py-1" value={editSessionForm.title} onChange={(e) => setEditSessionForm({ ...editSessionForm, title: e.target.value })} />
                      ) : (s.title || "-")}
                    </td>
                    <td className="p-2">
                      {editingSessionId === s.id ? (
                        <input className="border rounded px-2 py-1" value={editSessionForm.locationName} onChange={(e) => setEditSessionForm({ ...editSessionForm, locationName: e.target.value })} />
                      ) : (s.location_name || "-")}
                    </td>
                    <td className="p-2">
                      {editingSessionId === s.id ? (
                        <input type="number" className="border rounded px-2 py-1 w-20" value={editSessionForm.displayOrder} onChange={(e) => setEditSessionForm({ ...editSessionForm, displayOrder: Number(e.target.value || 0) })} />
                      ) : s.display_order}
                    </td>
                    <td className="p-2 text-right">
                      {editingSessionId === s.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={saveEditSession} className="text-blue-700 hover:underline">Save</button>
                          <button onClick={() => setEditingSessionId(null)} className="text-slate-600 hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingSessionId(s.id);
                              setEditSessionForm({
                                title: s.title || "",
                                locationName: s.location_name || "",
                                startAt: toInputValue(s.start_at),
                                endAt: toInputValue(s.end_at),
                                displayOrder: s.display_order || 0,
                                description: s.description || "",
                              });
                            }}
                            className="text-blue-700 hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => remove(s.id)} className="inline-flex items-center gap-1 text-rose-600 hover:underline">
                            <Trash2 size={14}/> Delete
                          </button>
                        </div>
                      )}
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
