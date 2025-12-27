import { api } from "../../lib/axios";

type Props = { items: any[]; onEdit: (it: any) => void; onChanged: () => void };
export default function PodcastsTable({ items, onEdit, onChanged }: Props) {
  const publishItem = async (id: string) => {
    await api.post(`/podcasts/${id}/publish`);
    onChanged();
  };
  const deleteItem = async (id: string) => {
    await api.delete(`/podcasts/${id}`);
    onChanged();
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Scheduled</th>
            <th className="p-2 border">Published</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="p-2 border">{it.title}</td>
              <td className="p-2 border">{it.scheduled_at || "-"}</td>
              <td className="p-2 border">{it.published_at || "-"}</td>
              <td className="p-2 border space-x-2">
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => onEdit(it)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 rounded border"
                  onClick={() => publishItem(it.id)}
                >
                  Publish
                </button>
                <button
                  className="px-2 py-1 rounded border text-red-600"
                  onClick={() => deleteItem(it.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
