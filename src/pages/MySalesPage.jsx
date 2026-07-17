import { useEffect, useState } from "react";
import { apiClient } from "../services/apiClient";

export default function MySalesPage() {

  const [sales, setSales] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  async function loadSales() {

    try {

      const data =
        await apiClient.getMySales(
          0,
          50
        );

      setSales(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  }

  const totalSales =
    sales.length;

  const totalEnergy =
    sales.reduce(
      (sum, sale) =>
        sum +
        (sale.energy_kwh || 0),
      0
    );

  const totalRevenue =
    sales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total_price || 0
        ),
      0
    );

  const completedSales =
    sales.filter(
      (sale) =>
        sale.status ===
        "COMPLETED"
    ).length;

  if (loading) {
    return (
      <div>
        Loading sales...
      </div>
    );
  }

  return (
    <>
      <div className="page-title">
        <h2>
          💰 My Sales
        </h2>

        <p>
          All completed
          and pending sales
        </p>
      </div>

      <div className="grid-4">

        <div className="stat-card">
          <h2>
            {totalSales}
          </h2>

          <p>
            Total Sales
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {totalEnergy}
          </h2>

          <p>
            kWh Sold
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {totalRevenue}
          </h2>

          <p>
            Revenue
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {
              completedSales
            }
          </h2>

          <p>
            Completed
          </p>
        </div>

      </div>

      <div
            className="card"
            style={{
            marginTop: 24,
            }}
            >
            <h3>
            📊 Sales Summary
            </h3>

            <div className="grid-4">
            ...
            </div>
            </div>

            <div
            className="market-grid"
            style={{
            marginTop: 24,
            }}
        >

        {sales.map((sale) => (

          <div
            key={sale.id}
            className="marketplace-audit-card"
          >

            <div
              className={`sales-status ${sale.status}`}
            >
              {sale.status}
            </div>

           <div className="sales-header">

        <div>

                <h3>
                Sale #
                {sale.id.slice(
                    0,
                    8
                )}
                </h3>

                <small>
                {new Date(
                    sale.created_at
                ).toLocaleString()}
                </small>

            </div>

            </div>

            <div
  className="sales-metrics"
>

  <div
    className="sales-metric"
  >
    <span>
      Energy Sold
    </span>

    <h2>
      {sale.energy_kwh}
      {" "}
      kWh
    </h2>
  </div>

  <div
    className="sales-metric"
  >
    <span>
      Revenue
    </span>

    <h2>
      {sale.total_price}
    </h2>
  </div>

</div>

<div
  className="marketplace-info"
>

  <p>
    <strong>
      Price/kWh:
    </strong>
    {" "}
    {sale.price_per_kwh}
  </p>

  <p>
    <strong>
      Buyer:
    </strong>
    {" "}
    {sale.buyer_id?.slice(
      0,
      8
    )}
  </p>

  <p>
    <strong>
      Listing:
    </strong>
    {" "}
    {sale.listing_id?.slice(
      0,
      8
    )}
  </p>

</div>

            {sale.blockchain_tx_hash && (

              <div
                className="tx-section"
              >

                <small>
                  🔗 Blockchain TX
                </small>

                <div className="hash">
                    {
                        sale.blockchain_tx_hash?.slice(
                        0,
                        20
                        )
                    }
                    ...
                </div>

              </div>

            )}

            {sale.consume_tx_hash && (

              <div
                className="consumed-badge"
              >
                🔥 Energy
                Consumed
              </div>

            )}

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color:
                  "#64748b",
              }}
            >

              Created:
              {" "}
              {new Date(
                sale.created_at
              ).toLocaleString()}

            </div>

          </div>

        ))}

      </div>
    </>
  );
}