export default function AuditTrailModel({
  open,
  audit,
  onClose,
  type='listing'
}) {
  if (!open || !audit) {
    return null;
  }

const lifecycle = [];

const orderedEvents =
  type === "listing"
    ? [...(audit.event_timeline || [])]
        .sort(
          (a, b) =>
            new Date(a.timestamp) -
            new Date(b.timestamp)
        )
    : [];

if (type === "listing") {

  if (
    audit.event_timeline?.some(
      (e) =>
        e.event_type ===
        "LISTING_CREATED"
    )
  ) {
    lifecycle.push({
      icon: "📝",
      label: "Created",
    });
  }

  if (
    audit.event_timeline?.some(
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
    audit.event_timeline?.some(
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
    audit.event_timeline?.some(
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
    audit.event_timeline?.some(
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
}

  const purchaseLifecycle =
  type === "purchase"
    ? [
        {
          icon: "🛒",
          label: "Purchased",
          completed: !!audit.created_at,
        },
        {
          icon: "💳",
          label: "Completed",
          completed: !!audit.completed_at,
        },
        {
          icon: "♻️",
          label: "Consumed",
          completed: !!audit.consumed_at,
        },
      ]
    : [];

    
const steps =
  type === "purchase"
    ? purchaseLifecycle
    : lifecycle;


  return (
    <div className="audit-overlay">
      <div className="audit-modal">

        <div className="audit-header">

          <div>
            <h2>
              {type === "purchase"
                ? "🔍 Purchase Audit Report"
                : "🔍 Energy Credit Audit Trail"}
            </h2>

            <p>
              {type === "purchase"
                ? `Purchase #${audit.id?.slice(0, 8)}`
                : audit.listing_title}
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
{type === "purchase" ? (
  <div className="audit-summary-grid">
    <div className="audit-stat">
      <span>Energy</span>
      <strong>{audit.energy_kwh} kWh</strong>
    </div>

    <div className="audit-stat">
      <span>Total Price</span>
      <strong>{audit.total_price}</strong>
    </div>

    <div className="audit-stat">
      <span>Status</span>
      <strong>{audit.status}</strong>
    </div>

    <div className="audit-stat">
      <span>Purchase</span>
      <strong>
        {audit.id.slice(0, 8)}
      </strong>
    </div>
  </div>
) : (
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
)}

        {/* STATUS */}
       {/* STATUS */}

<div
  className={
    type === "purchase"
      ? "audit-success"
      : audit.summary.is_tampered
        ? "audit-alert"
        : "audit-success"
  }
>
  {type === "purchase"
    ? "✅ Purchase Verified on Blockchain"
    : audit.summary.is_tampered
      ? "⚠ Blockchain Integrity Alert Detected"
      : "✅ Blockchain Verified"}
</div>

        {/* LIFECYCLE */}

        <h3 className="section-title">
          Credit Lifecycle
        </h3>

        <div className="audit-lifecycle">

          {steps.map(
            (step, index) => (
              <div
                key={step.label}
                className="lifecycle-wrapper"
              >
                <div
                className="lifecycle-step"
                style={{
                  opacity:
                    step.completed === false
                      ? 0.5
                      : 1,
                }}
              >
                <div>
                  {step.icon}
                </div>

                <span>
                  {step.label}
                </span>
              </div>

                {index <
                  steps.length -
                    1 && (
                  <div className="lifecycle-arrow">
                    ➜
                  </div>
                )}
              </div>
            )
          )}

        </div>

        {type === "purchase" && (
  <>
    <h3 className="section-title">
      Blockchain Transactions
    </h3>

    <div className="events-grid">

      {audit.blockchain_tx_hash && (
        <div className="event-card">
          <h4>
            ⛓ Purchase Transaction
          </h4>

          <p>
            {audit.blockchain_tx_hash.slice(0, 24)}...
          </p>

          <a
            href={`https://sepolia.etherscan.io/tx/${audit.blockchain_tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction →
          </a>
        </div>
      )}

      {audit.consume_tx_hash && (
        <div className="event-card">
          <h4>
            ♻️ Consumption Transaction
          </h4>

          <p>
            {audit.consume_tx_hash.slice(0, 24)}...
          </p>

          <a
            href={`https://sepolia.etherscan.io/tx/${audit.consume_tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction →
          </a>
        </div>
      )}

    </div>
  </>
)}

        {/* HISTORY */}

        {type!=='purchase' && (
          <><h3 className="section-title">
          Event History
        </h3>

        <div className="events-grid">

          {orderedEvents.map(
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
                  <a href={`https://sepolia.etherscan.io/tx/${event.blockchain_tx_hash}`} target="_blank" rel="noopener noreferrer">
                    🔗 View Blockchain Transaction
                  </a>
                )}

              </div>

            )
          )}

        </div>
      </>)}

      </div>
    </div>
  );
}