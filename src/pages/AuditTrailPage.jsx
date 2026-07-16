import { useState } from "react";

export default function AuditTrailPage() {
  const [search, setSearch] = useState("");

  const auditEvents = [
    {
      id: 1,
      text: "System initialized",
      time: "8:08:14 am",
    },
    {
      id: 2,
      text: "Marketplace loaded with sample credits",
      time: "8:08:14 am",
    },
    {
      id: 3,
      text: "EC-101 created: 100 kWh from Solar",
      time: "8:08:14 am",
    },
    {
      id: 4,
      text: "EC-101 marked for sell",
      time: "8:08:14 am",
    },
    {
      id: 5,
      text: "EC-118 created: 250 kWh from Wind",
      time: "8:08:14 am",
    },
    {
      id: 6,
      text: "EC-203 created: 80 kWh from Gas",
      time: "8:08:14 am",
    },
    {
      id: 7,
      text: "EC-203 marked for sell",
      time: "8:08:14 am",
    },
  ];

  return (
    <div className="audit-page">
      <div className="page-title">
        <h2>📜 Credit Audit Trail</h2>
      </div>

      <div className="audit-search-row">
        <input
          className="audit-search"
          value={search}
          placeholder="Search audit history by Credit ID e.g. EC-101"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="audit-search-btn">
          Search Audit
        </button>
      </div>

      <div className="audit-grid">
        {auditEvents.map((item) => (
          <div
            key={item.id}
            className="audit-card"
          >
            <div className="audit-number">
              {item.id}
            </div>

            <h3>{item.text}</h3>

            <p>{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}