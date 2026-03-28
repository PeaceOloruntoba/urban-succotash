import { useEffect, useState } from "react";
import { useDealStore } from "../../../stores/deals";
import { useRealtorStore } from "../../../stores/realtors";
import { usePropertiesStore } from "../../../stores/properties";
import Spinner from "../../../components/Spinner";
import { toast } from "sonner";
import { Briefcase, DollarSign, Users, Plus, Search, Filter } from "lucide-react";

export default function AdminDealsPage() {
  const { deals, loading, fetchDeals, updateCommissionStatus } = useDealStore();
  const { realtors, fetchRealtors } = useRealtorStore();
  const { properties, fetchProperties } = usePropertiesStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newDeal, setNewDeal] = useState({
    realtorId: "",
    propertyId: "",
    clientName: "",
    dealValue: "",
    paymentStatus: "pending"
  });

  useEffect(() => {
    fetchDeals();
    fetchRealtors();
    fetchProperties();
  }, []);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await useDealStore.getState().createDeal({
        realtor_id: newDeal.realtorId,
        property_id: newDeal.propertyId,
        client_name: newDeal.clientName,
        deal_value: Number(newDeal.dealValue),
        payment_status: newDeal.paymentStatus
      });
      toast.success("Deal recorded successfully");
      setShowAddModal(false);
      setNewDeal({ realtorId: "", propertyId: "", clientName: "", dealValue: "", paymentStatus: "pending" });
    } catch (err) {
      toast.error("Failed to create deal");
    }
  };

  const filteredDeals = deals.filter(deal => 
    deal.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.realtor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.property_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalDeals: deals.length,
    totalVolume: deals.reduce((sum, d) => sum + Number(d.deal_value), 0),
    pendingCommissions: deals.filter(d => d.commission_status === 'unpaid').length
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Deal Tracking</h1>
          <p className="text-slate-500">Manage real estate transactions and commissions</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Record New Deal
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={24} /></div>
            <span className="text-slate-500 font-medium">Total Deals</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.totalDeals}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><DollarSign size={24} /></div>
            <span className="text-slate-500 font-medium">Total Sales Volume</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">₦{stats.totalVolume.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Users size={24} /></div>
            <span className="text-slate-500 font-medium">Unpaid Commissions</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{stats.pendingCommissions}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by client, realtor or property..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Transaction Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Client / Realtor</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Property</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Deal Value</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Commission</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center"><Spinner size={24} /></td>
                </tr>
              ) : filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(deal.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-900">{deal.client_name}</div>
                    <div className="text-xs text-slate-500">{deal.realtor_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700 font-medium">{deal.property_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">
                    ₦{Number(deal.deal_value).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-blue-700">₦{Number(deal.realtor_share_amount || 0).toLocaleString()}</div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      deal.commission_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {deal.commission_status || 'no structure'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                      deal.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {deal.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {deal.commission_status === 'unpaid' && (
                      <button 
                        onClick={() => updateCommissionStatus(deal.id, 'paid')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        Mark Commission Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Record New Deal</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleCreateDeal} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Realtor</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                  value={newDeal.realtorId}
                  onChange={e => setNewDeal({...newDeal, realtorId: e.target.value})}
                >
                  <option value="">Select Realtor</option>
                  {realtors.map(r => <option key={r.id} value={r.id}>{r.full_name} ({r.cid_number})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Property</label>
                <select 
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                  value={newDeal.propertyId}
                  onChange={e => setNewDeal({...newDeal, propertyId: e.target.value})}
                >
                  <option value="">Select Property</option>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Client Name</label>
                <input 
                  type="text"
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                  value={newDeal.clientName}
                  onChange={e => setNewDeal({...newDeal, clientName: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deal Value (₦)</label>
                <input 
                  type="number"
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                  required
                  value={newDeal.dealValue}
                  onChange={e => setNewDeal({...newDeal, dealValue: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-100 transition-all"
              >
                Create Deal Record
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
