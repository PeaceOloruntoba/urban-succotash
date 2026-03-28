import { useEffect } from "react";
import { useRealtorStore } from "../../../stores/realtors";
import Spinner from "../../../components/Spinner";
import { Mail, Phone, MapPin, Award } from "lucide-react";

export default function AdminRealtorsPage() {
  const { realtors, loading, fetchRealtors } = useRealtorStore();

  useEffect(() => {
    fetchRealtors();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Realtors Network</h1>
        <p className="text-slate-500">Manage and track performance of all registered realtors</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Spinner size={32} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realtors.map((realtor) => (
            <div key={realtor.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                  {realtor.full_name.charAt(0)}
                </div>
                <div className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {realtor.cid_number}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">{realtor.full_name}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Mail size={16} /> {realtor.email}
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <Phone size={16} /> {realtor.phone_number}
                </div>
                <div className="flex items-center gap-3 text-slate-600 text-sm">
                  <MapPin size={16} /> {realtor.location}
                </div>
                {realtor.referral_source && (
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <Award size={16} /> Referred by: {realtor.referral_source}
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                <span>Joined {new Date(realtor.created_at).toLocaleDateString()}</span>
                <button className="text-blue-600 font-bold hover:underline">View Performance</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
