(async ()=>{
    (function() {
        const n = document.createElement("link").relList;
        if (n && n.supports && n.supports("modulepreload")) return;
        for (const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);
        new MutationObserver((t)=>{
            for (const e of t)if (e.type === "childList") for (const r of e.addedNodes)r.tagName === "LINK" && r.rel === "modulepreload" && c(r);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function i(t) {
            const e = {};
            return t.integrity && (e.integrity = t.integrity), t.referrerPolicy && (e.referrerPolicy = t.referrerPolicy), t.crossOrigin === "use-credentials" ? e.credentials = "include" : t.crossOrigin === "anonymous" ? e.credentials = "omit" : e.credentials = "same-origin", e;
        }
        function c(t) {
            if (t.ep) return;
            t.ep = !0;
            const e = i(t);
            fetch(t.href, e);
        }
    })();
    const d = "modulepreload", m = function(s, n) {
        return new URL(s, n).href;
    }, u = {}, h = function(n, i, c) {
        if (!i || i.length === 0) return n();
        const t = document.getElementsByTagName("link");
        return Promise.all(i.map((e)=>{
            if (e = m(e, c), e in u) return;
            u[e] = !0;
            const r = e.endsWith(".css"), f = r ? '[rel="stylesheet"]' : "";
            if (!!c) for(let l = t.length - 1; l >= 0; l--){
                const a = t[l];
                if (a.href === e && (!r || a.rel === "stylesheet")) return;
            }
            else if (document.querySelector(`link[href="${e}"]${f}`)) return;
            const o = document.createElement("link");
            if (o.rel = r ? "stylesheet" : d, r || (o.as = "script", o.crossOrigin = ""), o.href = e, document.head.appendChild(o), r) return new Promise((l, a)=>{
                o.addEventListener("load", l), o.addEventListener("error", ()=>a(new Error(`Unable to preload CSS for ${e}`)));
            });
        })).then(()=>n()).catch((e)=>{
            const r = new Event("vite:preloadError", {
                cancelable: !0
            });
            if (r.payload = e, window.dispatchEvent(r), !r.defaultPrevented) throw e;
        });
    };
    h(()=>import("./index-25e5e6d7.js").then(async (m)=>{
            await m.__tla;
            return m;
        }), [], import.meta.url).catch((s)=>console.error("Error importing `index.js`:", s));
})();
