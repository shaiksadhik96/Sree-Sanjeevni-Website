export const STORAGE_KEYS = {
  auth: "panchkarma_auth",
  customers: "panchkarma_customers",
};

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const storage = {
  get(key, fallback) {
    if (typeof window === "undefined") {
      return fallback;
    }

    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = safeParse(raw, fallback);
    return parsed ?? fallback;
  },
  set(key, value) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(key);
  },
};
