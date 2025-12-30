const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

class ApiInterceptor {
  constructor() {
    if (typeof window === "undefined") return;

    if (window.__apiInterceptorInitialized) return;
    window.__apiInterceptorInitialized = true;

    this.originalFetch = window.fetch;
    this.initInterceptor();
  }

  initInterceptor() {
    const originalFetch = this.originalFetch;

    window.fetch = async (url, options = {}) => {
      // 🚫 Ignore Next.js internal requests
      if (
        typeof url === "string" &&
        (url.includes("__nextjs") ||
          url.startsWith("/_next") ||
          url.startsWith("/__next"))
      ) {
        return originalFetch(url, options);
      }

      let finalUrl = url;

      // ✅ Only proxy backend APIs
      if (typeof url === "string" && url.startsWith("/api")) {
        finalUrl = `${API_BASE_URL}${url}`;
      }

      const finalOptions = {
        ...options,
        headers: {
          ...(options.headers || {}),
          "Content-Type": "application/json",
        },
      };

      const response = await originalFetch(finalUrl, finalOptions);

      // Handle auth errors
      if (response.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        sessionStorage.removeItem("atorix_auth_token");

        if (!window.location.pathname.includes("/admin/login")) {
          window.location.href = "/admin/login";
        }
      }

      return response;
    };
  }
}

if (typeof window !== "undefined") {
  new ApiInterceptor();
}

export default null;
