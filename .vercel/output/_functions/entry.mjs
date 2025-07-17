import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_C5npBfvx.mjs';
import { manifest } from './manifest_D0idZYKd.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/__db-init.astro.mjs');
const _page2 = () => import('./pages/_actions/_---path_.astro.mjs');
const _page3 = () => import('./pages/blog/_---slug_.astro.mjs');
const _page4 = () => import('./pages/rss.xml.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/__db-init.astro", _page1],
    ["node_modules/astro/dist/actions/runtime/route.js", _page2],
    ["src/pages/blog/[...slug].astro", _page3],
    ["src/pages/rss.xml.js", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = {
    "middlewareSecret": "230afe34-9fcf-44f7-bdbc-4c2558ac6c8f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
