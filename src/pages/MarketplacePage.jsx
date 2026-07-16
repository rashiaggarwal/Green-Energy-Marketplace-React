import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../services/apiClient";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";

export default function MarketplacePage() {
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = user?.role || "BUYER";

  const navigate = useNavigate();

  const [energySource, setEnergySource] =
    useState("All");

  const [listings, setListings] =
    useState([]);

  const [page, setPage] =
    useState(0);

  const limit = 12;

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  const [verifiedIds, setVerifiedIds] =
    useState({});

  const [quantities, setQuantities] =
    useState({});

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalListing, setModalListing] =
    useState(null);

  const [confirming, setConfirming] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const loaderRef = useRef(null);

  useEffect(() => {
    setListings([]);
    setPage(0);
    setHasMore(true);
  }, [energySource]);

  useEffect(() => {
    fetchListings();
  }, [page]);

  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          const target =
            entries[0];

          if (
            target.isIntersecting &&
            hasMore &&
            !loading
          ) {
            setPage(
              (prev) => prev + 1
            );
          }
        },
        {
          threshold: 0.5,
        }
      );

    if (loaderRef.current) {
      observer.observe(
        loaderRef.current
      );
    }

    return () =>
      observer.disconnect();
  }, [
    hasMore,
    loading,
  ]);

  async function fetchListings() {
    if (loading || !hasMore)
      return;

    setLoading(true);

    try {
      const skip =
        page * limit;

      const data =
        await apiClient.getActiveListings(
          skip,
          limit,
          energySource === "All"
            ? undefined
            : energySource
        );

      const records =
        Array.isArray(data)
          ? data
          : [];

      setListings((prev) =>
        page === 0
          ? records
          : [
              ...prev,
              ...records,
            ]
      );

      setHasMore(
        records.length === limit
      );
    } catch (err) {
      setToast({
        type: "error",
        message:
          "Failed to load listings.",
      });
    }

    setLoading(false);
  }

  const handleVerify =
    async (listing) => {
      try {
        await apiClient.verifyListing(
          listing.id
        );

        setVerifiedIds(
          (prev) => ({
            ...prev,
            [listing.id]:
              true,
          })
        );

        setToast({
          type: "success",
          message:
            "Verified on blockchain.",
        });
      } catch {
        setToast({
          type: "error",
          message:
            "Verification failed.",
        });
      }
    };

  const handleEdit =
    (listing) => {
      navigate(
        `/credits?edit=${listing.id}`
      );
    };

  const handleQuantityChange = (
    listingId,
    value,
    max
  ) => {
    const quantity =
      Number(value || 0);

    const finalValue =
      quantity > max
        ? max
        : quantity < 0
        ? 0
        : quantity;

    setQuantities((prev) => ({
      ...prev,
      [listingId]: finalValue,
    }));
  };

  const handleBuy =
    async (listing) => {
      const qty = Number(
        quantities[
          listing.id
        ] || 0
      );

      if (!qty) {
        setToast({
          type: "error",
          message:
            "Enter a valid quantity.",
        });

        return;
      }

      const verified =
        verifiedIds[
          listing.id
        ] ||
        listing.verified;

      if (!verified) {
        setToast({
          type: "error",
          message:
            "Please verify listing first.",
        });

        return;
      }

      try {
        const purchase = await apiClient.buyCredit(
          listing.id,
          qty
        );

        let verified = false;

        if (purchase && purchase.id) {
          try {
            await apiClient.verifyPurchase(purchase.id);

            verified = true;

            setVerifiedIds((prev) => ({
              ...prev,
              [listing.id]: true,
            }));
          } catch (err) {
            console.warn(
              "Purchase verification failed",
              err
            );
          }
        }

        setToast({
          type: "success",
          message: verified
            ? "Purchase successful and verified."
            : "Purchase successful. Verification pending.",
        });

        setListings([]);
        setPage(0);
        setHasMore(true);
      } catch (err) {
        setToast({
          type: "error",
          message:
            err.message ||
            "Purchase failed.",
        });
      }
    };

  const handleCancel =
    (listing) => {
      setModalListing(
        listing
      );
      setModalOpen(true);
    };

  const confirmCancel =
    async () => {
      if (!modalListing)
        return;

      try {
        setConfirming(true);

        await apiClient.cancelListing(
          modalListing.id
        );

        setToast({
          type: "success",
          message:
            "Listing cancelled.",
        });

        setModalOpen(false);

        setListings([]);
        setPage(0);
        setHasMore(true);
      } catch {
        setToast({
          type: "error",
          message:
            "Failed to cancel listing.",
        });
      } finally {
        setConfirming(false);
      }
    };

  const sources = [
    "All",
    ...Array.from(
      new Set(
        listings.map(
          (l) =>
            l.energy_source
        )
      )
    ).filter(Boolean),
  ];

  return (
    <>
      <div className="page-title">
        <h2>
          Marketplace
        </h2>

        <p>
          Browse and trade energy
          listings
        </p>
      </div>

      <div className="card">
        <div className="market-toolbar">

          <div
            style={{
              display:
                "flex",
              gap: 10,
              alignItems:
                "center",
            }}
          >
            <label>
              Source:
            </label>

            <select
              value={
                energySource
              }
              onChange={(
                e
              ) =>
                setEnergySource(
                  e.target
                    .value
                )
              }
            >
              {sources.map(
                (source) => (
                  <option
                    key={
                      source
                    }
                  >
                    {source}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            className="filter-btn"
            onClick={() => {
              setListings(
                []
              );
              setPage(0);
              setHasMore(
                true
              );
            }}
          >
            Refresh
          </button>

        </div>
      </div>

      <div
        style={{
          marginTop:
            20,
        }}
      >
        {!loading &&
          listings.length ===
            0 && (
            <div
              style={{
                textAlign:
                  "center",
              }}
            >
              No listings found
            </div>
          )}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(300px,1fr))",
            gap: 16,
          }}
        >
          {listings.map(
            (
              listing
            ) => {
              const verified =
                verifiedIds[
                  listing
                    .id
                ] ||
                listing.verified;

              return (
                <div
                  key={
                    listing.id
                  }
                  className="marketplace-audit-card"
                >

                  <div
                    className="card-top"
                  >
                    <div>

                      <div
                        className="marketplace-badge renewable"
                      >
                        {listing.energy_source}
                      </div>

                      <div className="marketplace-verify">
                        {verified ? (
                          <div className="verified-btn">Verified</div>
                        ) : (
                          // only admins may trigger verification
                          role === "ADMIN" ? (
                            <button
                              className="verify-btn"
                              onClick={() => handleVerify(listing)}
                            >
                              Verify
                            </button>
                          ) : null
                        )}
                      </div>

                      <h3>
                        {
                          listing.title
                        }
                      </h3>

                    </div>
                  </div>

                  <div className="marketplace-info">

                    <p>
                      <strong>
                        Energy:
                      </strong>{" "}
                      {
                        listing.energy_kwh
                      }{" "}
                      kWh
                    </p>

                    <p>
                      <strong>
                        Price:
                      </strong>{" "}
                      {
                        listing.price_per_kwh
                      }
                    </p>

                    <p>
                      <strong>
                        Total:
                      </strong>{" "}
                      {
                        listing.total_price
                      }
                    </p>

                    <p>
                      <strong>
                        Location:
                      </strong>{" "}
                      {
                        listing.location
                      }
                    </p>

                  </div>

                  <div className="marketplace-actions">

                    {role ===
                      "BUYER" && (
                      <>
                        <input
                          type="number"
                          className="market-qty-input"
                          placeholder="kWh"
                          min="1"
                          max={
                            listing.energy_kwh
                          }
                          value={
                            quantities[
                              listing
                                .id
                            ] ??
                            ""
                          }
                          onChange={(
                            e
                          ) =>
                            handleQuantityChange(
                              listing.id,
                              e
                                .target
                                .value,
                              listing.energy_kwh
                            )
                          }
                        />

                        <button
                          className="buy-btn"
                          disabled={
                            !verified
                          }
                          onClick={() =>
                            handleBuy(
                              listing
                            )
                          }
                        >
                          Buy
                        </button>
                      </>
                    )}

                    {role === "SELLER" && (
                      <>
                        <button
                          className="audit-btn"
                          onClick={() => handleEdit(listing)}
                        >
                          Edit
                        </button>

                        <button
                          className="audit-btn"
                          onClick={() => handleCancel(listing)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            }
          )}

          {loading &&
            Array.from({
              length: 6,
            }).map(
              (
                _,
                index
              ) => (
                <div
                  key={
                    index
                  }
                  className="marketplace-audit-card skeleton-card"
                />
              )
            )}
        </div>

        <div
          ref={loaderRef}
          style={{
            height: 80,
            display:
              "flex",
            justifyContent:
              "center",
            alignItems:
              "center",
            marginTop:
              20,
          }}
        >
          {loading && (
            <span>
              Loading more
              listings...
            </span>
          )}

          {!hasMore &&
            listings.length >
              0 && (
              <span>
                No more
                listings
              </span>
            )}
        </div>
      </div>

      <ConfirmModal
        open={modalOpen}
        title="Cancel Listing"
        message="Are you sure you want to cancel this listing?"
        onConfirm={
          confirmCancel
        }
        onCancel={() =>
          setModalOpen(
            false
          )
        }
        confirming={
          confirming
        }
      />

      <Toast
        toast={toast}
        onClose={() =>
          setToast(null)
        }
      />
    </>
  );
}