import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/axios";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

type Property = {
  id: string;
  title: string;
  description: string | null;
  property_type: string;
  status: string;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number | null;
  bathrooms: number | null;
  square_feet: number | null;
  listing_type: string;
  featured: boolean;
  created_at: string;
  primary_image_url?: string | null;
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    propertyType: "",
    listingType: "",
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    search: "",
    sortBy: "created_at",
    sortDir: "desc",
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.propertyType) params.propertyType = filters.propertyType;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.city) params.city = filters.city;
      if (filters.state) params.state = filters.state;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.bedrooms) params.bedrooms = Number(filters.bedrooms);
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortDir) params.sortDir = filters.sortDir;

      const res = await api.get("/properties", { params });
      setProperties(res.data?.data?.items || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    loadProperties();
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Property Marketplace</h1>
          <p className="text-slate-600">Find your perfect property</p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-8 gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.propertyType}
              onChange={(e) => handleFilterChange("propertyType", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
              <option value="service_outlet">Service Outlet</option>
              <option value="airbnb">Airbnb</option>
            </select>
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.listingType}
              onChange={(e) => handleFilterChange("listingType", e.target.value)}
            >
              <option value="">All Listings</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="lease">For Lease</option>
            </select>
            <input
              type="text"
              placeholder="City"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.state}
              onChange={(e) => handleFilterChange("state", e.target.value)}
            />
            <input
              type="number"
              placeholder="Min Price"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
            <input
              type="number"
              placeholder="Bedrooms"
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
            />
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <option value="created_at">Newest</option>
              <option value="price">Price</option>
              <option value="updated_at">Recently Updated</option>
            </select>
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent"
              value={filters.sortDir}
              onChange={(e) => handleFilterChange("sortDir", e.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <button onClick={applyFilters} className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link
                key={property.id}
                to={`/properties/${property.id}`}
                className="card card-hover"
              >
                {property.featured && (
                  <span className="inline-block mb-2 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                    Featured
                  </span>
                )}
                <div className="aspect-video bg-slate-200 rounded-lg mb-4 overflow-hidden relative">
                  {property.primary_image_url ? (
                    <>
                      <img
                        src={property.primary_image_url}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-white/60 text-blue-900 text-xs font-bold px-2 py-1 rounded">
                        SAFENEST
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 size={32} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2 line-clamp-2">
                  {property.title}
                </h3>
                <p className="text-2xl font-bold text-blue-800 mb-2">
                  {formatPrice(property.price, property.currency)}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                  {property.bedrooms && <span>{property.bedrooms} Beds</span>}
                  {property.bathrooms && <span>{property.bathrooms} Baths</span>}
                  {property.square_feet && <span>{property.square_feet} sqft</span>}
                </div>
                <p className="text-sm text-slate-600">
                  {property.address}, {property.city}, {property.state}
                </p>
                <div className="mt-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-800 rounded">
                    {property.listing_type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
