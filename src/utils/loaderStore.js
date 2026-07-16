let activeRequests = 0;
let subscribers = [];

export const loaderStore = {
  subscribe(callback) {
    subscribers.push(callback);

    return () => {
      subscribers = subscribers.filter(
        (cb) => cb !== callback
      );
    };
  },

  show() {
    activeRequests++;

    console.log(
      "SUBSCRIBERS",
      subscribers.length
    );

    subscribers.forEach((callback) =>
      callback(true)
    );
  },

  hide() {
    activeRequests--;

    if (activeRequests <= 0) {
      activeRequests = 0;

      subscribers.forEach((callback) =>
        callback(false)
      );
    }
  },
};