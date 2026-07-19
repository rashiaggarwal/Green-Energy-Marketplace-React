// AuditTrailModal.jsx

export default function AuditTrailModal({
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

          <h2>
            🔍 Listing Audit Trail
          </h2>

          <button
            onClick={onClose}
          >
            ✕
          </button>

        </div>

        <div className="audit-summary">

          <h3>
            {audit.listing_title}
          </h3>

          <p>
            Seller:
            {" "}
            {audit.seller_username}
          </p>

          <p>
            Energy:
            {" "}
            {audit.energy_kwh}
            kWh
          </p>

          <p>
            Status:
            {" "}
            {audit.summary.status}
          </p>

          <p>
            {audit.summary.verified
              ? "✅ Verified"
              : "❌ Unverified"}
          </p>

        </div>

        <div className="audit-timeline">

          {audit.event_timeline.map(
            (event) => (

              <div
                key={event.id}
                className="timeline-node"
              >

                <h4>
                  {event.event_type}
                </h4>

                <p>
                  By:
                  {" "}
                  {event.initiated_by_username}
                </p>

                <p>
                  {new Date(
                    event.timestamp
                  ).toLocaleString()}
                </p>

                {event.blockchain_tx_hash && (
                <a
                    href={`https://sepolia.etherscan.io/tx/${event.blockchain_tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link">
                    🔗 View Transaction
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