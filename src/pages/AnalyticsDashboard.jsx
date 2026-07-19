import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { apiClient } from "../services/apiClient";

// Updated color palette to match the modern, clean energy UI
const ENERGY_COLORS = {
  SOLAR: "#FBBF24",      // Bright Amber
  WIND: "#0EA5E9",       // Light Blue/Teal
  HYDRO: "#1E40AF",      // Deep Blue
  BIOMASS: "#22C55E",    // Green
  GEOTHERMAL: "#EF4444", // Red
  TIDAL: "#14B8A6",      // Teal
  OTHER: "#94A3B8",      // Slate
};

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [activeListings, setActiveListings] = useState(null);
  const [purchases, setPurchases] = useState(null);
  
  const [filters, setFilters] = useState({
    energySource: "",
    location: "",
    period: "30",
  });

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  async function loadAnalytics() {
    try {
      setLoading(true);
      const fromDate = new Date(
        Date.now() - Number(filters.period) * 24 * 60 * 60 * 1000
      ).toISOString();

      const params = new URLSearchParams({
        created_from: fromDate,
        completed_from: fromDate,
        skip: 0,
        limit: 50,
        ...(filters.energySource && { energy_source: filters.energySource }),
        ...(filters.location && { location: filters.location }),
      }).toString();

      const [activeResponse, purchaseResponse] = await Promise.all([
        apiClient.getPublicActiveListings(`?${params}`),
        apiClient.getPublicPurchases(`?${params}`),
      ]);

      setActiveListings(activeResponse);
      setPurchases(purchaseResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const supplyShare = useMemo(() => {
    if (!activeListings?.source_breakdown) return [];
    return Object.entries(activeListings.source_breakdown).map(([key, value]) => ({
      name: key.replace("EnergySource.", ""),
      value: value.market_share_pct,
    }));
  }, [activeListings]);

  const demandShare = useMemo(() => {
    if (!purchases?.demand_by_source) return [];
    return Object.entries(purchases.demand_by_source).map(([key, value]) => ({
      name: key.replace("EnergySource.", ""),
      value: value.demand_share_pct,
    }));
  }, [purchases]);

  const supplyDemand = useMemo(() => {
    if (!activeListings || !purchases) return [];
    const map = {};

    Object.entries(activeListings.source_breakdown).forEach(([source, value]) => {
      map[source] = {
        source: source.replace("EnergySource.", ""),
        supply: value.total_kwh_available,
        demand: 0,
      };
    });

    Object.entries(purchases.demand_by_source).forEach(([source, value]) => {
      if (!map[source]) {
        map[source] = {
          source: source.replace("EnergySource.", ""),
          supply: 0,
          demand: 0,
        };
      }
      map[source].demand = value.total_kwh_sold;
    });

    return Object.values(map);
  }, [activeListings, purchases]);

  const locationData = useMemo(() => {
    if (!activeListings?.location_breakdown) return [];
    return Object.entries(activeListings.location_breakdown).map(([city, sources]) => ({
      city,
      Solar: sources["EnergySource.SOLAR"]?.total_kwh || 0,
      Wind: sources["EnergySource.WIND"]?.total_kwh || 0,
      Hydro: sources["EnergySource.HYDRO"]?.total_kwh || 0,
    }));
  }, [activeListings]);

  const totalSupply = activeListings?.meta?.total_active_kwh || 0;
  const activeListingsCount = activeListings?.meta?.total_active_listings || 0;
  
  const totalDemand = Object.values(purchases?.demand_by_source || {}).reduce(
    (sum, item) => sum + item.total_kwh_sold,
    0
  );

  const totalRevenue = Object.values(purchases?.demand_by_source || {}).reduce(
    (sum, item) => sum + item.total_revenue_eth,
    0
  );

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading Analytics...</div>;
  }

  return (
    <div className="analytics-page" style={{ padding: "24px", fontFamily: "sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      
      {/* Header Area */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", margin: 0, color: "#0f172a" }}>
          ⚡ Green Energy Marketplace <span style={{ color: "#64748b", fontWeight: "400" }}>| Energy Intelligence Center</span>
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <select
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: "500" }}
          onChange={(e) => setFilters((prev) => ({ ...prev, energySource: e.target.value }))}
        >
          <option value="">All Sources</option>
          <option value="SOLAR">Solar</option>
          <option value="WIND">Wind</option>
          <option value="HYDRO">Hydro</option>
        </select>

        <select
          style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", backgroundColor: "#e0f2fe", color: "#0369a1", fontWeight: "500" }}
          value={filters.period}
          onChange={(e) => setFilters((prev) => ({ ...prev, period: e.target.value }))}
        >
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="90">Last 90 Days</option>
          <option value="365">Last Year</option>
        </select>
      </div>

      {/* Top KPI Cards Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        
        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#0f172a" }}>{totalSupply}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Total Supply (kWh)</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#0f172a" }}>{totalDemand}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Total Demand (kWh)</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#0f172a" }}>{totalRevenue.toFixed(2)} ETH</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Total Revenue</p>
        </div>

        <div style={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", margin: "0 0 8px 0", color: "#0f172a" }}>{activeListingsCount}</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: "500" }}>Active Listings</p>
        </div>

      </div>

      {/* Main Charts 2x2 Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
        
        {/* Credit Supply Mix (Donut Chart) */}
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#334155" }}>Credit Supply Mix</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={supplyShare}
                dataKey="value"
                nameKey="name"
                innerRadius={70} // Creates the Donut effect
                outerRadius={100}
                paddingAngle={5}
              >
                {supplyShare.map((entry, index) => (
                  <Cell key={index} fill={ENERGY_COLORS[entry.name] || "#64748B"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Market Demand Mix (Donut Chart) */}
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#334155" }}>Market Demand Mix</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={demandShare}
                dataKey="value"
                nameKey="name"
                innerRadius={70} // Creates the Donut effect
                outerRadius={100}
                paddingAngle={5}
              >
                {demandShare.map((entry, index) => (
                  <Cell key={index} fill={ENERGY_COLORS[entry.name] || "#64748B"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Active Marketplace Supply vs Demand */}
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#334155" }}>Active Marketplace Supply vs Demand</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplyDemand} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="source" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v) => `${v} kWh`} />
              <Legend />
              {/* Using visually distinct, coordinated colors for comparison */}
              <Bar dataKey="supply" name="Supply (kWh)" fill="#86EFAC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="demand" name="Demand (kWh)" fill="#7DD3FC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown by Location */}
        <div style={{ backgroundColor: "#ffffff", padding: "24px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h3 style={{ margin: "0 0 24px 0", fontSize: "16px", color: "#334155" }}>Supply Breakdown by Location</h3>
          <ResponsiveContainer width="100%" height={300}>
            {/* Removed stackId to make it a Grouped Bar Chart for easier comparison */}
            <BarChart data={locationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="city" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Legend />
              <Bar dataKey="Solar" fill={ENERGY_COLORS.SOLAR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Wind" fill={ENERGY_COLORS.WIND} radius={[4, 4, 0, 0]} />
              <Bar dataKey="Hydro" fill={ENERGY_COLORS.HYDRO} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}