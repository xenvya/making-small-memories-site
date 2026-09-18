export default {
  fetch(request, env) {
    const url = new URL(request.url);
    const canonicalHost = "makingsmallmemories.com";
    if (
      url.hostname === `www.${canonicalHost}` ||
      (url.hostname === canonicalHost && url.protocol === "http:")
    ) {
      url.hostname = canonicalHost;
      url.protocol = "https:";
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
