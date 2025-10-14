(async ()=>{
    const de = "/assets/game_of_life_bg-24a34a7b.wasm", le = async (e = {}, t)=>{
        let n;
        if (t.startsWith("data:")) {
            const o = t.replace(/^data:.*?base64,/, "");
            let _;
            if (typeof Buffer == "function" && typeof Buffer.from == "function") _ = Buffer.from(o, "base64");
            else if (typeof atob == "function") {
                const s = atob(o);
                _ = new Uint8Array(s.length);
                for(let r = 0; r < s.length; r++)_[r] = s.charCodeAt(r);
            } else throw new Error("Cannot decode base64-encoded data URL");
            n = await WebAssembly.instantiate(_, e);
        } else {
            const o = await fetch(t), _ = o.headers.get("Content-Type") || "";
            if ("instantiateStreaming" in WebAssembly && _.startsWith("application/wasm")) n = await WebAssembly.instantiateStreaming(o, e);
            else {
                const s = await o.arrayBuffer();
                n = await WebAssembly.instantiate(s, e);
            }
        }
        return n.instance.exports;
    };
    let c;
    function we(e) {
        c = e;
    }
    let k = null;
    function T() {
        return (k === null || k.byteLength === 0) && (k = new Uint8Array(c.memory.buffer)), k;
    }
    const J = typeof TextDecoder > "u" ? (0, module.require)("util").TextDecoder : TextDecoder;
    let L = new J("utf-8", {
        ignoreBOM: !0,
        fatal: !0
    });
    L.decode();
    const ge = 2146435072;
    let W = 0;
    function fe(e, t) {
        return W += t, W >= ge && (L = new J("utf-8", {
            ignoreBOM: !0,
            fatal: !0
        }), L.decode(), W = t), L.decode(T().subarray(e, e + t));
    }
    function H(e, t) {
        return e = e >>> 0, fe(e, t);
    }
    let B = 0;
    const ue = typeof TextEncoder > "u" ? (0, module.require)("util").TextEncoder : TextEncoder, M = new ue("utf-8"), be = typeof M.encodeInto == "function" ? function(e, t) {
        return M.encodeInto(e, t);
    } : function(e, t) {
        const n = M.encode(e);
        return t.set(n), {
            read: e.length,
            written: n.length
        };
    };
    function Q(e, t, n) {
        if (n === void 0) {
            const l = M.encode(e), w = t(l.length, 1) >>> 0;
            return T().subarray(w, w + l.length).set(l), B = l.length, w;
        }
        let o = e.length, _ = t(o, 1) >>> 0;
        const s = T();
        let r = 0;
        for(; r < o; r++){
            const l = e.charCodeAt(r);
            if (l > 127) break;
            s[_ + r] = l;
        }
        if (r !== o) {
            r !== 0 && (e = e.slice(r)), _ = n(_, o, o = r + e.length * 3, 1) >>> 0;
            const l = T().subarray(_ + r, _ + o), w = be(e, l);
            r += w.written, _ = n(_, o, r, 1) >>> 0;
        }
        return B = r, _;
    }
    let I = null;
    function U() {
        return (I === null || I.buffer.detached === !0 || I.buffer.detached === void 0 && I.buffer !== c.memory.buffer) && (I = new DataView(c.memory.buffer)), I;
    }
    function he(e) {
        return e == null;
    }
    const K = typeof FinalizationRegistry > "u" ? {
        register: ()=>{},
        unregister: ()=>{}
    } : new FinalizationRegistry((e)=>c.__wbg_world_free(e >>> 0, 1));
    class pe {
        __destroy_into_raw() {
            const t = this.__wbg_ptr;
            return this.__wbg_ptr = 0, K.unregister(this), t;
        }
        free() {
            const t = this.__destroy_into_raw();
            c.__wbg_world_free(t, 0);
        }
        constructor(t, n){
            const o = c.world_new(t, n);
            return this.__wbg_ptr = o >>> 0, K.register(this, this.__wbg_ptr, this), this;
        }
        update_char_sets(t, n) {
            c.world_update_char_sets(this.__wbg_ptr, t, n);
        }
        tick(t) {
            return c.world_tick(this.__wbg_ptr, t);
        }
        width() {
            return c.world_width(this.__wbg_ptr) >>> 0;
        }
        height() {
            return c.world_height(this.__wbg_ptr) >>> 0;
        }
        get_consonant_grid_ptr() {
            return c.world_get_consonant_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        get_vowel_grid_ptr() {
            return c.world_get_vowel_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        get_syllable_grid_ptr() {
            return c.world_get_syllable_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        get_prev_consonant_grid_ptr() {
            return c.world_get_prev_consonant_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        get_prev_vowel_grid_ptr() {
            return c.world_get_prev_vowel_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        get_prev_syllable_grid_ptr() {
            return c.world_get_prev_syllable_grid_ptr(this.__wbg_ptr) >>> 0;
        }
        toggle_cell(t, n, o) {
            c.world_toggle_cell(this.__wbg_ptr, t, n, o);
        }
    }
    function me(e, t) {
        let n, o;
        try {
            n = e, o = t, console.error(H(e, t));
        } finally{
            c.__wbindgen_free(n, o, 1);
        }
    }
    function ye(e, t) {
        return e[t >>> 0];
    }
    function ve(e) {
        return e.length;
    }
    function Se() {
        return new Array;
    }
    function Ae() {
        return new Error;
    }
    function Ee(e, t) {
        return e.push(t);
    }
    function Ie() {
        return Math.random();
    }
    function xe(e, t) {
        const n = t.stack, o = Q(n, c.__wbindgen_malloc, c.__wbindgen_realloc), _ = B;
        U().setInt32(e + 4 * 1, _, !0), U().setInt32(e + 4 * 0, o, !0);
    }
    function Ce() {
        const e = c.__wbindgen_export_3, t = e.grow(4);
        e.set(0, void 0), e.set(t + 0, void 0), e.set(t + 1, null), e.set(t + 2, !0), e.set(t + 3, !1);
    }
    function ke(e, t) {
        const n = t, o = typeof n == "string" ? n : void 0;
        var _ = he(o) ? 0 : Q(o, c.__wbindgen_malloc, c.__wbindgen_realloc), s = B;
        U().setInt32(e + 4 * 1, s, !0), U().setInt32(e + 4 * 0, _, !0);
    }
    function Te(e, t) {
        return H(e, t);
    }
    function Le(e, t) {
        throw new Error(H(e, t));
    }
    URL = globalThis.URL;
    const d = await le({
        "./game_of_life_bg.js": {
            __wbg_random_ed8db01c11e5a642: Ie,
            __wbindgen_string_get: ke,
            __wbindgen_string_new: Te,
            __wbg_new_8a6f238a6ece86ea: Ae,
            __wbg_stack_0ed75d68575b0f3c: xe,
            __wbg_error_7534b8e9a36f1ab4: me,
            __wbg_get_a131a44bd1eb6979: ye,
            __wbg_length_f00ec12454a5d9fd: ve,
            __wbg_new_58353953ad2097cc: Se,
            __wbg_push_73fd7b5550ebf707: Ee,
            __wbindgen_throw: Le,
            __wbindgen_init_externref_table: Ce
        }
    }, de), m = d.memory, Me = d.__wbg_world_free, Be = d.world_new, Ue = d.world_update_char_sets, Oe = d.world_tick, Re = d.world_width, De = d.world_height, Fe = d.world_get_consonant_grid_ptr, Ne = d.world_get_vowel_grid_ptr, We = d.world_get_syllable_grid_ptr, Pe = d.world_get_prev_consonant_grid_ptr, Ve = d.world_get_prev_vowel_grid_ptr, Ge = d.world_get_prev_syllable_grid_ptr, ze = d.world_toggle_cell, je = d.__wbindgen_free, He = d.__wbindgen_malloc, qe = d.__wbindgen_realloc, Ye = d.__wbindgen_export_3, ee = d.__wbindgen_start, Ke = Object.freeze(Object.defineProperty({
        __proto__: null,
        __wbg_world_free: Me,
        __wbindgen_export_3: Ye,
        __wbindgen_free: je,
        __wbindgen_malloc: He,
        __wbindgen_realloc: qe,
        __wbindgen_start: ee,
        memory: m,
        world_get_consonant_grid_ptr: Fe,
        world_get_prev_consonant_grid_ptr: Pe,
        world_get_prev_syllable_grid_ptr: Ge,
        world_get_prev_vowel_grid_ptr: Ve,
        world_get_syllable_grid_ptr: We,
        world_get_vowel_grid_ptr: Ne,
        world_height: De,
        world_new: Be,
        world_tick: Oe,
        world_toggle_cell: ze,
        world_update_char_sets: Ue,
        world_width: Re
    }, Symbol.toStringTag, {
        value: "Module"
    }));
    we(Ke);
    ee();
    const a = window.innerWidth * .05, Xe = "#ffffff59", $e = 4, Ze = 1e3 / $e, f = document.getElementById("game-of-life-canvas"), x = document.getElementById("play-pause"), Je = document.getElementById("speech-mode-select"), P = document.getElementById("pitch-slider"), Qe = document.getElementById("pitch-value"), V = document.getElementById("rate-slider"), et = document.getElementById("rate-value");
    let G;
    const tt = (e, t)=>{
        f.height = (a + 1) * t + 1, f.width = (a + 1) * e + 1, G = new Array(e * t).fill(0);
    }, i = f.getContext("2d"), nt = (e, t)=>{
        if (i) {
            i.beginPath(), i.strokeStyle = Xe;
            for(let n = 0; n <= e; n++)i.moveTo(n * (a + 1) + 1, 0), i.lineTo(n * (a + 1) + 1, (a + 1) * t + 1);
            for(let n = 0; n <= t; n++)i.moveTo(0, n * (a + 1) + 1), i.lineTo((a + 1) * e + 1, n * (a + 1) + 1);
            i.stroke();
        }
    }, q = (e)=>{
        if (!i) return;
        const t = e.width(), n = e.height(), o = t * n, _ = e.get_consonant_grid_ptr(), s = e.get_vowel_grid_ptr(), r = e.get_syllable_grid_ptr(), l = e.get_prev_consonant_grid_ptr(), w = e.get_prev_vowel_grid_ptr(), b = e.get_prev_syllable_grid_ptr(), u = new Uint16Array(m.buffer, _, o), h = new Uint16Array(m.buffer, s, o), A = new Uint16Array(m.buffer, r, o), p = new Uint16Array(m.buffer, l, o), E = new Uint16Array(m.buffer, w, o), O = new Uint16Array(m.buffer, b, o);
        i.clearRect(0, 0, f.width, f.height), nt(t, n), i.textBaseline = "middle", i.textAlign = "center";
        for(let g = 0; g < o; g++){
            const oe = Math.floor(g / t), _e = g % t, R = A[g] || u[g] || h[g], se = O[g] || p[g] || E[g];
            if (R !== 0) {
                if (R !== se) {
                    const ie = (Math.random() - .5) * 2, ae = a * .5 * ie;
                    G[g] = a + ae;
                }
                const ce = G[g] || a;
                i.font = `${ce}px "Noto Sans KR"`;
                const D = String.fromCharCode(R), F = _e * (a + 1) + a / 2 + 1, N = oe * (a + 1) + a / 2 + 1;
                A[g] !== 0 ? (i.fillStyle = "black", i.fillText(D, F, N)) : u[g] !== 0 ? (i.fillStyle = "blue", i.fillText(D, F, N)) : h[g] !== 0 && (i.fillStyle = "red", i.fillText(D, F, N));
            }
        }
    };
    let y, z;
    const rt = ()=>{
        y = window.speechSynthesis, y.onvoiceschanged = ()=>{
            z = y.getVoices();
        }, z = y.getVoices();
    }, ot = (e)=>new Promise((t, n)=>{
            if (!y) {
                const s = "Speech synthesis not initialized.";
                return console.error(s), n(s);
            }
            y.cancel();
            const o = new SpeechSynthesisUtterance(e), _ = z.find((s)=>s.lang === "ko-KR");
            _ ? o.voice = _ : console.warn("Korean voice not found. Using default voice."), o.pitch = parseFloat(P.value), o.rate = parseFloat(V.value), o.onend = ()=>{
                t();
            }, o.onerror = (s)=>{
                console.error("Speech synthesis error:", s.error), n(s.error);
            }, y.speak(o);
        });
    let C, v = null, X = 0;
    const te = ()=>{
        const e = Math.floor(window.innerWidth / (a + 1)), t = Math.floor(window.innerHeight / (a + 1));
        C = new pe(e, t), tt(e, t), q(C);
    }, j = async ()=>{
        if (S()) return;
        const e = performance.now();
        if (e - X < Ze) {
            v = requestAnimationFrame(j);
            return;
        }
        X = e;
        const t = C.tick(Je.value);
        q(C), t.length > 0 && await ot(t.join(" ")), S() || (v = requestAnimationFrame(j));
    }, S = ()=>v === null, _t = ()=>{
        S() && (v = 0, j());
    }, Y = ()=>{
        S() || (v && cancelAnimationFrame(v), v = null, window.speechSynthesis.cancel());
    }, ne = ()=>{
        S() || Y(), te();
    }, re = ()=>C, $ = [
        "ㄱ",
        "ㄲ",
        "ㄴ",
        "ㄷ",
        "ㄸ",
        "ㄹ",
        "ㅁ",
        "ㅂ",
        "ㅃ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅉ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ"
    ], Z = [
        "ㅏ",
        "ㅐ",
        "ㅑ",
        "ㅒ",
        "ㅓ",
        "ㅔ",
        "ㅕ",
        "ㅖ",
        "ㅗ",
        "ㅘ",
        "ㅙ",
        "ㅚ",
        "ㅛ",
        "ㅜ",
        "ㅝ",
        "ㅞ",
        "ㅟ",
        "ㅠ",
        "ㅡ",
        "ㅢ",
        "ㅣ"
    ], st = [
        "",
        "ㄱ",
        "ㄲ",
        "ㄳ",
        "ㄴ",
        "ㄵ",
        "ㄶ",
        "ㄷ",
        "ㄹ",
        "ㄺ",
        "ㄻ",
        "ㄼ",
        "ㄽ",
        "ㄾ",
        "ㄿ",
        "ㅀ",
        "ㅁ",
        "ㅂ",
        "ㅄ",
        "ㅅ",
        "ㅆ",
        "ㅇ",
        "ㅈ",
        "ㅊ",
        "ㅋ",
        "ㅌ",
        "ㅍ",
        "ㅎ"
    ], ct = (e, t)=>{
        if (!t.trim()) {
            e.update_char_sets([], []);
            return;
        }
        const n = 44032, o = 55203, _ = 588, s = 28, r = new Set, l = new Set;
        for (const w of t){
            const b = w.charCodeAt(0);
            if (b >= n && b <= o) {
                const u = b - n, h = Math.floor(u / _);
                r.add($[h]);
                const A = Math.floor(u % _ / s);
                l.add(Z[A]);
                const p = u % s;
                if (p > 0) {
                    const E = st[p];
                    switch(E){
                        case "ㄳ":
                            r.add("ㄱ"), r.add("ㅅ");
                            break;
                        case "ㄵ":
                            r.add("ㄴ"), r.add("ㅈ");
                            break;
                        case "ㄶ":
                            r.add("ㄴ"), r.add("ㅎ");
                            break;
                        case "ㄺ":
                            r.add("ㄹ"), r.add("ㄱ");
                            break;
                        case "ㄻ":
                            r.add("ㄹ"), r.add("ㅁ");
                            break;
                        case "ㄼ":
                            r.add("ㄹ"), r.add("ㅂ");
                            break;
                        case "ㄽ":
                            r.add("ㄹ"), r.add("ㅅ");
                            break;
                        case "ㄾ":
                            r.add("ㄹ"), r.add("ㅌ");
                            break;
                        case "ㄿ":
                            r.add("ㄹ"), r.add("ㅍ");
                            break;
                        case "ㅀ":
                            r.add("ㄹ"), r.add("ㅎ");
                            break;
                        case "ㅄ":
                            r.add("ㅂ"), r.add("ㅅ");
                            break;
                        default:
                            r.add(E);
                    }
                }
            } else $.includes(w) ? r.add(w) : Z.includes(w) && l.add(w);
        }
        e.update_char_sets(Array.from(r), Array.from(l));
    };
    te();
    rt();
    x.textContent = "▶";
    x.addEventListener("click", ()=>{
        S() ? (_t(), x.textContent = "⏸") : (Y(), x.textContent = "▶");
    });
    const it = document.getElementById("hangul-input"), at = document.getElementById("apply-hangul"), dt = document.getElementById("brush-select"), lt = document.getElementById("mode-select");
    at.addEventListener("click", ()=>{
        const e = it.value;
        ne();
        const t = re();
        ct(t, e), S() || Y(), x.textContent = "▶";
    });
    const wt = {
        single: [
            {
                row: 0,
                col: 0
            }
        ],
        blinker: [
            {
                row: 0,
                col: -1
            },
            {
                row: 0,
                col: 0
            },
            {
                row: 0,
                col: 1
            }
        ],
        glider: [
            {
                row: -1,
                col: 0
            },
            {
                row: 0,
                col: 1
            },
            {
                row: 1,
                col: -1
            },
            {
                row: 1,
                col: 0
            },
            {
                row: 1,
                col: 1
            }
        ],
        spear: [
            {
                row: -2,
                col: 0
            },
            {
                row: -1,
                col: 0
            },
            {
                row: 0,
                col: 1
            },
            {
                row: 0,
                col: -1
            }
        ]
    };
    f.addEventListener("click", (e)=>{
        const t = re(), n = f.getBoundingClientRect(), o = f.width / n.width, _ = f.height / n.height, s = (e.clientX - n.left) * o, r = (e.clientY - n.top) * _, l = Math.floor(r / (a + 1)), w = Math.floor(s / (a + 1)), b = dt.value, u = wt[b], h = lt.value, A = Math.random() > .5;
        u.forEach((p)=>{
            const E = (l + p.row + t.height()) % t.height(), O = (w + p.col + t.width()) % t.width();
            t.toggle_cell(E, O, h === "random" ? A ? "consonant" : "vowel" : h);
        }), q(t);
    });
    window.addEventListener("resize", ()=>{
        ne();
    });
    P.addEventListener("input", ()=>{
        Qe.textContent = parseFloat(P.value).toFixed(1);
    });
    V.addEventListener("input", ()=>{
        et.textContent = parseFloat(V.value).toFixed(1);
    });
})();
