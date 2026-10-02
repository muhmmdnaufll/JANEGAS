/**
 * Cloudflare Pages Function: API Reverse Proxy
 * Automatically proxies requests from /api/* to the production FastAPI backend.
 * Configure BACKEND_API_URL in Cloudflare Pages -> Settings -> Environment Variables.
 */
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // If BACKEND_API_URL environment variable is set in Cloudflare Pages, use it
  const backendOrigin = env.BACKEND_API_URL;
  if (!backendOrigin) {
    // If not configured, pass through to origin or return diagnostic helper
    return new Response(
      JSON.stringify({
        error: "BACKEND_API_URL_NOT_CONFIGURED",
        message: "Please configure BACKEND_API_URL in Cloudflare Pages Environment Variables or set VITE_API_URL directly on build time."
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  const cleanBackend = backendOrigin.replace(/\/+$/, "");
  const targetUrl = `${cleanBackend}${url.pathname}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      redirect: "follow",
    });

    return response;
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "PROXY_FETCH_ERROR",
        message: err.message || "Failed to fetch from backend origin"
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
