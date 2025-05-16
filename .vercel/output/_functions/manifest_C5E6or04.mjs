import 'kleur/colors';
import { n as decodeKey } from './chunks/astro/server_XkzkhHpx.mjs';
import 'clsx';
import 'cookie';
import './chunks/astro-designed-error-pages_5Ze7Py6X.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DZmXA2NY.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || undefined,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : undefined,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/kali/code/zessu.github.io/","cacheDir":"file:///home/kali/code/zessu.github.io/node_modules/.astro/","outDir":"file:///home/kali/code/zessu.github.io/dist/","srcDir":"file:///home/kali/code/zessu.github.io/src/","publicDir":"file:///home/kali/code/zessu.github.io/public/","buildClientDir":"file:///home/kali/code/zessu.github.io/dist/client/","buildServerDir":"file:///home/kali/code/zessu.github.io/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"rss.xml","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","isIndex":false,"type":"endpoint","pattern":"^\\/rss\\.xml\\/?$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DpYsPiLh.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DpYsPiLh.js"}],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/__db-init","pattern":"^\\/__db-init\\/?$","segments":[[{"content":"__db-init","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/__db-init.astro","pathname":"/__db-init","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.DpYsPiLh.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_actions/[...path]","pattern":"^\\/_actions(?:\\/(.*?))?\\/?$","segments":[[{"content":"_actions","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/astro/dist/actions/runtime/route.js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}}],"site":"https://drew.is-a.dev","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/kali/code/zessu.github.io/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/home/kali/code/zessu.github.io/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/home/kali/code/zessu.github.io/src/pages/__db-init.astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/__db-init@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/home/kali/code/zessu.github.io/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:src/pages/__db-init@_@astro":"pages/__db-init.astro.mjs","\u0000@astro-page:node_modules/astro/dist/actions/runtime/route@_@js":"pages/_actions/_---path_.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","/home/kali/code/zessu.github.io/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DE-LQDDX.mjs","/home/kali/code/zessu.github.io/.astro/content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","/home/kali/code/zessu.github.io/.astro/content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_DZMzy9vs.mjs","\u0000astro:internal-actions":"chunks/_astro_internal-actions_DEU6AaI6.mjs","\u0000@astrojs-manifest":"manifest_C5E6or04.mjs","/home/kali/code/zessu.github.io/src/layouts/BlogPost.astro?astro&type=script&index=1&lang.ts":"_astro/BlogPost.astro_astro_type_script_index_1_lang.BtOU-HKl.js","astro:scripts/page.js":"_astro/page.DpYsPiLh.js","/home/kali/code/zessu.github.io/src/layouts/BlogPost.astro?astro&type=script&index=0&lang.ts":"_astro/BlogPost.astro_astro_type_script_index_0_lang.QzwEHHxv.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/twinkle-star-latin-400-normal.tNjckd4A.woff2","/_astro/twinkle-star-latin-ext-400-normal.CcfqmM-i.woff2","/_astro/twinkle-star-vietnamese-400-normal.BAGYNzaB.woff2","/_astro/twinkle-star-latin-400-normal.CbYBwE5s.woff","/_astro/twinkle-star-vietnamese-400-normal.Cbh7im_e.woff","/_astro/twinkle-star-latin-ext-400-normal.CikcENlC.woff","/_astro/_slug_.DjolxzC0.css","/_astro/BlogPost.astro_astro_type_script_index_0_lang.QzwEHHxv.js","/_astro/BlogPost.astro_astro_type_script_index_1_lang.BtOU-HKl.js","/_astro/page.DpYsPiLh.js","/fonts/atkinson-bold.woff","/fonts/atkinson-regular.woff","/images/typography/Chick-fil-A-Logo-2012-present.png","/images/typography/Gill_Sans_specimen_sheet.jpg","/images/typography/Serif vs sans serif fonts.jpg","/images/typography/blackletter.jpg","/images/typography/display typeface.jpg","/images/typography/dnsrecon.png","/images/typography/doom pixalated font.png","/images/typography/dredd.jpg","/images/typography/feminist women poster.webp","/images/typography/jamie reid queen.webp","/images/typography/jamie reid.jpg","/images/typography/letterscript.png","/images/typography/monospace fonts.png","/images/typography/old vs new logos.png","/images/typography/poster-template-with-protesting-human-rights_23-2148585143.jpg","/images/typography/pulp fiction.webp","/images/typography/rodchenko-2.jpg","/images/typography/slab serif.jpg","/images/typography/stepanova varvara.jpg","/images/typography/the godfather.jpg","/images/typography/times new roman.jpg","/images/typography/typediagram.png","/images/typography/we can do it poster.jpg","/_astro/page.DpYsPiLh.js","/rss.xml","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"d4WG/Pnk5L2+/HJGsCPkhKAaj9GApUwkjKqojHoMNTk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
