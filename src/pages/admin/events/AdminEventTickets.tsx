import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";
import { useEventsStore } from "../../../stores/events";
import { toast } from "sonner";

export default function AdminEventTickets() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEventDetails, fetchAdminEventById, deleteTicket, loading, error } = useEventsStore();

  useEffect(() => {
    if (!id) return;
    fetchAdminEventById(id);
  }, [id, fetchAdminEventById]);

  const onDelete = async (ticketId: string) => {
    if (!id) return;
    if (!confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id, ticketId);
      toast.success("Ticket deleted");
      await fetchAdminEventById(id);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete ticket");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Manage Tickets</h1>
        <div className="flex items-center gap-2">
          <Link to={`/admin/events/${id}`} className="text-sm text-blue-700 hover:underline">Back to event</Link>
          <button onClick={() => navigate(`/admin/events/${id}/tickets/new`)} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm">Add Ticket</button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center gap-2"><Spinner /> Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : !currentEventDetails ? (
        <div className="text-slate-600">Event not found.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Price</th>
                <th className="text-left py-3 px-4">Available</th>
                <th className="text-left py-3 px-4">Sold</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentEventDetails.tickets.map((t: any) => (
                <tr key={t.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4">{t.name}</td>
                  <td className="py-3 px-4">{t.is_free ? "Free" : `${t.currency} ${t.price}`}</td>
                  <td className="py-3 px-4">{t.quantity_available ?? "∞"}</td>
                  <td className="py-3 px-4">{t.quantity_sold}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/events/${id}/tickets/${t.id}/edit`} className="px-2 py-1 rounded border hover:bg-slate-50">Edit</Link>
                      <button onClick={() => onDelete(t.id)} className="px-2 py-1 rounded border hover:bg-slate-50">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
