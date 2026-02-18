import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePropertiesStore } from "../../../stores/properties";
import Spinner from "../../../components/Spinner";

export default function AdminPropertyContacts() {
  const { id } = useParams();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchPropertyContacts = usePropertiesStore.getState().fetchPropertyContacts;
        await fetchPropertyContacts(id);
        setContacts(usePropertiesStore.getState().propertyContacts || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load contacts");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Property Contacts</h1>
      {loading ? (
        <div className="flex items-center gap-2"><Spinner /> Loading contacts...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center text-slate-600">No contacts for this property yet.</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-700">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Phone</th>
                <th className="text-left py-3 px-4">Message</th>
                <th className="text-left py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id} className="border-t hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.phone}</td>
                  <td className="py-3 px-4 text-slate-600">{c.message}</td>
                  <td className="py-3 px-4">{new Date(c.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
