export default function AuditTrailModel({
  open,
  audit,
  onClose,
}) {
  if (!open || !audit) {
    return null;
  }

  const lifecycle = [];

  if (
    audit.event_timeline.some(
      (e) =>
        e.event_type === "LISTING_CREATED"
    )
  ) {
    lifecycle.push({
      icon: "📝",
      label: "Created",
    });
  }

  if (
    audit.event_timeline.some(
      (e) =>
        e.event_type ===
        "BLOCKCHAIN_TX_MINTED"
    )
  ) {
    lifecycle.push({
      icon: "⛓",
      label: "Minted",
    });
  }

  if (
    audit.event_timeline.some(
      (e) =>
        e.event_type.includes(
          "PURCHASE"
        )
    )
  ) {
    lifecycle.push({
      icon: "🛒",
      label: "Purchased",
    });
  }

  if (
    audit.event_timeline.some(
      (e) =>
        e.event_type ===
        "PURCHASE_CONSUMED"
    )
  ) {
    lifecycle.push({
      icon: "✅",
      label: "Consumed",
    });
  }

  if (
    audit.event_timeline.some(
      (e) =>
        e.event_type.includes(
          "TAMPER"
        )
    )
  ) {
    lifecycle.push({
      icon: "⚠️",
      label: "Tampered",
    });
  }

  return (
    <div className="audit-overlay">
      <div className="audit-modal">

        <div className="audit-header">

          <div>
            <h2>
              🔍 Energy Credit Audit Trail
            </h2>

            <p>
              {audit.listing_title}
            </p>
          </div>

          <button
            className="audit-close-btn"
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        {/* SUMMARY */}

        <div className="audit-summary-grid">

          <div className="audit-stat">
            <span>Seller</span>
            <strong>
              {audit.seller_username}
            </strong>
          </div>

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
            <span>Events</span>
            <strong>
              {audit.total_events}
            </strong>
          </div>

        </div>

        {/* STATUS */}

        <div
          className={
            audit.summary.is_tampered
              ? "audit-alert"
              : "audit-success"
          }
        >
          {audit.summary.is_tampered
            ? "⚠ Blockchain Integrity Alert Detected"
            : "✅ Blockchain Verified"}
        </div>

        {/* LIFECYCLE */}

        <h3 className="section-title">
          Credit Lifecycle
        </h3>

        <div className="audit-lifecycle">

          {lifecycle.map(
            (step, index) => (
              <div
                key={step.label}
                className="lifecycle-wrapper"
              >
                <div className="lifecycle-step">
                  <div>
                    {step.icon}
                  </div>

                  <span>
                    {step.label}
                  </span>
                </div>

                {index <
                  lifecycle.length -
                    1 && (
                  <div className="lifecycle-arrow">
                    ➜
                  </div>
                )}
              </div>
            )
          )}

        </div>

        {/* HISTORY */}

        <h3 className="section-title">
          Event History
        </h3>

        <div className="events-grid">

          {audit.event_timeline.map(
            (event) => (

              <div
                key={event.id}
                className="event-card"
              >

                <div className="event-header">

                  <h4>
                    {event.event_type.replaceAll(
                      "_",
                      " "
                    )}
                  </h4>

                  <span>
                    {new Date(
                      event.timestamp
                    ).toLocaleString()}
                  </span>

                </div>

                {event.initiated_by_username && (
                  <p>
                    <strong>
                      User:
                    </strong>{" "}
                    {
                      event.initiated_by_username
                    }
                  </p>
                )}

                {event.energy_kwh && (
                  <p>
                    <strong>
                      Energy:
                    </strong>{" "}
                    {
                      event.energy_kwh
                    }{" "}
                    kWh
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
                  <a href={`https://sepolia.etherscan.io/tx/${event.blockchain_tx_hash}`}>
                    🔗 View Blockchain Transaction
                  </a>
                )}

              </div>

            )
          )}

        </div>

      </div>
    </div>
  );
}