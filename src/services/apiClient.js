import { loaderStore } from "../utils/loaderStore";

const BASE_URL =
  "https://greengridenergyexchange.onrender.com";

let activeRequests = 0;

function showGlobalLoader() {
  window.dispatchEvent(
    new CustomEvent("global-loader", {
      detail: true,
    })
  );
}

function hideGlobalLoader() {
  window.dispatchEvent(
    new CustomEvent("global-loader", {
      detail: false,
    })
  );
}

function getToken() {
  return localStorage.getItem(
    "access_token"
  );
}

async function request(
  endpoint,
  options = {}
) {
  const token = getToken();

  console.log("LOADER SHOW");
  loaderStore.show();

  try {

    const response =
      await fetch(
        `${BASE_URL}${endpoint}`,
        {
          ...options,

          headers: {
            "Content-Type":
              "application/json",

            ...(token && {
              Authorization:
                `Bearer ${token}`,
            }),

            ...options.headers,
          },
        }
      );

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error(
        data?.detail ||
        data?.message ||
        "API request failed"
      );
    }

    return data;

  } finally {

    console.log("LOADER HIDE");
    loaderStore.hide();

  }
}

export const apiClient = {
  async registerUser(
    payload
  ) {
    return request(
      "/api/v1/users/register",
      {
        method: "POST",
        body: JSON.stringify(
          payload
        ),
      }
    );
  },

  async loginUser(
    payload
  ) {
    const response =
      await request(
        "/api/v1/users/login",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      );

    localStorage.setItem(
      "access_token",
      response.access_token
    );

    localStorage.setItem(
      "refresh_token",
      response.refresh_token
    );

    localStorage.setItem(
      "user",
      JSON.stringify(
        response.user
      )
    );

    return response;
  },

  getCurrentUser() {
    return request(
      "/api/v1/users/me"
    );
  },

  verifyListing(
    listingId
  ) {
    return request(
      `/api/v1/blockchain/verify/listing/${listingId}`
    );
  },

  verifyPurchase(purchaseId) {
    return request(
      `/api/v1/blockchain/verify/purchase/${purchaseId}`
    );
  },

  getActiveListings(skip = 0, limit = 10, energy_source) {
    const params = new URLSearchParams();
    params.append("skip", String(skip));
    params.append("limit", String(limit));

    if (energy_source && energy_source !== "All") {
      params.append("energy_source", energy_source);
    }

    return request(`/api/v1/listings/active?${params.toString()}`);
  },

  // Cancel a listing by calling the cancel endpoint with the full listing payload
  cancelListing(listing) {
    const id = listing?.id || listing;
    const body = typeof listing === "object" ? listing : { id };

    return request(`/api/v1/listings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  buyCredit(
    listingId,
    energyKwh
  ) {
    return request(
      "/api/v1/purchases",
      {
        method: "POST",

        body: JSON.stringify({
          listing_id:
            listingId,

          energy_kwh:
            Number(
              energyKwh
            ),
        }),
      }
    );
  },

  getMyListings(skip = 0, limit = 10) {
    return request(
      `/api/v1/listings/my-listings?skip=${skip}&limit=${limit}`
    );
  },

  getMyPurchases(skip = 0, limit = 10) {
    return request(
      `/api/v1/purchases/my-purchases?skip=${skip}&limit=${limit}`
    );
  },

  async createListing(payload) {
    return request(`/api/v1/listings`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getListing(listingId) {
    return request(`/api/v1/listings/${listingId}`);
  },

  updateListing(listingId, payload) {
    return request(`/api/v1/listings/${listingId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

async logoutUser() {
  try {
    await request(
      "/api/v1/users/logout",
      {
        method: "POST",
      }
    );
  } finally {
    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user"
    );
  }
 },

  askAssistant(question) {
    return fetch(
      "https://d2iofwozlvn5we.cloudfront.net/query",
      {
        method: "POST",

        headers: {
          accept:
            "application/json",

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          question,
          top_k: 5,
        }),
      }
    ).then((res) =>
      res.json()
    );
  },
};