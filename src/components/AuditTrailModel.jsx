export default function AuditTrailModel({
  open,
  audit,
  onClose,
}) {
  if (!open || !audit) {
    return null;
  }

  return (
    <div className="audit-overlay">
      <div className="audit-modal">

        <div className="audit-header">
          <h2>🔍 Listing Audit Trail</h2>

          <button
            onClick={onClose}
            className="audit-close-btn"
          >
            ✕
          </button>
        </div>

        <h3>{audit.listing_title}</h3>

        <p>
          Seller: <strong>{audit.seller_username}</strong>
        </p>

        <div className="audit-summary-grid">

          <div className="audit-stat">
            <span>Energy</span>
            <strong>
              {audit.energy_kwh} kWh
            </strong>
          </div>

          <div className="audit-stat">
            <span>Status</span>
            <strong>
              {audit.summary.status}
            </strong>
          </div>

          <div className="audit-stat">
            <span>Purchases</span>
            <strong>
              {audit.summary.total_purchases}
            </strong>
          </div>

          <div className="audit-stat">
            <span>Verified</span>
            <strong>
              {audit.summary.verified
                ? "✅ Yes"
                : "❌ No"}
            </strong>
          </div>

        </div>

        <div className="audit-timeline">

          {audit.event_timeline.map(
            (event) => (
              <div
                key={event.id}
                className="audit-event-card"
              >

                <div className="audit-event-header">

                  <span className="audit-event-type">
                    {event.event_type
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(
                        /\b\w/g,
                        (c) => c.toUpperCase()
                      )}
                  </span>

                  <span className="audit-event-time">
                    {new Date(
                      event.timestamp
                    ).toLocaleString()}
                  </span>

                </div>

                <div className="audit-event-body">

                  {event.initiated_by_username && (
                    <p>
                      <strong>User:</strong>{" "}
                      {event.initiated_by_username}
                    </p>
                  )}

                  {event.energy_kwh && (
                    <p>
                      <strong>Energy:</strong>{" "}
                      {event.energy_kwh} kWh
                    </p>
                  )}

                  {event.purchase_id && (
                    <p>
                      <strong>Purchase:</strong>{" "}
                      {event.purchase_id}
                    </p>
                  )}

                  {Object.entries(
                    event.details || {}
                  ).map(
                    ([key, value]) => (
                      <p key={key}>
                        <strong>
                          {key.replaceAll(
                            "_",
                            " "
                          )}
                          :
                        </strong>{" "}
                        {String(value)}
                      </p>
                    )
                  )}

                 {event.blockchain_tx_hash && (
                        <>
                            <p
                            style={{
                                fontSize: 12,
                                color: "#64748b",
                                wordBreak: "break-all",
                            }}
                            >
                            {event.blockchain_tx_hash}
                            </p>

                            {`https://sepolia.etherscan.io/tx/${event.blockchain_tx_hash}`}
                        </>
                        )}
                </div>

              </div>
            )
          )}

        </div>

      </div>
    </div>
  );
}