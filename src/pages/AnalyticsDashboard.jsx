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

const COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#facc15",
  "#22c55e",
  "#ef4444",
];

export default function AnalyticsDashboard() {
  const [loading, setLoading] =
    useState(true);

  const [activeListings, setActiveListings] =
    useState(null);

  const [purchases, setPurchases] =
    useState(null);

    const [filters, setFilters] =
    useState({
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
    
      const fromDate =
        new Date(
            Date.now() -
            Number(filters.period) *
            24 *
            60 *
            60 *
            1000
        ).toISOString();

      const params =
    new URLSearchParams({
    created_from:
      fromDate,

    completed_from:
      fromDate,
          skip: 0,
          limit: 50,

          ...(filters.energySource && {
            energy_source:
              filters.energySource,
          }),

          ...(filters.location && {
            location:
              filters.location,
          }),
        }).toString();

      const [
        activeResponse,
        purchaseResponse,
      ] = await Promise.all([
        apiClient.getPublicActiveListings(
          `?${params}`
        ),

        apiClient.getPublicPurchases(
          `?${params}`
        ),
      ]);

      setActiveListings(
        activeResponse
      );

      setPurchases(
        purchaseResponse
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const supplyShare =
    useMemo(() => {
      if (
        !activeListings
          ?.source_breakdown
      )
        return [];

      return Object.entries(
        activeListings.source_breakdown
      ).map(
        ([key, value]) => ({
          name:
            key.replace(
              "EnergySource.",
              ""
            ),

          value:
            value.market_share_pct,
        })
      );
    }, [activeListings]);

  const demandShare =
    useMemo(() => {
      if (
        !purchases
          ?.demand_by_source
      )
        return [];

      return Object.entries(
        purchases.demand_by_source
      ).map(
        ([key, value]) => ({
          name:
            key.replace(
              "EnergySource.",
              ""
            ),

          value:
            value.demand_share_pct,
        })
      );
    }, [purchases]);

  const supplyDemand =
    useMemo(() => {
      if (
        !activeListings ||
        !purchases
      )
        return [];

      const map = {};

      Object.entries(
        activeListings.source_breakdown
      ).forEach(
        ([source, value]) => {
          map[source] = {
            source:
              source.replace(
                "EnergySource.",
                ""
              ),

            supply:
              value.total_kwh_available,

            demand: 0,
          };
        }
      );

      Object.entries(
        purchases.demand_by_source
      ).forEach(
        ([source, value]) => {
          if (!map[source]) {
            map[source] = {
              source:
                source.replace(
                  "EnergySource.",
                  ""
                ),

              supply: 0,

              demand: 0,
            };
          }

          map[
            source
          ].demand =
            value.total_kwh_sold;
        }
      );

      return Object.values(map);
    }, [
      activeListings,
      purchases,
    ]);

  const revenueData =
    useMemo(() => {
      if (
        !purchases
          ?.demand_by_source
      )
        return [];

      return Object.entries(
        purchases.demand_by_source
      ).map(
        ([key, value]) => ({
          source:
            key.replace(
              "EnergySource.",
              ""
            ),

          revenue:
            value.total_revenue_eth,
        })
      );
    }, [purchases]);

  const locationData =
    useMemo(() => {
      if (
        !activeListings
          ?.location_breakdown
      )
        return [];

      return Object.entries(
        activeListings.location_breakdown
      ).map(
        ([city, sources]) => ({
          city,

          Solar:
            sources[
              "EnergySource.SOLAR"
            ]
              ?.total_kwh || 0,

          Wind:
            sources[
              "EnergySource.WIND"
            ]
              ?.total_kwh || 0,

          Hydro:
            sources[
              "EnergySource.HYDRO"
            ]
              ?.total_kwh || 0,
        })
      );
    }, [activeListings]);

  const totalSupply =
    activeListings?.meta
      ?.total_active_kwh || 0;

  const activeListingsCount =
    activeListings?.meta
      ?.total_active_listings || 0;

  const totalDemand =
    Object.values(
      purchases
        ?.demand_by_source || {}
    ).reduce(
      (sum, item) =>
        sum +
        item.total_kwh_sold,
      0
    );

  const totalRevenue =
    Object.values(
      purchases
        ?.demand_by_source || {}
    ).reduce(
      (sum, item) =>
        sum +
        item.total_revenue_eth,
      0
    );

  if (loading) {
    return (
      <div>
        Loading Analytics...
      </div>
    );
  }

  return (
    <div className="analytics-page">

      <h1>
        ⚡ Energy Intelligence
        Center
      </h1>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
        }}
      >

        <select
          onChange={(e) =>
            setFilters(
              (prev) => ({
                ...prev,
                energySource:
                  e.target.value,
              })
            )
          }
        >
          <option value="">
            All Sources
          </option>

          <option value="SOLAR">
            Solar
          </option>

          <option value="WIND">
            Wind
          </option>

          <option value="HYDRO">
            Hydro
          </option>
        </select>

        <select
            value={filters.period}
            onChange={(e) =>
                setFilters((prev) => ({
                ...prev,
                period: e.target.value,
                }))
            }
            >
            <option value="7">
                Last 7 Days
            </option>

            <option value="30">
                Last 30 Days
            </option>

            <option value="90">
                Last 90 Days
            </option>

            <option value="365">
                Last Year
            </option>
        </select>

      </div>

      <div className="grid-4">

        <div className="stat-card">
          <h2>
            {totalSupply}
          </h2>
          <p>
            Total Supply (kWh)
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {totalDemand}
          </h2>
          <p>
            Total Demand (kWh)
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {totalRevenue}
          </h2>
          <p>
            Revenue (ETH)
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {
              activeListingsCount
            }
          </h2>
          <p>
            Active Listings
          </p>
        </div>

      </div>

      <div className="chart-grid">

        <div className="card">

          <h3>
            Supply Market Share
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={
                  supplyShare
                }
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {supplyShare.map(
                  (
                    _,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

        <div className="card">

          <h3>
            Demand Market Share
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>

              <Pie
                data={
                  demandShare
                }
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {demandShare.map(
                  (
                    _,
                    index
                  ) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="card">

        <h3>
          Supply vs Demand
        </h3>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={
              supplyDemand
            }
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="supply"
              fill="#16a34a"
            />

            <Bar
              dataKey="demand"
              fill="#f97316"
            />

          </BarChart>
        </ResponsiveContainer>

      </div>

      <div className="chart-grid">

        <div className="card">

          <h3>
            Revenue by Source
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={
                revenueData
              }
            >
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />

              <Bar
                dataKey="revenue"
                fill="#8b5cf6"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="card">

          <h3>
            Supply by Location
          </h3>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart
              data={
                locationData
              }
            >
              <XAxis dataKey="city" />
              <YAxis />
              <Legend />
              <Tooltip />

              <Bar
                stackId="a"
                dataKey="Hydro"
                fill="#0ea5e9"
              />

              <Bar
                stackId="a"
                dataKey="Wind"
                fill="#8b5cf6"
              />

              <Bar
                stackId="a"
                dataKey="Solar"
                fill="#facc15"
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}