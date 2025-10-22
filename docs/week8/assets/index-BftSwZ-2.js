(async () => {
  (function() {
    const e = document.createElement("link").relList;
    if (e && e.supports && e.supports("modulepreload")) return;
    for (const a of document.querySelectorAll('link[rel="modulepreload"]')) i(a);
    new MutationObserver((a) => {
      for (const r of a) if (r.type === "childList") for (const s of r.addedNodes) s.tagName === "LINK" && s.rel === "modulepreload" && i(s);
    }).observe(document, {
      childList: true,
      subtree: true
    });
    function n(a) {
      const r = {};
      return a.integrity && (r.integrity = a.integrity), a.referrerPolicy && (r.referrerPolicy = a.referrerPolicy), a.crossOrigin === "use-credentials" ? r.credentials = "include" : a.crossOrigin === "anonymous" ? r.credentials = "omit" : r.credentials = "same-origin", r;
    }
    function i(a) {
      if (a.ep) return;
      a.ep = true;
      const r = n(a);
      fetch(a.href, r);
    }
  })();
  var vf = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
  function d_(t) {
    return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
  }
  var m_ = {
    exports: {}
  }, xc = {};
  var uA = Symbol.for("react.transitional.element"), cA = Symbol.for("react.fragment");
  function p_(t, e, n) {
    var i = null;
    if (n !== void 0 && (i = "" + n), e.key !== void 0 && (i = "" + e.key), "key" in e) {
      n = {};
      for (var a in e) a !== "key" && (n[a] = e[a]);
    } else n = e;
    return e = n.ref, {
      $$typeof: uA,
      type: t,
      key: i,
      ref: e !== void 0 ? e : null,
      props: n
    };
  }
  xc.Fragment = cA;
  xc.jsx = p_;
  xc.jsxs = p_;
  m_.exports = xc;
  var J = m_.exports, y_ = {
    exports: {}
  }, nt = {};
  var om = Symbol.for("react.transitional.element"), fA = Symbol.for("react.portal"), hA = Symbol.for("react.fragment"), dA = Symbol.for("react.strict_mode"), mA = Symbol.for("react.profiler"), pA = Symbol.for("react.consumer"), yA = Symbol.for("react.context"), gA = Symbol.for("react.forward_ref"), vA = Symbol.for("react.suspense"), _A = Symbol.for("react.memo"), g_ = Symbol.for("react.lazy"), bA = Symbol.for("react.activity"), Iy = Symbol.iterator;
  function SA(t) {
    return t === null || typeof t != "object" ? null : (t = Iy && t[Iy] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var v_ = {
    isMounted: function() {
      return false;
    },
    enqueueForceUpdate: function() {
    },
    enqueueReplaceState: function() {
    },
    enqueueSetState: function() {
    }
  }, __ = Object.assign, b_ = {};
  function vs(t, e, n) {
    this.props = t, this.context = e, this.refs = b_, this.updater = n || v_;
  }
  vs.prototype.isReactComponent = {};
  vs.prototype.setState = function(t, e) {
    if (typeof t != "object" && typeof t != "function" && t != null) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, t, e, "setState");
  };
  vs.prototype.forceUpdate = function(t) {
    this.updater.enqueueForceUpdate(this, t, "forceUpdate");
  };
  function S_() {
  }
  S_.prototype = vs.prototype;
  function um(t, e, n) {
    this.props = t, this.context = e, this.refs = b_, this.updater = n || v_;
  }
  var cm = um.prototype = new S_();
  cm.constructor = um;
  __(cm, vs.prototype);
  cm.isPureReactComponent = true;
  var t0 = Array.isArray;
  function Ch() {
  }
  var Ot = {
    H: null,
    A: null,
    T: null,
    S: null
  }, T_ = Object.prototype.hasOwnProperty;
  function fm(t, e, n) {
    var i = n.ref;
    return {
      $$typeof: om,
      type: t,
      key: e,
      ref: i !== void 0 ? i : null,
      props: n
    };
  }
  function TA(t, e) {
    return fm(t.type, e, t.props);
  }
  function hm(t) {
    return typeof t == "object" && t !== null && t.$$typeof === om;
  }
  function xA(t) {
    var e = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + t.replace(/[=:]/g, function(n) {
      return e[n];
    });
  }
  var e0 = /\/+/g;
  function _f(t, e) {
    return typeof t == "object" && t !== null && t.key != null ? xA("" + t.key) : e.toString(36);
  }
  function AA(t) {
    switch (t.status) {
      case "fulfilled":
        return t.value;
      case "rejected":
        throw t.reason;
      default:
        switch (typeof t.status == "string" ? t.then(Ch, Ch) : (t.status = "pending", t.then(function(e) {
          t.status === "pending" && (t.status = "fulfilled", t.value = e);
        }, function(e) {
          t.status === "pending" && (t.status = "rejected", t.reason = e);
        })), t.status) {
          case "fulfilled":
            return t.value;
          case "rejected":
            throw t.reason;
        }
    }
    throw t;
  }
  function _r(t, e, n, i, a) {
    var r = typeof t;
    (r === "undefined" || r === "boolean") && (t = null);
    var s = false;
    if (t === null) s = true;
    else switch (r) {
      case "bigint":
      case "string":
      case "number":
        s = true;
        break;
      case "object":
        switch (t.$$typeof) {
          case om:
          case fA:
            s = true;
            break;
          case g_:
            return s = t._init, _r(s(t._payload), e, n, i, a);
        }
    }
    if (s) return a = a(t), s = i === "" ? "." + _f(t, 0) : i, t0(a) ? (n = "", s != null && (n = s.replace(e0, "$&/") + "/"), _r(a, e, n, "", function(c) {
      return c;
    })) : a != null && (hm(a) && (a = TA(a, n + (a.key == null || t && t.key === a.key ? "" : ("" + a.key).replace(e0, "$&/") + "/") + s)), e.push(a)), 1;
    s = 0;
    var l = i === "" ? "." : i + ":";
    if (t0(t)) for (var o = 0; o < t.length; o++) i = t[o], r = l + _f(i, o), s += _r(i, e, n, r, a);
    else if (o = SA(t), typeof o == "function") for (t = o.call(t), o = 0; !(i = t.next()).done; ) i = i.value, r = l + _f(i, o++), s += _r(i, e, n, r, a);
    else if (r === "object") {
      if (typeof t.then == "function") return _r(AA(t), e, n, i, a);
      throw e = String(t), Error("Objects are not valid as a React child (found: " + (e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e) + "). If you meant to render a collection of children, use an array instead.");
    }
    return s;
  }
  function Bo(t, e, n) {
    if (t == null) return t;
    var i = [], a = 0;
    return _r(t, i, "", "", function(r) {
      return e.call(n, r, a++);
    }), i;
  }
  function EA(t) {
    if (t._status === -1) {
      var e = t._result;
      e = e(), e.then(function(n) {
        (t._status === 0 || t._status === -1) && (t._status = 1, t._result = n);
      }, function(n) {
        (t._status === 0 || t._status === -1) && (t._status = 2, t._result = n);
      }), t._status === -1 && (t._status = 0, t._result = e);
    }
    if (t._status === 1) return t._result.default;
    throw t._result;
  }
  var n0 = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, wA = {
    map: Bo,
    forEach: function(t, e, n) {
      Bo(t, function() {
        e.apply(this, arguments);
      }, n);
    },
    count: function(t) {
      var e = 0;
      return Bo(t, function() {
        e++;
      }), e;
    },
    toArray: function(t) {
      return Bo(t, function(e) {
        return e;
      }) || [];
    },
    only: function(t) {
      if (!hm(t)) throw Error("React.Children.only expected to receive a single React element child.");
      return t;
    }
  };
  nt.Activity = bA;
  nt.Children = wA;
  nt.Component = vs;
  nt.Fragment = hA;
  nt.Profiler = mA;
  nt.PureComponent = um;
  nt.StrictMode = dA;
  nt.Suspense = vA;
  nt.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ot;
  nt.__COMPILER_RUNTIME = {
    __proto__: null,
    c: function(t) {
      return Ot.H.useMemoCache(t);
    }
  };
  nt.cache = function(t) {
    return function() {
      return t.apply(null, arguments);
    };
  };
  nt.cacheSignal = function() {
    return null;
  };
  nt.cloneElement = function(t, e, n) {
    if (t == null) throw Error("The argument must be a React element, but you passed " + t + ".");
    var i = __({}, t.props), a = t.key;
    if (e != null) for (r in e.key !== void 0 && (a = "" + e.key), e) !T_.call(e, r) || r === "key" || r === "__self" || r === "__source" || r === "ref" && e.ref === void 0 || (i[r] = e[r]);
    var r = arguments.length - 2;
    if (r === 1) i.children = n;
    else if (1 < r) {
      for (var s = Array(r), l = 0; l < r; l++) s[l] = arguments[l + 2];
      i.children = s;
    }
    return fm(t.type, a, i);
  };
  nt.createContext = function(t) {
    return t = {
      $$typeof: yA,
      _currentValue: t,
      _currentValue2: t,
      _threadCount: 0,
      Provider: null,
      Consumer: null
    }, t.Provider = t, t.Consumer = {
      $$typeof: pA,
      _context: t
    }, t;
  };
  nt.createElement = function(t, e, n) {
    var i, a = {}, r = null;
    if (e != null) for (i in e.key !== void 0 && (r = "" + e.key), e) T_.call(e, i) && i !== "key" && i !== "__self" && i !== "__source" && (a[i] = e[i]);
    var s = arguments.length - 2;
    if (s === 1) a.children = n;
    else if (1 < s) {
      for (var l = Array(s), o = 0; o < s; o++) l[o] = arguments[o + 2];
      a.children = l;
    }
    if (t && t.defaultProps) for (i in s = t.defaultProps, s) a[i] === void 0 && (a[i] = s[i]);
    return fm(t, r, a);
  };
  nt.createRef = function() {
    return {
      current: null
    };
  };
  nt.forwardRef = function(t) {
    return {
      $$typeof: gA,
      render: t
    };
  };
  nt.isValidElement = hm;
  nt.lazy = function(t) {
    return {
      $$typeof: g_,
      _payload: {
        _status: -1,
        _result: t
      },
      _init: EA
    };
  };
  nt.memo = function(t, e) {
    return {
      $$typeof: _A,
      type: t,
      compare: e === void 0 ? null : e
    };
  };
  nt.startTransition = function(t) {
    var e = Ot.T, n = {};
    Ot.T = n;
    try {
      var i = t(), a = Ot.S;
      a !== null && a(n, i), typeof i == "object" && i !== null && typeof i.then == "function" && i.then(Ch, n0);
    } catch (r) {
      n0(r);
    } finally {
      e !== null && n.types !== null && (e.types = n.types), Ot.T = e;
    }
  };
  nt.unstable_useCacheRefresh = function() {
    return Ot.H.useCacheRefresh();
  };
  nt.use = function(t) {
    return Ot.H.use(t);
  };
  nt.useActionState = function(t, e, n) {
    return Ot.H.useActionState(t, e, n);
  };
  nt.useCallback = function(t, e) {
    return Ot.H.useCallback(t, e);
  };
  nt.useContext = function(t) {
    return Ot.H.useContext(t);
  };
  nt.useDebugValue = function() {
  };
  nt.useDeferredValue = function(t, e) {
    return Ot.H.useDeferredValue(t, e);
  };
  nt.useEffect = function(t, e) {
    return Ot.H.useEffect(t, e);
  };
  nt.useEffectEvent = function(t) {
    return Ot.H.useEffectEvent(t);
  };
  nt.useId = function() {
    return Ot.H.useId();
  };
  nt.useImperativeHandle = function(t, e, n) {
    return Ot.H.useImperativeHandle(t, e, n);
  };
  nt.useInsertionEffect = function(t, e) {
    return Ot.H.useInsertionEffect(t, e);
  };
  nt.useLayoutEffect = function(t, e) {
    return Ot.H.useLayoutEffect(t, e);
  };
  nt.useMemo = function(t, e) {
    return Ot.H.useMemo(t, e);
  };
  nt.useOptimistic = function(t, e) {
    return Ot.H.useOptimistic(t, e);
  };
  nt.useReducer = function(t, e, n) {
    return Ot.H.useReducer(t, e, n);
  };
  nt.useRef = function(t) {
    return Ot.H.useRef(t);
  };
  nt.useState = function(t) {
    return Ot.H.useState(t);
  };
  nt.useSyncExternalStore = function(t, e, n) {
    return Ot.H.useSyncExternalStore(t, e, n);
  };
  nt.useTransition = function() {
    return Ot.H.useTransition();
  };
  nt.version = "19.2.0";
  y_.exports = nt;
  var D = y_.exports;
  const MA = d_(D);
  var x_ = {
    exports: {}
  }, Ac = {}, A_ = {
    exports: {}
  }, E_ = {};
  (function(t) {
    function e(N, P) {
      var G = N.length;
      N.push(P);
      t: for (; 0 < G; ) {
        var Q = G - 1 >>> 1, it = N[Q];
        if (0 < a(it, P)) N[Q] = P, N[G] = it, G = Q;
        else break t;
      }
    }
    function n(N) {
      return N.length === 0 ? null : N[0];
    }
    function i(N) {
      if (N.length === 0) return null;
      var P = N[0], G = N.pop();
      if (G !== P) {
        N[0] = G;
        t: for (var Q = 0, it = N.length, Pt = it >>> 1; Q < Pt; ) {
          var Kt = 2 * (Q + 1) - 1, te = N[Kt], Nt = Kt + 1, pe = N[Nt];
          if (0 > a(te, G)) Nt < it && 0 > a(pe, te) ? (N[Q] = pe, N[Nt] = G, Q = Nt) : (N[Q] = te, N[Kt] = G, Q = Kt);
          else if (Nt < it && 0 > a(pe, G)) N[Q] = pe, N[Nt] = G, Q = Nt;
          else break t;
        }
      }
      return P;
    }
    function a(N, P) {
      var G = N.sortIndex - P.sortIndex;
      return G !== 0 ? G : N.id - P.id;
    }
    if (t.unstable_now = void 0, typeof performance == "object" && typeof performance.now == "function") {
      var r = performance;
      t.unstable_now = function() {
        return r.now();
      };
    } else {
      var s = Date, l = s.now();
      t.unstable_now = function() {
        return s.now() - l;
      };
    }
    var o = [], c = [], f = 1, d = null, m = 3, y = false, T = false, b = false, x = false, v = typeof setTimeout == "function" ? setTimeout : null, g = typeof clearTimeout == "function" ? clearTimeout : null, S = typeof setImmediate < "u" ? setImmediate : null;
    function A(N) {
      for (var P = n(c); P !== null; ) {
        if (P.callback === null) i(c);
        else if (P.startTime <= N) i(c), P.sortIndex = P.expirationTime, e(o, P);
        else break;
        P = n(c);
      }
    }
    function w(N) {
      if (b = false, A(N), !T) if (n(o) !== null) T = true, V || (V = true, q());
      else {
        var P = n(c);
        P !== null && K(w, P.startTime - N);
      }
    }
    var V = false, z = -1, O = 5, U = -1;
    function B() {
      return x ? true : !(t.unstable_now() - U < O);
    }
    function Y() {
      if (x = false, V) {
        var N = t.unstable_now();
        U = N;
        var P = true;
        try {
          t: {
            T = false, b && (b = false, g(z), z = -1), y = true;
            var G = m;
            try {
              e: {
                for (A(N), d = n(o); d !== null && !(d.expirationTime > N && B()); ) {
                  var Q = d.callback;
                  if (typeof Q == "function") {
                    d.callback = null, m = d.priorityLevel;
                    var it = Q(d.expirationTime <= N);
                    if (N = t.unstable_now(), typeof it == "function") {
                      d.callback = it, A(N), P = true;
                      break e;
                    }
                    d === n(o) && i(o), A(N);
                  } else i(o);
                  d = n(o);
                }
                if (d !== null) P = true;
                else {
                  var Pt = n(c);
                  Pt !== null && K(w, Pt.startTime - N), P = false;
                }
              }
              break t;
            } finally {
              d = null, m = G, y = false;
            }
            P = void 0;
          }
        } finally {
          P ? q() : V = false;
        }
      }
    }
    var q;
    if (typeof S == "function") q = function() {
      S(Y);
    };
    else if (typeof MessageChannel < "u") {
      var k = new MessageChannel(), $ = k.port2;
      k.port1.onmessage = Y, q = function() {
        $.postMessage(null);
      };
    } else q = function() {
      v(Y, 0);
    };
    function K(N, P) {
      z = v(function() {
        N(t.unstable_now());
      }, P);
    }
    t.unstable_IdlePriority = 5, t.unstable_ImmediatePriority = 1, t.unstable_LowPriority = 4, t.unstable_NormalPriority = 3, t.unstable_Profiling = null, t.unstable_UserBlockingPriority = 2, t.unstable_cancelCallback = function(N) {
      N.callback = null;
    }, t.unstable_forceFrameRate = function(N) {
      0 > N || 125 < N ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : O = 0 < N ? Math.floor(1e3 / N) : 5;
    }, t.unstable_getCurrentPriorityLevel = function() {
      return m;
    }, t.unstable_next = function(N) {
      switch (m) {
        case 1:
        case 2:
        case 3:
          var P = 3;
          break;
        default:
          P = m;
      }
      var G = m;
      m = P;
      try {
        return N();
      } finally {
        m = G;
      }
    }, t.unstable_requestPaint = function() {
      x = true;
    }, t.unstable_runWithPriority = function(N, P) {
      switch (N) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          N = 3;
      }
      var G = m;
      m = N;
      try {
        return P();
      } finally {
        m = G;
      }
    }, t.unstable_scheduleCallback = function(N, P, G) {
      var Q = t.unstable_now();
      switch (typeof G == "object" && G !== null ? (G = G.delay, G = typeof G == "number" && 0 < G ? Q + G : Q) : G = Q, N) {
        case 1:
          var it = -1;
          break;
        case 2:
          it = 250;
          break;
        case 5:
          it = 1073741823;
          break;
        case 4:
          it = 1e4;
          break;
        default:
          it = 5e3;
      }
      return it = G + it, N = {
        id: f++,
        callback: P,
        priorityLevel: N,
        startTime: G,
        expirationTime: it,
        sortIndex: -1
      }, G > Q ? (N.sortIndex = G, e(c, N), n(o) === null && N === n(c) && (b ? (g(z), z = -1) : b = true, K(w, G - Q))) : (N.sortIndex = it, e(o, N), T || y || (T = true, V || (V = true, q()))), N;
    }, t.unstable_shouldYield = B, t.unstable_wrapCallback = function(N) {
      var P = m;
      return function() {
        var G = m;
        m = P;
        try {
          return N.apply(this, arguments);
        } finally {
          m = G;
        }
      };
    };
  })(E_);
  A_.exports = E_;
  var CA = A_.exports, w_ = {
    exports: {}
  }, Le = {};
  var DA = D;
  function M_(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function Ni() {
  }
  var Ue = {
    d: {
      f: Ni,
      r: function() {
        throw Error(M_(522));
      },
      D: Ni,
      C: Ni,
      L: Ni,
      m: Ni,
      X: Ni,
      S: Ni,
      M: Ni
    },
    p: 0,
    findDOMNode: null
  }, RA = Symbol.for("react.portal");
  function OA(t, e, n) {
    var i = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: RA,
      key: i == null ? null : "" + i,
      children: t,
      containerInfo: e,
      implementation: n
    };
  }
  var al = DA.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function Ec(t, e) {
    if (t === "font") return "";
    if (typeof e == "string") return e === "use-credentials" ? e : "";
  }
  Le.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Ue;
  Le.createPortal = function(t, e) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11) throw Error(M_(299));
    return OA(t, e, null, n);
  };
  Le.flushSync = function(t) {
    var e = al.T, n = Ue.p;
    try {
      if (al.T = null, Ue.p = 2, t) return t();
    } finally {
      al.T = e, Ue.p = n, Ue.d.f();
    }
  };
  Le.preconnect = function(t, e) {
    typeof t == "string" && (e ? (e = e.crossOrigin, e = typeof e == "string" ? e === "use-credentials" ? e : "" : void 0) : e = null, Ue.d.C(t, e));
  };
  Le.prefetchDNS = function(t) {
    typeof t == "string" && Ue.d.D(t);
  };
  Le.preinit = function(t, e) {
    if (typeof t == "string" && e && typeof e.as == "string") {
      var n = e.as, i = Ec(n, e.crossOrigin), a = typeof e.integrity == "string" ? e.integrity : void 0, r = typeof e.fetchPriority == "string" ? e.fetchPriority : void 0;
      n === "style" ? Ue.d.S(t, typeof e.precedence == "string" ? e.precedence : void 0, {
        crossOrigin: i,
        integrity: a,
        fetchPriority: r
      }) : n === "script" && Ue.d.X(t, {
        crossOrigin: i,
        integrity: a,
        fetchPriority: r,
        nonce: typeof e.nonce == "string" ? e.nonce : void 0
      });
    }
  };
  Le.preinitModule = function(t, e) {
    if (typeof t == "string") if (typeof e == "object" && e !== null) {
      if (e.as == null || e.as === "script") {
        var n = Ec(e.as, e.crossOrigin);
        Ue.d.M(t, {
          crossOrigin: n,
          integrity: typeof e.integrity == "string" ? e.integrity : void 0,
          nonce: typeof e.nonce == "string" ? e.nonce : void 0
        });
      }
    } else e == null && Ue.d.M(t);
  };
  Le.preload = function(t, e) {
    if (typeof t == "string" && typeof e == "object" && e !== null && typeof e.as == "string") {
      var n = e.as, i = Ec(n, e.crossOrigin);
      Ue.d.L(t, n, {
        crossOrigin: i,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0,
        nonce: typeof e.nonce == "string" ? e.nonce : void 0,
        type: typeof e.type == "string" ? e.type : void 0,
        fetchPriority: typeof e.fetchPriority == "string" ? e.fetchPriority : void 0,
        referrerPolicy: typeof e.referrerPolicy == "string" ? e.referrerPolicy : void 0,
        imageSrcSet: typeof e.imageSrcSet == "string" ? e.imageSrcSet : void 0,
        imageSizes: typeof e.imageSizes == "string" ? e.imageSizes : void 0,
        media: typeof e.media == "string" ? e.media : void 0
      });
    }
  };
  Le.preloadModule = function(t, e) {
    if (typeof t == "string") if (e) {
      var n = Ec(e.as, e.crossOrigin);
      Ue.d.m(t, {
        as: typeof e.as == "string" && e.as !== "script" ? e.as : void 0,
        crossOrigin: n,
        integrity: typeof e.integrity == "string" ? e.integrity : void 0
      });
    } else Ue.d.m(t);
  };
  Le.requestFormReset = function(t) {
    Ue.d.r(t);
  };
  Le.unstable_batchedUpdates = function(t, e) {
    return t(e);
  };
  Le.useFormState = function(t, e, n) {
    return al.H.useFormState(t, e, n);
  };
  Le.useFormStatus = function() {
    return al.H.useHostTransitionStatus();
  };
  Le.version = "19.2.0";
  function C_() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(C_);
    } catch (t) {
      console.error(t);
    }
  }
  C_(), w_.exports = Le;
  var zA = w_.exports;
  var ce = CA, D_ = D, UA = zA;
  function j(t) {
    var e = "https://react.dev/errors/" + t;
    if (1 < arguments.length) {
      e += "?args[]=" + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) e += "&args[]=" + encodeURIComponent(arguments[n]);
    }
    return "Minified React error #" + t + "; visit " + e + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  function R_(t) {
    return !(!t || t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11);
  }
  function ao(t) {
    var e = t, n = t;
    if (t.alternate) for (; e.return; ) e = e.return;
    else {
      t = e;
      do
        e = t, e.flags & 4098 && (n = e.return), t = e.return;
      while (t);
    }
    return e.tag === 3 ? n : null;
  }
  function O_(t) {
    if (t.tag === 13) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function z_(t) {
    if (t.tag === 31) {
      var e = t.memoizedState;
      if (e === null && (t = t.alternate, t !== null && (e = t.memoizedState)), e !== null) return e.dehydrated;
    }
    return null;
  }
  function i0(t) {
    if (ao(t) !== t) throw Error(j(188));
  }
  function VA(t) {
    var e = t.alternate;
    if (!e) {
      if (e = ao(t), e === null) throw Error(j(188));
      return e !== t ? null : t;
    }
    for (var n = t, i = e; ; ) {
      var a = n.return;
      if (a === null) break;
      var r = a.alternate;
      if (r === null) {
        if (i = a.return, i !== null) {
          n = i;
          continue;
        }
        break;
      }
      if (a.child === r.child) {
        for (r = a.child; r; ) {
          if (r === n) return i0(a), t;
          if (r === i) return i0(a), e;
          r = r.sibling;
        }
        throw Error(j(188));
      }
      if (n.return !== i.return) n = a, i = r;
      else {
        for (var s = false, l = a.child; l; ) {
          if (l === n) {
            s = true, n = a, i = r;
            break;
          }
          if (l === i) {
            s = true, i = a, n = r;
            break;
          }
          l = l.sibling;
        }
        if (!s) {
          for (l = r.child; l; ) {
            if (l === n) {
              s = true, n = r, i = a;
              break;
            }
            if (l === i) {
              s = true, i = r, n = a;
              break;
            }
            l = l.sibling;
          }
          if (!s) throw Error(j(189));
        }
      }
      if (n.alternate !== i) throw Error(j(190));
    }
    if (n.tag !== 3) throw Error(j(188));
    return n.stateNode.current === n ? t : e;
  }
  function U_(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t;
    for (t = t.child; t !== null; ) {
      if (e = U_(t), e !== null) return e;
      t = t.sibling;
    }
    return null;
  }
  var zt = Object.assign, LA = Symbol.for("react.element"), Ho = Symbol.for("react.transitional.element"), Js = Symbol.for("react.portal"), Tr = Symbol.for("react.fragment"), V_ = Symbol.for("react.strict_mode"), Dh = Symbol.for("react.profiler"), L_ = Symbol.for("react.consumer"), pi = Symbol.for("react.context"), dm = Symbol.for("react.forward_ref"), Rh = Symbol.for("react.suspense"), Oh = Symbol.for("react.suspense_list"), mm = Symbol.for("react.memo"), Bi = Symbol.for("react.lazy"), zh = Symbol.for("react.activity"), NA = Symbol.for("react.memo_cache_sentinel"), a0 = Symbol.iterator;
  function Ys(t) {
    return t === null || typeof t != "object" ? null : (t = a0 && t[a0] || t["@@iterator"], typeof t == "function" ? t : null);
  }
  var jA = Symbol.for("react.client.reference");
  function Uh(t) {
    if (t == null) return null;
    if (typeof t == "function") return t.$$typeof === jA ? null : t.displayName || t.name || null;
    if (typeof t == "string") return t;
    switch (t) {
      case Tr:
        return "Fragment";
      case Dh:
        return "Profiler";
      case V_:
        return "StrictMode";
      case Rh:
        return "Suspense";
      case Oh:
        return "SuspenseList";
      case zh:
        return "Activity";
    }
    if (typeof t == "object") switch (t.$$typeof) {
      case Js:
        return "Portal";
      case pi:
        return t.displayName || "Context";
      case L_:
        return (t._context.displayName || "Context") + ".Consumer";
      case dm:
        var e = t.render;
        return t = t.displayName, t || (t = e.displayName || e.name || "", t = t !== "" ? "ForwardRef(" + t + ")" : "ForwardRef"), t;
      case mm:
        return e = t.displayName || null, e !== null ? e : Uh(t.type) || "Memo";
      case Bi:
        e = t._payload, t = t._init;
        try {
          return Uh(t(e));
        } catch {
        }
    }
    return null;
  }
  var $s = Array.isArray, et = D_.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, mt = UA.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Ga = {
    pending: false,
    data: null,
    method: null,
    action: null
  }, Vh = [], xr = -1;
  function ei(t) {
    return {
      current: t
    };
  }
  function de(t) {
    0 > xr || (t.current = Vh[xr], Vh[xr] = null, xr--);
  }
  function Et(t, e) {
    xr++, Vh[xr] = t.current, t.current = e;
  }
  var $n = ei(null), Dl = ei(null), Ii = ei(null), Uu = ei(null);
  function Vu(t, e) {
    switch (Et(Ii, e), Et(Dl, t), Et($n, null), e.nodeType) {
      case 9:
      case 11:
        t = (t = e.documentElement) && (t = t.namespaceURI) ? cg(t) : 0;
        break;
      default:
        if (t = e.tagName, e = e.namespaceURI) e = cg(e), t = eS(e, t);
        else switch (t) {
          case "svg":
            t = 1;
            break;
          case "math":
            t = 2;
            break;
          default:
            t = 0;
        }
    }
    de($n), Et($n, t);
  }
  function Wr() {
    de($n), de(Dl), de(Ii);
  }
  function Lh(t) {
    t.memoizedState !== null && Et(Uu, t);
    var e = $n.current, n = eS(e, t.type);
    e !== n && (Et(Dl, t), Et($n, n));
  }
  function Lu(t) {
    Dl.current === t && (de($n), de(Dl)), Uu.current === t && (de(Uu), Yl._currentValue = Ga);
  }
  var bf, r0;
  function za(t) {
    if (bf === void 0) try {
      throw Error();
    } catch (n) {
      var e = n.stack.trim().match(/\n( *(at )?)/);
      bf = e && e[1] || "", r0 = -1 < n.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < n.stack.indexOf("@") ? "@unknown:0:0" : "";
    }
    return `
` + bf + t + r0;
  }
  var Sf = false;
  function Tf(t, e) {
    if (!t || Sf) return "";
    Sf = true;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var i = {
        DetermineComponentFrameRoot: function() {
          try {
            if (e) {
              var d = function() {
                throw Error();
              };
              if (Object.defineProperty(d.prototype, "props", {
                set: function() {
                  throw Error();
                }
              }), typeof Reflect == "object" && Reflect.construct) {
                try {
                  Reflect.construct(d, []);
                } catch (y) {
                  var m = y;
                }
                Reflect.construct(t, [], d);
              } else {
                try {
                  d.call();
                } catch (y) {
                  m = y;
                }
                t.call(d.prototype);
              }
            } else {
              try {
                throw Error();
              } catch (y) {
                m = y;
              }
              (d = t()) && typeof d.catch == "function" && d.catch(function() {
              });
            }
          } catch (y) {
            if (y && m && typeof y.stack == "string") return [
              y.stack,
              m.stack
            ];
          }
          return [
            null,
            null
          ];
        }
      };
      i.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
      var a = Object.getOwnPropertyDescriptor(i.DetermineComponentFrameRoot, "name");
      a && a.configurable && Object.defineProperty(i.DetermineComponentFrameRoot, "name", {
        value: "DetermineComponentFrameRoot"
      });
      var r = i.DetermineComponentFrameRoot(), s = r[0], l = r[1];
      if (s && l) {
        var o = s.split(`
`), c = l.split(`
`);
        for (a = i = 0; i < o.length && !o[i].includes("DetermineComponentFrameRoot"); ) i++;
        for (; a < c.length && !c[a].includes("DetermineComponentFrameRoot"); ) a++;
        if (i === o.length || a === c.length) for (i = o.length - 1, a = c.length - 1; 1 <= i && 0 <= a && o[i] !== c[a]; ) a--;
        for (; 1 <= i && 0 <= a; i--, a--) if (o[i] !== c[a]) {
          if (i !== 1 || a !== 1) do
            if (i--, a--, 0 > a || o[i] !== c[a]) {
              var f = `
` + o[i].replace(" at new ", " at ");
              return t.displayName && f.includes("<anonymous>") && (f = f.replace("<anonymous>", t.displayName)), f;
            }
          while (1 <= i && 0 <= a);
          break;
        }
      }
    } finally {
      Sf = false, Error.prepareStackTrace = n;
    }
    return (n = t ? t.displayName || t.name : "") ? za(n) : "";
  }
  function BA(t, e) {
    switch (t.tag) {
      case 26:
      case 27:
      case 5:
        return za(t.type);
      case 16:
        return za("Lazy");
      case 13:
        return t.child !== e && e !== null ? za("Suspense Fallback") : za("Suspense");
      case 19:
        return za("SuspenseList");
      case 0:
      case 15:
        return Tf(t.type, false);
      case 11:
        return Tf(t.type.render, false);
      case 1:
        return Tf(t.type, true);
      case 31:
        return za("Activity");
      default:
        return "";
    }
  }
  function s0(t) {
    try {
      var e = "", n = null;
      do
        e += BA(t, n), n = t, t = t.return;
      while (t);
      return e;
    } catch (i) {
      return `
Error generating stack: ` + i.message + `
` + i.stack;
    }
  }
  var Nh = Object.prototype.hasOwnProperty, pm = ce.unstable_scheduleCallback, xf = ce.unstable_cancelCallback, HA = ce.unstable_shouldYield, YA = ce.unstable_requestPaint, rn = ce.unstable_now, GA = ce.unstable_getCurrentPriorityLevel, N_ = ce.unstable_ImmediatePriority, j_ = ce.unstable_UserBlockingPriority, Nu = ce.unstable_NormalPriority, PA = ce.unstable_LowPriority, B_ = ce.unstable_IdlePriority, kA = ce.log, XA = ce.unstable_setDisableYieldValue, ro = null, sn = null;
  function Xi(t) {
    if (typeof kA == "function" && XA(t), sn && typeof sn.setStrictMode == "function") try {
      sn.setStrictMode(ro, t);
    } catch {
    }
  }
  var ln = Math.clz32 ? Math.clz32 : KA, FA = Math.log, qA = Math.LN2;
  function KA(t) {
    return t >>>= 0, t === 0 ? 32 : 31 - (FA(t) / qA | 0) | 0;
  }
  var Yo = 256, Go = 262144, Po = 4194304;
  function Ua(t) {
    var e = t & 42;
    if (e !== 0) return e;
    switch (t & -t) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return t & 261888;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return t & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return t;
    }
  }
  function wc(t, e, n) {
    var i = t.pendingLanes;
    if (i === 0) return 0;
    var a = 0, r = t.suspendedLanes, s = t.pingedLanes;
    t = t.warmLanes;
    var l = i & 134217727;
    return l !== 0 ? (i = l & ~r, i !== 0 ? a = Ua(i) : (s &= l, s !== 0 ? a = Ua(s) : n || (n = l & ~t, n !== 0 && (a = Ua(n))))) : (l = i & ~r, l !== 0 ? a = Ua(l) : s !== 0 ? a = Ua(s) : n || (n = i & ~t, n !== 0 && (a = Ua(n)))), a === 0 ? 0 : e !== 0 && e !== a && !(e & r) && (r = a & -a, n = e & -e, r >= n || r === 32 && (n & 4194048) !== 0) ? e : a;
  }
  function so(t, e) {
    return (t.pendingLanes & ~(t.suspendedLanes & ~t.pingedLanes) & e) === 0;
  }
  function QA(t, e) {
    switch (t) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return e + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function H_() {
    var t = Po;
    return Po <<= 1, !(Po & 62914560) && (Po = 4194304), t;
  }
  function Af(t) {
    for (var e = [], n = 0; 31 > n; n++) e.push(t);
    return e;
  }
  function lo(t, e) {
    t.pendingLanes |= e, e !== 268435456 && (t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0);
  }
  function ZA(t, e, n, i, a, r) {
    var s = t.pendingLanes;
    t.pendingLanes = n, t.suspendedLanes = 0, t.pingedLanes = 0, t.warmLanes = 0, t.expiredLanes &= n, t.entangledLanes &= n, t.errorRecoveryDisabledLanes &= n, t.shellSuspendCounter = 0;
    var l = t.entanglements, o = t.expirationTimes, c = t.hiddenUpdates;
    for (n = s & ~n; 0 < n; ) {
      var f = 31 - ln(n), d = 1 << f;
      l[f] = 0, o[f] = -1;
      var m = c[f];
      if (m !== null) for (c[f] = null, f = 0; f < m.length; f++) {
        var y = m[f];
        y !== null && (y.lane &= -536870913);
      }
      n &= ~d;
    }
    i !== 0 && Y_(t, i, 0), r !== 0 && a === 0 && t.tag !== 0 && (t.suspendedLanes |= r & ~(s & ~e));
  }
  function Y_(t, e, n) {
    t.pendingLanes |= e, t.suspendedLanes &= ~e;
    var i = 31 - ln(e);
    t.entangledLanes |= e, t.entanglements[i] = t.entanglements[i] | 1073741824 | n & 261930;
  }
  function G_(t, e) {
    var n = t.entangledLanes |= e;
    for (t = t.entanglements; n; ) {
      var i = 31 - ln(n), a = 1 << i;
      a & e | t[i] & e && (t[i] |= e), n &= ~a;
    }
  }
  function P_(t, e) {
    var n = e & -e;
    return n = n & 42 ? 1 : ym(n), n & (t.suspendedLanes | e) ? 0 : n;
  }
  function ym(t) {
    switch (t) {
      case 2:
        t = 1;
        break;
      case 8:
        t = 4;
        break;
      case 32:
        t = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        t = 128;
        break;
      case 268435456:
        t = 134217728;
        break;
      default:
        t = 0;
    }
    return t;
  }
  function gm(t) {
    return t &= -t, 2 < t ? 8 < t ? t & 134217727 ? 32 : 268435456 : 8 : 2;
  }
  function k_() {
    var t = mt.p;
    return t !== 0 ? t : (t = window.event, t === void 0 ? 32 : hS(t.type));
  }
  function l0(t, e) {
    var n = mt.p;
    try {
      return mt.p = t, e();
    } finally {
      mt.p = n;
    }
  }
  var va = Math.random().toString(36).slice(2), be = "__reactFiber$" + va, Qe = "__reactProps$" + va, _s = "__reactContainer$" + va, jh = "__reactEvents$" + va, JA = "__reactListeners$" + va, $A = "__reactHandles$" + va, o0 = "__reactResources$" + va, oo = "__reactMarker$" + va;
  function vm(t) {
    delete t[be], delete t[Qe], delete t[jh], delete t[JA], delete t[$A];
  }
  function Ar(t) {
    var e = t[be];
    if (e) return e;
    for (var n = t.parentNode; n; ) {
      if (e = n[_s] || n[be]) {
        if (n = e.alternate, e.child !== null || n !== null && n.child !== null) for (t = pg(t); t !== null; ) {
          if (n = t[be]) return n;
          t = pg(t);
        }
        return e;
      }
      t = n, n = t.parentNode;
    }
    return null;
  }
  function bs(t) {
    if (t = t[be] || t[_s]) {
      var e = t.tag;
      if (e === 5 || e === 6 || e === 13 || e === 31 || e === 26 || e === 27 || e === 3) return t;
    }
    return null;
  }
  function Ws(t) {
    var e = t.tag;
    if (e === 5 || e === 26 || e === 27 || e === 6) return t.stateNode;
    throw Error(j(33));
  }
  function Gr(t) {
    var e = t[o0];
    return e || (e = t[o0] = {
      hoistableStyles: /* @__PURE__ */ new Map(),
      hoistableScripts: /* @__PURE__ */ new Map()
    }), e;
  }
  function he(t) {
    t[oo] = true;
  }
  var X_ = /* @__PURE__ */ new Set(), F_ = {};
  function rr(t, e) {
    Ir(t, e), Ir(t + "Capture", e);
  }
  function Ir(t, e) {
    for (F_[t] = e, t = 0; t < e.length; t++) X_.add(e[t]);
  }
  var WA = RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"), u0 = {}, c0 = {};
  function IA(t) {
    return Nh.call(c0, t) ? true : Nh.call(u0, t) ? false : WA.test(t) ? c0[t] = true : (u0[t] = true, false);
  }
  function lu(t, e, n) {
    if (IA(e)) if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
          t.removeAttribute(e);
          return;
        case "boolean":
          var i = e.toLowerCase().slice(0, 5);
          if (i !== "data-" && i !== "aria-") {
            t.removeAttribute(e);
            return;
          }
      }
      t.setAttribute(e, "" + n);
    }
  }
  function ko(t, e, n) {
    if (n === null) t.removeAttribute(e);
    else {
      switch (typeof n) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(e);
          return;
      }
      t.setAttribute(e, "" + n);
    }
  }
  function si(t, e, n, i) {
    if (i === null) t.removeAttribute(n);
    else {
      switch (typeof i) {
        case "undefined":
        case "function":
        case "symbol":
        case "boolean":
          t.removeAttribute(n);
          return;
      }
      t.setAttributeNS(e, n, "" + i);
    }
  }
  function bn(t) {
    switch (typeof t) {
      case "bigint":
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return t;
      case "object":
        return t;
      default:
        return "";
    }
  }
  function q_(t) {
    var e = t.type;
    return (t = t.nodeName) && t.toLowerCase() === "input" && (e === "checkbox" || e === "radio");
  }
  function tE(t, e, n) {
    var i = Object.getOwnPropertyDescriptor(t.constructor.prototype, e);
    if (!t.hasOwnProperty(e) && typeof i < "u" && typeof i.get == "function" && typeof i.set == "function") {
      var a = i.get, r = i.set;
      return Object.defineProperty(t, e, {
        configurable: true,
        get: function() {
          return a.call(this);
        },
        set: function(s) {
          n = "" + s, r.call(this, s);
        }
      }), Object.defineProperty(t, e, {
        enumerable: i.enumerable
      }), {
        getValue: function() {
          return n;
        },
        setValue: function(s) {
          n = "" + s;
        },
        stopTracking: function() {
          t._valueTracker = null, delete t[e];
        }
      };
    }
  }
  function Bh(t) {
    if (!t._valueTracker) {
      var e = q_(t) ? "checked" : "value";
      t._valueTracker = tE(t, e, "" + t[e]);
    }
  }
  function K_(t) {
    if (!t) return false;
    var e = t._valueTracker;
    if (!e) return true;
    var n = e.getValue(), i = "";
    return t && (i = q_(t) ? t.checked ? "true" : "false" : t.value), t = i, t !== n ? (e.setValue(t), true) : false;
  }
  function ju(t) {
    if (t = t || (typeof document < "u" ? document : void 0), typeof t > "u") return null;
    try {
      return t.activeElement || t.body;
    } catch {
      return t.body;
    }
  }
  var eE = /[\n"\\]/g;
  function xn(t) {
    return t.replace(eE, function(e) {
      return "\\" + e.charCodeAt(0).toString(16) + " ";
    });
  }
  function Hh(t, e, n, i, a, r, s, l) {
    t.name = "", s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" ? t.type = s : t.removeAttribute("type"), e != null ? s === "number" ? (e === 0 && t.value === "" || t.value != e) && (t.value = "" + bn(e)) : t.value !== "" + bn(e) && (t.value = "" + bn(e)) : s !== "submit" && s !== "reset" || t.removeAttribute("value"), e != null ? Yh(t, s, bn(e)) : n != null ? Yh(t, s, bn(n)) : i != null && t.removeAttribute("value"), a == null && r != null && (t.defaultChecked = !!r), a != null && (t.checked = a && typeof a != "function" && typeof a != "symbol"), l != null && typeof l != "function" && typeof l != "symbol" && typeof l != "boolean" ? t.name = "" + bn(l) : t.removeAttribute("name");
  }
  function Q_(t, e, n, i, a, r, s, l) {
    if (r != null && typeof r != "function" && typeof r != "symbol" && typeof r != "boolean" && (t.type = r), e != null || n != null) {
      if (!(r !== "submit" && r !== "reset" || e != null)) {
        Bh(t);
        return;
      }
      n = n != null ? "" + bn(n) : "", e = e != null ? "" + bn(e) : n, l || e === t.value || (t.value = e), t.defaultValue = e;
    }
    i = i ?? a, i = typeof i != "function" && typeof i != "symbol" && !!i, t.checked = l ? t.checked : !!i, t.defaultChecked = !!i, s != null && typeof s != "function" && typeof s != "symbol" && typeof s != "boolean" && (t.name = s), Bh(t);
  }
  function Yh(t, e, n) {
    e === "number" && ju(t.ownerDocument) === t || t.defaultValue === "" + n || (t.defaultValue = "" + n);
  }
  function Pr(t, e, n, i) {
    if (t = t.options, e) {
      e = {};
      for (var a = 0; a < n.length; a++) e["$" + n[a]] = true;
      for (n = 0; n < t.length; n++) a = e.hasOwnProperty("$" + t[n].value), t[n].selected !== a && (t[n].selected = a), a && i && (t[n].defaultSelected = true);
    } else {
      for (n = "" + bn(n), e = null, a = 0; a < t.length; a++) {
        if (t[a].value === n) {
          t[a].selected = true, i && (t[a].defaultSelected = true);
          return;
        }
        e !== null || t[a].disabled || (e = t[a]);
      }
      e !== null && (e.selected = true);
    }
  }
  function Z_(t, e, n) {
    if (e != null && (e = "" + bn(e), e !== t.value && (t.value = e), n == null)) {
      t.defaultValue !== e && (t.defaultValue = e);
      return;
    }
    t.defaultValue = n != null ? "" + bn(n) : "";
  }
  function J_(t, e, n, i) {
    if (e == null) {
      if (i != null) {
        if (n != null) throw Error(j(92));
        if ($s(i)) {
          if (1 < i.length) throw Error(j(93));
          i = i[0];
        }
        n = i;
      }
      n == null && (n = ""), e = n;
    }
    n = bn(e), t.defaultValue = n, i = t.textContent, i === n && i !== "" && i !== null && (t.value = i), Bh(t);
  }
  function ts(t, e) {
    if (e) {
      var n = t.firstChild;
      if (n && n === t.lastChild && n.nodeType === 3) {
        n.nodeValue = e;
        return;
      }
    }
    t.textContent = e;
  }
  var nE = new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));
  function f0(t, e, n) {
    var i = e.indexOf("--") === 0;
    n == null || typeof n == "boolean" || n === "" ? i ? t.setProperty(e, "") : e === "float" ? t.cssFloat = "" : t[e] = "" : i ? t.setProperty(e, n) : typeof n != "number" || n === 0 || nE.has(e) ? e === "float" ? t.cssFloat = n : t[e] = ("" + n).trim() : t[e] = n + "px";
  }
  function $_(t, e, n) {
    if (e != null && typeof e != "object") throw Error(j(62));
    if (t = t.style, n != null) {
      for (var i in n) !n.hasOwnProperty(i) || e != null && e.hasOwnProperty(i) || (i.indexOf("--") === 0 ? t.setProperty(i, "") : i === "float" ? t.cssFloat = "" : t[i] = "");
      for (var a in e) i = e[a], e.hasOwnProperty(a) && n[a] !== i && f0(t, a, i);
    } else for (var r in e) e.hasOwnProperty(r) && f0(t, r, e[r]);
  }
  function _m(t) {
    if (t.indexOf("-") === -1) return false;
    switch (t) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var iE = /* @__PURE__ */ new Map([
    [
      "acceptCharset",
      "accept-charset"
    ],
    [
      "htmlFor",
      "for"
    ],
    [
      "httpEquiv",
      "http-equiv"
    ],
    [
      "crossOrigin",
      "crossorigin"
    ],
    [
      "accentHeight",
      "accent-height"
    ],
    [
      "alignmentBaseline",
      "alignment-baseline"
    ],
    [
      "arabicForm",
      "arabic-form"
    ],
    [
      "baselineShift",
      "baseline-shift"
    ],
    [
      "capHeight",
      "cap-height"
    ],
    [
      "clipPath",
      "clip-path"
    ],
    [
      "clipRule",
      "clip-rule"
    ],
    [
      "colorInterpolation",
      "color-interpolation"
    ],
    [
      "colorInterpolationFilters",
      "color-interpolation-filters"
    ],
    [
      "colorProfile",
      "color-profile"
    ],
    [
      "colorRendering",
      "color-rendering"
    ],
    [
      "dominantBaseline",
      "dominant-baseline"
    ],
    [
      "enableBackground",
      "enable-background"
    ],
    [
      "fillOpacity",
      "fill-opacity"
    ],
    [
      "fillRule",
      "fill-rule"
    ],
    [
      "floodColor",
      "flood-color"
    ],
    [
      "floodOpacity",
      "flood-opacity"
    ],
    [
      "fontFamily",
      "font-family"
    ],
    [
      "fontSize",
      "font-size"
    ],
    [
      "fontSizeAdjust",
      "font-size-adjust"
    ],
    [
      "fontStretch",
      "font-stretch"
    ],
    [
      "fontStyle",
      "font-style"
    ],
    [
      "fontVariant",
      "font-variant"
    ],
    [
      "fontWeight",
      "font-weight"
    ],
    [
      "glyphName",
      "glyph-name"
    ],
    [
      "glyphOrientationHorizontal",
      "glyph-orientation-horizontal"
    ],
    [
      "glyphOrientationVertical",
      "glyph-orientation-vertical"
    ],
    [
      "horizAdvX",
      "horiz-adv-x"
    ],
    [
      "horizOriginX",
      "horiz-origin-x"
    ],
    [
      "imageRendering",
      "image-rendering"
    ],
    [
      "letterSpacing",
      "letter-spacing"
    ],
    [
      "lightingColor",
      "lighting-color"
    ],
    [
      "markerEnd",
      "marker-end"
    ],
    [
      "markerMid",
      "marker-mid"
    ],
    [
      "markerStart",
      "marker-start"
    ],
    [
      "overlinePosition",
      "overline-position"
    ],
    [
      "overlineThickness",
      "overline-thickness"
    ],
    [
      "paintOrder",
      "paint-order"
    ],
    [
      "panose-1",
      "panose-1"
    ],
    [
      "pointerEvents",
      "pointer-events"
    ],
    [
      "renderingIntent",
      "rendering-intent"
    ],
    [
      "shapeRendering",
      "shape-rendering"
    ],
    [
      "stopColor",
      "stop-color"
    ],
    [
      "stopOpacity",
      "stop-opacity"
    ],
    [
      "strikethroughPosition",
      "strikethrough-position"
    ],
    [
      "strikethroughThickness",
      "strikethrough-thickness"
    ],
    [
      "strokeDasharray",
      "stroke-dasharray"
    ],
    [
      "strokeDashoffset",
      "stroke-dashoffset"
    ],
    [
      "strokeLinecap",
      "stroke-linecap"
    ],
    [
      "strokeLinejoin",
      "stroke-linejoin"
    ],
    [
      "strokeMiterlimit",
      "stroke-miterlimit"
    ],
    [
      "strokeOpacity",
      "stroke-opacity"
    ],
    [
      "strokeWidth",
      "stroke-width"
    ],
    [
      "textAnchor",
      "text-anchor"
    ],
    [
      "textDecoration",
      "text-decoration"
    ],
    [
      "textRendering",
      "text-rendering"
    ],
    [
      "transformOrigin",
      "transform-origin"
    ],
    [
      "underlinePosition",
      "underline-position"
    ],
    [
      "underlineThickness",
      "underline-thickness"
    ],
    [
      "unicodeBidi",
      "unicode-bidi"
    ],
    [
      "unicodeRange",
      "unicode-range"
    ],
    [
      "unitsPerEm",
      "units-per-em"
    ],
    [
      "vAlphabetic",
      "v-alphabetic"
    ],
    [
      "vHanging",
      "v-hanging"
    ],
    [
      "vIdeographic",
      "v-ideographic"
    ],
    [
      "vMathematical",
      "v-mathematical"
    ],
    [
      "vectorEffect",
      "vector-effect"
    ],
    [
      "vertAdvY",
      "vert-adv-y"
    ],
    [
      "vertOriginX",
      "vert-origin-x"
    ],
    [
      "vertOriginY",
      "vert-origin-y"
    ],
    [
      "wordSpacing",
      "word-spacing"
    ],
    [
      "writingMode",
      "writing-mode"
    ],
    [
      "xmlnsXlink",
      "xmlns:xlink"
    ],
    [
      "xHeight",
      "x-height"
    ]
  ]), aE = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function ou(t) {
    return aE.test("" + t) ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')" : t;
  }
  function yi() {
  }
  var Gh = null;
  function bm(t) {
    return t = t.target || t.srcElement || window, t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === 3 ? t.parentNode : t;
  }
  var Er = null, kr = null;
  function h0(t) {
    var e = bs(t);
    if (e && (t = e.stateNode)) {
      var n = t[Qe] || null;
      t: switch (t = e.stateNode, e.type) {
        case "input":
          if (Hh(t, n.value, n.defaultValue, n.defaultValue, n.checked, n.defaultChecked, n.type, n.name), e = n.name, n.type === "radio" && e != null) {
            for (n = t; n.parentNode; ) n = n.parentNode;
            for (n = n.querySelectorAll('input[name="' + xn("" + e) + '"][type="radio"]'), e = 0; e < n.length; e++) {
              var i = n[e];
              if (i !== t && i.form === t.form) {
                var a = i[Qe] || null;
                if (!a) throw Error(j(90));
                Hh(i, a.value, a.defaultValue, a.defaultValue, a.checked, a.defaultChecked, a.type, a.name);
              }
            }
            for (e = 0; e < n.length; e++) i = n[e], i.form === t.form && K_(i);
          }
          break t;
        case "textarea":
          Z_(t, n.value, n.defaultValue);
          break t;
        case "select":
          e = n.value, e != null && Pr(t, !!n.multiple, e, false);
      }
    }
  }
  var Ef = false;
  function W_(t, e, n) {
    if (Ef) return t(e, n);
    Ef = true;
    try {
      var i = t(e);
      return i;
    } finally {
      if (Ef = false, (Er !== null || kr !== null) && (Bc(), Er && (e = Er, t = kr, kr = Er = null, h0(e), t))) for (e = 0; e < t.length; e++) h0(t[e]);
    }
  }
  function Rl(t, e) {
    var n = t.stateNode;
    if (n === null) return null;
    var i = n[Qe] || null;
    if (i === null) return null;
    n = i[e];
    t: switch (e) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (i = !i.disabled) || (t = t.type, i = !(t === "button" || t === "input" || t === "select" || t === "textarea")), t = !i;
        break t;
      default:
        t = false;
    }
    if (t) return null;
    if (n && typeof n != "function") throw Error(j(231, e, typeof n));
    return n;
  }
  var Ti = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), Ph = false;
  if (Ti) try {
    var Gs = {};
    Object.defineProperty(Gs, "passive", {
      get: function() {
        Ph = true;
      }
    }), window.addEventListener("test", Gs, Gs), window.removeEventListener("test", Gs, Gs);
  } catch {
    Ph = false;
  }
  var Fi = null, Sm = null, uu = null;
  function I_() {
    if (uu) return uu;
    var t, e = Sm, n = e.length, i, a = "value" in Fi ? Fi.value : Fi.textContent, r = a.length;
    for (t = 0; t < n && e[t] === a[t]; t++) ;
    var s = n - t;
    for (i = 1; i <= s && e[n - i] === a[r - i]; i++) ;
    return uu = a.slice(t, 1 < i ? 1 - i : void 0);
  }
  function cu(t) {
    var e = t.keyCode;
    return "charCode" in t ? (t = t.charCode, t === 0 && e === 13 && (t = 13)) : t = e, t === 10 && (t = 13), 32 <= t || t === 13 ? t : 0;
  }
  function Xo() {
    return true;
  }
  function d0() {
    return false;
  }
  function Je(t) {
    function e(n, i, a, r, s) {
      this._reactName = n, this._targetInst = a, this.type = i, this.nativeEvent = r, this.target = s, this.currentTarget = null;
      for (var l in t) t.hasOwnProperty(l) && (n = t[l], this[l] = n ? n(r) : r[l]);
      return this.isDefaultPrevented = (r.defaultPrevented != null ? r.defaultPrevented : r.returnValue === false) ? Xo : d0, this.isPropagationStopped = d0, this;
    }
    return zt(e.prototype, {
      preventDefault: function() {
        this.defaultPrevented = true;
        var n = this.nativeEvent;
        n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = false), this.isDefaultPrevented = Xo);
      },
      stopPropagation: function() {
        var n = this.nativeEvent;
        n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = true), this.isPropagationStopped = Xo);
      },
      persist: function() {
      },
      isPersistent: Xo
    }), e;
  }
  var sr = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function(t) {
      return t.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, Mc = Je(sr), uo = zt({}, sr, {
    view: 0,
    detail: 0
  }), rE = Je(uo), wf, Mf, Ps, Cc = zt({}, uo, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Tm,
    button: 0,
    buttons: 0,
    relatedTarget: function(t) {
      return t.relatedTarget === void 0 ? t.fromElement === t.srcElement ? t.toElement : t.fromElement : t.relatedTarget;
    },
    movementX: function(t) {
      return "movementX" in t ? t.movementX : (t !== Ps && (Ps && t.type === "mousemove" ? (wf = t.screenX - Ps.screenX, Mf = t.screenY - Ps.screenY) : Mf = wf = 0, Ps = t), wf);
    },
    movementY: function(t) {
      return "movementY" in t ? t.movementY : Mf;
    }
  }), m0 = Je(Cc), sE = zt({}, Cc, {
    dataTransfer: 0
  }), lE = Je(sE), oE = zt({}, uo, {
    relatedTarget: 0
  }), Cf = Je(oE), uE = zt({}, sr, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), cE = Je(uE), fE = zt({}, sr, {
    clipboardData: function(t) {
      return "clipboardData" in t ? t.clipboardData : window.clipboardData;
    }
  }), hE = Je(fE), dE = zt({}, sr, {
    data: 0
  }), p0 = Je(dE), mE = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, pE = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, yE = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  function gE(t) {
    var e = this.nativeEvent;
    return e.getModifierState ? e.getModifierState(t) : (t = yE[t]) ? !!e[t] : false;
  }
  function Tm() {
    return gE;
  }
  var vE = zt({}, uo, {
    key: function(t) {
      if (t.key) {
        var e = mE[t.key] || t.key;
        if (e !== "Unidentified") return e;
      }
      return t.type === "keypress" ? (t = cu(t), t === 13 ? "Enter" : String.fromCharCode(t)) : t.type === "keydown" || t.type === "keyup" ? pE[t.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Tm,
    charCode: function(t) {
      return t.type === "keypress" ? cu(t) : 0;
    },
    keyCode: function(t) {
      return t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    },
    which: function(t) {
      return t.type === "keypress" ? cu(t) : t.type === "keydown" || t.type === "keyup" ? t.keyCode : 0;
    }
  }), _E = Je(vE), bE = zt({}, Cc, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), y0 = Je(bE), SE = zt({}, uo, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Tm
  }), TE = Je(SE), xE = zt({}, sr, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), AE = Je(xE), EE = zt({}, Cc, {
    deltaX: function(t) {
      return "deltaX" in t ? t.deltaX : "wheelDeltaX" in t ? -t.wheelDeltaX : 0;
    },
    deltaY: function(t) {
      return "deltaY" in t ? t.deltaY : "wheelDeltaY" in t ? -t.wheelDeltaY : "wheelDelta" in t ? -t.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), wE = Je(EE), ME = zt({}, sr, {
    newState: 0,
    oldState: 0
  }), CE = Je(ME), DE = [
    9,
    13,
    27,
    32
  ], xm = Ti && "CompositionEvent" in window, rl = null;
  Ti && "documentMode" in document && (rl = document.documentMode);
  var RE = Ti && "TextEvent" in window && !rl, t1 = Ti && (!xm || rl && 8 < rl && 11 >= rl), g0 = " ", v0 = false;
  function e1(t, e) {
    switch (t) {
      case "keyup":
        return DE.indexOf(e.keyCode) !== -1;
      case "keydown":
        return e.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function n1(t) {
    return t = t.detail, typeof t == "object" && "data" in t ? t.data : null;
  }
  var wr = false;
  function OE(t, e) {
    switch (t) {
      case "compositionend":
        return n1(e);
      case "keypress":
        return e.which !== 32 ? null : (v0 = true, g0);
      case "textInput":
        return t = e.data, t === g0 && v0 ? null : t;
      default:
        return null;
    }
  }
  function zE(t, e) {
    if (wr) return t === "compositionend" || !xm && e1(t, e) ? (t = I_(), uu = Sm = Fi = null, wr = false, t) : null;
    switch (t) {
      case "paste":
        return null;
      case "keypress":
        if (!(e.ctrlKey || e.altKey || e.metaKey) || e.ctrlKey && e.altKey) {
          if (e.char && 1 < e.char.length) return e.char;
          if (e.which) return String.fromCharCode(e.which);
        }
        return null;
      case "compositionend":
        return t1 && e.locale !== "ko" ? null : e.data;
      default:
        return null;
    }
  }
  var UE = {
    color: true,
    date: true,
    datetime: true,
    "datetime-local": true,
    email: true,
    month: true,
    number: true,
    password: true,
    range: true,
    search: true,
    tel: true,
    text: true,
    time: true,
    url: true,
    week: true
  };
  function _0(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e === "input" ? !!UE[t.type] : e === "textarea";
  }
  function i1(t, e, n, i) {
    Er ? kr ? kr.push(i) : kr = [
      i
    ] : Er = i, e = ec(e, "onChange"), 0 < e.length && (n = new Mc("onChange", "change", null, n, i), t.push({
      event: n,
      listeners: e
    }));
  }
  var sl = null, Ol = null;
  function VE(t) {
    Wb(t, 0);
  }
  function Dc(t) {
    var e = Ws(t);
    if (K_(e)) return t;
  }
  function b0(t, e) {
    if (t === "change") return e;
  }
  var a1 = false;
  if (Ti) {
    var Df;
    if (Ti) {
      var Rf = "oninput" in document;
      if (!Rf) {
        var S0 = document.createElement("div");
        S0.setAttribute("oninput", "return;"), Rf = typeof S0.oninput == "function";
      }
      Df = Rf;
    } else Df = false;
    a1 = Df && (!document.documentMode || 9 < document.documentMode);
  }
  function T0() {
    sl && (sl.detachEvent("onpropertychange", r1), Ol = sl = null);
  }
  function r1(t) {
    if (t.propertyName === "value" && Dc(Ol)) {
      var e = [];
      i1(e, Ol, t, bm(t)), W_(VE, e);
    }
  }
  function LE(t, e, n) {
    t === "focusin" ? (T0(), sl = e, Ol = n, sl.attachEvent("onpropertychange", r1)) : t === "focusout" && T0();
  }
  function NE(t) {
    if (t === "selectionchange" || t === "keyup" || t === "keydown") return Dc(Ol);
  }
  function jE(t, e) {
    if (t === "click") return Dc(e);
  }
  function BE(t, e) {
    if (t === "input" || t === "change") return Dc(e);
  }
  function HE(t, e) {
    return t === e && (t !== 0 || 1 / t === 1 / e) || t !== t && e !== e;
  }
  var cn = typeof Object.is == "function" ? Object.is : HE;
  function zl(t, e) {
    if (cn(t, e)) return true;
    if (typeof t != "object" || t === null || typeof e != "object" || e === null) return false;
    var n = Object.keys(t), i = Object.keys(e);
    if (n.length !== i.length) return false;
    for (i = 0; i < n.length; i++) {
      var a = n[i];
      if (!Nh.call(e, a) || !cn(t[a], e[a])) return false;
    }
    return true;
  }
  function x0(t) {
    for (; t && t.firstChild; ) t = t.firstChild;
    return t;
  }
  function A0(t, e) {
    var n = x0(t);
    t = 0;
    for (var i; n; ) {
      if (n.nodeType === 3) {
        if (i = t + n.textContent.length, t <= e && i >= e) return {
          node: n,
          offset: e - t
        };
        t = i;
      }
      t: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break t;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = x0(n);
    }
  }
  function s1(t, e) {
    return t && e ? t === e ? true : t && t.nodeType === 3 ? false : e && e.nodeType === 3 ? s1(t, e.parentNode) : "contains" in t ? t.contains(e) : t.compareDocumentPosition ? !!(t.compareDocumentPosition(e) & 16) : false : false;
  }
  function l1(t) {
    t = t != null && t.ownerDocument != null && t.ownerDocument.defaultView != null ? t.ownerDocument.defaultView : window;
    for (var e = ju(t.document); e instanceof t.HTMLIFrameElement; ) {
      try {
        var n = typeof e.contentWindow.location.href == "string";
      } catch {
        n = false;
      }
      if (n) t = e.contentWindow;
      else break;
      e = ju(t.document);
    }
    return e;
  }
  function Am(t) {
    var e = t && t.nodeName && t.nodeName.toLowerCase();
    return e && (e === "input" && (t.type === "text" || t.type === "search" || t.type === "tel" || t.type === "url" || t.type === "password") || e === "textarea" || t.contentEditable === "true");
  }
  var YE = Ti && "documentMode" in document && 11 >= document.documentMode, Mr = null, kh = null, ll = null, Xh = false;
  function E0(t, e, n) {
    var i = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Xh || Mr == null || Mr !== ju(i) || (i = Mr, "selectionStart" in i && Am(i) ? i = {
      start: i.selectionStart,
      end: i.selectionEnd
    } : (i = (i.ownerDocument && i.ownerDocument.defaultView || window).getSelection(), i = {
      anchorNode: i.anchorNode,
      anchorOffset: i.anchorOffset,
      focusNode: i.focusNode,
      focusOffset: i.focusOffset
    }), ll && zl(ll, i) || (ll = i, i = ec(kh, "onSelect"), 0 < i.length && (e = new Mc("onSelect", "select", null, e, n), t.push({
      event: e,
      listeners: i
    }), e.target = Mr)));
  }
  function Ca(t, e) {
    var n = {};
    return n[t.toLowerCase()] = e.toLowerCase(), n["Webkit" + t] = "webkit" + e, n["Moz" + t] = "moz" + e, n;
  }
  var Cr = {
    animationend: Ca("Animation", "AnimationEnd"),
    animationiteration: Ca("Animation", "AnimationIteration"),
    animationstart: Ca("Animation", "AnimationStart"),
    transitionrun: Ca("Transition", "TransitionRun"),
    transitionstart: Ca("Transition", "TransitionStart"),
    transitioncancel: Ca("Transition", "TransitionCancel"),
    transitionend: Ca("Transition", "TransitionEnd")
  }, Of = {}, o1 = {};
  Ti && (o1 = document.createElement("div").style, "AnimationEvent" in window || (delete Cr.animationend.animation, delete Cr.animationiteration.animation, delete Cr.animationstart.animation), "TransitionEvent" in window || delete Cr.transitionend.transition);
  function lr(t) {
    if (Of[t]) return Of[t];
    if (!Cr[t]) return t;
    var e = Cr[t], n;
    for (n in e) if (e.hasOwnProperty(n) && n in o1) return Of[t] = e[n];
    return t;
  }
  var u1 = lr("animationend"), c1 = lr("animationiteration"), f1 = lr("animationstart"), GE = lr("transitionrun"), PE = lr("transitionstart"), kE = lr("transitioncancel"), h1 = lr("transitionend"), d1 = /* @__PURE__ */ new Map(), Fh = "abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  Fh.push("scrollEnd");
  function Yn(t, e) {
    d1.set(t, e), rr(e, [
      t
    ]);
  }
  var Bu = typeof reportError == "function" ? reportError : function(t) {
    if (typeof window == "object" && typeof window.ErrorEvent == "function") {
      var e = new window.ErrorEvent("error", {
        bubbles: true,
        cancelable: true,
        message: typeof t == "object" && t !== null && typeof t.message == "string" ? String(t.message) : String(t),
        error: t
      });
      if (!window.dispatchEvent(e)) return;
    } else if (typeof process == "object" && typeof process.emit == "function") {
      process.emit("uncaughtException", t);
      return;
    }
    console.error(t);
  }, _n = [], Dr = 0, Em = 0;
  function Rc() {
    for (var t = Dr, e = Em = Dr = 0; e < t; ) {
      var n = _n[e];
      _n[e++] = null;
      var i = _n[e];
      _n[e++] = null;
      var a = _n[e];
      _n[e++] = null;
      var r = _n[e];
      if (_n[e++] = null, i !== null && a !== null) {
        var s = i.pending;
        s === null ? a.next = a : (a.next = s.next, s.next = a), i.pending = a;
      }
      r !== 0 && m1(n, a, r);
    }
  }
  function Oc(t, e, n, i) {
    _n[Dr++] = t, _n[Dr++] = e, _n[Dr++] = n, _n[Dr++] = i, Em |= i, t.lanes |= i, t = t.alternate, t !== null && (t.lanes |= i);
  }
  function wm(t, e, n, i) {
    return Oc(t, e, n, i), Hu(t);
  }
  function or(t, e) {
    return Oc(t, null, null, e), Hu(t);
  }
  function m1(t, e, n) {
    t.lanes |= n;
    var i = t.alternate;
    i !== null && (i.lanes |= n);
    for (var a = false, r = t.return; r !== null; ) r.childLanes |= n, i = r.alternate, i !== null && (i.childLanes |= n), r.tag === 22 && (t = r.stateNode, t === null || t._visibility & 1 || (a = true)), t = r, r = r.return;
    return t.tag === 3 ? (r = t.stateNode, a && e !== null && (a = 31 - ln(n), t = r.hiddenUpdates, i = t[a], i === null ? t[a] = [
      e
    ] : i.push(e), e.lane = n | 536870912), r) : null;
  }
  function Hu(t) {
    if (50 < yl) throw yl = 0, hd = null, Error(j(185));
    for (var e = t.return; e !== null; ) t = e, e = t.return;
    return t.tag === 3 ? t.stateNode : null;
  }
  var Rr = {};
  function XE(t, e, n, i) {
    this.tag = t, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.refCleanup = this.ref = null, this.pendingProps = e, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = i, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function tn(t, e, n, i) {
    return new XE(t, e, n, i);
  }
  function Mm(t) {
    return t = t.prototype, !(!t || !t.isReactComponent);
  }
  function vi(t, e) {
    var n = t.alternate;
    return n === null ? (n = tn(t.tag, e, t.key, t.mode), n.elementType = t.elementType, n.type = t.type, n.stateNode = t.stateNode, n.alternate = t, t.alternate = n) : (n.pendingProps = e, n.type = t.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = t.flags & 65011712, n.childLanes = t.childLanes, n.lanes = t.lanes, n.child = t.child, n.memoizedProps = t.memoizedProps, n.memoizedState = t.memoizedState, n.updateQueue = t.updateQueue, e = t.dependencies, n.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }, n.sibling = t.sibling, n.index = t.index, n.ref = t.ref, n.refCleanup = t.refCleanup, n;
  }
  function p1(t, e) {
    t.flags &= 65011714;
    var n = t.alternate;
    return n === null ? (t.childLanes = 0, t.lanes = e, t.child = null, t.subtreeFlags = 0, t.memoizedProps = null, t.memoizedState = null, t.updateQueue = null, t.dependencies = null, t.stateNode = null) : (t.childLanes = n.childLanes, t.lanes = n.lanes, t.child = n.child, t.subtreeFlags = 0, t.deletions = null, t.memoizedProps = n.memoizedProps, t.memoizedState = n.memoizedState, t.updateQueue = n.updateQueue, t.type = n.type, e = n.dependencies, t.dependencies = e === null ? null : {
      lanes: e.lanes,
      firstContext: e.firstContext
    }), t;
  }
  function fu(t, e, n, i, a, r) {
    var s = 0;
    if (i = t, typeof t == "function") Mm(t) && (s = 1);
    else if (typeof t == "string") s = Zw(t, n, $n.current) ? 26 : t === "html" || t === "head" || t === "body" ? 27 : 5;
    else t: switch (t) {
      case zh:
        return t = tn(31, n, e, a), t.elementType = zh, t.lanes = r, t;
      case Tr:
        return Pa(n.children, a, r, e);
      case V_:
        s = 8, a |= 24;
        break;
      case Dh:
        return t = tn(12, n, e, a | 2), t.elementType = Dh, t.lanes = r, t;
      case Rh:
        return t = tn(13, n, e, a), t.elementType = Rh, t.lanes = r, t;
      case Oh:
        return t = tn(19, n, e, a), t.elementType = Oh, t.lanes = r, t;
      default:
        if (typeof t == "object" && t !== null) switch (t.$$typeof) {
          case pi:
            s = 10;
            break t;
          case L_:
            s = 9;
            break t;
          case dm:
            s = 11;
            break t;
          case mm:
            s = 14;
            break t;
          case Bi:
            s = 16, i = null;
            break t;
        }
        s = 29, n = Error(j(130, t === null ? "null" : typeof t, "")), i = null;
    }
    return e = tn(s, n, e, a), e.elementType = t, e.type = i, e.lanes = r, e;
  }
  function Pa(t, e, n, i) {
    return t = tn(7, t, i, e), t.lanes = n, t;
  }
  function zf(t, e, n) {
    return t = tn(6, t, null, e), t.lanes = n, t;
  }
  function y1(t) {
    var e = tn(18, null, null, 0);
    return e.stateNode = t, e;
  }
  function Uf(t, e, n) {
    return e = tn(4, t.children !== null ? t.children : [], t.key, e), e.lanes = n, e.stateNode = {
      containerInfo: t.containerInfo,
      pendingChildren: null,
      implementation: t.implementation
    }, e;
  }
  var w0 = /* @__PURE__ */ new WeakMap();
  function An(t, e) {
    if (typeof t == "object" && t !== null) {
      var n = w0.get(t);
      return n !== void 0 ? n : (e = {
        value: t,
        source: e,
        stack: s0(e)
      }, w0.set(t, e), e);
    }
    return {
      value: t,
      source: e,
      stack: s0(e)
    };
  }
  var Or = [], zr = 0, Yu = null, Ul = 0, Sn = [], Tn = 0, ca = null, Kn = 1, Qn = "";
  function hi(t, e) {
    Or[zr++] = Ul, Or[zr++] = Yu, Yu = t, Ul = e;
  }
  function g1(t, e, n) {
    Sn[Tn++] = Kn, Sn[Tn++] = Qn, Sn[Tn++] = ca, ca = t;
    var i = Kn;
    t = Qn;
    var a = 32 - ln(i) - 1;
    i &= ~(1 << a), n += 1;
    var r = 32 - ln(e) + a;
    if (30 < r) {
      var s = a - a % 5;
      r = (i & (1 << s) - 1).toString(32), i >>= s, a -= s, Kn = 1 << 32 - ln(e) + a | n << a | i, Qn = r + t;
    } else Kn = 1 << r | n << a | i, Qn = t;
  }
  function Cm(t) {
    t.return !== null && (hi(t, 1), g1(t, 1, 0));
  }
  function Dm(t) {
    for (; t === Yu; ) Yu = Or[--zr], Or[zr] = null, Ul = Or[--zr], Or[zr] = null;
    for (; t === ca; ) ca = Sn[--Tn], Sn[Tn] = null, Qn = Sn[--Tn], Sn[Tn] = null, Kn = Sn[--Tn], Sn[Tn] = null;
  }
  function v1(t, e) {
    Sn[Tn++] = Kn, Sn[Tn++] = Qn, Sn[Tn++] = ca, Kn = e.id, Qn = e.overflow, ca = t;
  }
  var Se = null, Rt = null, ut = false, ta = null, En = false, qh = Error(j(519));
  function fa(t) {
    var e = Error(j(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? "text" : "HTML", ""));
    throw Vl(An(e, t)), qh;
  }
  function M0(t) {
    var e = t.stateNode, n = t.type, i = t.memoizedProps;
    switch (e[be] = t, e[Qe] = i, n) {
      case "dialog":
        st("cancel", e), st("close", e);
        break;
      case "iframe":
      case "object":
      case "embed":
        st("load", e);
        break;
      case "video":
      case "audio":
        for (n = 0; n < Bl.length; n++) st(Bl[n], e);
        break;
      case "source":
        st("error", e);
        break;
      case "img":
      case "image":
      case "link":
        st("error", e), st("load", e);
        break;
      case "details":
        st("toggle", e);
        break;
      case "input":
        st("invalid", e), Q_(e, i.value, i.defaultValue, i.checked, i.defaultChecked, i.type, i.name, true);
        break;
      case "select":
        st("invalid", e);
        break;
      case "textarea":
        st("invalid", e), J_(e, i.value, i.defaultValue, i.children);
    }
    n = i.children, typeof n != "string" && typeof n != "number" && typeof n != "bigint" || e.textContent === "" + n || i.suppressHydrationWarning === true || tS(e.textContent, n) ? (i.popover != null && (st("beforetoggle", e), st("toggle", e)), i.onScroll != null && st("scroll", e), i.onScrollEnd != null && st("scrollend", e), i.onClick != null && (e.onclick = yi), e = true) : e = false, e || fa(t, true);
  }
  function C0(t) {
    for (Se = t.return; Se; ) switch (Se.tag) {
      case 5:
      case 31:
      case 13:
        En = false;
        return;
      case 27:
      case 3:
        En = true;
        return;
      default:
        Se = Se.return;
    }
  }
  function pr(t) {
    if (t !== Se) return false;
    if (!ut) return C0(t), ut = true, false;
    var e = t.tag, n;
    if ((n = e !== 3 && e !== 27) && ((n = e === 5) && (n = t.type, n = !(n !== "form" && n !== "button") || gd(t.type, t.memoizedProps)), n = !n), n && Rt && fa(t), C0(t), e === 13) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(j(317));
      Rt = mg(t);
    } else if (e === 31) {
      if (t = t.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(j(317));
      Rt = mg(t);
    } else e === 27 ? (e = Rt, _a(t.type) ? (t = Sd, Sd = null, Rt = t) : Rt = e) : Rt = Se ? On(t.stateNode.nextSibling) : null;
    return true;
  }
  function Ia() {
    Rt = Se = null, ut = false;
  }
  function Vf() {
    var t = ta;
    return t !== null && (Ge === null ? Ge = t : Ge.push.apply(Ge, t), ta = null), t;
  }
  function Vl(t) {
    ta === null ? ta = [
      t
    ] : ta.push(t);
  }
  var Kh = ei(null), ur = null, gi = null;
  function Yi(t, e, n) {
    Et(Kh, e._currentValue), e._currentValue = n;
  }
  function _i(t) {
    t._currentValue = Kh.current, de(Kh);
  }
  function Qh(t, e, n) {
    for (; t !== null; ) {
      var i = t.alternate;
      if ((t.childLanes & e) !== e ? (t.childLanes |= e, i !== null && (i.childLanes |= e)) : i !== null && (i.childLanes & e) !== e && (i.childLanes |= e), t === n) break;
      t = t.return;
    }
  }
  function Zh(t, e, n, i) {
    var a = t.child;
    for (a !== null && (a.return = t); a !== null; ) {
      var r = a.dependencies;
      if (r !== null) {
        var s = a.child;
        r = r.firstContext;
        t: for (; r !== null; ) {
          var l = r;
          r = a;
          for (var o = 0; o < e.length; o++) if (l.context === e[o]) {
            r.lanes |= n, l = r.alternate, l !== null && (l.lanes |= n), Qh(r.return, n, t), i || (s = null);
            break t;
          }
          r = l.next;
        }
      } else if (a.tag === 18) {
        if (s = a.return, s === null) throw Error(j(341));
        s.lanes |= n, r = s.alternate, r !== null && (r.lanes |= n), Qh(s, n, t), s = null;
      } else s = a.child;
      if (s !== null) s.return = a;
      else for (s = a; s !== null; ) {
        if (s === t) {
          s = null;
          break;
        }
        if (a = s.sibling, a !== null) {
          a.return = s.return, s = a;
          break;
        }
        s = s.return;
      }
      a = s;
    }
  }
  function Ss(t, e, n, i) {
    t = null;
    for (var a = e, r = false; a !== null; ) {
      if (!r) {
        if (a.flags & 524288) r = true;
        else if (a.flags & 262144) break;
      }
      if (a.tag === 10) {
        var s = a.alternate;
        if (s === null) throw Error(j(387));
        if (s = s.memoizedProps, s !== null) {
          var l = a.type;
          cn(a.pendingProps.value, s.value) || (t !== null ? t.push(l) : t = [
            l
          ]);
        }
      } else if (a === Uu.current) {
        if (s = a.alternate, s === null) throw Error(j(387));
        s.memoizedState.memoizedState !== a.memoizedState.memoizedState && (t !== null ? t.push(Yl) : t = [
          Yl
        ]);
      }
      a = a.return;
    }
    t !== null && Zh(e, t, n, i), e.flags |= 262144;
  }
  function Gu(t) {
    for (t = t.firstContext; t !== null; ) {
      if (!cn(t.context._currentValue, t.memoizedValue)) return true;
      t = t.next;
    }
    return false;
  }
  function tr(t) {
    ur = t, gi = null, t = t.dependencies, t !== null && (t.firstContext = null);
  }
  function Te(t) {
    return _1(ur, t);
  }
  function Fo(t, e) {
    return ur === null && tr(t), _1(t, e);
  }
  function _1(t, e) {
    var n = e._currentValue;
    if (e = {
      context: e,
      memoizedValue: n,
      next: null
    }, gi === null) {
      if (t === null) throw Error(j(308));
      gi = e, t.dependencies = {
        lanes: 0,
        firstContext: e
      }, t.flags |= 524288;
    } else gi = gi.next = e;
    return n;
  }
  var FE = typeof AbortController < "u" ? AbortController : function() {
    var t = [], e = this.signal = {
      aborted: false,
      addEventListener: function(n, i) {
        t.push(i);
      }
    };
    this.abort = function() {
      e.aborted = true, t.forEach(function(n) {
        return n();
      });
    };
  }, qE = ce.unstable_scheduleCallback, KE = ce.unstable_NormalPriority, se = {
    $$typeof: pi,
    Consumer: null,
    Provider: null,
    _currentValue: null,
    _currentValue2: null,
    _threadCount: 0
  };
  function Rm() {
    return {
      controller: new FE(),
      data: /* @__PURE__ */ new Map(),
      refCount: 0
    };
  }
  function co(t) {
    t.refCount--, t.refCount === 0 && qE(KE, function() {
      t.controller.abort();
    });
  }
  var ol = null, Jh = 0, es = 0, Xr = null;
  function QE(t, e) {
    if (ol === null) {
      var n = ol = [];
      Jh = 0, es = ep(), Xr = {
        status: "pending",
        value: void 0,
        then: function(i) {
          n.push(i);
        }
      };
    }
    return Jh++, e.then(D0, D0), e;
  }
  function D0() {
    if (--Jh === 0 && ol !== null) {
      Xr !== null && (Xr.status = "fulfilled");
      var t = ol;
      ol = null, es = 0, Xr = null;
      for (var e = 0; e < t.length; e++) (0, t[e])();
    }
  }
  function ZE(t, e) {
    var n = [], i = {
      status: "pending",
      value: null,
      reason: null,
      then: function(a) {
        n.push(a);
      }
    };
    return t.then(function() {
      i.status = "fulfilled", i.value = e;
      for (var a = 0; a < n.length; a++) (0, n[a])(e);
    }, function(a) {
      for (i.status = "rejected", i.reason = a, a = 0; a < n.length; a++) (0, n[a])(void 0);
    }), i;
  }
  var R0 = et.S;
  et.S = function(t, e) {
    Ub = rn(), typeof e == "object" && e !== null && typeof e.then == "function" && QE(t, e), R0 !== null && R0(t, e);
  };
  var ka = ei(null);
  function Om() {
    var t = ka.current;
    return t !== null ? t : xt.pooledCache;
  }
  function hu(t, e) {
    e === null ? Et(ka, ka.current) : Et(ka, e.pool);
  }
  function b1() {
    var t = Om();
    return t === null ? null : {
      parent: se._currentValue,
      pool: t
    };
  }
  var Ts = Error(j(460)), zm = Error(j(474)), zc = Error(j(542)), Pu = {
    then: function() {
    }
  };
  function O0(t) {
    return t = t.status, t === "fulfilled" || t === "rejected";
  }
  function S1(t, e, n) {
    switch (n = t[n], n === void 0 ? t.push(e) : n !== e && (e.then(yi, yi), e = n), e.status) {
      case "fulfilled":
        return e.value;
      case "rejected":
        throw t = e.reason, U0(t), t;
      default:
        if (typeof e.status == "string") e.then(yi, yi);
        else {
          if (t = xt, t !== null && 100 < t.shellSuspendCounter) throw Error(j(482));
          t = e, t.status = "pending", t.then(function(i) {
            if (e.status === "pending") {
              var a = e;
              a.status = "fulfilled", a.value = i;
            }
          }, function(i) {
            if (e.status === "pending") {
              var a = e;
              a.status = "rejected", a.reason = i;
            }
          });
        }
        switch (e.status) {
          case "fulfilled":
            return e.value;
          case "rejected":
            throw t = e.reason, U0(t), t;
        }
        throw Xa = e, Ts;
    }
  }
  function Va(t) {
    try {
      var e = t._init;
      return e(t._payload);
    } catch (n) {
      throw n !== null && typeof n == "object" && typeof n.then == "function" ? (Xa = n, Ts) : n;
    }
  }
  var Xa = null;
  function z0() {
    if (Xa === null) throw Error(j(459));
    var t = Xa;
    return Xa = null, t;
  }
  function U0(t) {
    if (t === Ts || t === zc) throw Error(j(483));
  }
  var Fr = null, Ll = 0;
  function qo(t) {
    var e = Ll;
    return Ll += 1, Fr === null && (Fr = []), S1(Fr, t, e);
  }
  function ks(t, e) {
    e = e.props.ref, t.ref = e !== void 0 ? e : null;
  }
  function Ko(t, e) {
    throw e.$$typeof === LA ? Error(j(525)) : (t = Object.prototype.toString.call(e), Error(j(31, t === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : t)));
  }
  function T1(t) {
    function e(v, g) {
      if (t) {
        var S = v.deletions;
        S === null ? (v.deletions = [
          g
        ], v.flags |= 16) : S.push(g);
      }
    }
    function n(v, g) {
      if (!t) return null;
      for (; g !== null; ) e(v, g), g = g.sibling;
      return null;
    }
    function i(v) {
      for (var g = /* @__PURE__ */ new Map(); v !== null; ) v.key !== null ? g.set(v.key, v) : g.set(v.index, v), v = v.sibling;
      return g;
    }
    function a(v, g) {
      return v = vi(v, g), v.index = 0, v.sibling = null, v;
    }
    function r(v, g, S) {
      return v.index = S, t ? (S = v.alternate, S !== null ? (S = S.index, S < g ? (v.flags |= 67108866, g) : S) : (v.flags |= 67108866, g)) : (v.flags |= 1048576, g);
    }
    function s(v) {
      return t && v.alternate === null && (v.flags |= 67108866), v;
    }
    function l(v, g, S, A) {
      return g === null || g.tag !== 6 ? (g = zf(S, v.mode, A), g.return = v, g) : (g = a(g, S), g.return = v, g);
    }
    function o(v, g, S, A) {
      var w = S.type;
      return w === Tr ? f(v, g, S.props.children, A, S.key) : g !== null && (g.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Bi && Va(w) === g.type) ? (g = a(g, S.props), ks(g, S), g.return = v, g) : (g = fu(S.type, S.key, S.props, null, v.mode, A), ks(g, S), g.return = v, g);
    }
    function c(v, g, S, A) {
      return g === null || g.tag !== 4 || g.stateNode.containerInfo !== S.containerInfo || g.stateNode.implementation !== S.implementation ? (g = Uf(S, v.mode, A), g.return = v, g) : (g = a(g, S.children || []), g.return = v, g);
    }
    function f(v, g, S, A, w) {
      return g === null || g.tag !== 7 ? (g = Pa(S, v.mode, A, w), g.return = v, g) : (g = a(g, S), g.return = v, g);
    }
    function d(v, g, S) {
      if (typeof g == "string" && g !== "" || typeof g == "number" || typeof g == "bigint") return g = zf("" + g, v.mode, S), g.return = v, g;
      if (typeof g == "object" && g !== null) {
        switch (g.$$typeof) {
          case Ho:
            return S = fu(g.type, g.key, g.props, null, v.mode, S), ks(S, g), S.return = v, S;
          case Js:
            return g = Uf(g, v.mode, S), g.return = v, g;
          case Bi:
            return g = Va(g), d(v, g, S);
        }
        if ($s(g) || Ys(g)) return g = Pa(g, v.mode, S, null), g.return = v, g;
        if (typeof g.then == "function") return d(v, qo(g), S);
        if (g.$$typeof === pi) return d(v, Fo(v, g), S);
        Ko(v, g);
      }
      return null;
    }
    function m(v, g, S, A) {
      var w = g !== null ? g.key : null;
      if (typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint") return w !== null ? null : l(v, g, "" + S, A);
      if (typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case Ho:
            return S.key === w ? o(v, g, S, A) : null;
          case Js:
            return S.key === w ? c(v, g, S, A) : null;
          case Bi:
            return S = Va(S), m(v, g, S, A);
        }
        if ($s(S) || Ys(S)) return w !== null ? null : f(v, g, S, A, null);
        if (typeof S.then == "function") return m(v, g, qo(S), A);
        if (S.$$typeof === pi) return m(v, g, Fo(v, S), A);
        Ko(v, S);
      }
      return null;
    }
    function y(v, g, S, A, w) {
      if (typeof A == "string" && A !== "" || typeof A == "number" || typeof A == "bigint") return v = v.get(S) || null, l(g, v, "" + A, w);
      if (typeof A == "object" && A !== null) {
        switch (A.$$typeof) {
          case Ho:
            return v = v.get(A.key === null ? S : A.key) || null, o(g, v, A, w);
          case Js:
            return v = v.get(A.key === null ? S : A.key) || null, c(g, v, A, w);
          case Bi:
            return A = Va(A), y(v, g, S, A, w);
        }
        if ($s(A) || Ys(A)) return v = v.get(S) || null, f(g, v, A, w, null);
        if (typeof A.then == "function") return y(v, g, S, qo(A), w);
        if (A.$$typeof === pi) return y(v, g, S, Fo(g, A), w);
        Ko(g, A);
      }
      return null;
    }
    function T(v, g, S, A) {
      for (var w = null, V = null, z = g, O = g = 0, U = null; z !== null && O < S.length; O++) {
        z.index > O ? (U = z, z = null) : U = z.sibling;
        var B = m(v, z, S[O], A);
        if (B === null) {
          z === null && (z = U);
          break;
        }
        t && z && B.alternate === null && e(v, z), g = r(B, g, O), V === null ? w = B : V.sibling = B, V = B, z = U;
      }
      if (O === S.length) return n(v, z), ut && hi(v, O), w;
      if (z === null) {
        for (; O < S.length; O++) z = d(v, S[O], A), z !== null && (g = r(z, g, O), V === null ? w = z : V.sibling = z, V = z);
        return ut && hi(v, O), w;
      }
      for (z = i(z); O < S.length; O++) U = y(z, v, O, S[O], A), U !== null && (t && U.alternate !== null && z.delete(U.key === null ? O : U.key), g = r(U, g, O), V === null ? w = U : V.sibling = U, V = U);
      return t && z.forEach(function(Y) {
        return e(v, Y);
      }), ut && hi(v, O), w;
    }
    function b(v, g, S, A) {
      if (S == null) throw Error(j(151));
      for (var w = null, V = null, z = g, O = g = 0, U = null, B = S.next(); z !== null && !B.done; O++, B = S.next()) {
        z.index > O ? (U = z, z = null) : U = z.sibling;
        var Y = m(v, z, B.value, A);
        if (Y === null) {
          z === null && (z = U);
          break;
        }
        t && z && Y.alternate === null && e(v, z), g = r(Y, g, O), V === null ? w = Y : V.sibling = Y, V = Y, z = U;
      }
      if (B.done) return n(v, z), ut && hi(v, O), w;
      if (z === null) {
        for (; !B.done; O++, B = S.next()) B = d(v, B.value, A), B !== null && (g = r(B, g, O), V === null ? w = B : V.sibling = B, V = B);
        return ut && hi(v, O), w;
      }
      for (z = i(z); !B.done; O++, B = S.next()) B = y(z, v, O, B.value, A), B !== null && (t && B.alternate !== null && z.delete(B.key === null ? O : B.key), g = r(B, g, O), V === null ? w = B : V.sibling = B, V = B);
      return t && z.forEach(function(q) {
        return e(v, q);
      }), ut && hi(v, O), w;
    }
    function x(v, g, S, A) {
      if (typeof S == "object" && S !== null && S.type === Tr && S.key === null && (S = S.props.children), typeof S == "object" && S !== null) {
        switch (S.$$typeof) {
          case Ho:
            t: {
              for (var w = S.key; g !== null; ) {
                if (g.key === w) {
                  if (w = S.type, w === Tr) {
                    if (g.tag === 7) {
                      n(v, g.sibling), A = a(g, S.props.children), A.return = v, v = A;
                      break t;
                    }
                  } else if (g.elementType === w || typeof w == "object" && w !== null && w.$$typeof === Bi && Va(w) === g.type) {
                    n(v, g.sibling), A = a(g, S.props), ks(A, S), A.return = v, v = A;
                    break t;
                  }
                  n(v, g);
                  break;
                } else e(v, g);
                g = g.sibling;
              }
              S.type === Tr ? (A = Pa(S.props.children, v.mode, A, S.key), A.return = v, v = A) : (A = fu(S.type, S.key, S.props, null, v.mode, A), ks(A, S), A.return = v, v = A);
            }
            return s(v);
          case Js:
            t: {
              for (w = S.key; g !== null; ) {
                if (g.key === w) if (g.tag === 4 && g.stateNode.containerInfo === S.containerInfo && g.stateNode.implementation === S.implementation) {
                  n(v, g.sibling), A = a(g, S.children || []), A.return = v, v = A;
                  break t;
                } else {
                  n(v, g);
                  break;
                }
                else e(v, g);
                g = g.sibling;
              }
              A = Uf(S, v.mode, A), A.return = v, v = A;
            }
            return s(v);
          case Bi:
            return S = Va(S), x(v, g, S, A);
        }
        if ($s(S)) return T(v, g, S, A);
        if (Ys(S)) {
          if (w = Ys(S), typeof w != "function") throw Error(j(150));
          return S = w.call(S), b(v, g, S, A);
        }
        if (typeof S.then == "function") return x(v, g, qo(S), A);
        if (S.$$typeof === pi) return x(v, g, Fo(v, S), A);
        Ko(v, S);
      }
      return typeof S == "string" && S !== "" || typeof S == "number" || typeof S == "bigint" ? (S = "" + S, g !== null && g.tag === 6 ? (n(v, g.sibling), A = a(g, S), A.return = v, v = A) : (n(v, g), A = zf(S, v.mode, A), A.return = v, v = A), s(v)) : n(v, g);
    }
    return function(v, g, S, A) {
      try {
        Ll = 0;
        var w = x(v, g, S, A);
        return Fr = null, w;
      } catch (z) {
        if (z === Ts || z === zc) throw z;
        var V = tn(29, z, null, v.mode);
        return V.lanes = A, V.return = v, V;
      } finally {
      }
    };
  }
  var er = T1(true), x1 = T1(false), Hi = false;
  function Um(t) {
    t.updateQueue = {
      baseState: t.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: {
        pending: null,
        lanes: 0,
        hiddenCallbacks: null
      },
      callbacks: null
    };
  }
  function $h(t, e) {
    t = t.updateQueue, e.updateQueue === t && (e.updateQueue = {
      baseState: t.baseState,
      firstBaseUpdate: t.firstBaseUpdate,
      lastBaseUpdate: t.lastBaseUpdate,
      shared: t.shared,
      callbacks: null
    });
  }
  function ea(t) {
    return {
      lane: t,
      tag: 0,
      payload: null,
      callback: null,
      next: null
    };
  }
  function na(t, e, n) {
    var i = t.updateQueue;
    if (i === null) return null;
    if (i = i.shared, dt & 2) {
      var a = i.pending;
      return a === null ? e.next = e : (e.next = a.next, a.next = e), i.pending = e, e = Hu(t), m1(t, null, n), e;
    }
    return Oc(t, i, e, n), Hu(t);
  }
  function ul(t, e, n) {
    if (e = e.updateQueue, e !== null && (e = e.shared, (n & 4194048) !== 0)) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, G_(t, n);
    }
  }
  function Lf(t, e) {
    var n = t.updateQueue, i = t.alternate;
    if (i !== null && (i = i.updateQueue, n === i)) {
      var a = null, r = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var s = {
            lane: n.lane,
            tag: n.tag,
            payload: n.payload,
            callback: null,
            next: null
          };
          r === null ? a = r = s : r = r.next = s, n = n.next;
        } while (n !== null);
        r === null ? a = r = e : r = r.next = e;
      } else a = r = e;
      n = {
        baseState: i.baseState,
        firstBaseUpdate: a,
        lastBaseUpdate: r,
        shared: i.shared,
        callbacks: i.callbacks
      }, t.updateQueue = n;
      return;
    }
    t = n.lastBaseUpdate, t === null ? n.firstBaseUpdate = e : t.next = e, n.lastBaseUpdate = e;
  }
  var Wh = false;
  function cl() {
    if (Wh) {
      var t = Xr;
      if (t !== null) throw t;
    }
  }
  function fl(t, e, n, i) {
    Wh = false;
    var a = t.updateQueue;
    Hi = false;
    var r = a.firstBaseUpdate, s = a.lastBaseUpdate, l = a.shared.pending;
    if (l !== null) {
      a.shared.pending = null;
      var o = l, c = o.next;
      o.next = null, s === null ? r = c : s.next = c, s = o;
      var f = t.alternate;
      f !== null && (f = f.updateQueue, l = f.lastBaseUpdate, l !== s && (l === null ? f.firstBaseUpdate = c : l.next = c, f.lastBaseUpdate = o));
    }
    if (r !== null) {
      var d = a.baseState;
      s = 0, f = c = o = null, l = r;
      do {
        var m = l.lane & -536870913, y = m !== l.lane;
        if (y ? (ot & m) === m : (i & m) === m) {
          m !== 0 && m === es && (Wh = true), f !== null && (f = f.next = {
            lane: 0,
            tag: l.tag,
            payload: l.payload,
            callback: null,
            next: null
          });
          t: {
            var T = t, b = l;
            m = e;
            var x = n;
            switch (b.tag) {
              case 1:
                if (T = b.payload, typeof T == "function") {
                  d = T.call(x, d, m);
                  break t;
                }
                d = T;
                break t;
              case 3:
                T.flags = T.flags & -65537 | 128;
              case 0:
                if (T = b.payload, m = typeof T == "function" ? T.call(x, d, m) : T, m == null) break t;
                d = zt({}, d, m);
                break t;
              case 2:
                Hi = true;
            }
          }
          m = l.callback, m !== null && (t.flags |= 64, y && (t.flags |= 8192), y = a.callbacks, y === null ? a.callbacks = [
            m
          ] : y.push(m));
        } else y = {
          lane: m,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null
        }, f === null ? (c = f = y, o = d) : f = f.next = y, s |= m;
        if (l = l.next, l === null) {
          if (l = a.shared.pending, l === null) break;
          y = l, l = y.next, y.next = null, a.lastBaseUpdate = y, a.shared.pending = null;
        }
      } while (true);
      f === null && (o = d), a.baseState = o, a.firstBaseUpdate = c, a.lastBaseUpdate = f, r === null && (a.shared.lanes = 0), da |= s, t.lanes = s, t.memoizedState = d;
    }
  }
  function A1(t, e) {
    if (typeof t != "function") throw Error(j(191, t));
    t.call(e);
  }
  function E1(t, e) {
    var n = t.callbacks;
    if (n !== null) for (t.callbacks = null, t = 0; t < n.length; t++) A1(n[t], e);
  }
  var ns = ei(null), ku = ei(0);
  function V0(t, e) {
    t = wi, Et(ku, t), Et(ns, e), wi = t | e.baseLanes;
  }
  function Ih() {
    Et(ku, wi), Et(ns, ns.current);
  }
  function Vm() {
    wi = ku.current, de(ns), de(ku);
  }
  var fn = ei(null), Rn = null;
  function Gi(t) {
    var e = t.alternate;
    Et(Wt, Wt.current & 1), Et(fn, t), Rn === null && (e === null || ns.current !== null || e.memoizedState !== null) && (Rn = t);
  }
  function td(t) {
    Et(Wt, Wt.current), Et(fn, t), Rn === null && (Rn = t);
  }
  function w1(t) {
    t.tag === 22 ? (Et(Wt, Wt.current), Et(fn, t), Rn === null && (Rn = t)) : Pi();
  }
  function Pi() {
    Et(Wt, Wt.current), Et(fn, fn.current);
  }
  function Ie(t) {
    de(fn), Rn === t && (Rn = null), de(Wt);
  }
  var Wt = ei(0);
  function Xu(t) {
    for (var e = t; e !== null; ) {
      if (e.tag === 13) {
        var n = e.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || _d(n) || bd(n))) return e;
      } else if (e.tag === 19 && (e.memoizedProps.revealOrder === "forwards" || e.memoizedProps.revealOrder === "backwards" || e.memoizedProps.revealOrder === "unstable_legacy-backwards" || e.memoizedProps.revealOrder === "together")) {
        if (e.flags & 128) return e;
      } else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === t) break;
      for (; e.sibling === null; ) {
        if (e.return === null || e.return === t) return null;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    return null;
  }
  var xi = 0, at = null, bt = null, ie = null, Fu = false, qr = false, nr = false, qu = 0, Nl = 0, Kr = null, JE = 0;
  function kt() {
    throw Error(j(321));
  }
  function Lm(t, e) {
    if (e === null) return false;
    for (var n = 0; n < e.length && n < t.length; n++) if (!cn(t[n], e[n])) return false;
    return true;
  }
  function Nm(t, e, n, i, a, r) {
    return xi = r, at = e, e.memoizedState = null, e.updateQueue = null, e.lanes = 0, et.H = t === null || t.memoizedState === null ? ib : Km, nr = false, r = n(i, a), nr = false, qr && (r = C1(e, n, i, a)), M1(t), r;
  }
  function M1(t) {
    et.H = jl;
    var e = bt !== null && bt.next !== null;
    if (xi = 0, ie = bt = at = null, Fu = false, Nl = 0, Kr = null, e) throw Error(j(300));
    t === null || oe || (t = t.dependencies, t !== null && Gu(t) && (oe = true));
  }
  function C1(t, e, n, i) {
    at = t;
    var a = 0;
    do {
      if (qr && (Kr = null), Nl = 0, qr = false, 25 <= a) throw Error(j(301));
      if (a += 1, ie = bt = null, t.updateQueue != null) {
        var r = t.updateQueue;
        r.lastEffect = null, r.events = null, r.stores = null, r.memoCache != null && (r.memoCache.index = 0);
      }
      et.H = ab, r = e(n, i);
    } while (qr);
    return r;
  }
  function $E() {
    var t = et.H, e = t.useState()[0];
    return e = typeof e.then == "function" ? fo(e) : e, t = t.useState()[0], (bt !== null ? bt.memoizedState : null) !== t && (at.flags |= 1024), e;
  }
  function jm() {
    var t = qu !== 0;
    return qu = 0, t;
  }
  function Bm(t, e, n) {
    e.updateQueue = t.updateQueue, e.flags &= -2053, t.lanes &= ~n;
  }
  function Hm(t) {
    if (Fu) {
      for (t = t.memoizedState; t !== null; ) {
        var e = t.queue;
        e !== null && (e.pending = null), t = t.next;
      }
      Fu = false;
    }
    xi = 0, ie = bt = at = null, qr = false, Nl = qu = 0, Kr = null;
  }
  function Oe() {
    var t = {
      memoizedState: null,
      baseState: null,
      baseQueue: null,
      queue: null,
      next: null
    };
    return ie === null ? at.memoizedState = ie = t : ie = ie.next = t, ie;
  }
  function It() {
    if (bt === null) {
      var t = at.alternate;
      t = t !== null ? t.memoizedState : null;
    } else t = bt.next;
    var e = ie === null ? at.memoizedState : ie.next;
    if (e !== null) ie = e, bt = t;
    else {
      if (t === null) throw at.alternate === null ? Error(j(467)) : Error(j(310));
      bt = t, t = {
        memoizedState: bt.memoizedState,
        baseState: bt.baseState,
        baseQueue: bt.baseQueue,
        queue: bt.queue,
        next: null
      }, ie === null ? at.memoizedState = ie = t : ie = ie.next = t;
    }
    return ie;
  }
  function Uc() {
    return {
      lastEffect: null,
      events: null,
      stores: null,
      memoCache: null
    };
  }
  function fo(t) {
    var e = Nl;
    return Nl += 1, Kr === null && (Kr = []), t = S1(Kr, t, e), e = at, (ie === null ? e.memoizedState : ie.next) === null && (e = e.alternate, et.H = e === null || e.memoizedState === null ? ib : Km), t;
  }
  function Vc(t) {
    if (t !== null && typeof t == "object") {
      if (typeof t.then == "function") return fo(t);
      if (t.$$typeof === pi) return Te(t);
    }
    throw Error(j(438, String(t)));
  }
  function Ym(t) {
    var e = null, n = at.updateQueue;
    if (n !== null && (e = n.memoCache), e == null) {
      var i = at.alternate;
      i !== null && (i = i.updateQueue, i !== null && (i = i.memoCache, i != null && (e = {
        data: i.data.map(function(a) {
          return a.slice();
        }),
        index: 0
      })));
    }
    if (e == null && (e = {
      data: [],
      index: 0
    }), n === null && (n = Uc(), at.updateQueue = n), n.memoCache = e, n = e.data[e.index], n === void 0) for (n = e.data[e.index] = Array(t), i = 0; i < t; i++) n[i] = NA;
    return e.index++, n;
  }
  function Ai(t, e) {
    return typeof e == "function" ? e(t) : e;
  }
  function du(t) {
    var e = It();
    return Gm(e, bt, t);
  }
  function Gm(t, e, n) {
    var i = t.queue;
    if (i === null) throw Error(j(311));
    i.lastRenderedReducer = n;
    var a = t.baseQueue, r = i.pending;
    if (r !== null) {
      if (a !== null) {
        var s = a.next;
        a.next = r.next, r.next = s;
      }
      e.baseQueue = a = r, i.pending = null;
    }
    if (r = t.baseState, a === null) t.memoizedState = r;
    else {
      e = a.next;
      var l = s = null, o = null, c = e, f = false;
      do {
        var d = c.lane & -536870913;
        if (d !== c.lane ? (ot & d) === d : (xi & d) === d) {
          var m = c.revertLane;
          if (m === 0) o !== null && (o = o.next = {
            lane: 0,
            revertLane: 0,
            gesture: null,
            action: c.action,
            hasEagerState: c.hasEagerState,
            eagerState: c.eagerState,
            next: null
          }), d === es && (f = true);
          else if ((xi & m) === m) {
            c = c.next, m === es && (f = true);
            continue;
          } else d = {
            lane: 0,
            revertLane: c.revertLane,
            gesture: null,
            action: c.action,
            hasEagerState: c.hasEagerState,
            eagerState: c.eagerState,
            next: null
          }, o === null ? (l = o = d, s = r) : o = o.next = d, at.lanes |= m, da |= m;
          d = c.action, nr && n(r, d), r = c.hasEagerState ? c.eagerState : n(r, d);
        } else m = {
          lane: d,
          revertLane: c.revertLane,
          gesture: c.gesture,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null
        }, o === null ? (l = o = m, s = r) : o = o.next = m, at.lanes |= d, da |= d;
        c = c.next;
      } while (c !== null && c !== e);
      if (o === null ? s = r : o.next = l, !cn(r, t.memoizedState) && (oe = true, f && (n = Xr, n !== null))) throw n;
      t.memoizedState = r, t.baseState = s, t.baseQueue = o, i.lastRenderedState = r;
    }
    return a === null && (i.lanes = 0), [
      t.memoizedState,
      i.dispatch
    ];
  }
  function Nf(t) {
    var e = It(), n = e.queue;
    if (n === null) throw Error(j(311));
    n.lastRenderedReducer = t;
    var i = n.dispatch, a = n.pending, r = e.memoizedState;
    if (a !== null) {
      n.pending = null;
      var s = a = a.next;
      do
        r = t(r, s.action), s = s.next;
      while (s !== a);
      cn(r, e.memoizedState) || (oe = true), e.memoizedState = r, e.baseQueue === null && (e.baseState = r), n.lastRenderedState = r;
    }
    return [
      r,
      i
    ];
  }
  function D1(t, e, n) {
    var i = at, a = It(), r = ut;
    if (r) {
      if (n === void 0) throw Error(j(407));
      n = n();
    } else n = e();
    var s = !cn((bt || a).memoizedState, n);
    if (s && (a.memoizedState = n, oe = true), a = a.queue, Pm(z1.bind(null, i, a, t), [
      t
    ]), a.getSnapshot !== e || s || ie !== null && ie.memoizedState.tag & 1) {
      if (i.flags |= 2048, is(9, {
        destroy: void 0
      }, O1.bind(null, i, a, n, e), null), xt === null) throw Error(j(349));
      r || xi & 127 || R1(i, e, n);
    }
    return n;
  }
  function R1(t, e, n) {
    t.flags |= 16384, t = {
      getSnapshot: e,
      value: n
    }, e = at.updateQueue, e === null ? (e = Uc(), at.updateQueue = e, e.stores = [
      t
    ]) : (n = e.stores, n === null ? e.stores = [
      t
    ] : n.push(t));
  }
  function O1(t, e, n, i) {
    e.value = n, e.getSnapshot = i, U1(e) && V1(t);
  }
  function z1(t, e, n) {
    return n(function() {
      U1(e) && V1(t);
    });
  }
  function U1(t) {
    var e = t.getSnapshot;
    t = t.value;
    try {
      var n = e();
      return !cn(t, n);
    } catch {
      return true;
    }
  }
  function V1(t) {
    var e = or(t, 2);
    e !== null && ke(e, t, 2);
  }
  function ed(t) {
    var e = Oe();
    if (typeof t == "function") {
      var n = t;
      if (t = n(), nr) {
        Xi(true);
        try {
          n();
        } finally {
          Xi(false);
        }
      }
    }
    return e.memoizedState = e.baseState = t, e.queue = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ai,
      lastRenderedState: t
    }, e;
  }
  function L1(t, e, n, i) {
    return t.baseState = n, Gm(t, bt, typeof i == "function" ? i : Ai);
  }
  function WE(t, e, n, i, a) {
    if (Nc(t)) throw Error(j(485));
    if (t = e.action, t !== null) {
      var r = {
        payload: a,
        action: t,
        next: null,
        isTransition: true,
        status: "pending",
        value: null,
        reason: null,
        listeners: [],
        then: function(s) {
          r.listeners.push(s);
        }
      };
      et.T !== null ? n(true) : r.isTransition = false, i(r), n = e.pending, n === null ? (r.next = e.pending = r, N1(e, r)) : (r.next = n.next, e.pending = n.next = r);
    }
  }
  function N1(t, e) {
    var n = e.action, i = e.payload, a = t.state;
    if (e.isTransition) {
      var r = et.T, s = {};
      et.T = s;
      try {
        var l = n(a, i), o = et.S;
        o !== null && o(s, l), L0(t, e, l);
      } catch (c) {
        nd(t, e, c);
      } finally {
        r !== null && s.types !== null && (r.types = s.types), et.T = r;
      }
    } else try {
      r = n(a, i), L0(t, e, r);
    } catch (c) {
      nd(t, e, c);
    }
  }
  function L0(t, e, n) {
    n !== null && typeof n == "object" && typeof n.then == "function" ? n.then(function(i) {
      N0(t, e, i);
    }, function(i) {
      return nd(t, e, i);
    }) : N0(t, e, n);
  }
  function N0(t, e, n) {
    e.status = "fulfilled", e.value = n, j1(e), t.state = n, e = t.pending, e !== null && (n = e.next, n === e ? t.pending = null : (n = n.next, e.next = n, N1(t, n)));
  }
  function nd(t, e, n) {
    var i = t.pending;
    if (t.pending = null, i !== null) {
      i = i.next;
      do
        e.status = "rejected", e.reason = n, j1(e), e = e.next;
      while (e !== i);
    }
    t.action = null;
  }
  function j1(t) {
    t = t.listeners;
    for (var e = 0; e < t.length; e++) (0, t[e])();
  }
  function B1(t, e) {
    return e;
  }
  function j0(t, e) {
    if (ut) {
      var n = xt.formState;
      if (n !== null) {
        t: {
          var i = at;
          if (ut) {
            if (Rt) {
              e: {
                for (var a = Rt, r = En; a.nodeType !== 8; ) {
                  if (!r) {
                    a = null;
                    break e;
                  }
                  if (a = On(a.nextSibling), a === null) {
                    a = null;
                    break e;
                  }
                }
                r = a.data, a = r === "F!" || r === "F" ? a : null;
              }
              if (a) {
                Rt = On(a.nextSibling), i = a.data === "F!";
                break t;
              }
            }
            fa(i);
          }
          i = false;
        }
        i && (e = n[0]);
      }
    }
    return n = Oe(), n.memoizedState = n.baseState = e, i = {
      pending: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: B1,
      lastRenderedState: e
    }, n.queue = i, n = tb.bind(null, at, i), i.dispatch = n, i = ed(false), r = qm.bind(null, at, false, i.queue), i = Oe(), a = {
      state: e,
      dispatch: null,
      action: t,
      pending: null
    }, i.queue = a, n = WE.bind(null, at, a, r, n), a.dispatch = n, i.memoizedState = t, [
      e,
      n,
      false
    ];
  }
  function B0(t) {
    var e = It();
    return H1(e, bt, t);
  }
  function H1(t, e, n) {
    if (e = Gm(t, e, B1)[0], t = du(Ai)[0], typeof e == "object" && e !== null && typeof e.then == "function") try {
      var i = fo(e);
    } catch (s) {
      throw s === Ts ? zc : s;
    }
    else i = e;
    e = It();
    var a = e.queue, r = a.dispatch;
    return n !== e.memoizedState && (at.flags |= 2048, is(9, {
      destroy: void 0
    }, IE.bind(null, a, n), null)), [
      i,
      r,
      t
    ];
  }
  function IE(t, e) {
    t.action = e;
  }
  function H0(t) {
    var e = It(), n = bt;
    if (n !== null) return H1(e, n, t);
    It(), e = e.memoizedState, n = It();
    var i = n.queue.dispatch;
    return n.memoizedState = t, [
      e,
      i,
      false
    ];
  }
  function is(t, e, n, i) {
    return t = {
      tag: t,
      create: n,
      deps: i,
      inst: e,
      next: null
    }, e = at.updateQueue, e === null && (e = Uc(), at.updateQueue = e), n = e.lastEffect, n === null ? e.lastEffect = t.next = t : (i = n.next, n.next = t, t.next = i, e.lastEffect = t), t;
  }
  function Y1() {
    return It().memoizedState;
  }
  function mu(t, e, n, i) {
    var a = Oe();
    at.flags |= t, a.memoizedState = is(1 | e, {
      destroy: void 0
    }, n, i === void 0 ? null : i);
  }
  function Lc(t, e, n, i) {
    var a = It();
    i = i === void 0 ? null : i;
    var r = a.memoizedState.inst;
    bt !== null && i !== null && Lm(i, bt.memoizedState.deps) ? a.memoizedState = is(e, r, n, i) : (at.flags |= t, a.memoizedState = is(1 | e, r, n, i));
  }
  function Y0(t, e) {
    mu(8390656, 8, t, e);
  }
  function Pm(t, e) {
    Lc(2048, 8, t, e);
  }
  function tw(t) {
    at.flags |= 4;
    var e = at.updateQueue;
    if (e === null) e = Uc(), at.updateQueue = e, e.events = [
      t
    ];
    else {
      var n = e.events;
      n === null ? e.events = [
        t
      ] : n.push(t);
    }
  }
  function G1(t) {
    var e = It().memoizedState;
    return tw({
      ref: e,
      nextImpl: t
    }), function() {
      if (dt & 2) throw Error(j(440));
      return e.impl.apply(void 0, arguments);
    };
  }
  function P1(t, e) {
    return Lc(4, 2, t, e);
  }
  function k1(t, e) {
    return Lc(4, 4, t, e);
  }
  function X1(t, e) {
    if (typeof e == "function") {
      t = t();
      var n = e(t);
      return function() {
        typeof n == "function" ? n() : e(null);
      };
    }
    if (e != null) return t = t(), e.current = t, function() {
      e.current = null;
    };
  }
  function F1(t, e, n) {
    n = n != null ? n.concat([
      t
    ]) : null, Lc(4, 4, X1.bind(null, e, t), n);
  }
  function km() {
  }
  function q1(t, e) {
    var n = It();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    return e !== null && Lm(e, i[1]) ? i[0] : (n.memoizedState = [
      t,
      e
    ], t);
  }
  function K1(t, e) {
    var n = It();
    e = e === void 0 ? null : e;
    var i = n.memoizedState;
    if (e !== null && Lm(e, i[1])) return i[0];
    if (i = t(), nr) {
      Xi(true);
      try {
        t();
      } finally {
        Xi(false);
      }
    }
    return n.memoizedState = [
      i,
      e
    ], i;
  }
  function Xm(t, e, n) {
    return n === void 0 || xi & 1073741824 && !(ot & 261930) ? t.memoizedState = e : (t.memoizedState = n, t = Lb(), at.lanes |= t, da |= t, n);
  }
  function Q1(t, e, n, i) {
    return cn(n, e) ? n : ns.current !== null ? (t = Xm(t, n, i), cn(t, e) || (oe = true), t) : !(xi & 42) || xi & 1073741824 && !(ot & 261930) ? (oe = true, t.memoizedState = n) : (t = Lb(), at.lanes |= t, da |= t, e);
  }
  function Z1(t, e, n, i, a) {
    var r = mt.p;
    mt.p = r !== 0 && 8 > r ? r : 8;
    var s = et.T, l = {};
    et.T = l, qm(t, false, e, n);
    try {
      var o = a(), c = et.S;
      if (c !== null && c(l, o), o !== null && typeof o == "object" && typeof o.then == "function") {
        var f = ZE(o, i);
        hl(t, e, f, on(t));
      } else hl(t, e, i, on(t));
    } catch (d) {
      hl(t, e, {
        then: function() {
        },
        status: "rejected",
        reason: d
      }, on());
    } finally {
      mt.p = r, s !== null && l.types !== null && (s.types = l.types), et.T = s;
    }
  }
  function ew() {
  }
  function id(t, e, n, i) {
    if (t.tag !== 5) throw Error(j(476));
    var a = J1(t).queue;
    Z1(t, a, e, Ga, n === null ? ew : function() {
      return $1(t), n(i);
    });
  }
  function J1(t) {
    var e = t.memoizedState;
    if (e !== null) return e;
    e = {
      memoizedState: Ga,
      baseState: Ga,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ai,
        lastRenderedState: Ga
      },
      next: null
    };
    var n = {};
    return e.next = {
      memoizedState: n,
      baseState: n,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: Ai,
        lastRenderedState: n
      },
      next: null
    }, t.memoizedState = e, t = t.alternate, t !== null && (t.memoizedState = e), e;
  }
  function $1(t) {
    var e = J1(t);
    e.next === null && (e = t.alternate.memoizedState), hl(t, e.next.queue, {}, on());
  }
  function Fm() {
    return Te(Yl);
  }
  function W1() {
    return It().memoizedState;
  }
  function I1() {
    return It().memoizedState;
  }
  function nw(t) {
    for (var e = t.return; e !== null; ) {
      switch (e.tag) {
        case 24:
        case 3:
          var n = on();
          t = ea(n);
          var i = na(e, t, n);
          i !== null && (ke(i, e, n), ul(i, e, n)), e = {
            cache: Rm()
          }, t.payload = e;
          return;
      }
      e = e.return;
    }
  }
  function iw(t, e, n) {
    var i = on();
    n = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: false,
      eagerState: null,
      next: null
    }, Nc(t) ? eb(e, n) : (n = wm(t, e, n, i), n !== null && (ke(n, t, i), nb(n, e, i)));
  }
  function tb(t, e, n) {
    var i = on();
    hl(t, e, n, i);
  }
  function hl(t, e, n, i) {
    var a = {
      lane: i,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: false,
      eagerState: null,
      next: null
    };
    if (Nc(t)) eb(e, a);
    else {
      var r = t.alternate;
      if (t.lanes === 0 && (r === null || r.lanes === 0) && (r = e.lastRenderedReducer, r !== null)) try {
        var s = e.lastRenderedState, l = r(s, n);
        if (a.hasEagerState = true, a.eagerState = l, cn(l, s)) return Oc(t, e, a, 0), xt === null && Rc(), false;
      } catch {
      } finally {
      }
      if (n = wm(t, e, a, i), n !== null) return ke(n, t, i), nb(n, e, i), true;
    }
    return false;
  }
  function qm(t, e, n, i) {
    if (i = {
      lane: 2,
      revertLane: ep(),
      gesture: null,
      action: i,
      hasEagerState: false,
      eagerState: null,
      next: null
    }, Nc(t)) {
      if (e) throw Error(j(479));
    } else e = wm(t, n, i, 2), e !== null && ke(e, t, 2);
  }
  function Nc(t) {
    var e = t.alternate;
    return t === at || e !== null && e === at;
  }
  function eb(t, e) {
    qr = Fu = true;
    var n = t.pending;
    n === null ? e.next = e : (e.next = n.next, n.next = e), t.pending = e;
  }
  function nb(t, e, n) {
    if (n & 4194048) {
      var i = e.lanes;
      i &= t.pendingLanes, n |= i, e.lanes = n, G_(t, n);
    }
  }
  var jl = {
    readContext: Te,
    use: Vc,
    useCallback: kt,
    useContext: kt,
    useEffect: kt,
    useImperativeHandle: kt,
    useLayoutEffect: kt,
    useInsertionEffect: kt,
    useMemo: kt,
    useReducer: kt,
    useRef: kt,
    useState: kt,
    useDebugValue: kt,
    useDeferredValue: kt,
    useTransition: kt,
    useSyncExternalStore: kt,
    useId: kt,
    useHostTransitionStatus: kt,
    useFormState: kt,
    useActionState: kt,
    useOptimistic: kt,
    useMemoCache: kt,
    useCacheRefresh: kt
  };
  jl.useEffectEvent = kt;
  var ib = {
    readContext: Te,
    use: Vc,
    useCallback: function(t, e) {
      return Oe().memoizedState = [
        t,
        e === void 0 ? null : e
      ], t;
    },
    useContext: Te,
    useEffect: Y0,
    useImperativeHandle: function(t, e, n) {
      n = n != null ? n.concat([
        t
      ]) : null, mu(4194308, 4, X1.bind(null, e, t), n);
    },
    useLayoutEffect: function(t, e) {
      return mu(4194308, 4, t, e);
    },
    useInsertionEffect: function(t, e) {
      mu(4, 2, t, e);
    },
    useMemo: function(t, e) {
      var n = Oe();
      e = e === void 0 ? null : e;
      var i = t();
      if (nr) {
        Xi(true);
        try {
          t();
        } finally {
          Xi(false);
        }
      }
      return n.memoizedState = [
        i,
        e
      ], i;
    },
    useReducer: function(t, e, n) {
      var i = Oe();
      if (n !== void 0) {
        var a = n(e);
        if (nr) {
          Xi(true);
          try {
            n(e);
          } finally {
            Xi(false);
          }
        }
      } else a = e;
      return i.memoizedState = i.baseState = a, t = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: t,
        lastRenderedState: a
      }, i.queue = t, t = t.dispatch = iw.bind(null, at, t), [
        i.memoizedState,
        t
      ];
    },
    useRef: function(t) {
      var e = Oe();
      return t = {
        current: t
      }, e.memoizedState = t;
    },
    useState: function(t) {
      t = ed(t);
      var e = t.queue, n = tb.bind(null, at, e);
      return e.dispatch = n, [
        t.memoizedState,
        n
      ];
    },
    useDebugValue: km,
    useDeferredValue: function(t, e) {
      var n = Oe();
      return Xm(n, t, e);
    },
    useTransition: function() {
      var t = ed(false);
      return t = Z1.bind(null, at, t.queue, true, false), Oe().memoizedState = t, [
        false,
        t
      ];
    },
    useSyncExternalStore: function(t, e, n) {
      var i = at, a = Oe();
      if (ut) {
        if (n === void 0) throw Error(j(407));
        n = n();
      } else {
        if (n = e(), xt === null) throw Error(j(349));
        ot & 127 || R1(i, e, n);
      }
      a.memoizedState = n;
      var r = {
        value: n,
        getSnapshot: e
      };
      return a.queue = r, Y0(z1.bind(null, i, r, t), [
        t
      ]), i.flags |= 2048, is(9, {
        destroy: void 0
      }, O1.bind(null, i, r, n, e), null), n;
    },
    useId: function() {
      var t = Oe(), e = xt.identifierPrefix;
      if (ut) {
        var n = Qn, i = Kn;
        n = (i & ~(1 << 32 - ln(i) - 1)).toString(32) + n, e = "_" + e + "R_" + n, n = qu++, 0 < n && (e += "H" + n.toString(32)), e += "_";
      } else n = JE++, e = "_" + e + "r_" + n.toString(32) + "_";
      return t.memoizedState = e;
    },
    useHostTransitionStatus: Fm,
    useFormState: j0,
    useActionState: j0,
    useOptimistic: function(t) {
      var e = Oe();
      e.memoizedState = e.baseState = t;
      var n = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: null,
        lastRenderedState: null
      };
      return e.queue = n, e = qm.bind(null, at, true, n), n.dispatch = e, [
        t,
        e
      ];
    },
    useMemoCache: Ym,
    useCacheRefresh: function() {
      return Oe().memoizedState = nw.bind(null, at);
    },
    useEffectEvent: function(t) {
      var e = Oe(), n = {
        impl: t
      };
      return e.memoizedState = n, function() {
        if (dt & 2) throw Error(j(440));
        return n.impl.apply(void 0, arguments);
      };
    }
  }, Km = {
    readContext: Te,
    use: Vc,
    useCallback: q1,
    useContext: Te,
    useEffect: Pm,
    useImperativeHandle: F1,
    useInsertionEffect: P1,
    useLayoutEffect: k1,
    useMemo: K1,
    useReducer: du,
    useRef: Y1,
    useState: function() {
      return du(Ai);
    },
    useDebugValue: km,
    useDeferredValue: function(t, e) {
      var n = It();
      return Q1(n, bt.memoizedState, t, e);
    },
    useTransition: function() {
      var t = du(Ai)[0], e = It().memoizedState;
      return [
        typeof t == "boolean" ? t : fo(t),
        e
      ];
    },
    useSyncExternalStore: D1,
    useId: W1,
    useHostTransitionStatus: Fm,
    useFormState: B0,
    useActionState: B0,
    useOptimistic: function(t, e) {
      var n = It();
      return L1(n, bt, t, e);
    },
    useMemoCache: Ym,
    useCacheRefresh: I1
  };
  Km.useEffectEvent = G1;
  var ab = {
    readContext: Te,
    use: Vc,
    useCallback: q1,
    useContext: Te,
    useEffect: Pm,
    useImperativeHandle: F1,
    useInsertionEffect: P1,
    useLayoutEffect: k1,
    useMemo: K1,
    useReducer: Nf,
    useRef: Y1,
    useState: function() {
      return Nf(Ai);
    },
    useDebugValue: km,
    useDeferredValue: function(t, e) {
      var n = It();
      return bt === null ? Xm(n, t, e) : Q1(n, bt.memoizedState, t, e);
    },
    useTransition: function() {
      var t = Nf(Ai)[0], e = It().memoizedState;
      return [
        typeof t == "boolean" ? t : fo(t),
        e
      ];
    },
    useSyncExternalStore: D1,
    useId: W1,
    useHostTransitionStatus: Fm,
    useFormState: H0,
    useActionState: H0,
    useOptimistic: function(t, e) {
      var n = It();
      return bt !== null ? L1(n, bt, t, e) : (n.baseState = t, [
        t,
        n.queue.dispatch
      ]);
    },
    useMemoCache: Ym,
    useCacheRefresh: I1
  };
  ab.useEffectEvent = G1;
  function jf(t, e, n, i) {
    e = t.memoizedState, n = n(i, e), n = n == null ? e : zt({}, e, n), t.memoizedState = n, t.lanes === 0 && (t.updateQueue.baseState = n);
  }
  var ad = {
    enqueueSetState: function(t, e, n) {
      t = t._reactInternals;
      var i = on(), a = ea(i);
      a.payload = e, n != null && (a.callback = n), e = na(t, a, i), e !== null && (ke(e, t, i), ul(e, t, i));
    },
    enqueueReplaceState: function(t, e, n) {
      t = t._reactInternals;
      var i = on(), a = ea(i);
      a.tag = 1, a.payload = e, n != null && (a.callback = n), e = na(t, a, i), e !== null && (ke(e, t, i), ul(e, t, i));
    },
    enqueueForceUpdate: function(t, e) {
      t = t._reactInternals;
      var n = on(), i = ea(n);
      i.tag = 2, e != null && (i.callback = e), e = na(t, i, n), e !== null && (ke(e, t, n), ul(e, t, n));
    }
  };
  function G0(t, e, n, i, a, r, s) {
    return t = t.stateNode, typeof t.shouldComponentUpdate == "function" ? t.shouldComponentUpdate(i, r, s) : e.prototype && e.prototype.isPureReactComponent ? !zl(n, i) || !zl(a, r) : true;
  }
  function P0(t, e, n, i) {
    t = e.state, typeof e.componentWillReceiveProps == "function" && e.componentWillReceiveProps(n, i), typeof e.UNSAFE_componentWillReceiveProps == "function" && e.UNSAFE_componentWillReceiveProps(n, i), e.state !== t && ad.enqueueReplaceState(e, e.state, null);
  }
  function ir(t, e) {
    var n = e;
    if ("ref" in e) {
      n = {};
      for (var i in e) i !== "ref" && (n[i] = e[i]);
    }
    if (t = t.defaultProps) {
      n === e && (n = zt({}, n));
      for (var a in t) n[a] === void 0 && (n[a] = t[a]);
    }
    return n;
  }
  function rb(t) {
    Bu(t);
  }
  function sb(t) {
    console.error(t);
  }
  function lb(t) {
    Bu(t);
  }
  function Ku(t, e) {
    try {
      var n = t.onUncaughtError;
      n(e.value, {
        componentStack: e.stack
      });
    } catch (i) {
      setTimeout(function() {
        throw i;
      });
    }
  }
  function k0(t, e, n) {
    try {
      var i = t.onCaughtError;
      i(n.value, {
        componentStack: n.stack,
        errorBoundary: e.tag === 1 ? e.stateNode : null
      });
    } catch (a) {
      setTimeout(function() {
        throw a;
      });
    }
  }
  function rd(t, e, n) {
    return n = ea(n), n.tag = 3, n.payload = {
      element: null
    }, n.callback = function() {
      Ku(t, e);
    }, n;
  }
  function ob(t) {
    return t = ea(t), t.tag = 3, t;
  }
  function ub(t, e, n, i) {
    var a = n.type.getDerivedStateFromError;
    if (typeof a == "function") {
      var r = i.value;
      t.payload = function() {
        return a(r);
      }, t.callback = function() {
        k0(e, n, i);
      };
    }
    var s = n.stateNode;
    s !== null && typeof s.componentDidCatch == "function" && (t.callback = function() {
      k0(e, n, i), typeof a != "function" && (ia === null ? ia = /* @__PURE__ */ new Set([
        this
      ]) : ia.add(this));
      var l = i.stack;
      this.componentDidCatch(i.value, {
        componentStack: l !== null ? l : ""
      });
    });
  }
  function aw(t, e, n, i, a) {
    if (n.flags |= 32768, i !== null && typeof i == "object" && typeof i.then == "function") {
      if (e = n.alternate, e !== null && Ss(e, n, a, true), n = fn.current, n !== null) {
        switch (n.tag) {
          case 31:
          case 13:
            return Rn === null ? Wu() : n.alternate === null && Ft === 0 && (Ft = 3), n.flags &= -257, n.flags |= 65536, n.lanes = a, i === Pu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? n.updateQueue = /* @__PURE__ */ new Set([
              i
            ]) : e.add(i), Qf(t, i, a)), false;
          case 22:
            return n.flags |= 65536, i === Pu ? n.flags |= 16384 : (e = n.updateQueue, e === null ? (e = {
              transitions: null,
              markerInstances: null,
              retryQueue: /* @__PURE__ */ new Set([
                i
              ])
            }, n.updateQueue = e) : (n = e.retryQueue, n === null ? e.retryQueue = /* @__PURE__ */ new Set([
              i
            ]) : n.add(i)), Qf(t, i, a)), false;
        }
        throw Error(j(435, n.tag));
      }
      return Qf(t, i, a), Wu(), false;
    }
    if (ut) return e = fn.current, e !== null ? (!(e.flags & 65536) && (e.flags |= 256), e.flags |= 65536, e.lanes = a, i !== qh && (t = Error(j(422), {
      cause: i
    }), Vl(An(t, n)))) : (i !== qh && (e = Error(j(423), {
      cause: i
    }), Vl(An(e, n))), t = t.current.alternate, t.flags |= 65536, a &= -a, t.lanes |= a, i = An(i, n), a = rd(t.stateNode, i, a), Lf(t, a), Ft !== 4 && (Ft = 2)), false;
    var r = Error(j(520), {
      cause: i
    });
    if (r = An(r, n), pl === null ? pl = [
      r
    ] : pl.push(r), Ft !== 4 && (Ft = 2), e === null) return true;
    i = An(i, n), n = e;
    do {
      switch (n.tag) {
        case 3:
          return n.flags |= 65536, t = a & -a, n.lanes |= t, t = rd(n.stateNode, i, t), Lf(n, t), false;
        case 1:
          if (e = n.type, r = n.stateNode, (n.flags & 128) === 0 && (typeof e.getDerivedStateFromError == "function" || r !== null && typeof r.componentDidCatch == "function" && (ia === null || !ia.has(r)))) return n.flags |= 65536, a &= -a, n.lanes |= a, a = ob(a), ub(a, t, n, i), Lf(n, a), false;
      }
      n = n.return;
    } while (n !== null);
    return false;
  }
  var Qm = Error(j(461)), oe = false;
  function _e(t, e, n, i) {
    e.child = t === null ? x1(e, null, n, i) : er(e, t.child, n, i);
  }
  function X0(t, e, n, i, a) {
    n = n.render;
    var r = e.ref;
    if ("ref" in i) {
      var s = {};
      for (var l in i) l !== "ref" && (s[l] = i[l]);
    } else s = i;
    return tr(e), i = Nm(t, e, n, s, r, a), l = jm(), t !== null && !oe ? (Bm(t, e, a), Ei(t, e, a)) : (ut && l && Cm(e), e.flags |= 1, _e(t, e, i, a), e.child);
  }
  function F0(t, e, n, i, a) {
    if (t === null) {
      var r = n.type;
      return typeof r == "function" && !Mm(r) && r.defaultProps === void 0 && n.compare === null ? (e.tag = 15, e.type = r, cb(t, e, r, i, a)) : (t = fu(n.type, null, i, e, e.mode, a), t.ref = e.ref, t.return = e, e.child = t);
    }
    if (r = t.child, !Zm(t, a)) {
      var s = r.memoizedProps;
      if (n = n.compare, n = n !== null ? n : zl, n(s, i) && t.ref === e.ref) return Ei(t, e, a);
    }
    return e.flags |= 1, t = vi(r, i), t.ref = e.ref, t.return = e, e.child = t;
  }
  function cb(t, e, n, i, a) {
    if (t !== null) {
      var r = t.memoizedProps;
      if (zl(r, i) && t.ref === e.ref) if (oe = false, e.pendingProps = i = r, Zm(t, a)) t.flags & 131072 && (oe = true);
      else return e.lanes = t.lanes, Ei(t, e, a);
    }
    return sd(t, e, n, i, a);
  }
  function fb(t, e, n, i) {
    var a = i.children, r = t !== null ? t.memoizedState : null;
    if (t === null && e.stateNode === null && (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), i.mode === "hidden") {
      if (e.flags & 128) {
        if (r = r !== null ? r.baseLanes | n : n, t !== null) {
          for (i = e.child = t.child, a = 0; i !== null; ) a = a | i.lanes | i.childLanes, i = i.sibling;
          i = a & ~r;
        } else i = 0, e.child = null;
        return q0(t, e, r, n, i);
      }
      if (n & 536870912) e.memoizedState = {
        baseLanes: 0,
        cachePool: null
      }, t !== null && hu(e, r !== null ? r.cachePool : null), r !== null ? V0(e, r) : Ih(), w1(e);
      else return i = e.lanes = 536870912, q0(t, e, r !== null ? r.baseLanes | n : n, n, i);
    } else r !== null ? (hu(e, r.cachePool), V0(e, r), Pi(), e.memoizedState = null) : (t !== null && hu(e, null), Ih(), Pi());
    return _e(t, e, a, n), e.child;
  }
  function Is(t, e) {
    return t !== null && t.tag === 22 || e.stateNode !== null || (e.stateNode = {
      _visibility: 1,
      _pendingMarkers: null,
      _retryCache: null,
      _transitions: null
    }), e.sibling;
  }
  function q0(t, e, n, i, a) {
    var r = Om();
    return r = r === null ? null : {
      parent: se._currentValue,
      pool: r
    }, e.memoizedState = {
      baseLanes: n,
      cachePool: r
    }, t !== null && hu(e, null), Ih(), w1(e), t !== null && Ss(t, e, i, true), e.childLanes = a, null;
  }
  function pu(t, e) {
    return e = Qu({
      mode: e.mode,
      children: e.children
    }, t.mode), e.ref = t.ref, t.child = e, e.return = t, e;
  }
  function K0(t, e, n) {
    return er(e, t.child, null, n), t = pu(e, e.pendingProps), t.flags |= 2, Ie(e), e.memoizedState = null, t;
  }
  function rw(t, e, n) {
    var i = e.pendingProps, a = (e.flags & 128) !== 0;
    if (e.flags &= -129, t === null) {
      if (ut) {
        if (i.mode === "hidden") return t = pu(e, i), e.lanes = 536870912, Is(null, t);
        if (td(e), (t = Rt) ? (t = iS(t, En), t = t !== null && t.data === "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ca !== null ? {
            id: Kn,
            overflow: Qn
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = y1(t), n.return = e, e.child = n, Se = e, Rt = null)) : t = null, t === null) throw fa(e);
        return e.lanes = 536870912, null;
      }
      return pu(e, i);
    }
    var r = t.memoizedState;
    if (r !== null) {
      var s = r.dehydrated;
      if (td(e), a) if (e.flags & 256) e.flags &= -257, e = K0(t, e, n);
      else if (e.memoizedState !== null) e.child = t.child, e.flags |= 128, e = null;
      else throw Error(j(558));
      else if (oe || Ss(t, e, n, false), a = (n & t.childLanes) !== 0, oe || a) {
        if (i = xt, i !== null && (s = P_(i, n), s !== 0 && s !== r.retryLane)) throw r.retryLane = s, or(t, s), ke(i, t, s), Qm;
        Wu(), e = K0(t, e, n);
      } else t = r.treeContext, Rt = On(s.nextSibling), Se = e, ut = true, ta = null, En = false, t !== null && v1(e, t), e = pu(e, i), e.flags |= 4096;
      return e;
    }
    return t = vi(t.child, {
      mode: i.mode,
      children: i.children
    }), t.ref = e.ref, e.child = t, t.return = e, t;
  }
  function yu(t, e) {
    var n = e.ref;
    if (n === null) t !== null && t.ref !== null && (e.flags |= 4194816);
    else {
      if (typeof n != "function" && typeof n != "object") throw Error(j(284));
      (t === null || t.ref !== n) && (e.flags |= 4194816);
    }
  }
  function sd(t, e, n, i, a) {
    return tr(e), n = Nm(t, e, n, i, void 0, a), i = jm(), t !== null && !oe ? (Bm(t, e, a), Ei(t, e, a)) : (ut && i && Cm(e), e.flags |= 1, _e(t, e, n, a), e.child);
  }
  function Q0(t, e, n, i, a, r) {
    return tr(e), e.updateQueue = null, n = C1(e, i, n, a), M1(t), i = jm(), t !== null && !oe ? (Bm(t, e, r), Ei(t, e, r)) : (ut && i && Cm(e), e.flags |= 1, _e(t, e, n, r), e.child);
  }
  function Z0(t, e, n, i, a) {
    if (tr(e), e.stateNode === null) {
      var r = Rr, s = n.contextType;
      typeof s == "object" && s !== null && (r = Te(s)), r = new n(i, r), e.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = ad, e.stateNode = r, r._reactInternals = e, r = e.stateNode, r.props = i, r.state = e.memoizedState, r.refs = {}, Um(e), s = n.contextType, r.context = typeof s == "object" && s !== null ? Te(s) : Rr, r.state = e.memoizedState, s = n.getDerivedStateFromProps, typeof s == "function" && (jf(e, n, s, i), r.state = e.memoizedState), typeof n.getDerivedStateFromProps == "function" || typeof r.getSnapshotBeforeUpdate == "function" || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (s = r.state, typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount(), s !== r.state && ad.enqueueReplaceState(r, r.state, null), fl(e, i, r, a), cl(), r.state = e.memoizedState), typeof r.componentDidMount == "function" && (e.flags |= 4194308), i = true;
    } else if (t === null) {
      r = e.stateNode;
      var l = e.memoizedProps, o = ir(n, l);
      r.props = o;
      var c = r.context, f = n.contextType;
      s = Rr, typeof f == "object" && f !== null && (s = Te(f));
      var d = n.getDerivedStateFromProps;
      f = typeof d == "function" || typeof r.getSnapshotBeforeUpdate == "function", l = e.pendingProps !== l, f || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (l || c !== s) && P0(e, r, i, s), Hi = false;
      var m = e.memoizedState;
      r.state = m, fl(e, i, r, a), cl(), c = e.memoizedState, l || m !== c || Hi ? (typeof d == "function" && (jf(e, n, d, i), c = e.memoizedState), (o = Hi || G0(e, n, o, i, m, c, s)) ? (f || typeof r.UNSAFE_componentWillMount != "function" && typeof r.componentWillMount != "function" || (typeof r.componentWillMount == "function" && r.componentWillMount(), typeof r.UNSAFE_componentWillMount == "function" && r.UNSAFE_componentWillMount()), typeof r.componentDidMount == "function" && (e.flags |= 4194308)) : (typeof r.componentDidMount == "function" && (e.flags |= 4194308), e.memoizedProps = i, e.memoizedState = c), r.props = i, r.state = c, r.context = s, i = o) : (typeof r.componentDidMount == "function" && (e.flags |= 4194308), i = false);
    } else {
      r = e.stateNode, $h(t, e), s = e.memoizedProps, f = ir(n, s), r.props = f, d = e.pendingProps, m = r.context, c = n.contextType, o = Rr, typeof c == "object" && c !== null && (o = Te(c)), l = n.getDerivedStateFromProps, (c = typeof l == "function" || typeof r.getSnapshotBeforeUpdate == "function") || typeof r.UNSAFE_componentWillReceiveProps != "function" && typeof r.componentWillReceiveProps != "function" || (s !== d || m !== o) && P0(e, r, i, o), Hi = false, m = e.memoizedState, r.state = m, fl(e, i, r, a), cl();
      var y = e.memoizedState;
      s !== d || m !== y || Hi || t !== null && t.dependencies !== null && Gu(t.dependencies) ? (typeof l == "function" && (jf(e, n, l, i), y = e.memoizedState), (f = Hi || G0(e, n, f, i, m, y, o) || t !== null && t.dependencies !== null && Gu(t.dependencies)) ? (c || typeof r.UNSAFE_componentWillUpdate != "function" && typeof r.componentWillUpdate != "function" || (typeof r.componentWillUpdate == "function" && r.componentWillUpdate(i, y, o), typeof r.UNSAFE_componentWillUpdate == "function" && r.UNSAFE_componentWillUpdate(i, y, o)), typeof r.componentDidUpdate == "function" && (e.flags |= 4), typeof r.getSnapshotBeforeUpdate == "function" && (e.flags |= 1024)) : (typeof r.componentDidUpdate != "function" || s === t.memoizedProps && m === t.memoizedState || (e.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || s === t.memoizedProps && m === t.memoizedState || (e.flags |= 1024), e.memoizedProps = i, e.memoizedState = y), r.props = i, r.state = y, r.context = o, i = f) : (typeof r.componentDidUpdate != "function" || s === t.memoizedProps && m === t.memoizedState || (e.flags |= 4), typeof r.getSnapshotBeforeUpdate != "function" || s === t.memoizedProps && m === t.memoizedState || (e.flags |= 1024), i = false);
    }
    return r = i, yu(t, e), i = (e.flags & 128) !== 0, r || i ? (r = e.stateNode, n = i && typeof n.getDerivedStateFromError != "function" ? null : r.render(), e.flags |= 1, t !== null && i ? (e.child = er(e, t.child, null, a), e.child = er(e, null, n, a)) : _e(t, e, n, a), e.memoizedState = r.state, t = e.child) : t = Ei(t, e, a), t;
  }
  function J0(t, e, n, i) {
    return Ia(), e.flags |= 256, _e(t, e, n, i), e.child;
  }
  var Bf = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0,
    hydrationErrors: null
  };
  function Hf(t) {
    return {
      baseLanes: t,
      cachePool: b1()
    };
  }
  function Yf(t, e, n) {
    return t = t !== null ? t.childLanes & ~n : 0, e && (t |= nn), t;
  }
  function hb(t, e, n) {
    var i = e.pendingProps, a = false, r = (e.flags & 128) !== 0, s;
    if ((s = r) || (s = t !== null && t.memoizedState === null ? false : (Wt.current & 2) !== 0), s && (a = true, e.flags &= -129), s = (e.flags & 32) !== 0, e.flags &= -33, t === null) {
      if (ut) {
        if (a ? Gi(e) : Pi(), (t = Rt) ? (t = iS(t, En), t = t !== null && t.data !== "&" ? t : null, t !== null && (e.memoizedState = {
          dehydrated: t,
          treeContext: ca !== null ? {
            id: Kn,
            overflow: Qn
          } : null,
          retryLane: 536870912,
          hydrationErrors: null
        }, n = y1(t), n.return = e, e.child = n, Se = e, Rt = null)) : t = null, t === null) throw fa(e);
        return bd(t) ? e.lanes = 32 : e.lanes = 536870912, null;
      }
      var l = i.children;
      return i = i.fallback, a ? (Pi(), a = e.mode, l = Qu({
        mode: "hidden",
        children: l
      }, a), i = Pa(i, a, n, null), l.return = e, i.return = e, l.sibling = i, e.child = l, i = e.child, i.memoizedState = Hf(n), i.childLanes = Yf(t, s, n), e.memoizedState = Bf, Is(null, i)) : (Gi(e), ld(e, l));
    }
    var o = t.memoizedState;
    if (o !== null && (l = o.dehydrated, l !== null)) {
      if (r) e.flags & 256 ? (Gi(e), e.flags &= -257, e = Gf(t, e, n)) : e.memoizedState !== null ? (Pi(), e.child = t.child, e.flags |= 128, e = null) : (Pi(), l = i.fallback, a = e.mode, i = Qu({
        mode: "visible",
        children: i.children
      }, a), l = Pa(l, a, n, null), l.flags |= 2, i.return = e, l.return = e, i.sibling = l, e.child = i, er(e, t.child, null, n), i = e.child, i.memoizedState = Hf(n), i.childLanes = Yf(t, s, n), e.memoizedState = Bf, e = Is(null, i));
      else if (Gi(e), bd(l)) {
        if (s = l.nextSibling && l.nextSibling.dataset, s) var c = s.dgst;
        s = c, i = Error(j(419)), i.stack = "", i.digest = s, Vl({
          value: i,
          source: null,
          stack: null
        }), e = Gf(t, e, n);
      } else if (oe || Ss(t, e, n, false), s = (n & t.childLanes) !== 0, oe || s) {
        if (s = xt, s !== null && (i = P_(s, n), i !== 0 && i !== o.retryLane)) throw o.retryLane = i, or(t, i), ke(s, t, i), Qm;
        _d(l) || Wu(), e = Gf(t, e, n);
      } else _d(l) ? (e.flags |= 192, e.child = t.child, e = null) : (t = o.treeContext, Rt = On(l.nextSibling), Se = e, ut = true, ta = null, En = false, t !== null && v1(e, t), e = ld(e, i.children), e.flags |= 4096);
      return e;
    }
    return a ? (Pi(), l = i.fallback, a = e.mode, o = t.child, c = o.sibling, i = vi(o, {
      mode: "hidden",
      children: i.children
    }), i.subtreeFlags = o.subtreeFlags & 65011712, c !== null ? l = vi(c, l) : (l = Pa(l, a, n, null), l.flags |= 2), l.return = e, i.return = e, i.sibling = l, e.child = i, Is(null, i), i = e.child, l = t.child.memoizedState, l === null ? l = Hf(n) : (a = l.cachePool, a !== null ? (o = se._currentValue, a = a.parent !== o ? {
      parent: o,
      pool: o
    } : a) : a = b1(), l = {
      baseLanes: l.baseLanes | n,
      cachePool: a
    }), i.memoizedState = l, i.childLanes = Yf(t, s, n), e.memoizedState = Bf, Is(t.child, i)) : (Gi(e), n = t.child, t = n.sibling, n = vi(n, {
      mode: "visible",
      children: i.children
    }), n.return = e, n.sibling = null, t !== null && (s = e.deletions, s === null ? (e.deletions = [
      t
    ], e.flags |= 16) : s.push(t)), e.child = n, e.memoizedState = null, n);
  }
  function ld(t, e) {
    return e = Qu({
      mode: "visible",
      children: e
    }, t.mode), e.return = t, t.child = e;
  }
  function Qu(t, e) {
    return t = tn(22, t, null, e), t.lanes = 0, t;
  }
  function Gf(t, e, n) {
    return er(e, t.child, null, n), t = ld(e, e.pendingProps.children), t.flags |= 2, e.memoizedState = null, t;
  }
  function $0(t, e, n) {
    t.lanes |= e;
    var i = t.alternate;
    i !== null && (i.lanes |= e), Qh(t.return, e, n);
  }
  function Pf(t, e, n, i, a, r) {
    var s = t.memoizedState;
    s === null ? t.memoizedState = {
      isBackwards: e,
      rendering: null,
      renderingStartTime: 0,
      last: i,
      tail: n,
      tailMode: a,
      treeForkCount: r
    } : (s.isBackwards = e, s.rendering = null, s.renderingStartTime = 0, s.last = i, s.tail = n, s.tailMode = a, s.treeForkCount = r);
  }
  function db(t, e, n) {
    var i = e.pendingProps, a = i.revealOrder, r = i.tail;
    i = i.children;
    var s = Wt.current, l = (s & 2) !== 0;
    if (l ? (s = s & 1 | 2, e.flags |= 128) : s &= 1, Et(Wt, s), _e(t, e, i, n), i = ut ? Ul : 0, !l && t !== null && t.flags & 128) t: for (t = e.child; t !== null; ) {
      if (t.tag === 13) t.memoizedState !== null && $0(t, n, e);
      else if (t.tag === 19) $0(t, n, e);
      else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break t;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) break t;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    switch (a) {
      case "forwards":
        for (n = e.child, a = null; n !== null; ) t = n.alternate, t !== null && Xu(t) === null && (a = n), n = n.sibling;
        n = a, n === null ? (a = e.child, e.child = null) : (a = n.sibling, n.sibling = null), Pf(e, false, a, n, r, i);
        break;
      case "backwards":
      case "unstable_legacy-backwards":
        for (n = null, a = e.child, e.child = null; a !== null; ) {
          if (t = a.alternate, t !== null && Xu(t) === null) {
            e.child = a;
            break;
          }
          t = a.sibling, a.sibling = n, n = a, a = t;
        }
        Pf(e, true, n, null, r, i);
        break;
      case "together":
        Pf(e, false, null, null, void 0, i);
        break;
      default:
        e.memoizedState = null;
    }
    return e.child;
  }
  function Ei(t, e, n) {
    if (t !== null && (e.dependencies = t.dependencies), da |= e.lanes, !(n & e.childLanes)) if (t !== null) {
      if (Ss(t, e, n, false), (n & e.childLanes) === 0) return null;
    } else return null;
    if (t !== null && e.child !== t.child) throw Error(j(153));
    if (e.child !== null) {
      for (t = e.child, n = vi(t, t.pendingProps), e.child = n, n.return = e; t.sibling !== null; ) t = t.sibling, n = n.sibling = vi(t, t.pendingProps), n.return = e;
      n.sibling = null;
    }
    return e.child;
  }
  function Zm(t, e) {
    return t.lanes & e ? true : (t = t.dependencies, !!(t !== null && Gu(t)));
  }
  function sw(t, e, n) {
    switch (e.tag) {
      case 3:
        Vu(e, e.stateNode.containerInfo), Yi(e, se, t.memoizedState.cache), Ia();
        break;
      case 27:
      case 5:
        Lh(e);
        break;
      case 4:
        Vu(e, e.stateNode.containerInfo);
        break;
      case 10:
        Yi(e, e.type, e.memoizedProps.value);
        break;
      case 31:
        if (e.memoizedState !== null) return e.flags |= 128, td(e), null;
        break;
      case 13:
        var i = e.memoizedState;
        if (i !== null) return i.dehydrated !== null ? (Gi(e), e.flags |= 128, null) : n & e.child.childLanes ? hb(t, e, n) : (Gi(e), t = Ei(t, e, n), t !== null ? t.sibling : null);
        Gi(e);
        break;
      case 19:
        var a = (t.flags & 128) !== 0;
        if (i = (n & e.childLanes) !== 0, i || (Ss(t, e, n, false), i = (n & e.childLanes) !== 0), a) {
          if (i) return db(t, e, n);
          e.flags |= 128;
        }
        if (a = e.memoizedState, a !== null && (a.rendering = null, a.tail = null, a.lastEffect = null), Et(Wt, Wt.current), i) break;
        return null;
      case 22:
        return e.lanes = 0, fb(t, e, n, e.pendingProps);
      case 24:
        Yi(e, se, t.memoizedState.cache);
    }
    return Ei(t, e, n);
  }
  function mb(t, e, n) {
    if (t !== null) if (t.memoizedProps !== e.pendingProps) oe = true;
    else {
      if (!Zm(t, n) && !(e.flags & 128)) return oe = false, sw(t, e, n);
      oe = !!(t.flags & 131072);
    }
    else oe = false, ut && e.flags & 1048576 && g1(e, Ul, e.index);
    switch (e.lanes = 0, e.tag) {
      case 16:
        t: {
          var i = e.pendingProps;
          if (t = Va(e.elementType), e.type = t, typeof t == "function") Mm(t) ? (i = ir(t, i), e.tag = 1, e = Z0(null, e, t, i, n)) : (e.tag = 0, e = sd(null, e, t, i, n));
          else {
            if (t != null) {
              var a = t.$$typeof;
              if (a === dm) {
                e.tag = 11, e = X0(null, e, t, i, n);
                break t;
              } else if (a === mm) {
                e.tag = 14, e = F0(null, e, t, i, n);
                break t;
              }
            }
            throw e = Uh(t) || t, Error(j(306, e, ""));
          }
        }
        return e;
      case 0:
        return sd(t, e, e.type, e.pendingProps, n);
      case 1:
        return i = e.type, a = ir(i, e.pendingProps), Z0(t, e, i, a, n);
      case 3:
        t: {
          if (Vu(e, e.stateNode.containerInfo), t === null) throw Error(j(387));
          i = e.pendingProps;
          var r = e.memoizedState;
          a = r.element, $h(t, e), fl(e, i, null, n);
          var s = e.memoizedState;
          if (i = s.cache, Yi(e, se, i), i !== r.cache && Zh(e, [
            se
          ], n, true), cl(), i = s.element, r.isDehydrated) if (r = {
            element: i,
            isDehydrated: false,
            cache: s.cache
          }, e.updateQueue.baseState = r, e.memoizedState = r, e.flags & 256) {
            e = J0(t, e, i, n);
            break t;
          } else if (i !== a) {
            a = An(Error(j(424)), e), Vl(a), e = J0(t, e, i, n);
            break t;
          } else {
            switch (t = e.stateNode.containerInfo, t.nodeType) {
              case 9:
                t = t.body;
                break;
              default:
                t = t.nodeName === "HTML" ? t.ownerDocument.body : t;
            }
            for (Rt = On(t.firstChild), Se = e, ut = true, ta = null, En = true, n = x1(e, null, i, n), e.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          }
          else {
            if (Ia(), i === a) {
              e = Ei(t, e, n);
              break t;
            }
            _e(t, e, i, n);
          }
          e = e.child;
        }
        return e;
      case 26:
        return yu(t, e), t === null ? (n = gg(e.type, null, e.pendingProps, null)) ? e.memoizedState = n : ut || (n = e.type, t = e.pendingProps, i = nc(Ii.current).createElement(n), i[be] = e, i[Qe] = t, xe(i, n, t), he(i), e.stateNode = i) : e.memoizedState = gg(e.type, t.memoizedProps, e.pendingProps, t.memoizedState), null;
      case 27:
        return Lh(e), t === null && ut && (i = e.stateNode = aS(e.type, e.pendingProps, Ii.current), Se = e, En = true, a = Rt, _a(e.type) ? (Sd = a, Rt = On(i.firstChild)) : Rt = a), _e(t, e, e.pendingProps.children, n), yu(t, e), t === null && (e.flags |= 4194304), e.child;
      case 5:
        return t === null && ut && ((a = i = Rt) && (i = Nw(i, e.type, e.pendingProps, En), i !== null ? (e.stateNode = i, Se = e, Rt = On(i.firstChild), En = false, a = true) : a = false), a || fa(e)), Lh(e), a = e.type, r = e.pendingProps, s = t !== null ? t.memoizedProps : null, i = r.children, gd(a, r) ? i = null : s !== null && gd(a, s) && (e.flags |= 32), e.memoizedState !== null && (a = Nm(t, e, $E, null, null, n), Yl._currentValue = a), yu(t, e), _e(t, e, i, n), e.child;
      case 6:
        return t === null && ut && ((t = n = Rt) && (n = jw(n, e.pendingProps, En), n !== null ? (e.stateNode = n, Se = e, Rt = null, t = true) : t = false), t || fa(e)), null;
      case 13:
        return hb(t, e, n);
      case 4:
        return Vu(e, e.stateNode.containerInfo), i = e.pendingProps, t === null ? e.child = er(e, null, i, n) : _e(t, e, i, n), e.child;
      case 11:
        return X0(t, e, e.type, e.pendingProps, n);
      case 7:
        return _e(t, e, e.pendingProps, n), e.child;
      case 8:
        return _e(t, e, e.pendingProps.children, n), e.child;
      case 12:
        return _e(t, e, e.pendingProps.children, n), e.child;
      case 10:
        return i = e.pendingProps, Yi(e, e.type, i.value), _e(t, e, i.children, n), e.child;
      case 9:
        return a = e.type._context, i = e.pendingProps.children, tr(e), a = Te(a), i = i(a), e.flags |= 1, _e(t, e, i, n), e.child;
      case 14:
        return F0(t, e, e.type, e.pendingProps, n);
      case 15:
        return cb(t, e, e.type, e.pendingProps, n);
      case 19:
        return db(t, e, n);
      case 31:
        return rw(t, e, n);
      case 22:
        return fb(t, e, n, e.pendingProps);
      case 24:
        return tr(e), i = Te(se), t === null ? (a = Om(), a === null && (a = xt, r = Rm(), a.pooledCache = r, r.refCount++, r !== null && (a.pooledCacheLanes |= n), a = r), e.memoizedState = {
          parent: i,
          cache: a
        }, Um(e), Yi(e, se, a)) : (t.lanes & n && ($h(t, e), fl(e, null, null, n), cl()), a = t.memoizedState, r = e.memoizedState, a.parent !== i ? (a = {
          parent: i,
          cache: i
        }, e.memoizedState = a, e.lanes === 0 && (e.memoizedState = e.updateQueue.baseState = a), Yi(e, se, i)) : (i = r.cache, Yi(e, se, i), i !== a.cache && Zh(e, [
          se
        ], n, true))), _e(t, e, e.pendingProps.children, n), e.child;
      case 29:
        throw e.pendingProps;
    }
    throw Error(j(156, e.tag));
  }
  function li(t) {
    t.flags |= 4;
  }
  function kf(t, e, n, i, a) {
    if ((e = (t.mode & 32) !== 0) && (e = false), e) {
      if (t.flags |= 16777216, (a & 335544128) === a) if (t.stateNode.complete) t.flags |= 8192;
      else if (Bb()) t.flags |= 8192;
      else throw Xa = Pu, zm;
    } else t.flags &= -16777217;
  }
  function W0(t, e) {
    if (e.type !== "stylesheet" || e.state.loading & 4) t.flags &= -16777217;
    else if (t.flags |= 16777216, !lS(e)) if (Bb()) t.flags |= 8192;
    else throw Xa = Pu, zm;
  }
  function Qo(t, e) {
    e !== null && (t.flags |= 4), t.flags & 16384 && (e = t.tag !== 22 ? H_() : 536870912, t.lanes |= e, as |= e);
  }
  function Xs(t, e) {
    if (!ut) switch (t.tailMode) {
      case "hidden":
        e = t.tail;
        for (var n = null; e !== null; ) e.alternate !== null && (n = e), e = e.sibling;
        n === null ? t.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = t.tail;
        for (var i = null; n !== null; ) n.alternate !== null && (i = n), n = n.sibling;
        i === null ? e || t.tail === null ? t.tail = null : t.tail.sibling = null : i.sibling = null;
    }
  }
  function Dt(t) {
    var e = t.alternate !== null && t.alternate.child === t.child, n = 0, i = 0;
    if (e) for (var a = t.child; a !== null; ) n |= a.lanes | a.childLanes, i |= a.subtreeFlags & 65011712, i |= a.flags & 65011712, a.return = t, a = a.sibling;
    else for (a = t.child; a !== null; ) n |= a.lanes | a.childLanes, i |= a.subtreeFlags, i |= a.flags, a.return = t, a = a.sibling;
    return t.subtreeFlags |= i, t.childLanes = n, e;
  }
  function lw(t, e, n) {
    var i = e.pendingProps;
    switch (Dm(e), e.tag) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Dt(e), null;
      case 1:
        return Dt(e), null;
      case 3:
        return n = e.stateNode, i = null, t !== null && (i = t.memoizedState.cache), e.memoizedState.cache !== i && (e.flags |= 2048), _i(se), Wr(), n.pendingContext && (n.context = n.pendingContext, n.pendingContext = null), (t === null || t.child === null) && (pr(e) ? li(e) : t === null || t.memoizedState.isDehydrated && !(e.flags & 256) || (e.flags |= 1024, Vf())), Dt(e), null;
      case 26:
        var a = e.type, r = e.memoizedState;
        return t === null ? (li(e), r !== null ? (Dt(e), W0(e, r)) : (Dt(e), kf(e, a, null, i, n))) : r ? r !== t.memoizedState ? (li(e), Dt(e), W0(e, r)) : (Dt(e), e.flags &= -16777217) : (t = t.memoizedProps, t !== i && li(e), Dt(e), kf(e, a, t, i, n)), null;
      case 27:
        if (Lu(e), n = Ii.current, a = e.type, t !== null && e.stateNode != null) t.memoizedProps !== i && li(e);
        else {
          if (!i) {
            if (e.stateNode === null) throw Error(j(166));
            return Dt(e), null;
          }
          t = $n.current, pr(e) ? M0(e) : (t = aS(a, i, n), e.stateNode = t, li(e));
        }
        return Dt(e), null;
      case 5:
        if (Lu(e), a = e.type, t !== null && e.stateNode != null) t.memoizedProps !== i && li(e);
        else {
          if (!i) {
            if (e.stateNode === null) throw Error(j(166));
            return Dt(e), null;
          }
          if (r = $n.current, pr(e)) M0(e);
          else {
            var s = nc(Ii.current);
            switch (r) {
              case 1:
                r = s.createElementNS("http://www.w3.org/2000/svg", a);
                break;
              case 2:
                r = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                break;
              default:
                switch (a) {
                  case "svg":
                    r = s.createElementNS("http://www.w3.org/2000/svg", a);
                    break;
                  case "math":
                    r = s.createElementNS("http://www.w3.org/1998/Math/MathML", a);
                    break;
                  case "script":
                    r = s.createElement("div"), r.innerHTML = "<script><\/script>", r = r.removeChild(r.firstChild);
                    break;
                  case "select":
                    r = typeof i.is == "string" ? s.createElement("select", {
                      is: i.is
                    }) : s.createElement("select"), i.multiple ? r.multiple = true : i.size && (r.size = i.size);
                    break;
                  default:
                    r = typeof i.is == "string" ? s.createElement(a, {
                      is: i.is
                    }) : s.createElement(a);
                }
            }
            r[be] = e, r[Qe] = i;
            t: for (s = e.child; s !== null; ) {
              if (s.tag === 5 || s.tag === 6) r.appendChild(s.stateNode);
              else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                s.child.return = s, s = s.child;
                continue;
              }
              if (s === e) break t;
              for (; s.sibling === null; ) {
                if (s.return === null || s.return === e) break t;
                s = s.return;
              }
              s.sibling.return = s.return, s = s.sibling;
            }
            e.stateNode = r;
            t: switch (xe(r, a, i), a) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                i = !!i.autoFocus;
                break t;
              case "img":
                i = true;
                break t;
              default:
                i = false;
            }
            i && li(e);
          }
        }
        return Dt(e), kf(e, e.type, t === null ? null : t.memoizedProps, e.pendingProps, n), null;
      case 6:
        if (t && e.stateNode != null) t.memoizedProps !== i && li(e);
        else {
          if (typeof i != "string" && e.stateNode === null) throw Error(j(166));
          if (t = Ii.current, pr(e)) {
            if (t = e.stateNode, n = e.memoizedProps, i = null, a = Se, a !== null) switch (a.tag) {
              case 27:
              case 5:
                i = a.memoizedProps;
            }
            t[be] = e, t = !!(t.nodeValue === n || i !== null && i.suppressHydrationWarning === true || tS(t.nodeValue, n)), t || fa(e, true);
          } else t = nc(t).createTextNode(i), t[be] = e, e.stateNode = t;
        }
        return Dt(e), null;
      case 31:
        if (n = e.memoizedState, t === null || t.memoizedState !== null) {
          if (i = pr(e), n !== null) {
            if (t === null) {
              if (!i) throw Error(j(318));
              if (t = e.memoizedState, t = t !== null ? t.dehydrated : null, !t) throw Error(j(557));
              t[be] = e;
            } else Ia(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
            Dt(e), t = false;
          } else n = Vf(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = n), t = true;
          if (!t) return e.flags & 256 ? (Ie(e), e) : (Ie(e), null);
          if (e.flags & 128) throw Error(j(558));
        }
        return Dt(e), null;
      case 13:
        if (i = e.memoizedState, t === null || t.memoizedState !== null && t.memoizedState.dehydrated !== null) {
          if (a = pr(e), i !== null && i.dehydrated !== null) {
            if (t === null) {
              if (!a) throw Error(j(318));
              if (a = e.memoizedState, a = a !== null ? a.dehydrated : null, !a) throw Error(j(317));
              a[be] = e;
            } else Ia(), !(e.flags & 128) && (e.memoizedState = null), e.flags |= 4;
            Dt(e), a = false;
          } else a = Vf(), t !== null && t.memoizedState !== null && (t.memoizedState.hydrationErrors = a), a = true;
          if (!a) return e.flags & 256 ? (Ie(e), e) : (Ie(e), null);
        }
        return Ie(e), e.flags & 128 ? (e.lanes = n, e) : (n = i !== null, t = t !== null && t.memoizedState !== null, n && (i = e.child, a = null, i.alternate !== null && i.alternate.memoizedState !== null && i.alternate.memoizedState.cachePool !== null && (a = i.alternate.memoizedState.cachePool.pool), r = null, i.memoizedState !== null && i.memoizedState.cachePool !== null && (r = i.memoizedState.cachePool.pool), r !== a && (i.flags |= 2048)), n !== t && n && (e.child.flags |= 8192), Qo(e, e.updateQueue), Dt(e), null);
      case 4:
        return Wr(), t === null && np(e.stateNode.containerInfo), Dt(e), null;
      case 10:
        return _i(e.type), Dt(e), null;
      case 19:
        if (de(Wt), i = e.memoizedState, i === null) return Dt(e), null;
        if (a = (e.flags & 128) !== 0, r = i.rendering, r === null) if (a) Xs(i, false);
        else {
          if (Ft !== 0 || t !== null && t.flags & 128) for (t = e.child; t !== null; ) {
            if (r = Xu(t), r !== null) {
              for (e.flags |= 128, Xs(i, false), t = r.updateQueue, e.updateQueue = t, Qo(e, t), e.subtreeFlags = 0, t = n, n = e.child; n !== null; ) p1(n, t), n = n.sibling;
              return Et(Wt, Wt.current & 1 | 2), ut && hi(e, i.treeForkCount), e.child;
            }
            t = t.sibling;
          }
          i.tail !== null && rn() > Ju && (e.flags |= 128, a = true, Xs(i, false), e.lanes = 4194304);
        }
        else {
          if (!a) if (t = Xu(r), t !== null) {
            if (e.flags |= 128, a = true, t = t.updateQueue, e.updateQueue = t, Qo(e, t), Xs(i, true), i.tail === null && i.tailMode === "hidden" && !r.alternate && !ut) return Dt(e), null;
          } else 2 * rn() - i.renderingStartTime > Ju && n !== 536870912 && (e.flags |= 128, a = true, Xs(i, false), e.lanes = 4194304);
          i.isBackwards ? (r.sibling = e.child, e.child = r) : (t = i.last, t !== null ? t.sibling = r : e.child = r, i.last = r);
        }
        return i.tail !== null ? (t = i.tail, i.rendering = t, i.tail = t.sibling, i.renderingStartTime = rn(), t.sibling = null, n = Wt.current, Et(Wt, a ? n & 1 | 2 : n & 1), ut && hi(e, i.treeForkCount), t) : (Dt(e), null);
      case 22:
      case 23:
        return Ie(e), Vm(), i = e.memoizedState !== null, t !== null ? t.memoizedState !== null !== i && (e.flags |= 8192) : i && (e.flags |= 8192), i ? n & 536870912 && !(e.flags & 128) && (Dt(e), e.subtreeFlags & 6 && (e.flags |= 8192)) : Dt(e), n = e.updateQueue, n !== null && Qo(e, n.retryQueue), n = null, t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), i = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (i = e.memoizedState.cachePool.pool), i !== n && (e.flags |= 2048), t !== null && de(ka), null;
      case 24:
        return n = null, t !== null && (n = t.memoizedState.cache), e.memoizedState.cache !== n && (e.flags |= 2048), _i(se), Dt(e), null;
      case 25:
        return null;
      case 30:
        return null;
    }
    throw Error(j(156, e.tag));
  }
  function ow(t, e) {
    switch (Dm(e), e.tag) {
      case 1:
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 3:
        return _i(se), Wr(), t = e.flags, t & 65536 && !(t & 128) ? (e.flags = t & -65537 | 128, e) : null;
      case 26:
      case 27:
      case 5:
        return Lu(e), null;
      case 31:
        if (e.memoizedState !== null) {
          if (Ie(e), e.alternate === null) throw Error(j(340));
          Ia();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 13:
        if (Ie(e), t = e.memoizedState, t !== null && t.dehydrated !== null) {
          if (e.alternate === null) throw Error(j(340));
          Ia();
        }
        return t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 19:
        return de(Wt), null;
      case 4:
        return Wr(), null;
      case 10:
        return _i(e.type), null;
      case 22:
      case 23:
        return Ie(e), Vm(), t !== null && de(ka), t = e.flags, t & 65536 ? (e.flags = t & -65537 | 128, e) : null;
      case 24:
        return _i(se), null;
      case 25:
        return null;
      default:
        return null;
    }
  }
  function pb(t, e) {
    switch (Dm(e), e.tag) {
      case 3:
        _i(se), Wr();
        break;
      case 26:
      case 27:
      case 5:
        Lu(e);
        break;
      case 4:
        Wr();
        break;
      case 31:
        e.memoizedState !== null && Ie(e);
        break;
      case 13:
        Ie(e);
        break;
      case 19:
        de(Wt);
        break;
      case 10:
        _i(e.type);
        break;
      case 22:
      case 23:
        Ie(e), Vm(), t !== null && de(ka);
        break;
      case 24:
        _i(se);
    }
  }
  function ho(t, e) {
    try {
      var n = e.updateQueue, i = n !== null ? n.lastEffect : null;
      if (i !== null) {
        var a = i.next;
        n = a;
        do {
          if ((n.tag & t) === t) {
            i = void 0;
            var r = n.create, s = n.inst;
            i = r(), s.destroy = i;
          }
          n = n.next;
        } while (n !== a);
      }
    } catch (l) {
      gt(e, e.return, l);
    }
  }
  function ha(t, e, n) {
    try {
      var i = e.updateQueue, a = i !== null ? i.lastEffect : null;
      if (a !== null) {
        var r = a.next;
        i = r;
        do {
          if ((i.tag & t) === t) {
            var s = i.inst, l = s.destroy;
            if (l !== void 0) {
              s.destroy = void 0, a = e;
              var o = n, c = l;
              try {
                c();
              } catch (f) {
                gt(a, o, f);
              }
            }
          }
          i = i.next;
        } while (i !== r);
      }
    } catch (f) {
      gt(e, e.return, f);
    }
  }
  function yb(t) {
    var e = t.updateQueue;
    if (e !== null) {
      var n = t.stateNode;
      try {
        E1(e, n);
      } catch (i) {
        gt(t, t.return, i);
      }
    }
  }
  function gb(t, e, n) {
    n.props = ir(t.type, t.memoizedProps), n.state = t.memoizedState;
    try {
      n.componentWillUnmount();
    } catch (i) {
      gt(t, e, i);
    }
  }
  function dl(t, e) {
    try {
      var n = t.ref;
      if (n !== null) {
        switch (t.tag) {
          case 26:
          case 27:
          case 5:
            var i = t.stateNode;
            break;
          case 30:
            i = t.stateNode;
            break;
          default:
            i = t.stateNode;
        }
        typeof n == "function" ? t.refCleanup = n(i) : n.current = i;
      }
    } catch (a) {
      gt(t, e, a);
    }
  }
  function Zn(t, e) {
    var n = t.ref, i = t.refCleanup;
    if (n !== null) if (typeof i == "function") try {
      i();
    } catch (a) {
      gt(t, e, a);
    } finally {
      t.refCleanup = null, t = t.alternate, t != null && (t.refCleanup = null);
    }
    else if (typeof n == "function") try {
      n(null);
    } catch (a) {
      gt(t, e, a);
    }
    else n.current = null;
  }
  function vb(t) {
    var e = t.type, n = t.memoizedProps, i = t.stateNode;
    try {
      t: switch (e) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          n.autoFocus && i.focus();
          break t;
        case "img":
          n.src ? i.src = n.src : n.srcSet && (i.srcset = n.srcSet);
      }
    } catch (a) {
      gt(t, t.return, a);
    }
  }
  function Xf(t, e, n) {
    try {
      var i = t.stateNode;
      Rw(i, t.type, n, e), i[Qe] = e;
    } catch (a) {
      gt(t, t.return, a);
    }
  }
  function _b(t) {
    return t.tag === 5 || t.tag === 3 || t.tag === 26 || t.tag === 27 && _a(t.type) || t.tag === 4;
  }
  function Ff(t) {
    t: for (; ; ) {
      for (; t.sibling === null; ) {
        if (t.return === null || _b(t.return)) return null;
        t = t.return;
      }
      for (t.sibling.return = t.return, t = t.sibling; t.tag !== 5 && t.tag !== 6 && t.tag !== 18; ) {
        if (t.tag === 27 && _a(t.type) || t.flags & 2 || t.child === null || t.tag === 4) continue t;
        t.child.return = t, t = t.child;
      }
      if (!(t.flags & 2)) return t.stateNode;
    }
  }
  function od(t, e, n) {
    var i = t.tag;
    if (i === 5 || i === 6) t = t.stateNode, e ? (n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n).insertBefore(t, e) : (e = n.nodeType === 9 ? n.body : n.nodeName === "HTML" ? n.ownerDocument.body : n, e.appendChild(t), n = n._reactRootContainer, n != null || e.onclick !== null || (e.onclick = yi));
    else if (i !== 4 && (i === 27 && _a(t.type) && (n = t.stateNode, e = null), t = t.child, t !== null)) for (od(t, e, n), t = t.sibling; t !== null; ) od(t, e, n), t = t.sibling;
  }
  function Zu(t, e, n) {
    var i = t.tag;
    if (i === 5 || i === 6) t = t.stateNode, e ? n.insertBefore(t, e) : n.appendChild(t);
    else if (i !== 4 && (i === 27 && _a(t.type) && (n = t.stateNode), t = t.child, t !== null)) for (Zu(t, e, n), t = t.sibling; t !== null; ) Zu(t, e, n), t = t.sibling;
  }
  function bb(t) {
    var e = t.stateNode, n = t.memoizedProps;
    try {
      for (var i = t.type, a = e.attributes; a.length; ) e.removeAttributeNode(a[0]);
      xe(e, i, n), e[be] = t, e[Qe] = n;
    } catch (r) {
      gt(t, t.return, r);
    }
  }
  var mi = false, ae = false, qf = false, I0 = typeof WeakSet == "function" ? WeakSet : Set, fe = null;
  function uw(t, e) {
    if (t = t.containerInfo, pd = sc, t = l1(t), Am(t)) {
      if ("selectionStart" in t) var n = {
        start: t.selectionStart,
        end: t.selectionEnd
      };
      else t: {
        n = (n = t.ownerDocument) && n.defaultView || window;
        var i = n.getSelection && n.getSelection();
        if (i && i.rangeCount !== 0) {
          n = i.anchorNode;
          var a = i.anchorOffset, r = i.focusNode;
          i = i.focusOffset;
          try {
            n.nodeType, r.nodeType;
          } catch {
            n = null;
            break t;
          }
          var s = 0, l = -1, o = -1, c = 0, f = 0, d = t, m = null;
          e: for (; ; ) {
            for (var y; d !== n || a !== 0 && d.nodeType !== 3 || (l = s + a), d !== r || i !== 0 && d.nodeType !== 3 || (o = s + i), d.nodeType === 3 && (s += d.nodeValue.length), (y = d.firstChild) !== null; ) m = d, d = y;
            for (; ; ) {
              if (d === t) break e;
              if (m === n && ++c === a && (l = s), m === r && ++f === i && (o = s), (y = d.nextSibling) !== null) break;
              d = m, m = d.parentNode;
            }
            d = y;
          }
          n = l === -1 || o === -1 ? null : {
            start: l,
            end: o
          };
        } else n = null;
      }
      n = n || {
        start: 0,
        end: 0
      };
    } else n = null;
    for (yd = {
      focusedElem: t,
      selectionRange: n
    }, sc = false, fe = e; fe !== null; ) if (e = fe, t = e.child, (e.subtreeFlags & 1028) !== 0 && t !== null) t.return = e, fe = t;
    else for (; fe !== null; ) {
      switch (e = fe, r = e.alternate, t = e.flags, e.tag) {
        case 0:
          if (t & 4 && (t = e.updateQueue, t = t !== null ? t.events : null, t !== null)) for (n = 0; n < t.length; n++) a = t[n], a.ref.impl = a.nextImpl;
          break;
        case 11:
        case 15:
          break;
        case 1:
          if (t & 1024 && r !== null) {
            t = void 0, n = e, a = r.memoizedProps, r = r.memoizedState, i = n.stateNode;
            try {
              var T = ir(n.type, a);
              t = i.getSnapshotBeforeUpdate(T, r), i.__reactInternalSnapshotBeforeUpdate = t;
            } catch (b) {
              gt(n, n.return, b);
            }
          }
          break;
        case 3:
          if (t & 1024) {
            if (t = e.stateNode.containerInfo, n = t.nodeType, n === 9) vd(t);
            else if (n === 1) switch (t.nodeName) {
              case "HEAD":
              case "HTML":
              case "BODY":
                vd(t);
                break;
              default:
                t.textContent = "";
            }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        default:
          if (t & 1024) throw Error(j(163));
      }
      if (t = e.sibling, t !== null) {
        t.return = e.return, fe = t;
        break;
      }
      fe = e.return;
    }
  }
  function Sb(t, e, n) {
    var i = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        ui(t, n), i & 4 && ho(5, n);
        break;
      case 1:
        if (ui(t, n), i & 4) if (t = n.stateNode, e === null) try {
          t.componentDidMount();
        } catch (s) {
          gt(n, n.return, s);
        }
        else {
          var a = ir(n.type, e.memoizedProps);
          e = e.memoizedState;
          try {
            t.componentDidUpdate(a, e, t.__reactInternalSnapshotBeforeUpdate);
          } catch (s) {
            gt(n, n.return, s);
          }
        }
        i & 64 && yb(n), i & 512 && dl(n, n.return);
        break;
      case 3:
        if (ui(t, n), i & 64 && (t = n.updateQueue, t !== null)) {
          if (e = null, n.child !== null) switch (n.child.tag) {
            case 27:
            case 5:
              e = n.child.stateNode;
              break;
            case 1:
              e = n.child.stateNode;
          }
          try {
            E1(t, e);
          } catch (s) {
            gt(n, n.return, s);
          }
        }
        break;
      case 27:
        e === null && i & 4 && bb(n);
      case 26:
      case 5:
        ui(t, n), e === null && i & 4 && vb(n), i & 512 && dl(n, n.return);
        break;
      case 12:
        ui(t, n);
        break;
      case 31:
        ui(t, n), i & 4 && Ab(t, n);
        break;
      case 13:
        ui(t, n), i & 4 && Eb(t, n), i & 64 && (t = n.memoizedState, t !== null && (t = t.dehydrated, t !== null && (n = vw.bind(null, n), Bw(t, n))));
        break;
      case 22:
        if (i = n.memoizedState !== null || mi, !i) {
          e = e !== null && e.memoizedState !== null || ae, a = mi;
          var r = ae;
          mi = i, (ae = e) && !r ? ci(t, n, (n.subtreeFlags & 8772) !== 0) : ui(t, n), mi = a, ae = r;
        }
        break;
      case 30:
        break;
      default:
        ui(t, n);
    }
  }
  function Tb(t) {
    var e = t.alternate;
    e !== null && (t.alternate = null, Tb(e)), t.child = null, t.deletions = null, t.sibling = null, t.tag === 5 && (e = t.stateNode, e !== null && vm(e)), t.stateNode = null, t.return = null, t.dependencies = null, t.memoizedProps = null, t.memoizedState = null, t.pendingProps = null, t.stateNode = null, t.updateQueue = null;
  }
  var Ut = null, Ye = false;
  function oi(t, e, n) {
    for (n = n.child; n !== null; ) xb(t, e, n), n = n.sibling;
  }
  function xb(t, e, n) {
    if (sn && typeof sn.onCommitFiberUnmount == "function") try {
      sn.onCommitFiberUnmount(ro, n);
    } catch {
    }
    switch (n.tag) {
      case 26:
        ae || Zn(n, e), oi(t, e, n), n.memoizedState ? n.memoizedState.count-- : n.stateNode && (n = n.stateNode, n.parentNode.removeChild(n));
        break;
      case 27:
        ae || Zn(n, e);
        var i = Ut, a = Ye;
        _a(n.type) && (Ut = n.stateNode, Ye = false), oi(t, e, n), gl(n.stateNode), Ut = i, Ye = a;
        break;
      case 5:
        ae || Zn(n, e);
      case 6:
        if (i = Ut, a = Ye, Ut = null, oi(t, e, n), Ut = i, Ye = a, Ut !== null) if (Ye) try {
          (Ut.nodeType === 9 ? Ut.body : Ut.nodeName === "HTML" ? Ut.ownerDocument.body : Ut).removeChild(n.stateNode);
        } catch (r) {
          gt(n, e, r);
        }
        else try {
          Ut.removeChild(n.stateNode);
        } catch (r) {
          gt(n, e, r);
        }
        break;
      case 18:
        Ut !== null && (Ye ? (t = Ut, hg(t.nodeType === 9 ? t.body : t.nodeName === "HTML" ? t.ownerDocument.body : t, n.stateNode), os(t)) : hg(Ut, n.stateNode));
        break;
      case 4:
        i = Ut, a = Ye, Ut = n.stateNode.containerInfo, Ye = true, oi(t, e, n), Ut = i, Ye = a;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        ha(2, n, e), ae || ha(4, n, e), oi(t, e, n);
        break;
      case 1:
        ae || (Zn(n, e), i = n.stateNode, typeof i.componentWillUnmount == "function" && gb(n, e, i)), oi(t, e, n);
        break;
      case 21:
        oi(t, e, n);
        break;
      case 22:
        ae = (i = ae) || n.memoizedState !== null, oi(t, e, n), ae = i;
        break;
      default:
        oi(t, e, n);
    }
  }
  function Ab(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null))) {
      t = t.dehydrated;
      try {
        os(t);
      } catch (n) {
        gt(e, e.return, n);
      }
    }
  }
  function Eb(t, e) {
    if (e.memoizedState === null && (t = e.alternate, t !== null && (t = t.memoizedState, t !== null && (t = t.dehydrated, t !== null)))) try {
      os(t);
    } catch (n) {
      gt(e, e.return, n);
    }
  }
  function cw(t) {
    switch (t.tag) {
      case 31:
      case 13:
      case 19:
        var e = t.stateNode;
        return e === null && (e = t.stateNode = new I0()), e;
      case 22:
        return t = t.stateNode, e = t._retryCache, e === null && (e = t._retryCache = new I0()), e;
      default:
        throw Error(j(435, t.tag));
    }
  }
  function Zo(t, e) {
    var n = cw(t);
    e.forEach(function(i) {
      if (!n.has(i)) {
        n.add(i);
        var a = _w.bind(null, t, i);
        i.then(a, a);
      }
    });
  }
  function Be(t, e) {
    var n = e.deletions;
    if (n !== null) for (var i = 0; i < n.length; i++) {
      var a = n[i], r = t, s = e, l = s;
      t: for (; l !== null; ) {
        switch (l.tag) {
          case 27:
            if (_a(l.type)) {
              Ut = l.stateNode, Ye = false;
              break t;
            }
            break;
          case 5:
            Ut = l.stateNode, Ye = false;
            break t;
          case 3:
          case 4:
            Ut = l.stateNode.containerInfo, Ye = true;
            break t;
        }
        l = l.return;
      }
      if (Ut === null) throw Error(j(160));
      xb(r, s, a), Ut = null, Ye = false, r = a.alternate, r !== null && (r.return = null), a.return = null;
    }
    if (e.subtreeFlags & 13886) for (e = e.child; e !== null; ) wb(e, t), e = e.sibling;
  }
  var Bn = null;
  function wb(t, e) {
    var n = t.alternate, i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        Be(e, t), He(t), i & 4 && (ha(3, t, t.return), ho(3, t), ha(5, t, t.return));
        break;
      case 1:
        Be(e, t), He(t), i & 512 && (ae || n === null || Zn(n, n.return)), i & 64 && mi && (t = t.updateQueue, t !== null && (i = t.callbacks, i !== null && (n = t.shared.hiddenCallbacks, t.shared.hiddenCallbacks = n === null ? i : n.concat(i))));
        break;
      case 26:
        var a = Bn;
        if (Be(e, t), He(t), i & 512 && (ae || n === null || Zn(n, n.return)), i & 4) {
          var r = n !== null ? n.memoizedState : null;
          if (i = t.memoizedState, n === null) if (i === null) if (t.stateNode === null) {
            t: {
              i = t.type, n = t.memoizedProps, a = a.ownerDocument || a;
              e: switch (i) {
                case "title":
                  r = a.getElementsByTagName("title")[0], (!r || r[oo] || r[be] || r.namespaceURI === "http://www.w3.org/2000/svg" || r.hasAttribute("itemprop")) && (r = a.createElement(i), a.head.insertBefore(r, a.querySelector("head > title"))), xe(r, i, n), r[be] = t, he(r), i = r;
                  break t;
                case "link":
                  var s = _g("link", "href", a).get(i + (n.href || ""));
                  if (s) {
                    for (var l = 0; l < s.length; l++) if (r = s[l], r.getAttribute("href") === (n.href == null || n.href === "" ? null : n.href) && r.getAttribute("rel") === (n.rel == null ? null : n.rel) && r.getAttribute("title") === (n.title == null ? null : n.title) && r.getAttribute("crossorigin") === (n.crossOrigin == null ? null : n.crossOrigin)) {
                      s.splice(l, 1);
                      break e;
                    }
                  }
                  r = a.createElement(i), xe(r, i, n), a.head.appendChild(r);
                  break;
                case "meta":
                  if (s = _g("meta", "content", a).get(i + (n.content || ""))) {
                    for (l = 0; l < s.length; l++) if (r = s[l], r.getAttribute("content") === (n.content == null ? null : "" + n.content) && r.getAttribute("name") === (n.name == null ? null : n.name) && r.getAttribute("property") === (n.property == null ? null : n.property) && r.getAttribute("http-equiv") === (n.httpEquiv == null ? null : n.httpEquiv) && r.getAttribute("charset") === (n.charSet == null ? null : n.charSet)) {
                      s.splice(l, 1);
                      break e;
                    }
                  }
                  r = a.createElement(i), xe(r, i, n), a.head.appendChild(r);
                  break;
                default:
                  throw Error(j(468, i));
              }
              r[be] = t, he(r), i = r;
            }
            t.stateNode = i;
          } else bg(a, t.type, t.stateNode);
          else t.stateNode = vg(a, i, t.memoizedProps);
          else r !== i ? (r === null ? n.stateNode !== null && (n = n.stateNode, n.parentNode.removeChild(n)) : r.count--, i === null ? bg(a, t.type, t.stateNode) : vg(a, i, t.memoizedProps)) : i === null && t.stateNode !== null && Xf(t, t.memoizedProps, n.memoizedProps);
        }
        break;
      case 27:
        Be(e, t), He(t), i & 512 && (ae || n === null || Zn(n, n.return)), n !== null && i & 4 && Xf(t, t.memoizedProps, n.memoizedProps);
        break;
      case 5:
        if (Be(e, t), He(t), i & 512 && (ae || n === null || Zn(n, n.return)), t.flags & 32) {
          a = t.stateNode;
          try {
            ts(a, "");
          } catch (T) {
            gt(t, t.return, T);
          }
        }
        i & 4 && t.stateNode != null && (a = t.memoizedProps, Xf(t, a, n !== null ? n.memoizedProps : a)), i & 1024 && (qf = true);
        break;
      case 6:
        if (Be(e, t), He(t), i & 4) {
          if (t.stateNode === null) throw Error(j(162));
          i = t.memoizedProps, n = t.stateNode;
          try {
            n.nodeValue = i;
          } catch (T) {
            gt(t, t.return, T);
          }
        }
        break;
      case 3:
        if (_u = null, a = Bn, Bn = ic(e.containerInfo), Be(e, t), Bn = a, He(t), i & 4 && n !== null && n.memoizedState.isDehydrated) try {
          os(e.containerInfo);
        } catch (T) {
          gt(t, t.return, T);
        }
        qf && (qf = false, Mb(t));
        break;
      case 4:
        i = Bn, Bn = ic(t.stateNode.containerInfo), Be(e, t), He(t), Bn = i;
        break;
      case 12:
        Be(e, t), He(t);
        break;
      case 31:
        Be(e, t), He(t), i & 4 && (i = t.updateQueue, i !== null && (t.updateQueue = null, Zo(t, i)));
        break;
      case 13:
        Be(e, t), He(t), t.child.flags & 8192 && t.memoizedState !== null != (n !== null && n.memoizedState !== null) && (jc = rn()), i & 4 && (i = t.updateQueue, i !== null && (t.updateQueue = null, Zo(t, i)));
        break;
      case 22:
        a = t.memoizedState !== null;
        var o = n !== null && n.memoizedState !== null, c = mi, f = ae;
        if (mi = c || a, ae = f || o, Be(e, t), ae = f, mi = c, He(t), i & 8192) t: for (e = t.stateNode, e._visibility = a ? e._visibility & -2 : e._visibility | 1, a && (n === null || o || mi || ae || La(t)), n = null, e = t; ; ) {
          if (e.tag === 5 || e.tag === 26) {
            if (n === null) {
              o = n = e;
              try {
                if (r = o.stateNode, a) s = r.style, typeof s.setProperty == "function" ? s.setProperty("display", "none", "important") : s.display = "none";
                else {
                  l = o.stateNode;
                  var d = o.memoizedProps.style, m = d != null && d.hasOwnProperty("display") ? d.display : null;
                  l.style.display = m == null || typeof m == "boolean" ? "" : ("" + m).trim();
                }
              } catch (T) {
                gt(o, o.return, T);
              }
            }
          } else if (e.tag === 6) {
            if (n === null) {
              o = e;
              try {
                o.stateNode.nodeValue = a ? "" : o.memoizedProps;
              } catch (T) {
                gt(o, o.return, T);
              }
            }
          } else if (e.tag === 18) {
            if (n === null) {
              o = e;
              try {
                var y = o.stateNode;
                a ? dg(y, true) : dg(o.stateNode, false);
              } catch (T) {
                gt(o, o.return, T);
              }
            }
          } else if ((e.tag !== 22 && e.tag !== 23 || e.memoizedState === null || e === t) && e.child !== null) {
            e.child.return = e, e = e.child;
            continue;
          }
          if (e === t) break t;
          for (; e.sibling === null; ) {
            if (e.return === null || e.return === t) break t;
            n === e && (n = null), e = e.return;
          }
          n === e && (n = null), e.sibling.return = e.return, e = e.sibling;
        }
        i & 4 && (i = t.updateQueue, i !== null && (n = i.retryQueue, n !== null && (i.retryQueue = null, Zo(t, n))));
        break;
      case 19:
        Be(e, t), He(t), i & 4 && (i = t.updateQueue, i !== null && (t.updateQueue = null, Zo(t, i)));
        break;
      case 30:
        break;
      case 21:
        break;
      default:
        Be(e, t), He(t);
    }
  }
  function He(t) {
    var e = t.flags;
    if (e & 2) {
      try {
        for (var n, i = t.return; i !== null; ) {
          if (_b(i)) {
            n = i;
            break;
          }
          i = i.return;
        }
        if (n == null) throw Error(j(160));
        switch (n.tag) {
          case 27:
            var a = n.stateNode, r = Ff(t);
            Zu(t, r, a);
            break;
          case 5:
            var s = n.stateNode;
            n.flags & 32 && (ts(s, ""), n.flags &= -33);
            var l = Ff(t);
            Zu(t, l, s);
            break;
          case 3:
          case 4:
            var o = n.stateNode.containerInfo, c = Ff(t);
            od(t, c, o);
            break;
          default:
            throw Error(j(161));
        }
      } catch (f) {
        gt(t, t.return, f);
      }
      t.flags &= -3;
    }
    e & 4096 && (t.flags &= -4097);
  }
  function Mb(t) {
    if (t.subtreeFlags & 1024) for (t = t.child; t !== null; ) {
      var e = t;
      Mb(e), e.tag === 5 && e.flags & 1024 && e.stateNode.reset(), t = t.sibling;
    }
  }
  function ui(t, e) {
    if (e.subtreeFlags & 8772) for (e = e.child; e !== null; ) Sb(t, e.alternate, e), e = e.sibling;
  }
  function La(t) {
    for (t = t.child; t !== null; ) {
      var e = t;
      switch (e.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          ha(4, e, e.return), La(e);
          break;
        case 1:
          Zn(e, e.return);
          var n = e.stateNode;
          typeof n.componentWillUnmount == "function" && gb(e, e.return, n), La(e);
          break;
        case 27:
          gl(e.stateNode);
        case 26:
        case 5:
          Zn(e, e.return), La(e);
          break;
        case 22:
          e.memoizedState === null && La(e);
          break;
        case 30:
          La(e);
          break;
        default:
          La(e);
      }
      t = t.sibling;
    }
  }
  function ci(t, e, n) {
    for (n = n && (e.subtreeFlags & 8772) !== 0, e = e.child; e !== null; ) {
      var i = e.alternate, a = t, r = e, s = r.flags;
      switch (r.tag) {
        case 0:
        case 11:
        case 15:
          ci(a, r, n), ho(4, r);
          break;
        case 1:
          if (ci(a, r, n), i = r, a = i.stateNode, typeof a.componentDidMount == "function") try {
            a.componentDidMount();
          } catch (c) {
            gt(i, i.return, c);
          }
          if (i = r, a = i.updateQueue, a !== null) {
            var l = i.stateNode;
            try {
              var o = a.shared.hiddenCallbacks;
              if (o !== null) for (a.shared.hiddenCallbacks = null, a = 0; a < o.length; a++) A1(o[a], l);
            } catch (c) {
              gt(i, i.return, c);
            }
          }
          n && s & 64 && yb(r), dl(r, r.return);
          break;
        case 27:
          bb(r);
        case 26:
        case 5:
          ci(a, r, n), n && i === null && s & 4 && vb(r), dl(r, r.return);
          break;
        case 12:
          ci(a, r, n);
          break;
        case 31:
          ci(a, r, n), n && s & 4 && Ab(a, r);
          break;
        case 13:
          ci(a, r, n), n && s & 4 && Eb(a, r);
          break;
        case 22:
          r.memoizedState === null && ci(a, r, n), dl(r, r.return);
          break;
        case 30:
          break;
        default:
          ci(a, r, n);
      }
      e = e.sibling;
    }
  }
  function Jm(t, e) {
    var n = null;
    t !== null && t.memoizedState !== null && t.memoizedState.cachePool !== null && (n = t.memoizedState.cachePool.pool), t = null, e.memoizedState !== null && e.memoizedState.cachePool !== null && (t = e.memoizedState.cachePool.pool), t !== n && (t != null && t.refCount++, n != null && co(n));
  }
  function $m(t, e) {
    t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && co(t));
  }
  function Nn(t, e, n, i) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) Cb(t, e, n, i), e = e.sibling;
  }
  function Cb(t, e, n, i) {
    var a = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        Nn(t, e, n, i), a & 2048 && ho(9, e);
        break;
      case 1:
        Nn(t, e, n, i);
        break;
      case 3:
        Nn(t, e, n, i), a & 2048 && (t = null, e.alternate !== null && (t = e.alternate.memoizedState.cache), e = e.memoizedState.cache, e !== t && (e.refCount++, t != null && co(t)));
        break;
      case 12:
        if (a & 2048) {
          Nn(t, e, n, i), t = e.stateNode;
          try {
            var r = e.memoizedProps, s = r.id, l = r.onPostCommit;
            typeof l == "function" && l(s, e.alternate === null ? "mount" : "update", t.passiveEffectDuration, -0);
          } catch (o) {
            gt(e, e.return, o);
          }
        } else Nn(t, e, n, i);
        break;
      case 31:
        Nn(t, e, n, i);
        break;
      case 13:
        Nn(t, e, n, i);
        break;
      case 23:
        break;
      case 22:
        r = e.stateNode, s = e.alternate, e.memoizedState !== null ? r._visibility & 2 ? Nn(t, e, n, i) : ml(t, e) : r._visibility & 2 ? Nn(t, e, n, i) : (r._visibility |= 2, br(t, e, n, i, (e.subtreeFlags & 10256) !== 0 || false)), a & 2048 && Jm(s, e);
        break;
      case 24:
        Nn(t, e, n, i), a & 2048 && $m(e.alternate, e);
        break;
      default:
        Nn(t, e, n, i);
    }
  }
  function br(t, e, n, i, a) {
    for (a = a && ((e.subtreeFlags & 10256) !== 0 || false), e = e.child; e !== null; ) {
      var r = t, s = e, l = n, o = i, c = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          br(r, s, l, o, a), ho(8, s);
          break;
        case 23:
          break;
        case 22:
          var f = s.stateNode;
          s.memoizedState !== null ? f._visibility & 2 ? br(r, s, l, o, a) : ml(r, s) : (f._visibility |= 2, br(r, s, l, o, a)), a && c & 2048 && Jm(s.alternate, s);
          break;
        case 24:
          br(r, s, l, o, a), a && c & 2048 && $m(s.alternate, s);
          break;
        default:
          br(r, s, l, o, a);
      }
      e = e.sibling;
    }
  }
  function ml(t, e) {
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null; ) {
      var n = t, i = e, a = i.flags;
      switch (i.tag) {
        case 22:
          ml(n, i), a & 2048 && Jm(i.alternate, i);
          break;
        case 24:
          ml(n, i), a & 2048 && $m(i.alternate, i);
          break;
        default:
          ml(n, i);
      }
      e = e.sibling;
    }
  }
  var tl = 8192;
  function yr(t, e, n) {
    if (t.subtreeFlags & tl) for (t = t.child; t !== null; ) Db(t, e, n), t = t.sibling;
  }
  function Db(t, e, n) {
    switch (t.tag) {
      case 26:
        yr(t, e, n), t.flags & tl && t.memoizedState !== null && Jw(n, Bn, t.memoizedState, t.memoizedProps);
        break;
      case 5:
        yr(t, e, n);
        break;
      case 3:
      case 4:
        var i = Bn;
        Bn = ic(t.stateNode.containerInfo), yr(t, e, n), Bn = i;
        break;
      case 22:
        t.memoizedState === null && (i = t.alternate, i !== null && i.memoizedState !== null ? (i = tl, tl = 16777216, yr(t, e, n), tl = i) : yr(t, e, n));
        break;
      default:
        yr(t, e, n);
    }
  }
  function Rb(t) {
    var e = t.alternate;
    if (e !== null && (t = e.child, t !== null)) {
      e.child = null;
      do
        e = t.sibling, t.sibling = null, t = e;
      while (t !== null);
    }
  }
  function Fs(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null) for (var n = 0; n < e.length; n++) {
        var i = e[n];
        fe = i, zb(i, t);
      }
      Rb(t);
    }
    if (t.subtreeFlags & 10256) for (t = t.child; t !== null; ) Ob(t), t = t.sibling;
  }
  function Ob(t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        Fs(t), t.flags & 2048 && ha(9, t, t.return);
        break;
      case 3:
        Fs(t);
        break;
      case 12:
        Fs(t);
        break;
      case 22:
        var e = t.stateNode;
        t.memoizedState !== null && e._visibility & 2 && (t.return === null || t.return.tag !== 13) ? (e._visibility &= -3, gu(t)) : Fs(t);
        break;
      default:
        Fs(t);
    }
  }
  function gu(t) {
    var e = t.deletions;
    if (t.flags & 16) {
      if (e !== null) for (var n = 0; n < e.length; n++) {
        var i = e[n];
        fe = i, zb(i, t);
      }
      Rb(t);
    }
    for (t = t.child; t !== null; ) {
      switch (e = t, e.tag) {
        case 0:
        case 11:
        case 15:
          ha(8, e, e.return), gu(e);
          break;
        case 22:
          n = e.stateNode, n._visibility & 2 && (n._visibility &= -3, gu(e));
          break;
        default:
          gu(e);
      }
      t = t.sibling;
    }
  }
  function zb(t, e) {
    for (; fe !== null; ) {
      var n = fe;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          ha(8, n, e);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var i = n.memoizedState.cachePool.pool;
            i != null && i.refCount++;
          }
          break;
        case 24:
          co(n.memoizedState.cache);
      }
      if (i = n.child, i !== null) i.return = n, fe = i;
      else t: for (n = t; fe !== null; ) {
        i = fe;
        var a = i.sibling, r = i.return;
        if (Tb(i), i === n) {
          fe = null;
          break t;
        }
        if (a !== null) {
          a.return = r, fe = a;
          break t;
        }
        fe = r;
      }
    }
  }
  var fw = {
    getCacheForType: function(t) {
      var e = Te(se), n = e.data.get(t);
      return n === void 0 && (n = t(), e.data.set(t, n)), n;
    },
    cacheSignal: function() {
      return Te(se).controller.signal;
    }
  }, hw = typeof WeakMap == "function" ? WeakMap : Map, dt = 0, xt = null, lt = null, ot = 0, yt = 0, $e = null, qi = false, xs = false, Wm = false, wi = 0, Ft = 0, da = 0, Fa = 0, Im = 0, nn = 0, as = 0, pl = null, Ge = null, ud = false, jc = 0, Ub = 0, Ju = 1 / 0, $u = null, ia = null, ue = 0, aa = null, rs = null, bi = 0, cd = 0, fd = null, Vb = null, yl = 0, hd = null;
  function on() {
    return dt & 2 && ot !== 0 ? ot & -ot : et.T !== null ? ep() : k_();
  }
  function Lb() {
    if (nn === 0) if (!(ot & 536870912) || ut) {
      var t = Go;
      Go <<= 1, !(Go & 3932160) && (Go = 262144), nn = t;
    } else nn = 536870912;
    return t = fn.current, t !== null && (t.flags |= 32), nn;
  }
  function ke(t, e, n) {
    (t === xt && (yt === 2 || yt === 9) || t.cancelPendingCommit !== null) && (ss(t, 0), Ki(t, ot, nn, false)), lo(t, n), (!(dt & 2) || t !== xt) && (t === xt && (!(dt & 2) && (Fa |= n), Ft === 4 && Ki(t, ot, nn, false)), ni(t));
  }
  function Nb(t, e, n) {
    if (dt & 6) throw Error(j(327));
    var i = !n && (e & 127) === 0 && (e & t.expiredLanes) === 0 || so(t, e), a = i ? pw(t, e) : Kf(t, e, true), r = i;
    do {
      if (a === 0) {
        xs && !i && Ki(t, e, 0, false);
        break;
      } else {
        if (n = t.current.alternate, r && !dw(n)) {
          a = Kf(t, e, false), r = false;
          continue;
        }
        if (a === 2) {
          if (r = e, t.errorRecoveryDisabledLanes & r) var s = 0;
          else s = t.pendingLanes & -536870913, s = s !== 0 ? s : s & 536870912 ? 536870912 : 0;
          if (s !== 0) {
            e = s;
            t: {
              var l = t;
              a = pl;
              var o = l.current.memoizedState.isDehydrated;
              if (o && (ss(l, s).flags |= 256), s = Kf(l, s, false), s !== 2) {
                if (Wm && !o) {
                  l.errorRecoveryDisabledLanes |= r, Fa |= r, a = 4;
                  break t;
                }
                r = Ge, Ge = a, r !== null && (Ge === null ? Ge = r : Ge.push.apply(Ge, r));
              }
              a = s;
            }
            if (r = false, a !== 2) continue;
          }
        }
        if (a === 1) {
          ss(t, 0), Ki(t, e, 0, true);
          break;
        }
        t: {
          switch (i = t, r = a, r) {
            case 0:
            case 1:
              throw Error(j(345));
            case 4:
              if ((e & 4194048) !== e) break;
            case 6:
              Ki(i, e, nn, !qi);
              break t;
            case 2:
              Ge = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(j(329));
          }
          if ((e & 62914560) === e && (a = jc + 300 - rn(), 10 < a)) {
            if (Ki(i, e, nn, !qi), wc(i, 0, true) !== 0) break t;
            bi = e, i.timeoutHandle = nS(tg.bind(null, i, n, Ge, $u, ud, e, nn, Fa, as, qi, r, "Throttled", -0, 0), a);
            break t;
          }
          tg(i, n, Ge, $u, ud, e, nn, Fa, as, qi, r, null, -0, 0);
        }
      }
      break;
    } while (true);
    ni(t);
  }
  function tg(t, e, n, i, a, r, s, l, o, c, f, d, m, y) {
    if (t.timeoutHandle = -1, d = e.subtreeFlags, d & 8192 || (d & 16785408) === 16785408) {
      d = {
        stylesheets: null,
        count: 0,
        imgCount: 0,
        imgBytes: 0,
        suspenseyImages: [],
        waitingForImages: true,
        waitingForViewTransition: false,
        unsuspend: yi
      }, Db(e, r, d);
      var T = (r & 62914560) === r ? jc - rn() : (r & 4194048) === r ? Ub - rn() : 0;
      if (T = $w(d, T), T !== null) {
        bi = r, t.cancelPendingCommit = T(ng.bind(null, t, e, r, n, i, a, s, l, o, f, d, null, m, y)), Ki(t, r, s, !c);
        return;
      }
    }
    ng(t, e, r, n, i, a, s, l, o);
  }
  function dw(t) {
    for (var e = t; ; ) {
      var n = e.tag;
      if ((n === 0 || n === 11 || n === 15) && e.flags & 16384 && (n = e.updateQueue, n !== null && (n = n.stores, n !== null))) for (var i = 0; i < n.length; i++) {
        var a = n[i], r = a.getSnapshot;
        a = a.value;
        try {
          if (!cn(r(), a)) return false;
        } catch {
          return false;
        }
      }
      if (n = e.child, e.subtreeFlags & 16384 && n !== null) n.return = e, e = n;
      else {
        if (e === t) break;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) return true;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
    }
    return true;
  }
  function Ki(t, e, n, i) {
    e &= ~Im, e &= ~Fa, t.suspendedLanes |= e, t.pingedLanes &= ~e, i && (t.warmLanes |= e), i = t.expirationTimes;
    for (var a = e; 0 < a; ) {
      var r = 31 - ln(a), s = 1 << r;
      i[r] = -1, a &= ~s;
    }
    n !== 0 && Y_(t, n, e);
  }
  function Bc() {
    return dt & 6 ? true : (mo(0), false);
  }
  function tp() {
    if (lt !== null) {
      if (yt === 0) var t = lt.return;
      else t = lt, gi = ur = null, Hm(t), Fr = null, Ll = 0, t = lt;
      for (; t !== null; ) pb(t.alternate, t), t = t.return;
      lt = null;
    }
  }
  function ss(t, e) {
    var n = t.timeoutHandle;
    n !== -1 && (t.timeoutHandle = -1, Uw(n)), n = t.cancelPendingCommit, n !== null && (t.cancelPendingCommit = null, n()), bi = 0, tp(), xt = t, lt = n = vi(t.current, null), ot = e, yt = 0, $e = null, qi = false, xs = so(t, e), Wm = false, as = nn = Im = Fa = da = Ft = 0, Ge = pl = null, ud = false, e & 8 && (e |= e & 32);
    var i = t.entangledLanes;
    if (i !== 0) for (t = t.entanglements, i &= e; 0 < i; ) {
      var a = 31 - ln(i), r = 1 << a;
      e |= t[a], i &= ~r;
    }
    return wi = e, Rc(), n;
  }
  function jb(t, e) {
    at = null, et.H = jl, e === Ts || e === zc ? (e = z0(), yt = 3) : e === zm ? (e = z0(), yt = 4) : yt = e === Qm ? 8 : e !== null && typeof e == "object" && typeof e.then == "function" ? 6 : 1, $e = e, lt === null && (Ft = 1, Ku(t, An(e, t.current)));
  }
  function Bb() {
    var t = fn.current;
    return t === null ? true : (ot & 4194048) === ot ? Rn === null : (ot & 62914560) === ot || ot & 536870912 ? t === Rn : false;
  }
  function Hb() {
    var t = et.H;
    return et.H = jl, t === null ? jl : t;
  }
  function Yb() {
    var t = et.A;
    return et.A = fw, t;
  }
  function Wu() {
    Ft = 4, qi || (ot & 4194048) !== ot && fn.current !== null || (xs = true), !(da & 134217727) && !(Fa & 134217727) || xt === null || Ki(xt, ot, nn, false);
  }
  function Kf(t, e, n) {
    var i = dt;
    dt |= 2;
    var a = Hb(), r = Yb();
    (xt !== t || ot !== e) && ($u = null, ss(t, e)), e = false;
    var s = Ft;
    t: do
      try {
        if (yt !== 0 && lt !== null) {
          var l = lt, o = $e;
          switch (yt) {
            case 8:
              tp(), s = 6;
              break t;
            case 3:
            case 2:
            case 9:
            case 6:
              fn.current === null && (e = true);
              var c = yt;
              if (yt = 0, $e = null, Ur(t, l, o, c), n && xs) {
                s = 0;
                break t;
              }
              break;
            default:
              c = yt, yt = 0, $e = null, Ur(t, l, o, c);
          }
        }
        mw(), s = Ft;
        break;
      } catch (f) {
        jb(t, f);
      }
    while (true);
    return e && t.shellSuspendCounter++, gi = ur = null, dt = i, et.H = a, et.A = r, lt === null && (xt = null, ot = 0, Rc()), s;
  }
  function mw() {
    for (; lt !== null; ) Gb(lt);
  }
  function pw(t, e) {
    var n = dt;
    dt |= 2;
    var i = Hb(), a = Yb();
    xt !== t || ot !== e ? ($u = null, Ju = rn() + 500, ss(t, e)) : xs = so(t, e);
    t: do
      try {
        if (yt !== 0 && lt !== null) {
          e = lt;
          var r = $e;
          e: switch (yt) {
            case 1:
              yt = 0, $e = null, Ur(t, e, r, 1);
              break;
            case 2:
            case 9:
              if (O0(r)) {
                yt = 0, $e = null, eg(e);
                break;
              }
              e = function() {
                yt !== 2 && yt !== 9 || xt !== t || (yt = 7), ni(t);
              }, r.then(e, e);
              break t;
            case 3:
              yt = 7;
              break t;
            case 4:
              yt = 5;
              break t;
            case 7:
              O0(r) ? (yt = 0, $e = null, eg(e)) : (yt = 0, $e = null, Ur(t, e, r, 7));
              break;
            case 5:
              var s = null;
              switch (lt.tag) {
                case 26:
                  s = lt.memoizedState;
                case 5:
                case 27:
                  var l = lt;
                  if (s ? lS(s) : l.stateNode.complete) {
                    yt = 0, $e = null;
                    var o = l.sibling;
                    if (o !== null) lt = o;
                    else {
                      var c = l.return;
                      c !== null ? (lt = c, Hc(c)) : lt = null;
                    }
                    break e;
                  }
              }
              yt = 0, $e = null, Ur(t, e, r, 5);
              break;
            case 6:
              yt = 0, $e = null, Ur(t, e, r, 6);
              break;
            case 8:
              tp(), Ft = 6;
              break t;
            default:
              throw Error(j(462));
          }
        }
        yw();
        break;
      } catch (f) {
        jb(t, f);
      }
    while (true);
    return gi = ur = null, et.H = i, et.A = a, dt = n, lt !== null ? 0 : (xt = null, ot = 0, Rc(), Ft);
  }
  function yw() {
    for (; lt !== null && !HA(); ) Gb(lt);
  }
  function Gb(t) {
    var e = mb(t.alternate, t, wi);
    t.memoizedProps = t.pendingProps, e === null ? Hc(t) : lt = e;
  }
  function eg(t) {
    var e = t, n = e.alternate;
    switch (e.tag) {
      case 15:
      case 0:
        e = Q0(n, e, e.pendingProps, e.type, void 0, ot);
        break;
      case 11:
        e = Q0(n, e, e.pendingProps, e.type.render, e.ref, ot);
        break;
      case 5:
        Hm(e);
      default:
        pb(n, e), e = lt = p1(e, wi), e = mb(n, e, wi);
    }
    t.memoizedProps = t.pendingProps, e === null ? Hc(t) : lt = e;
  }
  function Ur(t, e, n, i) {
    gi = ur = null, Hm(e), Fr = null, Ll = 0;
    var a = e.return;
    try {
      if (aw(t, a, e, n, ot)) {
        Ft = 1, Ku(t, An(n, t.current)), lt = null;
        return;
      }
    } catch (r) {
      if (a !== null) throw lt = a, r;
      Ft = 1, Ku(t, An(n, t.current)), lt = null;
      return;
    }
    e.flags & 32768 ? (ut || i === 1 ? t = true : xs || ot & 536870912 ? t = false : (qi = t = true, (i === 2 || i === 9 || i === 3 || i === 6) && (i = fn.current, i !== null && i.tag === 13 && (i.flags |= 16384))), Pb(e, t)) : Hc(e);
  }
  function Hc(t) {
    var e = t;
    do {
      if (e.flags & 32768) {
        Pb(e, qi);
        return;
      }
      t = e.return;
      var n = lw(e.alternate, e, wi);
      if (n !== null) {
        lt = n;
        return;
      }
      if (e = e.sibling, e !== null) {
        lt = e;
        return;
      }
      lt = e = t;
    } while (e !== null);
    Ft === 0 && (Ft = 5);
  }
  function Pb(t, e) {
    do {
      var n = ow(t.alternate, t);
      if (n !== null) {
        n.flags &= 32767, lt = n;
        return;
      }
      if (n = t.return, n !== null && (n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null), !e && (t = t.sibling, t !== null)) {
        lt = t;
        return;
      }
      lt = t = n;
    } while (t !== null);
    Ft = 6, lt = null;
  }
  function ng(t, e, n, i, a, r, s, l, o) {
    t.cancelPendingCommit = null;
    do
      Yc();
    while (ue !== 0);
    if (dt & 6) throw Error(j(327));
    if (e !== null) {
      if (e === t.current) throw Error(j(177));
      if (r = e.lanes | e.childLanes, r |= Em, ZA(t, n, r, s, l, o), t === xt && (lt = xt = null, ot = 0), rs = e, aa = t, bi = n, cd = r, fd = a, Vb = i, e.subtreeFlags & 10256 || e.flags & 10256 ? (t.callbackNode = null, t.callbackPriority = 0, bw(Nu, function() {
        return Kb(), null;
      })) : (t.callbackNode = null, t.callbackPriority = 0), i = (e.flags & 13878) !== 0, e.subtreeFlags & 13878 || i) {
        i = et.T, et.T = null, a = mt.p, mt.p = 2, s = dt, dt |= 4;
        try {
          uw(t, e, n);
        } finally {
          dt = s, mt.p = a, et.T = i;
        }
      }
      ue = 1, kb(), Xb(), Fb();
    }
  }
  function kb() {
    if (ue === 1) {
      ue = 0;
      var t = aa, e = rs, n = (e.flags & 13878) !== 0;
      if (e.subtreeFlags & 13878 || n) {
        n = et.T, et.T = null;
        var i = mt.p;
        mt.p = 2;
        var a = dt;
        dt |= 4;
        try {
          wb(e, t);
          var r = yd, s = l1(t.containerInfo), l = r.focusedElem, o = r.selectionRange;
          if (s !== l && l && l.ownerDocument && s1(l.ownerDocument.documentElement, l)) {
            if (o !== null && Am(l)) {
              var c = o.start, f = o.end;
              if (f === void 0 && (f = c), "selectionStart" in l) l.selectionStart = c, l.selectionEnd = Math.min(f, l.value.length);
              else {
                var d = l.ownerDocument || document, m = d && d.defaultView || window;
                if (m.getSelection) {
                  var y = m.getSelection(), T = l.textContent.length, b = Math.min(o.start, T), x = o.end === void 0 ? b : Math.min(o.end, T);
                  !y.extend && b > x && (s = x, x = b, b = s);
                  var v = A0(l, b), g = A0(l, x);
                  if (v && g && (y.rangeCount !== 1 || y.anchorNode !== v.node || y.anchorOffset !== v.offset || y.focusNode !== g.node || y.focusOffset !== g.offset)) {
                    var S = d.createRange();
                    S.setStart(v.node, v.offset), y.removeAllRanges(), b > x ? (y.addRange(S), y.extend(g.node, g.offset)) : (S.setEnd(g.node, g.offset), y.addRange(S));
                  }
                }
              }
            }
            for (d = [], y = l; y = y.parentNode; ) y.nodeType === 1 && d.push({
              element: y,
              left: y.scrollLeft,
              top: y.scrollTop
            });
            for (typeof l.focus == "function" && l.focus(), l = 0; l < d.length; l++) {
              var A = d[l];
              A.element.scrollLeft = A.left, A.element.scrollTop = A.top;
            }
          }
          sc = !!pd, yd = pd = null;
        } finally {
          dt = a, mt.p = i, et.T = n;
        }
      }
      t.current = e, ue = 2;
    }
  }
  function Xb() {
    if (ue === 2) {
      ue = 0;
      var t = aa, e = rs, n = (e.flags & 8772) !== 0;
      if (e.subtreeFlags & 8772 || n) {
        n = et.T, et.T = null;
        var i = mt.p;
        mt.p = 2;
        var a = dt;
        dt |= 4;
        try {
          Sb(t, e.alternate, e);
        } finally {
          dt = a, mt.p = i, et.T = n;
        }
      }
      ue = 3;
    }
  }
  function Fb() {
    if (ue === 4 || ue === 3) {
      ue = 0, YA();
      var t = aa, e = rs, n = bi, i = Vb;
      e.subtreeFlags & 10256 || e.flags & 10256 ? ue = 5 : (ue = 0, rs = aa = null, qb(t, t.pendingLanes));
      var a = t.pendingLanes;
      if (a === 0 && (ia = null), gm(n), e = e.stateNode, sn && typeof sn.onCommitFiberRoot == "function") try {
        sn.onCommitFiberRoot(ro, e, void 0, (e.current.flags & 128) === 128);
      } catch {
      }
      if (i !== null) {
        e = et.T, a = mt.p, mt.p = 2, et.T = null;
        try {
          for (var r = t.onRecoverableError, s = 0; s < i.length; s++) {
            var l = i[s];
            r(l.value, {
              componentStack: l.stack
            });
          }
        } finally {
          et.T = e, mt.p = a;
        }
      }
      bi & 3 && Yc(), ni(t), a = t.pendingLanes, n & 261930 && a & 42 ? t === hd ? yl++ : (yl = 0, hd = t) : yl = 0, mo(0);
    }
  }
  function qb(t, e) {
    (t.pooledCacheLanes &= e) === 0 && (e = t.pooledCache, e != null && (t.pooledCache = null, co(e)));
  }
  function Yc() {
    return kb(), Xb(), Fb(), Kb();
  }
  function Kb() {
    if (ue !== 5) return false;
    var t = aa, e = cd;
    cd = 0;
    var n = gm(bi), i = et.T, a = mt.p;
    try {
      mt.p = 32 > n ? 32 : n, et.T = null, n = fd, fd = null;
      var r = aa, s = bi;
      if (ue = 0, rs = aa = null, bi = 0, dt & 6) throw Error(j(331));
      var l = dt;
      if (dt |= 4, Ob(r.current), Cb(r, r.current, s, n), dt = l, mo(0, false), sn && typeof sn.onPostCommitFiberRoot == "function") try {
        sn.onPostCommitFiberRoot(ro, r);
      } catch {
      }
      return true;
    } finally {
      mt.p = a, et.T = i, qb(t, e);
    }
  }
  function ig(t, e, n) {
    e = An(n, e), e = rd(t.stateNode, e, 2), t = na(t, e, 2), t !== null && (lo(t, 2), ni(t));
  }
  function gt(t, e, n) {
    if (t.tag === 3) ig(t, t, n);
    else for (; e !== null; ) {
      if (e.tag === 3) {
        ig(e, t, n);
        break;
      } else if (e.tag === 1) {
        var i = e.stateNode;
        if (typeof e.type.getDerivedStateFromError == "function" || typeof i.componentDidCatch == "function" && (ia === null || !ia.has(i))) {
          t = An(n, t), n = ob(2), i = na(e, n, 2), i !== null && (ub(n, i, e, t), lo(i, 2), ni(i));
          break;
        }
      }
      e = e.return;
    }
  }
  function Qf(t, e, n) {
    var i = t.pingCache;
    if (i === null) {
      i = t.pingCache = new hw();
      var a = /* @__PURE__ */ new Set();
      i.set(e, a);
    } else a = i.get(e), a === void 0 && (a = /* @__PURE__ */ new Set(), i.set(e, a));
    a.has(n) || (Wm = true, a.add(n), t = gw.bind(null, t, e, n), e.then(t, t));
  }
  function gw(t, e, n) {
    var i = t.pingCache;
    i !== null && i.delete(e), t.pingedLanes |= t.suspendedLanes & n, t.warmLanes &= ~n, xt === t && (ot & n) === n && (Ft === 4 || Ft === 3 && (ot & 62914560) === ot && 300 > rn() - jc ? !(dt & 2) && ss(t, 0) : Im |= n, as === ot && (as = 0)), ni(t);
  }
  function Qb(t, e) {
    e === 0 && (e = H_()), t = or(t, e), t !== null && (lo(t, e), ni(t));
  }
  function vw(t) {
    var e = t.memoizedState, n = 0;
    e !== null && (n = e.retryLane), Qb(t, n);
  }
  function _w(t, e) {
    var n = 0;
    switch (t.tag) {
      case 31:
      case 13:
        var i = t.stateNode, a = t.memoizedState;
        a !== null && (n = a.retryLane);
        break;
      case 19:
        i = t.stateNode;
        break;
      case 22:
        i = t.stateNode._retryCache;
        break;
      default:
        throw Error(j(314));
    }
    i !== null && i.delete(e), Qb(t, n);
  }
  function bw(t, e) {
    return pm(t, e);
  }
  var Iu = null, Sr = null, dd = false, tc = false, Zf = false, Qi = 0;
  function ni(t) {
    t !== Sr && t.next === null && (Sr === null ? Iu = Sr = t : Sr = Sr.next = t), tc = true, dd || (dd = true, Tw());
  }
  function mo(t, e) {
    if (!Zf && tc) {
      Zf = true;
      do
        for (var n = false, i = Iu; i !== null; ) {
          if (t !== 0) {
            var a = i.pendingLanes;
            if (a === 0) var r = 0;
            else {
              var s = i.suspendedLanes, l = i.pingedLanes;
              r = (1 << 31 - ln(42 | t) + 1) - 1, r &= a & ~(s & ~l), r = r & 201326741 ? r & 201326741 | 1 : r ? r | 2 : 0;
            }
            r !== 0 && (n = true, ag(i, r));
          } else r = ot, r = wc(i, i === xt ? r : 0, i.cancelPendingCommit !== null || i.timeoutHandle !== -1), !(r & 3) || so(i, r) || (n = true, ag(i, r));
          i = i.next;
        }
      while (n);
      Zf = false;
    }
  }
  function Sw() {
    Zb();
  }
  function Zb() {
    tc = dd = false;
    var t = 0;
    Qi !== 0 && zw() && (t = Qi);
    for (var e = rn(), n = null, i = Iu; i !== null; ) {
      var a = i.next, r = Jb(i, e);
      r === 0 ? (i.next = null, n === null ? Iu = a : n.next = a, a === null && (Sr = n)) : (n = i, (t !== 0 || r & 3) && (tc = true)), i = a;
    }
    ue !== 0 && ue !== 5 || mo(t), Qi !== 0 && (Qi = 0);
  }
  function Jb(t, e) {
    for (var n = t.suspendedLanes, i = t.pingedLanes, a = t.expirationTimes, r = t.pendingLanes & -62914561; 0 < r; ) {
      var s = 31 - ln(r), l = 1 << s, o = a[s];
      o === -1 ? (!(l & n) || l & i) && (a[s] = QA(l, e)) : o <= e && (t.expiredLanes |= l), r &= ~l;
    }
    if (e = xt, n = ot, n = wc(t, t === e ? n : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), i = t.callbackNode, n === 0 || t === e && (yt === 2 || yt === 9) || t.cancelPendingCommit !== null) return i !== null && i !== null && xf(i), t.callbackNode = null, t.callbackPriority = 0;
    if (!(n & 3) || so(t, n)) {
      if (e = n & -n, e === t.callbackPriority) return e;
      switch (i !== null && xf(i), gm(n)) {
        case 2:
        case 8:
          n = j_;
          break;
        case 32:
          n = Nu;
          break;
        case 268435456:
          n = B_;
          break;
        default:
          n = Nu;
      }
      return i = $b.bind(null, t), n = pm(n, i), t.callbackPriority = e, t.callbackNode = n, e;
    }
    return i !== null && i !== null && xf(i), t.callbackPriority = 2, t.callbackNode = null, 2;
  }
  function $b(t, e) {
    if (ue !== 0 && ue !== 5) return t.callbackNode = null, t.callbackPriority = 0, null;
    var n = t.callbackNode;
    if (Yc() && t.callbackNode !== n) return null;
    var i = ot;
    return i = wc(t, t === xt ? i : 0, t.cancelPendingCommit !== null || t.timeoutHandle !== -1), i === 0 ? null : (Nb(t, i, e), Jb(t, rn()), t.callbackNode != null && t.callbackNode === n ? $b.bind(null, t) : null);
  }
  function ag(t, e) {
    if (Yc()) return null;
    Nb(t, e, true);
  }
  function Tw() {
    Vw(function() {
      dt & 6 ? pm(N_, Sw) : Zb();
    });
  }
  function ep() {
    if (Qi === 0) {
      var t = es;
      t === 0 && (t = Yo, Yo <<= 1, !(Yo & 261888) && (Yo = 256)), Qi = t;
    }
    return Qi;
  }
  function rg(t) {
    return t == null || typeof t == "symbol" || typeof t == "boolean" ? null : typeof t == "function" ? t : ou("" + t);
  }
  function sg(t, e) {
    var n = e.ownerDocument.createElement("input");
    return n.name = e.name, n.value = e.value, t.id && n.setAttribute("form", t.id), e.parentNode.insertBefore(n, e), t = new FormData(t), n.parentNode.removeChild(n), t;
  }
  function xw(t, e, n, i, a) {
    if (e === "submit" && n && n.stateNode === a) {
      var r = rg((a[Qe] || null).action), s = i.submitter;
      s && (e = (e = s[Qe] || null) ? rg(e.formAction) : s.getAttribute("formAction"), e !== null && (r = e, s = null));
      var l = new Mc("action", "action", null, i, a);
      t.push({
        event: l,
        listeners: [
          {
            instance: null,
            listener: function() {
              if (i.defaultPrevented) {
                if (Qi !== 0) {
                  var o = s ? sg(a, s) : new FormData(a);
                  id(n, {
                    pending: true,
                    data: o,
                    method: a.method,
                    action: r
                  }, null, o);
                }
              } else typeof r == "function" && (l.preventDefault(), o = s ? sg(a, s) : new FormData(a), id(n, {
                pending: true,
                data: o,
                method: a.method,
                action: r
              }, r, o));
            },
            currentTarget: a
          }
        ]
      });
    }
  }
  for (var Jf = 0; Jf < Fh.length; Jf++) {
    var $f = Fh[Jf], Aw = $f.toLowerCase(), Ew = $f[0].toUpperCase() + $f.slice(1);
    Yn(Aw, "on" + Ew);
  }
  Yn(u1, "onAnimationEnd");
  Yn(c1, "onAnimationIteration");
  Yn(f1, "onAnimationStart");
  Yn("dblclick", "onDoubleClick");
  Yn("focusin", "onFocus");
  Yn("focusout", "onBlur");
  Yn(GE, "onTransitionRun");
  Yn(PE, "onTransitionStart");
  Yn(kE, "onTransitionCancel");
  Yn(h1, "onTransitionEnd");
  Ir("onMouseEnter", [
    "mouseout",
    "mouseover"
  ]);
  Ir("onMouseLeave", [
    "mouseout",
    "mouseover"
  ]);
  Ir("onPointerEnter", [
    "pointerout",
    "pointerover"
  ]);
  Ir("onPointerLeave", [
    "pointerout",
    "pointerover"
  ]);
  rr("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  rr("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  rr("onBeforeInput", [
    "compositionend",
    "keypress",
    "textInput",
    "paste"
  ]);
  rr("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  rr("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  rr("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Bl = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), ww = new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(Bl));
  function Wb(t, e) {
    e = (e & 4) !== 0;
    for (var n = 0; n < t.length; n++) {
      var i = t[n], a = i.event;
      i = i.listeners;
      t: {
        var r = void 0;
        if (e) for (var s = i.length - 1; 0 <= s; s--) {
          var l = i[s], o = l.instance, c = l.currentTarget;
          if (l = l.listener, o !== r && a.isPropagationStopped()) break t;
          r = l, a.currentTarget = c;
          try {
            r(a);
          } catch (f) {
            Bu(f);
          }
          a.currentTarget = null, r = o;
        }
        else for (s = 0; s < i.length; s++) {
          if (l = i[s], o = l.instance, c = l.currentTarget, l = l.listener, o !== r && a.isPropagationStopped()) break t;
          r = l, a.currentTarget = c;
          try {
            r(a);
          } catch (f) {
            Bu(f);
          }
          a.currentTarget = null, r = o;
        }
      }
    }
  }
  function st(t, e) {
    var n = e[jh];
    n === void 0 && (n = e[jh] = /* @__PURE__ */ new Set());
    var i = t + "__bubble";
    n.has(i) || (Ib(e, t, 2, false), n.add(i));
  }
  function Wf(t, e, n) {
    var i = 0;
    e && (i |= 4), Ib(n, t, i, e);
  }
  var Jo = "_reactListening" + Math.random().toString(36).slice(2);
  function np(t) {
    if (!t[Jo]) {
      t[Jo] = true, X_.forEach(function(n) {
        n !== "selectionchange" && (ww.has(n) || Wf(n, false, t), Wf(n, true, t));
      });
      var e = t.nodeType === 9 ? t : t.ownerDocument;
      e === null || e[Jo] || (e[Jo] = true, Wf("selectionchange", false, e));
    }
  }
  function Ib(t, e, n, i) {
    switch (hS(e)) {
      case 2:
        var a = tM;
        break;
      case 8:
        a = eM;
        break;
      default:
        a = sp;
    }
    n = a.bind(null, e, n, t), a = void 0, !Ph || e !== "touchstart" && e !== "touchmove" && e !== "wheel" || (a = true), i ? a !== void 0 ? t.addEventListener(e, n, {
      capture: true,
      passive: a
    }) : t.addEventListener(e, n, true) : a !== void 0 ? t.addEventListener(e, n, {
      passive: a
    }) : t.addEventListener(e, n, false);
  }
  function If(t, e, n, i, a) {
    var r = i;
    if (!(e & 1) && !(e & 2) && i !== null) t: for (; ; ) {
      if (i === null) return;
      var s = i.tag;
      if (s === 3 || s === 4) {
        var l = i.stateNode.containerInfo;
        if (l === a) break;
        if (s === 4) for (s = i.return; s !== null; ) {
          var o = s.tag;
          if ((o === 3 || o === 4) && s.stateNode.containerInfo === a) return;
          s = s.return;
        }
        for (; l !== null; ) {
          if (s = Ar(l), s === null) return;
          if (o = s.tag, o === 5 || o === 6 || o === 26 || o === 27) {
            i = r = s;
            continue t;
          }
          l = l.parentNode;
        }
      }
      i = i.return;
    }
    W_(function() {
      var c = r, f = bm(n), d = [];
      t: {
        var m = d1.get(t);
        if (m !== void 0) {
          var y = Mc, T = t;
          switch (t) {
            case "keypress":
              if (cu(n) === 0) break t;
            case "keydown":
            case "keyup":
              y = _E;
              break;
            case "focusin":
              T = "focus", y = Cf;
              break;
            case "focusout":
              T = "blur", y = Cf;
              break;
            case "beforeblur":
            case "afterblur":
              y = Cf;
              break;
            case "click":
              if (n.button === 2) break t;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              y = m0;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              y = lE;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              y = TE;
              break;
            case u1:
            case c1:
            case f1:
              y = cE;
              break;
            case h1:
              y = AE;
              break;
            case "scroll":
            case "scrollend":
              y = rE;
              break;
            case "wheel":
              y = wE;
              break;
            case "copy":
            case "cut":
            case "paste":
              y = hE;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              y = y0;
              break;
            case "toggle":
            case "beforetoggle":
              y = CE;
          }
          var b = (e & 4) !== 0, x = !b && (t === "scroll" || t === "scrollend"), v = b ? m !== null ? m + "Capture" : null : m;
          b = [];
          for (var g = c, S; g !== null; ) {
            var A = g;
            if (S = A.stateNode, A = A.tag, A !== 5 && A !== 26 && A !== 27 || S === null || v === null || (A = Rl(g, v), A != null && b.push(Hl(g, A, S))), x) break;
            g = g.return;
          }
          0 < b.length && (m = new y(m, T, null, n, f), d.push({
            event: m,
            listeners: b
          }));
        }
      }
      if (!(e & 7)) {
        t: {
          if (m = t === "mouseover" || t === "pointerover", y = t === "mouseout" || t === "pointerout", m && n !== Gh && (T = n.relatedTarget || n.fromElement) && (Ar(T) || T[_s])) break t;
          if ((y || m) && (m = f.window === f ? f : (m = f.ownerDocument) ? m.defaultView || m.parentWindow : window, y ? (T = n.relatedTarget || n.toElement, y = c, T = T ? Ar(T) : null, T !== null && (x = ao(T), b = T.tag, T !== x || b !== 5 && b !== 27 && b !== 6) && (T = null)) : (y = null, T = c), y !== T)) {
            if (b = m0, A = "onMouseLeave", v = "onMouseEnter", g = "mouse", (t === "pointerout" || t === "pointerover") && (b = y0, A = "onPointerLeave", v = "onPointerEnter", g = "pointer"), x = y == null ? m : Ws(y), S = T == null ? m : Ws(T), m = new b(A, g + "leave", y, n, f), m.target = x, m.relatedTarget = S, A = null, Ar(f) === c && (b = new b(v, g + "enter", T, n, f), b.target = S, b.relatedTarget = x, A = b), x = A, y && T) e: {
              for (b = Mw, v = y, g = T, S = 0, A = v; A; A = b(A)) S++;
              A = 0;
              for (var w = g; w; w = b(w)) A++;
              for (; 0 < S - A; ) v = b(v), S--;
              for (; 0 < A - S; ) g = b(g), A--;
              for (; S--; ) {
                if (v === g || g !== null && v === g.alternate) {
                  b = v;
                  break e;
                }
                v = b(v), g = b(g);
              }
              b = null;
            }
            else b = null;
            y !== null && lg(d, m, y, b, false), T !== null && x !== null && lg(d, x, T, b, true);
          }
        }
        t: {
          if (m = c ? Ws(c) : window, y = m.nodeName && m.nodeName.toLowerCase(), y === "select" || y === "input" && m.type === "file") var V = b0;
          else if (_0(m)) if (a1) V = BE;
          else {
            V = NE;
            var z = LE;
          }
          else y = m.nodeName, !y || y.toLowerCase() !== "input" || m.type !== "checkbox" && m.type !== "radio" ? c && _m(c.elementType) && (V = b0) : V = jE;
          if (V && (V = V(t, c))) {
            i1(d, V, n, f);
            break t;
          }
          z && z(t, m, c), t === "focusout" && c && m.type === "number" && c.memoizedProps.value != null && Yh(m, "number", m.value);
        }
        switch (z = c ? Ws(c) : window, t) {
          case "focusin":
            (_0(z) || z.contentEditable === "true") && (Mr = z, kh = c, ll = null);
            break;
          case "focusout":
            ll = kh = Mr = null;
            break;
          case "mousedown":
            Xh = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Xh = false, E0(d, n, f);
            break;
          case "selectionchange":
            if (YE) break;
          case "keydown":
          case "keyup":
            E0(d, n, f);
        }
        var O;
        if (xm) t: {
          switch (t) {
            case "compositionstart":
              var U = "onCompositionStart";
              break t;
            case "compositionend":
              U = "onCompositionEnd";
              break t;
            case "compositionupdate":
              U = "onCompositionUpdate";
              break t;
          }
          U = void 0;
        }
        else wr ? e1(t, n) && (U = "onCompositionEnd") : t === "keydown" && n.keyCode === 229 && (U = "onCompositionStart");
        U && (t1 && n.locale !== "ko" && (wr || U !== "onCompositionStart" ? U === "onCompositionEnd" && wr && (O = I_()) : (Fi = f, Sm = "value" in Fi ? Fi.value : Fi.textContent, wr = true)), z = ec(c, U), 0 < z.length && (U = new p0(U, t, null, n, f), d.push({
          event: U,
          listeners: z
        }), O ? U.data = O : (O = n1(n), O !== null && (U.data = O)))), (O = RE ? OE(t, n) : zE(t, n)) && (U = ec(c, "onBeforeInput"), 0 < U.length && (z = new p0("onBeforeInput", "beforeinput", null, n, f), d.push({
          event: z,
          listeners: U
        }), z.data = O)), xw(d, t, c, n, f);
      }
      Wb(d, e);
    });
  }
  function Hl(t, e, n) {
    return {
      instance: t,
      listener: e,
      currentTarget: n
    };
  }
  function ec(t, e) {
    for (var n = e + "Capture", i = []; t !== null; ) {
      var a = t, r = a.stateNode;
      if (a = a.tag, a !== 5 && a !== 26 && a !== 27 || r === null || (a = Rl(t, n), a != null && i.unshift(Hl(t, a, r)), a = Rl(t, e), a != null && i.push(Hl(t, a, r))), t.tag === 3) return i;
      t = t.return;
    }
    return [];
  }
  function Mw(t) {
    if (t === null) return null;
    do
      t = t.return;
    while (t && t.tag !== 5 && t.tag !== 27);
    return t || null;
  }
  function lg(t, e, n, i, a) {
    for (var r = e._reactName, s = []; n !== null && n !== i; ) {
      var l = n, o = l.alternate, c = l.stateNode;
      if (l = l.tag, o !== null && o === i) break;
      l !== 5 && l !== 26 && l !== 27 || c === null || (o = c, a ? (c = Rl(n, r), c != null && s.unshift(Hl(n, c, o))) : a || (c = Rl(n, r), c != null && s.push(Hl(n, c, o)))), n = n.return;
    }
    s.length !== 0 && t.push({
      event: e,
      listeners: s
    });
  }
  var Cw = /\r\n?/g, Dw = /\u0000|\uFFFD/g;
  function og(t) {
    return (typeof t == "string" ? t : "" + t).replace(Cw, `
`).replace(Dw, "");
  }
  function tS(t, e) {
    return e = og(e), og(t) === e;
  }
  function _t(t, e, n, i, a, r) {
    switch (n) {
      case "children":
        typeof i == "string" ? e === "body" || e === "textarea" && i === "" || ts(t, i) : (typeof i == "number" || typeof i == "bigint") && e !== "body" && ts(t, "" + i);
        break;
      case "className":
        ko(t, "class", i);
        break;
      case "tabIndex":
        ko(t, "tabindex", i);
        break;
      case "dir":
      case "role":
      case "viewBox":
      case "width":
      case "height":
        ko(t, n, i);
        break;
      case "style":
        $_(t, i, r);
        break;
      case "data":
        if (e !== "object") {
          ko(t, "data", i);
          break;
        }
      case "src":
      case "href":
        if (i === "" && (e !== "a" || n !== "href")) {
          t.removeAttribute(n);
          break;
        }
        if (i == null || typeof i == "function" || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = ou("" + i), t.setAttribute(n, i);
        break;
      case "action":
      case "formAction":
        if (typeof i == "function") {
          t.setAttribute(n, "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");
          break;
        } else typeof r == "function" && (n === "formAction" ? (e !== "input" && _t(t, e, "name", a.name, a, null), _t(t, e, "formEncType", a.formEncType, a, null), _t(t, e, "formMethod", a.formMethod, a, null), _t(t, e, "formTarget", a.formTarget, a, null)) : (_t(t, e, "encType", a.encType, a, null), _t(t, e, "method", a.method, a, null), _t(t, e, "target", a.target, a, null)));
        if (i == null || typeof i == "symbol" || typeof i == "boolean") {
          t.removeAttribute(n);
          break;
        }
        i = ou("" + i), t.setAttribute(n, i);
        break;
      case "onClick":
        i != null && (t.onclick = yi);
        break;
      case "onScroll":
        i != null && st("scroll", t);
        break;
      case "onScrollEnd":
        i != null && st("scrollend", t);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(j(61));
          if (n = i.__html, n != null) {
            if (a.children != null) throw Error(j(60));
            t.innerHTML = n;
          }
        }
        break;
      case "multiple":
        t.multiple = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "muted":
        t.muted = i && typeof i != "function" && typeof i != "symbol";
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "defaultValue":
      case "defaultChecked":
      case "innerHTML":
      case "ref":
        break;
      case "autoFocus":
        break;
      case "xlinkHref":
        if (i == null || typeof i == "function" || typeof i == "boolean" || typeof i == "symbol") {
          t.removeAttribute("xlink:href");
          break;
        }
        n = ou("" + i), t.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", n);
        break;
      case "contentEditable":
      case "spellCheck":
      case "draggable":
      case "value":
      case "autoReverse":
      case "externalResourcesRequired":
      case "focusable":
      case "preserveAlpha":
        i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, "" + i) : t.removeAttribute(n);
        break;
      case "inert":
      case "allowFullScreen":
      case "async":
      case "autoPlay":
      case "controls":
      case "default":
      case "defer":
      case "disabled":
      case "disablePictureInPicture":
      case "disableRemotePlayback":
      case "formNoValidate":
      case "hidden":
      case "loop":
      case "noModule":
      case "noValidate":
      case "open":
      case "playsInline":
      case "readOnly":
      case "required":
      case "reversed":
      case "scoped":
      case "seamless":
      case "itemScope":
        i && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, "") : t.removeAttribute(n);
        break;
      case "capture":
      case "download":
        i === true ? t.setAttribute(n, "") : i !== false && i != null && typeof i != "function" && typeof i != "symbol" ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "cols":
      case "rows":
      case "size":
      case "span":
        i != null && typeof i != "function" && typeof i != "symbol" && !isNaN(i) && 1 <= i ? t.setAttribute(n, i) : t.removeAttribute(n);
        break;
      case "rowSpan":
      case "start":
        i == null || typeof i == "function" || typeof i == "symbol" || isNaN(i) ? t.removeAttribute(n) : t.setAttribute(n, i);
        break;
      case "popover":
        st("beforetoggle", t), st("toggle", t), lu(t, "popover", i);
        break;
      case "xlinkActuate":
        si(t, "http://www.w3.org/1999/xlink", "xlink:actuate", i);
        break;
      case "xlinkArcrole":
        si(t, "http://www.w3.org/1999/xlink", "xlink:arcrole", i);
        break;
      case "xlinkRole":
        si(t, "http://www.w3.org/1999/xlink", "xlink:role", i);
        break;
      case "xlinkShow":
        si(t, "http://www.w3.org/1999/xlink", "xlink:show", i);
        break;
      case "xlinkTitle":
        si(t, "http://www.w3.org/1999/xlink", "xlink:title", i);
        break;
      case "xlinkType":
        si(t, "http://www.w3.org/1999/xlink", "xlink:type", i);
        break;
      case "xmlBase":
        si(t, "http://www.w3.org/XML/1998/namespace", "xml:base", i);
        break;
      case "xmlLang":
        si(t, "http://www.w3.org/XML/1998/namespace", "xml:lang", i);
        break;
      case "xmlSpace":
        si(t, "http://www.w3.org/XML/1998/namespace", "xml:space", i);
        break;
      case "is":
        lu(t, "is", i);
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        (!(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") && (n = iE.get(n) || n, lu(t, n, i));
    }
  }
  function md(t, e, n, i, a, r) {
    switch (n) {
      case "style":
        $_(t, i, r);
        break;
      case "dangerouslySetInnerHTML":
        if (i != null) {
          if (typeof i != "object" || !("__html" in i)) throw Error(j(61));
          if (n = i.__html, n != null) {
            if (a.children != null) throw Error(j(60));
            t.innerHTML = n;
          }
        }
        break;
      case "children":
        typeof i == "string" ? ts(t, i) : (typeof i == "number" || typeof i == "bigint") && ts(t, "" + i);
        break;
      case "onScroll":
        i != null && st("scroll", t);
        break;
      case "onScrollEnd":
        i != null && st("scrollend", t);
        break;
      case "onClick":
        i != null && (t.onclick = yi);
        break;
      case "suppressContentEditableWarning":
      case "suppressHydrationWarning":
      case "innerHTML":
      case "ref":
        break;
      case "innerText":
      case "textContent":
        break;
      default:
        if (!F_.hasOwnProperty(n)) t: {
          if (n[0] === "o" && n[1] === "n" && (a = n.endsWith("Capture"), e = n.slice(2, a ? n.length - 7 : void 0), r = t[Qe] || null, r = r != null ? r[n] : null, typeof r == "function" && t.removeEventListener(e, r, a), typeof i == "function")) {
            typeof r != "function" && r !== null && (n in t ? t[n] = null : t.hasAttribute(n) && t.removeAttribute(n)), t.addEventListener(e, i, a);
            break t;
          }
          n in t ? t[n] = i : i === true ? t.setAttribute(n, "") : lu(t, n, i);
        }
    }
  }
  function xe(t, e, n) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "img":
        st("error", t), st("load", t);
        var i = false, a = false, r;
        for (r in n) if (n.hasOwnProperty(r)) {
          var s = n[r];
          if (s != null) switch (r) {
            case "src":
              i = true;
              break;
            case "srcSet":
              a = true;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              throw Error(j(137, e));
            default:
              _t(t, e, r, s, n, null);
          }
        }
        a && _t(t, e, "srcSet", n.srcSet, n, null), i && _t(t, e, "src", n.src, n, null);
        return;
      case "input":
        st("invalid", t);
        var l = r = s = a = null, o = null, c = null;
        for (i in n) if (n.hasOwnProperty(i)) {
          var f = n[i];
          if (f != null) switch (i) {
            case "name":
              a = f;
              break;
            case "type":
              s = f;
              break;
            case "checked":
              o = f;
              break;
            case "defaultChecked":
              c = f;
              break;
            case "value":
              r = f;
              break;
            case "defaultValue":
              l = f;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (f != null) throw Error(j(137, e));
              break;
            default:
              _t(t, e, i, f, n, null);
          }
        }
        Q_(t, r, l, o, c, s, a, false);
        return;
      case "select":
        st("invalid", t), i = s = r = null;
        for (a in n) if (n.hasOwnProperty(a) && (l = n[a], l != null)) switch (a) {
          case "value":
            r = l;
            break;
          case "defaultValue":
            s = l;
            break;
          case "multiple":
            i = l;
          default:
            _t(t, e, a, l, n, null);
        }
        e = r, n = s, t.multiple = !!i, e != null ? Pr(t, !!i, e, false) : n != null && Pr(t, !!i, n, true);
        return;
      case "textarea":
        st("invalid", t), r = a = i = null;
        for (s in n) if (n.hasOwnProperty(s) && (l = n[s], l != null)) switch (s) {
          case "value":
            i = l;
            break;
          case "defaultValue":
            a = l;
            break;
          case "children":
            r = l;
            break;
          case "dangerouslySetInnerHTML":
            if (l != null) throw Error(j(91));
            break;
          default:
            _t(t, e, s, l, n, null);
        }
        J_(t, i, a, r);
        return;
      case "option":
        for (o in n) if (n.hasOwnProperty(o) && (i = n[o], i != null)) switch (o) {
          case "selected":
            t.selected = i && typeof i != "function" && typeof i != "symbol";
            break;
          default:
            _t(t, e, o, i, n, null);
        }
        return;
      case "dialog":
        st("beforetoggle", t), st("toggle", t), st("cancel", t), st("close", t);
        break;
      case "iframe":
      case "object":
        st("load", t);
        break;
      case "video":
      case "audio":
        for (i = 0; i < Bl.length; i++) st(Bl[i], t);
        break;
      case "image":
        st("error", t), st("load", t);
        break;
      case "details":
        st("toggle", t);
        break;
      case "embed":
      case "source":
      case "link":
        st("error", t), st("load", t);
      case "area":
      case "base":
      case "br":
      case "col":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "track":
      case "wbr":
      case "menuitem":
        for (c in n) if (n.hasOwnProperty(c) && (i = n[c], i != null)) switch (c) {
          case "children":
          case "dangerouslySetInnerHTML":
            throw Error(j(137, e));
          default:
            _t(t, e, c, i, n, null);
        }
        return;
      default:
        if (_m(e)) {
          for (f in n) n.hasOwnProperty(f) && (i = n[f], i !== void 0 && md(t, e, f, i, n, void 0));
          return;
        }
    }
    for (l in n) n.hasOwnProperty(l) && (i = n[l], i != null && _t(t, e, l, i, n, null));
  }
  function Rw(t, e, n, i) {
    switch (e) {
      case "div":
      case "span":
      case "svg":
      case "path":
      case "a":
      case "g":
      case "p":
      case "li":
        break;
      case "input":
        var a = null, r = null, s = null, l = null, o = null, c = null, f = null;
        for (y in n) {
          var d = n[y];
          if (n.hasOwnProperty(y) && d != null) switch (y) {
            case "checked":
              break;
            case "value":
              break;
            case "defaultValue":
              o = d;
            default:
              i.hasOwnProperty(y) || _t(t, e, y, null, i, d);
          }
        }
        for (var m in i) {
          var y = i[m];
          if (d = n[m], i.hasOwnProperty(m) && (y != null || d != null)) switch (m) {
            case "type":
              r = y;
              break;
            case "name":
              a = y;
              break;
            case "checked":
              c = y;
              break;
            case "defaultChecked":
              f = y;
              break;
            case "value":
              s = y;
              break;
            case "defaultValue":
              l = y;
              break;
            case "children":
            case "dangerouslySetInnerHTML":
              if (y != null) throw Error(j(137, e));
              break;
            default:
              y !== d && _t(t, e, m, y, i, d);
          }
        }
        Hh(t, s, l, o, c, f, r, a);
        return;
      case "select":
        y = s = l = m = null;
        for (r in n) if (o = n[r], n.hasOwnProperty(r) && o != null) switch (r) {
          case "value":
            break;
          case "multiple":
            y = o;
          default:
            i.hasOwnProperty(r) || _t(t, e, r, null, i, o);
        }
        for (a in i) if (r = i[a], o = n[a], i.hasOwnProperty(a) && (r != null || o != null)) switch (a) {
          case "value":
            m = r;
            break;
          case "defaultValue":
            l = r;
            break;
          case "multiple":
            s = r;
          default:
            r !== o && _t(t, e, a, r, i, o);
        }
        e = l, n = s, i = y, m != null ? Pr(t, !!n, m, false) : !!i != !!n && (e != null ? Pr(t, !!n, e, true) : Pr(t, !!n, n ? [] : "", false));
        return;
      case "textarea":
        y = m = null;
        for (l in n) if (a = n[l], n.hasOwnProperty(l) && a != null && !i.hasOwnProperty(l)) switch (l) {
          case "value":
            break;
          case "children":
            break;
          default:
            _t(t, e, l, null, i, a);
        }
        for (s in i) if (a = i[s], r = n[s], i.hasOwnProperty(s) && (a != null || r != null)) switch (s) {
          case "value":
            m = a;
            break;
          case "defaultValue":
            y = a;
            break;
          case "children":
            break;
          case "dangerouslySetInnerHTML":
            if (a != null) throw Error(j(91));
            break;
          default:
            a !== r && _t(t, e, s, a, i, r);
        }
        Z_(t, m, y);
        return;
      case "option":
        for (var T in n) if (m = n[T], n.hasOwnProperty(T) && m != null && !i.hasOwnProperty(T)) switch (T) {
          case "selected":
            t.selected = false;
            break;
          default:
            _t(t, e, T, null, i, m);
        }
        for (o in i) if (m = i[o], y = n[o], i.hasOwnProperty(o) && m !== y && (m != null || y != null)) switch (o) {
          case "selected":
            t.selected = m && typeof m != "function" && typeof m != "symbol";
            break;
          default:
            _t(t, e, o, m, i, y);
        }
        return;
      case "img":
      case "link":
      case "area":
      case "base":
      case "br":
      case "col":
      case "embed":
      case "hr":
      case "keygen":
      case "meta":
      case "param":
      case "source":
      case "track":
      case "wbr":
      case "menuitem":
        for (var b in n) m = n[b], n.hasOwnProperty(b) && m != null && !i.hasOwnProperty(b) && _t(t, e, b, null, i, m);
        for (c in i) if (m = i[c], y = n[c], i.hasOwnProperty(c) && m !== y && (m != null || y != null)) switch (c) {
          case "children":
          case "dangerouslySetInnerHTML":
            if (m != null) throw Error(j(137, e));
            break;
          default:
            _t(t, e, c, m, i, y);
        }
        return;
      default:
        if (_m(e)) {
          for (var x in n) m = n[x], n.hasOwnProperty(x) && m !== void 0 && !i.hasOwnProperty(x) && md(t, e, x, void 0, i, m);
          for (f in i) m = i[f], y = n[f], !i.hasOwnProperty(f) || m === y || m === void 0 && y === void 0 || md(t, e, f, m, i, y);
          return;
        }
    }
    for (var v in n) m = n[v], n.hasOwnProperty(v) && m != null && !i.hasOwnProperty(v) && _t(t, e, v, null, i, m);
    for (d in i) m = i[d], y = n[d], !i.hasOwnProperty(d) || m === y || m == null && y == null || _t(t, e, d, m, i, y);
  }
  function ug(t) {
    switch (t) {
      case "css":
      case "script":
      case "font":
      case "img":
      case "image":
      case "input":
      case "link":
        return true;
      default:
        return false;
    }
  }
  function Ow() {
    if (typeof performance.getEntriesByType == "function") {
      for (var t = 0, e = 0, n = performance.getEntriesByType("resource"), i = 0; i < n.length; i++) {
        var a = n[i], r = a.transferSize, s = a.initiatorType, l = a.duration;
        if (r && l && ug(s)) {
          for (s = 0, l = a.responseEnd, i += 1; i < n.length; i++) {
            var o = n[i], c = o.startTime;
            if (c > l) break;
            var f = o.transferSize, d = o.initiatorType;
            f && ug(d) && (o = o.responseEnd, s += f * (o < l ? 1 : (l - c) / (o - c)));
          }
          if (--i, e += 8 * (r + s) / (a.duration / 1e3), t++, 10 < t) break;
        }
      }
      if (0 < t) return e / t / 1e6;
    }
    return navigator.connection && (t = navigator.connection.downlink, typeof t == "number") ? t : 5;
  }
  var pd = null, yd = null;
  function nc(t) {
    return t.nodeType === 9 ? t : t.ownerDocument;
  }
  function cg(t) {
    switch (t) {
      case "http://www.w3.org/2000/svg":
        return 1;
      case "http://www.w3.org/1998/Math/MathML":
        return 2;
      default:
        return 0;
    }
  }
  function eS(t, e) {
    if (t === 0) switch (e) {
      case "svg":
        return 1;
      case "math":
        return 2;
      default:
        return 0;
    }
    return t === 1 && e === "foreignObject" ? 0 : t;
  }
  function gd(t, e) {
    return t === "textarea" || t === "noscript" || typeof e.children == "string" || typeof e.children == "number" || typeof e.children == "bigint" || typeof e.dangerouslySetInnerHTML == "object" && e.dangerouslySetInnerHTML !== null && e.dangerouslySetInnerHTML.__html != null;
  }
  var th = null;
  function zw() {
    var t = window.event;
    return t && t.type === "popstate" ? t === th ? false : (th = t, true) : (th = null, false);
  }
  var nS = typeof setTimeout == "function" ? setTimeout : void 0, Uw = typeof clearTimeout == "function" ? clearTimeout : void 0, fg = typeof Promise == "function" ? Promise : void 0, Vw = typeof queueMicrotask == "function" ? queueMicrotask : typeof fg < "u" ? function(t) {
    return fg.resolve(null).then(t).catch(Lw);
  } : nS;
  function Lw(t) {
    setTimeout(function() {
      throw t;
    });
  }
  function _a(t) {
    return t === "head";
  }
  function hg(t, e) {
    var n = e, i = 0;
    do {
      var a = n.nextSibling;
      if (t.removeChild(n), a && a.nodeType === 8) if (n = a.data, n === "/$" || n === "/&") {
        if (i === 0) {
          t.removeChild(a), os(e);
          return;
        }
        i--;
      } else if (n === "$" || n === "$?" || n === "$~" || n === "$!" || n === "&") i++;
      else if (n === "html") gl(t.ownerDocument.documentElement);
      else if (n === "head") {
        n = t.ownerDocument.head, gl(n);
        for (var r = n.firstChild; r; ) {
          var s = r.nextSibling, l = r.nodeName;
          r[oo] || l === "SCRIPT" || l === "STYLE" || l === "LINK" && r.rel.toLowerCase() === "stylesheet" || n.removeChild(r), r = s;
        }
      } else n === "body" && gl(t.ownerDocument.body);
      n = a;
    } while (n);
    os(e);
  }
  function dg(t, e) {
    var n = t;
    t = 0;
    do {
      var i = n.nextSibling;
      if (n.nodeType === 1 ? e ? (n._stashedDisplay = n.style.display, n.style.display = "none") : (n.style.display = n._stashedDisplay || "", n.getAttribute("style") === "" && n.removeAttribute("style")) : n.nodeType === 3 && (e ? (n._stashedText = n.nodeValue, n.nodeValue = "") : n.nodeValue = n._stashedText || ""), i && i.nodeType === 8) if (n = i.data, n === "/$") {
        if (t === 0) break;
        t--;
      } else n !== "$" && n !== "$?" && n !== "$~" && n !== "$!" || t++;
      n = i;
    } while (n);
  }
  function vd(t) {
    var e = t.firstChild;
    for (e && e.nodeType === 10 && (e = e.nextSibling); e; ) {
      var n = e;
      switch (e = e.nextSibling, n.nodeName) {
        case "HTML":
        case "HEAD":
        case "BODY":
          vd(n), vm(n);
          continue;
        case "SCRIPT":
        case "STYLE":
          continue;
        case "LINK":
          if (n.rel.toLowerCase() === "stylesheet") continue;
      }
      t.removeChild(n);
    }
  }
  function Nw(t, e, n, i) {
    for (; t.nodeType === 1; ) {
      var a = n;
      if (t.nodeName.toLowerCase() !== e.toLowerCase()) {
        if (!i && (t.nodeName !== "INPUT" || t.type !== "hidden")) break;
      } else if (i) {
        if (!t[oo]) switch (e) {
          case "meta":
            if (!t.hasAttribute("itemprop")) break;
            return t;
          case "link":
            if (r = t.getAttribute("rel"), r === "stylesheet" && t.hasAttribute("data-precedence")) break;
            if (r !== a.rel || t.getAttribute("href") !== (a.href == null || a.href === "" ? null : a.href) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin) || t.getAttribute("title") !== (a.title == null ? null : a.title)) break;
            return t;
          case "style":
            if (t.hasAttribute("data-precedence")) break;
            return t;
          case "script":
            if (r = t.getAttribute("src"), (r !== (a.src == null ? null : a.src) || t.getAttribute("type") !== (a.type == null ? null : a.type) || t.getAttribute("crossorigin") !== (a.crossOrigin == null ? null : a.crossOrigin)) && r && t.hasAttribute("async") && !t.hasAttribute("itemprop")) break;
            return t;
          default:
            return t;
        }
      } else if (e === "input" && t.type === "hidden") {
        var r = a.name == null ? null : "" + a.name;
        if (a.type === "hidden" && t.getAttribute("name") === r) return t;
      } else return t;
      if (t = On(t.nextSibling), t === null) break;
    }
    return null;
  }
  function jw(t, e, n) {
    if (e === "") return null;
    for (; t.nodeType !== 3; ) if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !n || (t = On(t.nextSibling), t === null)) return null;
    return t;
  }
  function iS(t, e) {
    for (; t.nodeType !== 8; ) if ((t.nodeType !== 1 || t.nodeName !== "INPUT" || t.type !== "hidden") && !e || (t = On(t.nextSibling), t === null)) return null;
    return t;
  }
  function _d(t) {
    return t.data === "$?" || t.data === "$~";
  }
  function bd(t) {
    return t.data === "$!" || t.data === "$?" && t.ownerDocument.readyState !== "loading";
  }
  function Bw(t, e) {
    var n = t.ownerDocument;
    if (t.data === "$~") t._reactRetry = e;
    else if (t.data !== "$?" || n.readyState !== "loading") e();
    else {
      var i = function() {
        e(), n.removeEventListener("DOMContentLoaded", i);
      };
      n.addEventListener("DOMContentLoaded", i), t._reactRetry = i;
    }
  }
  function On(t) {
    for (; t != null; t = t.nextSibling) {
      var e = t.nodeType;
      if (e === 1 || e === 3) break;
      if (e === 8) {
        if (e = t.data, e === "$" || e === "$!" || e === "$?" || e === "$~" || e === "&" || e === "F!" || e === "F") break;
        if (e === "/$" || e === "/&") return null;
      }
    }
    return t;
  }
  var Sd = null;
  function mg(t) {
    t = t.nextSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "/$" || n === "/&") {
          if (e === 0) return On(t.nextSibling);
          e--;
        } else n !== "$" && n !== "$!" && n !== "$?" && n !== "$~" && n !== "&" || e++;
      }
      t = t.nextSibling;
    }
    return null;
  }
  function pg(t) {
    t = t.previousSibling;
    for (var e = 0; t; ) {
      if (t.nodeType === 8) {
        var n = t.data;
        if (n === "$" || n === "$!" || n === "$?" || n === "$~" || n === "&") {
          if (e === 0) return t;
          e--;
        } else n !== "/$" && n !== "/&" || e++;
      }
      t = t.previousSibling;
    }
    return null;
  }
  function aS(t, e, n) {
    switch (e = nc(n), t) {
      case "html":
        if (t = e.documentElement, !t) throw Error(j(452));
        return t;
      case "head":
        if (t = e.head, !t) throw Error(j(453));
        return t;
      case "body":
        if (t = e.body, !t) throw Error(j(454));
        return t;
      default:
        throw Error(j(451));
    }
  }
  function gl(t) {
    for (var e = t.attributes; e.length; ) t.removeAttributeNode(e[0]);
    vm(t);
  }
  var Un = /* @__PURE__ */ new Map(), yg = /* @__PURE__ */ new Set();
  function ic(t) {
    return typeof t.getRootNode == "function" ? t.getRootNode() : t.nodeType === 9 ? t : t.ownerDocument;
  }
  var zi = mt.d;
  mt.d = {
    f: Hw,
    r: Yw,
    D: Gw,
    C: Pw,
    L: kw,
    m: Xw,
    X: qw,
    S: Fw,
    M: Kw
  };
  function Hw() {
    var t = zi.f(), e = Bc();
    return t || e;
  }
  function Yw(t) {
    var e = bs(t);
    e !== null && e.tag === 5 && e.type === "form" ? $1(e) : zi.r(t);
  }
  var As = typeof document > "u" ? null : document;
  function rS(t, e, n) {
    var i = As;
    if (i && typeof e == "string" && e) {
      var a = xn(e);
      a = 'link[rel="' + t + '"][href="' + a + '"]', typeof n == "string" && (a += '[crossorigin="' + n + '"]'), yg.has(a) || (yg.add(a), t = {
        rel: t,
        crossOrigin: n,
        href: e
      }, i.querySelector(a) === null && (e = i.createElement("link"), xe(e, "link", t), he(e), i.head.appendChild(e)));
    }
  }
  function Gw(t) {
    zi.D(t), rS("dns-prefetch", t, null);
  }
  function Pw(t, e) {
    zi.C(t, e), rS("preconnect", t, e);
  }
  function kw(t, e, n) {
    zi.L(t, e, n);
    var i = As;
    if (i && t && e) {
      var a = 'link[rel="preload"][as="' + xn(e) + '"]';
      e === "image" && n && n.imageSrcSet ? (a += '[imagesrcset="' + xn(n.imageSrcSet) + '"]', typeof n.imageSizes == "string" && (a += '[imagesizes="' + xn(n.imageSizes) + '"]')) : a += '[href="' + xn(t) + '"]';
      var r = a;
      switch (e) {
        case "style":
          r = ls(t);
          break;
        case "script":
          r = Es(t);
      }
      Un.has(r) || (t = zt({
        rel: "preload",
        href: e === "image" && n && n.imageSrcSet ? void 0 : t,
        as: e
      }, n), Un.set(r, t), i.querySelector(a) !== null || e === "style" && i.querySelector(po(r)) || e === "script" && i.querySelector(yo(r)) || (e = i.createElement("link"), xe(e, "link", t), he(e), i.head.appendChild(e)));
    }
  }
  function Xw(t, e) {
    zi.m(t, e);
    var n = As;
    if (n && t) {
      var i = e && typeof e.as == "string" ? e.as : "script", a = 'link[rel="modulepreload"][as="' + xn(i) + '"][href="' + xn(t) + '"]', r = a;
      switch (i) {
        case "audioworklet":
        case "paintworklet":
        case "serviceworker":
        case "sharedworker":
        case "worker":
        case "script":
          r = Es(t);
      }
      if (!Un.has(r) && (t = zt({
        rel: "modulepreload",
        href: t
      }, e), Un.set(r, t), n.querySelector(a) === null)) {
        switch (i) {
          case "audioworklet":
          case "paintworklet":
          case "serviceworker":
          case "sharedworker":
          case "worker":
          case "script":
            if (n.querySelector(yo(r))) return;
        }
        i = n.createElement("link"), xe(i, "link", t), he(i), n.head.appendChild(i);
      }
    }
  }
  function Fw(t, e, n) {
    zi.S(t, e, n);
    var i = As;
    if (i && t) {
      var a = Gr(i).hoistableStyles, r = ls(t);
      e = e || "default";
      var s = a.get(r);
      if (!s) {
        var l = {
          loading: 0,
          preload: null
        };
        if (s = i.querySelector(po(r))) l.loading = 5;
        else {
          t = zt({
            rel: "stylesheet",
            href: t,
            "data-precedence": e
          }, n), (n = Un.get(r)) && ip(t, n);
          var o = s = i.createElement("link");
          he(o), xe(o, "link", t), o._p = new Promise(function(c, f) {
            o.onload = c, o.onerror = f;
          }), o.addEventListener("load", function() {
            l.loading |= 1;
          }), o.addEventListener("error", function() {
            l.loading |= 2;
          }), l.loading |= 4, vu(s, e, i);
        }
        s = {
          type: "stylesheet",
          instance: s,
          count: 1,
          state: l
        }, a.set(r, s);
      }
    }
  }
  function qw(t, e) {
    zi.X(t, e);
    var n = As;
    if (n && t) {
      var i = Gr(n).hoistableScripts, a = Es(t), r = i.get(a);
      r || (r = n.querySelector(yo(a)), r || (t = zt({
        src: t,
        async: true
      }, e), (e = Un.get(a)) && ap(t, e), r = n.createElement("script"), he(r), xe(r, "link", t), n.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, i.set(a, r));
    }
  }
  function Kw(t, e) {
    zi.M(t, e);
    var n = As;
    if (n && t) {
      var i = Gr(n).hoistableScripts, a = Es(t), r = i.get(a);
      r || (r = n.querySelector(yo(a)), r || (t = zt({
        src: t,
        async: true,
        type: "module"
      }, e), (e = Un.get(a)) && ap(t, e), r = n.createElement("script"), he(r), xe(r, "link", t), n.head.appendChild(r)), r = {
        type: "script",
        instance: r,
        count: 1,
        state: null
      }, i.set(a, r));
    }
  }
  function gg(t, e, n, i) {
    var a = (a = Ii.current) ? ic(a) : null;
    if (!a) throw Error(j(446));
    switch (t) {
      case "meta":
      case "title":
        return null;
      case "style":
        return typeof n.precedence == "string" && typeof n.href == "string" ? (e = ls(n.href), n = Gr(a).hoistableStyles, i = n.get(e), i || (i = {
          type: "style",
          instance: null,
          count: 0,
          state: null
        }, n.set(e, i)), i) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      case "link":
        if (n.rel === "stylesheet" && typeof n.href == "string" && typeof n.precedence == "string") {
          t = ls(n.href);
          var r = Gr(a).hoistableStyles, s = r.get(t);
          if (s || (a = a.ownerDocument || a, s = {
            type: "stylesheet",
            instance: null,
            count: 0,
            state: {
              loading: 0,
              preload: null
            }
          }, r.set(t, s), (r = a.querySelector(po(t))) && !r._p && (s.instance = r, s.state.loading = 5), Un.has(t) || (n = {
            rel: "preload",
            as: "style",
            href: n.href,
            crossOrigin: n.crossOrigin,
            integrity: n.integrity,
            media: n.media,
            hrefLang: n.hrefLang,
            referrerPolicy: n.referrerPolicy
          }, Un.set(t, n), r || Qw(a, t, n, s.state))), e && i === null) throw Error(j(528, ""));
          return s;
        }
        if (e && i !== null) throw Error(j(529, ""));
        return null;
      case "script":
        return e = n.async, n = n.src, typeof n == "string" && e && typeof e != "function" && typeof e != "symbol" ? (e = Es(n), n = Gr(a).hoistableScripts, i = n.get(e), i || (i = {
          type: "script",
          instance: null,
          count: 0,
          state: null
        }, n.set(e, i)), i) : {
          type: "void",
          instance: null,
          count: 0,
          state: null
        };
      default:
        throw Error(j(444, t));
    }
  }
  function ls(t) {
    return 'href="' + xn(t) + '"';
  }
  function po(t) {
    return 'link[rel="stylesheet"][' + t + "]";
  }
  function sS(t) {
    return zt({}, t, {
      "data-precedence": t.precedence,
      precedence: null
    });
  }
  function Qw(t, e, n, i) {
    t.querySelector('link[rel="preload"][as="style"][' + e + "]") ? i.loading = 1 : (e = t.createElement("link"), i.preload = e, e.addEventListener("load", function() {
      return i.loading |= 1;
    }), e.addEventListener("error", function() {
      return i.loading |= 2;
    }), xe(e, "link", n), he(e), t.head.appendChild(e));
  }
  function Es(t) {
    return '[src="' + xn(t) + '"]';
  }
  function yo(t) {
    return "script[async]" + t;
  }
  function vg(t, e, n) {
    if (e.count++, e.instance === null) switch (e.type) {
      case "style":
        var i = t.querySelector('style[data-href~="' + xn(n.href) + '"]');
        if (i) return e.instance = i, he(i), i;
        var a = zt({}, n, {
          "data-href": n.href,
          "data-precedence": n.precedence,
          href: null,
          precedence: null
        });
        return i = (t.ownerDocument || t).createElement("style"), he(i), xe(i, "style", a), vu(i, n.precedence, t), e.instance = i;
      case "stylesheet":
        a = ls(n.href);
        var r = t.querySelector(po(a));
        if (r) return e.state.loading |= 4, e.instance = r, he(r), r;
        i = sS(n), (a = Un.get(a)) && ip(i, a), r = (t.ownerDocument || t).createElement("link"), he(r);
        var s = r;
        return s._p = new Promise(function(l, o) {
          s.onload = l, s.onerror = o;
        }), xe(r, "link", i), e.state.loading |= 4, vu(r, n.precedence, t), e.instance = r;
      case "script":
        return r = Es(n.src), (a = t.querySelector(yo(r))) ? (e.instance = a, he(a), a) : (i = n, (a = Un.get(r)) && (i = zt({}, n), ap(i, a)), t = t.ownerDocument || t, a = t.createElement("script"), he(a), xe(a, "link", i), t.head.appendChild(a), e.instance = a);
      case "void":
        return null;
      default:
        throw Error(j(443, e.type));
    }
    else e.type === "stylesheet" && !(e.state.loading & 4) && (i = e.instance, e.state.loading |= 4, vu(i, n.precedence, t));
    return e.instance;
  }
  function vu(t, e, n) {
    for (var i = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'), a = i.length ? i[i.length - 1] : null, r = a, s = 0; s < i.length; s++) {
      var l = i[s];
      if (l.dataset.precedence === e) r = l;
      else if (r !== a) break;
    }
    r ? r.parentNode.insertBefore(t, r.nextSibling) : (e = n.nodeType === 9 ? n.head : n, e.insertBefore(t, e.firstChild));
  }
  function ip(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.title == null && (t.title = e.title);
  }
  function ap(t, e) {
    t.crossOrigin == null && (t.crossOrigin = e.crossOrigin), t.referrerPolicy == null && (t.referrerPolicy = e.referrerPolicy), t.integrity == null && (t.integrity = e.integrity);
  }
  var _u = null;
  function _g(t, e, n) {
    if (_u === null) {
      var i = /* @__PURE__ */ new Map(), a = _u = /* @__PURE__ */ new Map();
      a.set(n, i);
    } else a = _u, i = a.get(n), i || (i = /* @__PURE__ */ new Map(), a.set(n, i));
    if (i.has(t)) return i;
    for (i.set(t, null), n = n.getElementsByTagName(t), a = 0; a < n.length; a++) {
      var r = n[a];
      if (!(r[oo] || r[be] || t === "link" && r.getAttribute("rel") === "stylesheet") && r.namespaceURI !== "http://www.w3.org/2000/svg") {
        var s = r.getAttribute(e) || "";
        s = t + s;
        var l = i.get(s);
        l ? l.push(r) : i.set(s, [
          r
        ]);
      }
    }
    return i;
  }
  function bg(t, e, n) {
    t = t.ownerDocument || t, t.head.insertBefore(n, e === "title" ? t.querySelector("head > title") : null);
  }
  function Zw(t, e, n) {
    if (n === 1 || e.itemProp != null) return false;
    switch (t) {
      case "meta":
      case "title":
        return true;
      case "style":
        if (typeof e.precedence != "string" || typeof e.href != "string" || e.href === "") break;
        return true;
      case "link":
        if (typeof e.rel != "string" || typeof e.href != "string" || e.href === "" || e.onLoad || e.onError) break;
        switch (e.rel) {
          case "stylesheet":
            return t = e.disabled, typeof e.precedence == "string" && t == null;
          default:
            return true;
        }
      case "script":
        if (e.async && typeof e.async != "function" && typeof e.async != "symbol" && !e.onLoad && !e.onError && e.src && typeof e.src == "string") return true;
    }
    return false;
  }
  function lS(t) {
    return !(t.type === "stylesheet" && !(t.state.loading & 3));
  }
  function Jw(t, e, n, i) {
    if (n.type === "stylesheet" && (typeof i.media != "string" || matchMedia(i.media).matches !== false) && !(n.state.loading & 4)) {
      if (n.instance === null) {
        var a = ls(i.href), r = e.querySelector(po(a));
        if (r) {
          e = r._p, e !== null && typeof e == "object" && typeof e.then == "function" && (t.count++, t = ac.bind(t), e.then(t, t)), n.state.loading |= 4, n.instance = r, he(r);
          return;
        }
        r = e.ownerDocument || e, i = sS(i), (a = Un.get(a)) && ip(i, a), r = r.createElement("link"), he(r);
        var s = r;
        s._p = new Promise(function(l, o) {
          s.onload = l, s.onerror = o;
        }), xe(r, "link", i), n.instance = r;
      }
      t.stylesheets === null && (t.stylesheets = /* @__PURE__ */ new Map()), t.stylesheets.set(n, e), (e = n.state.preload) && !(n.state.loading & 3) && (t.count++, n = ac.bind(t), e.addEventListener("load", n), e.addEventListener("error", n));
    }
  }
  var eh = 0;
  function $w(t, e) {
    return t.stylesheets && t.count === 0 && bu(t, t.stylesheets), 0 < t.count || 0 < t.imgCount ? function(n) {
      var i = setTimeout(function() {
        if (t.stylesheets && bu(t, t.stylesheets), t.unsuspend) {
          var r = t.unsuspend;
          t.unsuspend = null, r();
        }
      }, 6e4 + e);
      0 < t.imgBytes && eh === 0 && (eh = 62500 * Ow());
      var a = setTimeout(function() {
        if (t.waitingForImages = false, t.count === 0 && (t.stylesheets && bu(t, t.stylesheets), t.unsuspend)) {
          var r = t.unsuspend;
          t.unsuspend = null, r();
        }
      }, (t.imgBytes > eh ? 50 : 800) + e);
      return t.unsuspend = n, function() {
        t.unsuspend = null, clearTimeout(i), clearTimeout(a);
      };
    } : null;
  }
  function ac() {
    if (this.count--, this.count === 0 && (this.imgCount === 0 || !this.waitingForImages)) {
      if (this.stylesheets) bu(this, this.stylesheets);
      else if (this.unsuspend) {
        var t = this.unsuspend;
        this.unsuspend = null, t();
      }
    }
  }
  var rc = null;
  function bu(t, e) {
    t.stylesheets = null, t.unsuspend !== null && (t.count++, rc = /* @__PURE__ */ new Map(), e.forEach(Ww, t), rc = null, ac.call(t));
  }
  function Ww(t, e) {
    if (!(e.state.loading & 4)) {
      var n = rc.get(t);
      if (n) var i = n.get(null);
      else {
        n = /* @__PURE__ */ new Map(), rc.set(t, n);
        for (var a = t.querySelectorAll("link[data-precedence],style[data-precedence]"), r = 0; r < a.length; r++) {
          var s = a[r];
          (s.nodeName === "LINK" || s.getAttribute("media") !== "not all") && (n.set(s.dataset.precedence, s), i = s);
        }
        i && n.set(null, i);
      }
      a = e.instance, s = a.getAttribute("data-precedence"), r = n.get(s) || i, r === i && n.set(null, a), n.set(s, a), this.count++, i = ac.bind(this), a.addEventListener("load", i), a.addEventListener("error", i), r ? r.parentNode.insertBefore(a, r.nextSibling) : (t = t.nodeType === 9 ? t.head : t, t.insertBefore(a, t.firstChild)), e.state.loading |= 4;
    }
  }
  var Yl = {
    $$typeof: pi,
    Provider: null,
    Consumer: null,
    _currentValue: Ga,
    _currentValue2: Ga,
    _threadCount: 0
  };
  function Iw(t, e, n, i, a, r, s, l, o) {
    this.tag = 1, this.containerInfo = t, this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.next = this.pendingContext = this.context = this.cancelPendingCommit = null, this.callbackPriority = 0, this.expirationTimes = Af(-1), this.entangledLanes = this.shellSuspendCounter = this.errorRecoveryDisabledLanes = this.expiredLanes = this.warmLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Af(0), this.hiddenUpdates = Af(null), this.identifierPrefix = i, this.onUncaughtError = a, this.onCaughtError = r, this.onRecoverableError = s, this.pooledCache = null, this.pooledCacheLanes = 0, this.formState = o, this.incompleteTransitions = /* @__PURE__ */ new Map();
  }
  function oS(t, e, n, i, a, r, s, l, o, c, f, d) {
    return t = new Iw(t, e, n, s, o, c, f, d, l), e = 1, r === true && (e |= 24), r = tn(3, null, null, e), t.current = r, r.stateNode = t, e = Rm(), e.refCount++, t.pooledCache = e, e.refCount++, r.memoizedState = {
      element: i,
      isDehydrated: n,
      cache: e
    }, Um(r), t;
  }
  function uS(t) {
    return t ? (t = Rr, t) : Rr;
  }
  function cS(t, e, n, i, a, r) {
    a = uS(a), i.context === null ? i.context = a : i.pendingContext = a, i = ea(e), i.payload = {
      element: n
    }, r = r === void 0 ? null : r, r !== null && (i.callback = r), n = na(t, i, e), n !== null && (ke(n, t, e), ul(n, t, e));
  }
  function Sg(t, e) {
    if (t = t.memoizedState, t !== null && t.dehydrated !== null) {
      var n = t.retryLane;
      t.retryLane = n !== 0 && n < e ? n : e;
    }
  }
  function rp(t, e) {
    Sg(t, e), (t = t.alternate) && Sg(t, e);
  }
  function fS(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = or(t, 67108864);
      e !== null && ke(e, t, 67108864), rp(t, 67108864);
    }
  }
  function Tg(t) {
    if (t.tag === 13 || t.tag === 31) {
      var e = on();
      e = ym(e);
      var n = or(t, e);
      n !== null && ke(n, t, e), rp(t, e);
    }
  }
  var sc = true;
  function tM(t, e, n, i) {
    var a = et.T;
    et.T = null;
    var r = mt.p;
    try {
      mt.p = 2, sp(t, e, n, i);
    } finally {
      mt.p = r, et.T = a;
    }
  }
  function eM(t, e, n, i) {
    var a = et.T;
    et.T = null;
    var r = mt.p;
    try {
      mt.p = 8, sp(t, e, n, i);
    } finally {
      mt.p = r, et.T = a;
    }
  }
  function sp(t, e, n, i) {
    if (sc) {
      var a = Td(i);
      if (a === null) If(t, e, i, lc, n), xg(t, i);
      else if (iM(a, t, e, n, i)) i.stopPropagation();
      else if (xg(t, i), e & 4 && -1 < nM.indexOf(t)) {
        for (; a !== null; ) {
          var r = bs(a);
          if (r !== null) switch (r.tag) {
            case 3:
              if (r = r.stateNode, r.current.memoizedState.isDehydrated) {
                var s = Ua(r.pendingLanes);
                if (s !== 0) {
                  var l = r;
                  for (l.pendingLanes |= 2, l.entangledLanes |= 2; s; ) {
                    var o = 1 << 31 - ln(s);
                    l.entanglements[1] |= o, s &= ~o;
                  }
                  ni(r), !(dt & 6) && (Ju = rn() + 500, mo(0));
                }
              }
              break;
            case 31:
            case 13:
              l = or(r, 2), l !== null && ke(l, r, 2), Bc(), rp(r, 2);
          }
          if (r = Td(i), r === null && If(t, e, i, lc, n), r === a) break;
          a = r;
        }
        a !== null && i.stopPropagation();
      } else If(t, e, i, null, n);
    }
  }
  function Td(t) {
    return t = bm(t), lp(t);
  }
  var lc = null;
  function lp(t) {
    if (lc = null, t = Ar(t), t !== null) {
      var e = ao(t);
      if (e === null) t = null;
      else {
        var n = e.tag;
        if (n === 13) {
          if (t = O_(e), t !== null) return t;
          t = null;
        } else if (n === 31) {
          if (t = z_(e), t !== null) return t;
          t = null;
        } else if (n === 3) {
          if (e.stateNode.current.memoizedState.isDehydrated) return e.tag === 3 ? e.stateNode.containerInfo : null;
          t = null;
        } else e !== t && (t = null);
      }
    }
    return lc = t, null;
  }
  function hS(t) {
    switch (t) {
      case "beforetoggle":
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "toggle":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 2;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 8;
      case "message":
        switch (GA()) {
          case N_:
            return 2;
          case j_:
            return 8;
          case Nu:
          case PA:
            return 32;
          case B_:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var xd = false, ra = null, sa = null, la = null, Gl = /* @__PURE__ */ new Map(), Pl = /* @__PURE__ */ new Map(), ki = [], nM = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");
  function xg(t, e) {
    switch (t) {
      case "focusin":
      case "focusout":
        ra = null;
        break;
      case "dragenter":
      case "dragleave":
        sa = null;
        break;
      case "mouseover":
      case "mouseout":
        la = null;
        break;
      case "pointerover":
      case "pointerout":
        Gl.delete(e.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pl.delete(e.pointerId);
    }
  }
  function qs(t, e, n, i, a, r) {
    return t === null || t.nativeEvent !== r ? (t = {
      blockedOn: e,
      domEventName: n,
      eventSystemFlags: i,
      nativeEvent: r,
      targetContainers: [
        a
      ]
    }, e !== null && (e = bs(e), e !== null && fS(e)), t) : (t.eventSystemFlags |= i, e = t.targetContainers, a !== null && e.indexOf(a) === -1 && e.push(a), t);
  }
  function iM(t, e, n, i, a) {
    switch (e) {
      case "focusin":
        return ra = qs(ra, t, e, n, i, a), true;
      case "dragenter":
        return sa = qs(sa, t, e, n, i, a), true;
      case "mouseover":
        return la = qs(la, t, e, n, i, a), true;
      case "pointerover":
        var r = a.pointerId;
        return Gl.set(r, qs(Gl.get(r) || null, t, e, n, i, a)), true;
      case "gotpointercapture":
        return r = a.pointerId, Pl.set(r, qs(Pl.get(r) || null, t, e, n, i, a)), true;
    }
    return false;
  }
  function dS(t) {
    var e = Ar(t.target);
    if (e !== null) {
      var n = ao(e);
      if (n !== null) {
        if (e = n.tag, e === 13) {
          if (e = O_(n), e !== null) {
            t.blockedOn = e, l0(t.priority, function() {
              Tg(n);
            });
            return;
          }
        } else if (e === 31) {
          if (e = z_(n), e !== null) {
            t.blockedOn = e, l0(t.priority, function() {
              Tg(n);
            });
            return;
          }
        } else if (e === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          t.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    t.blockedOn = null;
  }
  function Su(t) {
    if (t.blockedOn !== null) return false;
    for (var e = t.targetContainers; 0 < e.length; ) {
      var n = Td(t.nativeEvent);
      if (n === null) {
        n = t.nativeEvent;
        var i = new n.constructor(n.type, n);
        Gh = i, n.target.dispatchEvent(i), Gh = null;
      } else return e = bs(n), e !== null && fS(e), t.blockedOn = n, false;
      e.shift();
    }
    return true;
  }
  function Ag(t, e, n) {
    Su(t) && n.delete(e);
  }
  function aM() {
    xd = false, ra !== null && Su(ra) && (ra = null), sa !== null && Su(sa) && (sa = null), la !== null && Su(la) && (la = null), Gl.forEach(Ag), Pl.forEach(Ag);
  }
  function $o(t, e) {
    t.blockedOn === e && (t.blockedOn = null, xd || (xd = true, ce.unstable_scheduleCallback(ce.unstable_NormalPriority, aM)));
  }
  var Wo = null;
  function Eg(t) {
    Wo !== t && (Wo = t, ce.unstable_scheduleCallback(ce.unstable_NormalPriority, function() {
      Wo === t && (Wo = null);
      for (var e = 0; e < t.length; e += 3) {
        var n = t[e], i = t[e + 1], a = t[e + 2];
        if (typeof i != "function") {
          if (lp(i || n) === null) continue;
          break;
        }
        var r = bs(n);
        r !== null && (t.splice(e, 3), e -= 3, id(r, {
          pending: true,
          data: a,
          method: n.method,
          action: i
        }, i, a));
      }
    }));
  }
  function os(t) {
    function e(o) {
      return $o(o, t);
    }
    ra !== null && $o(ra, t), sa !== null && $o(sa, t), la !== null && $o(la, t), Gl.forEach(e), Pl.forEach(e);
    for (var n = 0; n < ki.length; n++) {
      var i = ki[n];
      i.blockedOn === t && (i.blockedOn = null);
    }
    for (; 0 < ki.length && (n = ki[0], n.blockedOn === null); ) dS(n), n.blockedOn === null && ki.shift();
    if (n = (t.ownerDocument || t).$$reactFormReplay, n != null) for (i = 0; i < n.length; i += 3) {
      var a = n[i], r = n[i + 1], s = a[Qe] || null;
      if (typeof r == "function") s || Eg(n);
      else if (s) {
        var l = null;
        if (r && r.hasAttribute("formAction")) {
          if (a = r, s = r[Qe] || null) l = s.formAction;
          else if (lp(a) !== null) continue;
        } else l = s.action;
        typeof l == "function" ? n[i + 1] = l : (n.splice(i, 3), i -= 3), Eg(n);
      }
    }
  }
  function mS() {
    function t(r) {
      r.canIntercept && r.info === "react-transition" && r.intercept({
        handler: function() {
          return new Promise(function(s) {
            return a = s;
          });
        },
        focusReset: "manual",
        scroll: "manual"
      });
    }
    function e() {
      a !== null && (a(), a = null), i || setTimeout(n, 20);
    }
    function n() {
      if (!i && !navigation.transition) {
        var r = navigation.currentEntry;
        r && r.url != null && navigation.navigate(r.url, {
          state: r.getState(),
          info: "react-transition",
          history: "replace"
        });
      }
    }
    if (typeof navigation == "object") {
      var i = false, a = null;
      return navigation.addEventListener("navigate", t), navigation.addEventListener("navigatesuccess", e), navigation.addEventListener("navigateerror", e), setTimeout(n, 100), function() {
        i = true, navigation.removeEventListener("navigate", t), navigation.removeEventListener("navigatesuccess", e), navigation.removeEventListener("navigateerror", e), a !== null && (a(), a = null);
      };
    }
  }
  function op(t) {
    this._internalRoot = t;
  }
  Gc.prototype.render = op.prototype.render = function(t) {
    var e = this._internalRoot;
    if (e === null) throw Error(j(409));
    var n = e.current, i = on();
    cS(n, i, t, e, null, null);
  };
  Gc.prototype.unmount = op.prototype.unmount = function() {
    var t = this._internalRoot;
    if (t !== null) {
      this._internalRoot = null;
      var e = t.containerInfo;
      cS(t.current, 2, null, t, null, null), Bc(), e[_s] = null;
    }
  };
  function Gc(t) {
    this._internalRoot = t;
  }
  Gc.prototype.unstable_scheduleHydration = function(t) {
    if (t) {
      var e = k_();
      t = {
        blockedOn: null,
        target: t,
        priority: e
      };
      for (var n = 0; n < ki.length && e !== 0 && e < ki[n].priority; n++) ;
      ki.splice(n, 0, t), n === 0 && dS(t);
    }
  };
  var wg = D_.version;
  if (wg !== "19.2.0") throw Error(j(527, wg, "19.2.0"));
  mt.findDOMNode = function(t) {
    var e = t._reactInternals;
    if (e === void 0) throw typeof t.render == "function" ? Error(j(188)) : (t = Object.keys(t).join(","), Error(j(268, t)));
    return t = VA(e), t = t !== null ? U_(t) : null, t = t === null ? null : t.stateNode, t;
  };
  var rM = {
    bundleType: 0,
    version: "19.2.0",
    rendererPackageName: "react-dom",
    currentDispatcherRef: et,
    reconcilerVersion: "19.2.0"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Io = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Io.isDisabled && Io.supportsFiber) try {
      ro = Io.inject(rM), sn = Io;
    } catch {
    }
  }
  Ac.createRoot = function(t, e) {
    if (!R_(t)) throw Error(j(299));
    var n = false, i = "", a = rb, r = sb, s = lb;
    return e != null && (e.unstable_strictMode === true && (n = true), e.identifierPrefix !== void 0 && (i = e.identifierPrefix), e.onUncaughtError !== void 0 && (a = e.onUncaughtError), e.onCaughtError !== void 0 && (r = e.onCaughtError), e.onRecoverableError !== void 0 && (s = e.onRecoverableError)), e = oS(t, 1, false, null, null, n, i, null, a, r, s, mS), t[_s] = e.current, np(t), new op(e);
  };
  Ac.hydrateRoot = function(t, e, n) {
    if (!R_(t)) throw Error(j(299));
    var i = false, a = "", r = rb, s = sb, l = lb, o = null;
    return n != null && (n.unstable_strictMode === true && (i = true), n.identifierPrefix !== void 0 && (a = n.identifierPrefix), n.onUncaughtError !== void 0 && (r = n.onUncaughtError), n.onCaughtError !== void 0 && (s = n.onCaughtError), n.onRecoverableError !== void 0 && (l = n.onRecoverableError), n.formState !== void 0 && (o = n.formState)), e = oS(t, 1, true, e, n ?? null, i, a, o, r, s, l, mS), e.context = uS(null), n = e.current, i = on(), i = ym(i), a = ea(i), a.callback = null, na(n, a, i), n = i, e.current.lanes = n, lo(e, n), ni(e), t[_s] = e.current, np(t), new Gc(e);
  };
  Ac.version = "19.2.0";
  function pS() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pS);
    } catch (t) {
      console.error(t);
    }
  }
  pS(), x_.exports = Ac;
  var sM = x_.exports;
  const lM = d_(sM);
  var Mg = "popstate";
  function oM(t = {}) {
    function e(a, r) {
      let { pathname: s = "/", search: l = "", hash: o = "" } = cr(a.location.hash.substring(1));
      return !s.startsWith("/") && !s.startsWith(".") && (s = "/" + s), Ad("", {
        pathname: s,
        search: l,
        hash: o
      }, r.state && r.state.usr || null, r.state && r.state.key || "default");
    }
    function n(a, r) {
      let s = a.document.querySelector("base"), l = "";
      if (s && s.getAttribute("href")) {
        let o = a.location.href, c = o.indexOf("#");
        l = c === -1 ? o : o.slice(0, c);
      }
      return l + "#" + (typeof r == "string" ? r : kl(r));
    }
    function i(a, r) {
      Hn(a.pathname.charAt(0) === "/", `relative pathnames are not supported in hash history.push(${JSON.stringify(r)})`);
    }
    return cM(e, n, i, t);
  }
  function Gt(t, e) {
    if (t === false || t === null || typeof t > "u") throw new Error(e);
  }
  function Hn(t, e) {
    if (!t) {
      typeof console < "u" && console.warn(e);
      try {
        throw new Error(e);
      } catch {
      }
    }
  }
  function uM() {
    return Math.random().toString(36).substring(2, 10);
  }
  function Cg(t, e) {
    return {
      usr: t.state,
      key: t.key,
      idx: e
    };
  }
  function Ad(t, e, n = null, i) {
    return {
      pathname: typeof t == "string" ? t : t.pathname,
      search: "",
      hash: "",
      ...typeof e == "string" ? cr(e) : e,
      state: n,
      key: e && e.key || i || uM()
    };
  }
  function kl({ pathname: t = "/", search: e = "", hash: n = "" }) {
    return e && e !== "?" && (t += e.charAt(0) === "?" ? e : "?" + e), n && n !== "#" && (t += n.charAt(0) === "#" ? n : "#" + n), t;
  }
  function cr(t) {
    let e = {};
    if (t) {
      let n = t.indexOf("#");
      n >= 0 && (e.hash = t.substring(n), t = t.substring(0, n));
      let i = t.indexOf("?");
      i >= 0 && (e.search = t.substring(i), t = t.substring(0, i)), t && (e.pathname = t);
    }
    return e;
  }
  function cM(t, e, n, i = {}) {
    let { window: a = document.defaultView, v5Compat: r = false } = i, s = a.history, l = "POP", o = null, c = f();
    c == null && (c = 0, s.replaceState({
      ...s.state,
      idx: c
    }, ""));
    function f() {
      return (s.state || {
        idx: null
      }).idx;
    }
    function d() {
      l = "POP";
      let x = f(), v = x == null ? null : x - c;
      c = x, o && o({
        action: l,
        location: b.location,
        delta: v
      });
    }
    function m(x, v) {
      l = "PUSH";
      let g = Ad(b.location, x, v);
      n && n(g, x), c = f() + 1;
      let S = Cg(g, c), A = b.createHref(g);
      try {
        s.pushState(S, "", A);
      } catch (w) {
        if (w instanceof DOMException && w.name === "DataCloneError") throw w;
        a.location.assign(A);
      }
      r && o && o({
        action: l,
        location: b.location,
        delta: 1
      });
    }
    function y(x, v) {
      l = "REPLACE";
      let g = Ad(b.location, x, v);
      n && n(g, x), c = f();
      let S = Cg(g, c), A = b.createHref(g);
      s.replaceState(S, "", A), r && o && o({
        action: l,
        location: b.location,
        delta: 0
      });
    }
    function T(x) {
      return fM(x);
    }
    let b = {
      get action() {
        return l;
      },
      get location() {
        return t(a, s);
      },
      listen(x) {
        if (o) throw new Error("A history only accepts one active listener");
        return a.addEventListener(Mg, d), o = x, () => {
          a.removeEventListener(Mg, d), o = null;
        };
      },
      createHref(x) {
        return e(a, x);
      },
      createURL: T,
      encodeLocation(x) {
        let v = T(x);
        return {
          pathname: v.pathname,
          search: v.search,
          hash: v.hash
        };
      },
      push: m,
      replace: y,
      go(x) {
        return s.go(x);
      }
    };
    return b;
  }
  function fM(t, e = false) {
    let n = "http://localhost";
    typeof window < "u" && (n = window.location.origin !== "null" ? window.location.origin : window.location.href), Gt(n, "No window.location.(origin|href) available to create URL");
    let i = typeof t == "string" ? t : kl(t);
    return i = i.replace(/ $/, "%20"), !e && i.startsWith("//") && (i = n + i), new URL(i, n);
  }
  function yS(t, e, n = "/") {
    return hM(t, e, n, false);
  }
  function hM(t, e, n, i) {
    let a = typeof e == "string" ? cr(e) : e, r = Mi(a.pathname || "/", n);
    if (r == null) return null;
    let s = gS(t);
    dM(s);
    let l = null;
    for (let o = 0; l == null && o < s.length; ++o) {
      let c = AM(r);
      l = TM(s[o], c, i);
    }
    return l;
  }
  function gS(t, e = [], n = [], i = "", a = false) {
    let r = (s, l, o = a, c) => {
      let f = {
        relativePath: c === void 0 ? s.path || "" : c,
        caseSensitive: s.caseSensitive === true,
        childrenIndex: l,
        route: s
      };
      if (f.relativePath.startsWith("/")) {
        if (!f.relativePath.startsWith(i) && o) return;
        Gt(f.relativePath.startsWith(i), `Absolute route path "${f.relativePath}" nested under path "${i}" is not valid. An absolute child route path must start with the combined path of all its parent routes.`), f.relativePath = f.relativePath.slice(i.length);
      }
      let d = Si([
        i,
        f.relativePath
      ]), m = n.concat(f);
      s.children && s.children.length > 0 && (Gt(s.index !== true, `Index routes must not have child routes. Please remove all child routes from route path "${d}".`), gS(s.children, e, m, d, o)), !(s.path == null && !s.index) && e.push({
        path: d,
        score: bM(d, s.index),
        routesMeta: m
      });
    };
    return t.forEach((s, l) => {
      var _a2;
      if (s.path === "" || !((_a2 = s.path) == null ? void 0 : _a2.includes("?"))) r(s, l);
      else for (let o of vS(s.path)) r(s, l, true, o);
    }), e;
  }
  function vS(t) {
    let e = t.split("/");
    if (e.length === 0) return [];
    let [n, ...i] = e, a = n.endsWith("?"), r = n.replace(/\?$/, "");
    if (i.length === 0) return a ? [
      r,
      ""
    ] : [
      r
    ];
    let s = vS(i.join("/")), l = [];
    return l.push(...s.map((o) => o === "" ? r : [
      r,
      o
    ].join("/"))), a && l.push(...s), l.map((o) => t.startsWith("/") && o === "" ? "/" : o);
  }
  function dM(t) {
    t.sort((e, n) => e.score !== n.score ? n.score - e.score : SM(e.routesMeta.map((i) => i.childrenIndex), n.routesMeta.map((i) => i.childrenIndex)));
  }
  var mM = /^:[\w-]+$/, pM = 3, yM = 2, gM = 1, vM = 10, _M = -2, Dg = (t) => t === "*";
  function bM(t, e) {
    let n = t.split("/"), i = n.length;
    return n.some(Dg) && (i += _M), e && (i += yM), n.filter((a) => !Dg(a)).reduce((a, r) => a + (mM.test(r) ? pM : r === "" ? gM : vM), i);
  }
  function SM(t, e) {
    return t.length === e.length && t.slice(0, -1).every((i, a) => i === e[a]) ? t[t.length - 1] - e[e.length - 1] : 0;
  }
  function TM(t, e, n = false) {
    let { routesMeta: i } = t, a = {}, r = "/", s = [];
    for (let l = 0; l < i.length; ++l) {
      let o = i[l], c = l === i.length - 1, f = r === "/" ? e : e.slice(r.length) || "/", d = oc({
        path: o.relativePath,
        caseSensitive: o.caseSensitive,
        end: c
      }, f), m = o.route;
      if (!d && c && n && !i[i.length - 1].route.index && (d = oc({
        path: o.relativePath,
        caseSensitive: o.caseSensitive,
        end: false
      }, f)), !d) return null;
      Object.assign(a, d.params), s.push({
        params: a,
        pathname: Si([
          r,
          d.pathname
        ]),
        pathnameBase: CM(Si([
          r,
          d.pathnameBase
        ])),
        route: m
      }), d.pathnameBase !== "/" && (r = Si([
        r,
        d.pathnameBase
      ]));
    }
    return s;
  }
  function oc(t, e) {
    typeof t == "string" && (t = {
      path: t,
      caseSensitive: false,
      end: true
    });
    let [n, i] = xM(t.path, t.caseSensitive, t.end), a = e.match(n);
    if (!a) return null;
    let r = a[0], s = r.replace(/(.)\/+$/, "$1"), l = a.slice(1);
    return {
      params: i.reduce((c, { paramName: f, isOptional: d }, m) => {
        if (f === "*") {
          let T = l[m] || "";
          s = r.slice(0, r.length - T.length).replace(/(.)\/+$/, "$1");
        }
        const y = l[m];
        return d && !y ? c[f] = void 0 : c[f] = (y || "").replace(/%2F/g, "/"), c;
      }, {}),
      pathname: r,
      pathnameBase: s,
      pattern: t
    };
  }
  function xM(t, e = false, n = true) {
    Hn(t === "*" || !t.endsWith("*") || t.endsWith("/*"), `Route path "${t}" will be treated as if it were "${t.replace(/\*$/, "/*")}" because the \`*\` character must always follow a \`/\` in the pattern. To get rid of this warning, please change the route path to "${t.replace(/\*$/, "/*")}".`);
    let i = [], a = "^" + t.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (s, l, o) => (i.push({
      paramName: l,
      isOptional: o != null
    }), o ? "/?([^\\/]+)?" : "/([^\\/]+)")).replace(/\/([\w-]+)\?(\/|$)/g, "(/$1)?$2");
    return t.endsWith("*") ? (i.push({
      paramName: "*"
    }), a += t === "*" || t === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$") : n ? a += "\\/*$" : t !== "" && t !== "/" && (a += "(?:(?=\\/|$))"), [
      new RegExp(a, e ? void 0 : "i"),
      i
    ];
  }
  function AM(t) {
    try {
      return t.split("/").map((e) => decodeURIComponent(e).replace(/\//g, "%2F")).join("/");
    } catch (e) {
      return Hn(false, `The URL path "${t}" could not be decoded because it is a malformed URL segment. This is probably due to a bad percent encoding (${e}).`), t;
    }
  }
  function Mi(t, e) {
    if (e === "/") return t;
    if (!t.toLowerCase().startsWith(e.toLowerCase())) return null;
    let n = e.endsWith("/") ? e.length - 1 : e.length, i = t.charAt(n);
    return i && i !== "/" ? null : t.slice(n) || "/";
  }
  function EM(t, e = "/") {
    let { pathname: n, search: i = "", hash: a = "" } = typeof t == "string" ? cr(t) : t;
    return {
      pathname: n ? n.startsWith("/") ? n : wM(n, e) : e,
      search: DM(i),
      hash: RM(a)
    };
  }
  function wM(t, e) {
    let n = e.replace(/\/+$/, "").split("/");
    return t.split("/").forEach((a) => {
      a === ".." ? n.length > 1 && n.pop() : a !== "." && n.push(a);
    }), n.length > 1 ? n.join("/") : "/";
  }
  function nh(t, e, n, i) {
    return `Cannot include a '${t}' character in a manually specified \`to.${e}\` field [${JSON.stringify(i)}].  Please separate it out to the \`to.${n}\` field. Alternatively you may provide the full path as a string in <Link to="..."> and the router will parse it for you.`;
  }
  function MM(t) {
    return t.filter((e, n) => n === 0 || e.route.path && e.route.path.length > 0);
  }
  function _S(t) {
    let e = MM(t);
    return e.map((n, i) => i === e.length - 1 ? n.pathname : n.pathnameBase);
  }
  function bS(t, e, n, i = false) {
    let a;
    typeof t == "string" ? a = cr(t) : (a = {
      ...t
    }, Gt(!a.pathname || !a.pathname.includes("?"), nh("?", "pathname", "search", a)), Gt(!a.pathname || !a.pathname.includes("#"), nh("#", "pathname", "hash", a)), Gt(!a.search || !a.search.includes("#"), nh("#", "search", "hash", a)));
    let r = t === "" || a.pathname === "", s = r ? "/" : a.pathname, l;
    if (s == null) l = n;
    else {
      let d = e.length - 1;
      if (!i && s.startsWith("..")) {
        let m = s.split("/");
        for (; m[0] === ".."; ) m.shift(), d -= 1;
        a.pathname = m.join("/");
      }
      l = d >= 0 ? e[d] : "/";
    }
    let o = EM(a, l), c = s && s !== "/" && s.endsWith("/"), f = (r || s === ".") && n.endsWith("/");
    return !o.pathname.endsWith("/") && (c || f) && (o.pathname += "/"), o;
  }
  var Si = (t) => t.join("/").replace(/\/\/+/g, "/"), CM = (t) => t.replace(/\/+$/, "").replace(/^\/*/, "/"), DM = (t) => !t || t === "?" ? "" : t.startsWith("?") ? t : "?" + t, RM = (t) => !t || t === "#" ? "" : t.startsWith("#") ? t : "#" + t;
  function OM(t) {
    return t != null && typeof t.status == "number" && typeof t.statusText == "string" && typeof t.internal == "boolean" && "data" in t;
  }
  var SS = [
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
  ];
  new Set(SS);
  var zM = [
    "GET",
    ...SS
  ];
  new Set(zM);
  var ws = D.createContext(null);
  ws.displayName = "DataRouter";
  var Pc = D.createContext(null);
  Pc.displayName = "DataRouterState";
  D.createContext(false);
  var TS = D.createContext({
    isTransitioning: false
  });
  TS.displayName = "ViewTransition";
  var UM = D.createContext(/* @__PURE__ */ new Map());
  UM.displayName = "Fetchers";
  var VM = D.createContext(null);
  VM.displayName = "Await";
  var ii = D.createContext(null);
  ii.displayName = "Navigation";
  var go = D.createContext(null);
  go.displayName = "Location";
  var Ui = D.createContext({
    outlet: null,
    matches: [],
    isDataRoute: false
  });
  Ui.displayName = "Route";
  var up = D.createContext(null);
  up.displayName = "RouteError";
  function LM(t, { relative: e } = {}) {
    Gt(vo(), "useHref() may be used only in the context of a <Router> component.");
    let { basename: n, navigator: i } = D.useContext(ii), { hash: a, pathname: r, search: s } = _o(t, {
      relative: e
    }), l = r;
    return n !== "/" && (l = r === "/" ? n : Si([
      n,
      r
    ])), i.createHref({
      pathname: l,
      search: s,
      hash: a
    });
  }
  function vo() {
    return D.useContext(go) != null;
  }
  function fr() {
    return Gt(vo(), "useLocation() may be used only in the context of a <Router> component."), D.useContext(go).location;
  }
  var xS = "You should call navigate() in a React.useEffect(), not when your component is first rendered.";
  function AS(t) {
    D.useContext(ii).static || D.useLayoutEffect(t);
  }
  function ES() {
    let { isDataRoute: t } = D.useContext(Ui);
    return t ? QM() : NM();
  }
  function NM() {
    Gt(vo(), "useNavigate() may be used only in the context of a <Router> component.");
    let t = D.useContext(ws), { basename: e, navigator: n } = D.useContext(ii), { matches: i } = D.useContext(Ui), { pathname: a } = fr(), r = JSON.stringify(_S(i)), s = D.useRef(false);
    return AS(() => {
      s.current = true;
    }), D.useCallback((o, c = {}) => {
      if (Hn(s.current, xS), !s.current) return;
      if (typeof o == "number") {
        n.go(o);
        return;
      }
      let f = bS(o, JSON.parse(r), a, c.relative === "path");
      t == null && e !== "/" && (f.pathname = f.pathname === "/" ? e : Si([
        e,
        f.pathname
      ])), (c.replace ? n.replace : n.push)(f, c.state, c);
    }, [
      e,
      n,
      r,
      a,
      t
    ]);
  }
  D.createContext(null);
  function _o(t, { relative: e } = {}) {
    let { matches: n } = D.useContext(Ui), { pathname: i } = fr(), a = JSON.stringify(_S(n));
    return D.useMemo(() => bS(t, JSON.parse(a), i, e === "path"), [
      t,
      a,
      i,
      e
    ]);
  }
  function jM(t, e) {
    return wS(t, e);
  }
  function wS(t, e, n, i, a) {
    var _a2;
    Gt(vo(), "useRoutes() may be used only in the context of a <Router> component.");
    let { navigator: r } = D.useContext(ii), { matches: s } = D.useContext(Ui), l = s[s.length - 1], o = l ? l.params : {}, c = l ? l.pathname : "/", f = l ? l.pathnameBase : "/", d = l && l.route;
    {
      let g = d && d.path || "";
      MS(c, !d || g.endsWith("*") || g.endsWith("*?"), `You rendered descendant <Routes> (or called \`useRoutes()\`) at "${c}" (under <Route path="${g}">) but the parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

Please change the parent <Route path="${g}"> to <Route path="${g === "/" ? "*" : `${g}/*`}">.`);
    }
    let m = fr(), y;
    if (e) {
      let g = typeof e == "string" ? cr(e) : e;
      Gt(f === "/" || ((_a2 = g.pathname) == null ? void 0 : _a2.startsWith(f)), `When overriding the location using \`<Routes location>\` or \`useRoutes(routes, location)\`, the location pathname must begin with the portion of the URL pathname that was matched by all parent routes. The current pathname base is "${f}" but pathname "${g.pathname}" was given in the \`location\` prop.`), y = g;
    } else y = m;
    let T = y.pathname || "/", b = T;
    if (f !== "/") {
      let g = f.replace(/^\//, "").split("/");
      b = "/" + T.replace(/^\//, "").split("/").slice(g.length).join("/");
    }
    let x = yS(t, {
      pathname: b
    });
    Hn(d || x != null, `No routes matched location "${y.pathname}${y.search}${y.hash}" `), Hn(x == null || x[x.length - 1].route.element !== void 0 || x[x.length - 1].route.Component !== void 0 || x[x.length - 1].route.lazy !== void 0, `Matched leaf route at location "${y.pathname}${y.search}${y.hash}" does not have an element or Component. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.`);
    let v = PM(x && x.map((g) => Object.assign({}, g, {
      params: Object.assign({}, o, g.params),
      pathname: Si([
        f,
        r.encodeLocation ? r.encodeLocation(g.pathname.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : g.pathname
      ]),
      pathnameBase: g.pathnameBase === "/" ? f : Si([
        f,
        r.encodeLocation ? r.encodeLocation(g.pathnameBase.replace(/\?/g, "%3F").replace(/#/g, "%23")).pathname : g.pathnameBase
      ])
    })), s, n, i, a);
    return e && v ? D.createElement(go.Provider, {
      value: {
        location: {
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default",
          ...y
        },
        navigationType: "POP"
      }
    }, v) : v;
  }
  function BM() {
    let t = KM(), e = OM(t) ? `${t.status} ${t.statusText}` : t instanceof Error ? t.message : JSON.stringify(t), n = t instanceof Error ? t.stack : null, i = "rgba(200,200,200, 0.5)", a = {
      padding: "0.5rem",
      backgroundColor: i
    }, r = {
      padding: "2px 4px",
      backgroundColor: i
    }, s = null;
    return console.error("Error handled by React Router default ErrorBoundary:", t), s = D.createElement(D.Fragment, null, D.createElement("p", null, "\u{1F4BF} Hey developer \u{1F44B}"), D.createElement("p", null, "You can provide a way better UX than this when your app throws errors by providing your own ", D.createElement("code", {
      style: r
    }, "ErrorBoundary"), " or", " ", D.createElement("code", {
      style: r
    }, "errorElement"), " prop on your route.")), D.createElement(D.Fragment, null, D.createElement("h2", null, "Unexpected Application Error!"), D.createElement("h3", {
      style: {
        fontStyle: "italic"
      }
    }, e), n ? D.createElement("pre", {
      style: a
    }, n) : null, s);
  }
  var HM = D.createElement(BM, null), YM = class extends D.Component {
    constructor(t) {
      super(t), this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error
      };
    }
    static getDerivedStateFromError(t) {
      return {
        error: t
      };
    }
    static getDerivedStateFromProps(t, e) {
      return e.location !== t.location || e.revalidation !== "idle" && t.revalidation === "idle" ? {
        error: t.error,
        location: t.location,
        revalidation: t.revalidation
      } : {
        error: t.error !== void 0 ? t.error : e.error,
        location: e.location,
        revalidation: t.revalidation || e.revalidation
      };
    }
    componentDidCatch(t, e) {
      this.props.unstable_onError ? this.props.unstable_onError(t, e) : console.error("React Router caught the following error during render", t);
    }
    render() {
      return this.state.error !== void 0 ? D.createElement(Ui.Provider, {
        value: this.props.routeContext
      }, D.createElement(up.Provider, {
        value: this.state.error,
        children: this.props.component
      })) : this.props.children;
    }
  };
  function GM({ routeContext: t, match: e, children: n }) {
    let i = D.useContext(ws);
    return i && i.static && i.staticContext && (e.route.errorElement || e.route.ErrorBoundary) && (i.staticContext._deepestRenderedBoundaryId = e.route.id), D.createElement(Ui.Provider, {
      value: t
    }, n);
  }
  function PM(t, e = [], n = null, i = null, a = null) {
    if (t == null) {
      if (!n) return null;
      if (n.errors) t = n.matches;
      else if (e.length === 0 && !n.initialized && n.matches.length > 0) t = n.matches;
      else return null;
    }
    let r = t, s = n == null ? void 0 : n.errors;
    if (s != null) {
      let c = r.findIndex((f) => f.route.id && (s == null ? void 0 : s[f.route.id]) !== void 0);
      Gt(c >= 0, `Could not find a matching route for errors on route IDs: ${Object.keys(s).join(",")}`), r = r.slice(0, Math.min(r.length, c + 1));
    }
    let l = false, o = -1;
    if (n) for (let c = 0; c < r.length; c++) {
      let f = r[c];
      if ((f.route.HydrateFallback || f.route.hydrateFallbackElement) && (o = c), f.route.id) {
        let { loaderData: d, errors: m } = n, y = f.route.loader && !d.hasOwnProperty(f.route.id) && (!m || m[f.route.id] === void 0);
        if (f.route.lazy || y) {
          l = true, o >= 0 ? r = r.slice(0, o + 1) : r = [
            r[0]
          ];
          break;
        }
      }
    }
    return r.reduceRight((c, f, d) => {
      let m, y = false, T = null, b = null;
      n && (m = s && f.route.id ? s[f.route.id] : void 0, T = f.route.errorElement || HM, l && (o < 0 && d === 0 ? (MS("route-fallback", false, "No `HydrateFallback` element provided to render during initial hydration"), y = true, b = null) : o === d && (y = true, b = f.route.hydrateFallbackElement || null)));
      let x = e.concat(r.slice(0, d + 1)), v = () => {
        let g;
        return m ? g = T : y ? g = b : f.route.Component ? g = D.createElement(f.route.Component, null) : f.route.element ? g = f.route.element : g = c, D.createElement(GM, {
          match: f,
          routeContext: {
            outlet: c,
            matches: x,
            isDataRoute: n != null
          },
          children: g
        });
      };
      return n && (f.route.ErrorBoundary || f.route.errorElement || d === 0) ? D.createElement(YM, {
        location: n.location,
        revalidation: n.revalidation,
        component: T,
        error: m,
        children: v(),
        routeContext: {
          outlet: null,
          matches: x,
          isDataRoute: true
        },
        unstable_onError: i
      }) : v();
    }, null);
  }
  function cp(t) {
    return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
  }
  function kM(t) {
    let e = D.useContext(ws);
    return Gt(e, cp(t)), e;
  }
  function XM(t) {
    let e = D.useContext(Pc);
    return Gt(e, cp(t)), e;
  }
  function FM(t) {
    let e = D.useContext(Ui);
    return Gt(e, cp(t)), e;
  }
  function fp(t) {
    let e = FM(t), n = e.matches[e.matches.length - 1];
    return Gt(n.route.id, `${t} can only be used on routes that contain a unique "id"`), n.route.id;
  }
  function qM() {
    return fp("useRouteId");
  }
  function KM() {
    var _a2;
    let t = D.useContext(up), e = XM("useRouteError"), n = fp("useRouteError");
    return t !== void 0 ? t : (_a2 = e.errors) == null ? void 0 : _a2[n];
  }
  function QM() {
    let { router: t } = kM("useNavigate"), e = fp("useNavigate"), n = D.useRef(false);
    return AS(() => {
      n.current = true;
    }), D.useCallback(async (a, r = {}) => {
      Hn(n.current, xS), n.current && (typeof a == "number" ? t.navigate(a) : await t.navigate(a, {
        fromRouteId: e,
        ...r
      }));
    }, [
      t,
      e
    ]);
  }
  var Rg = {};
  function MS(t, e, n) {
    !e && !Rg[t] && (Rg[t] = true, Hn(false, n));
  }
  D.memo(ZM);
  function ZM({ routes: t, future: e, state: n, unstable_onError: i }) {
    return wS(t, void 0, n, i, e);
  }
  function Tu(t) {
    Gt(false, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.");
  }
  function JM({ basename: t = "/", children: e = null, location: n, navigationType: i = "POP", navigator: a, static: r = false }) {
    Gt(!vo(), "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.");
    let s = t.replace(/^\/*/, "/"), l = D.useMemo(() => ({
      basename: s,
      navigator: a,
      static: r,
      future: {}
    }), [
      s,
      a,
      r
    ]);
    typeof n == "string" && (n = cr(n));
    let { pathname: o = "/", search: c = "", hash: f = "", state: d = null, key: m = "default" } = n, y = D.useMemo(() => {
      let T = Mi(o, s);
      return T == null ? null : {
        location: {
          pathname: T,
          search: c,
          hash: f,
          state: d,
          key: m
        },
        navigationType: i
      };
    }, [
      s,
      o,
      c,
      f,
      d,
      m,
      i
    ]);
    return Hn(y != null, `<Router basename="${s}"> is not able to match the URL "${o}${c}${f}" because it does not start with the basename, so the <Router> won't render anything.`), y == null ? null : D.createElement(ii.Provider, {
      value: l
    }, D.createElement(go.Provider, {
      children: e,
      value: y
    }));
  }
  function $M({ children: t, location: e }) {
    return jM(Ed(t), e);
  }
  function Ed(t, e = []) {
    let n = [];
    return D.Children.forEach(t, (i, a) => {
      if (!D.isValidElement(i)) return;
      let r = [
        ...e,
        a
      ];
      if (i.type === D.Fragment) {
        n.push.apply(n, Ed(i.props.children, r));
        return;
      }
      Gt(i.type === Tu, `[${typeof i.type == "string" ? i.type : i.type.name}] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`), Gt(!i.props.index || !i.props.children, "An index route cannot have child routes.");
      let s = {
        id: i.props.id || r.join("-"),
        caseSensitive: i.props.caseSensitive,
        element: i.props.element,
        Component: i.props.Component,
        index: i.props.index,
        path: i.props.path,
        middleware: i.props.middleware,
        loader: i.props.loader,
        action: i.props.action,
        hydrateFallbackElement: i.props.hydrateFallbackElement,
        HydrateFallback: i.props.HydrateFallback,
        errorElement: i.props.errorElement,
        ErrorBoundary: i.props.ErrorBoundary,
        hasErrorBoundary: i.props.hasErrorBoundary === true || i.props.ErrorBoundary != null || i.props.errorElement != null,
        shouldRevalidate: i.props.shouldRevalidate,
        handle: i.props.handle,
        lazy: i.props.lazy
      };
      i.props.children && (s.children = Ed(i.props.children, r)), n.push(s);
    }), n;
  }
  var xu = "get", Au = "application/x-www-form-urlencoded";
  function kc(t) {
    return t != null && typeof t.tagName == "string";
  }
  function WM(t) {
    return kc(t) && t.tagName.toLowerCase() === "button";
  }
  function IM(t) {
    return kc(t) && t.tagName.toLowerCase() === "form";
  }
  function tC(t) {
    return kc(t) && t.tagName.toLowerCase() === "input";
  }
  function eC(t) {
    return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
  }
  function nC(t, e) {
    return t.button === 0 && (!e || e === "_self") && !eC(t);
  }
  var tu = null;
  function iC() {
    if (tu === null) try {
      new FormData(document.createElement("form"), 0), tu = false;
    } catch {
      tu = true;
    }
    return tu;
  }
  var aC = /* @__PURE__ */ new Set([
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  ]);
  function ih(t) {
    return t != null && !aC.has(t) ? (Hn(false, `"${t}" is not a valid \`encType\` for \`<Form>\`/\`<fetcher.Form>\` and will default to "${Au}"`), null) : t;
  }
  function rC(t, e) {
    let n, i, a, r, s;
    if (IM(t)) {
      let l = t.getAttribute("action");
      i = l ? Mi(l, e) : null, n = t.getAttribute("method") || xu, a = ih(t.getAttribute("enctype")) || Au, r = new FormData(t);
    } else if (WM(t) || tC(t) && (t.type === "submit" || t.type === "image")) {
      let l = t.form;
      if (l == null) throw new Error('Cannot submit a <button> or <input type="submit"> without a <form>');
      let o = t.getAttribute("formaction") || l.getAttribute("action");
      if (i = o ? Mi(o, e) : null, n = t.getAttribute("formmethod") || l.getAttribute("method") || xu, a = ih(t.getAttribute("formenctype")) || ih(l.getAttribute("enctype")) || Au, r = new FormData(l, t), !iC()) {
        let { name: c, type: f, value: d } = t;
        if (f === "image") {
          let m = c ? `${c}.` : "";
          r.append(`${m}x`, "0"), r.append(`${m}y`, "0");
        } else c && r.append(c, d);
      }
    } else {
      if (kc(t)) throw new Error('Cannot submit element that is not <form>, <button>, or <input type="submit|image">');
      n = xu, i = null, a = Au, s = t;
    }
    return r && a === "text/plain" && (s = r, r = void 0), {
      action: i,
      method: n.toLowerCase(),
      encType: a,
      formData: r,
      body: s
    };
  }
  Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
  function hp(t, e) {
    if (t === false || t === null || typeof t > "u") throw new Error(e);
  }
  function sC(t, e, n) {
    let i = typeof t == "string" ? new URL(t, typeof window > "u" ? "server://singlefetch/" : window.location.origin) : t;
    return i.pathname === "/" ? i.pathname = `_root.${n}` : e && Mi(i.pathname, e) === "/" ? i.pathname = `${e.replace(/\/$/, "")}/_root.${n}` : i.pathname = `${i.pathname.replace(/\/$/, "")}.${n}`, i;
  }
  async function lC(t, e) {
    if (t.id in e) return e[t.id];
    try {
      let n = await import(t.module).then(async (m) => {
        await m.__tla;
        return m;
      });
      return e[t.id] = n, n;
    } catch (n) {
      return console.error(`Error loading route module \`${t.module}\`, reloading page...`), console.error(n), window.__reactRouterContext && window.__reactRouterContext.isSpaMode, window.location.reload(), new Promise(() => {
      });
    }
  }
  function oC(t) {
    return t == null ? false : t.href == null ? t.rel === "preload" && typeof t.imageSrcSet == "string" && typeof t.imageSizes == "string" : typeof t.rel == "string" && typeof t.href == "string";
  }
  async function uC(t, e, n) {
    let i = await Promise.all(t.map(async (a) => {
      let r = e.routes[a.route.id];
      if (r) {
        let s = await lC(r, n);
        return s.links ? s.links() : [];
      }
      return [];
    }));
    return dC(i.flat(1).filter(oC).filter((a) => a.rel === "stylesheet" || a.rel === "preload").map((a) => a.rel === "stylesheet" ? {
      ...a,
      rel: "prefetch",
      as: "style"
    } : {
      ...a,
      rel: "prefetch"
    }));
  }
  function Og(t, e, n, i, a, r) {
    let s = (o, c) => n[c] ? o.route.id !== n[c].route.id : true, l = (o, c) => {
      var _a2;
      return n[c].pathname !== o.pathname || ((_a2 = n[c].route.path) == null ? void 0 : _a2.endsWith("*")) && n[c].params["*"] !== o.params["*"];
    };
    return r === "assets" ? e.filter((o, c) => s(o, c) || l(o, c)) : r === "data" ? e.filter((o, c) => {
      var _a2;
      let f = i.routes[o.route.id];
      if (!f || !f.hasLoader) return false;
      if (s(o, c) || l(o, c)) return true;
      if (o.route.shouldRevalidate) {
        let d = o.route.shouldRevalidate({
          currentUrl: new URL(a.pathname + a.search + a.hash, window.origin),
          currentParams: ((_a2 = n[0]) == null ? void 0 : _a2.params) || {},
          nextUrl: new URL(t, window.origin),
          nextParams: o.params,
          defaultShouldRevalidate: true
        });
        if (typeof d == "boolean") return d;
      }
      return true;
    }) : [];
  }
  function cC(t, e, { includeHydrateFallback: n } = {}) {
    return fC(t.map((i) => {
      let a = e.routes[i.route.id];
      if (!a) return [];
      let r = [
        a.module
      ];
      return a.clientActionModule && (r = r.concat(a.clientActionModule)), a.clientLoaderModule && (r = r.concat(a.clientLoaderModule)), n && a.hydrateFallbackModule && (r = r.concat(a.hydrateFallbackModule)), a.imports && (r = r.concat(a.imports)), r;
    }).flat(1));
  }
  function fC(t) {
    return [
      ...new Set(t)
    ];
  }
  function hC(t) {
    let e = {}, n = Object.keys(t).sort();
    for (let i of n) e[i] = t[i];
    return e;
  }
  function dC(t, e) {
    let n = /* @__PURE__ */ new Set();
    return new Set(e), t.reduce((i, a) => {
      let r = JSON.stringify(hC(a));
      return n.has(r) || (n.add(r), i.push({
        key: r,
        link: a
      })), i;
    }, []);
  }
  function CS() {
    let t = D.useContext(ws);
    return hp(t, "You must render this element inside a <DataRouterContext.Provider> element"), t;
  }
  function mC() {
    let t = D.useContext(Pc);
    return hp(t, "You must render this element inside a <DataRouterStateContext.Provider> element"), t;
  }
  var dp = D.createContext(void 0);
  dp.displayName = "FrameworkContext";
  function DS() {
    let t = D.useContext(dp);
    return hp(t, "You must render this element inside a <HydratedRouter> element"), t;
  }
  function pC(t, e) {
    let n = D.useContext(dp), [i, a] = D.useState(false), [r, s] = D.useState(false), { onFocus: l, onBlur: o, onMouseEnter: c, onMouseLeave: f, onTouchStart: d } = e, m = D.useRef(null);
    D.useEffect(() => {
      if (t === "render" && s(true), t === "viewport") {
        let b = (v) => {
          v.forEach((g) => {
            s(g.isIntersecting);
          });
        }, x = new IntersectionObserver(b, {
          threshold: 0.5
        });
        return m.current && x.observe(m.current), () => {
          x.disconnect();
        };
      }
    }, [
      t
    ]), D.useEffect(() => {
      if (i) {
        let b = setTimeout(() => {
          s(true);
        }, 100);
        return () => {
          clearTimeout(b);
        };
      }
    }, [
      i
    ]);
    let y = () => {
      a(true);
    }, T = () => {
      a(false), s(false);
    };
    return n ? t !== "intent" ? [
      r,
      m,
      {}
    ] : [
      r,
      m,
      {
        onFocus: Ks(l, y),
        onBlur: Ks(o, T),
        onMouseEnter: Ks(c, y),
        onMouseLeave: Ks(f, T),
        onTouchStart: Ks(d, y)
      }
    ] : [
      false,
      m,
      {}
    ];
  }
  function Ks(t, e) {
    return (n) => {
      t && t(n), n.defaultPrevented || e(n);
    };
  }
  function yC({ page: t, ...e }) {
    let { router: n } = CS(), i = D.useMemo(() => yS(n.routes, t, n.basename), [
      n.routes,
      t,
      n.basename
    ]);
    return i ? D.createElement(vC, {
      page: t,
      matches: i,
      ...e
    }) : null;
  }
  function gC(t) {
    let { manifest: e, routeModules: n } = DS(), [i, a] = D.useState([]);
    return D.useEffect(() => {
      let r = false;
      return uC(t, e, n).then((s) => {
        r || a(s);
      }), () => {
        r = true;
      };
    }, [
      t,
      e,
      n
    ]), i;
  }
  function vC({ page: t, matches: e, ...n }) {
    let i = fr(), { manifest: a, routeModules: r } = DS(), { basename: s } = CS(), { loaderData: l, matches: o } = mC(), c = D.useMemo(() => Og(t, e, o, a, i, "data"), [
      t,
      e,
      o,
      a,
      i
    ]), f = D.useMemo(() => Og(t, e, o, a, i, "assets"), [
      t,
      e,
      o,
      a,
      i
    ]), d = D.useMemo(() => {
      if (t === i.pathname + i.search + i.hash) return [];
      let T = /* @__PURE__ */ new Set(), b = false;
      if (e.forEach((v) => {
        var _a2;
        let g = a.routes[v.route.id];
        !g || !g.hasLoader || (!c.some((S) => S.route.id === v.route.id) && v.route.id in l && ((_a2 = r[v.route.id]) == null ? void 0 : _a2.shouldRevalidate) || g.hasClientLoader ? b = true : T.add(v.route.id));
      }), T.size === 0) return [];
      let x = sC(t, s, "data");
      return b && T.size > 0 && x.searchParams.set("_routes", e.filter((v) => T.has(v.route.id)).map((v) => v.route.id).join(",")), [
        x.pathname + x.search
      ];
    }, [
      s,
      l,
      i,
      a,
      c,
      e,
      t,
      r
    ]), m = D.useMemo(() => cC(f, a), [
      f,
      a
    ]), y = gC(f);
    return D.createElement(D.Fragment, null, d.map((T) => D.createElement("link", {
      key: T,
      rel: "prefetch",
      as: "fetch",
      href: T,
      ...n
    })), m.map((T) => D.createElement("link", {
      key: T,
      rel: "modulepreload",
      href: T,
      ...n
    })), y.map(({ key: T, link: b }) => D.createElement("link", {
      key: T,
      nonce: n.nonce,
      ...b
    })));
  }
  function _C(...t) {
    return (e) => {
      t.forEach((n) => {
        typeof n == "function" ? n(e) : n != null && (n.current = e);
      });
    };
  }
  var RS = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
  try {
    RS && (window.__reactRouterVersion = "7.9.4");
  } catch {
  }
  function bC({ basename: t, children: e, window: n }) {
    let i = D.useRef();
    i.current == null && (i.current = oM({
      window: n,
      v5Compat: true
    }));
    let a = i.current, [r, s] = D.useState({
      action: a.action,
      location: a.location
    }), l = D.useCallback((o) => {
      D.startTransition(() => s(o));
    }, [
      s
    ]);
    return D.useLayoutEffect(() => a.listen(l), [
      a,
      l
    ]), D.createElement(JM, {
      basename: t,
      children: e,
      location: r.location,
      navigationType: r.action,
      navigator: a
    });
  }
  var OS = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i, mp = D.forwardRef(function({ onClick: e, discover: n = "render", prefetch: i = "none", relative: a, reloadDocument: r, replace: s, state: l, target: o, to: c, preventScrollReset: f, viewTransition: d, ...m }, y) {
    let { basename: T } = D.useContext(ii), b = typeof c == "string" && OS.test(c), x, v = false;
    if (typeof c == "string" && b && (x = c, RS)) try {
      let U = new URL(window.location.href), B = c.startsWith("//") ? new URL(U.protocol + c) : new URL(c), Y = Mi(B.pathname, T);
      B.origin === U.origin && Y != null ? c = Y + B.search + B.hash : v = true;
    } catch {
      Hn(false, `<Link to="${c}"> contains an invalid URL which will probably break when clicked - please update to a valid URL path.`);
    }
    let g = LM(c, {
      relative: a
    }), [S, A, w] = pC(i, m), V = AC(c, {
      replace: s,
      state: l,
      target: o,
      preventScrollReset: f,
      relative: a,
      viewTransition: d
    });
    function z(U) {
      e && e(U), U.defaultPrevented || V(U);
    }
    let O = D.createElement("a", {
      ...m,
      ...w,
      href: x || g,
      onClick: v || r ? e : z,
      ref: _C(y, A),
      target: o,
      "data-discover": !b && n === "render" ? "true" : void 0
    });
    return S && !b ? D.createElement(D.Fragment, null, O, D.createElement(yC, {
      page: g
    })) : O;
  });
  mp.displayName = "Link";
  var SC = D.forwardRef(function({ "aria-current": e = "page", caseSensitive: n = false, className: i = "", end: a = false, style: r, to: s, viewTransition: l, children: o, ...c }, f) {
    let d = _o(s, {
      relative: c.relative
    }), m = fr(), y = D.useContext(Pc), { navigator: T, basename: b } = D.useContext(ii), x = y != null && DC(d) && l === true, v = T.encodeLocation ? T.encodeLocation(d).pathname : d.pathname, g = m.pathname, S = y && y.navigation && y.navigation.location ? y.navigation.location.pathname : null;
    n || (g = g.toLowerCase(), S = S ? S.toLowerCase() : null, v = v.toLowerCase()), S && b && (S = Mi(S, b) || S);
    const A = v !== "/" && v.endsWith("/") ? v.length - 1 : v.length;
    let w = g === v || !a && g.startsWith(v) && g.charAt(A) === "/", V = S != null && (S === v || !a && S.startsWith(v) && S.charAt(v.length) === "/"), z = {
      isActive: w,
      isPending: V,
      isTransitioning: x
    }, O = w ? e : void 0, U;
    typeof i == "function" ? U = i(z) : U = [
      i,
      w ? "active" : null,
      V ? "pending" : null,
      x ? "transitioning" : null
    ].filter(Boolean).join(" ");
    let B = typeof r == "function" ? r(z) : r;
    return D.createElement(mp, {
      ...c,
      "aria-current": O,
      className: U,
      ref: f,
      style: B,
      to: s,
      viewTransition: l
    }, typeof o == "function" ? o(z) : o);
  });
  SC.displayName = "NavLink";
  var TC = D.forwardRef(({ discover: t = "render", fetcherKey: e, navigate: n, reloadDocument: i, replace: a, state: r, method: s = xu, action: l, onSubmit: o, relative: c, preventScrollReset: f, viewTransition: d, ...m }, y) => {
    let T = MC(), b = CC(l, {
      relative: c
    }), x = s.toLowerCase() === "get" ? "get" : "post", v = typeof l == "string" && OS.test(l), g = (S) => {
      if (o && o(S), S.defaultPrevented) return;
      S.preventDefault();
      let A = S.nativeEvent.submitter, w = (A == null ? void 0 : A.getAttribute("formmethod")) || s;
      T(A || S.currentTarget, {
        fetcherKey: e,
        method: w,
        navigate: n,
        replace: a,
        state: r,
        relative: c,
        preventScrollReset: f,
        viewTransition: d
      });
    };
    return D.createElement("form", {
      ref: y,
      method: x,
      action: b,
      onSubmit: i ? o : g,
      ...m,
      "data-discover": !v && t === "render" ? "true" : void 0
    });
  });
  TC.displayName = "Form";
  function xC(t) {
    return `${t} must be used within a data router.  See https://reactrouter.com/en/main/routers/picking-a-router.`;
  }
  function zS(t) {
    let e = D.useContext(ws);
    return Gt(e, xC(t)), e;
  }
  function AC(t, { target: e, replace: n, state: i, preventScrollReset: a, relative: r, viewTransition: s } = {}) {
    let l = ES(), o = fr(), c = _o(t, {
      relative: r
    });
    return D.useCallback((f) => {
      if (nC(f, e)) {
        f.preventDefault();
        let d = n !== void 0 ? n : kl(o) === kl(c);
        l(t, {
          replace: d,
          state: i,
          preventScrollReset: a,
          relative: r,
          viewTransition: s
        });
      }
    }, [
      o,
      l,
      c,
      n,
      i,
      e,
      t,
      a,
      r,
      s
    ]);
  }
  var EC = 0, wC = () => `__${String(++EC)}__`;
  function MC() {
    let { router: t } = zS("useSubmit"), { basename: e } = D.useContext(ii), n = qM();
    return D.useCallback(async (i, a = {}) => {
      let { action: r, method: s, encType: l, formData: o, body: c } = rC(i, e);
      if (a.navigate === false) {
        let f = a.fetcherKey || wC();
        await t.fetch(f, n, a.action || r, {
          preventScrollReset: a.preventScrollReset,
          formData: o,
          body: c,
          formMethod: a.method || s,
          formEncType: a.encType || l,
          flushSync: a.flushSync
        });
      } else await t.navigate(a.action || r, {
        preventScrollReset: a.preventScrollReset,
        formData: o,
        body: c,
        formMethod: a.method || s,
        formEncType: a.encType || l,
        replace: a.replace,
        state: a.state,
        fromRouteId: n,
        flushSync: a.flushSync,
        viewTransition: a.viewTransition
      });
    }, [
      t,
      e,
      n
    ]);
  }
  function CC(t, { relative: e } = {}) {
    let { basename: n } = D.useContext(ii), i = D.useContext(Ui);
    Gt(i, "useFormAction must be used inside a RouteContext");
    let [a] = i.matches.slice(-1), r = {
      ..._o(t || ".", {
        relative: e
      })
    }, s = fr();
    if (t == null) {
      r.search = s.search;
      let l = new URLSearchParams(r.search), o = l.getAll("index");
      if (o.some((f) => f === "")) {
        l.delete("index"), o.filter((d) => d).forEach((d) => l.append("index", d));
        let f = l.toString();
        r.search = f ? `?${f}` : "";
      }
    }
    return (!t || t === ".") && a.route.index && (r.search = r.search ? r.search.replace(/^\?/, "?index&") : "?index"), n !== "/" && (r.pathname = r.pathname === "/" ? n : Si([
      n,
      r.pathname
    ])), kl(r);
  }
  function DC(t, { relative: e } = {}) {
    let n = D.useContext(TS);
    Gt(n != null, "`useViewTransitionState` must be used within `react-router-dom`'s `RouterProvider`.  Did you accidentally import `RouterProvider` from `react-router`?");
    let { basename: i } = zS("useViewTransitionState"), a = _o(t, {
      relative: e
    });
    if (!n.isTransitioning) return false;
    let r = Mi(n.currentLocation.pathname, i) || n.currentLocation.pathname, s = Mi(n.nextLocation.pathname, i) || n.nextLocation.pathname;
    return oc(a.pathname, s) != null || oc(a.pathname, r) != null;
  }
  const US = D.createContext({});
  function RC(t) {
    const e = D.useRef(null);
    return e.current === null && (e.current = t()), e.current;
  }
  const pp = typeof window < "u", OC = pp ? D.useLayoutEffect : D.useEffect, yp = D.createContext(null);
  function gp(t, e) {
    t.indexOf(e) === -1 && t.push(e);
  }
  function vp(t, e) {
    const n = t.indexOf(e);
    n > -1 && t.splice(n, 1);
  }
  const Ci = (t, e, n) => n > e ? e : n < t ? t : n;
  let _p = () => {
  };
  const Di = {}, VS = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
  function LS(t) {
    return typeof t == "object" && t !== null;
  }
  const NS = (t) => /^0[^.\s]+$/u.test(t);
  function bp(t) {
    let e;
    return () => (e === void 0 && (e = t()), e);
  }
  const zn = (t) => t, zC = (t, e) => (n) => e(t(n)), bo = (...t) => t.reduce(zC), Xl = (t, e, n) => {
    const i = e - t;
    return i === 0 ? 1 : (n - t) / i;
  };
  class Sp {
    constructor() {
      this.subscriptions = [];
    }
    add(e) {
      return gp(this.subscriptions, e), () => vp(this.subscriptions, e);
    }
    notify(e, n, i) {
      const a = this.subscriptions.length;
      if (a) if (a === 1) this.subscriptions[0](e, n, i);
      else for (let r = 0; r < a; r++) {
        const s = this.subscriptions[r];
        s && s(e, n, i);
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  }
  const Wn = (t) => t * 1e3, wn = (t) => t / 1e3;
  function jS(t, e) {
    return e ? t * (1e3 / e) : 0;
  }
  const BS = (t, e, n) => (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t, UC = 1e-7, VC = 12;
  function LC(t, e, n, i, a) {
    let r, s, l = 0;
    do
      s = e + (n - e) / 2, r = BS(s, i, a) - t, r > 0 ? n = s : e = s;
    while (Math.abs(r) > UC && ++l < VC);
    return s;
  }
  function So(t, e, n, i) {
    if (t === e && n === i) return zn;
    const a = (r) => LC(r, 0, 1, t, n);
    return (r) => r === 0 || r === 1 ? r : BS(a(r), e, i);
  }
  const HS = (t) => (e) => e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2, YS = (t) => (e) => 1 - t(1 - e), GS = So(0.33, 1.53, 0.69, 0.99), Tp = YS(GS), PS = HS(Tp), kS = (t) => (t *= 2) < 1 ? 0.5 * Tp(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))), xp = (t) => 1 - Math.sin(Math.acos(t)), XS = YS(xp), FS = HS(xp), NC = So(0.42, 0, 1, 1), jC = So(0, 0, 0.58, 1), qS = So(0.42, 0, 0.58, 1), BC = (t) => Array.isArray(t) && typeof t[0] != "number", KS = (t) => Array.isArray(t) && typeof t[0] == "number", HC = {
    linear: zn,
    easeIn: NC,
    easeInOut: qS,
    easeOut: jC,
    circIn: xp,
    circInOut: FS,
    circOut: XS,
    backIn: Tp,
    backInOut: PS,
    backOut: GS,
    anticipate: kS
  }, YC = (t) => typeof t == "string", zg = (t) => {
    if (KS(t)) {
      _p(t.length === 4);
      const [e, n, i, a] = t;
      return So(e, n, i, a);
    } else if (YC(t)) return HC[t];
    return t;
  }, eu = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender"
  ];
  function GC(t, e) {
    let n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), a = false, r = false;
    const s = /* @__PURE__ */ new WeakSet();
    let l = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    function o(f) {
      s.has(f) && (c.schedule(f), t()), f(l);
    }
    const c = {
      schedule: (f, d = false, m = false) => {
        const T = m && a ? n : i;
        return d && s.add(f), T.has(f) || T.add(f), f;
      },
      cancel: (f) => {
        i.delete(f), s.delete(f);
      },
      process: (f) => {
        if (l = f, a) {
          r = true;
          return;
        }
        a = true, [n, i] = [
          i,
          n
        ], n.forEach(o), n.clear(), a = false, r && (r = false, c.process(f));
      }
    };
    return c;
  }
  const PC = 40;
  function QS(t, e) {
    let n = false, i = true;
    const a = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    }, r = () => n = true, s = eu.reduce((S, A) => (S[A] = GC(r), S), {}), { setup: l, read: o, resolveKeyframes: c, preUpdate: f, update: d, preRender: m, render: y, postRender: T } = s, b = () => {
      const S = Di.useManualTiming ? a.timestamp : performance.now();
      n = false, Di.useManualTiming || (a.delta = i ? 1e3 / 60 : Math.max(Math.min(S - a.timestamp, PC), 1)), a.timestamp = S, a.isProcessing = true, l.process(a), o.process(a), c.process(a), f.process(a), d.process(a), m.process(a), y.process(a), T.process(a), a.isProcessing = false, n && e && (i = false, t(b));
    }, x = () => {
      n = true, i = true, a.isProcessing || t(b);
    };
    return {
      schedule: eu.reduce((S, A) => {
        const w = s[A];
        return S[A] = (V, z = false, O = false) => (n || x(), w.schedule(V, z, O)), S;
      }, {}),
      cancel: (S) => {
        for (let A = 0; A < eu.length; A++) s[eu[A]].cancel(S);
      },
      state: a,
      steps: s
    };
  }
  const { schedule: Lt, cancel: ma, state: ve, steps: ah } = QS(typeof requestAnimationFrame < "u" ? requestAnimationFrame : zn, true);
  let Eu;
  function kC() {
    Eu = void 0;
  }
  const Pe = {
    now: () => (Eu === void 0 && Pe.set(ve.isProcessing || Di.useManualTiming ? ve.timestamp : performance.now()), Eu),
    set: (t) => {
      Eu = t, queueMicrotask(kC);
    }
  }, ZS = (t) => (e) => typeof e == "string" && e.startsWith(t), Ap = ZS("--"), XC = ZS("var(--"), Ep = (t) => XC(t) ? FC.test(t.split("/*")[0].trim()) : false, FC = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu, Ms = {
    test: (t) => typeof t == "number",
    parse: parseFloat,
    transform: (t) => t
  }, Fl = {
    ...Ms,
    transform: (t) => Ci(0, 1, t)
  }, nu = {
    ...Ms,
    default: 1
  }, vl = (t) => Math.round(t * 1e5) / 1e5, wp = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  function qC(t) {
    return t == null;
  }
  const KC = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu, Mp = (t, e) => (n) => !!(typeof n == "string" && KC.test(n) && n.startsWith(t) || e && !qC(n) && Object.prototype.hasOwnProperty.call(n, e)), JS = (t, e, n) => (i) => {
    if (typeof i != "string") return i;
    const [a, r, s, l] = i.match(wp);
    return {
      [t]: parseFloat(a),
      [e]: parseFloat(r),
      [n]: parseFloat(s),
      alpha: l !== void 0 ? parseFloat(l) : 1
    };
  }, QC = (t) => Ci(0, 255, t), rh = {
    ...Ms,
    transform: (t) => Math.round(QC(t))
  }, Ba = {
    test: Mp("rgb", "red"),
    parse: JS("red", "green", "blue"),
    transform: ({ red: t, green: e, blue: n, alpha: i = 1 }) => "rgba(" + rh.transform(t) + ", " + rh.transform(e) + ", " + rh.transform(n) + ", " + vl(Fl.transform(i)) + ")"
  };
  function ZC(t) {
    let e = "", n = "", i = "", a = "";
    return t.length > 5 ? (e = t.substring(1, 3), n = t.substring(3, 5), i = t.substring(5, 7), a = t.substring(7, 9)) : (e = t.substring(1, 2), n = t.substring(2, 3), i = t.substring(3, 4), a = t.substring(4, 5), e += e, n += n, i += i, a += a), {
      red: parseInt(e, 16),
      green: parseInt(n, 16),
      blue: parseInt(i, 16),
      alpha: a ? parseInt(a, 16) / 255 : 1
    };
  }
  const wd = {
    test: Mp("#"),
    parse: ZC,
    transform: Ba.transform
  }, To = (t) => ({
    test: (e) => typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
    parse: parseFloat,
    transform: (e) => `${e}${t}`
  }), ji = To("deg"), In = To("%"), tt = To("px"), JC = To("vh"), $C = To("vw"), Ug = {
    ...In,
    parse: (t) => In.parse(t) / 100,
    transform: (t) => In.transform(t * 100)
  }, Vr = {
    test: Mp("hsl", "hue"),
    parse: JS("hue", "saturation", "lightness"),
    transform: ({ hue: t, saturation: e, lightness: n, alpha: i = 1 }) => "hsla(" + Math.round(t) + ", " + In.transform(vl(e)) + ", " + In.transform(vl(n)) + ", " + vl(Fl.transform(i)) + ")"
  }, ne = {
    test: (t) => Ba.test(t) || wd.test(t) || Vr.test(t),
    parse: (t) => Ba.test(t) ? Ba.parse(t) : Vr.test(t) ? Vr.parse(t) : wd.parse(t),
    transform: (t) => typeof t == "string" ? t : t.hasOwnProperty("red") ? Ba.transform(t) : Vr.transform(t),
    getAnimatableNone: (t) => {
      const e = ne.parse(t);
      return e.alpha = 0, ne.transform(e);
    }
  }, WC = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  function IC(t) {
    var _a2, _b2;
    return isNaN(t) && typeof t == "string" && (((_a2 = t.match(wp)) == null ? void 0 : _a2.length) || 0) + (((_b2 = t.match(WC)) == null ? void 0 : _b2.length) || 0) > 0;
  }
  const $S = "number", WS = "color", tD = "var", eD = "var(", Vg = "${}", nD = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function ql(t) {
    const e = t.toString(), n = [], i = {
      color: [],
      number: [],
      var: []
    }, a = [];
    let r = 0;
    const l = e.replace(nD, (o) => (ne.test(o) ? (i.color.push(r), a.push(WS), n.push(ne.parse(o))) : o.startsWith(eD) ? (i.var.push(r), a.push(tD), n.push(o)) : (i.number.push(r), a.push($S), n.push(parseFloat(o))), ++r, Vg)).split(Vg);
    return {
      values: n,
      split: l,
      indexes: i,
      types: a
    };
  }
  function IS(t) {
    return ql(t).values;
  }
  function tT(t) {
    const { split: e, types: n } = ql(t), i = e.length;
    return (a) => {
      let r = "";
      for (let s = 0; s < i; s++) if (r += e[s], a[s] !== void 0) {
        const l = n[s];
        l === $S ? r += vl(a[s]) : l === WS ? r += ne.transform(a[s]) : r += a[s];
      }
      return r;
    };
  }
  const iD = (t) => typeof t == "number" ? 0 : ne.test(t) ? ne.getAnimatableNone(t) : t;
  function aD(t) {
    const e = IS(t);
    return tT(t)(e.map(iD));
  }
  const pa = {
    test: IC,
    parse: IS,
    createTransformer: tT,
    getAnimatableNone: aD
  };
  function sh(t, e, n) {
    return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + (e - t) * 6 * n : n < 1 / 2 ? e : n < 2 / 3 ? t + (e - t) * (2 / 3 - n) * 6 : t;
  }
  function rD({ hue: t, saturation: e, lightness: n, alpha: i }) {
    t /= 360, e /= 100, n /= 100;
    let a = 0, r = 0, s = 0;
    if (!e) a = r = s = n;
    else {
      const l = n < 0.5 ? n * (1 + e) : n + e - n * e, o = 2 * n - l;
      a = sh(o, l, t + 1 / 3), r = sh(o, l, t), s = sh(o, l, t - 1 / 3);
    }
    return {
      red: Math.round(a * 255),
      green: Math.round(r * 255),
      blue: Math.round(s * 255),
      alpha: i
    };
  }
  function uc(t, e) {
    return (n) => n > 0 ? e : t;
  }
  const Ht = (t, e, n) => t + (e - t) * n, lh = (t, e, n) => {
    const i = t * t, a = n * (e * e - i) + i;
    return a < 0 ? 0 : Math.sqrt(a);
  }, sD = [
    wd,
    Ba,
    Vr
  ], lD = (t) => sD.find((e) => e.test(t));
  function Lg(t) {
    const e = lD(t);
    if (!e) return false;
    let n = e.parse(t);
    return e === Vr && (n = rD(n)), n;
  }
  const Ng = (t, e) => {
    const n = Lg(t), i = Lg(e);
    if (!n || !i) return uc(t, e);
    const a = {
      ...n
    };
    return (r) => (a.red = lh(n.red, i.red, r), a.green = lh(n.green, i.green, r), a.blue = lh(n.blue, i.blue, r), a.alpha = Ht(n.alpha, i.alpha, r), Ba.transform(a));
  }, Md = /* @__PURE__ */ new Set([
    "none",
    "hidden"
  ]);
  function oD(t, e) {
    return Md.has(t) ? (n) => n <= 0 ? t : e : (n) => n >= 1 ? e : t;
  }
  function uD(t, e) {
    return (n) => Ht(t, e, n);
  }
  function Cp(t) {
    return typeof t == "number" ? uD : typeof t == "string" ? Ep(t) ? uc : ne.test(t) ? Ng : hD : Array.isArray(t) ? eT : typeof t == "object" ? ne.test(t) ? Ng : cD : uc;
  }
  function eT(t, e) {
    const n = [
      ...t
    ], i = n.length, a = t.map((r, s) => Cp(r)(r, e[s]));
    return (r) => {
      for (let s = 0; s < i; s++) n[s] = a[s](r);
      return n;
    };
  }
  function cD(t, e) {
    const n = {
      ...t,
      ...e
    }, i = {};
    for (const a in n) t[a] !== void 0 && e[a] !== void 0 && (i[a] = Cp(t[a])(t[a], e[a]));
    return (a) => {
      for (const r in i) n[r] = i[r](a);
      return n;
    };
  }
  function fD(t, e) {
    const n = [], i = {
      color: 0,
      var: 0,
      number: 0
    };
    for (let a = 0; a < e.values.length; a++) {
      const r = e.types[a], s = t.indexes[r][i[r]], l = t.values[s] ?? 0;
      n[a] = l, i[r]++;
    }
    return n;
  }
  const hD = (t, e) => {
    const n = pa.createTransformer(e), i = ql(t), a = ql(e);
    return i.indexes.var.length === a.indexes.var.length && i.indexes.color.length === a.indexes.color.length && i.indexes.number.length >= a.indexes.number.length ? Md.has(t) && !a.values.length || Md.has(e) && !i.values.length ? oD(t, e) : bo(eT(fD(i, a), a.values), n) : uc(t, e);
  };
  function nT(t, e, n) {
    return typeof t == "number" && typeof e == "number" && typeof n == "number" ? Ht(t, e, n) : Cp(t)(t, e);
  }
  const dD = (t) => {
    const e = ({ timestamp: n }) => t(n);
    return {
      start: (n = true) => Lt.update(e, n),
      stop: () => ma(e),
      now: () => ve.isProcessing ? ve.timestamp : Pe.now()
    };
  }, iT = (t, e, n = 10) => {
    let i = "";
    const a = Math.max(Math.round(e / n), 2);
    for (let r = 0; r < a; r++) i += Math.round(t(r / (a - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${i.substring(0, i.length - 2)})`;
  }, cc = 2e4;
  function Dp(t) {
    let e = 0;
    const n = 50;
    let i = t.next(e);
    for (; !i.done && e < cc; ) e += n, i = t.next(e);
    return e >= cc ? 1 / 0 : e;
  }
  function mD(t, e = 100, n) {
    const i = n({
      ...t,
      keyframes: [
        0,
        e
      ]
    }), a = Math.min(Dp(i), cc);
    return {
      type: "keyframes",
      ease: (r) => i.next(a * r).value / e,
      duration: wn(a)
    };
  }
  const pD = 5;
  function aT(t, e, n) {
    const i = Math.max(e - pD, 0);
    return jS(n - t(i), e - i);
  }
  const Xt = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1
  }, oh = 1e-3;
  function yD({ duration: t = Xt.duration, bounce: e = Xt.bounce, velocity: n = Xt.velocity, mass: i = Xt.mass }) {
    let a, r, s = 1 - e;
    s = Ci(Xt.minDamping, Xt.maxDamping, s), t = Ci(Xt.minDuration, Xt.maxDuration, wn(t)), s < 1 ? (a = (c) => {
      const f = c * s, d = f * t, m = f - n, y = Cd(c, s), T = Math.exp(-d);
      return oh - m / y * T;
    }, r = (c) => {
      const d = c * s * t, m = d * n + n, y = Math.pow(s, 2) * Math.pow(c, 2) * t, T = Math.exp(-d), b = Cd(Math.pow(c, 2), s);
      return (-a(c) + oh > 0 ? -1 : 1) * ((m - y) * T) / b;
    }) : (a = (c) => {
      const f = Math.exp(-c * t), d = (c - n) * t + 1;
      return -oh + f * d;
    }, r = (c) => {
      const f = Math.exp(-c * t), d = (n - c) * (t * t);
      return f * d;
    });
    const l = 5 / t, o = vD(a, r, l);
    if (t = Wn(t), isNaN(o)) return {
      stiffness: Xt.stiffness,
      damping: Xt.damping,
      duration: t
    };
    {
      const c = Math.pow(o, 2) * i;
      return {
        stiffness: c,
        damping: s * 2 * Math.sqrt(i * c),
        duration: t
      };
    }
  }
  const gD = 12;
  function vD(t, e, n) {
    let i = n;
    for (let a = 1; a < gD; a++) i = i - t(i) / e(i);
    return i;
  }
  function Cd(t, e) {
    return t * Math.sqrt(1 - e * e);
  }
  const _D = [
    "duration",
    "bounce"
  ], bD = [
    "stiffness",
    "damping",
    "mass"
  ];
  function jg(t, e) {
    return e.some((n) => t[n] !== void 0);
  }
  function SD(t) {
    let e = {
      velocity: Xt.velocity,
      stiffness: Xt.stiffness,
      damping: Xt.damping,
      mass: Xt.mass,
      isResolvedFromDuration: false,
      ...t
    };
    if (!jg(t, bD) && jg(t, _D)) if (t.visualDuration) {
      const n = t.visualDuration, i = 2 * Math.PI / (n * 1.2), a = i * i, r = 2 * Ci(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(a);
      e = {
        ...e,
        mass: Xt.mass,
        stiffness: a,
        damping: r
      };
    } else {
      const n = yD(t);
      e = {
        ...e,
        ...n,
        mass: Xt.mass
      }, e.isResolvedFromDuration = true;
    }
    return e;
  }
  function fc(t = Xt.visualDuration, e = Xt.bounce) {
    const n = typeof t != "object" ? {
      visualDuration: t,
      keyframes: [
        0,
        1
      ],
      bounce: e
    } : t;
    let { restSpeed: i, restDelta: a } = n;
    const r = n.keyframes[0], s = n.keyframes[n.keyframes.length - 1], l = {
      done: false,
      value: r
    }, { stiffness: o, damping: c, mass: f, duration: d, velocity: m, isResolvedFromDuration: y } = SD({
      ...n,
      velocity: -wn(n.velocity || 0)
    }), T = m || 0, b = c / (2 * Math.sqrt(o * f)), x = s - r, v = wn(Math.sqrt(o / f)), g = Math.abs(x) < 5;
    i || (i = g ? Xt.restSpeed.granular : Xt.restSpeed.default), a || (a = g ? Xt.restDelta.granular : Xt.restDelta.default);
    let S;
    if (b < 1) {
      const w = Cd(v, b);
      S = (V) => {
        const z = Math.exp(-b * v * V);
        return s - z * ((T + b * v * x) / w * Math.sin(w * V) + x * Math.cos(w * V));
      };
    } else if (b === 1) S = (w) => s - Math.exp(-v * w) * (x + (T + v * x) * w);
    else {
      const w = v * Math.sqrt(b * b - 1);
      S = (V) => {
        const z = Math.exp(-b * v * V), O = Math.min(w * V, 300);
        return s - z * ((T + b * v * x) * Math.sinh(O) + w * x * Math.cosh(O)) / w;
      };
    }
    const A = {
      calculatedDuration: y && d || null,
      next: (w) => {
        const V = S(w);
        if (y) l.done = w >= d;
        else {
          let z = w === 0 ? T : 0;
          b < 1 && (z = w === 0 ? Wn(T) : aT(S, w, V));
          const O = Math.abs(z) <= i, U = Math.abs(s - V) <= a;
          l.done = O && U;
        }
        return l.value = l.done ? s : V, l;
      },
      toString: () => {
        const w = Math.min(Dp(A), cc), V = iT((z) => A.next(w * z).value, w, 30);
        return w + "ms " + V;
      },
      toTransition: () => {
      }
    };
    return A;
  }
  fc.applyToOptions = (t) => {
    const e = mD(t, 100, fc);
    return t.ease = e.ease, t.duration = Wn(e.duration), t.type = "keyframes", t;
  };
  function Dd({ keyframes: t, velocity: e = 0, power: n = 0.8, timeConstant: i = 325, bounceDamping: a = 10, bounceStiffness: r = 500, modifyTarget: s, min: l, max: o, restDelta: c = 0.5, restSpeed: f }) {
    const d = t[0], m = {
      done: false,
      value: d
    }, y = (O) => l !== void 0 && O < l || o !== void 0 && O > o, T = (O) => l === void 0 ? o : o === void 0 || Math.abs(l - O) < Math.abs(o - O) ? l : o;
    let b = n * e;
    const x = d + b, v = s === void 0 ? x : s(x);
    v !== x && (b = v - d);
    const g = (O) => -b * Math.exp(-O / i), S = (O) => v + g(O), A = (O) => {
      const U = g(O), B = S(O);
      m.done = Math.abs(U) <= c, m.value = m.done ? v : B;
    };
    let w, V;
    const z = (O) => {
      y(m.value) && (w = O, V = fc({
        keyframes: [
          m.value,
          T(m.value)
        ],
        velocity: aT(S, O, m.value),
        damping: a,
        stiffness: r,
        restDelta: c,
        restSpeed: f
      }));
    };
    return z(0), {
      calculatedDuration: null,
      next: (O) => {
        let U = false;
        return !V && w === void 0 && (U = true, A(O), z(O)), w !== void 0 && O >= w ? V.next(O - w) : (!U && A(O), m);
      }
    };
  }
  function TD(t, e, n) {
    const i = [], a = n || Di.mix || nT, r = t.length - 1;
    for (let s = 0; s < r; s++) {
      let l = a(t[s], t[s + 1]);
      if (e) {
        const o = Array.isArray(e) ? e[s] || zn : e;
        l = bo(o, l);
      }
      i.push(l);
    }
    return i;
  }
  function xD(t, e, { clamp: n = true, ease: i, mixer: a } = {}) {
    const r = t.length;
    if (_p(r === e.length), r === 1) return () => e[0];
    if (r === 2 && e[0] === e[1]) return () => e[1];
    const s = t[0] === t[1];
    t[0] > t[r - 1] && (t = [
      ...t
    ].reverse(), e = [
      ...e
    ].reverse());
    const l = TD(e, i, a), o = l.length, c = (f) => {
      if (s && f < t[0]) return e[0];
      let d = 0;
      if (o > 1) for (; d < t.length - 2 && !(f < t[d + 1]); d++) ;
      const m = Xl(t[d], t[d + 1], f);
      return l[d](m);
    };
    return n ? (f) => c(Ci(t[0], t[r - 1], f)) : c;
  }
  function AD(t, e) {
    const n = t[t.length - 1];
    for (let i = 1; i <= e; i++) {
      const a = Xl(0, e, i);
      t.push(Ht(n, 1, a));
    }
  }
  function ED(t) {
    const e = [
      0
    ];
    return AD(e, t.length - 1), e;
  }
  function wD(t, e) {
    return t.map((n) => n * e);
  }
  function MD(t, e) {
    return t.map(() => e || qS).splice(0, t.length - 1);
  }
  function _l({ duration: t = 300, keyframes: e, times: n, ease: i = "easeInOut" }) {
    const a = BC(i) ? i.map(zg) : zg(i), r = {
      done: false,
      value: e[0]
    }, s = wD(n && n.length === e.length ? n : ED(e), t), l = xD(s, e, {
      ease: Array.isArray(a) ? a : MD(e, a)
    });
    return {
      calculatedDuration: t,
      next: (o) => (r.value = l(o), r.done = o >= t, r)
    };
  }
  const CD = (t) => t !== null;
  function Rp(t, { repeat: e, repeatType: n = "loop" }, i, a = 1) {
    const r = t.filter(CD), l = a < 0 || e && n !== "loop" && e % 2 === 1 ? 0 : r.length - 1;
    return !l || i === void 0 ? r[l] : i;
  }
  const DD = {
    decay: Dd,
    inertia: Dd,
    tween: _l,
    keyframes: _l,
    spring: fc
  };
  function rT(t) {
    typeof t.type == "string" && (t.type = DD[t.type]);
  }
  class Op {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((e) => {
        this.resolve = e;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    then(e, n) {
      return this.finished.then(e, n);
    }
  }
  const RD = (t) => t / 100;
  class zp extends Op {
    constructor(e) {
      super(), this.state = "idle", this.startTime = null, this.isStopped = false, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.stop = () => {
        var _a2, _b2;
        const { motionValue: n } = this.options;
        n && n.updatedAt !== Pe.now() && this.tick(Pe.now()), this.isStopped = true, this.state !== "idle" && (this.teardown(), (_b2 = (_a2 = this.options).onStop) == null ? void 0 : _b2.call(_a2));
      }, this.options = e, this.initAnimation(), this.play(), e.autoplay === false && this.pause();
    }
    initAnimation() {
      const { options: e } = this;
      rT(e);
      const { type: n = _l, repeat: i = 0, repeatDelay: a = 0, repeatType: r, velocity: s = 0 } = e;
      let { keyframes: l } = e;
      const o = n || _l;
      o !== _l && typeof l[0] != "number" && (this.mixKeyframes = bo(RD, nT(l[0], l[1])), l = [
        0,
        100
      ]);
      const c = o({
        ...e,
        keyframes: l
      });
      r === "mirror" && (this.mirroredGenerator = o({
        ...e,
        keyframes: [
          ...l
        ].reverse(),
        velocity: -s
      })), c.calculatedDuration === null && (c.calculatedDuration = Dp(c));
      const { calculatedDuration: f } = c;
      this.calculatedDuration = f, this.resolvedDuration = f + a, this.totalDuration = this.resolvedDuration * (i + 1) - a, this.generator = c;
    }
    updateTime(e) {
      const n = Math.round(e - this.startTime) * this.playbackSpeed;
      this.holdTime !== null ? this.currentTime = this.holdTime : this.currentTime = n;
    }
    tick(e, n = false) {
      const { generator: i, totalDuration: a, mixKeyframes: r, mirroredGenerator: s, resolvedDuration: l, calculatedDuration: o } = this;
      if (this.startTime === null) return i.next(0);
      const { delay: c = 0, keyframes: f, repeat: d, repeatType: m, repeatDelay: y, type: T, onUpdate: b, finalKeyframe: x } = this.options;
      this.speed > 0 ? this.startTime = Math.min(this.startTime, e) : this.speed < 0 && (this.startTime = Math.min(e - a / this.speed, this.startTime)), n ? this.currentTime = e : this.updateTime(e);
      const v = this.currentTime - c * (this.playbackSpeed >= 0 ? 1 : -1), g = this.playbackSpeed >= 0 ? v < 0 : v > a;
      this.currentTime = Math.max(v, 0), this.state === "finished" && this.holdTime === null && (this.currentTime = a);
      let S = this.currentTime, A = i;
      if (d) {
        const O = Math.min(this.currentTime, a) / l;
        let U = Math.floor(O), B = O % 1;
        !B && O >= 1 && (B = 1), B === 1 && U--, U = Math.min(U, d + 1), !!(U % 2) && (m === "reverse" ? (B = 1 - B, y && (B -= y / l)) : m === "mirror" && (A = s)), S = Ci(0, 1, B) * l;
      }
      const w = g ? {
        done: false,
        value: f[0]
      } : A.next(S);
      r && (w.value = r(w.value));
      let { done: V } = w;
      !g && o !== null && (V = this.playbackSpeed >= 0 ? this.currentTime >= a : this.currentTime <= 0);
      const z = this.holdTime === null && (this.state === "finished" || this.state === "running" && V);
      return z && T !== Dd && (w.value = Rp(f, this.options, x, this.speed)), b && b(w.value), z && this.finish(), w;
    }
    then(e, n) {
      return this.finished.then(e, n);
    }
    get duration() {
      return wn(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: e = 0 } = this.options || {};
      return this.duration + wn(e);
    }
    get time() {
      return wn(this.currentTime);
    }
    set time(e) {
      var _a2;
      e = Wn(e), this.currentTime = e, this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0 ? this.holdTime = e : this.driver && (this.startTime = this.driver.now() - e / this.playbackSpeed), (_a2 = this.driver) == null ? void 0 : _a2.start(false);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(e) {
      this.updateTime(Pe.now());
      const n = this.playbackSpeed !== e;
      this.playbackSpeed = e, n && (this.time = wn(this.currentTime));
    }
    play() {
      var _a2, _b2;
      if (this.isStopped) return;
      const { driver: e = dD, startTime: n } = this.options;
      this.driver || (this.driver = e((a) => this.tick(a))), (_b2 = (_a2 = this.options).onPlay) == null ? void 0 : _b2.call(_a2);
      const i = this.driver.now();
      this.state === "finished" ? (this.updateFinished(), this.startTime = i) : this.holdTime !== null ? this.startTime = i - this.holdTime : this.startTime || (this.startTime = n ?? i), this.state === "finished" && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start();
    }
    pause() {
      this.state = "paused", this.updateTime(Pe.now()), this.holdTime = this.currentTime;
    }
    complete() {
      this.state !== "running" && this.play(), this.state = "finished", this.holdTime = null;
    }
    finish() {
      var _a2, _b2;
      this.notifyFinished(), this.teardown(), this.state = "finished", (_b2 = (_a2 = this.options).onComplete) == null ? void 0 : _b2.call(_a2);
    }
    cancel() {
      var _a2, _b2;
      this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), (_b2 = (_a2 = this.options).onCancel) == null ? void 0 : _b2.call(_a2);
    }
    teardown() {
      this.state = "idle", this.stopDriver(), this.startTime = this.holdTime = null;
    }
    stopDriver() {
      this.driver && (this.driver.stop(), this.driver = void 0);
    }
    sample(e) {
      return this.startTime = 0, this.tick(e, true);
    }
    attachTimeline(e) {
      var _a2;
      return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), (_a2 = this.driver) == null ? void 0 : _a2.stop(), e.observe(this);
    }
  }
  function OD(t) {
    for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
  }
  const Ha = (t) => t * 180 / Math.PI, Rd = (t) => {
    const e = Ha(Math.atan2(t[1], t[0]));
    return Od(e);
  }, zD = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: Rd,
    rotateZ: Rd,
    skewX: (t) => Ha(Math.atan(t[1])),
    skewY: (t) => Ha(Math.atan(t[2])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2
  }, Od = (t) => (t = t % 360, t < 0 && (t += 360), t), Bg = Rd, Hg = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]), Yg = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]), UD = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: Hg,
    scaleY: Yg,
    scale: (t) => (Hg(t) + Yg(t)) / 2,
    rotateX: (t) => Od(Ha(Math.atan2(t[6], t[5]))),
    rotateY: (t) => Od(Ha(Math.atan2(-t[2], t[0]))),
    rotateZ: Bg,
    rotate: Bg,
    skewX: (t) => Ha(Math.atan(t[4])),
    skewY: (t) => Ha(Math.atan(t[1])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2
  };
  function zd(t) {
    return t.includes("scale") ? 1 : 0;
  }
  function Ud(t, e) {
    if (!t || t === "none") return zd(e);
    const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let i, a;
    if (n) i = UD, a = n;
    else {
      const l = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      i = zD, a = l;
    }
    if (!a) return zd(e);
    const r = i[e], s = a[1].split(",").map(LD);
    return typeof r == "function" ? r(s) : s[r];
  }
  const VD = (t, e) => {
    const { transform: n = "none" } = getComputedStyle(t);
    return Ud(n, e);
  };
  function LD(t) {
    return parseFloat(t.trim());
  }
  const Cs = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ], Ds = new Set(Cs), Gg = (t) => t === Ms || t === tt, ND = /* @__PURE__ */ new Set([
    "x",
    "y",
    "z"
  ]), jD = Cs.filter((t) => !ND.has(t));
  function BD(t) {
    const e = [];
    return jD.forEach((n) => {
      const i = t.getValue(n);
      i !== void 0 && (e.push([
        n,
        i.get()
      ]), i.set(n.startsWith("scale") ? 1 : 0));
    }), e;
  }
  const qa = {
    width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) => t.max - t.min - parseFloat(e) - parseFloat(n),
    top: (t, { top: e }) => parseFloat(e),
    left: (t, { left: e }) => parseFloat(e),
    bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
    right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
    x: (t, { transform: e }) => Ud(e, "x"),
    y: (t, { transform: e }) => Ud(e, "y")
  };
  qa.translateX = qa.x;
  qa.translateY = qa.y;
  const Ka = /* @__PURE__ */ new Set();
  let Vd = false, Ld = false, Nd = false;
  function sT() {
    if (Ld) {
      const t = Array.from(Ka).filter((i) => i.needsMeasurement), e = new Set(t.map((i) => i.element)), n = /* @__PURE__ */ new Map();
      e.forEach((i) => {
        const a = BD(i);
        a.length && (n.set(i, a), i.render());
      }), t.forEach((i) => i.measureInitialState()), e.forEach((i) => {
        i.render();
        const a = n.get(i);
        a && a.forEach(([r, s]) => {
          var _a2;
          (_a2 = i.getValue(r)) == null ? void 0 : _a2.set(s);
        });
      }), t.forEach((i) => i.measureEndState()), t.forEach((i) => {
        i.suspendedScrollY !== void 0 && window.scrollTo(0, i.suspendedScrollY);
      });
    }
    Ld = false, Vd = false, Ka.forEach((t) => t.complete(Nd)), Ka.clear();
  }
  function lT() {
    Ka.forEach((t) => {
      t.readKeyframes(), t.needsMeasurement && (Ld = true);
    });
  }
  function HD() {
    Nd = true, lT(), sT(), Nd = false;
  }
  class Up {
    constructor(e, n, i, a, r, s = false) {
      this.state = "pending", this.isAsync = false, this.needsMeasurement = false, this.unresolvedKeyframes = [
        ...e
      ], this.onComplete = n, this.name = i, this.motionValue = a, this.element = r, this.isAsync = s;
    }
    scheduleResolve() {
      this.state = "scheduled", this.isAsync ? (Ka.add(this), Vd || (Vd = true, Lt.read(lT), Lt.resolveKeyframes(sT))) : (this.readKeyframes(), this.complete());
    }
    readKeyframes() {
      const { unresolvedKeyframes: e, name: n, element: i, motionValue: a } = this;
      if (e[0] === null) {
        const r = a == null ? void 0 : a.get(), s = e[e.length - 1];
        if (r !== void 0) e[0] = r;
        else if (i && n) {
          const l = i.readValue(n, s);
          l != null && (e[0] = l);
        }
        e[0] === void 0 && (e[0] = s), a && r === void 0 && a.set(e[0]);
      }
      OD(e);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(e = false) {
      this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, e), Ka.delete(this);
    }
    cancel() {
      this.state === "scheduled" && (Ka.delete(this), this.state = "pending");
    }
    resume() {
      this.state === "pending" && this.scheduleResolve();
    }
  }
  const YD = (t) => t.startsWith("--");
  function GD(t, e, n) {
    YD(e) ? t.style.setProperty(e, n) : t.style[e] = n;
  }
  const PD = bp(() => window.ScrollTimeline !== void 0), kD = {};
  function XD(t, e) {
    const n = bp(t);
    return () => kD[e] ?? n();
  }
  const oT = XD(() => {
    try {
      document.createElement("div").animate({
        opacity: 0
      }, {
        easing: "linear(0, 1)"
      });
    } catch {
      return false;
    }
    return true;
  }, "linearEasing"), el = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`, Pg = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: el([
      0,
      0.65,
      0.55,
      1
    ]),
    circOut: el([
      0.55,
      0,
      1,
      0.45
    ]),
    backIn: el([
      0.31,
      0.01,
      0.66,
      -0.59
    ]),
    backOut: el([
      0.33,
      1.53,
      0.69,
      0.99
    ])
  };
  function uT(t, e) {
    if (t) return typeof t == "function" ? oT() ? iT(t, e) : "ease-out" : KS(t) ? el(t) : Array.isArray(t) ? t.map((n) => uT(n, e) || Pg.easeOut) : Pg[t];
  }
  function FD(t, e, n, { delay: i = 0, duration: a = 300, repeat: r = 0, repeatType: s = "loop", ease: l = "easeOut", times: o } = {}, c = void 0) {
    const f = {
      [e]: n
    };
    o && (f.offset = o);
    const d = uT(l, a);
    Array.isArray(d) && (f.easing = d);
    const m = {
      delay: i,
      duration: a,
      easing: Array.isArray(d) ? "linear" : d,
      fill: "both",
      iterations: r + 1,
      direction: s === "reverse" ? "alternate" : "normal"
    };
    return c && (m.pseudoElement = c), t.animate(f, m);
  }
  function cT(t) {
    return typeof t == "function" && "applyToOptions" in t;
  }
  function qD({ type: t, ...e }) {
    return cT(t) && oT() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
  }
  class KD extends Op {
    constructor(e) {
      if (super(), this.finishedTime = null, this.isStopped = false, !e) return;
      const { element: n, name: i, keyframes: a, pseudoElement: r, allowFlatten: s = false, finalKeyframe: l, onComplete: o } = e;
      this.isPseudoElement = !!r, this.allowFlatten = s, this.options = e, _p(typeof e.type != "string");
      const c = qD(e);
      this.animation = FD(n, i, a, c, r), c.autoplay === false && this.animation.pause(), this.animation.onfinish = () => {
        if (this.finishedTime = this.time, !r) {
          const f = Rp(a, this.options, l, this.speed);
          this.updateMotionValue ? this.updateMotionValue(f) : GD(n, i, f), this.animation.cancel();
        }
        o == null ? void 0 : o(), this.notifyFinished();
      };
    }
    play() {
      this.isStopped || (this.animation.play(), this.state === "finished" && this.updateFinished());
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      var _a2, _b2;
      (_b2 = (_a2 = this.animation).finish) == null ? void 0 : _b2.call(_a2);
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch {
      }
    }
    stop() {
      if (this.isStopped) return;
      this.isStopped = true;
      const { state: e } = this;
      e === "idle" || e === "finished" || (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel());
    }
    commitStyles() {
      var _a2, _b2;
      this.isPseudoElement || ((_b2 = (_a2 = this.animation).commitStyles) == null ? void 0 : _b2.call(_a2));
    }
    get duration() {
      var _a2, _b2;
      const e = ((_b2 = (_a2 = this.animation.effect) == null ? void 0 : _a2.getComputedTiming) == null ? void 0 : _b2.call(_a2).duration) || 0;
      return wn(Number(e));
    }
    get iterationDuration() {
      const { delay: e = 0 } = this.options || {};
      return this.duration + wn(e);
    }
    get time() {
      return wn(Number(this.animation.currentTime) || 0);
    }
    set time(e) {
      this.finishedTime = null, this.animation.currentTime = Wn(e);
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(e) {
      e < 0 && (this.finishedTime = null), this.animation.playbackRate = e;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return Number(this.animation.startTime);
    }
    set startTime(e) {
      this.animation.startTime = e;
    }
    attachTimeline({ timeline: e, observe: n }) {
      var _a2;
      return this.allowFlatten && ((_a2 = this.animation.effect) == null ? void 0 : _a2.updateTiming({
        easing: "linear"
      })), this.animation.onfinish = null, e && PD() ? (this.animation.timeline = e, zn) : n(this);
    }
  }
  const fT = {
    anticipate: kS,
    backInOut: PS,
    circInOut: FS
  };
  function QD(t) {
    return t in fT;
  }
  function ZD(t) {
    typeof t.ease == "string" && QD(t.ease) && (t.ease = fT[t.ease]);
  }
  const kg = 10;
  class JD extends KD {
    constructor(e) {
      ZD(e), rT(e), super(e), e.startTime && (this.startTime = e.startTime), this.options = e;
    }
    updateMotionValue(e) {
      const { motionValue: n, onUpdate: i, onComplete: a, element: r, ...s } = this.options;
      if (!n) return;
      if (e !== void 0) {
        n.set(e);
        return;
      }
      const l = new zp({
        ...s,
        autoplay: false
      }), o = Wn(this.finishedTime ?? this.time);
      n.setWithVelocity(l.sample(o - kg).value, l.sample(o).value, kg), l.stop();
    }
  }
  const Xg = (t, e) => e === "zIndex" ? false : !!(typeof t == "number" || Array.isArray(t) || typeof t == "string" && (pa.test(t) || t === "0") && !t.startsWith("url("));
  function $D(t) {
    const e = t[0];
    if (t.length === 1) return true;
    for (let n = 0; n < t.length; n++) if (t[n] !== e) return true;
  }
  function WD(t, e, n, i) {
    const a = t[0];
    if (a === null) return false;
    if (e === "display" || e === "visibility") return true;
    const r = t[t.length - 1], s = Xg(a, e), l = Xg(r, e);
    return !s || !l ? false : $D(t) || (n === "spring" || cT(n)) && i;
  }
  function jd(t) {
    t.duration = 0, t.type = "keyframes";
  }
  const ID = /* @__PURE__ */ new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"
  ]), tR = bp(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function eR(t) {
    var _a2;
    const { motionValue: e, name: n, repeatDelay: i, repeatType: a, damping: r, type: s } = t;
    if (!(((_a2 = e == null ? void 0 : e.owner) == null ? void 0 : _a2.current) instanceof HTMLElement)) return false;
    const { onUpdate: o, transformTemplate: c } = e.owner.getProps();
    return tR() && n && ID.has(n) && (n !== "transform" || !c) && !o && !i && a !== "mirror" && r !== 0 && s !== "inertia";
  }
  const nR = 40;
  class iR extends Op {
    constructor({ autoplay: e = true, delay: n = 0, type: i = "keyframes", repeat: a = 0, repeatDelay: r = 0, repeatType: s = "loop", keyframes: l, name: o, motionValue: c, element: f, ...d }) {
      var _a2;
      super(), this.stop = () => {
        var _a3, _b2;
        this._animation && (this._animation.stop(), (_a3 = this.stopTimeline) == null ? void 0 : _a3.call(this)), (_b2 = this.keyframeResolver) == null ? void 0 : _b2.cancel();
      }, this.createdAt = Pe.now();
      const m = {
        autoplay: e,
        delay: n,
        type: i,
        repeat: a,
        repeatDelay: r,
        repeatType: s,
        name: o,
        motionValue: c,
        element: f,
        ...d
      }, y = (f == null ? void 0 : f.KeyframeResolver) || Up;
      this.keyframeResolver = new y(l, (T, b, x) => this.onKeyframesResolved(T, b, m, !x), o, c, f), (_a2 = this.keyframeResolver) == null ? void 0 : _a2.scheduleResolve();
    }
    onKeyframesResolved(e, n, i, a) {
      this.keyframeResolver = void 0;
      const { name: r, type: s, velocity: l, delay: o, isHandoff: c, onUpdate: f } = i;
      this.resolvedAt = Pe.now(), WD(e, r, s, l) || ((Di.instantAnimations || !o) && (f == null ? void 0 : f(Rp(e, i, n))), e[0] = e[e.length - 1], jd(i), i.repeat = 0);
      const m = {
        startTime: a ? this.resolvedAt ? this.resolvedAt - this.createdAt > nR ? this.resolvedAt : this.createdAt : this.createdAt : void 0,
        finalKeyframe: n,
        ...i,
        keyframes: e
      }, y = !c && eR(m) ? new JD({
        ...m,
        element: m.motionValue.owner.current
      }) : new zp(m);
      y.finished.then(() => this.notifyFinished()).catch(zn), this.pendingTimeline && (this.stopTimeline = y.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = y;
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(e, n) {
      return this.finished.finally(e).then(() => {
      });
    }
    get animation() {
      var _a2;
      return this._animation || ((_a2 = this.keyframeResolver) == null ? void 0 : _a2.resume(), HD()), this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(e) {
      this.animation.time = e;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(e) {
      this.animation.speed = e;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(e) {
      return this._animation ? this.stopTimeline = this.animation.attachTimeline(e) : this.pendingTimeline = e, () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      var _a2;
      this._animation && this.animation.cancel(), (_a2 = this.keyframeResolver) == null ? void 0 : _a2.cancel();
    }
  }
  const aR = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
  function rR(t) {
    const e = aR.exec(t);
    if (!e) return [
      ,
    ];
    const [, n, i, a] = e;
    return [
      `--${n ?? i}`,
      a
    ];
  }
  function hT(t, e, n = 1) {
    const [i, a] = rR(t);
    if (!i) return;
    const r = window.getComputedStyle(e).getPropertyValue(i);
    if (r) {
      const s = r.trim();
      return VS(s) ? parseFloat(s) : s;
    }
    return Ep(a) ? hT(a, e, n + 1) : a;
  }
  function Vp(t, e) {
    return (t == null ? void 0 : t[e]) ?? (t == null ? void 0 : t.default) ?? t;
  }
  const dT = /* @__PURE__ */ new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...Cs
  ]), sR = {
    test: (t) => t === "auto",
    parse: (t) => t
  }, mT = (t) => (e) => e.test(t), pT = [
    Ms,
    tt,
    In,
    ji,
    $C,
    JC,
    sR
  ], Fg = (t) => pT.find(mT(t));
  function lR(t) {
    return typeof t == "number" ? t === 0 : t !== null ? t === "none" || t === "0" || NS(t) : true;
  }
  const oR = /* @__PURE__ */ new Set([
    "brightness",
    "contrast",
    "saturate",
    "opacity"
  ]);
  function uR(t) {
    const [e, n] = t.slice(0, -1).split("(");
    if (e === "drop-shadow") return t;
    const [i] = n.match(wp) || [];
    if (!i) return t;
    const a = n.replace(i, "");
    let r = oR.has(e) ? 1 : 0;
    return i !== n && (r *= 100), e + "(" + r + a + ")";
  }
  const cR = /\b([a-z-]*)\(.*?\)/gu, Bd = {
    ...pa,
    getAnimatableNone: (t) => {
      const e = t.match(cR);
      return e ? e.map(uR).join(" ") : t;
    }
  }, qg = {
    ...Ms,
    transform: Math.round
  }, fR = {
    rotate: ji,
    rotateX: ji,
    rotateY: ji,
    rotateZ: ji,
    scale: nu,
    scaleX: nu,
    scaleY: nu,
    scaleZ: nu,
    skew: ji,
    skewX: ji,
    skewY: ji,
    distance: tt,
    translateX: tt,
    translateY: tt,
    translateZ: tt,
    x: tt,
    y: tt,
    z: tt,
    perspective: tt,
    transformPerspective: tt,
    opacity: Fl,
    originX: Ug,
    originY: Ug,
    originZ: tt
  }, Lp = {
    borderWidth: tt,
    borderTopWidth: tt,
    borderRightWidth: tt,
    borderBottomWidth: tt,
    borderLeftWidth: tt,
    borderRadius: tt,
    radius: tt,
    borderTopLeftRadius: tt,
    borderTopRightRadius: tt,
    borderBottomRightRadius: tt,
    borderBottomLeftRadius: tt,
    width: tt,
    maxWidth: tt,
    height: tt,
    maxHeight: tt,
    top: tt,
    right: tt,
    bottom: tt,
    left: tt,
    padding: tt,
    paddingTop: tt,
    paddingRight: tt,
    paddingBottom: tt,
    paddingLeft: tt,
    margin: tt,
    marginTop: tt,
    marginRight: tt,
    marginBottom: tt,
    marginLeft: tt,
    backgroundPositionX: tt,
    backgroundPositionY: tt,
    ...fR,
    zIndex: qg,
    fillOpacity: Fl,
    strokeOpacity: Fl,
    numOctaves: qg
  }, hR = {
    ...Lp,
    color: ne,
    backgroundColor: ne,
    outlineColor: ne,
    fill: ne,
    stroke: ne,
    borderColor: ne,
    borderTopColor: ne,
    borderRightColor: ne,
    borderBottomColor: ne,
    borderLeftColor: ne,
    filter: Bd,
    WebkitFilter: Bd
  }, yT = (t) => hR[t];
  function gT(t, e) {
    let n = yT(t);
    return n !== Bd && (n = pa), n.getAnimatableNone ? n.getAnimatableNone(e) : void 0;
  }
  const dR = /* @__PURE__ */ new Set([
    "auto",
    "none",
    "0"
  ]);
  function mR(t, e, n) {
    let i = 0, a;
    for (; i < t.length && !a; ) {
      const r = t[i];
      typeof r == "string" && !dR.has(r) && ql(r).values.length && (a = t[i]), i++;
    }
    if (a && n) for (const r of e) t[r] = gT(n, a);
  }
  class pR extends Up {
    constructor(e, n, i, a, r) {
      super(e, n, i, a, r, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes: e, element: n, name: i } = this;
      if (!n || !n.current) return;
      super.readKeyframes();
      for (let o = 0; o < e.length; o++) {
        let c = e[o];
        if (typeof c == "string" && (c = c.trim(), Ep(c))) {
          const f = hT(c, n.current);
          f !== void 0 && (e[o] = f), o === e.length - 1 && (this.finalKeyframe = c);
        }
      }
      if (this.resolveNoneKeyframes(), !dT.has(i) || e.length !== 2) return;
      const [a, r] = e, s = Fg(a), l = Fg(r);
      if (s !== l) if (Gg(s) && Gg(l)) for (let o = 0; o < e.length; o++) {
        const c = e[o];
        typeof c == "string" && (e[o] = parseFloat(c));
      }
      else qa[i] && (this.needsMeasurement = true);
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes: e, name: n } = this, i = [];
      for (let a = 0; a < e.length; a++) (e[a] === null || lR(e[a])) && i.push(a);
      i.length && mR(e, i, n);
    }
    measureInitialState() {
      const { element: e, unresolvedKeyframes: n, name: i } = this;
      if (!e || !e.current) return;
      i === "height" && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = qa[i](e.measureViewportBox(), window.getComputedStyle(e.current)), n[0] = this.measuredOrigin;
      const a = n[n.length - 1];
      a !== void 0 && e.getValue(i, a).jump(a, false);
    }
    measureEndState() {
      var _a2;
      const { element: e, name: n, unresolvedKeyframes: i } = this;
      if (!e || !e.current) return;
      const a = e.getValue(n);
      a && a.jump(this.measuredOrigin, false);
      const r = i.length - 1, s = i[r];
      i[r] = qa[n](e.measureViewportBox(), window.getComputedStyle(e.current)), s !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = s), ((_a2 = this.removedTransforms) == null ? void 0 : _a2.length) && this.removedTransforms.forEach(([l, o]) => {
        e.getValue(l).set(o);
      }), this.resolveNoneKeyframes();
    }
  }
  function yR(t, e, n) {
    if (t instanceof EventTarget) return [
      t
    ];
    if (typeof t == "string") {
      let i = document;
      const a = (n == null ? void 0 : n[t]) ?? i.querySelectorAll(t);
      return a ? Array.from(a) : [];
    }
    return Array.from(t);
  }
  const vT = (t, e) => e && typeof t == "number" ? e.transform(t) : t;
  function gR(t) {
    return LS(t) && "offsetHeight" in t;
  }
  const Kg = 30, vR = (t) => !isNaN(parseFloat(t));
  class _R {
    constructor(e, n = {}) {
      this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = (i) => {
        var _a2;
        const a = Pe.now();
        if (this.updatedAt !== a && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(i), this.current !== this.prev && ((_a2 = this.events.change) == null ? void 0 : _a2.notify(this.current), this.dependents)) for (const r of this.dependents) r.dirty();
      }, this.hasAnimated = false, this.setCurrent(e), this.owner = n.owner;
    }
    setCurrent(e) {
      this.current = e, this.updatedAt = Pe.now(), this.canTrackVelocity === null && e !== void 0 && (this.canTrackVelocity = vR(this.current));
    }
    setPrevFrameValue(e = this.current) {
      this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt;
    }
    onChange(e) {
      return this.on("change", e);
    }
    on(e, n) {
      this.events[e] || (this.events[e] = new Sp());
      const i = this.events[e].add(n);
      return e === "change" ? () => {
        i(), Lt.read(() => {
          this.events.change.getSize() || this.stop();
        });
      } : i;
    }
    clearListeners() {
      for (const e in this.events) this.events[e].clear();
    }
    attach(e, n) {
      this.passiveEffect = e, this.stopPassiveEffect = n;
    }
    set(e) {
      this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e);
    }
    setWithVelocity(e, n, i) {
      this.set(n), this.prev = void 0, this.prevFrameValue = e, this.prevUpdatedAt = this.updatedAt - i;
    }
    jump(e, n = true) {
      this.updateAndNotify(e), this.prev = e, this.prevUpdatedAt = this.prevFrameValue = void 0, n && this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
    dirty() {
      var _a2;
      (_a2 = this.events.change) == null ? void 0 : _a2.notify(this.current);
    }
    addDependent(e) {
      this.dependents || (this.dependents = /* @__PURE__ */ new Set()), this.dependents.add(e);
    }
    removeDependent(e) {
      this.dependents && this.dependents.delete(e);
    }
    get() {
      return this.current;
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      const e = Pe.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || e - this.updatedAt > Kg) return 0;
      const n = Math.min(this.updatedAt - this.prevUpdatedAt, Kg);
      return jS(parseFloat(this.current) - parseFloat(this.prevFrameValue), n);
    }
    start(e) {
      return this.stop(), new Promise((n) => {
        this.hasAnimated = true, this.animation = e(n), this.events.animationStart && this.events.animationStart.notify();
      }).then(() => {
        this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
      });
    }
    stop() {
      this.animation && (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()), this.clearAnimation();
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      var _a2, _b2;
      (_a2 = this.dependents) == null ? void 0 : _a2.clear(), (_b2 = this.events.destroy) == null ? void 0 : _b2.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
    }
  }
  function us(t, e) {
    return new _R(t, e);
  }
  const { schedule: Np } = QS(queueMicrotask, false), jn = {
    x: false,
    y: false
  };
  function _T() {
    return jn.x || jn.y;
  }
  function bR(t) {
    return t === "x" || t === "y" ? jn[t] ? null : (jn[t] = true, () => {
      jn[t] = false;
    }) : jn.x || jn.y ? null : (jn.x = jn.y = true, () => {
      jn.x = jn.y = false;
    });
  }
  function bT(t, e) {
    const n = yR(t), i = new AbortController(), a = {
      passive: true,
      ...e,
      signal: i.signal
    };
    return [
      n,
      a,
      () => i.abort()
    ];
  }
  function Qg(t) {
    return !(t.pointerType === "touch" || _T());
  }
  function SR(t, e, n = {}) {
    const [i, a, r] = bT(t, n), s = (l) => {
      if (!Qg(l)) return;
      const { target: o } = l, c = e(o, l);
      if (typeof c != "function" || !o) return;
      const f = (d) => {
        Qg(d) && (c(d), o.removeEventListener("pointerleave", f));
      };
      o.addEventListener("pointerleave", f, a);
    };
    return i.forEach((l) => {
      l.addEventListener("pointerenter", s, a);
    }), r;
  }
  const ST = (t, e) => e ? t === e ? true : ST(t, e.parentElement) : false, jp = (t) => t.pointerType === "mouse" ? typeof t.button != "number" || t.button <= 0 : t.isPrimary !== false, TR = /* @__PURE__ */ new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  function xR(t) {
    return TR.has(t.tagName) || t.tabIndex !== -1;
  }
  const wu = /* @__PURE__ */ new WeakSet();
  function Zg(t) {
    return (e) => {
      e.key === "Enter" && t(e);
    };
  }
  function uh(t, e) {
    t.dispatchEvent(new PointerEvent("pointer" + e, {
      isPrimary: true,
      bubbles: true
    }));
  }
  const AR = (t, e) => {
    const n = t.currentTarget;
    if (!n) return;
    const i = Zg(() => {
      if (wu.has(n)) return;
      uh(n, "down");
      const a = Zg(() => {
        uh(n, "up");
      }), r = () => uh(n, "cancel");
      n.addEventListener("keyup", a, e), n.addEventListener("blur", r, e);
    });
    n.addEventListener("keydown", i, e), n.addEventListener("blur", () => n.removeEventListener("keydown", i), e);
  };
  function Jg(t) {
    return jp(t) && !_T();
  }
  function ER(t, e, n = {}) {
    const [i, a, r] = bT(t, n), s = (l) => {
      const o = l.currentTarget;
      if (!Jg(l)) return;
      wu.add(o);
      const c = e(o, l), f = (y, T) => {
        window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", m), wu.has(o) && wu.delete(o), Jg(y) && typeof c == "function" && c(y, {
          success: T
        });
      }, d = (y) => {
        f(y, o === window || o === document || n.useGlobalTarget || ST(o, y.target));
      }, m = (y) => {
        f(y, false);
      };
      window.addEventListener("pointerup", d, a), window.addEventListener("pointercancel", m, a);
    };
    return i.forEach((l) => {
      (n.useGlobalTarget ? window : l).addEventListener("pointerdown", s, a), gR(l) && (l.addEventListener("focus", (c) => AR(c, a)), !xR(l) && !l.hasAttribute("tabindex") && (l.tabIndex = 0));
    }), r;
  }
  function TT(t) {
    return LS(t) && "ownerSVGElement" in t;
  }
  function wR(t) {
    return TT(t) && t.tagName === "svg";
  }
  const Ce = (t) => !!(t && t.getVelocity), MR = [
    ...pT,
    ne,
    pa
  ], CR = (t) => MR.find(mT(t)), xT = D.createContext({
    transformPagePoint: (t) => t,
    isStatic: false,
    reducedMotion: "never"
  });
  function DR(t = true) {
    const e = D.useContext(yp);
    if (e === null) return [
      true,
      null
    ];
    const { isPresent: n, onExitComplete: i, register: a } = e, r = D.useId();
    D.useEffect(() => {
      if (t) return a(r);
    }, [
      t
    ]);
    const s = D.useCallback(() => t && i && i(r), [
      r,
      i,
      t
    ]);
    return !n && i ? [
      false,
      s
    ] : [
      true
    ];
  }
  const AT = D.createContext({
    strict: false
  }), $g = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: [
      "exit"
    ],
    drag: [
      "drag",
      "dragControls"
    ],
    focus: [
      "whileFocus"
    ],
    hover: [
      "whileHover",
      "onHoverStart",
      "onHoverEnd"
    ],
    tap: [
      "whileTap",
      "onTap",
      "onTapStart",
      "onTapCancel"
    ],
    pan: [
      "onPan",
      "onPanStart",
      "onPanSessionStart",
      "onPanEnd"
    ],
    inView: [
      "whileInView",
      "onViewportEnter",
      "onViewportLeave"
    ],
    layout: [
      "layout",
      "layoutId"
    ]
  }, cs = {};
  for (const t in $g) cs[t] = {
    isEnabled: (e) => $g[t].some((n) => !!e[n])
  };
  function RR(t) {
    for (const e in t) cs[e] = {
      ...cs[e],
      ...t[e]
    };
  }
  const OR = /* @__PURE__ */ new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "ignoreStrict",
    "viewport"
  ]);
  function hc(t) {
    return t.startsWith("while") || t.startsWith("drag") && t !== "draggable" || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || OR.has(t);
  }
  let ET = (t) => !hc(t);
  function zR(t) {
    typeof t == "function" && (ET = (e) => e.startsWith("on") ? !hc(e) : t(e));
  }
  try {
    zR(require("@emotion/is-prop-valid").default);
  } catch {
  }
  function UR(t, e, n) {
    const i = {};
    for (const a in t) a === "values" && typeof t.values == "object" || (ET(a) || n === true && hc(a) || !e && !hc(a) || t.draggable && a.startsWith("onDrag")) && (i[a] = t[a]);
    return i;
  }
  const Xc = D.createContext({});
  function Fc(t) {
    return t !== null && typeof t == "object" && typeof t.start == "function";
  }
  function Kl(t) {
    return typeof t == "string" || Array.isArray(t);
  }
  const Bp = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ], Hp = [
    "initial",
    ...Bp
  ];
  function qc(t) {
    return Fc(t.animate) || Hp.some((e) => Kl(t[e]));
  }
  function wT(t) {
    return !!(qc(t) || t.variants);
  }
  function VR(t, e) {
    if (qc(t)) {
      const { initial: n, animate: i } = t;
      return {
        initial: n === false || Kl(n) ? n : void 0,
        animate: Kl(i) ? i : void 0
      };
    }
    return t.inherit !== false ? e : {};
  }
  function LR(t) {
    const { initial: e, animate: n } = VR(t, D.useContext(Xc));
    return D.useMemo(() => ({
      initial: e,
      animate: n
    }), [
      Wg(e),
      Wg(n)
    ]);
  }
  function Wg(t) {
    return Array.isArray(t) ? t.join(" ") : t;
  }
  const Ql = {};
  function NR(t) {
    for (const e in t) Ql[e] = t[e], Ap(e) && (Ql[e].isCSSVariable = true);
  }
  function MT(t, { layout: e, layoutId: n }) {
    return Ds.has(t) || t.startsWith("origin") || (e || n !== void 0) && (!!Ql[t] || t === "opacity");
  }
  const jR = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  }, BR = Cs.length;
  function HR(t, e, n) {
    let i = "", a = true;
    for (let r = 0; r < BR; r++) {
      const s = Cs[r], l = t[s];
      if (l === void 0) continue;
      let o = true;
      if (typeof l == "number" ? o = l === (s.startsWith("scale") ? 1 : 0) : o = parseFloat(l) === 0, !o || n) {
        const c = vT(l, Lp[s]);
        if (!o) {
          a = false;
          const f = jR[s] || s;
          i += `${f}(${c}) `;
        }
        n && (e[s] = c);
      }
    }
    return i = i.trim(), n ? i = n(e, a ? "" : i) : a && (i = "none"), i;
  }
  function Yp(t, e, n) {
    const { style: i, vars: a, transformOrigin: r } = t;
    let s = false, l = false;
    for (const o in e) {
      const c = e[o];
      if (Ds.has(o)) {
        s = true;
        continue;
      } else if (Ap(o)) {
        a[o] = c;
        continue;
      } else {
        const f = vT(c, Lp[o]);
        o.startsWith("origin") ? (l = true, r[o] = f) : i[o] = f;
      }
    }
    if (e.transform || (s || n ? i.transform = HR(e, t.transform, n) : i.transform && (i.transform = "none")), l) {
      const { originX: o = "50%", originY: c = "50%", originZ: f = 0 } = r;
      i.transformOrigin = `${o} ${c} ${f}`;
    }
  }
  const Gp = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
  });
  function CT(t, e, n) {
    for (const i in e) !Ce(e[i]) && !MT(i, n) && (t[i] = e[i]);
  }
  function YR({ transformTemplate: t }, e) {
    return D.useMemo(() => {
      const n = Gp();
      return Yp(n, e, t), Object.assign({}, n.vars, n.style);
    }, [
      e
    ]);
  }
  function GR(t, e) {
    const n = t.style || {}, i = {};
    return CT(i, n, t), Object.assign(i, YR(t, e)), i;
  }
  function PR(t, e) {
    const n = {}, i = GR(t, e);
    return t.drag && t.dragListener !== false && (n.draggable = false, i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none", i.touchAction = t.drag === true ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`), t.tabIndex === void 0 && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = i, n;
  }
  const kR = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  }, XR = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function FR(t, e, n = 1, i = 0, a = true) {
    t.pathLength = 1;
    const r = a ? kR : XR;
    t[r.offset] = tt.transform(-i);
    const s = tt.transform(e), l = tt.transform(n);
    t[r.array] = `${s} ${l}`;
  }
  function DT(t, { attrX: e, attrY: n, attrScale: i, pathLength: a, pathSpacing: r = 1, pathOffset: s = 0, ...l }, o, c, f) {
    if (Yp(t, l, c), o) {
      t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
      return;
    }
    t.attrs = t.style, t.style = {};
    const { attrs: d, style: m } = t;
    d.transform && (m.transform = d.transform, delete d.transform), (m.transform || d.transformOrigin) && (m.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), m.transform && (m.transformBox = (f == null ? void 0 : f.transformBox) ?? "fill-box", delete d.transformBox), e !== void 0 && (d.x = e), n !== void 0 && (d.y = n), i !== void 0 && (d.scale = i), a !== void 0 && FR(d, a, r, s, false);
  }
  const RT = () => ({
    ...Gp(),
    attrs: {}
  }), OT = (t) => typeof t == "string" && t.toLowerCase() === "svg";
  function qR(t, e, n, i) {
    const a = D.useMemo(() => {
      const r = RT();
      return DT(r, e, OT(i), t.transformTemplate, t.style), {
        ...r.attrs,
        style: {
          ...r.style
        }
      };
    }, [
      e
    ]);
    if (t.style) {
      const r = {};
      CT(r, t.style, t), a.style = {
        ...r,
        ...a.style
      };
    }
    return a;
  }
  const KR = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
  function Pp(t) {
    return typeof t != "string" || t.includes("-") ? false : !!(KR.indexOf(t) > -1 || /[A-Z]/u.test(t));
  }
  function QR(t, e, n, { latestValues: i }, a, r = false) {
    const l = (Pp(t) ? qR : PR)(e, i, a, t), o = UR(e, typeof t == "string", r), c = t !== D.Fragment ? {
      ...o,
      ...l,
      ref: n
    } : {}, { children: f } = e, d = D.useMemo(() => Ce(f) ? f.get() : f, [
      f
    ]);
    return D.createElement(t, {
      ...c,
      children: d
    });
  }
  function Ig(t) {
    const e = [
      {},
      {}
    ];
    return t == null ? void 0 : t.values.forEach((n, i) => {
      e[0][i] = n.get(), e[1][i] = n.getVelocity();
    }), e;
  }
  function kp(t, e, n, i) {
    if (typeof e == "function") {
      const [a, r] = Ig(i);
      e = e(n !== void 0 ? n : t.custom, a, r);
    }
    if (typeof e == "string" && (e = t.variants && t.variants[e]), typeof e == "function") {
      const [a, r] = Ig(i);
      e = e(n !== void 0 ? n : t.custom, a, r);
    }
    return e;
  }
  function Mu(t) {
    return Ce(t) ? t.get() : t;
  }
  function ZR({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, i, a) {
    return {
      latestValues: JR(n, i, a, t),
      renderState: e()
    };
  }
  function JR(t, e, n, i) {
    const a = {}, r = i(t, {});
    for (const m in r) a[m] = Mu(r[m]);
    let { initial: s, animate: l } = t;
    const o = qc(t), c = wT(t);
    e && c && !o && t.inherit !== false && (s === void 0 && (s = e.initial), l === void 0 && (l = e.animate));
    let f = n ? n.initial === false : false;
    f = f || s === false;
    const d = f ? l : s;
    if (d && typeof d != "boolean" && !Fc(d)) {
      const m = Array.isArray(d) ? d : [
        d
      ];
      for (let y = 0; y < m.length; y++) {
        const T = kp(t, m[y]);
        if (T) {
          const { transitionEnd: b, transition: x, ...v } = T;
          for (const g in v) {
            let S = v[g];
            if (Array.isArray(S)) {
              const A = f ? S.length - 1 : 0;
              S = S[A];
            }
            S !== null && (a[g] = S);
          }
          for (const g in b) a[g] = b[g];
        }
      }
    }
    return a;
  }
  const zT = (t) => (e, n) => {
    const i = D.useContext(Xc), a = D.useContext(yp), r = () => ZR(t, e, i, a);
    return n ? r() : RC(r);
  };
  function Xp(t, e, n) {
    var _a2;
    const { style: i } = t, a = {};
    for (const r in i) (Ce(i[r]) || e.style && Ce(e.style[r]) || MT(r, t) || ((_a2 = n == null ? void 0 : n.getValue(r)) == null ? void 0 : _a2.liveStyle) !== void 0) && (a[r] = i[r]);
    return a;
  }
  const $R = zT({
    scrapeMotionValuesFromProps: Xp,
    createRenderState: Gp
  });
  function UT(t, e, n) {
    const i = Xp(t, e, n);
    for (const a in t) if (Ce(t[a]) || Ce(e[a])) {
      const r = Cs.indexOf(a) !== -1 ? "attr" + a.charAt(0).toUpperCase() + a.substring(1) : a;
      i[r] = t[a];
    }
    return i;
  }
  const WR = zT({
    scrapeMotionValuesFromProps: UT,
    createRenderState: RT
  }), IR = Symbol.for("motionComponentSymbol");
  function Lr(t) {
    return t && typeof t == "object" && Object.prototype.hasOwnProperty.call(t, "current");
  }
  function tO(t, e, n) {
    return D.useCallback((i) => {
      i && t.onMount && t.onMount(i), e && (i ? e.mount(i) : e.unmount()), n && (typeof n == "function" ? n(i) : Lr(n) && (n.current = i));
    }, [
      e
    ]);
  }
  const Fp = (t) => t.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(), eO = "framerAppearId", VT = "data-" + Fp(eO), LT = D.createContext({});
  function nO(t, e, n, i, a) {
    var _a2, _b2;
    const { visualElement: r } = D.useContext(Xc), s = D.useContext(AT), l = D.useContext(yp), o = D.useContext(xT).reducedMotion, c = D.useRef(null);
    i = i || s.renderer, !c.current && i && (c.current = i(t, {
      visualState: e,
      parent: r,
      props: n,
      presenceContext: l,
      blockInitialAnimation: l ? l.initial === false : false,
      reducedMotionConfig: o
    }));
    const f = c.current, d = D.useContext(LT);
    f && !f.projection && a && (f.type === "html" || f.type === "svg") && iO(c.current, n, a, d);
    const m = D.useRef(false);
    D.useInsertionEffect(() => {
      f && m.current && f.update(n, l);
    });
    const y = n[VT], T = D.useRef(!!y && !((_a2 = window.MotionHandoffIsComplete) == null ? void 0 : _a2.call(window, y)) && ((_b2 = window.MotionHasOptimisedAnimation) == null ? void 0 : _b2.call(window, y)));
    return OC(() => {
      f && (m.current = true, window.MotionIsMounted = true, f.updateFeatures(), f.scheduleRenderMicrotask(), T.current && f.animationState && f.animationState.animateChanges());
    }), D.useEffect(() => {
      f && (!T.current && f.animationState && f.animationState.animateChanges(), T.current && (queueMicrotask(() => {
        var _a3;
        (_a3 = window.MotionHandoffMarkAsComplete) == null ? void 0 : _a3.call(window, y);
      }), T.current = false), f.enteringChildren = void 0);
    }), f;
  }
  function iO(t, e, n, i) {
    const { layoutId: a, layout: r, drag: s, dragConstraints: l, layoutScroll: o, layoutRoot: c, layoutCrossfade: f } = e;
    t.projection = new n(t.latestValues, e["data-framer-portal-id"] ? void 0 : NT(t.parent)), t.projection.setOptions({
      layoutId: a,
      layout: r,
      alwaysMeasureLayout: !!s || l && Lr(l),
      visualElement: t,
      animationType: typeof r == "string" ? r : "both",
      initialPromotionConfig: i,
      crossfade: f,
      layoutScroll: o,
      layoutRoot: c
    });
  }
  function NT(t) {
    if (t) return t.options.allowProjection !== false ? t.projection : NT(t.parent);
  }
  function ch(t, { forwardMotionProps: e = false } = {}, n, i) {
    n && RR(n);
    const a = Pp(t) ? WR : $R;
    function r(l, o) {
      let c;
      const f = {
        ...D.useContext(xT),
        ...l,
        layoutId: aO(l)
      }, { isStatic: d } = f, m = LR(l), y = a(l, d);
      if (!d && pp) {
        rO();
        const T = sO(f);
        c = T.MeasureLayout, m.visualElement = nO(t, y, f, i, T.ProjectionNode);
      }
      return J.jsxs(Xc.Provider, {
        value: m,
        children: [
          c && m.visualElement ? J.jsx(c, {
            visualElement: m.visualElement,
            ...f
          }) : null,
          QR(t, l, tO(y, m.visualElement, o), y, d, e)
        ]
      });
    }
    r.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
    const s = D.forwardRef(r);
    return s[IR] = t, s;
  }
  function aO({ layoutId: t }) {
    const e = D.useContext(US).id;
    return e && t !== void 0 ? e + "-" + t : t;
  }
  function rO(t, e) {
    D.useContext(AT).strict;
  }
  function sO(t) {
    const { drag: e, layout: n } = cs;
    if (!e && !n) return {};
    const i = {
      ...e,
      ...n
    };
    return {
      MeasureLayout: (e == null ? void 0 : e.isEnabled(t)) || (n == null ? void 0 : n.isEnabled(t)) ? i.MeasureLayout : void 0,
      ProjectionNode: i.ProjectionNode
    };
  }
  function lO(t, e) {
    if (typeof Proxy > "u") return ch;
    const n = /* @__PURE__ */ new Map(), i = (r, s) => ch(r, s, t, e), a = (r, s) => i(r, s);
    return new Proxy(a, {
      get: (r, s) => s === "create" ? i : (n.has(s) || n.set(s, ch(s, void 0, t, e)), n.get(s))
    });
  }
  function jT({ top: t, left: e, right: n, bottom: i }) {
    return {
      x: {
        min: e,
        max: n
      },
      y: {
        min: t,
        max: i
      }
    };
  }
  function oO({ x: t, y: e }) {
    return {
      top: e.min,
      right: t.max,
      bottom: e.max,
      left: t.min
    };
  }
  function uO(t, e) {
    if (!e) return t;
    const n = e({
      x: t.left,
      y: t.top
    }), i = e({
      x: t.right,
      y: t.bottom
    });
    return {
      top: n.y,
      left: n.x,
      bottom: i.y,
      right: i.x
    };
  }
  function fh(t) {
    return t === void 0 || t === 1;
  }
  function Hd({ scale: t, scaleX: e, scaleY: n }) {
    return !fh(t) || !fh(e) || !fh(n);
  }
  function Na(t) {
    return Hd(t) || BT(t) || t.z || t.rotate || t.rotateX || t.rotateY || t.skewX || t.skewY;
  }
  function BT(t) {
    return tv(t.x) || tv(t.y);
  }
  function tv(t) {
    return t && t !== "0%";
  }
  function dc(t, e, n) {
    const i = t - n, a = e * i;
    return n + a;
  }
  function ev(t, e, n, i, a) {
    return a !== void 0 && (t = dc(t, a, i)), dc(t, n, i) + e;
  }
  function Yd(t, e = 0, n = 1, i, a) {
    t.min = ev(t.min, e, n, i, a), t.max = ev(t.max, e, n, i, a);
  }
  function HT(t, { x: e, y: n }) {
    Yd(t.x, e.translate, e.scale, e.originPoint), Yd(t.y, n.translate, n.scale, n.originPoint);
  }
  const nv = 0.999999999999, iv = 1.0000000000001;
  function cO(t, e, n, i = false) {
    const a = n.length;
    if (!a) return;
    e.x = e.y = 1;
    let r, s;
    for (let l = 0; l < a; l++) {
      r = n[l], s = r.projectionDelta;
      const { visualElement: o } = r.options;
      o && o.props.style && o.props.style.display === "contents" || (i && r.options.layoutScroll && r.scroll && r !== r.root && jr(t, {
        x: -r.scroll.offset.x,
        y: -r.scroll.offset.y
      }), s && (e.x *= s.x.scale, e.y *= s.y.scale, HT(t, s)), i && Na(r.latestValues) && jr(t, r.latestValues));
    }
    e.x < iv && e.x > nv && (e.x = 1), e.y < iv && e.y > nv && (e.y = 1);
  }
  function Nr(t, e) {
    t.min = t.min + e, t.max = t.max + e;
  }
  function av(t, e, n, i, a = 0.5) {
    const r = Ht(t.min, t.max, a);
    Yd(t, e, n, r, i);
  }
  function jr(t, e) {
    av(t.x, e.x, e.scaleX, e.scale, e.originX), av(t.y, e.y, e.scaleY, e.scale, e.originY);
  }
  function YT(t, e) {
    return jT(uO(t.getBoundingClientRect(), e));
  }
  function fO(t, e, n) {
    const i = YT(t, n), { scroll: a } = e;
    return a && (Nr(i.x, a.offset.x), Nr(i.y, a.offset.y)), i;
  }
  const rv = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
  }), Br = () => ({
    x: rv(),
    y: rv()
  }), sv = () => ({
    min: 0,
    max: 0
  }), Jt = () => ({
    x: sv(),
    y: sv()
  }), Gd = {
    current: null
  }, GT = {
    current: false
  };
  function hO() {
    if (GT.current = true, !!pp) if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"), e = () => Gd.current = t.matches;
      t.addEventListener("change", e), e();
    } else Gd.current = false;
  }
  const dO = /* @__PURE__ */ new WeakMap();
  function mO(t, e, n) {
    for (const i in e) {
      const a = e[i], r = n[i];
      if (Ce(a)) t.addValue(i, a);
      else if (Ce(r)) t.addValue(i, us(a, {
        owner: t
      }));
      else if (r !== a) if (t.hasValue(i)) {
        const s = t.getValue(i);
        s.liveStyle === true ? s.jump(a) : s.hasAnimated || s.set(a);
      } else {
        const s = t.getStaticValue(i);
        t.addValue(i, us(s !== void 0 ? s : a, {
          owner: t
        }));
      }
    }
    for (const i in n) e[i] === void 0 && t.removeValue(i);
    return e;
  }
  const lv = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  class pO {
    scrapeMotionValuesFromProps(e, n, i) {
      return {};
    }
    constructor({ parent: e, props: n, presenceContext: i, reducedMotionConfig: a, blockInitialAnimation: r, visualState: s }, l = {}) {
      this.current = null, this.children = /* @__PURE__ */ new Set(), this.isVariantNode = false, this.isControllingVariants = false, this.shouldReduceMotion = null, this.values = /* @__PURE__ */ new Map(), this.KeyframeResolver = Up, this.features = {}, this.valueSubscriptions = /* @__PURE__ */ new Map(), this.prevMotionValues = {}, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
        this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
      }, this.renderScheduledAt = 0, this.scheduleRender = () => {
        const m = Pe.now();
        this.renderScheduledAt < m && (this.renderScheduledAt = m, Lt.render(this.render, false, true));
      };
      const { latestValues: o, renderState: c } = s;
      this.latestValues = o, this.baseTarget = {
        ...o
      }, this.initialValues = n.initial ? {
        ...o
      } : {}, this.renderState = c, this.parent = e, this.props = n, this.presenceContext = i, this.depth = e ? e.depth + 1 : 0, this.reducedMotionConfig = a, this.options = l, this.blockInitialAnimation = !!r, this.isControllingVariants = qc(n), this.isVariantNode = wT(n), this.isVariantNode && (this.variantChildren = /* @__PURE__ */ new Set()), this.manuallyAnimateOnMount = !!(e && e.current);
      const { willChange: f, ...d } = this.scrapeMotionValuesFromProps(n, {}, this);
      for (const m in d) {
        const y = d[m];
        o[m] !== void 0 && Ce(y) && y.set(o[m]);
      }
    }
    mount(e) {
      var _a2;
      this.current = e, dO.set(e, this), this.projection && !this.projection.instance && this.projection.mount(e), this.parent && this.isVariantNode && !this.isControllingVariants && (this.removeFromVariantTree = this.parent.addVariantChild(this)), this.values.forEach((n, i) => this.bindToMotionValue(i, n)), GT.current || hO(), this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : Gd.current, (_a2 = this.parent) == null ? void 0 : _a2.addChild(this), this.update(this.props, this.presenceContext);
    }
    unmount() {
      var _a2;
      this.projection && this.projection.unmount(), ma(this.notifyUpdate), ma(this.render), this.valueSubscriptions.forEach((e) => e()), this.valueSubscriptions.clear(), this.removeFromVariantTree && this.removeFromVariantTree(), (_a2 = this.parent) == null ? void 0 : _a2.removeChild(this);
      for (const e in this.events) this.events[e].clear();
      for (const e in this.features) {
        const n = this.features[e];
        n && (n.unmount(), n.isMounted = false);
      }
      this.current = null;
    }
    addChild(e) {
      this.children.add(e), this.enteringChildren ?? (this.enteringChildren = /* @__PURE__ */ new Set()), this.enteringChildren.add(e);
    }
    removeChild(e) {
      this.children.delete(e), this.enteringChildren && this.enteringChildren.delete(e);
    }
    bindToMotionValue(e, n) {
      this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
      const i = Ds.has(e);
      i && this.onBindTransform && this.onBindTransform();
      const a = n.on("change", (s) => {
        this.latestValues[e] = s, this.props.onUpdate && Lt.preRender(this.notifyUpdate), i && this.projection && (this.projection.isTransformDirty = true), this.scheduleRender();
      });
      let r;
      window.MotionCheckAppearSync && (r = window.MotionCheckAppearSync(this, e, n)), this.valueSubscriptions.set(e, () => {
        a(), r && r(), n.owner && n.stop();
      });
    }
    sortNodePosition(e) {
      return !this.current || !this.sortInstanceNodePosition || this.type !== e.type ? 0 : this.sortInstanceNodePosition(this.current, e.current);
    }
    updateFeatures() {
      let e = "animation";
      for (e in cs) {
        const n = cs[e];
        if (!n) continue;
        const { isEnabled: i, Feature: a } = n;
        if (!this.features[e] && a && i(this.props) && (this.features[e] = new a(this)), this.features[e]) {
          const r = this.features[e];
          r.isMounted ? r.update() : (r.mount(), r.isMounted = true);
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : Jt();
    }
    getStaticValue(e) {
      return this.latestValues[e];
    }
    setStaticValue(e, n) {
      this.latestValues[e] = n;
    }
    update(e, n) {
      (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(), this.prevProps = this.props, this.props = e, this.prevPresenceContext = this.presenceContext, this.presenceContext = n;
      for (let i = 0; i < lv.length; i++) {
        const a = lv[i];
        this.propEventSubscriptions[a] && (this.propEventSubscriptions[a](), delete this.propEventSubscriptions[a]);
        const r = "on" + a, s = e[r];
        s && (this.propEventSubscriptions[a] = this.on(a, s));
      }
      this.prevMotionValues = mO(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues), this.handleChildMotionValue && this.handleChildMotionValue();
    }
    getProps() {
      return this.props;
    }
    getVariant(e) {
      return this.props.variants ? this.props.variants[e] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
    addVariantChild(e) {
      const n = this.getClosestVariantNode();
      if (n) return n.variantChildren && n.variantChildren.add(e), () => n.variantChildren.delete(e);
    }
    addValue(e, n) {
      const i = this.values.get(e);
      n !== i && (i && this.removeValue(e), this.bindToMotionValue(e, n), this.values.set(e, n), this.latestValues[e] = n.get());
    }
    removeValue(e) {
      this.values.delete(e);
      const n = this.valueSubscriptions.get(e);
      n && (n(), this.valueSubscriptions.delete(e)), delete this.latestValues[e], this.removeValueFromRenderState(e, this.renderState);
    }
    hasValue(e) {
      return this.values.has(e);
    }
    getValue(e, n) {
      if (this.props.values && this.props.values[e]) return this.props.values[e];
      let i = this.values.get(e);
      return i === void 0 && n !== void 0 && (i = us(n === null ? void 0 : n, {
        owner: this
      }), this.addValue(e, i)), i;
    }
    readValue(e, n) {
      let i = this.latestValues[e] !== void 0 || !this.current ? this.latestValues[e] : this.getBaseTargetFromProps(this.props, e) ?? this.readValueFromInstance(this.current, e, this.options);
      return i != null && (typeof i == "string" && (VS(i) || NS(i)) ? i = parseFloat(i) : !CR(i) && pa.test(n) && (i = gT(e, n)), this.setBaseTarget(e, Ce(i) ? i.get() : i)), Ce(i) ? i.get() : i;
    }
    setBaseTarget(e, n) {
      this.baseTarget[e] = n;
    }
    getBaseTarget(e) {
      var _a2;
      const { initial: n } = this.props;
      let i;
      if (typeof n == "string" || typeof n == "object") {
        const r = kp(this.props, n, (_a2 = this.presenceContext) == null ? void 0 : _a2.custom);
        r && (i = r[e]);
      }
      if (n && i !== void 0) return i;
      const a = this.getBaseTargetFromProps(this.props, e);
      return a !== void 0 && !Ce(a) ? a : this.initialValues[e] !== void 0 && i === void 0 ? void 0 : this.baseTarget[e];
    }
    on(e, n) {
      return this.events[e] || (this.events[e] = new Sp()), this.events[e].add(n);
    }
    notify(e, ...n) {
      this.events[e] && this.events[e].notify(...n);
    }
    scheduleRenderMicrotask() {
      Np.render(this.render);
    }
  }
  class PT extends pO {
    constructor() {
      super(...arguments), this.KeyframeResolver = pR;
    }
    sortInstanceNodePosition(e, n) {
      return e.compareDocumentPosition(n) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(e, n) {
      return e.style ? e.style[n] : void 0;
    }
    removeValueFromRenderState(e, { vars: n, style: i }) {
      delete n[e], delete i[e];
    }
    handleChildMotionValue() {
      this.childSubscription && (this.childSubscription(), delete this.childSubscription);
      const { children: e } = this.props;
      Ce(e) && (this.childSubscription = e.on("change", (n) => {
        this.current && (this.current.textContent = `${n}`);
      }));
    }
  }
  function kT(t, { style: e, vars: n }, i, a) {
    const r = t.style;
    let s;
    for (s in e) r[s] = e[s];
    a == null ? void 0 : a.applyProjectionStyles(r, i);
    for (s in n) r.setProperty(s, n[s]);
  }
  function yO(t) {
    return window.getComputedStyle(t);
  }
  class gO extends PT {
    constructor() {
      super(...arguments), this.type = "html", this.renderInstance = kT;
    }
    readValueFromInstance(e, n) {
      var _a2;
      if (Ds.has(n)) return ((_a2 = this.projection) == null ? void 0 : _a2.isProjecting) ? zd(n) : VD(e, n);
      {
        const i = yO(e), a = (Ap(n) ? i.getPropertyValue(n) : i[n]) || 0;
        return typeof a == "string" ? a.trim() : a;
      }
    }
    measureInstanceViewportBox(e, { transformPagePoint: n }) {
      return YT(e, n);
    }
    build(e, n, i) {
      Yp(e, n, i.transformTemplate);
    }
    scrapeMotionValuesFromProps(e, n, i) {
      return Xp(e, n, i);
    }
  }
  const XT = /* @__PURE__ */ new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);
  function vO(t, e, n, i) {
    kT(t, e, void 0, i);
    for (const a in e.attrs) t.setAttribute(XT.has(a) ? a : Fp(a), e.attrs[a]);
  }
  class _O extends PT {
    constructor() {
      super(...arguments), this.type = "svg", this.isSVGTag = false, this.measureInstanceViewportBox = Jt;
    }
    getBaseTargetFromProps(e, n) {
      return e[n];
    }
    readValueFromInstance(e, n) {
      if (Ds.has(n)) {
        const i = yT(n);
        return i && i.default || 0;
      }
      return n = XT.has(n) ? n : Fp(n), e.getAttribute(n);
    }
    scrapeMotionValuesFromProps(e, n, i) {
      return UT(e, n, i);
    }
    build(e, n, i) {
      DT(e, n, this.isSVGTag, i.transformTemplate, i.style);
    }
    renderInstance(e, n, i, a) {
      vO(e, n, i, a);
    }
    mount(e) {
      this.isSVGTag = OT(e.tagName), super.mount(e);
    }
  }
  const bO = (t, e) => Pp(t) ? new _O(e) : new gO(e, {
    allowProjection: t !== D.Fragment
  });
  function Qr(t, e, n) {
    const i = t.getProps();
    return kp(i, e, n !== void 0 ? n : i.custom, t);
  }
  const Pd = (t) => Array.isArray(t);
  function SO(t, e, n) {
    t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, us(n));
  }
  function TO(t) {
    return Pd(t) ? t[t.length - 1] || 0 : t;
  }
  function xO(t, e) {
    const n = Qr(t, e);
    let { transitionEnd: i = {}, transition: a = {}, ...r } = n || {};
    r = {
      ...r,
      ...i
    };
    for (const s in r) {
      const l = TO(r[s]);
      SO(t, s, l);
    }
  }
  function AO(t) {
    return !!(Ce(t) && t.add);
  }
  function kd(t, e) {
    const n = t.getValue("willChange");
    if (AO(n)) return n.add(e);
    if (!n && Di.WillChange) {
      const i = new Di.WillChange("auto");
      t.addValue("willChange", i), i.add(e);
    }
  }
  function FT(t) {
    return t.props[VT];
  }
  const EO = (t) => t !== null;
  function wO(t, { repeat: e, repeatType: n = "loop" }, i) {
    const a = t.filter(EO), r = e && n !== "loop" && e % 2 === 1 ? 0 : a.length - 1;
    return a[r];
  }
  const MO = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  }, CO = (t) => ({
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  }), DO = {
    type: "keyframes",
    duration: 0.8
  }, RO = {
    type: "keyframes",
    ease: [
      0.25,
      0.1,
      0.35,
      1
    ],
    duration: 0.3
  }, OO = (t, { keyframes: e }) => e.length > 2 ? DO : Ds.has(t) ? t.startsWith("scale") ? CO(e[1]) : MO : RO;
  function zO({ when: t, delay: e, delayChildren: n, staggerChildren: i, staggerDirection: a, repeat: r, repeatType: s, repeatDelay: l, from: o, elapsed: c, ...f }) {
    return !!Object.keys(f).length;
  }
  const qp = (t, e, n, i = {}, a, r) => (s) => {
    const l = Vp(i, t) || {}, o = l.delay || i.delay || 0;
    let { elapsed: c = 0 } = i;
    c = c - Wn(o);
    const f = {
      keyframes: Array.isArray(n) ? n : [
        null,
        n
      ],
      ease: "easeOut",
      velocity: e.getVelocity(),
      ...l,
      delay: -c,
      onUpdate: (m) => {
        e.set(m), l.onUpdate && l.onUpdate(m);
      },
      onComplete: () => {
        s(), l.onComplete && l.onComplete();
      },
      name: t,
      motionValue: e,
      element: r ? void 0 : a
    };
    zO(l) || Object.assign(f, OO(t, f)), f.duration && (f.duration = Wn(f.duration)), f.repeatDelay && (f.repeatDelay = Wn(f.repeatDelay)), f.from !== void 0 && (f.keyframes[0] = f.from);
    let d = false;
    if ((f.type === false || f.duration === 0 && !f.repeatDelay) && (jd(f), f.delay === 0 && (d = true)), (Di.instantAnimations || Di.skipAnimations) && (d = true, jd(f), f.delay = 0), f.allowFlatten = !l.type && !l.ease, d && !r && e.get() !== void 0) {
      const m = wO(f.keyframes, l);
      if (m !== void 0) {
        Lt.update(() => {
          f.onUpdate(m), f.onComplete();
        });
        return;
      }
    }
    return l.isSync ? new zp(f) : new iR(f);
  };
  function UO({ protectedKeys: t, needsAnimating: e }, n) {
    const i = t.hasOwnProperty(n) && e[n] !== true;
    return e[n] = false, i;
  }
  function qT(t, e, { delay: n = 0, transitionOverride: i, type: a } = {}) {
    let { transition: r = t.getDefaultTransition(), transitionEnd: s, ...l } = e;
    i && (r = i);
    const o = [], c = a && t.animationState && t.animationState.getState()[a];
    for (const f in l) {
      const d = t.getValue(f, t.latestValues[f] ?? null), m = l[f];
      if (m === void 0 || c && UO(c, f)) continue;
      const y = {
        delay: n,
        ...Vp(r || {}, f)
      }, T = d.get();
      if (T !== void 0 && !d.isAnimating && !Array.isArray(m) && m === T && !y.velocity) continue;
      let b = false;
      if (window.MotionHandoffAnimation) {
        const v = FT(t);
        if (v) {
          const g = window.MotionHandoffAnimation(v, f, Lt);
          g !== null && (y.startTime = g, b = true);
        }
      }
      kd(t, f), d.start(qp(f, d, m, t.shouldReduceMotion && dT.has(f) ? {
        type: false
      } : y, t, b));
      const x = d.animation;
      x && o.push(x);
    }
    return s && Promise.all(o).then(() => {
      Lt.update(() => {
        s && xO(t, s);
      });
    }), o;
  }
  function KT(t, e, n, i = 0, a = 1) {
    const r = Array.from(t).sort((c, f) => c.sortNodePosition(f)).indexOf(e), s = t.size, l = (s - 1) * i;
    return typeof n == "function" ? n(r, s) : a === 1 ? r * i : l - r * i;
  }
  function Xd(t, e, n = {}) {
    var _a2;
    const i = Qr(t, e, n.type === "exit" ? (_a2 = t.presenceContext) == null ? void 0 : _a2.custom : void 0);
    let { transition: a = t.getDefaultTransition() || {} } = i || {};
    n.transitionOverride && (a = n.transitionOverride);
    const r = i ? () => Promise.all(qT(t, i, n)) : () => Promise.resolve(), s = t.variantChildren && t.variantChildren.size ? (o = 0) => {
      const { delayChildren: c = 0, staggerChildren: f, staggerDirection: d } = a;
      return VO(t, e, o, c, f, d, n);
    } : () => Promise.resolve(), { when: l } = a;
    if (l) {
      const [o, c] = l === "beforeChildren" ? [
        r,
        s
      ] : [
        s,
        r
      ];
      return o().then(() => c());
    } else return Promise.all([
      r(),
      s(n.delay)
    ]);
  }
  function VO(t, e, n = 0, i = 0, a = 0, r = 1, s) {
    const l = [];
    for (const o of t.variantChildren) o.notify("AnimationStart", e), l.push(Xd(o, e, {
      ...s,
      delay: n + (typeof i == "function" ? 0 : i) + KT(t.variantChildren, o, i, a, r)
    }).then(() => o.notify("AnimationComplete", e)));
    return Promise.all(l);
  }
  function LO(t, e, n = {}) {
    t.notify("AnimationStart", e);
    let i;
    if (Array.isArray(e)) {
      const a = e.map((r) => Xd(t, r, n));
      i = Promise.all(a);
    } else if (typeof e == "string") i = Xd(t, e, n);
    else {
      const a = typeof e == "function" ? Qr(t, e, n.custom) : e;
      i = Promise.all(qT(t, a, n));
    }
    return i.then(() => {
      t.notify("AnimationComplete", e);
    });
  }
  function QT(t, e) {
    if (!Array.isArray(e)) return false;
    const n = e.length;
    if (n !== t.length) return false;
    for (let i = 0; i < n; i++) if (e[i] !== t[i]) return false;
    return true;
  }
  const NO = Hp.length;
  function ZT(t) {
    if (!t) return;
    if (!t.isControllingVariants) {
      const n = t.parent ? ZT(t.parent) || {} : {};
      return t.props.initial !== void 0 && (n.initial = t.props.initial), n;
    }
    const e = {};
    for (let n = 0; n < NO; n++) {
      const i = Hp[n], a = t.props[i];
      (Kl(a) || a === false) && (e[i] = a);
    }
    return e;
  }
  const jO = [
    ...Bp
  ].reverse(), BO = Bp.length;
  function HO(t) {
    return (e) => Promise.all(e.map(({ animation: n, options: i }) => LO(t, n, i)));
  }
  function YO(t) {
    let e = HO(t), n = ov(), i = true;
    const a = (o) => (c, f) => {
      var _a2;
      const d = Qr(t, f, o === "exit" ? (_a2 = t.presenceContext) == null ? void 0 : _a2.custom : void 0);
      if (d) {
        const { transition: m, transitionEnd: y, ...T } = d;
        c = {
          ...c,
          ...T,
          ...y
        };
      }
      return c;
    };
    function r(o) {
      e = o(t);
    }
    function s(o) {
      const { props: c } = t, f = ZT(t.parent) || {}, d = [], m = /* @__PURE__ */ new Set();
      let y = {}, T = 1 / 0;
      for (let x = 0; x < BO; x++) {
        const v = jO[x], g = n[v], S = c[v] !== void 0 ? c[v] : f[v], A = Kl(S), w = v === o ? g.isActive : null;
        w === false && (T = x);
        let V = S === f[v] && S !== c[v] && A;
        if (V && i && t.manuallyAnimateOnMount && (V = false), g.protectedKeys = {
          ...y
        }, !g.isActive && w === null || !S && !g.prevProp || Fc(S) || typeof S == "boolean") continue;
        const z = GO(g.prevProp, S);
        let O = z || v === o && g.isActive && !V && A || x > T && A, U = false;
        const B = Array.isArray(S) ? S : [
          S
        ];
        let Y = B.reduce(a(v), {});
        w === false && (Y = {});
        const { prevResolvedValues: q = {} } = g, k = {
          ...q,
          ...Y
        }, $ = (P) => {
          O = true, m.has(P) && (U = true, m.delete(P)), g.needsAnimating[P] = true;
          const G = t.getValue(P);
          G && (G.liveStyle = false);
        };
        for (const P in k) {
          const G = Y[P], Q = q[P];
          if (y.hasOwnProperty(P)) continue;
          let it = false;
          Pd(G) && Pd(Q) ? it = !QT(G, Q) : it = G !== Q, it ? G != null ? $(P) : m.add(P) : G !== void 0 && m.has(P) ? $(P) : g.protectedKeys[P] = true;
        }
        g.prevProp = S, g.prevResolvedValues = Y, g.isActive && (y = {
          ...y,
          ...Y
        }), i && t.blockInitialAnimation && (O = false);
        const K = V && z;
        O && (!K || U) && d.push(...B.map((P) => {
          const G = {
            type: v
          };
          if (typeof P == "string" && i && !K && t.manuallyAnimateOnMount && t.parent) {
            const { parent: Q } = t, it = Qr(Q, P);
            if (Q.enteringChildren && it) {
              const { delayChildren: Pt } = it.transition || {};
              G.delay = KT(Q.enteringChildren, t, Pt);
            }
          }
          return {
            animation: P,
            options: G
          };
        }));
      }
      if (m.size) {
        const x = {};
        if (typeof c.initial != "boolean") {
          const v = Qr(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
          v && v.transition && (x.transition = v.transition);
        }
        m.forEach((v) => {
          const g = t.getBaseTarget(v), S = t.getValue(v);
          S && (S.liveStyle = true), x[v] = g ?? null;
        }), d.push({
          animation: x
        });
      }
      let b = !!d.length;
      return i && (c.initial === false || c.initial === c.animate) && !t.manuallyAnimateOnMount && (b = false), i = false, b ? e(d) : Promise.resolve();
    }
    function l(o, c) {
      var _a2;
      if (n[o].isActive === c) return Promise.resolve();
      (_a2 = t.variantChildren) == null ? void 0 : _a2.forEach((d) => {
        var _a3;
        return (_a3 = d.animationState) == null ? void 0 : _a3.setActive(o, c);
      }), n[o].isActive = c;
      const f = s(o);
      for (const d in n) n[d].protectedKeys = {};
      return f;
    }
    return {
      animateChanges: s,
      setActive: l,
      setAnimateFunction: r,
      getState: () => n,
      reset: () => {
        n = ov();
      }
    };
  }
  function GO(t, e) {
    return typeof e == "string" ? e !== t : Array.isArray(e) ? !QT(e, t) : false;
  }
  function Da(t = false) {
    return {
      isActive: t,
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  }
  function ov() {
    return {
      animate: Da(true),
      whileInView: Da(),
      whileHover: Da(),
      whileTap: Da(),
      whileDrag: Da(),
      whileFocus: Da(),
      exit: Da()
    };
  }
  class ba {
    constructor(e) {
      this.isMounted = false, this.node = e;
    }
    update() {
    }
  }
  class PO extends ba {
    constructor(e) {
      super(e), e.animationState || (e.animationState = YO(e));
    }
    updateAnimationControlsSubscription() {
      const { animate: e } = this.node.getProps();
      Fc(e) && (this.unmountControls = e.subscribe(this.node));
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate: e } = this.node.getProps(), { animate: n } = this.node.prevProps || {};
      e !== n && this.updateAnimationControlsSubscription();
    }
    unmount() {
      var _a2;
      this.node.animationState.reset(), (_a2 = this.unmountControls) == null ? void 0 : _a2.call(this);
    }
  }
  let kO = 0;
  class XO extends ba {
    constructor() {
      super(...arguments), this.id = kO++;
    }
    update() {
      if (!this.node.presenceContext) return;
      const { isPresent: e, onExitComplete: n } = this.node.presenceContext, { isPresent: i } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || e === i) return;
      const a = this.node.animationState.setActive("exit", !e);
      n && !e && a.then(() => {
        n(this.id);
      });
    }
    mount() {
      const { register: e, onExitComplete: n } = this.node.presenceContext || {};
      n && n(this.id), e && (this.unmount = e(this.id));
    }
    unmount() {
    }
  }
  const FO = {
    animation: {
      Feature: PO
    },
    exit: {
      Feature: XO
    }
  };
  function Zl(t, e, n, i = {
    passive: true
  }) {
    return t.addEventListener(e, n, i), () => t.removeEventListener(e, n);
  }
  function xo(t) {
    return {
      point: {
        x: t.pageX,
        y: t.pageY
      }
    };
  }
  const qO = (t) => (e) => jp(e) && t(e, xo(e));
  function bl(t, e, n, i) {
    return Zl(t, e, qO(n), i);
  }
  const JT = 1e-4, KO = 1 - JT, QO = 1 + JT, $T = 0.01, ZO = 0 - $T, JO = 0 + $T;
  function Ve(t) {
    return t.max - t.min;
  }
  function $O(t, e, n) {
    return Math.abs(t - e) <= n;
  }
  function uv(t, e, n, i = 0.5) {
    t.origin = i, t.originPoint = Ht(e.min, e.max, t.origin), t.scale = Ve(n) / Ve(e), t.translate = Ht(n.min, n.max, t.origin) - t.originPoint, (t.scale >= KO && t.scale <= QO || isNaN(t.scale)) && (t.scale = 1), (t.translate >= ZO && t.translate <= JO || isNaN(t.translate)) && (t.translate = 0);
  }
  function Sl(t, e, n, i) {
    uv(t.x, e.x, n.x, i ? i.originX : void 0), uv(t.y, e.y, n.y, i ? i.originY : void 0);
  }
  function cv(t, e, n) {
    t.min = n.min + e.min, t.max = t.min + Ve(e);
  }
  function WO(t, e, n) {
    cv(t.x, e.x, n.x), cv(t.y, e.y, n.y);
  }
  function fv(t, e, n) {
    t.min = e.min - n.min, t.max = t.min + Ve(e);
  }
  function Tl(t, e, n) {
    fv(t.x, e.x, n.x), fv(t.y, e.y, n.y);
  }
  function gn(t) {
    return [
      t("x"),
      t("y")
    ];
  }
  const WT = ({ current: t }) => t ? t.ownerDocument.defaultView : null, hv = (t, e) => Math.abs(t - e);
  function IO(t, e) {
    const n = hv(t.x, e.x), i = hv(t.y, e.y);
    return Math.sqrt(n ** 2 + i ** 2);
  }
  class IT {
    constructor(e, n, { transformPagePoint: i, contextWindow: a = window, dragSnapToOrigin: r = false, distanceThreshold: s = 3 } = {}) {
      if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const m = dh(this.lastMoveEventInfo, this.history), y = this.startEvent !== null, T = IO(m.offset, {
          x: 0,
          y: 0
        }) >= this.distanceThreshold;
        if (!y && !T) return;
        const { point: b } = m, { timestamp: x } = ve;
        this.history.push({
          ...b,
          timestamp: x
        });
        const { onStart: v, onMove: g } = this.handlers;
        y || (v && v(this.lastMoveEvent, m), this.startEvent = this.lastMoveEvent), g && g(this.lastMoveEvent, m);
      }, this.handlePointerMove = (m, y) => {
        this.lastMoveEvent = m, this.lastMoveEventInfo = hh(y, this.transformPagePoint), Lt.update(this.updatePoint, true);
      }, this.handlePointerUp = (m, y) => {
        this.end();
        const { onEnd: T, onSessionEnd: b, resumeAnimation: x } = this.handlers;
        if (this.dragSnapToOrigin && x && x(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        const v = dh(m.type === "pointercancel" ? this.lastMoveEventInfo : hh(y, this.transformPagePoint), this.history);
        this.startEvent && T && T(m, v), b && b(m, v);
      }, !jp(e)) return;
      this.dragSnapToOrigin = r, this.handlers = n, this.transformPagePoint = i, this.distanceThreshold = s, this.contextWindow = a || window;
      const l = xo(e), o = hh(l, this.transformPagePoint), { point: c } = o, { timestamp: f } = ve;
      this.history = [
        {
          ...c,
          timestamp: f
        }
      ];
      const { onSessionStart: d } = n;
      d && d(e, dh(o, this.history)), this.removeListeners = bo(bl(this.contextWindow, "pointermove", this.handlePointerMove), bl(this.contextWindow, "pointerup", this.handlePointerUp), bl(this.contextWindow, "pointercancel", this.handlePointerUp));
    }
    updateHandlers(e) {
      this.handlers = e;
    }
    end() {
      this.removeListeners && this.removeListeners(), ma(this.updatePoint);
    }
  }
  function hh(t, e) {
    return e ? {
      point: e(t.point)
    } : t;
  }
  function dv(t, e) {
    return {
      x: t.x - e.x,
      y: t.y - e.y
    };
  }
  function dh({ point: t }, e) {
    return {
      point: t,
      delta: dv(t, tx(e)),
      offset: dv(t, t3(e)),
      velocity: e3(e, 0.1)
    };
  }
  function t3(t) {
    return t[0];
  }
  function tx(t) {
    return t[t.length - 1];
  }
  function e3(t, e) {
    if (t.length < 2) return {
      x: 0,
      y: 0
    };
    let n = t.length - 1, i = null;
    const a = tx(t);
    for (; n >= 0 && (i = t[n], !(a.timestamp - i.timestamp > Wn(e))); ) n--;
    if (!i) return {
      x: 0,
      y: 0
    };
    const r = wn(a.timestamp - i.timestamp);
    if (r === 0) return {
      x: 0,
      y: 0
    };
    const s = {
      x: (a.x - i.x) / r,
      y: (a.y - i.y) / r
    };
    return s.x === 1 / 0 && (s.x = 0), s.y === 1 / 0 && (s.y = 0), s;
  }
  function n3(t, { min: e, max: n }, i) {
    return e !== void 0 && t < e ? t = i ? Ht(e, t, i.min) : Math.max(t, e) : n !== void 0 && t > n && (t = i ? Ht(n, t, i.max) : Math.min(t, n)), t;
  }
  function mv(t, e, n) {
    return {
      min: e !== void 0 ? t.min + e : void 0,
      max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0
    };
  }
  function i3(t, { top: e, left: n, bottom: i, right: a }) {
    return {
      x: mv(t.x, n, a),
      y: mv(t.y, e, i)
    };
  }
  function pv(t, e) {
    let n = e.min - t.min, i = e.max - t.max;
    return e.max - e.min < t.max - t.min && ([n, i] = [
      i,
      n
    ]), {
      min: n,
      max: i
    };
  }
  function a3(t, e) {
    return {
      x: pv(t.x, e.x),
      y: pv(t.y, e.y)
    };
  }
  function r3(t, e) {
    let n = 0.5;
    const i = Ve(t), a = Ve(e);
    return a > i ? n = Xl(e.min, e.max - i, t.min) : i > a && (n = Xl(t.min, t.max - a, e.min)), Ci(0, 1, n);
  }
  function s3(t, e) {
    const n = {};
    return e.min !== void 0 && (n.min = e.min - t.min), e.max !== void 0 && (n.max = e.max - t.min), n;
  }
  const Fd = 0.35;
  function l3(t = Fd) {
    return t === false ? t = 0 : t === true && (t = Fd), {
      x: yv(t, "left", "right"),
      y: yv(t, "top", "bottom")
    };
  }
  function yv(t, e, n) {
    return {
      min: gv(t, e),
      max: gv(t, n)
    };
  }
  function gv(t, e) {
    return typeof t == "number" ? t : t[e] || 0;
  }
  const o3 = /* @__PURE__ */ new WeakMap();
  class u3 {
    constructor(e) {
      this.openDragLock = null, this.isDragging = false, this.currentDirection = null, this.originPoint = {
        x: 0,
        y: 0
      }, this.constraints = false, this.hasMutatedConstraints = false, this.elastic = Jt(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = e;
    }
    start(e, { snapToCursor: n = false, distanceThreshold: i } = {}) {
      const { presenceContext: a } = this.visualElement;
      if (a && a.isPresent === false) return;
      const r = (d) => {
        const { dragSnapToOrigin: m } = this.getProps();
        m ? this.pauseAnimation() : this.stopAnimation(), n && this.snapToCursor(xo(d).point);
      }, s = (d, m) => {
        const { drag: y, dragPropagation: T, onDragStart: b } = this.getProps();
        if (y && !T && (this.openDragLock && this.openDragLock(), this.openDragLock = bR(y), !this.openDragLock)) return;
        this.latestPointerEvent = d, this.latestPanInfo = m, this.isDragging = true, this.currentDirection = null, this.resolveConstraints(), this.visualElement.projection && (this.visualElement.projection.isAnimationBlocked = true, this.visualElement.projection.target = void 0), gn((v) => {
          let g = this.getAxisMotionValue(v).get() || 0;
          if (In.test(g)) {
            const { projection: S } = this.visualElement;
            if (S && S.layout) {
              const A = S.layout.layoutBox[v];
              A && (g = Ve(A) * (parseFloat(g) / 100));
            }
          }
          this.originPoint[v] = g;
        }), b && Lt.postRender(() => b(d, m)), kd(this.visualElement, "transform");
        const { animationState: x } = this.visualElement;
        x && x.setActive("whileDrag", true);
      }, l = (d, m) => {
        this.latestPointerEvent = d, this.latestPanInfo = m;
        const { dragPropagation: y, dragDirectionLock: T, onDirectionLock: b, onDrag: x } = this.getProps();
        if (!y && !this.openDragLock) return;
        const { offset: v } = m;
        if (T && this.currentDirection === null) {
          this.currentDirection = c3(v), this.currentDirection !== null && b && b(this.currentDirection);
          return;
        }
        this.updateAxis("x", m.point, v), this.updateAxis("y", m.point, v), this.visualElement.render(), x && x(d, m);
      }, o = (d, m) => {
        this.latestPointerEvent = d, this.latestPanInfo = m, this.stop(d, m), this.latestPointerEvent = null, this.latestPanInfo = null;
      }, c = () => gn((d) => {
        var _a2;
        return this.getAnimationState(d) === "paused" && ((_a2 = this.getAxisMotionValue(d).animation) == null ? void 0 : _a2.play());
      }), { dragSnapToOrigin: f } = this.getProps();
      this.panSession = new IT(e, {
        onSessionStart: r,
        onStart: s,
        onMove: l,
        onSessionEnd: o,
        resumeAnimation: c
      }, {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: f,
        distanceThreshold: i,
        contextWindow: WT(this.visualElement)
      });
    }
    stop(e, n) {
      const i = e || this.latestPointerEvent, a = n || this.latestPanInfo, r = this.isDragging;
      if (this.cancel(), !r || !a || !i) return;
      const { velocity: s } = a;
      this.startAnimation(s);
      const { onDragEnd: l } = this.getProps();
      l && Lt.postRender(() => l(i, a));
    }
    cancel() {
      this.isDragging = false;
      const { projection: e, animationState: n } = this.visualElement;
      e && (e.isAnimationBlocked = false), this.panSession && this.panSession.end(), this.panSession = void 0;
      const { dragPropagation: i } = this.getProps();
      !i && this.openDragLock && (this.openDragLock(), this.openDragLock = null), n && n.setActive("whileDrag", false);
    }
    updateAxis(e, n, i) {
      const { drag: a } = this.getProps();
      if (!i || !iu(e, a, this.currentDirection)) return;
      const r = this.getAxisMotionValue(e);
      let s = this.originPoint[e] + i[e];
      this.constraints && this.constraints[e] && (s = n3(s, this.constraints[e], this.elastic[e])), r.set(s);
    }
    resolveConstraints() {
      var _a2;
      const { dragConstraints: e, dragElastic: n } = this.getProps(), i = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : (_a2 = this.visualElement.projection) == null ? void 0 : _a2.layout, a = this.constraints;
      e && Lr(e) ? this.constraints || (this.constraints = this.resolveRefConstraints()) : e && i ? this.constraints = i3(i.layoutBox, e) : this.constraints = false, this.elastic = l3(n), a !== this.constraints && i && this.constraints && !this.hasMutatedConstraints && gn((r) => {
        this.constraints !== false && this.getAxisMotionValue(r) && (this.constraints[r] = s3(i.layoutBox[r], this.constraints[r]));
      });
    }
    resolveRefConstraints() {
      const { dragConstraints: e, onMeasureDragConstraints: n } = this.getProps();
      if (!e || !Lr(e)) return false;
      const i = e.current, { projection: a } = this.visualElement;
      if (!a || !a.layout) return false;
      const r = fO(i, a.root, this.visualElement.getTransformPagePoint());
      let s = a3(a.layout.layoutBox, r);
      if (n) {
        const l = n(oO(s));
        this.hasMutatedConstraints = !!l, l && (s = jT(l));
      }
      return s;
    }
    startAnimation(e) {
      const { drag: n, dragMomentum: i, dragElastic: a, dragTransition: r, dragSnapToOrigin: s, onDragTransitionEnd: l } = this.getProps(), o = this.constraints || {}, c = gn((f) => {
        if (!iu(f, n, this.currentDirection)) return;
        let d = o && o[f] || {};
        s && (d = {
          min: 0,
          max: 0
        });
        const m = a ? 200 : 1e6, y = a ? 40 : 1e7, T = {
          type: "inertia",
          velocity: i ? e[f] : 0,
          bounceStiffness: m,
          bounceDamping: y,
          timeConstant: 750,
          restDelta: 1,
          restSpeed: 10,
          ...r,
          ...d
        };
        return this.startAxisValueAnimation(f, T);
      });
      return Promise.all(c).then(l);
    }
    startAxisValueAnimation(e, n) {
      const i = this.getAxisMotionValue(e);
      return kd(this.visualElement, e), i.start(qp(e, i, 0, n, this.visualElement, false));
    }
    stopAnimation() {
      gn((e) => this.getAxisMotionValue(e).stop());
    }
    pauseAnimation() {
      gn((e) => {
        var _a2;
        return (_a2 = this.getAxisMotionValue(e).animation) == null ? void 0 : _a2.pause();
      });
    }
    getAnimationState(e) {
      var _a2;
      return (_a2 = this.getAxisMotionValue(e).animation) == null ? void 0 : _a2.state;
    }
    getAxisMotionValue(e) {
      const n = `_drag${e.toUpperCase()}`, i = this.visualElement.getProps(), a = i[n];
      return a || this.visualElement.getValue(e, (i.initial ? i.initial[e] : void 0) || 0);
    }
    snapToCursor(e) {
      gn((n) => {
        const { drag: i } = this.getProps();
        if (!iu(n, i, this.currentDirection)) return;
        const { projection: a } = this.visualElement, r = this.getAxisMotionValue(n);
        if (a && a.layout) {
          const { min: s, max: l } = a.layout.layoutBox[n];
          r.set(e[n] - Ht(s, l, 0.5));
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      const { drag: e, dragConstraints: n } = this.getProps(), { projection: i } = this.visualElement;
      if (!Lr(n) || !i || !this.constraints) return;
      this.stopAnimation();
      const a = {
        x: 0,
        y: 0
      };
      gn((s) => {
        const l = this.getAxisMotionValue(s);
        if (l && this.constraints !== false) {
          const o = l.get();
          a[s] = r3({
            min: o,
            max: o
          }, this.constraints[s]);
        }
      });
      const { transformTemplate: r } = this.visualElement.getProps();
      this.visualElement.current.style.transform = r ? r({}, "") : "none", i.root && i.root.updateScroll(), i.updateLayout(), this.resolveConstraints(), gn((s) => {
        if (!iu(s, e, null)) return;
        const l = this.getAxisMotionValue(s), { min: o, max: c } = this.constraints[s];
        l.set(Ht(o, c, a[s]));
      });
    }
    addListeners() {
      if (!this.visualElement.current) return;
      o3.set(this.visualElement, this);
      const e = this.visualElement.current, n = bl(e, "pointerdown", (o) => {
        const { drag: c, dragListener: f = true } = this.getProps();
        c && f && this.start(o);
      }), i = () => {
        const { dragConstraints: o } = this.getProps();
        Lr(o) && o.current && (this.constraints = this.resolveRefConstraints());
      }, { projection: a } = this.visualElement, r = a.addEventListener("measure", i);
      a && !a.layout && (a.root && a.root.updateScroll(), a.updateLayout()), Lt.read(i);
      const s = Zl(window, "resize", () => this.scalePositionWithinConstraints()), l = a.addEventListener("didUpdate", ({ delta: o, hasLayoutChanged: c }) => {
        this.isDragging && c && (gn((f) => {
          const d = this.getAxisMotionValue(f);
          d && (this.originPoint[f] += o[f].translate, d.set(d.get() + o[f].translate));
        }), this.visualElement.render());
      });
      return () => {
        s(), n(), r(), l && l();
      };
    }
    getProps() {
      const e = this.visualElement.getProps(), { drag: n = false, dragDirectionLock: i = false, dragPropagation: a = false, dragConstraints: r = false, dragElastic: s = Fd, dragMomentum: l = true } = e;
      return {
        ...e,
        drag: n,
        dragDirectionLock: i,
        dragPropagation: a,
        dragConstraints: r,
        dragElastic: s,
        dragMomentum: l
      };
    }
  }
  function iu(t, e, n) {
    return (e === true || e === t) && (n === null || n === t);
  }
  function c3(t, e = 10) {
    let n = null;
    return Math.abs(t.y) > e ? n = "y" : Math.abs(t.x) > e && (n = "x"), n;
  }
  class f3 extends ba {
    constructor(e) {
      super(e), this.removeGroupControls = zn, this.removeListeners = zn, this.controls = new u3(e);
    }
    mount() {
      const { dragControls: e } = this.node.getProps();
      e && (this.removeGroupControls = e.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || zn;
    }
    unmount() {
      this.removeGroupControls(), this.removeListeners();
    }
  }
  const vv = (t) => (e, n) => {
    t && Lt.postRender(() => t(e, n));
  };
  class h3 extends ba {
    constructor() {
      super(...arguments), this.removePointerDownListener = zn;
    }
    onPointerDown(e) {
      this.session = new IT(e, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: WT(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart: e, onPanStart: n, onPan: i, onPanEnd: a } = this.node.getProps();
      return {
        onSessionStart: vv(e),
        onStart: vv(n),
        onMove: i,
        onEnd: (r, s) => {
          delete this.session, a && Lt.postRender(() => a(r, s));
        }
      };
    }
    mount() {
      this.removePointerDownListener = bl(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener(), this.session && this.session.end();
    }
  }
  const Cu = {
    hasAnimatedSinceResize: true,
    hasEverUpdated: false
  };
  function _v(t, e) {
    return e.max === e.min ? 0 : t / (e.max - e.min) * 100;
  }
  const Qs = {
    correct: (t, e) => {
      if (!e.target) return t;
      if (typeof t == "string") if (tt.test(t)) t = parseFloat(t);
      else return t;
      const n = _v(t, e.target.x), i = _v(t, e.target.y);
      return `${n}% ${i}%`;
    }
  }, d3 = {
    correct: (t, { treeScale: e, projectionDelta: n }) => {
      const i = t, a = pa.parse(t);
      if (a.length > 5) return i;
      const r = pa.createTransformer(t), s = typeof a[0] != "number" ? 1 : 0, l = n.x.scale * e.x, o = n.y.scale * e.y;
      a[0 + s] /= l, a[1 + s] /= o;
      const c = Ht(l, o, 0.5);
      return typeof a[2 + s] == "number" && (a[2 + s] /= c), typeof a[3 + s] == "number" && (a[3 + s] /= c), r(a);
    }
  };
  let mh = false;
  class m3 extends D.Component {
    componentDidMount() {
      const { visualElement: e, layoutGroup: n, switchLayoutGroup: i, layoutId: a } = this.props, { projection: r } = e;
      NR(p3), r && (n.group && n.group.add(r), i && i.register && a && i.register(r), mh && r.root.didUpdate(), r.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }), r.setOptions({
        ...r.options,
        onExitComplete: () => this.safeToRemove()
      })), Cu.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(e) {
      const { layoutDependency: n, visualElement: i, drag: a, isPresent: r } = this.props, { projection: s } = i;
      return s && (s.isPresent = r, mh = true, a || e.layoutDependency !== n || n === void 0 || e.isPresent !== r ? s.willUpdate() : this.safeToRemove(), e.isPresent !== r && (r ? s.promote() : s.relegate() || Lt.postRender(() => {
        const l = s.getStack();
        (!l || !l.members.length) && this.safeToRemove();
      }))), null;
    }
    componentDidUpdate() {
      const { projection: e } = this.props.visualElement;
      e && (e.root.didUpdate(), Np.postRender(() => {
        !e.currentAnimation && e.isLead() && this.safeToRemove();
      }));
    }
    componentWillUnmount() {
      const { visualElement: e, layoutGroup: n, switchLayoutGroup: i } = this.props, { projection: a } = e;
      mh = true, a && (a.scheduleCheckAfterUnmount(), n && n.group && n.group.remove(a), i && i.deregister && i.deregister(a));
    }
    safeToRemove() {
      const { safeToRemove: e } = this.props;
      e && e();
    }
    render() {
      return null;
    }
  }
  function ex(t) {
    const [e, n] = DR(), i = D.useContext(US);
    return J.jsx(m3, {
      ...t,
      layoutGroup: i,
      switchLayoutGroup: D.useContext(LT),
      isPresent: e,
      safeToRemove: n
    });
  }
  const p3 = {
    borderRadius: {
      ...Qs,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: Qs,
    borderTopRightRadius: Qs,
    borderBottomLeftRadius: Qs,
    borderBottomRightRadius: Qs,
    boxShadow: d3
  };
  function y3(t, e, n) {
    const i = Ce(t) ? t : us(t);
    return i.start(qp("", i, e, n)), i.animation;
  }
  const g3 = (t, e) => t.depth - e.depth;
  class v3 {
    constructor() {
      this.children = [], this.isDirty = false;
    }
    add(e) {
      gp(this.children, e), this.isDirty = true;
    }
    remove(e) {
      vp(this.children, e), this.isDirty = true;
    }
    forEach(e) {
      this.isDirty && this.children.sort(g3), this.isDirty = false, this.children.forEach(e);
    }
  }
  function _3(t, e) {
    const n = Pe.now(), i = ({ timestamp: a }) => {
      const r = a - n;
      r >= e && (ma(i), t(r - e));
    };
    return Lt.setup(i, true), () => ma(i);
  }
  const nx = [
    "TopLeft",
    "TopRight",
    "BottomLeft",
    "BottomRight"
  ], b3 = nx.length, bv = (t) => typeof t == "string" ? parseFloat(t) : t, Sv = (t) => typeof t == "number" || tt.test(t);
  function S3(t, e, n, i, a, r) {
    a ? (t.opacity = Ht(0, n.opacity ?? 1, T3(i)), t.opacityExit = Ht(e.opacity ?? 1, 0, x3(i))) : r && (t.opacity = Ht(e.opacity ?? 1, n.opacity ?? 1, i));
    for (let s = 0; s < b3; s++) {
      const l = `border${nx[s]}Radius`;
      let o = Tv(e, l), c = Tv(n, l);
      if (o === void 0 && c === void 0) continue;
      o || (o = 0), c || (c = 0), o === 0 || c === 0 || Sv(o) === Sv(c) ? (t[l] = Math.max(Ht(bv(o), bv(c), i), 0), (In.test(c) || In.test(o)) && (t[l] += "%")) : t[l] = c;
    }
    (e.rotate || n.rotate) && (t.rotate = Ht(e.rotate || 0, n.rotate || 0, i));
  }
  function Tv(t, e) {
    return t[e] !== void 0 ? t[e] : t.borderRadius;
  }
  const T3 = ix(0, 0.5, XS), x3 = ix(0.5, 0.95, zn);
  function ix(t, e, n) {
    return (i) => i < t ? 0 : i > e ? 1 : n(Xl(t, e, i));
  }
  function xv(t, e) {
    t.min = e.min, t.max = e.max;
  }
  function yn(t, e) {
    xv(t.x, e.x), xv(t.y, e.y);
  }
  function Av(t, e) {
    t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin;
  }
  function Ev(t, e, n, i, a) {
    return t -= e, t = dc(t, 1 / n, i), a !== void 0 && (t = dc(t, 1 / a, i)), t;
  }
  function A3(t, e = 0, n = 1, i = 0.5, a, r = t, s = t) {
    if (In.test(e) && (e = parseFloat(e), e = Ht(s.min, s.max, e / 100) - s.min), typeof e != "number") return;
    let l = Ht(r.min, r.max, i);
    t === r && (l -= e), t.min = Ev(t.min, e, n, l, a), t.max = Ev(t.max, e, n, l, a);
  }
  function wv(t, e, [n, i, a], r, s) {
    A3(t, e[n], e[i], e[a], e.scale, r, s);
  }
  const E3 = [
    "x",
    "scaleX",
    "originX"
  ], w3 = [
    "y",
    "scaleY",
    "originY"
  ];
  function Mv(t, e, n, i) {
    wv(t.x, e, E3, n ? n.x : void 0, i ? i.x : void 0), wv(t.y, e, w3, n ? n.y : void 0, i ? i.y : void 0);
  }
  function Cv(t) {
    return t.translate === 0 && t.scale === 1;
  }
  function ax(t) {
    return Cv(t.x) && Cv(t.y);
  }
  function Dv(t, e) {
    return t.min === e.min && t.max === e.max;
  }
  function M3(t, e) {
    return Dv(t.x, e.x) && Dv(t.y, e.y);
  }
  function Rv(t, e) {
    return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max);
  }
  function rx(t, e) {
    return Rv(t.x, e.x) && Rv(t.y, e.y);
  }
  function Ov(t) {
    return Ve(t.x) / Ve(t.y);
  }
  function zv(t, e) {
    return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint;
  }
  class C3 {
    constructor() {
      this.members = [];
    }
    add(e) {
      gp(this.members, e), e.scheduleRender();
    }
    remove(e) {
      if (vp(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead) {
        const n = this.members[this.members.length - 1];
        n && this.promote(n);
      }
    }
    relegate(e) {
      const n = this.members.findIndex((a) => e === a);
      if (n === 0) return false;
      let i;
      for (let a = n; a >= 0; a--) {
        const r = this.members[a];
        if (r.isPresent !== false) {
          i = r;
          break;
        }
      }
      return i ? (this.promote(i), true) : false;
    }
    promote(e, n) {
      const i = this.lead;
      if (e !== i && (this.prevLead = i, this.lead = e, e.show(), i)) {
        i.instance && i.scheduleRender(), e.scheduleRender(), e.resumeFrom = i, n && (e.resumeFrom.preserveOpacity = true), i.snapshot && (e.snapshot = i.snapshot, e.snapshot.latestValues = i.animationValues || i.latestValues), e.root && e.root.isUpdating && (e.isLayoutDirty = true);
        const { crossfade: a } = e.options;
        a === false && i.hide();
      }
    }
    exitAnimationComplete() {
      this.members.forEach((e) => {
        const { options: n, resumingFrom: i } = e;
        n.onExitComplete && n.onExitComplete(), i && i.options.onExitComplete && i.options.onExitComplete();
      });
    }
    scheduleRender() {
      this.members.forEach((e) => {
        e.instance && e.scheduleRender(false);
      });
    }
    removeLeadSnapshot() {
      this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
    }
  }
  function D3(t, e, n) {
    let i = "";
    const a = t.x.translate / e.x, r = t.y.translate / e.y, s = (n == null ? void 0 : n.z) || 0;
    if ((a || r || s) && (i = `translate3d(${a}px, ${r}px, ${s}px) `), (e.x !== 1 || e.y !== 1) && (i += `scale(${1 / e.x}, ${1 / e.y}) `), n) {
      const { transformPerspective: c, rotate: f, rotateX: d, rotateY: m, skewX: y, skewY: T } = n;
      c && (i = `perspective(${c}px) ${i}`), f && (i += `rotate(${f}deg) `), d && (i += `rotateX(${d}deg) `), m && (i += `rotateY(${m}deg) `), y && (i += `skewX(${y}deg) `), T && (i += `skewY(${T}deg) `);
    }
    const l = t.x.scale * e.x, o = t.y.scale * e.y;
    return (l !== 1 || o !== 1) && (i += `scale(${l}, ${o})`), i || "none";
  }
  const ph = [
    "",
    "X",
    "Y",
    "Z"
  ], R3 = 1e3;
  let O3 = 0;
  function yh(t, e, n, i) {
    const { latestValues: a } = e;
    a[t] && (n[t] = a[t], e.setStaticValue(t, 0), i && (i[t] = 0));
  }
  function sx(t) {
    if (t.hasCheckedOptimisedAppear = true, t.root === t) return;
    const { visualElement: e } = t.options;
    if (!e) return;
    const n = FT(e);
    if (window.MotionHasOptimisedAnimation(n, "transform")) {
      const { layout: a, layoutId: r } = t.options;
      window.MotionCancelOptimisedAnimation(n, "transform", Lt, !(a || r));
    }
    const { parent: i } = t;
    i && !i.hasCheckedOptimisedAppear && sx(i);
  }
  function lx({ attachResizeListener: t, defaultParent: e, measureScroll: n, checkIsScrollRoot: i, resetTransform: a }) {
    return class {
      constructor(s = {}, l = e == null ? void 0 : e()) {
        this.id = O3++, this.animationId = 0, this.animationCommitId = 0, this.children = /* @__PURE__ */ new Set(), this.options = {}, this.isTreeAnimating = false, this.isAnimationBlocked = false, this.isLayoutDirty = false, this.isProjectionDirty = false, this.isSharedProjectionDirty = false, this.isTransformDirty = false, this.updateManuallyBlocked = false, this.updateBlockedByResize = false, this.isUpdating = false, this.isSVG = false, this.needsReset = false, this.shouldResetTransform = false, this.hasCheckedOptimisedAppear = false, this.treeScale = {
          x: 1,
          y: 1
        }, this.eventHandlers = /* @__PURE__ */ new Map(), this.hasTreeAnimated = false, this.updateScheduled = false, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = false, this.checkUpdateFailed = () => {
          this.isUpdating && (this.isUpdating = false, this.clearAllSnapshots());
        }, this.updateProjection = () => {
          this.projectionUpdateScheduled = false, this.nodes.forEach(V3), this.nodes.forEach(B3), this.nodes.forEach(H3), this.nodes.forEach(L3);
        }, this.resolvedRelativeTargetAt = 0, this.hasProjected = false, this.isVisible = true, this.animationProgress = 0, this.sharedNodes = /* @__PURE__ */ new Map(), this.latestValues = s, this.root = l ? l.root || l : this, this.path = l ? [
          ...l.path,
          l
        ] : [], this.parent = l, this.depth = l ? l.depth + 1 : 0;
        for (let o = 0; o < this.path.length; o++) this.path[o].shouldResetTransform = true;
        this.root === this && (this.nodes = new v3());
      }
      addEventListener(s, l) {
        return this.eventHandlers.has(s) || this.eventHandlers.set(s, new Sp()), this.eventHandlers.get(s).add(l);
      }
      notifyListeners(s, ...l) {
        const o = this.eventHandlers.get(s);
        o && o.notify(...l);
      }
      hasListeners(s) {
        return this.eventHandlers.has(s);
      }
      mount(s) {
        if (this.instance) return;
        this.isSVG = TT(s) && !wR(s), this.instance = s;
        const { layoutId: l, layout: o, visualElement: c } = this.options;
        if (c && !c.current && c.mount(s), this.root.nodes.add(this), this.parent && this.parent.children.add(this), this.root.hasTreeAnimated && (o || l) && (this.isLayoutDirty = true), t) {
          let f, d = 0;
          const m = () => this.root.updateBlockedByResize = false;
          Lt.read(() => {
            d = window.innerWidth;
          }), t(s, () => {
            const y = window.innerWidth;
            y !== d && (d = y, this.root.updateBlockedByResize = true, f && f(), f = _3(m, 250), Cu.hasAnimatedSinceResize && (Cu.hasAnimatedSinceResize = false, this.nodes.forEach(Lv)));
          });
        }
        l && this.root.registerSharedNode(l, this), this.options.animate !== false && c && (l || o) && this.addEventListener("didUpdate", ({ delta: f, hasLayoutChanged: d, hasRelativeLayoutChanged: m, layout: y }) => {
          if (this.isTreeAnimationBlocked()) {
            this.target = void 0, this.relativeTarget = void 0;
            return;
          }
          const T = this.options.transition || c.getDefaultTransition() || X3, { onLayoutAnimationStart: b, onLayoutAnimationComplete: x } = c.getProps(), v = !this.targetLayout || !rx(this.targetLayout, y), g = !d && m;
          if (this.options.layoutRoot || this.resumeFrom || g || d && (v || !this.currentAnimation)) {
            this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
            const S = {
              ...Vp(T, "layout"),
              onPlay: b,
              onComplete: x
            };
            (c.shouldReduceMotion || this.options.layoutRoot) && (S.delay = 0, S.type = false), this.startAnimation(S), this.setAnimationOrigin(f, g);
          } else d || Lv(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
          this.targetLayout = y;
        });
      }
      unmount() {
        this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
        const s = this.getStack();
        s && s.remove(this), this.parent && this.parent.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), ma(this.updateProjection);
      }
      blockUpdate() {
        this.updateManuallyBlocked = true;
      }
      unblockUpdate() {
        this.updateManuallyBlocked = false;
      }
      isUpdateBlocked() {
        return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
        return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
      }
      startUpdate() {
        this.isUpdateBlocked() || (this.isUpdating = true, this.nodes && this.nodes.forEach(Y3), this.animationId++);
      }
      getTransformTemplate() {
        const { visualElement: s } = this.options;
        return s && s.getProps().transformTemplate;
      }
      willUpdate(s = true) {
        if (this.root.hasTreeAnimated = true, this.root.isUpdateBlocked()) {
          this.options.onExitComplete && this.options.onExitComplete();
          return;
        }
        if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && sx(this), !this.root.isUpdating && this.root.startUpdate(), this.isLayoutDirty) return;
        this.isLayoutDirty = true;
        for (let f = 0; f < this.path.length; f++) {
          const d = this.path[f];
          d.shouldResetTransform = true, d.updateScroll("snapshot"), d.options.layoutRoot && d.willUpdate(false);
        }
        const { layoutId: l, layout: o } = this.options;
        if (l === void 0 && !o) return;
        const c = this.getTransformTemplate();
        this.prevTransformTemplateValue = c ? c(this.latestValues, "") : void 0, this.updateSnapshot(), s && this.notifyListeners("willUpdate");
      }
      update() {
        if (this.updateScheduled = false, this.isUpdateBlocked()) {
          this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(Uv);
          return;
        }
        if (this.animationId <= this.animationCommitId) {
          this.nodes.forEach(Vv);
          return;
        }
        this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = false, this.nodes.forEach(j3), this.nodes.forEach(z3), this.nodes.forEach(U3)) : this.nodes.forEach(Vv), this.clearAllSnapshots();
        const l = Pe.now();
        ve.delta = Ci(0, 1e3 / 60, l - ve.timestamp), ve.timestamp = l, ve.isProcessing = true, ah.update.process(ve), ah.preRender.process(ve), ah.render.process(ve), ve.isProcessing = false;
      }
      didUpdate() {
        this.updateScheduled || (this.updateScheduled = true, Np.read(this.scheduleUpdate));
      }
      clearAllSnapshots() {
        this.nodes.forEach(N3), this.sharedNodes.forEach(G3);
      }
      scheduleUpdateProjection() {
        this.projectionUpdateScheduled || (this.projectionUpdateScheduled = true, Lt.preRender(this.updateProjection, false, true));
      }
      scheduleCheckAfterUnmount() {
        Lt.postRender(() => {
          this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
        });
      }
      updateSnapshot() {
        this.snapshot || !this.instance || (this.snapshot = this.measure(), this.snapshot && !Ve(this.snapshot.measuredBox.x) && !Ve(this.snapshot.measuredBox.y) && (this.snapshot = void 0));
      }
      updateLayout() {
        if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
        if (this.resumeFrom && !this.resumeFrom.instance) for (let o = 0; o < this.path.length; o++) this.path[o].updateScroll();
        const s = this.layout;
        this.layout = this.measure(false), this.layoutCorrected = Jt(), this.isLayoutDirty = false, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
        const { visualElement: l } = this.options;
        l && l.notify("LayoutMeasure", this.layout.layoutBox, s ? s.layoutBox : void 0);
      }
      updateScroll(s = "measure") {
        let l = !!(this.options.layoutScroll && this.instance);
        if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === s && (l = false), l && this.instance) {
          const o = i(this.instance);
          this.scroll = {
            animationId: this.root.animationId,
            phase: s,
            isRoot: o,
            offset: n(this.instance),
            wasRoot: this.scroll ? this.scroll.isRoot : o
          };
        }
      }
      resetTransform() {
        if (!a) return;
        const s = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout, l = this.projectionDelta && !ax(this.projectionDelta), o = this.getTransformTemplate(), c = o ? o(this.latestValues, "") : void 0, f = c !== this.prevTransformTemplateValue;
        s && this.instance && (l || Na(this.latestValues) || f) && (a(this.instance, c), this.shouldResetTransform = false, this.scheduleRender());
      }
      measure(s = true) {
        const l = this.measurePageBox();
        let o = this.removeElementScroll(l);
        return s && (o = this.removeTransform(o)), F3(o), {
          animationId: this.root.animationId,
          measuredBox: l,
          layoutBox: o,
          latestValues: {},
          source: this.id
        };
      }
      measurePageBox() {
        var _a2;
        const { visualElement: s } = this.options;
        if (!s) return Jt();
        const l = s.measureViewportBox();
        if (!(((_a2 = this.scroll) == null ? void 0 : _a2.wasRoot) || this.path.some(q3))) {
          const { scroll: c } = this.root;
          c && (Nr(l.x, c.offset.x), Nr(l.y, c.offset.y));
        }
        return l;
      }
      removeElementScroll(s) {
        var _a2;
        const l = Jt();
        if (yn(l, s), (_a2 = this.scroll) == null ? void 0 : _a2.wasRoot) return l;
        for (let o = 0; o < this.path.length; o++) {
          const c = this.path[o], { scroll: f, options: d } = c;
          c !== this.root && f && d.layoutScroll && (f.wasRoot && yn(l, s), Nr(l.x, f.offset.x), Nr(l.y, f.offset.y));
        }
        return l;
      }
      applyTransform(s, l = false) {
        const o = Jt();
        yn(o, s);
        for (let c = 0; c < this.path.length; c++) {
          const f = this.path[c];
          !l && f.options.layoutScroll && f.scroll && f !== f.root && jr(o, {
            x: -f.scroll.offset.x,
            y: -f.scroll.offset.y
          }), Na(f.latestValues) && jr(o, f.latestValues);
        }
        return Na(this.latestValues) && jr(o, this.latestValues), o;
      }
      removeTransform(s) {
        const l = Jt();
        yn(l, s);
        for (let o = 0; o < this.path.length; o++) {
          const c = this.path[o];
          if (!c.instance || !Na(c.latestValues)) continue;
          Hd(c.latestValues) && c.updateSnapshot();
          const f = Jt(), d = c.measurePageBox();
          yn(f, d), Mv(l, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, f);
        }
        return Na(this.latestValues) && Mv(l, this.latestValues), l;
      }
      setTargetDelta(s) {
        this.targetDelta = s, this.root.scheduleUpdateProjection(), this.isProjectionDirty = true;
      }
      setOptions(s) {
        this.options = {
          ...this.options,
          ...s,
          crossfade: s.crossfade !== void 0 ? s.crossfade : true
        };
      }
      clearMeasurements() {
        this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = false;
      }
      forceRelativeParentToResolveTarget() {
        this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== ve.timestamp && this.relativeParent.resolveTargetDelta(true);
      }
      resolveTargetDelta(s = false) {
        var _a2;
        const l = this.getLead();
        this.isProjectionDirty || (this.isProjectionDirty = l.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = l.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = l.isSharedProjectionDirty);
        const o = !!this.resumingFrom || this !== l;
        if (!(s || o && this.isSharedProjectionDirty || this.isProjectionDirty || ((_a2 = this.parent) == null ? void 0 : _a2.isProjectionDirty) || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
        const { layout: f, layoutId: d } = this.options;
        if (!(!this.layout || !(f || d))) {
          if (this.resolvedRelativeTargetAt = ve.timestamp, !this.targetDelta && !this.relativeTarget) {
            const m = this.getClosestProjectingParent();
            m && m.layout && this.animationProgress !== 1 ? (this.relativeParent = m, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Jt(), this.relativeTargetOrigin = Jt(), Tl(this.relativeTargetOrigin, this.layout.layoutBox, m.layout.layoutBox), yn(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
          if (!(!this.relativeTarget && !this.targetDelta) && (this.target || (this.target = Jt(), this.targetWithTransforms = Jt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target ? (this.forceRelativeParentToResolveTarget(), WO(this.target, this.relativeTarget, this.relativeParent.target)) : this.targetDelta ? (this.resumingFrom ? this.target = this.applyTransform(this.layout.layoutBox) : yn(this.target, this.layout.layoutBox), HT(this.target, this.targetDelta)) : yn(this.target, this.layout.layoutBox), this.attemptToResolveRelativeTarget)) {
            this.attemptToResolveRelativeTarget = false;
            const m = this.getClosestProjectingParent();
            m && !!m.resumingFrom == !!this.resumingFrom && !m.options.layoutScroll && m.target && this.animationProgress !== 1 ? (this.relativeParent = m, this.forceRelativeParentToResolveTarget(), this.relativeTarget = Jt(), this.relativeTargetOrigin = Jt(), Tl(this.relativeTargetOrigin, this.target, m.target), yn(this.relativeTarget, this.relativeTargetOrigin)) : this.relativeParent = this.relativeTarget = void 0;
          }
        }
      }
      getClosestProjectingParent() {
        if (!(!this.parent || Hd(this.parent.latestValues) || BT(this.parent.latestValues))) return this.parent.isProjecting() ? this.parent : this.parent.getClosestProjectingParent();
      }
      isProjecting() {
        return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      calcProjection() {
        var _a2;
        const s = this.getLead(), l = !!this.resumingFrom || this !== s;
        let o = true;
        if ((this.isProjectionDirty || ((_a2 = this.parent) == null ? void 0 : _a2.isProjectionDirty)) && (o = false), l && (this.isSharedProjectionDirty || this.isTransformDirty) && (o = false), this.resolvedRelativeTargetAt === ve.timestamp && (o = false), o) return;
        const { layout: c, layoutId: f } = this.options;
        if (this.isTreeAnimating = !!(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(c || f)) return;
        yn(this.layoutCorrected, this.layout.layoutBox);
        const d = this.treeScale.x, m = this.treeScale.y;
        cO(this.layoutCorrected, this.treeScale, this.path, l), s.layout && !s.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1) && (s.target = s.layout.layoutBox, s.targetWithTransforms = Jt());
        const { target: y } = s;
        if (!y) {
          this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
          return;
        }
        !this.projectionDelta || !this.prevProjectionDelta ? this.createProjectionDeltas() : (Av(this.prevProjectionDelta.x, this.projectionDelta.x), Av(this.prevProjectionDelta.y, this.projectionDelta.y)), Sl(this.projectionDelta, this.layoutCorrected, y, this.latestValues), (this.treeScale.x !== d || this.treeScale.y !== m || !zv(this.projectionDelta.x, this.prevProjectionDelta.x) || !zv(this.projectionDelta.y, this.prevProjectionDelta.y)) && (this.hasProjected = true, this.scheduleRender(), this.notifyListeners("projectionUpdate", y));
      }
      hide() {
        this.isVisible = false;
      }
      show() {
        this.isVisible = true;
      }
      scheduleRender(s = true) {
        var _a2;
        if ((_a2 = this.options.visualElement) == null ? void 0 : _a2.scheduleRender(), s) {
          const l = this.getStack();
          l && l.scheduleRender();
        }
        this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
      }
      createProjectionDeltas() {
        this.prevProjectionDelta = Br(), this.projectionDelta = Br(), this.projectionDeltaWithTransform = Br();
      }
      setAnimationOrigin(s, l = false) {
        const o = this.snapshot, c = o ? o.latestValues : {}, f = {
          ...this.latestValues
        }, d = Br();
        (!this.relativeParent || !this.relativeParent.options.layoutRoot) && (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !l;
        const m = Jt(), y = o ? o.source : void 0, T = this.layout ? this.layout.source : void 0, b = y !== T, x = this.getStack(), v = !x || x.members.length <= 1, g = !!(b && !v && this.options.crossfade === true && !this.path.some(k3));
        this.animationProgress = 0;
        let S;
        this.mixTargetDelta = (A) => {
          const w = A / 1e3;
          Nv(d.x, s.x, w), Nv(d.y, s.y, w), this.setTargetDelta(d), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout && (Tl(m, this.layout.layoutBox, this.relativeParent.layout.layoutBox), P3(this.relativeTarget, this.relativeTargetOrigin, m, w), S && M3(this.relativeTarget, S) && (this.isProjectionDirty = false), S || (S = Jt()), yn(S, this.relativeTarget)), b && (this.animationValues = f, S3(f, c, this.latestValues, w, g, v)), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = w;
        }, this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(s) {
        var _a2, _b2, _c2;
        this.notifyListeners("animationStart"), (_a2 = this.currentAnimation) == null ? void 0 : _a2.stop(), (_c2 = (_b2 = this.resumingFrom) == null ? void 0 : _b2.currentAnimation) == null ? void 0 : _c2.stop(), this.pendingAnimation && (ma(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = Lt.update(() => {
          Cu.hasAnimatedSinceResize = true, this.motionValue || (this.motionValue = us(0)), this.currentAnimation = y3(this.motionValue, [
            0,
            1e3
          ], {
            ...s,
            velocity: 0,
            isSync: true,
            onUpdate: (l) => {
              this.mixTargetDelta(l), s.onUpdate && s.onUpdate(l);
            },
            onStop: () => {
            },
            onComplete: () => {
              s.onComplete && s.onComplete(), this.completeAnimation();
            }
          }), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0;
        });
      }
      completeAnimation() {
        this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
        const s = this.getStack();
        s && s.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete");
      }
      finishAnimation() {
        this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(R3), this.currentAnimation.stop()), this.completeAnimation();
      }
      applyTransformsToTarget() {
        const s = this.getLead();
        let { targetWithTransforms: l, target: o, layout: c, latestValues: f } = s;
        if (!(!l || !o || !c)) {
          if (this !== s && this.layout && c && ox(this.options.animationType, this.layout.layoutBox, c.layoutBox)) {
            o = this.target || Jt();
            const d = Ve(this.layout.layoutBox.x);
            o.x.min = s.target.x.min, o.x.max = o.x.min + d;
            const m = Ve(this.layout.layoutBox.y);
            o.y.min = s.target.y.min, o.y.max = o.y.min + m;
          }
          yn(l, o), jr(l, f), Sl(this.projectionDeltaWithTransform, this.layoutCorrected, l, f);
        }
      }
      registerSharedNode(s, l) {
        this.sharedNodes.has(s) || this.sharedNodes.set(s, new C3()), this.sharedNodes.get(s).add(l);
        const c = l.options.initialPromotionConfig;
        l.promote({
          transition: c ? c.transition : void 0,
          preserveFollowOpacity: c && c.shouldPreserveFollowOpacity ? c.shouldPreserveFollowOpacity(l) : void 0
        });
      }
      isLead() {
        const s = this.getStack();
        return s ? s.lead === this : true;
      }
      getLead() {
        var _a2;
        const { layoutId: s } = this.options;
        return s ? ((_a2 = this.getStack()) == null ? void 0 : _a2.lead) || this : this;
      }
      getPrevLead() {
        var _a2;
        const { layoutId: s } = this.options;
        return s ? (_a2 = this.getStack()) == null ? void 0 : _a2.prevLead : void 0;
      }
      getStack() {
        const { layoutId: s } = this.options;
        if (s) return this.root.sharedNodes.get(s);
      }
      promote({ needsReset: s, transition: l, preserveFollowOpacity: o } = {}) {
        const c = this.getStack();
        c && c.promote(this, o), s && (this.projectionDelta = void 0, this.needsReset = true), l && this.setOptions({
          transition: l
        });
      }
      relegate() {
        const s = this.getStack();
        return s ? s.relegate(this) : false;
      }
      resetSkewAndRotation() {
        const { visualElement: s } = this.options;
        if (!s) return;
        let l = false;
        const { latestValues: o } = s;
        if ((o.z || o.rotate || o.rotateX || o.rotateY || o.rotateZ || o.skewX || o.skewY) && (l = true), !l) return;
        const c = {};
        o.z && yh("z", s, c, this.animationValues);
        for (let f = 0; f < ph.length; f++) yh(`rotate${ph[f]}`, s, c, this.animationValues), yh(`skew${ph[f]}`, s, c, this.animationValues);
        s.render();
        for (const f in c) s.setStaticValue(f, c[f]), this.animationValues && (this.animationValues[f] = c[f]);
        s.scheduleRender();
      }
      applyProjectionStyles(s, l) {
        if (!this.instance || this.isSVG) return;
        if (!this.isVisible) {
          s.visibility = "hidden";
          return;
        }
        const o = this.getTransformTemplate();
        if (this.needsReset) {
          this.needsReset = false, s.visibility = "", s.opacity = "", s.pointerEvents = Mu(l == null ? void 0 : l.pointerEvents) || "", s.transform = o ? o(this.latestValues, "") : "none";
          return;
        }
        const c = this.getLead();
        if (!this.projectionDelta || !this.layout || !c.target) {
          this.options.layoutId && (s.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1, s.pointerEvents = Mu(l == null ? void 0 : l.pointerEvents) || ""), this.hasProjected && !Na(this.latestValues) && (s.transform = o ? o({}, "") : "none", this.hasProjected = false);
          return;
        }
        s.visibility = "";
        const f = c.animationValues || c.latestValues;
        this.applyTransformsToTarget();
        let d = D3(this.projectionDeltaWithTransform, this.treeScale, f);
        o && (d = o(f, d)), s.transform = d;
        const { x: m, y } = this.projectionDelta;
        s.transformOrigin = `${m.origin * 100}% ${y.origin * 100}% 0`, c.animationValues ? s.opacity = c === this ? f.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : f.opacityExit : s.opacity = c === this ? f.opacity !== void 0 ? f.opacity : "" : f.opacityExit !== void 0 ? f.opacityExit : 0;
        for (const T in Ql) {
          if (f[T] === void 0) continue;
          const { correct: b, applyTo: x, isCSSVariable: v } = Ql[T], g = d === "none" ? f[T] : b(f[T], c);
          if (x) {
            const S = x.length;
            for (let A = 0; A < S; A++) s[x[A]] = g;
          } else v ? this.options.visualElement.renderState.vars[T] = g : s[T] = g;
        }
        this.options.layoutId && (s.pointerEvents = c === this ? Mu(l == null ? void 0 : l.pointerEvents) || "" : "none");
      }
      clearSnapshot() {
        this.resumeFrom = this.snapshot = void 0;
      }
      resetTree() {
        this.root.nodes.forEach((s) => {
          var _a2;
          return (_a2 = s.currentAnimation) == null ? void 0 : _a2.stop();
        }), this.root.nodes.forEach(Uv), this.root.sharedNodes.clear();
      }
    };
  }
  function z3(t) {
    t.updateLayout();
  }
  function U3(t) {
    var _a2;
    const e = ((_a2 = t.resumeFrom) == null ? void 0 : _a2.snapshot) || t.snapshot;
    if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
      const { layoutBox: n, measuredBox: i } = t.layout, { animationType: a } = t.options, r = e.source !== t.layout.source;
      a === "size" ? gn((f) => {
        const d = r ? e.measuredBox[f] : e.layoutBox[f], m = Ve(d);
        d.min = n[f].min, d.max = d.min + m;
      }) : ox(a, e.layoutBox, n) && gn((f) => {
        const d = r ? e.measuredBox[f] : e.layoutBox[f], m = Ve(n[f]);
        d.max = d.min + m, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = true, t.relativeTarget[f].max = t.relativeTarget[f].min + m);
      });
      const s = Br();
      Sl(s, n, e.layoutBox);
      const l = Br();
      r ? Sl(l, t.applyTransform(i, true), e.measuredBox) : Sl(l, n, e.layoutBox);
      const o = !ax(s);
      let c = false;
      if (!t.resumeFrom) {
        const f = t.getClosestProjectingParent();
        if (f && !f.resumeFrom) {
          const { snapshot: d, layout: m } = f;
          if (d && m) {
            const y = Jt();
            Tl(y, e.layoutBox, d.layoutBox);
            const T = Jt();
            Tl(T, n, m.layoutBox), rx(y, T) || (c = true), f.options.layoutRoot && (t.relativeTarget = T, t.relativeTargetOrigin = y, t.relativeParent = f);
          }
        }
      }
      t.notifyListeners("didUpdate", {
        layout: n,
        snapshot: e,
        delta: l,
        layoutDelta: s,
        hasLayoutChanged: o,
        hasRelativeLayoutChanged: c
      });
    } else if (t.isLead()) {
      const { onExitComplete: n } = t.options;
      n && n();
    }
    t.options.transition = void 0;
  }
  function V3(t) {
    t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty));
  }
  function L3(t) {
    t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = false;
  }
  function N3(t) {
    t.clearSnapshot();
  }
  function Uv(t) {
    t.clearMeasurements();
  }
  function Vv(t) {
    t.isLayoutDirty = false;
  }
  function j3(t) {
    const { visualElement: e } = t.options;
    e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform();
  }
  function Lv(t) {
    t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = true;
  }
  function B3(t) {
    t.resolveTargetDelta();
  }
  function H3(t) {
    t.calcProjection();
  }
  function Y3(t) {
    t.resetSkewAndRotation();
  }
  function G3(t) {
    t.removeLeadSnapshot();
  }
  function Nv(t, e, n) {
    t.translate = Ht(e.translate, 0, n), t.scale = Ht(e.scale, 1, n), t.origin = e.origin, t.originPoint = e.originPoint;
  }
  function jv(t, e, n, i) {
    t.min = Ht(e.min, n.min, i), t.max = Ht(e.max, n.max, i);
  }
  function P3(t, e, n, i) {
    jv(t.x, e.x, n.x, i), jv(t.y, e.y, n.y, i);
  }
  function k3(t) {
    return t.animationValues && t.animationValues.opacityExit !== void 0;
  }
  const X3 = {
    duration: 0.45,
    ease: [
      0.4,
      0,
      0.1,
      1
    ]
  }, Bv = (t) => typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t), Hv = Bv("applewebkit/") && !Bv("chrome/") ? Math.round : zn;
  function Yv(t) {
    t.min = Hv(t.min), t.max = Hv(t.max);
  }
  function F3(t) {
    Yv(t.x), Yv(t.y);
  }
  function ox(t, e, n) {
    return t === "position" || t === "preserve-aspect" && !$O(Ov(e), Ov(n), 0.2);
  }
  function q3(t) {
    var _a2;
    return t !== t.root && ((_a2 = t.scroll) == null ? void 0 : _a2.wasRoot);
  }
  const K3 = lx({
    attachResizeListener: (t, e) => Zl(t, "resize", e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop
    }),
    checkIsScrollRoot: () => true
  }), gh = {
    current: void 0
  }, ux = lx({
    measureScroll: (t) => ({
      x: t.scrollLeft,
      y: t.scrollTop
    }),
    defaultParent: () => {
      if (!gh.current) {
        const t = new K3({});
        t.mount(window), t.setOptions({
          layoutScroll: true
        }), gh.current = t;
      }
      return gh.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = e !== void 0 ? e : "none";
    },
    checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed"
  }), Q3 = {
    pan: {
      Feature: h3
    },
    drag: {
      Feature: f3,
      ProjectionNode: ux,
      MeasureLayout: ex
    }
  };
  function Gv(t, e, n) {
    const { props: i } = t;
    t.animationState && i.whileHover && t.animationState.setActive("whileHover", n === "Start");
    const a = "onHover" + n, r = i[a];
    r && Lt.postRender(() => r(e, xo(e)));
  }
  class Z3 extends ba {
    mount() {
      const { current: e } = this.node;
      e && (this.unmount = SR(e, (n, i) => (Gv(this.node, i, "Start"), (a) => Gv(this.node, a, "End"))));
    }
    unmount() {
    }
  }
  class J3 extends ba {
    constructor() {
      super(...arguments), this.isActive = false;
    }
    onFocus() {
      let e = false;
      try {
        e = this.node.current.matches(":focus-visible");
      } catch {
        e = true;
      }
      !e || !this.node.animationState || (this.node.animationState.setActive("whileFocus", true), this.isActive = true);
    }
    onBlur() {
      !this.isActive || !this.node.animationState || (this.node.animationState.setActive("whileFocus", false), this.isActive = false);
    }
    mount() {
      this.unmount = bo(Zl(this.node.current, "focus", () => this.onFocus()), Zl(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {
    }
  }
  function Pv(t, e, n) {
    const { props: i } = t;
    if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
    t.animationState && i.whileTap && t.animationState.setActive("whileTap", n === "Start");
    const a = "onTap" + (n === "End" ? "" : n), r = i[a];
    r && Lt.postRender(() => r(e, xo(e)));
  }
  class $3 extends ba {
    mount() {
      const { current: e } = this.node;
      e && (this.unmount = ER(e, (n, i) => (Pv(this.node, i, "Start"), (a, { success: r }) => Pv(this.node, a, r ? "End" : "Cancel")), {
        useGlobalTarget: this.node.props.globalTapTarget
      }));
    }
    unmount() {
    }
  }
  const qd = /* @__PURE__ */ new WeakMap(), vh = /* @__PURE__ */ new WeakMap(), W3 = (t) => {
    const e = qd.get(t.target);
    e && e(t);
  }, I3 = (t) => {
    t.forEach(W3);
  };
  function t4({ root: t, ...e }) {
    const n = t || document;
    vh.has(n) || vh.set(n, {});
    const i = vh.get(n), a = JSON.stringify(e);
    return i[a] || (i[a] = new IntersectionObserver(I3, {
      root: t,
      ...e
    })), i[a];
  }
  function e4(t, e, n) {
    const i = t4(e);
    return qd.set(t, n), i.observe(t), () => {
      qd.delete(t), i.unobserve(t);
    };
  }
  const n4 = {
    some: 0,
    all: 1
  };
  class i4 extends ba {
    constructor() {
      super(...arguments), this.hasEnteredView = false, this.isInView = false;
    }
    startObserver() {
      this.unmount();
      const { viewport: e = {} } = this.node.getProps(), { root: n, margin: i, amount: a = "some", once: r } = e, s = {
        root: n ? n.current : void 0,
        rootMargin: i,
        threshold: typeof a == "number" ? a : n4[a]
      }, l = (o) => {
        const { isIntersecting: c } = o;
        if (this.isInView === c || (this.isInView = c, r && !c && this.hasEnteredView)) return;
        c && (this.hasEnteredView = true), this.node.animationState && this.node.animationState.setActive("whileInView", c);
        const { onViewportEnter: f, onViewportLeave: d } = this.node.getProps(), m = c ? f : d;
        m && m(o);
      };
      return e4(this.node.current, s, l);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > "u") return;
      const { props: e, prevProps: n } = this.node;
      [
        "amount",
        "margin",
        "root"
      ].some(a4(e, n)) && this.startObserver();
    }
    unmount() {
    }
  }
  function a4({ viewport: t = {} }, { viewport: e = {} } = {}) {
    return (n) => t[n] !== e[n];
  }
  const r4 = {
    inView: {
      Feature: i4
    },
    tap: {
      Feature: $3
    },
    focus: {
      Feature: J3
    },
    hover: {
      Feature: Z3
    }
  }, s4 = {
    layout: {
      ProjectionNode: ux,
      MeasureLayout: ex
    }
  }, l4 = {
    ...FO,
    ...r4,
    ...Q3,
    ...s4
  }, o4 = lO(l4, bO);
  function kv({ text: t, speed: e = 50, maxIterations: n = 10, sequential: i = false, revealDirection: a = "start", useOriginalCharsOnly: r = false, characters: s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+", className: l = "", parentClassName: o = "", encryptedClassName: c = "", animateOn: f = "hover", ...d }) {
    const [m, y] = D.useState(t), [T, b] = D.useState(false), [x, v] = D.useState(false), [g, S] = D.useState(/* @__PURE__ */ new Set()), [A, w] = D.useState(false), V = D.useRef(null);
    D.useEffect(() => {
      let O, U = 0;
      const B = (k) => {
        const $ = t.length;
        switch (a) {
          case "start":
            return k.size;
          case "end":
            return $ - 1 - k.size;
          case "center": {
            const K = Math.floor($ / 2), N = Math.floor(k.size / 2), P = k.size % 2 === 0 ? K + N : K - N - 1;
            if (P >= 0 && P < $ && !k.has(P)) return P;
            for (let G = 0; G < $; G++) if (!k.has(G)) return G;
            return 0;
          }
          default:
            return k.size;
        }
      }, Y = r ? Array.from(new Set(t.split(""))).filter((k) => k !== " ") : s.split(""), q = (k, $) => {
        if (r) {
          const K = k.split("").map((G, Q) => ({
            char: G,
            isSpace: G === " ",
            index: Q,
            isRevealed: $.has(Q)
          })), N = K.filter((G) => !G.isSpace && !G.isRevealed).map((G) => G.char);
          for (let G = N.length - 1; G > 0; G--) {
            const Q = Math.floor(Math.random() * (G + 1));
            [N[G], N[Q]] = [
              N[Q],
              N[G]
            ];
          }
          let P = 0;
          return K.map((G) => G.isSpace ? " " : G.isRevealed ? k[G.index] : N[P++]).join("");
        } else return k.split("").map((K, N) => K === " " ? " " : $.has(N) ? k[N] : Y[Math.floor(Math.random() * Y.length)]).join("");
      };
      return T ? (v(true), O = setInterval(() => {
        S((k) => {
          if (i) if (k.size < t.length) {
            const $ = B(k), K = new Set(k);
            return K.add($), y(q(t, K)), K;
          } else return clearInterval(O), v(false), k;
          else return y(q(t, k)), U++, U >= n && (clearInterval(O), v(false), y(t)), k;
        });
      }, e)) : (y(t), S(/* @__PURE__ */ new Set()), v(false)), () => {
        O && clearInterval(O);
      };
    }, [
      T,
      t,
      e,
      n,
      i,
      a,
      s,
      r
    ]), D.useEffect(() => {
      if (f !== "view" && f !== "both") return;
      const O = (q) => {
        q.forEach((k) => {
          k.isIntersecting && !A && (b(true), w(true));
        });
      }, U = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }, B = new IntersectionObserver(O, U), Y = V.current;
      return Y && B.observe(Y), () => {
        Y && B.unobserve(Y);
      };
    }, [
      f,
      A
    ]);
    const z = f === "hover" || f === "both" ? {
      onMouseEnter: () => b(true),
      onMouseLeave: () => b(false)
    } : {};
    return J.jsxs(o4.span, {
      ref: V,
      className: `inline-block whitespace-pre-wrap ${o}`,
      ...z,
      ...d,
      children: [
        J.jsx("span", {
          className: "sr-only",
          children: m
        }),
        J.jsx("span", {
          "aria-hidden": "true",
          children: m.split("").map((O, U) => {
            const B = g.has(U) || !x || !T;
            return J.jsx("span", {
              className: B ? l : c,
              children: O
            }, U);
          })
        })
      ]
    });
  }
  const u4 = ({ marqueeText: t = "", speed: e = 2, className: n, curveAmount: i = 400, direction: a = "left", interactive: r = true, decryptSpeed: s = 50, maxIterations: l = 10, sequential: o = false, revealDirection: c = "start", useOriginalCharsOnly: f = false, characters: d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+", animateOn: m = "view", encryptedClassName: y = "" }) => {
    const T = D.useMemo(() => (/\s|\u00A0$/.test(t) ? t.replace(/\s+$/, "") : t) + "\xA0", [
      t
    ]), b = D.useRef(null), x = D.useRef(null), v = D.useRef(null), g = D.useRef(null), [S, A] = D.useState(0), [w, V] = D.useState(0), O = `curve-${D.useId()}`, U = `M-100,40 Q500,${40 + i} 1540,40`, B = D.useRef(false), Y = D.useRef(0), q = D.useRef(a), k = D.useRef(0), [$, K] = D.useState(T), [N, P] = D.useState(false), [G, Q] = D.useState(false), [it, Pt] = D.useState(/* @__PURE__ */ new Set()), [Kt, te] = D.useState(false), Nt = S, pe = Nt ? Math.ceil(1800 / Nt) + 2 : 1, Ta = S > 0;
    D.useEffect(() => {
      b.current && A(b.current.getComputedTextLength());
    }, [
      T,
      n
    ]), D.useEffect(() => {
      if (S && x.current) {
        const wt = -S;
        x.current.setAttribute("startOffset", wt + "px"), V(wt);
      }
    }, [
      S
    ]), D.useEffect(() => {
      if (!S || !Ta) return;
      let wt = 0;
      const ft = () => {
        if (!B.current && x.current) {
          const Mt = q.current === "right" ? e : -e;
          let ee = parseFloat(x.current.getAttribute("startOffset") || "0") + Mt;
          const pt = S;
          ee <= -pt && (ee += pt), ee > 0 && (ee -= pt), x.current.setAttribute("startOffset", ee + "px"), V(ee);
        }
        wt = requestAnimationFrame(ft);
      };
      return wt = requestAnimationFrame(ft), () => cancelAnimationFrame(wt);
    }, [
      S,
      e,
      Ta
    ]), D.useEffect(() => {
      let wt, ft = 0;
      const Mt = (pt) => {
        const mn = T.length;
        switch (c) {
          case "start":
            return pt.size;
          case "end":
            return mn - 1 - pt.size;
          case "center": {
            const we = Math.floor(mn / 2), Re = Math.floor(pt.size / 2), ai = pt.size % 2 === 0 ? we + Re : we - Re - 1;
            if (ai >= 0 && ai < mn && !pt.has(ai)) return ai;
            for (let vt = 0; vt < mn; vt++) if (!pt.has(vt)) return vt;
            return 0;
          }
          default:
            return pt.size;
        }
      }, Qt = f ? Array.from(new Set(T.split(""))).filter((pt) => pt !== " ") : d.split(""), ee = (pt, mn) => {
        if (f) {
          const we = pt.split("").map((vt, Vi) => ({
            char: vt,
            isSpace: vt === " " || vt === "\xA0",
            index: Vi,
            isRevealed: mn.has(Vi)
          })), Re = we.filter((vt) => !vt.isSpace && !vt.isRevealed).map((vt) => vt.char);
          for (let vt = Re.length - 1; vt > 0; vt--) {
            const Vi = Math.floor(Math.random() * (vt + 1));
            [Re[vt], Re[Vi]] = [
              Re[Vi],
              Re[vt]
            ];
          }
          let ai = 0;
          return we.map((vt) => vt.isSpace ? vt.char : vt.isRevealed ? pt[vt.index] : Re[ai++]).join("");
        } else return pt.split("").map((we, Re) => we === " " || we === "\xA0" ? we : mn.has(Re) ? pt[Re] : Qt[Math.floor(Math.random() * Qt.length)]).join("");
      };
      return N || m === "always" ? (Q(true), wt = setInterval(() => {
        Pt((pt) => {
          if (o) if (pt.size < T.length) {
            const mn = Mt(pt), we = new Set(pt);
            return we.add(mn), K(ee(T, we)), we;
          } else {
            if (m !== "always") clearInterval(wt), Q(false);
            else return K(ee(T, /* @__PURE__ */ new Set())), /* @__PURE__ */ new Set();
            return pt;
          }
          else return K(ee(T, pt)), ft++, ft >= l && m !== "always" ? (clearInterval(wt), Q(false), K(T)) : ft >= l && m === "always" && (ft = 0), pt;
        });
      }, s)) : (K(T), Pt(/* @__PURE__ */ new Set()), Q(false)), () => {
        wt && clearInterval(wt);
      };
    }, [
      N,
      T,
      s,
      l,
      o,
      c,
      d,
      f,
      m
    ]), D.useEffect(() => {
      if (m !== "view" && m !== "both") return;
      const wt = (ee) => {
        ee.forEach((pt) => {
          pt.isIntersecting && !Kt && (P(true), te(true));
        });
      }, ft = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }, Mt = new IntersectionObserver(wt, ft), Qt = g.current;
      return Qt && Mt.observe(Qt), () => {
        Qt && Mt.unobserve(Qt);
      };
    }, [
      m,
      Kt
    ]), D.useEffect(() => {
      m === "always" && P(true);
    }, [
      m
    ]);
    const Jc = (wt) => {
      r && (B.current = true, Y.current = wt.clientX, k.current = 0, wt.target.setPointerCapture(wt.pointerId));
    }, Eo = (wt) => {
      if (!r || !B.current || !x.current) return;
      const ft = wt.clientX - Y.current;
      Y.current = wt.clientX, k.current = ft;
      let Qt = parseFloat(x.current.getAttribute("startOffset") || "0") + ft;
      const ee = S;
      Qt <= -ee && (Qt += ee), Qt > 0 && (Qt -= ee), x.current.setAttribute("startOffset", Qt + "px"), V(Qt);
    }, Rs = () => {
      r && (B.current = false, q.current = k.current > 0 ? "right" : "left");
    }, Os = r ? B.current ? "grabbing" : "grab" : "auto", xa = m === "hover" || m === "both" ? {
      onMouseEnter: () => P(true),
      onMouseLeave: () => P(false)
    } : {};
    return J.jsx("div", {
      ref: g,
      className: "min-h-screen flex items-center justify-center w-full absolute z-0 pointer-events-none",
      style: {
        visibility: Ta ? "visible" : "hidden",
        cursor: Os
      },
      onPointerDown: Jc,
      onPointerMove: Eo,
      onPointerUp: Rs,
      onPointerLeave: Rs,
      ...xa,
      children: J.jsxs("svg", {
        className: "select-none w-full overflow-visible block aspect-[100/12] text-[3rem] font-bold uppercase leading-none font-[Grandiflora_One]",
        viewBox: "0 0 1440 120",
        children: [
          J.jsx("text", {
            ref: b,
            xmlSpace: "preserve",
            style: {
              visibility: "hidden",
              opacity: 0,
              pointerEvents: "none"
            },
            children: T
          }),
          J.jsx("defs", {
            children: J.jsx("path", {
              ref: v,
              id: O,
              d: U,
              fill: "none",
              stroke: "transparent"
            })
          }),
          Ta && J.jsx("text", {
            xmlSpace: "preserve",
            className: `fill-white ${n ?? ""}`,
            children: J.jsx("textPath", {
              ref: x,
              href: `#${O}`,
              startOffset: w + "px",
              xmlSpace: "preserve",
              children: Array(pe).fill(null).map((wt, ft) => $.split("").map((Mt, Qt) => {
                const ee = it.has(Qt) || !G || !N && m !== "always";
                return J.jsx("tspan", {
                  className: ee ? "fill-[#492121] opacity-70" : y || "fill-[#492121] opacity-70",
                  children: Mt
                }, `${ft}-${Qt}`);
              }))
            })
          })
        ]
      })
    });
  }, c4 = () => J.jsxs("div", {
    className: "flex flex-col items-center justify-center bg-black text-white overflow-hidden w-screen h-screen fixed inset-0",
    children: [
      J.jsxs("div", {
        className: "z-3",
        children: [
          J.jsxs("div", {
            className: "mt-1 text-nowrap text-center font-[FunflowSurvivor] text-xl text-gray-300",
            children: [
              J.jsx(kv, {
                text: "\uC6B0\uB9AC\uB294 \uC758\uBBF8\uB97C \uCC3E\uAE30 \uC704\uD574 \uB05D\uC5C6\uC774 \uAE00\uC790 \uC870\uD569\uC744 \uC2DC\uB3C4\uD55C\uB2E4",
                animateOn: "hover",
                revealDirection: "start",
                speed: 80,
                maxIterations: 30,
                sequential: true,
                useOriginalCharsOnly: true
              }),
              J.jsx("br", {}),
              J.jsx(kv, {
                text: "\uB05D\uC5C6\uB294 \uC870\uD569 \uC18D\uC5D0\uC11C \uB9C8\uCE68\uB0B4 \uC6B0\uB9AC\uB294 \uB2E8 \uD558\uB098\uC758 \uC758\uBBF8\uB97C \uCC3E\uB294\uB2E4.",
                animateOn: "hover",
                revealDirection: "start",
                speed: 80,
                maxIterations: 30,
                sequential: true,
                useOriginalCharsOnly: true
              })
            ]
          }),
          J.jsx("h3", {
            className: "text-center font-[Noto Sans KR] text-xl text-gray-400/40",
            children: "\uC704\uC758 \uC124\uBA85\uC5D0 \uB9C8\uC6B0\uC2A4\uB97C \uAC00\uC838\uB2E4\uB300\uBCF4\uC138\uC694"
          }),
          J.jsx("div", {
            className: "flex justify-center items-center mt-20 translate-y-10 ",
            children: J.jsx(mp, {
              to: "/description",
              className: "block text-xl font-semibold transition duration-300 px-8 py-4 bg-amber-700 hover:bg-amber-800 rounded-lg font-[Noto_Sans_KR]",
              style: {
                padding: "8px 12px"
              },
              children: "Start"
            })
          })
        ]
      }),
      Array.from({
        length: 13
      }).map((t, e) => J.jsx("div", {
        className: "w-full h-full absolute",
        style: {
          transform: `translateY(${-8 * e}rem)`,
          top: "50rem"
        },
        children: J.jsx(u4, {
          marqueeText: "\uD558\uC9C0\uB9CC \uC758\uBBF8\uB294 \uACB0\uCF54 \uB3C4\uB2EC\uB418\uC9C0 \uC54A\uACE0, \uB04A\uC784\uC5C6\uC774 Diff\xE9rance \uBBF8\uB044\uB7EC\uC9C4\uB2E4",
          animateOn: "always",
          speed: e % 5 === 0 ? 0.15 : -0.05,
          curveAmount: -100,
          revealDirection: e % 3 === 0 ? "start" : "end",
          sequential: true,
          useOriginalCharsOnly: true,
          decryptSpeed: 200 * (Math.floor(e / 5) + 1)
        })
      }, e))
    ]
  });
  function fi(t) {
    if (t === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return t;
  }
  function cx(t, e) {
    t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e;
  }
  var un = {
    autoSleep: 120,
    force3D: "auto",
    nullTargetWarn: 1,
    units: {
      lineHeight: ""
    }
  }, fs = {
    duration: 0.5,
    overwrite: false,
    delay: 0
  }, Kp, Ae, Vt, Mn = 1e8, Tt = 1 / Mn, Kd = Math.PI * 2, f4 = Kd / 4, h4 = 0, fx = Math.sqrt, d4 = Math.cos, m4 = Math.sin, me = function(e) {
    return typeof e == "string";
  }, qt = function(e) {
    return typeof e == "function";
  }, Ri = function(e) {
    return typeof e == "number";
  }, Qp = function(e) {
    return typeof e > "u";
  }, ti = function(e) {
    return typeof e == "object";
  }, Xe = function(e) {
    return e !== false;
  }, Zp = function() {
    return typeof window < "u";
  }, au = function(e) {
    return qt(e) || me(e);
  }, hx = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
  }, De = Array.isArray, Qd = /(?:-?\.?\d|\.)+/gi, dx = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Hr = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _h = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, mx = /[+-]=-?[.\d]+/, px = /[^,'"\[\]\s]+/gi, p4 = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, Bt, Fn, Zd, Jp, hn = {}, mc = {}, yx, gx = function(e) {
    return (mc = hs(e, hn)) && Ze;
  }, $p = function(e, n) {
    return console.warn("Invalid property", e, "set to", n, "Missing plugin? gsap.registerPlugin()");
  }, Jl = function(e, n) {
    return !n && console.warn(e);
  }, vx = function(e, n) {
    return e && (hn[e] = n) && mc && (mc[e] = n) || hn;
  }, $l = function() {
    return 0;
  }, y4 = {
    suppressEvents: true,
    isStart: true,
    kill: false
  }, Du = {
    suppressEvents: true,
    kill: false
  }, g4 = {
    suppressEvents: true
  }, Wp = {}, oa = [], Jd = {}, _x, We = {}, bh = {}, Xv = 30, Ru = [], Ip = "", ty = function(e) {
    var n = e[0], i, a;
    if (ti(n) || qt(n) || (e = [
      e
    ]), !(i = (n._gsap || {}).harness)) {
      for (a = Ru.length; a-- && !Ru[a].targetTest(n); ) ;
      i = Ru[a];
    }
    for (a = e.length; a--; ) e[a] && (e[a]._gsap || (e[a]._gsap = new kx(e[a], i))) || e.splice(a, 1);
    return e;
  }, Qa = function(e) {
    return e._gsap || ty(Cn(e))[0]._gsap;
  }, bx = function(e, n, i) {
    return (i = e[n]) && qt(i) ? e[n]() : Qp(i) && e.getAttribute && e.getAttribute(n) || i;
  }, Fe = function(e, n) {
    return (e = e.split(",")).forEach(n) || e;
  }, $t = function(e) {
    return Math.round(e * 1e5) / 1e5 || 0;
  }, le = function(e) {
    return Math.round(e * 1e7) / 1e7 || 0;
  }, Zr = function(e, n) {
    var i = n.charAt(0), a = parseFloat(n.substr(2));
    return e = parseFloat(e), i === "+" ? e + a : i === "-" ? e - a : i === "*" ? e * a : e / a;
  }, v4 = function(e, n) {
    for (var i = n.length, a = 0; e.indexOf(n[a]) < 0 && ++a < i; ) ;
    return a < i;
  }, pc = function() {
    var e = oa.length, n = oa.slice(0), i, a;
    for (Jd = {}, oa.length = 0, i = 0; i < e; i++) a = n[i], a && a._lazy && (a.render(a._lazy[0], a._lazy[1], true)._lazy = 0);
  }, ey = function(e) {
    return !!(e._initted || e._startAt || e.add);
  }, Sx = function(e, n, i, a) {
    oa.length && !Ae && pc(), e.render(n, i, !!(Ae && n < 0 && ey(e))), oa.length && !Ae && pc();
  }, Tx = function(e) {
    var n = parseFloat(e);
    return (n || n === 0) && (e + "").match(px).length < 2 ? n : me(e) ? e.trim() : e;
  }, xx = function(e) {
    return e;
  }, dn = function(e, n) {
    for (var i in n) i in e || (e[i] = n[i]);
    return e;
  }, _4 = function(e) {
    return function(n, i) {
      for (var a in i) a in n || a === "duration" && e || a === "ease" || (n[a] = i[a]);
    };
  }, hs = function(e, n) {
    for (var i in n) e[i] = n[i];
    return e;
  }, Fv = function t(e, n) {
    for (var i in n) i !== "__proto__" && i !== "constructor" && i !== "prototype" && (e[i] = ti(n[i]) ? t(e[i] || (e[i] = {}), n[i]) : n[i]);
    return e;
  }, yc = function(e, n) {
    var i = {}, a;
    for (a in e) a in n || (i[a] = e[a]);
    return i;
  }, xl = function(e) {
    var n = e.parent || Bt, i = e.keyframes ? _4(De(e.keyframes)) : dn;
    if (Xe(e.inherit)) for (; n; ) i(e, n.vars.defaults), n = n.parent || n._dp;
    return e;
  }, b4 = function(e, n) {
    for (var i = e.length, a = i === n.length; a && i-- && e[i] === n[i]; ) ;
    return i < 0;
  }, Ax = function(e, n, i, a, r) {
    var s = e[a], l;
    if (r) for (l = n[r]; s && s[r] > l; ) s = s._prev;
    return s ? (n._next = s._next, s._next = n) : (n._next = e[i], e[i] = n), n._next ? n._next._prev = n : e[a] = n, n._prev = s, n.parent = n._dp = e, n;
  }, Kc = function(e, n, i, a) {
    i === void 0 && (i = "_first"), a === void 0 && (a = "_last");
    var r = n._prev, s = n._next;
    r ? r._next = s : e[i] === n && (e[i] = s), s ? s._prev = r : e[a] === n && (e[a] = r), n._next = n._prev = n.parent = null;
  }, ya = function(e, n) {
    e.parent && (!n || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
  }, Za = function(e, n) {
    if (e && (!n || n._end > e._dur || n._start < 0)) for (var i = e; i; ) i._dirty = 1, i = i.parent;
    return e;
  }, S4 = function(e) {
    for (var n = e.parent; n && n.parent; ) n._dirty = 1, n.totalDuration(), n = n.parent;
    return e;
  }, $d = function(e, n, i, a) {
    return e._startAt && (Ae ? e._startAt.revert(Du) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(n, true, a));
  }, T4 = function t(e) {
    return !e || e._ts && t(e.parent);
  }, qv = function(e) {
    return e._repeat ? ds(e._tTime, e = e.duration() + e._rDelay) * e : 0;
  }, ds = function(e, n) {
    var i = Math.floor(e = le(e / n));
    return e && i === e ? i - 1 : i;
  }, gc = function(e, n) {
    return (e - n._start) * n._ts + (n._ts >= 0 ? 0 : n._dirty ? n.totalDuration() : n._tDur);
  }, Qc = function(e) {
    return e._end = le(e._start + (e._tDur / Math.abs(e._ts || e._rts || Tt) || 0));
  }, Zc = function(e, n) {
    var i = e._dp;
    return i && i.smoothChildTiming && e._ts && (e._start = le(i._time - (e._ts > 0 ? n / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - n) / -e._ts)), Qc(e), i._dirty || Za(i, e)), e;
  }, Ex = function(e, n) {
    var i;
    if ((n._time || !n._dur && n._initted || n._start < e._time && (n._dur || !n.add)) && (i = gc(e.rawTime(), n), (!n._dur || Ao(0, n.totalDuration(), i) - n._tTime > Tt) && n.render(i, true)), Za(e, n)._dp && e._initted && e._time >= e._dur && e._ts) {
      if (e._dur < e.duration()) for (i = e; i._dp; ) i.rawTime() >= 0 && i.totalTime(i._tTime), i = i._dp;
      e._zTime = -Tt;
    }
  }, qn = function(e, n, i, a) {
    return n.parent && ya(n), n._start = le((Ri(i) ? i : i || e !== Bt ? vn(e, i, n) : e._time) + n._delay), n._end = le(n._start + (n.totalDuration() / Math.abs(n.timeScale()) || 0)), Ax(e, n, "_first", "_last", e._sort ? "_start" : 0), Wd(n) || (e._recent = n), a || Ex(e, n), e._ts < 0 && Zc(e, e._tTime), e;
  }, wx = function(e, n) {
    return (hn.ScrollTrigger || $p("scrollTrigger", n)) && hn.ScrollTrigger.create(n, e);
  }, Mx = function(e, n, i, a, r) {
    if (iy(e, n, r), !e._initted) return 1;
    if (!i && e._pt && !Ae && (e._dur && e.vars.lazy !== false || !e._dur && e.vars.lazy) && _x !== en.frame) return oa.push(e), e._lazy = [
      r,
      a
    ], 1;
  }, x4 = function t(e) {
    var n = e.parent;
    return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || t(n));
  }, Wd = function(e) {
    var n = e.data;
    return n === "isFromStart" || n === "isStart";
  }, A4 = function(e, n, i, a) {
    var r = e.ratio, s = n < 0 || !n && (!e._start && x4(e) && !(!e._initted && Wd(e)) || (e._ts < 0 || e._dp._ts < 0) && !Wd(e)) ? 0 : 1, l = e._rDelay, o = 0, c, f, d;
    if (l && e._repeat && (o = Ao(0, e._tDur, n), f = ds(o, l), e._yoyo && f & 1 && (s = 1 - s), f !== ds(e._tTime, l) && (r = 1 - s, e.vars.repeatRefresh && e._initted && e.invalidate())), s !== r || Ae || a || e._zTime === Tt || !n && e._zTime) {
      if (!e._initted && Mx(e, n, a, i, o)) return;
      for (d = e._zTime, e._zTime = n || (i ? Tt : 0), i || (i = n && !d), e.ratio = s, e._from && (s = 1 - s), e._time = 0, e._tTime = o, c = e._pt; c; ) c.r(s, c.d), c = c._next;
      n < 0 && $d(e, n, i, true), e._onUpdate && !i && an(e, "onUpdate"), o && e._repeat && !i && e.parent && an(e, "onRepeat"), (n >= e._tDur || n < 0) && e.ratio === s && (s && ya(e, 1), !i && !Ae && (an(e, s ? "onComplete" : "onReverseComplete", true), e._prom && e._prom()));
    } else e._zTime || (e._zTime = n);
  }, E4 = function(e, n, i) {
    var a;
    if (i > n) for (a = e._first; a && a._start <= i; ) {
      if (a.data === "isPause" && a._start > n) return a;
      a = a._next;
    }
    else for (a = e._last; a && a._start >= i; ) {
      if (a.data === "isPause" && a._start < n) return a;
      a = a._prev;
    }
  }, ms = function(e, n, i, a) {
    var r = e._repeat, s = le(n) || 0, l = e._tTime / e._tDur;
    return l && !a && (e._time *= s / e._dur), e._dur = s, e._tDur = r ? r < 0 ? 1e10 : le(s * (r + 1) + e._rDelay * r) : s, l > 0 && !a && Zc(e, e._tTime = e._tDur * l), e.parent && Qc(e), i || Za(e.parent, e), e;
  }, Kv = function(e) {
    return e instanceof ze ? Za(e) : ms(e, e._dur);
  }, w4 = {
    _start: 0,
    endTime: $l,
    totalDuration: $l
  }, vn = function t(e, n, i) {
    var a = e.labels, r = e._recent || w4, s = e.duration() >= Mn ? r.endTime(false) : e._dur, l, o, c;
    return me(n) && (isNaN(n) || n in a) ? (o = n.charAt(0), c = n.substr(-1) === "%", l = n.indexOf("="), o === "<" || o === ">" ? (l >= 0 && (n = n.replace(/=/, "")), (o === "<" ? r._start : r.endTime(r._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (c ? (l < 0 ? r : i).totalDuration() / 100 : 1)) : l < 0 ? (n in a || (a[n] = s), a[n]) : (o = parseFloat(n.charAt(l - 1) + n.substr(l + 1)), c && i && (o = o / 100 * (De(i) ? i[0] : i).totalDuration()), l > 1 ? t(e, n.substr(0, l - 1), i) + o : s + o)) : n == null ? s : +n;
  }, Al = function(e, n, i) {
    var a = Ri(n[1]), r = (a ? 2 : 1) + (e < 2 ? 0 : 1), s = n[r], l, o;
    if (a && (s.duration = n[1]), s.parent = i, e) {
      for (l = s, o = i; o && !("immediateRender" in l); ) l = o.vars.defaults || {}, o = Xe(o.vars.inherit) && o.parent;
      s.immediateRender = Xe(l.immediateRender), e < 2 ? s.runBackwards = 1 : s.startAt = n[r - 1];
    }
    return new re(n[0], s, n[r + 1]);
  }, Sa = function(e, n) {
    return e || e === 0 ? n(e) : n;
  }, Ao = function(e, n, i) {
    return i < e ? e : i > n ? n : i;
  }, Me = function(e, n) {
    return !me(e) || !(n = p4.exec(e)) ? "" : n[1];
  }, M4 = function(e, n, i) {
    return Sa(i, function(a) {
      return Ao(e, n, a);
    });
  }, Id = [].slice, Cx = function(e, n) {
    return e && ti(e) && "length" in e && (!n && !e.length || e.length - 1 in e && ti(e[0])) && !e.nodeType && e !== Fn;
  }, C4 = function(e, n, i) {
    return i === void 0 && (i = []), e.forEach(function(a) {
      var r;
      return me(a) && !n || Cx(a, 1) ? (r = i).push.apply(r, Cn(a)) : i.push(a);
    }) || i;
  }, Cn = function(e, n, i) {
    return Vt && !n && Vt.selector ? Vt.selector(e) : me(e) && !i && (Zd || !ps()) ? Id.call((n || Jp).querySelectorAll(e), 0) : De(e) ? C4(e, i) : Cx(e) ? Id.call(e, 0) : e ? [
      e
    ] : [];
  }, tm = function(e) {
    return e = Cn(e)[0] || Jl("Invalid scope") || {}, function(n) {
      var i = e.current || e.nativeElement || e;
      return Cn(n, i.querySelectorAll ? i : i === e ? Jl("Invalid scope") || Jp.createElement("div") : e);
    };
  }, Dx = function(e) {
    return e.sort(function() {
      return 0.5 - Math.random();
    });
  }, Rx = function(e) {
    if (qt(e)) return e;
    var n = ti(e) ? e : {
      each: e
    }, i = Ja(n.ease), a = n.from || 0, r = parseFloat(n.base) || 0, s = {}, l = a > 0 && a < 1, o = isNaN(a) || l, c = n.axis, f = a, d = a;
    return me(a) ? f = d = {
      center: 0.5,
      edges: 0.5,
      end: 1
    }[a] || 0 : !l && o && (f = a[0], d = a[1]), function(m, y, T) {
      var b = (T || n).length, x = s[b], v, g, S, A, w, V, z, O, U;
      if (!x) {
        if (U = n.grid === "auto" ? 0 : (n.grid || [
          1,
          Mn
        ])[1], !U) {
          for (z = -Mn; z < (z = T[U++].getBoundingClientRect().left) && U < b; ) ;
          U < b && U--;
        }
        for (x = s[b] = [], v = o ? Math.min(U, b) * f - 0.5 : a % U, g = U === Mn ? 0 : o ? b * d / U - 0.5 : a / U | 0, z = 0, O = Mn, V = 0; V < b; V++) S = V % U - v, A = g - (V / U | 0), x[V] = w = c ? Math.abs(c === "y" ? A : S) : fx(S * S + A * A), w > z && (z = w), w < O && (O = w);
        a === "random" && Dx(x), x.max = z - O, x.min = O, x.v = b = (parseFloat(n.amount) || parseFloat(n.each) * (U > b ? b - 1 : c ? c === "y" ? b / U : U : Math.max(U, b / U)) || 0) * (a === "edges" ? -1 : 1), x.b = b < 0 ? r - b : r, x.u = Me(n.amount || n.each) || 0, i = i && b < 0 ? Yx(i) : i;
      }
      return b = (x[m] - x.min) / x.max || 0, le(x.b + (i ? i(b) : b) * x.v) + x.u;
    };
  }, em = function(e) {
    var n = Math.pow(10, ((e + "").split(".")[1] || "").length);
    return function(i) {
      var a = le(Math.round(parseFloat(i) / e) * e * n);
      return (a - a % 1) / n + (Ri(i) ? 0 : Me(i));
    };
  }, Ox = function(e, n) {
    var i = De(e), a, r;
    return !i && ti(e) && (a = i = e.radius || Mn, e.values ? (e = Cn(e.values), (r = !Ri(e[0])) && (a *= a)) : e = em(e.increment)), Sa(n, i ? qt(e) ? function(s) {
      return r = e(s), Math.abs(r - s) <= a ? r : s;
    } : function(s) {
      for (var l = parseFloat(r ? s.x : s), o = parseFloat(r ? s.y : 0), c = Mn, f = 0, d = e.length, m, y; d--; ) r ? (m = e[d].x - l, y = e[d].y - o, m = m * m + y * y) : m = Math.abs(e[d] - l), m < c && (c = m, f = d);
      return f = !a || c <= a ? e[f] : s, r || f === s || Ri(s) ? f : f + Me(s);
    } : em(e));
  }, zx = function(e, n, i, a) {
    return Sa(De(e) ? !n : i === true ? !!(i = 0) : !a, function() {
      return De(e) ? e[~~(Math.random() * e.length)] : (i = i || 1e-5) && (a = i < 1 ? Math.pow(10, (i + "").length - 2) : 1) && Math.floor(Math.round((e - i / 2 + Math.random() * (n - e + i * 0.99)) / i) * i * a) / a;
    });
  }, D4 = function() {
    for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++) n[i] = arguments[i];
    return function(a) {
      return n.reduce(function(r, s) {
        return s(r);
      }, a);
    };
  }, R4 = function(e, n) {
    return function(i) {
      return e(parseFloat(i)) + (n || Me(i));
    };
  }, O4 = function(e, n, i) {
    return Vx(e, n, 0, 1, i);
  }, Ux = function(e, n, i) {
    return Sa(i, function(a) {
      return e[~~n(a)];
    });
  }, z4 = function t(e, n, i) {
    var a = n - e;
    return De(e) ? Ux(e, t(0, e.length), n) : Sa(i, function(r) {
      return (a + (r - e) % a) % a + e;
    });
  }, U4 = function t(e, n, i) {
    var a = n - e, r = a * 2;
    return De(e) ? Ux(e, t(0, e.length - 1), n) : Sa(i, function(s) {
      return s = (r + (s - e) % r) % r || 0, e + (s > a ? r - s : s);
    });
  }, Wl = function(e) {
    for (var n = 0, i = "", a, r, s, l; ~(a = e.indexOf("random(", n)); ) s = e.indexOf(")", a), l = e.charAt(a + 7) === "[", r = e.substr(a + 7, s - a - 7).match(l ? px : Qd), i += e.substr(n, a - n) + zx(l ? r : +r[0], l ? 0 : +r[1], +r[2] || 1e-5), n = s + 1;
    return i + e.substr(n, e.length - n);
  }, Vx = function(e, n, i, a, r) {
    var s = n - e, l = a - i;
    return Sa(r, function(o) {
      return i + ((o - e) / s * l || 0);
    });
  }, V4 = function t(e, n, i, a) {
    var r = isNaN(e + n) ? 0 : function(y) {
      return (1 - y) * e + y * n;
    };
    if (!r) {
      var s = me(e), l = {}, o, c, f, d, m;
      if (i === true && (a = 1) && (i = null), s) e = {
        p: e
      }, n = {
        p: n
      };
      else if (De(e) && !De(n)) {
        for (f = [], d = e.length, m = d - 2, c = 1; c < d; c++) f.push(t(e[c - 1], e[c]));
        d--, r = function(T) {
          T *= d;
          var b = Math.min(m, ~~T);
          return f[b](T - b);
        }, i = n;
      } else a || (e = hs(De(e) ? [] : {}, e));
      if (!f) {
        for (o in n) ny.call(l, e, o, "get", n[o]);
        r = function(T) {
          return sy(T, l) || (s ? e.p : e);
        };
      }
    }
    return Sa(i, r);
  }, Qv = function(e, n, i) {
    var a = e.labels, r = Mn, s, l, o;
    for (s in a) l = a[s] - n, l < 0 == !!i && l && r > (l = Math.abs(l)) && (o = s, r = l);
    return o;
  }, an = function(e, n, i) {
    var a = e.vars, r = a[n], s = Vt, l = e._ctx, o, c, f;
    if (r) return o = a[n + "Params"], c = a.callbackScope || e, i && oa.length && pc(), l && (Vt = l), f = o ? r.apply(c, o) : r.call(c), Vt = s, f;
  }, nl = function(e) {
    return ya(e), e.scrollTrigger && e.scrollTrigger.kill(!!Ae), e.progress() < 1 && an(e, "onInterrupt"), e;
  }, Yr, Lx = [], Nx = function(e) {
    if (e) if (e = !e.name && e.default || e, Zp() || e.headless) {
      var n = e.name, i = qt(e), a = n && !i && e.init ? function() {
        this._props = [];
      } : e, r = {
        init: $l,
        render: sy,
        add: ny,
        kill: J4,
        modifier: Z4,
        rawVars: 0
      }, s = {
        targetTest: 0,
        get: 0,
        getSetter: ry,
        aliases: {},
        register: 0
      };
      if (ps(), e !== a) {
        if (We[n]) return;
        dn(a, dn(yc(e, r), s)), hs(a.prototype, hs(r, yc(e, s))), We[a.prop = n] = a, e.targetTest && (Ru.push(a), Wp[n] = 1), n = (n === "css" ? "CSS" : n.charAt(0).toUpperCase() + n.substr(1)) + "Plugin";
      }
      vx(n, a), e.register && e.register(Ze, a, qe);
    } else Lx.push(e);
  }, St = 255, il = {
    aqua: [
      0,
      St,
      St
    ],
    lime: [
      0,
      St,
      0
    ],
    silver: [
      192,
      192,
      192
    ],
    black: [
      0,
      0,
      0
    ],
    maroon: [
      128,
      0,
      0
    ],
    teal: [
      0,
      128,
      128
    ],
    blue: [
      0,
      0,
      St
    ],
    navy: [
      0,
      0,
      128
    ],
    white: [
      St,
      St,
      St
    ],
    olive: [
      128,
      128,
      0
    ],
    yellow: [
      St,
      St,
      0
    ],
    orange: [
      St,
      165,
      0
    ],
    gray: [
      128,
      128,
      128
    ],
    purple: [
      128,
      0,
      128
    ],
    green: [
      0,
      128,
      0
    ],
    red: [
      St,
      0,
      0
    ],
    pink: [
      St,
      192,
      203
    ],
    cyan: [
      0,
      St,
      St
    ],
    transparent: [
      St,
      St,
      St,
      0
    ]
  }, Sh = function(e, n, i) {
    return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? n + (i - n) * e * 6 : e < 0.5 ? i : e * 3 < 2 ? n + (i - n) * (2 / 3 - e) * 6 : n) * St + 0.5 | 0;
  }, jx = function(e, n, i) {
    var a = e ? Ri(e) ? [
      e >> 16,
      e >> 8 & St,
      e & St
    ] : 0 : il.black, r, s, l, o, c, f, d, m, y, T;
    if (!a) {
      if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), il[e]) a = il[e];
      else if (e.charAt(0) === "#") {
        if (e.length < 6 && (r = e.charAt(1), s = e.charAt(2), l = e.charAt(3), e = "#" + r + r + s + s + l + l + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9) return a = parseInt(e.substr(1, 6), 16), [
          a >> 16,
          a >> 8 & St,
          a & St,
          parseInt(e.substr(7), 16) / 255
        ];
        e = parseInt(e.substr(1), 16), a = [
          e >> 16,
          e >> 8 & St,
          e & St
        ];
      } else if (e.substr(0, 3) === "hsl") {
        if (a = T = e.match(Qd), !n) o = +a[0] % 360 / 360, c = +a[1] / 100, f = +a[2] / 100, s = f <= 0.5 ? f * (c + 1) : f + c - f * c, r = f * 2 - s, a.length > 3 && (a[3] *= 1), a[0] = Sh(o + 1 / 3, r, s), a[1] = Sh(o, r, s), a[2] = Sh(o - 1 / 3, r, s);
        else if (~e.indexOf("=")) return a = e.match(dx), i && a.length < 4 && (a[3] = 1), a;
      } else a = e.match(Qd) || il.transparent;
      a = a.map(Number);
    }
    return n && !T && (r = a[0] / St, s = a[1] / St, l = a[2] / St, d = Math.max(r, s, l), m = Math.min(r, s, l), f = (d + m) / 2, d === m ? o = c = 0 : (y = d - m, c = f > 0.5 ? y / (2 - d - m) : y / (d + m), o = d === r ? (s - l) / y + (s < l ? 6 : 0) : d === s ? (l - r) / y + 2 : (r - s) / y + 4, o *= 60), a[0] = ~~(o + 0.5), a[1] = ~~(c * 100 + 0.5), a[2] = ~~(f * 100 + 0.5)), i && a.length < 4 && (a[3] = 1), a;
  }, Bx = function(e) {
    var n = [], i = [], a = -1;
    return e.split(ua).forEach(function(r) {
      var s = r.match(Hr) || [];
      n.push.apply(n, s), i.push(a += s.length + 1);
    }), n.c = i, n;
  }, Zv = function(e, n, i) {
    var a = "", r = (e + a).match(ua), s = n ? "hsla(" : "rgba(", l = 0, o, c, f, d;
    if (!r) return e;
    if (r = r.map(function(m) {
      return (m = jx(m, n, 1)) && s + (n ? m[0] + "," + m[1] + "%," + m[2] + "%," + m[3] : m.join(",")) + ")";
    }), i && (f = Bx(e), o = i.c, o.join(a) !== f.c.join(a))) for (c = e.replace(ua, "1").split(Hr), d = c.length - 1; l < d; l++) a += c[l] + (~o.indexOf(l) ? r.shift() || s + "0,0,0,0)" : (f.length ? f : r.length ? r : i).shift());
    if (!c) for (c = e.split(ua), d = c.length - 1; l < d; l++) a += c[l] + r[l];
    return a + c[d];
  }, ua = function() {
    var t = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", e;
    for (e in il) t += "|" + e + "\\b";
    return new RegExp(t + ")", "gi");
  }(), L4 = /hsl[a]?\(/, Hx = function(e) {
    var n = e.join(" "), i;
    if (ua.lastIndex = 0, ua.test(n)) return i = L4.test(n), e[1] = Zv(e[1], i), e[0] = Zv(e[0], i, Bx(e[1])), true;
  }, Il, en = function() {
    var t = Date.now, e = 500, n = 33, i = t(), a = i, r = 1e3 / 240, s = r, l = [], o, c, f, d, m, y, T = function b(x) {
      var v = t() - a, g = x === true, S, A, w, V;
      if ((v > e || v < 0) && (i += v - n), a += v, w = a - i, S = w - s, (S > 0 || g) && (V = ++d.frame, m = w - d.time * 1e3, d.time = w = w / 1e3, s += S + (S >= r ? 4 : r - S), A = 1), g || (o = c(b)), A) for (y = 0; y < l.length; y++) l[y](w, m, V, x);
    };
    return d = {
      time: 0,
      frame: 0,
      tick: function() {
        T(true);
      },
      deltaRatio: function(x) {
        return m / (1e3 / (x || 60));
      },
      wake: function() {
        yx && (!Zd && Zp() && (Fn = Zd = window, Jp = Fn.document || {}, hn.gsap = Ze, (Fn.gsapVersions || (Fn.gsapVersions = [])).push(Ze.version), gx(mc || Fn.GreenSockGlobals || !Fn.gsap && Fn || {}), Lx.forEach(Nx)), f = typeof requestAnimationFrame < "u" && requestAnimationFrame, o && d.sleep(), c = f || function(x) {
          return setTimeout(x, s - d.time * 1e3 + 1 | 0);
        }, Il = 1, T(2));
      },
      sleep: function() {
        (f ? cancelAnimationFrame : clearTimeout)(o), Il = 0, c = $l;
      },
      lagSmoothing: function(x, v) {
        e = x || 1 / 0, n = Math.min(v || 33, e);
      },
      fps: function(x) {
        r = 1e3 / (x || 240), s = d.time * 1e3 + r;
      },
      add: function(x, v, g) {
        var S = v ? function(A, w, V, z) {
          x(A, w, V, z), d.remove(S);
        } : x;
        return d.remove(x), l[g ? "unshift" : "push"](S), ps(), S;
      },
      remove: function(x, v) {
        ~(v = l.indexOf(x)) && l.splice(v, 1) && y >= v && y--;
      },
      _listeners: l
    }, d;
  }(), ps = function() {
    return !Il && en.wake();
  }, ct = {}, N4 = /^[\d.\-M][\d.\-,\s]/, j4 = /["']/g, B4 = function(e) {
    for (var n = {}, i = e.substr(1, e.length - 3).split(":"), a = i[0], r = 1, s = i.length, l, o, c; r < s; r++) o = i[r], l = r !== s - 1 ? o.lastIndexOf(",") : o.length, c = o.substr(0, l), n[a] = isNaN(c) ? c.replace(j4, "").trim() : +c, a = o.substr(l + 1).trim();
    return n;
  }, H4 = function(e) {
    var n = e.indexOf("(") + 1, i = e.indexOf(")"), a = e.indexOf("(", n);
    return e.substring(n, ~a && a < i ? e.indexOf(")", i + 1) : i);
  }, Y4 = function(e) {
    var n = (e + "").split("("), i = ct[n[0]];
    return i && n.length > 1 && i.config ? i.config.apply(null, ~e.indexOf("{") ? [
      B4(n[1])
    ] : H4(e).split(",").map(Tx)) : ct._CE && N4.test(e) ? ct._CE("", e) : i;
  }, Yx = function(e) {
    return function(n) {
      return 1 - e(1 - n);
    };
  }, Gx = function t(e, n) {
    for (var i = e._first, a; i; ) i instanceof ze ? t(i, n) : i.vars.yoyoEase && (!i._yoyo || !i._repeat) && i._yoyo !== n && (i.timeline ? t(i.timeline, n) : (a = i._ease, i._ease = i._yEase, i._yEase = a, i._yoyo = n)), i = i._next;
  }, Ja = function(e, n) {
    return e && (qt(e) ? e : ct[e] || Y4(e)) || n;
  }, hr = function(e, n, i, a) {
    i === void 0 && (i = function(o) {
      return 1 - n(1 - o);
    }), a === void 0 && (a = function(o) {
      return o < 0.5 ? n(o * 2) / 2 : 1 - n((1 - o) * 2) / 2;
    });
    var r = {
      easeIn: n,
      easeOut: i,
      easeInOut: a
    }, s;
    return Fe(e, function(l) {
      ct[l] = hn[l] = r, ct[s = l.toLowerCase()] = i;
      for (var o in r) ct[s + (o === "easeIn" ? ".in" : o === "easeOut" ? ".out" : ".inOut")] = ct[l + "." + o] = r[o];
    }), r;
  }, Px = function(e) {
    return function(n) {
      return n < 0.5 ? (1 - e(1 - n * 2)) / 2 : 0.5 + e((n - 0.5) * 2) / 2;
    };
  }, Th = function t(e, n, i) {
    var a = n >= 1 ? n : 1, r = (i || (e ? 0.3 : 0.45)) / (n < 1 ? n : 1), s = r / Kd * (Math.asin(1 / a) || 0), l = function(f) {
      return f === 1 ? 1 : a * Math.pow(2, -10 * f) * m4((f - s) * r) + 1;
    }, o = e === "out" ? l : e === "in" ? function(c) {
      return 1 - l(1 - c);
    } : Px(l);
    return r = Kd / r, o.config = function(c, f) {
      return t(e, c, f);
    }, o;
  }, xh = function t(e, n) {
    n === void 0 && (n = 1.70158);
    var i = function(s) {
      return s ? --s * s * ((n + 1) * s + n) + 1 : 0;
    }, a = e === "out" ? i : e === "in" ? function(r) {
      return 1 - i(1 - r);
    } : Px(i);
    return a.config = function(r) {
      return t(e, r);
    }, a;
  };
  Fe("Linear,Quad,Cubic,Quart,Quint,Strong", function(t, e) {
    var n = e < 5 ? e + 1 : e;
    hr(t + ",Power" + (n - 1), e ? function(i) {
      return Math.pow(i, n);
    } : function(i) {
      return i;
    }, function(i) {
      return 1 - Math.pow(1 - i, n);
    }, function(i) {
      return i < 0.5 ? Math.pow(i * 2, n) / 2 : 1 - Math.pow((1 - i) * 2, n) / 2;
    });
  });
  ct.Linear.easeNone = ct.none = ct.Linear.easeIn;
  hr("Elastic", Th("in"), Th("out"), Th());
  (function(t, e) {
    var n = 1 / e, i = 2 * n, a = 2.5 * n, r = function(l) {
      return l < n ? t * l * l : l < i ? t * Math.pow(l - 1.5 / e, 2) + 0.75 : l < a ? t * (l -= 2.25 / e) * l + 0.9375 : t * Math.pow(l - 2.625 / e, 2) + 0.984375;
    };
    hr("Bounce", function(s) {
      return 1 - r(1 - s);
    }, r);
  })(7.5625, 2.75);
  hr("Expo", function(t) {
    return Math.pow(2, 10 * (t - 1)) * t + t * t * t * t * t * t * (1 - t);
  });
  hr("Circ", function(t) {
    return -(fx(1 - t * t) - 1);
  });
  hr("Sine", function(t) {
    return t === 1 ? 1 : -d4(t * f4) + 1;
  });
  hr("Back", xh("in"), xh("out"), xh());
  ct.SteppedEase = ct.steps = hn.SteppedEase = {
    config: function(e, n) {
      e === void 0 && (e = 1);
      var i = 1 / e, a = e + (n ? 0 : 1), r = n ? 1 : 0, s = 1 - Tt;
      return function(l) {
        return ((a * Ao(0, s, l) | 0) + r) * i;
      };
    }
  };
  fs.ease = ct["quad.out"];
  Fe("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(t) {
    return Ip += t + "," + t + "Params,";
  });
  var kx = function(e, n) {
    this.id = h4++, e._gsap = this, this.target = e, this.harness = n, this.get = n ? n.get : bx, this.set = n ? n.getSetter : ry;
  }, to = function() {
    function t(n) {
      this.vars = n, this._delay = +n.delay || 0, (this._repeat = n.repeat === 1 / 0 ? -2 : n.repeat || 0) && (this._rDelay = n.repeatDelay || 0, this._yoyo = !!n.yoyo || !!n.yoyoEase), this._ts = 1, ms(this, +n.duration, 1, 1), this.data = n.data, Vt && (this._ctx = Vt, Vt.data.push(this)), Il || en.wake();
    }
    var e = t.prototype;
    return e.delay = function(i) {
      return i || i === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + i - this._delay), this._delay = i, this) : this._delay;
    }, e.duration = function(i) {
      return arguments.length ? this.totalDuration(this._repeat > 0 ? i + (i + this._rDelay) * this._repeat : i) : this.totalDuration() && this._dur;
    }, e.totalDuration = function(i) {
      return arguments.length ? (this._dirty = 0, ms(this, this._repeat < 0 ? i : (i - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
    }, e.totalTime = function(i, a) {
      if (ps(), !arguments.length) return this._tTime;
      var r = this._dp;
      if (r && r.smoothChildTiming && this._ts) {
        for (Zc(this, i), !r._dp || r.parent || Ex(r, this); r && r.parent; ) r.parent._time !== r._start + (r._ts >= 0 ? r._tTime / r._ts : (r.totalDuration() - r._tTime) / -r._ts) && r.totalTime(r._tTime, true), r = r.parent;
        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && i < this._tDur || this._ts < 0 && i > 0 || !this._tDur && !i) && qn(this._dp, this, this._start - this._delay);
      }
      return (this._tTime !== i || !this._dur && !a || this._initted && Math.abs(this._zTime) === Tt || !i && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = i), Sx(this, i, a)), this;
    }, e.time = function(i, a) {
      return arguments.length ? this.totalTime(Math.min(this.totalDuration(), i + qv(this)) % (this._dur + this._rDelay) || (i ? this._dur : 0), a) : this._time;
    }, e.totalProgress = function(i, a) {
      return arguments.length ? this.totalTime(this.totalDuration() * i, a) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
    }, e.progress = function(i, a) {
      return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - i : i) + qv(this), a) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
    }, e.iteration = function(i, a) {
      var r = this.duration() + this._rDelay;
      return arguments.length ? this.totalTime(this._time + (i - 1) * r, a) : this._repeat ? ds(this._tTime, r) + 1 : 1;
    }, e.timeScale = function(i, a) {
      if (!arguments.length) return this._rts === -Tt ? 0 : this._rts;
      if (this._rts === i) return this;
      var r = this.parent && this._ts ? gc(this.parent._time, this) : this._tTime;
      return this._rts = +i || 0, this._ts = this._ps || i === -Tt ? 0 : this._rts, this.totalTime(Ao(-Math.abs(this._delay), this.totalDuration(), r), a !== false), Qc(this), S4(this);
    }, e.paused = function(i) {
      return arguments.length ? (this._ps !== i && (this._ps = i, i ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (ps(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== Tt && (this._tTime -= Tt)))), this) : this._ps;
    }, e.startTime = function(i) {
      if (arguments.length) {
        this._start = i;
        var a = this.parent || this._dp;
        return a && (a._sort || !this.parent) && qn(a, this, i - this._delay), this;
      }
      return this._start;
    }, e.endTime = function(i) {
      return this._start + (Xe(i) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
    }, e.rawTime = function(i) {
      var a = this.parent || this._dp;
      return a ? i && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? gc(a.rawTime(i), this) : this._tTime : this._tTime;
    }, e.revert = function(i) {
      i === void 0 && (i = g4);
      var a = Ae;
      return Ae = i, ey(this) && (this.timeline && this.timeline.revert(i), this.totalTime(-0.01, i.suppressEvents)), this.data !== "nested" && i.kill !== false && this.kill(), Ae = a, this;
    }, e.globalTime = function(i) {
      for (var a = this, r = arguments.length ? i : a.rawTime(); a; ) r = a._start + r / (Math.abs(a._ts) || 1), a = a._dp;
      return !this.parent && this._sat ? this._sat.globalTime(i) : r;
    }, e.repeat = function(i) {
      return arguments.length ? (this._repeat = i === 1 / 0 ? -2 : i, Kv(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
    }, e.repeatDelay = function(i) {
      if (arguments.length) {
        var a = this._time;
        return this._rDelay = i, Kv(this), a ? this.time(a) : this;
      }
      return this._rDelay;
    }, e.yoyo = function(i) {
      return arguments.length ? (this._yoyo = i, this) : this._yoyo;
    }, e.seek = function(i, a) {
      return this.totalTime(vn(this, i), Xe(a));
    }, e.restart = function(i, a) {
      return this.play().totalTime(i ? -this._delay : 0, Xe(a)), this._dur || (this._zTime = -Tt), this;
    }, e.play = function(i, a) {
      return i != null && this.seek(i, a), this.reversed(false).paused(false);
    }, e.reverse = function(i, a) {
      return i != null && this.seek(i || this.totalDuration(), a), this.reversed(true).paused(false);
    }, e.pause = function(i, a) {
      return i != null && this.seek(i, a), this.paused(true);
    }, e.resume = function() {
      return this.paused(false);
    }, e.reversed = function(i) {
      return arguments.length ? (!!i !== this.reversed() && this.timeScale(-this._rts || (i ? -Tt : 0)), this) : this._rts < 0;
    }, e.invalidate = function() {
      return this._initted = this._act = 0, this._zTime = -Tt, this;
    }, e.isActive = function() {
      var i = this.parent || this._dp, a = this._start, r;
      return !!(!i || this._ts && this._initted && i.isActive() && (r = i.rawTime(true)) >= a && r < this.endTime(true) - Tt);
    }, e.eventCallback = function(i, a, r) {
      var s = this.vars;
      return arguments.length > 1 ? (a ? (s[i] = a, r && (s[i + "Params"] = r), i === "onUpdate" && (this._onUpdate = a)) : delete s[i], this) : s[i];
    }, e.then = function(i) {
      var a = this;
      return new Promise(function(r) {
        var s = qt(i) ? i : xx, l = function() {
          var c = a.then;
          a.then = null, qt(s) && (s = s(a)) && (s.then || s === a) && (a.then = c), r(s), a.then = c;
        };
        a._initted && a.totalProgress() === 1 && a._ts >= 0 || !a._tTime && a._ts < 0 ? l() : a._prom = l;
      });
    }, e.kill = function() {
      nl(this);
    }, t;
  }();
  dn(to.prototype, {
    _time: 0,
    _start: 0,
    _end: 0,
    _tTime: 0,
    _tDur: 0,
    _dirty: 0,
    _repeat: 0,
    _yoyo: false,
    parent: null,
    _initted: false,
    _rDelay: 0,
    _ts: 1,
    _dp: 0,
    ratio: 0,
    _zTime: -Tt,
    _prom: 0,
    _ps: false,
    _rts: 1
  });
  var ze = function(t) {
    cx(e, t);
    function e(i, a) {
      var r;
      return i === void 0 && (i = {}), r = t.call(this, i) || this, r.labels = {}, r.smoothChildTiming = !!i.smoothChildTiming, r.autoRemoveChildren = !!i.autoRemoveChildren, r._sort = Xe(i.sortChildren), Bt && qn(i.parent || Bt, fi(r), a), i.reversed && r.reverse(), i.paused && r.paused(true), i.scrollTrigger && wx(fi(r), i.scrollTrigger), r;
    }
    var n = e.prototype;
    return n.to = function(a, r, s) {
      return Al(0, arguments, this), this;
    }, n.from = function(a, r, s) {
      return Al(1, arguments, this), this;
    }, n.fromTo = function(a, r, s, l) {
      return Al(2, arguments, this), this;
    }, n.set = function(a, r, s) {
      return r.duration = 0, r.parent = this, xl(r).repeatDelay || (r.repeat = 0), r.immediateRender = !!r.immediateRender, new re(a, r, vn(this, s), 1), this;
    }, n.call = function(a, r, s) {
      return qn(this, re.delayedCall(0, a, r), s);
    }, n.staggerTo = function(a, r, s, l, o, c, f) {
      return s.duration = r, s.stagger = s.stagger || l, s.onComplete = c, s.onCompleteParams = f, s.parent = this, new re(a, s, vn(this, o)), this;
    }, n.staggerFrom = function(a, r, s, l, o, c, f) {
      return s.runBackwards = 1, xl(s).immediateRender = Xe(s.immediateRender), this.staggerTo(a, r, s, l, o, c, f);
    }, n.staggerFromTo = function(a, r, s, l, o, c, f, d) {
      return l.startAt = s, xl(l).immediateRender = Xe(l.immediateRender), this.staggerTo(a, r, l, o, c, f, d);
    }, n.render = function(a, r, s) {
      var l = this._time, o = this._dirty ? this.totalDuration() : this._tDur, c = this._dur, f = a <= 0 ? 0 : le(a), d = this._zTime < 0 != a < 0 && (this._initted || !c), m, y, T, b, x, v, g, S, A, w, V, z;
      if (this !== Bt && f > o && a >= 0 && (f = o), f !== this._tTime || s || d) {
        if (l !== this._time && c && (f += this._time - l, a += this._time - l), m = f, A = this._start, S = this._ts, v = !S, d && (c || (l = this._zTime), (a || !r) && (this._zTime = a)), this._repeat) {
          if (V = this._yoyo, x = c + this._rDelay, this._repeat < -1 && a < 0) return this.totalTime(x * 100 + a, r, s);
          if (m = le(f % x), f === o ? (b = this._repeat, m = c) : (w = le(f / x), b = ~~w, b && b === w && (m = c, b--), m > c && (m = c)), w = ds(this._tTime, x), !l && this._tTime && w !== b && this._tTime - w * x - this._dur <= 0 && (w = b), V && b & 1 && (m = c - m, z = 1), b !== w && !this._lock) {
            var O = V && w & 1, U = O === (V && b & 1);
            if (b < w && (O = !O), l = O ? 0 : f % c ? c : f, this._lock = 1, this.render(l || (z ? 0 : le(b * x)), r, !c)._lock = 0, this._tTime = f, !r && this.parent && an(this, "onRepeat"), this.vars.repeatRefresh && !z && (this.invalidate()._lock = 1), l && l !== this._time || v !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
            if (c = this._dur, o = this._tDur, U && (this._lock = 2, l = O ? c : -1e-4, this.render(l, true), this.vars.repeatRefresh && !z && this.invalidate()), this._lock = 0, !this._ts && !v) return this;
            Gx(this, z);
          }
        }
        if (this._hasPause && !this._forcing && this._lock < 2 && (g = E4(this, le(l), le(m)), g && (f -= m - (m = g._start))), this._tTime = f, this._time = m, this._act = !S, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = a, l = 0), !l && f && !r && !w && (an(this, "onStart"), this._tTime !== f)) return this;
        if (m >= l && a >= 0) for (y = this._first; y; ) {
          if (T = y._next, (y._act || m >= y._start) && y._ts && g !== y) {
            if (y.parent !== this) return this.render(a, r, s);
            if (y.render(y._ts > 0 ? (m - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (m - y._start) * y._ts, r, s), m !== this._time || !this._ts && !v) {
              g = 0, T && (f += this._zTime = -Tt);
              break;
            }
          }
          y = T;
        }
        else {
          y = this._last;
          for (var B = a < 0 ? a : m; y; ) {
            if (T = y._prev, (y._act || B <= y._end) && y._ts && g !== y) {
              if (y.parent !== this) return this.render(a, r, s);
              if (y.render(y._ts > 0 ? (B - y._start) * y._ts : (y._dirty ? y.totalDuration() : y._tDur) + (B - y._start) * y._ts, r, s || Ae && ey(y)), m !== this._time || !this._ts && !v) {
                g = 0, T && (f += this._zTime = B ? -Tt : Tt);
                break;
              }
            }
            y = T;
          }
        }
        if (g && !r && (this.pause(), g.render(m >= l ? 0 : -Tt)._zTime = m >= l ? 1 : -1, this._ts)) return this._start = A, Qc(this), this.render(a, r, s);
        this._onUpdate && !r && an(this, "onUpdate", true), (f === o && this._tTime >= this.totalDuration() || !f && l) && (A === this._start || Math.abs(S) !== Math.abs(this._ts)) && (this._lock || ((a || !c) && (f === o && this._ts > 0 || !f && this._ts < 0) && ya(this, 1), !r && !(a < 0 && !l) && (f || l || !o) && (an(this, f === o && a >= 0 ? "onComplete" : "onReverseComplete", true), this._prom && !(f < o && this.timeScale() > 0) && this._prom())));
      }
      return this;
    }, n.add = function(a, r) {
      var s = this;
      if (Ri(r) || (r = vn(this, r, a)), !(a instanceof to)) {
        if (De(a)) return a.forEach(function(l) {
          return s.add(l, r);
        }), this;
        if (me(a)) return this.addLabel(a, r);
        if (qt(a)) a = re.delayedCall(0, a);
        else return this;
      }
      return this !== a ? qn(this, a, r) : this;
    }, n.getChildren = function(a, r, s, l) {
      a === void 0 && (a = true), r === void 0 && (r = true), s === void 0 && (s = true), l === void 0 && (l = -Mn);
      for (var o = [], c = this._first; c; ) c._start >= l && (c instanceof re ? r && o.push(c) : (s && o.push(c), a && o.push.apply(o, c.getChildren(true, r, s)))), c = c._next;
      return o;
    }, n.getById = function(a) {
      for (var r = this.getChildren(1, 1, 1), s = r.length; s--; ) if (r[s].vars.id === a) return r[s];
    }, n.remove = function(a) {
      return me(a) ? this.removeLabel(a) : qt(a) ? this.killTweensOf(a) : (a.parent === this && Kc(this, a), a === this._recent && (this._recent = this._last), Za(this));
    }, n.totalTime = function(a, r) {
      return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = le(en.time - (this._ts > 0 ? a / this._ts : (this.totalDuration() - a) / -this._ts))), t.prototype.totalTime.call(this, a, r), this._forcing = 0, this) : this._tTime;
    }, n.addLabel = function(a, r) {
      return this.labels[a] = vn(this, r), this;
    }, n.removeLabel = function(a) {
      return delete this.labels[a], this;
    }, n.addPause = function(a, r, s) {
      var l = re.delayedCall(0, r || $l, s);
      return l.data = "isPause", this._hasPause = 1, qn(this, l, vn(this, a));
    }, n.removePause = function(a) {
      var r = this._first;
      for (a = vn(this, a); r; ) r._start === a && r.data === "isPause" && ya(r), r = r._next;
    }, n.killTweensOf = function(a, r, s) {
      for (var l = this.getTweensOf(a, s), o = l.length; o--; ) Zi !== l[o] && l[o].kill(a, r);
      return this;
    }, n.getTweensOf = function(a, r) {
      for (var s = [], l = Cn(a), o = this._first, c = Ri(r), f; o; ) o instanceof re ? v4(o._targets, l) && (c ? (!Zi || o._initted && o._ts) && o.globalTime(0) <= r && o.globalTime(o.totalDuration()) > r : !r || o.isActive()) && s.push(o) : (f = o.getTweensOf(l, r)).length && s.push.apply(s, f), o = o._next;
      return s;
    }, n.tweenTo = function(a, r) {
      r = r || {};
      var s = this, l = vn(s, a), o = r, c = o.startAt, f = o.onStart, d = o.onStartParams, m = o.immediateRender, y, T = re.to(s, dn({
        ease: r.ease || "none",
        lazy: false,
        immediateRender: false,
        time: l,
        overwrite: "auto",
        duration: r.duration || Math.abs((l - (c && "time" in c ? c.time : s._time)) / s.timeScale()) || Tt,
        onStart: function() {
          if (s.pause(), !y) {
            var x = r.duration || Math.abs((l - (c && "time" in c ? c.time : s._time)) / s.timeScale());
            T._dur !== x && ms(T, x, 0, 1).render(T._time, true, true), y = 1;
          }
          f && f.apply(T, d || []);
        }
      }, r));
      return m ? T.render(0) : T;
    }, n.tweenFromTo = function(a, r, s) {
      return this.tweenTo(r, dn({
        startAt: {
          time: vn(this, a)
        }
      }, s));
    }, n.recent = function() {
      return this._recent;
    }, n.nextLabel = function(a) {
      return a === void 0 && (a = this._time), Qv(this, vn(this, a));
    }, n.previousLabel = function(a) {
      return a === void 0 && (a = this._time), Qv(this, vn(this, a), 1);
    }, n.currentLabel = function(a) {
      return arguments.length ? this.seek(a, true) : this.previousLabel(this._time + Tt);
    }, n.shiftChildren = function(a, r, s) {
      s === void 0 && (s = 0);
      for (var l = this._first, o = this.labels, c; l; ) l._start >= s && (l._start += a, l._end += a), l = l._next;
      if (r) for (c in o) o[c] >= s && (o[c] += a);
      return Za(this);
    }, n.invalidate = function(a) {
      var r = this._first;
      for (this._lock = 0; r; ) r.invalidate(a), r = r._next;
      return t.prototype.invalidate.call(this, a);
    }, n.clear = function(a) {
      a === void 0 && (a = true);
      for (var r = this._first, s; r; ) s = r._next, this.remove(r), r = s;
      return this._dp && (this._time = this._tTime = this._pTime = 0), a && (this.labels = {}), Za(this);
    }, n.totalDuration = function(a) {
      var r = 0, s = this, l = s._last, o = Mn, c, f, d;
      if (arguments.length) return s.timeScale((s._repeat < 0 ? s.duration() : s.totalDuration()) / (s.reversed() ? -a : a));
      if (s._dirty) {
        for (d = s.parent; l; ) c = l._prev, l._dirty && l.totalDuration(), f = l._start, f > o && s._sort && l._ts && !s._lock ? (s._lock = 1, qn(s, l, f - l._delay, 1)._lock = 0) : o = f, f < 0 && l._ts && (r -= f, (!d && !s._dp || d && d.smoothChildTiming) && (s._start += f / s._ts, s._time -= f, s._tTime -= f), s.shiftChildren(-f, false, -1 / 0), o = 0), l._end > r && l._ts && (r = l._end), l = c;
        ms(s, s === Bt && s._time > r ? s._time : r, 1, 1), s._dirty = 0;
      }
      return s._tDur;
    }, e.updateRoot = function(a) {
      if (Bt._ts && (Sx(Bt, gc(a, Bt)), _x = en.frame), en.frame >= Xv) {
        Xv += un.autoSleep || 120;
        var r = Bt._first;
        if ((!r || !r._ts) && un.autoSleep && en._listeners.length < 2) {
          for (; r && !r._ts; ) r = r._next;
          r || en.sleep();
        }
      }
    }, e;
  }(to);
  dn(ze.prototype, {
    _lock: 0,
    _hasPause: 0,
    _forcing: 0
  });
  var G4 = function(e, n, i, a, r, s, l) {
    var o = new qe(this._pt, e, n, 0, 1, Zx, null, r), c = 0, f = 0, d, m, y, T, b, x, v, g;
    for (o.b = i, o.e = a, i += "", a += "", (v = ~a.indexOf("random(")) && (a = Wl(a)), s && (g = [
      i,
      a
    ], s(g, e, n), i = g[0], a = g[1]), m = i.match(_h) || []; d = _h.exec(a); ) T = d[0], b = a.substring(c, d.index), y ? y = (y + 1) % 5 : b.substr(-5) === "rgba(" && (y = 1), T !== m[f++] && (x = parseFloat(m[f - 1]) || 0, o._pt = {
      _next: o._pt,
      p: b || f === 1 ? b : ",",
      s: x,
      c: T.charAt(1) === "=" ? Zr(x, T) - x : parseFloat(T) - x,
      m: y && y < 4 ? Math.round : 0
    }, c = _h.lastIndex);
    return o.c = c < a.length ? a.substring(c, a.length) : "", o.fp = l, (mx.test(a) || v) && (o.e = 0), this._pt = o, o;
  }, ny = function(e, n, i, a, r, s, l, o, c, f) {
    qt(a) && (a = a(r || 0, e, s));
    var d = e[n], m = i !== "get" ? i : qt(d) ? c ? e[n.indexOf("set") || !qt(e["get" + n.substr(3)]) ? n : "get" + n.substr(3)](c) : e[n]() : d, y = qt(d) ? c ? q4 : Kx : ay, T;
    if (me(a) && (~a.indexOf("random(") && (a = Wl(a)), a.charAt(1) === "=" && (T = Zr(m, a) + (Me(m) || 0), (T || T === 0) && (a = T))), !f || m !== a || nm) return !isNaN(m * a) && a !== "" ? (T = new qe(this._pt, e, n, +m || 0, a - (m || 0), typeof d == "boolean" ? Q4 : Qx, 0, y), c && (T.fp = c), l && T.modifier(l, this, e), this._pt = T) : (!d && !(n in e) && $p(n, a), G4.call(this, e, n, m, a, y, o || un.stringFilter, c));
  }, P4 = function(e, n, i, a, r) {
    if (qt(e) && (e = El(e, r, n, i, a)), !ti(e) || e.style && e.nodeType || De(e) || hx(e)) return me(e) ? El(e, r, n, i, a) : e;
    var s = {}, l;
    for (l in e) s[l] = El(e[l], r, n, i, a);
    return s;
  }, Xx = function(e, n, i, a, r, s) {
    var l, o, c, f;
    if (We[e] && (l = new We[e]()).init(r, l.rawVars ? n[e] : P4(n[e], a, r, s, i), i, a, s) !== false && (i._pt = o = new qe(i._pt, r, e, 0, 1, l.render, l, 0, l.priority), i !== Yr)) for (c = i._ptLookup[i._targets.indexOf(r)], f = l._props.length; f--; ) c[l._props[f]] = o;
    return l;
  }, Zi, nm, iy = function t(e, n, i) {
    var a = e.vars, r = a.ease, s = a.startAt, l = a.immediateRender, o = a.lazy, c = a.onUpdate, f = a.runBackwards, d = a.yoyoEase, m = a.keyframes, y = a.autoRevert, T = e._dur, b = e._startAt, x = e._targets, v = e.parent, g = v && v.data === "nested" ? v.vars.targets : x, S = e._overwrite === "auto" && !Kp, A = e.timeline, w, V, z, O, U, B, Y, q, k, $, K, N, P;
    if (A && (!m || !r) && (r = "none"), e._ease = Ja(r, fs.ease), e._yEase = d ? Yx(Ja(d === true ? r : d, fs.ease)) : 0, d && e._yoyo && !e._repeat && (d = e._yEase, e._yEase = e._ease, e._ease = d), e._from = !A && !!a.runBackwards, !A || m && !a.stagger) {
      if (q = x[0] ? Qa(x[0]).harness : 0, N = q && a[q.prop], w = yc(a, Wp), b && (b._zTime < 0 && b.progress(1), n < 0 && f && l && !y ? b.render(-1, true) : b.revert(f && T ? Du : y4), b._lazy = 0), s) {
        if (ya(e._startAt = re.set(x, dn({
          data: "isStart",
          overwrite: false,
          parent: v,
          immediateRender: true,
          lazy: !b && Xe(o),
          startAt: null,
          delay: 0,
          onUpdate: c && function() {
            return an(e, "onUpdate");
          },
          stagger: 0
        }, s))), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (Ae || !l && !y) && e._startAt.revert(Du), l && T && n <= 0 && i <= 0) {
          n && (e._zTime = n);
          return;
        }
      } else if (f && T && !b) {
        if (n && (l = false), z = dn({
          overwrite: false,
          data: "isFromStart",
          lazy: l && !b && Xe(o),
          immediateRender: l,
          stagger: 0,
          parent: v
        }, w), N && (z[q.prop] = N), ya(e._startAt = re.set(x, z)), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (Ae ? e._startAt.revert(Du) : e._startAt.render(-1, true)), e._zTime = n, !l) t(e._startAt, Tt, Tt);
        else if (!n) return;
      }
      for (e._pt = e._ptCache = 0, o = T && Xe(o) || o && !T, V = 0; V < x.length; V++) {
        if (U = x[V], Y = U._gsap || ty(x)[V]._gsap, e._ptLookup[V] = $ = {}, Jd[Y.id] && oa.length && pc(), K = g === x ? V : g.indexOf(U), q && (k = new q()).init(U, N || w, e, K, g) !== false && (e._pt = O = new qe(e._pt, U, k.name, 0, 1, k.render, k, 0, k.priority), k._props.forEach(function(G) {
          $[G] = O;
        }), k.priority && (B = 1)), !q || N) for (z in w) We[z] && (k = Xx(z, w, e, K, U, g)) ? k.priority && (B = 1) : $[z] = O = ny.call(e, U, z, "get", w[z], K, g, 0, a.stringFilter);
        e._op && e._op[V] && e.kill(U, e._op[V]), S && e._pt && (Zi = e, Bt.killTweensOf(U, $, e.globalTime(n)), P = !e.parent, Zi = 0), e._pt && o && (Jd[Y.id] = 1);
      }
      B && Jx(e), e._onInit && e._onInit(e);
    }
    e._onUpdate = c, e._initted = (!e._op || e._pt) && !P, m && n <= 0 && A.render(Mn, true, true);
  }, k4 = function(e, n, i, a, r, s, l, o) {
    var c = (e._pt && e._ptCache || (e._ptCache = {}))[n], f, d, m, y;
    if (!c) for (c = e._ptCache[n] = [], m = e._ptLookup, y = e._targets.length; y--; ) {
      if (f = m[y][n], f && f.d && f.d._pt) for (f = f.d._pt; f && f.p !== n && f.fp !== n; ) f = f._next;
      if (!f) return nm = 1, e.vars[n] = "+=0", iy(e, l), nm = 0, o ? Jl(n + " not eligible for reset") : 1;
      c.push(f);
    }
    for (y = c.length; y--; ) d = c[y], f = d._pt || d, f.s = (a || a === 0) && !r ? a : f.s + (a || 0) + s * f.c, f.c = i - f.s, d.e && (d.e = $t(i) + Me(d.e)), d.b && (d.b = f.s + Me(d.b));
  }, X4 = function(e, n) {
    var i = e[0] ? Qa(e[0]).harness : 0, a = i && i.aliases, r, s, l, o;
    if (!a) return n;
    r = hs({}, n);
    for (s in a) if (s in r) for (o = a[s].split(","), l = o.length; l--; ) r[o[l]] = r[s];
    return r;
  }, F4 = function(e, n, i, a) {
    var r = n.ease || a || "power1.inOut", s, l;
    if (De(n)) l = i[e] || (i[e] = []), n.forEach(function(o, c) {
      return l.push({
        t: c / (n.length - 1) * 100,
        v: o,
        e: r
      });
    });
    else for (s in n) l = i[s] || (i[s] = []), s === "ease" || l.push({
      t: parseFloat(e),
      v: n[s],
      e: r
    });
  }, El = function(e, n, i, a, r) {
    return qt(e) ? e.call(n, i, a, r) : me(e) && ~e.indexOf("random(") ? Wl(e) : e;
  }, Fx = Ip + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", qx = {};
  Fe(Fx + ",id,stagger,delay,duration,paused,scrollTrigger", function(t) {
    return qx[t] = 1;
  });
  var re = function(t) {
    cx(e, t);
    function e(i, a, r, s) {
      var l;
      typeof a == "number" && (r.duration = a, a = r, r = null), l = t.call(this, s ? a : xl(a)) || this;
      var o = l.vars, c = o.duration, f = o.delay, d = o.immediateRender, m = o.stagger, y = o.overwrite, T = o.keyframes, b = o.defaults, x = o.scrollTrigger, v = o.yoyoEase, g = a.parent || Bt, S = (De(i) || hx(i) ? Ri(i[0]) : "length" in a) ? [
        i
      ] : Cn(i), A, w, V, z, O, U, B, Y;
      if (l._targets = S.length ? ty(S) : Jl("GSAP target " + i + " not found. https://gsap.com", !un.nullTargetWarn) || [], l._ptLookup = [], l._overwrite = y, T || m || au(c) || au(f)) {
        if (a = l.vars, A = l.timeline = new ze({
          data: "nested",
          defaults: b || {},
          targets: g && g.data === "nested" ? g.vars.targets : S
        }), A.kill(), A.parent = A._dp = fi(l), A._start = 0, m || au(c) || au(f)) {
          if (z = S.length, B = m && Rx(m), ti(m)) for (O in m) ~Fx.indexOf(O) && (Y || (Y = {}), Y[O] = m[O]);
          for (w = 0; w < z; w++) V = yc(a, qx), V.stagger = 0, v && (V.yoyoEase = v), Y && hs(V, Y), U = S[w], V.duration = +El(c, fi(l), w, U, S), V.delay = (+El(f, fi(l), w, U, S) || 0) - l._delay, !m && z === 1 && V.delay && (l._delay = f = V.delay, l._start += f, V.delay = 0), A.to(U, V, B ? B(w, U, S) : 0), A._ease = ct.none;
          A.duration() ? c = f = 0 : l.timeline = 0;
        } else if (T) {
          xl(dn(A.vars.defaults, {
            ease: "none"
          })), A._ease = Ja(T.ease || a.ease || "none");
          var q = 0, k, $, K;
          if (De(T)) T.forEach(function(N) {
            return A.to(S, N, ">");
          }), A.duration();
          else {
            V = {};
            for (O in T) O === "ease" || O === "easeEach" || F4(O, T[O], V, T.easeEach);
            for (O in V) for (k = V[O].sort(function(N, P) {
              return N.t - P.t;
            }), q = 0, w = 0; w < k.length; w++) $ = k[w], K = {
              ease: $.e,
              duration: ($.t - (w ? k[w - 1].t : 0)) / 100 * c
            }, K[O] = $.v, A.to(S, K, q), q += K.duration;
            A.duration() < c && A.to({}, {
              duration: c - A.duration()
            });
          }
        }
        c || l.duration(c = A.duration());
      } else l.timeline = 0;
      return y === true && !Kp && (Zi = fi(l), Bt.killTweensOf(S), Zi = 0), qn(g, fi(l), r), a.reversed && l.reverse(), a.paused && l.paused(true), (d || !c && !T && l._start === le(g._time) && Xe(d) && T4(fi(l)) && g.data !== "nested") && (l._tTime = -Tt, l.render(Math.max(0, -f) || 0)), x && wx(fi(l), x), l;
    }
    var n = e.prototype;
    return n.render = function(a, r, s) {
      var l = this._time, o = this._tDur, c = this._dur, f = a < 0, d = a > o - Tt && !f ? o : a < Tt ? 0 : a, m, y, T, b, x, v, g, S, A;
      if (!c) A4(this, a, r, s);
      else if (d !== this._tTime || !a || s || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== f || this._lazy) {
        if (m = d, S = this.timeline, this._repeat) {
          if (b = c + this._rDelay, this._repeat < -1 && f) return this.totalTime(b * 100 + a, r, s);
          if (m = le(d % b), d === o ? (T = this._repeat, m = c) : (x = le(d / b), T = ~~x, T && T === x ? (m = c, T--) : m > c && (m = c)), v = this._yoyo && T & 1, v && (A = this._yEase, m = c - m), x = ds(this._tTime, b), m === l && !s && this._initted && T === x) return this._tTime = d, this;
          T !== x && (S && this._yEase && Gx(S, v), this.vars.repeatRefresh && !v && !this._lock && m !== b && this._initted && (this._lock = s = 1, this.render(le(b * T), true).invalidate()._lock = 0));
        }
        if (!this._initted) {
          if (Mx(this, f ? a : m, s, r, d)) return this._tTime = 0, this;
          if (l !== this._time && !(s && this.vars.repeatRefresh && T !== x)) return this;
          if (c !== this._dur) return this.render(a, r, s);
        }
        if (this._tTime = d, this._time = m, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = g = (A || this._ease)(m / c), this._from && (this.ratio = g = 1 - g), !l && d && !r && !x && (an(this, "onStart"), this._tTime !== d)) return this;
        for (y = this._pt; y; ) y.r(g, y.d), y = y._next;
        S && S.render(a < 0 ? a : S._dur * S._ease(m / this._dur), r, s) || this._startAt && (this._zTime = a), this._onUpdate && !r && (f && $d(this, a, r, s), an(this, "onUpdate")), this._repeat && T !== x && this.vars.onRepeat && !r && this.parent && an(this, "onRepeat"), (d === this._tDur || !d) && this._tTime === d && (f && !this._onUpdate && $d(this, a, true, true), (a || !c) && (d === this._tDur && this._ts > 0 || !d && this._ts < 0) && ya(this, 1), !r && !(f && !l) && (d || l || v) && (an(this, d === o ? "onComplete" : "onReverseComplete", true), this._prom && !(d < o && this.timeScale() > 0) && this._prom()));
      }
      return this;
    }, n.targets = function() {
      return this._targets;
    }, n.invalidate = function(a) {
      return (!a || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(a), t.prototype.invalidate.call(this, a);
    }, n.resetTo = function(a, r, s, l, o) {
      Il || en.wake(), this._ts || this.play();
      var c = Math.min(this._dur, (this._dp._time - this._start) * this._ts), f;
      return this._initted || iy(this, c), f = this._ease(c / this._dur), k4(this, a, r, s, l, f, c, o) ? this.resetTo(a, r, s, l, 1) : (Zc(this, 0), this.parent || Ax(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
    }, n.kill = function(a, r) {
      if (r === void 0 && (r = "all"), !a && (!r || r === "all")) return this._lazy = this._pt = 0, this.parent ? nl(this) : this.scrollTrigger && this.scrollTrigger.kill(!!Ae), this;
      if (this.timeline) {
        var s = this.timeline.totalDuration();
        return this.timeline.killTweensOf(a, r, Zi && Zi.vars.overwrite !== true)._first || nl(this), this.parent && s !== this.timeline.totalDuration() && ms(this, this._dur * this.timeline._tDur / s, 0, 1), this;
      }
      var l = this._targets, o = a ? Cn(a) : l, c = this._ptLookup, f = this._pt, d, m, y, T, b, x, v;
      if ((!r || r === "all") && b4(l, o)) return r === "all" && (this._pt = 0), nl(this);
      for (d = this._op = this._op || [], r !== "all" && (me(r) && (b = {}, Fe(r, function(g) {
        return b[g] = 1;
      }), r = b), r = X4(l, r)), v = l.length; v--; ) if (~o.indexOf(l[v])) {
        m = c[v], r === "all" ? (d[v] = r, T = m, y = {}) : (y = d[v] = d[v] || {}, T = r);
        for (b in T) x = m && m[b], x && ((!("kill" in x.d) || x.d.kill(b) === true) && Kc(this, x, "_pt"), delete m[b]), y !== "all" && (y[b] = 1);
      }
      return this._initted && !this._pt && f && nl(this), this;
    }, e.to = function(a, r) {
      return new e(a, r, arguments[2]);
    }, e.from = function(a, r) {
      return Al(1, arguments);
    }, e.delayedCall = function(a, r, s, l) {
      return new e(r, 0, {
        immediateRender: false,
        lazy: false,
        overwrite: false,
        delay: a,
        onComplete: r,
        onReverseComplete: r,
        onCompleteParams: s,
        onReverseCompleteParams: s,
        callbackScope: l
      });
    }, e.fromTo = function(a, r, s) {
      return Al(2, arguments);
    }, e.set = function(a, r) {
      return r.duration = 0, r.repeatDelay || (r.repeat = 0), new e(a, r);
    }, e.killTweensOf = function(a, r, s) {
      return Bt.killTweensOf(a, r, s);
    }, e;
  }(to);
  dn(re.prototype, {
    _targets: [],
    _lazy: 0,
    _startAt: 0,
    _op: 0,
    _onInit: 0
  });
  Fe("staggerTo,staggerFrom,staggerFromTo", function(t) {
    re[t] = function() {
      var e = new ze(), n = Id.call(arguments, 0);
      return n.splice(t === "staggerFromTo" ? 5 : 4, 0, 0), e[t].apply(e, n);
    };
  });
  var ay = function(e, n, i) {
    return e[n] = i;
  }, Kx = function(e, n, i) {
    return e[n](i);
  }, q4 = function(e, n, i, a) {
    return e[n](a.fp, i);
  }, K4 = function(e, n, i) {
    return e.setAttribute(n, i);
  }, ry = function(e, n) {
    return qt(e[n]) ? Kx : Qp(e[n]) && e.setAttribute ? K4 : ay;
  }, Qx = function(e, n) {
    return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e6) / 1e6, n);
  }, Q4 = function(e, n) {
    return n.set(n.t, n.p, !!(n.s + n.c * e), n);
  }, Zx = function(e, n) {
    var i = n._pt, a = "";
    if (!e && n.b) a = n.b;
    else if (e === 1 && n.e) a = n.e;
    else {
      for (; i; ) a = i.p + (i.m ? i.m(i.s + i.c * e) : Math.round((i.s + i.c * e) * 1e4) / 1e4) + a, i = i._next;
      a += n.c;
    }
    n.set(n.t, n.p, a, n);
  }, sy = function(e, n) {
    for (var i = n._pt; i; ) i.r(e, i.d), i = i._next;
  }, Z4 = function(e, n, i, a) {
    for (var r = this._pt, s; r; ) s = r._next, r.p === a && r.modifier(e, n, i), r = s;
  }, J4 = function(e) {
    for (var n = this._pt, i, a; n; ) a = n._next, n.p === e && !n.op || n.op === e ? Kc(this, n, "_pt") : n.dep || (i = 1), n = a;
    return !i;
  }, $4 = function(e, n, i, a) {
    a.mSet(e, n, a.m.call(a.tween, i, a.mt), a);
  }, Jx = function(e) {
    for (var n = e._pt, i, a, r, s; n; ) {
      for (i = n._next, a = r; a && a.pr > n.pr; ) a = a._next;
      (n._prev = a ? a._prev : s) ? n._prev._next = n : r = n, (n._next = a) ? a._prev = n : s = n, n = i;
    }
    e._pt = r;
  }, qe = function() {
    function t(n, i, a, r, s, l, o, c, f) {
      this.t = i, this.s = r, this.c = s, this.p = a, this.r = l || Qx, this.d = o || this, this.set = c || ay, this.pr = f || 0, this._next = n, n && (n._prev = this);
    }
    var e = t.prototype;
    return e.modifier = function(i, a, r) {
      this.mSet = this.mSet || this.set, this.set = $4, this.m = i, this.mt = r, this.tween = a;
    }, t;
  }();
  Fe(Ip + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(t) {
    return Wp[t] = 1;
  });
  hn.TweenMax = hn.TweenLite = re;
  hn.TimelineLite = hn.TimelineMax = ze;
  Bt = new ze({
    sortChildren: false,
    defaults: fs,
    autoRemoveChildren: true,
    id: "root",
    smoothChildTiming: true
  });
  un.stringFilter = Hx;
  var $a = [], Ou = {}, W4 = [], Jv = 0, I4 = 0, Ah = function(e) {
    return (Ou[e] || W4).map(function(n) {
      return n();
    });
  }, im = function() {
    var e = Date.now(), n = [];
    e - Jv > 2 && (Ah("matchMediaInit"), $a.forEach(function(i) {
      var a = i.queries, r = i.conditions, s, l, o, c;
      for (l in a) s = Fn.matchMedia(a[l]).matches, s && (o = 1), s !== r[l] && (r[l] = s, c = 1);
      c && (i.revert(), o && n.push(i));
    }), Ah("matchMediaRevert"), n.forEach(function(i) {
      return i.onMatch(i, function(a) {
        return i.add(null, a);
      });
    }), Jv = e, Ah("matchMedia"));
  }, $x = function() {
    function t(n, i) {
      this.selector = i && tm(i), this.data = [], this._r = [], this.isReverted = false, this.id = I4++, n && this.add(n);
    }
    var e = t.prototype;
    return e.add = function(i, a, r) {
      qt(i) && (r = a, a = i, i = qt);
      var s = this, l = function() {
        var c = Vt, f = s.selector, d;
        return c && c !== s && c.data.push(s), r && (s.selector = tm(r)), Vt = s, d = a.apply(s, arguments), qt(d) && s._r.push(d), Vt = c, s.selector = f, s.isReverted = false, d;
      };
      return s.last = l, i === qt ? l(s, function(o) {
        return s.add(null, o);
      }) : i ? s[i] = l : l;
    }, e.ignore = function(i) {
      var a = Vt;
      Vt = null, i(this), Vt = a;
    }, e.getTweens = function() {
      var i = [];
      return this.data.forEach(function(a) {
        return a instanceof t ? i.push.apply(i, a.getTweens()) : a instanceof re && !(a.parent && a.parent.data === "nested") && i.push(a);
      }), i;
    }, e.clear = function() {
      this._r.length = this.data.length = 0;
    }, e.kill = function(i, a) {
      var r = this;
      if (i ? function() {
        for (var l = r.getTweens(), o = r.data.length, c; o--; ) c = r.data[o], c.data === "isFlip" && (c.revert(), c.getChildren(true, true, false).forEach(function(f) {
          return l.splice(l.indexOf(f), 1);
        }));
        for (l.map(function(f) {
          return {
            g: f._dur || f._delay || f._sat && !f._sat.vars.immediateRender ? f.globalTime(0) : -1 / 0,
            t: f
          };
        }).sort(function(f, d) {
          return d.g - f.g || -1 / 0;
        }).forEach(function(f) {
          return f.t.revert(i);
        }), o = r.data.length; o--; ) c = r.data[o], c instanceof ze ? c.data !== "nested" && (c.scrollTrigger && c.scrollTrigger.revert(), c.kill()) : !(c instanceof re) && c.revert && c.revert(i);
        r._r.forEach(function(f) {
          return f(i, r);
        }), r.isReverted = true;
      }() : this.data.forEach(function(l) {
        return l.kill && l.kill();
      }), this.clear(), a) for (var s = $a.length; s--; ) $a[s].id === this.id && $a.splice(s, 1);
    }, e.revert = function(i) {
      this.kill(i || {});
    }, t;
  }(), tz = function() {
    function t(n) {
      this.contexts = [], this.scope = n, Vt && Vt.data.push(this);
    }
    var e = t.prototype;
    return e.add = function(i, a, r) {
      ti(i) || (i = {
        matches: i
      });
      var s = new $x(0, r || this.scope), l = s.conditions = {}, o, c, f;
      Vt && !s.selector && (s.selector = Vt.selector), this.contexts.push(s), a = s.add("onMatch", a), s.queries = i;
      for (c in i) c === "all" ? f = 1 : (o = Fn.matchMedia(i[c]), o && ($a.indexOf(s) < 0 && $a.push(s), (l[c] = o.matches) && (f = 1), o.addListener ? o.addListener(im) : o.addEventListener("change", im)));
      return f && a(s, function(d) {
        return s.add(null, d);
      }), this;
    }, e.revert = function(i) {
      this.kill(i || {});
    }, e.kill = function(i) {
      this.contexts.forEach(function(a) {
        return a.kill(i, true);
      });
    }, t;
  }(), vc = {
    registerPlugin: function() {
      for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++) n[i] = arguments[i];
      n.forEach(function(a) {
        return Nx(a);
      });
    },
    timeline: function(e) {
      return new ze(e);
    },
    getTweensOf: function(e, n) {
      return Bt.getTweensOf(e, n);
    },
    getProperty: function(e, n, i, a) {
      me(e) && (e = Cn(e)[0]);
      var r = Qa(e || {}).get, s = i ? xx : Tx;
      return i === "native" && (i = ""), e && (n ? s((We[n] && We[n].get || r)(e, n, i, a)) : function(l, o, c) {
        return s((We[l] && We[l].get || r)(e, l, o, c));
      });
    },
    quickSetter: function(e, n, i) {
      if (e = Cn(e), e.length > 1) {
        var a = e.map(function(f) {
          return Ze.quickSetter(f, n, i);
        }), r = a.length;
        return function(f) {
          for (var d = r; d--; ) a[d](f);
        };
      }
      e = e[0] || {};
      var s = We[n], l = Qa(e), o = l.harness && (l.harness.aliases || {})[n] || n, c = s ? function(f) {
        var d = new s();
        Yr._pt = 0, d.init(e, i ? f + i : f, Yr, 0, [
          e
        ]), d.render(1, d), Yr._pt && sy(1, Yr);
      } : l.set(e, o);
      return s ? c : function(f) {
        return c(e, o, i ? f + i : f, l, 1);
      };
    },
    quickTo: function(e, n, i) {
      var a, r = Ze.to(e, dn((a = {}, a[n] = "+=0.1", a.paused = true, a.stagger = 0, a), i || {})), s = function(o, c, f) {
        return r.resetTo(n, o, c, f);
      };
      return s.tween = r, s;
    },
    isTweening: function(e) {
      return Bt.getTweensOf(e, true).length > 0;
    },
    defaults: function(e) {
      return e && e.ease && (e.ease = Ja(e.ease, fs.ease)), Fv(fs, e || {});
    },
    config: function(e) {
      return Fv(un, e || {});
    },
    registerEffect: function(e) {
      var n = e.name, i = e.effect, a = e.plugins, r = e.defaults, s = e.extendTimeline;
      (a || "").split(",").forEach(function(l) {
        return l && !We[l] && !hn[l] && Jl(n + " effect requires " + l + " plugin.");
      }), bh[n] = function(l, o, c) {
        return i(Cn(l), dn(o || {}, r), c);
      }, s && (ze.prototype[n] = function(l, o, c) {
        return this.add(bh[n](l, ti(o) ? o : (c = o) && {}, this), c);
      });
    },
    registerEase: function(e, n) {
      ct[e] = Ja(n);
    },
    parseEase: function(e, n) {
      return arguments.length ? Ja(e, n) : ct;
    },
    getById: function(e) {
      return Bt.getById(e);
    },
    exportRoot: function(e, n) {
      e === void 0 && (e = {});
      var i = new ze(e), a, r;
      for (i.smoothChildTiming = Xe(e.smoothChildTiming), Bt.remove(i), i._dp = 0, i._time = i._tTime = Bt._time, a = Bt._first; a; ) r = a._next, (n || !(!a._dur && a instanceof re && a.vars.onComplete === a._targets[0])) && qn(i, a, a._start - a._delay), a = r;
      return qn(Bt, i, 0), i;
    },
    context: function(e, n) {
      return e ? new $x(e, n) : Vt;
    },
    matchMedia: function(e) {
      return new tz(e);
    },
    matchMediaRefresh: function() {
      return $a.forEach(function(e) {
        var n = e.conditions, i, a;
        for (a in n) n[a] && (n[a] = false, i = 1);
        i && e.revert();
      }) || im();
    },
    addEventListener: function(e, n) {
      var i = Ou[e] || (Ou[e] = []);
      ~i.indexOf(n) || i.push(n);
    },
    removeEventListener: function(e, n) {
      var i = Ou[e], a = i && i.indexOf(n);
      a >= 0 && i.splice(a, 1);
    },
    utils: {
      wrap: z4,
      wrapYoyo: U4,
      distribute: Rx,
      random: zx,
      snap: Ox,
      normalize: O4,
      getUnit: Me,
      clamp: M4,
      splitColor: jx,
      toArray: Cn,
      selector: tm,
      mapRange: Vx,
      pipe: D4,
      unitize: R4,
      interpolate: V4,
      shuffle: Dx
    },
    install: gx,
    effects: bh,
    ticker: en,
    updateRoot: ze.updateRoot,
    plugins: We,
    globalTimeline: Bt,
    core: {
      PropTween: qe,
      globals: vx,
      Tween: re,
      Timeline: ze,
      Animation: to,
      getCache: Qa,
      _removeLinkedListItem: Kc,
      reverting: function() {
        return Ae;
      },
      context: function(e) {
        return e && Vt && (Vt.data.push(e), e._ctx = Vt), Vt;
      },
      suppressOverwrites: function(e) {
        return Kp = e;
      }
    }
  };
  Fe("to,from,fromTo,delayedCall,set,killTweensOf", function(t) {
    return vc[t] = re[t];
  });
  en.add(ze.updateRoot);
  Yr = vc.to({}, {
    duration: 0
  });
  var ez = function(e, n) {
    for (var i = e._pt; i && i.p !== n && i.op !== n && i.fp !== n; ) i = i._next;
    return i;
  }, nz = function(e, n) {
    var i = e._targets, a, r, s;
    for (a in n) for (r = i.length; r--; ) s = e._ptLookup[r][a], s && (s = s.d) && (s._pt && (s = ez(s, a)), s && s.modifier && s.modifier(n[a], e, i[r], a));
  }, Eh = function(e, n) {
    return {
      name: e,
      headless: 1,
      rawVars: 1,
      init: function(a, r, s) {
        s._onInit = function(l) {
          var o, c;
          if (me(r) && (o = {}, Fe(r, function(f) {
            return o[f] = 1;
          }), r = o), n) {
            o = {};
            for (c in r) o[c] = n(r[c]);
            r = o;
          }
          nz(l, r);
        };
      }
    };
  }, Ze = vc.registerPlugin({
    name: "attr",
    init: function(e, n, i, a, r) {
      var s, l, o;
      this.tween = i;
      for (s in n) o = e.getAttribute(s) || "", l = this.add(e, "setAttribute", (o || 0) + "", n[s], a, r, 0, 0, s), l.op = s, l.b = o, this._props.push(s);
    },
    render: function(e, n) {
      for (var i = n._pt; i; ) Ae ? i.set(i.t, i.p, i.b, i) : i.r(e, i.d), i = i._next;
    }
  }, {
    name: "endArray",
    headless: 1,
    init: function(e, n) {
      for (var i = n.length; i--; ) this.add(e, i, e[i] || 0, n[i], 0, 0, 0, 0, 0, 1);
    }
  }, Eh("roundProps", em), Eh("modifiers"), Eh("snap", Ox)) || vc;
  re.version = ze.version = Ze.version = "3.13.0";
  yx = 1;
  Zp() && ps();
  ct.Power0;
  ct.Power1;
  ct.Power2;
  ct.Power3;
  ct.Power4;
  ct.Linear;
  ct.Quad;
  ct.Cubic;
  ct.Quart;
  ct.Quint;
  ct.Strong;
  ct.Elastic;
  ct.Back;
  ct.SteppedEase;
  ct.Bounce;
  ct.Sine;
  ct.Expo;
  ct.Circ;
  var $v, Ji, Jr, ly, Ya, Wv, oy, iz = function() {
    return typeof window < "u";
  }, Oi = {}, ja = 180 / Math.PI, $r = Math.PI / 180, gr = Math.atan2, Iv = 1e8, uy = /([A-Z])/g, az = /(left|right|width|margin|padding|x)/i, rz = /[\s,\(]\S/, Jn = {
    autoAlpha: "opacity,visibility",
    scale: "scaleX,scaleY",
    alpha: "opacity"
  }, am = function(e, n) {
    return n.set(n.t, n.p, Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u, n);
  }, sz = function(e, n) {
    return n.set(n.t, n.p, e === 1 ? n.e : Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u, n);
  }, lz = function(e, n) {
    return n.set(n.t, n.p, e ? Math.round((n.s + n.c * e) * 1e4) / 1e4 + n.u : n.b, n);
  }, oz = function(e, n) {
    var i = n.s + n.c * e;
    n.set(n.t, n.p, ~~(i + (i < 0 ? -0.5 : 0.5)) + n.u, n);
  }, Wx = function(e, n) {
    return n.set(n.t, n.p, e ? n.e : n.b, n);
  }, Ix = function(e, n) {
    return n.set(n.t, n.p, e !== 1 ? n.b : n.e, n);
  }, uz = function(e, n, i) {
    return e.style[n] = i;
  }, cz = function(e, n, i) {
    return e.style.setProperty(n, i);
  }, fz = function(e, n, i) {
    return e._gsap[n] = i;
  }, hz = function(e, n, i) {
    return e._gsap.scaleX = e._gsap.scaleY = i;
  }, dz = function(e, n, i, a, r) {
    var s = e._gsap;
    s.scaleX = s.scaleY = i, s.renderTransform(r, s);
  }, mz = function(e, n, i, a, r) {
    var s = e._gsap;
    s[n] = i, s.renderTransform(r, s);
  }, Yt = "transform", Ke = Yt + "Origin", pz = function t(e, n) {
    var i = this, a = this.target, r = a.style, s = a._gsap;
    if (e in Oi && r) {
      if (this.tfm = this.tfm || {}, e !== "transform") e = Jn[e] || e, ~e.indexOf(",") ? e.split(",").forEach(function(l) {
        return i.tfm[l] = di(a, l);
      }) : this.tfm[e] = s.x ? s[e] : di(a, e), e === Ke && (this.tfm.zOrigin = s.zOrigin);
      else return Jn.transform.split(",").forEach(function(l) {
        return t.call(i, l, n);
      });
      if (this.props.indexOf(Yt) >= 0) return;
      s.svg && (this.svgo = a.getAttribute("data-svg-origin"), this.props.push(Ke, n, "")), e = Yt;
    }
    (r || n) && this.props.push(e, n, r[e]);
  }, t2 = function(e) {
    e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
  }, yz = function() {
    var e = this.props, n = this.target, i = n.style, a = n._gsap, r, s;
    for (r = 0; r < e.length; r += 3) e[r + 1] ? e[r + 1] === 2 ? n[e[r]](e[r + 2]) : n[e[r]] = e[r + 2] : e[r + 2] ? i[e[r]] = e[r + 2] : i.removeProperty(e[r].substr(0, 2) === "--" ? e[r] : e[r].replace(uy, "-$1").toLowerCase());
    if (this.tfm) {
      for (s in this.tfm) a[s] = this.tfm[s];
      a.svg && (a.renderTransform(), n.setAttribute("data-svg-origin", this.svgo || "")), r = oy(), (!r || !r.isStart) && !i[Yt] && (t2(i), a.zOrigin && i[Ke] && (i[Ke] += " " + a.zOrigin + "px", a.zOrigin = 0, a.renderTransform()), a.uncache = 1);
    }
  }, e2 = function(e, n) {
    var i = {
      target: e,
      props: [],
      revert: yz,
      save: pz
    };
    return e._gsap || Ze.core.getCache(e), n && e.style && e.nodeType && n.split(",").forEach(function(a) {
      return i.save(a);
    }), i;
  }, n2, rm = function(e, n) {
    var i = Ji.createElementNS ? Ji.createElementNS((n || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Ji.createElement(e);
    return i && i.style ? i : Ji.createElement(e);
  }, Dn = function t(e, n, i) {
    var a = getComputedStyle(e);
    return a[n] || a.getPropertyValue(n.replace(uy, "-$1").toLowerCase()) || a.getPropertyValue(n) || !i && t(e, ys(n) || n, 1) || "";
  }, t_ = "O,Moz,ms,Ms,Webkit".split(","), ys = function(e, n, i) {
    var a = n || Ya, r = a.style, s = 5;
    if (e in r && !i) return e;
    for (e = e.charAt(0).toUpperCase() + e.substr(1); s-- && !(t_[s] + e in r); ) ;
    return s < 0 ? null : (s === 3 ? "ms" : s >= 0 ? t_[s] : "") + e;
  }, sm = function() {
    iz() && window.document && ($v = window, Ji = $v.document, Jr = Ji.documentElement, Ya = rm("div") || {
      style: {}
    }, rm("div"), Yt = ys(Yt), Ke = Yt + "Origin", Ya.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", n2 = !!ys("perspective"), oy = Ze.core.reverting, ly = 1);
  }, e_ = function(e) {
    var n = e.ownerSVGElement, i = rm("svg", n && n.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), a = e.cloneNode(true), r;
    a.style.display = "block", i.appendChild(a), Jr.appendChild(i);
    try {
      r = a.getBBox();
    } catch {
    }
    return i.removeChild(a), Jr.removeChild(i), r;
  }, n_ = function(e, n) {
    for (var i = n.length; i--; ) if (e.hasAttribute(n[i])) return e.getAttribute(n[i]);
  }, i2 = function(e) {
    var n, i;
    try {
      n = e.getBBox();
    } catch {
      n = e_(e), i = 1;
    }
    return n && (n.width || n.height) || i || (n = e_(e)), n && !n.width && !n.x && !n.y ? {
      x: +n_(e, [
        "x",
        "cx",
        "x1"
      ]) || 0,
      y: +n_(e, [
        "y",
        "cy",
        "y1"
      ]) || 0,
      width: 0,
      height: 0
    } : n;
  }, a2 = function(e) {
    return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && i2(e));
  }, ar = function(e, n) {
    if (n) {
      var i = e.style, a;
      n in Oi && n !== Ke && (n = Yt), i.removeProperty ? (a = n.substr(0, 2), (a === "ms" || n.substr(0, 6) === "webkit") && (n = "-" + n), i.removeProperty(a === "--" ? n : n.replace(uy, "-$1").toLowerCase())) : i.removeAttribute(n);
    }
  }, $i = function(e, n, i, a, r, s) {
    var l = new qe(e._pt, n, i, 0, 1, s ? Ix : Wx);
    return e._pt = l, l.b = a, l.e = r, e._props.push(i), l;
  }, i_ = {
    deg: 1,
    rad: 1,
    turn: 1
  }, gz = {
    grid: 1,
    flex: 1
  }, ga = function t(e, n, i, a) {
    var r = parseFloat(i) || 0, s = (i + "").trim().substr((r + "").length) || "px", l = Ya.style, o = az.test(n), c = e.tagName.toLowerCase() === "svg", f = (c ? "client" : "offset") + (o ? "Width" : "Height"), d = 100, m = a === "px", y = a === "%", T, b, x, v;
    if (a === s || !r || i_[a] || i_[s]) return r;
    if (s !== "px" && !m && (r = t(e, n, i, "px")), v = e.getCTM && a2(e), (y || s === "%") && (Oi[n] || ~n.indexOf("adius"))) return T = v ? e.getBBox()[o ? "width" : "height"] : e[f], $t(y ? r / T * d : r / 100 * T);
    if (l[o ? "width" : "height"] = d + (m ? s : a), b = a !== "rem" && ~n.indexOf("adius") || a === "em" && e.appendChild && !c ? e : e.parentNode, v && (b = (e.ownerSVGElement || {}).parentNode), (!b || b === Ji || !b.appendChild) && (b = Ji.body), x = b._gsap, x && y && x.width && o && x.time === en.time && !x.uncache) return $t(r / x.width * d);
    if (y && (n === "height" || n === "width")) {
      var g = e.style[n];
      e.style[n] = d + a, T = e[f], g ? e.style[n] = g : ar(e, n);
    } else (y || s === "%") && !gz[Dn(b, "display")] && (l.position = Dn(e, "position")), b === e && (l.position = "static"), b.appendChild(Ya), T = Ya[f], b.removeChild(Ya), l.position = "absolute";
    return o && y && (x = Qa(b), x.time = en.time, x.width = b[f]), $t(m ? T * r / d : T && r ? d / T * r : 0);
  }, di = function(e, n, i, a) {
    var r;
    return ly || sm(), n in Jn && n !== "transform" && (n = Jn[n], ~n.indexOf(",") && (n = n.split(",")[0])), Oi[n] && n !== "transform" ? (r = no(e, a), r = n !== "transformOrigin" ? r[n] : r.svg ? r.origin : bc(Dn(e, Ke)) + " " + r.zOrigin + "px") : (r = e.style[n], (!r || r === "auto" || a || ~(r + "").indexOf("calc(")) && (r = _c[n] && _c[n](e, n, i) || Dn(e, n) || bx(e, n) || (n === "opacity" ? 1 : 0))), i && !~(r + "").trim().indexOf(" ") ? ga(e, n, r, i) + i : r;
  }, vz = function(e, n, i, a) {
    if (!i || i === "none") {
      var r = ys(n, e, 1), s = r && Dn(e, r, 1);
      s && s !== i ? (n = r, i = s) : n === "borderColor" && (i = Dn(e, "borderTopColor"));
    }
    var l = new qe(this._pt, e.style, n, 0, 1, Zx), o = 0, c = 0, f, d, m, y, T, b, x, v, g, S, A, w;
    if (l.b = i, l.e = a, i += "", a += "", a.substring(0, 6) === "var(--" && (a = Dn(e, a.substring(4, a.indexOf(")")))), a === "auto" && (b = e.style[n], e.style[n] = a, a = Dn(e, n) || a, b ? e.style[n] = b : ar(e, n)), f = [
      i,
      a
    ], Hx(f), i = f[0], a = f[1], m = i.match(Hr) || [], w = a.match(Hr) || [], w.length) {
      for (; d = Hr.exec(a); ) x = d[0], g = a.substring(o, d.index), T ? T = (T + 1) % 5 : (g.substr(-5) === "rgba(" || g.substr(-5) === "hsla(") && (T = 1), x !== (b = m[c++] || "") && (y = parseFloat(b) || 0, A = b.substr((y + "").length), x.charAt(1) === "=" && (x = Zr(y, x) + A), v = parseFloat(x), S = x.substr((v + "").length), o = Hr.lastIndex - S.length, S || (S = S || un.units[n] || A, o === a.length && (a += S, l.e += S)), A !== S && (y = ga(e, n, b, S) || 0), l._pt = {
        _next: l._pt,
        p: g || c === 1 ? g : ",",
        s: y,
        c: v - y,
        m: T && T < 4 || n === "zIndex" ? Math.round : 0
      });
      l.c = o < a.length ? a.substring(o, a.length) : "";
    } else l.r = n === "display" && a === "none" ? Ix : Wx;
    return mx.test(a) && (l.e = 0), this._pt = l, l;
  }, a_ = {
    top: "0%",
    bottom: "100%",
    left: "0%",
    right: "100%",
    center: "50%"
  }, _z = function(e) {
    var n = e.split(" "), i = n[0], a = n[1] || "50%";
    return (i === "top" || i === "bottom" || a === "left" || a === "right") && (e = i, i = a, a = e), n[0] = a_[i] || i, n[1] = a_[a] || a, n.join(" ");
  }, bz = function(e, n) {
    if (n.tween && n.tween._time === n.tween._dur) {
      var i = n.t, a = i.style, r = n.u, s = i._gsap, l, o, c;
      if (r === "all" || r === true) a.cssText = "", o = 1;
      else for (r = r.split(","), c = r.length; --c > -1; ) l = r[c], Oi[l] && (o = 1, l = l === "transformOrigin" ? Ke : Yt), ar(i, l);
      o && (ar(i, Yt), s && (s.svg && i.removeAttribute("transform"), a.scale = a.rotate = a.translate = "none", no(i, 1), s.uncache = 1, t2(a)));
    }
  }, _c = {
    clearProps: function(e, n, i, a, r) {
      if (r.data !== "isFromStart") {
        var s = e._pt = new qe(e._pt, n, i, 0, 0, bz);
        return s.u = a, s.pr = -10, s.tween = r, e._props.push(i), 1;
      }
    }
  }, eo = [
    1,
    0,
    0,
    1,
    0,
    0
  ], r2 = {}, s2 = function(e) {
    return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
  }, r_ = function(e) {
    var n = Dn(e, Yt);
    return s2(n) ? eo : n.substr(7).match(dx).map($t);
  }, cy = function(e, n) {
    var i = e._gsap || Qa(e), a = e.style, r = r_(e), s, l, o, c;
    return i.svg && e.getAttribute("transform") ? (o = e.transform.baseVal.consolidate().matrix, r = [
      o.a,
      o.b,
      o.c,
      o.d,
      o.e,
      o.f
    ], r.join(",") === "1,0,0,1,0,0" ? eo : r) : (r === eo && !e.offsetParent && e !== Jr && !i.svg && (o = a.display, a.display = "block", s = e.parentNode, (!s || !e.offsetParent && !e.getBoundingClientRect().width) && (c = 1, l = e.nextElementSibling, Jr.appendChild(e)), r = r_(e), o ? a.display = o : ar(e, "display"), c && (l ? s.insertBefore(e, l) : s ? s.appendChild(e) : Jr.removeChild(e))), n && r.length > 6 ? [
      r[0],
      r[1],
      r[4],
      r[5],
      r[12],
      r[13]
    ] : r);
  }, lm = function(e, n, i, a, r, s) {
    var l = e._gsap, o = r || cy(e, true), c = l.xOrigin || 0, f = l.yOrigin || 0, d = l.xOffset || 0, m = l.yOffset || 0, y = o[0], T = o[1], b = o[2], x = o[3], v = o[4], g = o[5], S = n.split(" "), A = parseFloat(S[0]) || 0, w = parseFloat(S[1]) || 0, V, z, O, U;
    i ? o !== eo && (z = y * x - T * b) && (O = A * (x / z) + w * (-b / z) + (b * g - x * v) / z, U = A * (-T / z) + w * (y / z) - (y * g - T * v) / z, A = O, w = U) : (V = i2(e), A = V.x + (~S[0].indexOf("%") ? A / 100 * V.width : A), w = V.y + (~(S[1] || S[0]).indexOf("%") ? w / 100 * V.height : w)), a || a !== false && l.smooth ? (v = A - c, g = w - f, l.xOffset = d + (v * y + g * b) - v, l.yOffset = m + (v * T + g * x) - g) : l.xOffset = l.yOffset = 0, l.xOrigin = A, l.yOrigin = w, l.smooth = !!a, l.origin = n, l.originIsAbsolute = !!i, e.style[Ke] = "0px 0px", s && ($i(s, l, "xOrigin", c, A), $i(s, l, "yOrigin", f, w), $i(s, l, "xOffset", d, l.xOffset), $i(s, l, "yOffset", m, l.yOffset)), e.setAttribute("data-svg-origin", A + " " + w);
  }, no = function(e, n) {
    var i = e._gsap || new kx(e);
    if ("x" in i && !n && !i.uncache) return i;
    var a = e.style, r = i.scaleX < 0, s = "px", l = "deg", o = getComputedStyle(e), c = Dn(e, Ke) || "0", f, d, m, y, T, b, x, v, g, S, A, w, V, z, O, U, B, Y, q, k, $, K, N, P, G, Q, it, Pt, Kt, te, Nt, pe;
    return f = d = m = b = x = v = g = S = A = 0, y = T = 1, i.svg = !!(e.getCTM && a2(e)), o.translate && ((o.translate !== "none" || o.scale !== "none" || o.rotate !== "none") && (a[Yt] = (o.translate !== "none" ? "translate3d(" + (o.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (o.rotate !== "none" ? "rotate(" + o.rotate + ") " : "") + (o.scale !== "none" ? "scale(" + o.scale.split(" ").join(",") + ") " : "") + (o[Yt] !== "none" ? o[Yt] : "")), a.scale = a.rotate = a.translate = "none"), z = cy(e, i.svg), i.svg && (i.uncache ? (G = e.getBBox(), c = i.xOrigin - G.x + "px " + (i.yOrigin - G.y) + "px", P = "") : P = !n && e.getAttribute("data-svg-origin"), lm(e, P || c, !!P || i.originIsAbsolute, i.smooth !== false, z)), w = i.xOrigin || 0, V = i.yOrigin || 0, z !== eo && (Y = z[0], q = z[1], k = z[2], $ = z[3], f = K = z[4], d = N = z[5], z.length === 6 ? (y = Math.sqrt(Y * Y + q * q), T = Math.sqrt($ * $ + k * k), b = Y || q ? gr(q, Y) * ja : 0, g = k || $ ? gr(k, $) * ja + b : 0, g && (T *= Math.abs(Math.cos(g * $r))), i.svg && (f -= w - (w * Y + V * k), d -= V - (w * q + V * $))) : (pe = z[6], te = z[7], it = z[8], Pt = z[9], Kt = z[10], Nt = z[11], f = z[12], d = z[13], m = z[14], O = gr(pe, Kt), x = O * ja, O && (U = Math.cos(-O), B = Math.sin(-O), P = K * U + it * B, G = N * U + Pt * B, Q = pe * U + Kt * B, it = K * -B + it * U, Pt = N * -B + Pt * U, Kt = pe * -B + Kt * U, Nt = te * -B + Nt * U, K = P, N = G, pe = Q), O = gr(-k, Kt), v = O * ja, O && (U = Math.cos(-O), B = Math.sin(-O), P = Y * U - it * B, G = q * U - Pt * B, Q = k * U - Kt * B, Nt = $ * B + Nt * U, Y = P, q = G, k = Q), O = gr(q, Y), b = O * ja, O && (U = Math.cos(O), B = Math.sin(O), P = Y * U + q * B, G = K * U + N * B, q = q * U - Y * B, N = N * U - K * B, Y = P, K = G), x && Math.abs(x) + Math.abs(b) > 359.9 && (x = b = 0, v = 180 - v), y = $t(Math.sqrt(Y * Y + q * q + k * k)), T = $t(Math.sqrt(N * N + pe * pe)), O = gr(K, N), g = Math.abs(O) > 2e-4 ? O * ja : 0, A = Nt ? 1 / (Nt < 0 ? -Nt : Nt) : 0), i.svg && (P = e.getAttribute("transform"), i.forceCSS = e.setAttribute("transform", "") || !s2(Dn(e, Yt)), P && e.setAttribute("transform", P))), Math.abs(g) > 90 && Math.abs(g) < 270 && (r ? (y *= -1, g += b <= 0 ? 180 : -180, b += b <= 0 ? 180 : -180) : (T *= -1, g += g <= 0 ? 180 : -180)), n = n || i.uncache, i.x = f - ((i.xPercent = f && (!n && i.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-f) ? -50 : 0))) ? e.offsetWidth * i.xPercent / 100 : 0) + s, i.y = d - ((i.yPercent = d && (!n && i.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-d) ? -50 : 0))) ? e.offsetHeight * i.yPercent / 100 : 0) + s, i.z = m + s, i.scaleX = $t(y), i.scaleY = $t(T), i.rotation = $t(b) + l, i.rotationX = $t(x) + l, i.rotationY = $t(v) + l, i.skewX = g + l, i.skewY = S + l, i.transformPerspective = A + s, (i.zOrigin = parseFloat(c.split(" ")[2]) || !n && i.zOrigin || 0) && (a[Ke] = bc(c)), i.xOffset = i.yOffset = 0, i.force3D = un.force3D, i.renderTransform = i.svg ? Tz : n2 ? l2 : Sz, i.uncache = 0, i;
  }, bc = function(e) {
    return (e = e.split(" "))[0] + " " + e[1];
  }, wh = function(e, n, i) {
    var a = Me(n);
    return $t(parseFloat(n) + parseFloat(ga(e, "x", i + "px", a))) + a;
  }, Sz = function(e, n) {
    n.z = "0px", n.rotationY = n.rotationX = "0deg", n.force3D = 0, l2(e, n);
  }, Ra = "0deg", Zs = "0px", Oa = ") ", l2 = function(e, n) {
    var i = n || this, a = i.xPercent, r = i.yPercent, s = i.x, l = i.y, o = i.z, c = i.rotation, f = i.rotationY, d = i.rotationX, m = i.skewX, y = i.skewY, T = i.scaleX, b = i.scaleY, x = i.transformPerspective, v = i.force3D, g = i.target, S = i.zOrigin, A = "", w = v === "auto" && e && e !== 1 || v === true;
    if (S && (d !== Ra || f !== Ra)) {
      var V = parseFloat(f) * $r, z = Math.sin(V), O = Math.cos(V), U;
      V = parseFloat(d) * $r, U = Math.cos(V), s = wh(g, s, z * U * -S), l = wh(g, l, -Math.sin(V) * -S), o = wh(g, o, O * U * -S + S);
    }
    x !== Zs && (A += "perspective(" + x + Oa), (a || r) && (A += "translate(" + a + "%, " + r + "%) "), (w || s !== Zs || l !== Zs || o !== Zs) && (A += o !== Zs || w ? "translate3d(" + s + ", " + l + ", " + o + ") " : "translate(" + s + ", " + l + Oa), c !== Ra && (A += "rotate(" + c + Oa), f !== Ra && (A += "rotateY(" + f + Oa), d !== Ra && (A += "rotateX(" + d + Oa), (m !== Ra || y !== Ra) && (A += "skew(" + m + ", " + y + Oa), (T !== 1 || b !== 1) && (A += "scale(" + T + ", " + b + Oa), g.style[Yt] = A || "translate(0, 0)";
  }, Tz = function(e, n) {
    var i = n || this, a = i.xPercent, r = i.yPercent, s = i.x, l = i.y, o = i.rotation, c = i.skewX, f = i.skewY, d = i.scaleX, m = i.scaleY, y = i.target, T = i.xOrigin, b = i.yOrigin, x = i.xOffset, v = i.yOffset, g = i.forceCSS, S = parseFloat(s), A = parseFloat(l), w, V, z, O, U;
    o = parseFloat(o), c = parseFloat(c), f = parseFloat(f), f && (f = parseFloat(f), c += f, o += f), o || c ? (o *= $r, c *= $r, w = Math.cos(o) * d, V = Math.sin(o) * d, z = Math.sin(o - c) * -m, O = Math.cos(o - c) * m, c && (f *= $r, U = Math.tan(c - f), U = Math.sqrt(1 + U * U), z *= U, O *= U, f && (U = Math.tan(f), U = Math.sqrt(1 + U * U), w *= U, V *= U)), w = $t(w), V = $t(V), z = $t(z), O = $t(O)) : (w = d, O = m, V = z = 0), (S && !~(s + "").indexOf("px") || A && !~(l + "").indexOf("px")) && (S = ga(y, "x", s, "px"), A = ga(y, "y", l, "px")), (T || b || x || v) && (S = $t(S + T - (T * w + b * z) + x), A = $t(A + b - (T * V + b * O) + v)), (a || r) && (U = y.getBBox(), S = $t(S + a / 100 * U.width), A = $t(A + r / 100 * U.height)), U = "matrix(" + w + "," + V + "," + z + "," + O + "," + S + "," + A + ")", y.setAttribute("transform", U), g && (y.style[Yt] = U);
  }, xz = function(e, n, i, a, r) {
    var s = 360, l = me(r), o = parseFloat(r) * (l && ~r.indexOf("rad") ? ja : 1), c = o - a, f = a + c + "deg", d, m;
    return l && (d = r.split("_")[1], d === "short" && (c %= s, c !== c % (s / 2) && (c += c < 0 ? s : -s)), d === "cw" && c < 0 ? c = (c + s * Iv) % s - ~~(c / s) * s : d === "ccw" && c > 0 && (c = (c - s * Iv) % s - ~~(c / s) * s)), e._pt = m = new qe(e._pt, n, i, a, c, sz), m.e = f, m.u = "deg", e._props.push(i), m;
  }, s_ = function(e, n) {
    for (var i in n) e[i] = n[i];
    return e;
  }, Az = function(e, n, i) {
    var a = s_({}, i._gsap), r = "perspective,force3D,transformOrigin,svgOrigin", s = i.style, l, o, c, f, d, m, y, T;
    a.svg ? (c = i.getAttribute("transform"), i.setAttribute("transform", ""), s[Yt] = n, l = no(i, 1), ar(i, Yt), i.setAttribute("transform", c)) : (c = getComputedStyle(i)[Yt], s[Yt] = n, l = no(i, 1), s[Yt] = c);
    for (o in Oi) c = a[o], f = l[o], c !== f && r.indexOf(o) < 0 && (y = Me(c), T = Me(f), d = y !== T ? ga(i, o, c, T) : parseFloat(c), m = parseFloat(f), e._pt = new qe(e._pt, l, o, d, m - d, am), e._pt.u = T || 0, e._props.push(o));
    s_(l, a);
  };
  Fe("padding,margin,Width,Radius", function(t, e) {
    var n = "Top", i = "Right", a = "Bottom", r = "Left", s = (e < 3 ? [
      n,
      i,
      a,
      r
    ] : [
      n + r,
      n + i,
      a + i,
      a + r
    ]).map(function(l) {
      return e < 2 ? t + l : "border" + l + t;
    });
    _c[e > 1 ? "border" + t : t] = function(l, o, c, f, d) {
      var m, y;
      if (arguments.length < 4) return m = s.map(function(T) {
        return di(l, T, c);
      }), y = m.join(" "), y.split(m[0]).length === 5 ? m[0] : y;
      m = (f + "").split(" "), y = {}, s.forEach(function(T, b) {
        return y[T] = m[b] = m[b] || m[(b - 1) / 2 | 0];
      }), l.init(o, y, d);
    };
  });
  var o2 = {
    name: "css",
    register: sm,
    targetTest: function(e) {
      return e.style && e.nodeType;
    },
    init: function(e, n, i, a, r) {
      var s = this._props, l = e.style, o = i.vars.startAt, c, f, d, m, y, T, b, x, v, g, S, A, w, V, z, O;
      ly || sm(), this.styles = this.styles || e2(e), O = this.styles.props, this.tween = i;
      for (b in n) if (b !== "autoRound" && (f = n[b], !(We[b] && Xx(b, n, i, a, e, r)))) {
        if (y = typeof f, T = _c[b], y === "function" && (f = f.call(i, a, e, r), y = typeof f), y === "string" && ~f.indexOf("random(") && (f = Wl(f)), T) T(this, e, b, f, i) && (z = 1);
        else if (b.substr(0, 2) === "--") c = (getComputedStyle(e).getPropertyValue(b) + "").trim(), f += "", ua.lastIndex = 0, ua.test(c) || (x = Me(c), v = Me(f)), v ? x !== v && (c = ga(e, b, c, v) + v) : x && (f += x), this.add(l, "setProperty", c, f, a, r, 0, 0, b), s.push(b), O.push(b, 0, l[b]);
        else if (y !== "undefined") {
          if (o && b in o ? (c = typeof o[b] == "function" ? o[b].call(i, a, e, r) : o[b], me(c) && ~c.indexOf("random(") && (c = Wl(c)), Me(c + "") || c === "auto" || (c += un.units[b] || Me(di(e, b)) || ""), (c + "").charAt(1) === "=" && (c = di(e, b))) : c = di(e, b), m = parseFloat(c), g = y === "string" && f.charAt(1) === "=" && f.substr(0, 2), g && (f = f.substr(2)), d = parseFloat(f), b in Jn && (b === "autoAlpha" && (m === 1 && di(e, "visibility") === "hidden" && d && (m = 0), O.push("visibility", 0, l.visibility), $i(this, l, "visibility", m ? "inherit" : "hidden", d ? "inherit" : "hidden", !d)), b !== "scale" && b !== "transform" && (b = Jn[b], ~b.indexOf(",") && (b = b.split(",")[0]))), S = b in Oi, S) {
            if (this.styles.save(b), y === "string" && f.substring(0, 6) === "var(--" && (f = Dn(e, f.substring(4, f.indexOf(")"))), d = parseFloat(f)), A || (w = e._gsap, w.renderTransform && !n.parseTransform || no(e, n.parseTransform), V = n.smoothOrigin !== false && w.smooth, A = this._pt = new qe(this._pt, l, Yt, 0, 1, w.renderTransform, w, 0, -1), A.dep = 1), b === "scale") this._pt = new qe(this._pt, w, "scaleY", w.scaleY, (g ? Zr(w.scaleY, g + d) : d) - w.scaleY || 0, am), this._pt.u = 0, s.push("scaleY", b), b += "X";
            else if (b === "transformOrigin") {
              O.push(Ke, 0, l[Ke]), f = _z(f), w.svg ? lm(e, f, 0, V, 0, this) : (v = parseFloat(f.split(" ")[2]) || 0, v !== w.zOrigin && $i(this, w, "zOrigin", w.zOrigin, v), $i(this, l, b, bc(c), bc(f)));
              continue;
            } else if (b === "svgOrigin") {
              lm(e, f, 1, V, 0, this);
              continue;
            } else if (b in r2) {
              xz(this, w, b, m, g ? Zr(m, g + f) : f);
              continue;
            } else if (b === "smoothOrigin") {
              $i(this, w, "smooth", w.smooth, f);
              continue;
            } else if (b === "force3D") {
              w[b] = f;
              continue;
            } else if (b === "transform") {
              Az(this, f, e);
              continue;
            }
          } else b in l || (b = ys(b) || b);
          if (S || (d || d === 0) && (m || m === 0) && !rz.test(f) && b in l) x = (c + "").substr((m + "").length), d || (d = 0), v = Me(f) || (b in un.units ? un.units[b] : x), x !== v && (m = ga(e, b, c, v)), this._pt = new qe(this._pt, S ? w : l, b, m, (g ? Zr(m, g + d) : d) - m, !S && (v === "px" || b === "zIndex") && n.autoRound !== false ? oz : am), this._pt.u = v || 0, x !== v && v !== "%" && (this._pt.b = c, this._pt.r = lz);
          else if (b in l) vz.call(this, e, b, c, g ? g + f : f);
          else if (b in e) this.add(e, b, c || e[b], g ? g + f : f, a, r);
          else if (b !== "parseTransform") {
            $p(b, f);
            continue;
          }
          S || (b in l ? O.push(b, 0, l[b]) : typeof e[b] == "function" ? O.push(b, 2, e[b]()) : O.push(b, 1, c || e[b])), s.push(b);
        }
      }
      z && Jx(this);
    },
    render: function(e, n) {
      if (n.tween._time || !oy()) for (var i = n._pt; i; ) i.r(e, i.d), i = i._next;
      else n.styles.revert();
    },
    get: di,
    aliases: Jn,
    getSetter: function(e, n, i) {
      var a = Jn[n];
      return a && a.indexOf(",") < 0 && (n = a), n in Oi && n !== Ke && (e._gsap.x || di(e, "x")) ? i && Wv === i ? n === "scale" ? hz : fz : (Wv = i || {}) && (n === "scale" ? dz : mz) : e.style && !Qp(e.style[n]) ? uz : ~n.indexOf("-") ? cz : ry(e, n);
    },
    core: {
      _removeProperty: ar,
      _getMatrix: cy
    }
  };
  Ze.utils.checkPrefix = ys;
  Ze.core.getStyleSaver = e2;
  (function(t, e, n, i) {
    var a = Fe(t + "," + e + "," + n, function(r) {
      Oi[r] = 1;
    });
    Fe(e, function(r) {
      un.units[r] = "deg", r2[r] = 1;
    }), Jn[a[13]] = t + "," + e, Fe(i, function(r) {
      var s = r.split(":");
      Jn[s[1]] = a[s[0]];
    });
  })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
  Fe("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(t) {
    un.units[t] = "px";
  });
  Ze.registerPlugin(o2);
  var io = Ze.registerPlugin(o2) || Ze;
  io.core.Tween;
  let l_ = typeof document < "u" ? D.useLayoutEffect : D.useEffect, o_ = (t) => t && !Array.isArray(t) && typeof t == "object", ru = [], Ez = {}, u2 = io;
  const fy = (t, e = ru) => {
    let n = Ez;
    o_(t) ? (n = t, t = null, e = "dependencies" in n ? n.dependencies : ru) : o_(e) && (n = e, e = "dependencies" in n ? n.dependencies : ru), t && typeof t != "function" && console.warn("First parameter must be a function or config object");
    const { scope: i, revertOnUpdate: a } = n, r = D.useRef(false), s = D.useRef(u2.context(() => {
    }, i)), l = D.useRef((c) => s.current.add(null, c)), o = e && e.length && !a;
    return o && l_(() => (r.current = true, () => s.current.revert()), ru), l_(() => {
      if (t && s.current.add(t, i), !o || !r.current) return () => s.current.revert();
    }, e), {
      context: s.current,
      contextSafe: l.current
    };
  };
  fy.register = (t) => {
    u2 = t;
  };
  fy.headless = true;
  const wz = "/Web_Interaction_2025/week8/assets/game_of_life_bg-DEadghQh.wasm", Mz = async (t = {}, e) => {
    let n;
    if (e.startsWith("data:")) {
      const i = e.replace(/^data:.*?base64,/, "");
      let a;
      if (typeof Buffer == "function" && typeof Buffer.from == "function") a = Buffer.from(i, "base64");
      else if (typeof atob == "function") {
        const r = atob(i);
        a = new Uint8Array(r.length);
        for (let s = 0; s < r.length; s++) a[s] = r.charCodeAt(s);
      } else throw new Error("Cannot decode base64-encoded data URL");
      n = await WebAssembly.instantiate(a, t);
    } else {
      const i = await fetch(e), a = i.headers.get("Content-Type") || "";
      if ("instantiateStreaming" in WebAssembly && a.startsWith("application/wasm")) n = await WebAssembly.instantiateStreaming(i, t);
      else {
        const r = await i.arrayBuffer();
        n = await WebAssembly.instantiate(r, t);
      }
    }
    return n.instance.exports;
  };
  let jt;
  function Cz(t) {
    jt = t;
  }
  let su = null;
  function wl() {
    return (su === null || su.byteLength === 0) && (su = new Uint8Array(jt.memory.buffer)), su;
  }
  let zu = new TextDecoder("utf-8", {
    ignoreBOM: true,
    fatal: true
  });
  zu.decode();
  const Dz = 2146435072;
  let Mh = 0;
  function Rz(t, e) {
    return Mh += e, Mh >= Dz && (zu = new TextDecoder("utf-8", {
      ignoreBOM: true,
      fatal: true
    }), zu.decode(), Mh = e), zu.decode(wl().subarray(t, t + e));
  }
  function c2(t, e) {
    return t = t >>> 0, Rz(t, e);
  }
  let gs = 0;
  const Ml = new TextEncoder();
  "encodeInto" in Ml || (Ml.encodeInto = function(t, e) {
    const n = Ml.encode(t);
    return e.set(n), {
      read: t.length,
      written: n.length
    };
  });
  function f2(t, e, n) {
    if (n === void 0) {
      const l = Ml.encode(t), o = e(l.length, 1) >>> 0;
      return wl().subarray(o, o + l.length).set(l), gs = l.length, o;
    }
    let i = t.length, a = e(i, 1) >>> 0;
    const r = wl();
    let s = 0;
    for (; s < i; s++) {
      const l = t.charCodeAt(s);
      if (l > 127) break;
      r[a + s] = l;
    }
    if (s !== i) {
      s !== 0 && (t = t.slice(s)), a = n(a, i, i = s + t.length * 3, 1) >>> 0;
      const l = wl().subarray(a + s, a + i), o = Ml.encodeInto(t, l);
      s += o.written, a = n(a, i, s, 1) >>> 0;
    }
    return gs = s, a;
  }
  let vr = null;
  function Sc() {
    return (vr === null || vr.buffer.detached === true || vr.buffer.detached === void 0 && vr.buffer !== jt.memory.buffer) && (vr = new DataView(jt.memory.buffer)), vr;
  }
  function Oz(t) {
    return t == null;
  }
  function zz(t, e) {
    const n = e(t.length * 1, 1) >>> 0;
    return wl().set(t, n / 1), gs = t.length, n;
  }
  const u_ = typeof FinalizationRegistry > "u" ? {
    register: () => {
    },
    unregister: () => {
    }
  } : new FinalizationRegistry((t) => jt.__wbg_world_free(t >>> 0, 1));
  class Tc {
    __destroy_into_raw() {
      const e = this.__wbg_ptr;
      return this.__wbg_ptr = 0, u_.unregister(this), e;
    }
    free() {
      const e = this.__destroy_into_raw();
      jt.__wbg_world_free(e, 0);
    }
    constructor(e, n) {
      const i = jt.world_new(e, n);
      return this.__wbg_ptr = i >>> 0, u_.register(this, this.__wbg_ptr, this), this;
    }
    update_char_sets(e, n) {
      jt.world_update_char_sets(this.__wbg_ptr, e, n);
    }
    tick(e) {
      const n = zz(e, jt.__wbindgen_malloc), i = gs;
      jt.world_tick(this.__wbg_ptr, n, i);
    }
    alive_cell(e, n, i) {
      jt.world_alive_cell(this.__wbg_ptr, e, n, i);
    }
    kill_cell(e, n) {
      jt.world_kill_cell(this.__wbg_ptr, e, n);
    }
    width() {
      return jt.world_width(this.__wbg_ptr) >>> 0;
    }
    height() {
      return jt.world_height(this.__wbg_ptr) >>> 0;
    }
    get_consonant_grid_ptr() {
      return jt.world_get_consonant_grid_ptr(this.__wbg_ptr) >>> 0;
    }
    get_vowel_grid_ptr() {
      return jt.world_get_vowel_grid_ptr(this.__wbg_ptr) >>> 0;
    }
    get_syllable_grid_ptr() {
      return jt.world_get_syllable_grid_ptr(this.__wbg_ptr) >>> 0;
    }
  }
  Symbol.dispose && (Tc.prototype[Symbol.dispose] = Tc.prototype.free);
  function Uz(t, e) {
    let n, i;
    try {
      n = t, i = e, console.error(c2(t, e));
    } finally {
      jt.__wbindgen_free(n, i, 1);
    }
  }
  function Vz(t, e) {
    return t[e >>> 0];
  }
  function Lz(t) {
    return t.length;
  }
  function Nz() {
    return new Error();
  }
  function jz() {
    return Math.random();
  }
  function Bz(t, e) {
    const n = e.stack, i = f2(n, jt.__wbindgen_malloc, jt.__wbindgen_realloc), a = gs;
    Sc().setInt32(t + 4 * 1, a, true), Sc().setInt32(t + 4 * 0, i, true);
  }
  function Hz(t, e) {
    const n = e, i = typeof n == "string" ? n : void 0;
    var a = Oz(i) ? 0 : f2(i, jt.__wbindgen_malloc, jt.__wbindgen_realloc), r = gs;
    Sc().setInt32(t + 4 * 1, r, true), Sc().setInt32(t + 4 * 0, a, true);
  }
  function Yz(t, e) {
    throw new Error(c2(t, e));
  }
  function Gz() {
    const t = jt.__wbindgen_export_3, e = t.grow(4);
    t.set(0, void 0), t.set(e + 0, void 0), t.set(e + 1, null), t.set(e + 2, true), t.set(e + 3, false);
  }
  URL = globalThis.URL;
  const Ee = await Mz({
    "./game_of_life_bg.js": {
      __wbg_random_ed8db01c11e5a642: jz,
      __wbg_new_8a6f238a6ece86ea: Nz,
      __wbg_stack_0ed75d68575b0f3c: Bz,
      __wbg_error_7534b8e9a36f1ab4: Uz,
      __wbg_get_0da715ceaecea5c8: Vz,
      __wbg_length_186546c51cd61acd: Lz,
      __wbg_wbindgenstringget_0f16a6ddddef376f: Hz,
      __wbg_wbindgenthrow_451ec1a8469d7eb6: Yz,
      __wbindgen_init_externref_table: Gz
    }
  }, wz), Wa = Ee.memory, Pz = Ee.__wbg_world_free, kz = Ee.world_new, Xz = Ee.world_update_char_sets, Fz = Ee.world_tick, qz = Ee.world_alive_cell, Kz = Ee.world_kill_cell, Qz = Ee.world_width, Zz = Ee.world_height, Jz = Ee.world_get_consonant_grid_ptr, $z = Ee.world_get_vowel_grid_ptr, Wz = Ee.world_get_syllable_grid_ptr, Iz = Ee.__wbindgen_free, t5 = Ee.__wbindgen_malloc, e5 = Ee.__wbindgen_realloc, n5 = Ee.__wbindgen_export_3, h2 = Ee.__wbindgen_start, i5 = Object.freeze(Object.defineProperty({
    __proto__: null,
    __wbg_world_free: Pz,
    __wbindgen_export_3: n5,
    __wbindgen_free: Iz,
    __wbindgen_malloc: t5,
    __wbindgen_realloc: e5,
    __wbindgen_start: h2,
    memory: Wa,
    world_alive_cell: qz,
    world_get_consonant_grid_ptr: Jz,
    world_get_syllable_grid_ptr: Wz,
    world_get_vowel_grid_ptr: $z,
    world_height: Zz,
    world_kill_cell: Kz,
    world_new: kz,
    world_tick: Fz,
    world_update_char_sets: Xz,
    world_width: Qz
  }, Symbol.toStringTag, {
    value: "Module"
  }));
  Cz(i5);
  h2();
  const c_ = [
    "\u3131",
    "\u3132",
    "\u3134",
    "\u3137",
    "\u3138",
    "\u3139",
    "\u3141",
    "\u3142",
    "\u3143",
    "\u3145",
    "\u3146",
    "\u3147",
    "\u3148",
    "\u3149",
    "\u314A",
    "\u314B",
    "\u314C",
    "\u314D",
    "\u314E"
  ], f_ = [
    "\u314F",
    "\u3150",
    "\u3151",
    "\u3152",
    "\u3153",
    "\u3154",
    "\u3155",
    "\u3156",
    "\u3157",
    "\u3158",
    "\u3159",
    "\u315A",
    "\u315B",
    "\u315C",
    "\u315D",
    "\u315E",
    "\u315F",
    "\u3160",
    "\u3161",
    "\u3162",
    "\u3163"
  ], h_ = [
    "",
    "\u3131",
    "\u3132",
    "\u3133",
    "\u3134",
    "\u3135",
    "\u3136",
    "\u3137",
    "\u3139",
    "\u313A",
    "\u313B",
    "\u313C",
    "\u313D",
    "\u313E",
    "\u313F",
    "\u3140",
    "\u3141",
    "\u3142",
    "\u3144",
    "\u3145",
    "\u3146",
    "\u3147",
    "\u3148",
    "\u314A",
    "\u314B",
    "\u314C",
    "\u314D",
    "\u314E"
  ], Cl = (t, e) => {
    if (!e.trim()) {
      t.update_char_sets([], [], []);
      return;
    }
    const n = 44032, i = 55203, a = 588, r = 28, s = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
    for (const c of e) {
      const f = c.charCodeAt(0);
      if (f >= n && f <= i) {
        const d = f - n, m = Math.floor(d / a);
        s.add(c_[m]);
        const y = Math.floor(d % a / r);
        l.add(f_[y]);
        const T = d % r;
        if (T > 0) {
          const b = h_[T];
          switch (b) {
            case "\u3133":
              o.add("\u3131"), o.add("\u3145");
              break;
            case "\u3135":
              o.add("\u3134"), o.add("\u3148");
              break;
            case "\u3136":
              o.add("\u3134"), o.add("\u314E");
              break;
            case "\u313A":
              o.add("\u3139"), o.add("\u3131");
              break;
            case "\u313B":
              o.add("\u3139"), o.add("\u3141");
              break;
            case "\u313C":
              o.add("\u3139"), o.add("\u3142");
              break;
            case "\u313D":
              o.add("\u3139"), o.add("\u3145");
              break;
            case "\u313E":
              o.add("\u3139"), o.add("\u314C");
              break;
            case "\u313F":
              o.add("\u3139"), o.add("\u314D");
              break;
            case "\u3140":
              o.add("\u3139"), o.add("\u314E");
              break;
            case "\u3144":
              o.add("\u3142"), o.add("\u3145");
              break;
            default:
              o.add(b);
          }
        }
      } else c_.includes(c) ? s.add(c) : f_.includes(c) ? l.add(c) : h_.includes(c) && o.add(c);
    }
    t.update_char_sets(Array.from(s), Array.from(l), Array.from(o));
  };
  async function a5() {
    return navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480
      }
    });
  }
  async function r5(t) {
    return t.src = "./sample.mp4", t.crossOrigin = "anonymous", Promise.resolve("./sample.mp4");
  }
  async function d2(t, e) {
    try {
      t.srcObject instanceof MediaStream && t.srcObject.getTracks().forEach((i) => i.stop()), t.srcObject = null, t.src = "", t.load(), t.loop = true;
      const n = await e;
      typeof n != "string" ? t.srcObject = n : t.src = n, await t.play();
    } catch (n) {
      console.error("Failed to start media source:", n);
    }
  }
  const Wi = 15, s5 = 12, m2 = 1e3 / s5;
  function l5(t, e) {
    const n = document.createElement("canvas");
    return n.width = t, n.height = e, n;
  }
  function o5(t, e, n, i) {
    const a = e.width(), r = e.height(), s = t.canvas;
    t.clearRect(0, 0, s.width, s.height), i ? (t.save(), t.scale(-1, 1), t.translate(-s.width, 0), t.drawImage(n, 0, 0, s.width, s.height), t.restore(), t.fillStyle = "rgba(0, 0, 0, 0.5)", t.fillRect(0, 0, s.width, s.height)) : (t.fillStyle = "rgba(0, 0, 0, 1)", t.fillRect(0, 0, s.width, s.height)), t.font = `${Wi}px "Grandiflora One"`, t.fillStyle = "white";
    const l = e.get_consonant_grid_ptr(), o = e.get_vowel_grid_ptr(), c = e.get_syllable_grid_ptr(), f = new Uint16Array(Wa.buffer, l, a * r), d = new Uint16Array(Wa.buffer, o, a * r), m = new Uint16Array(Wa.buffer, c, a * r);
    for (let y = 0; y < m.length; y++) {
      const T = Math.floor(y / a), x = y % a * (Wi + 1) + 2, v = T * (Wi + 1) + Wi;
      if (m[y] > 0) {
        t.fillText(String.fromCharCode(m[y]), x, v);
        continue;
      }
      f[y] > 0 && t.fillText(String.fromCharCode(f[y]), x, v), d[y] > 0 && t.fillText(String.fromCharCode(d[y]), x, v);
    }
  }
  function p2(t, e, n, i, a, r) {
    const s = t.width(), l = t.height(), c = l5(s, l).getContext("2d", {
      willReadFrequently: true
    });
    c.drawImage(e, 0, 0, s, l);
    const f = c.getImageData(0, 0, s, l).data, d = new Uint8Array(s * l);
    for (let g = 0, S = 0; S < f.length; S += 4, g++) f[S] > 128 && (d[g] = 1);
    t.tick(d);
    const m = t.get_consonant_grid_ptr(), y = t.get_vowel_grid_ptr(), T = t.get_syllable_grid_ptr(), b = new Uint16Array(Wa.buffer, m, s * l), x = new Uint16Array(Wa.buffer, y, s * l), v = new Uint16Array(Wa.buffer, T, s * l);
    for (let g = 0; g < d.length; g++) {
      const S = Math.floor(g / s), A = g % s, w = b[g] !== 0 || x[g] !== 0 || v[g] !== 0;
      d[g] === 1 && !w && t.alive_cell(S, A, n);
    }
    o5(i, t, a, r);
  }
  var u5 = {};
  (function() {
    var t;
    function e(u) {
      var h = 0;
      return function() {
        return h < u.length ? {
          done: false,
          value: u[h++]
        } : {
          done: true
        };
      };
    }
    var n = typeof Object.defineProperties == "function" ? Object.defineProperty : function(u, h, p) {
      return u == Array.prototype || u == Object.prototype || (u[h] = p.value), u;
    };
    function i(u) {
      u = [
        typeof globalThis == "object" && globalThis,
        u,
        typeof window == "object" && window,
        typeof self == "object" && self,
        typeof vf == "object" && vf
      ];
      for (var h = 0; h < u.length; ++h) {
        var p = u[h];
        if (p && p.Math == Math) return p;
      }
      throw Error("Cannot find global object");
    }
    var a = i(this);
    function r(u, h) {
      if (h) t: {
        var p = a;
        u = u.split(".");
        for (var _ = 0; _ < u.length - 1; _++) {
          var E = u[_];
          if (!(E in p)) break t;
          p = p[E];
        }
        u = u[u.length - 1], _ = p[u], h = h(_), h != _ && h != null && n(p, u, {
          configurable: true,
          writable: true,
          value: h
        });
      }
    }
    r("Symbol", function(u) {
      function h(C) {
        if (this instanceof h) throw new TypeError("Symbol is not a constructor");
        return new p(_ + (C || "") + "_" + E++, C);
      }
      function p(C, M) {
        this.h = C, n(this, "description", {
          configurable: true,
          writable: true,
          value: M
        });
      }
      if (u) return u;
      p.prototype.toString = function() {
        return this.h;
      };
      var _ = "jscomp_symbol_" + (1e9 * Math.random() >>> 0) + "_", E = 0;
      return h;
    }), r("Symbol.iterator", function(u) {
      if (u) return u;
      u = Symbol("Symbol.iterator");
      for (var h = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), p = 0; p < h.length; p++) {
        var _ = a[h[p]];
        typeof _ == "function" && typeof _.prototype[u] != "function" && n(_.prototype, u, {
          configurable: true,
          writable: true,
          value: function() {
            return s(e(this));
          }
        });
      }
      return u;
    });
    function s(u) {
      return u = {
        next: u
      }, u[Symbol.iterator] = function() {
        return this;
      }, u;
    }
    function l(u) {
      var h = typeof Symbol < "u" && Symbol.iterator && u[Symbol.iterator];
      return h ? h.call(u) : {
        next: e(u)
      };
    }
    function o(u) {
      if (!(u instanceof Array)) {
        u = l(u);
        for (var h, p = []; !(h = u.next()).done; ) p.push(h.value);
        u = p;
      }
      return u;
    }
    var c = typeof Object.assign == "function" ? Object.assign : function(u, h) {
      for (var p = 1; p < arguments.length; p++) {
        var _ = arguments[p];
        if (_) for (var E in _) Object.prototype.hasOwnProperty.call(_, E) && (u[E] = _[E]);
      }
      return u;
    };
    r("Object.assign", function(u) {
      return u || c;
    });
    var f = typeof Object.create == "function" ? Object.create : function(u) {
      function h() {
      }
      return h.prototype = u, new h();
    }, d;
    if (typeof Object.setPrototypeOf == "function") d = Object.setPrototypeOf;
    else {
      var m;
      t: {
        var y = {
          a: true
        }, T = {};
        try {
          T.__proto__ = y, m = T.a;
          break t;
        } catch {
        }
        m = false;
      }
      d = m ? function(u, h) {
        if (u.__proto__ = h, u.__proto__ !== h) throw new TypeError(u + " is not extensible");
        return u;
      } : null;
    }
    var b = d;
    function x(u, h) {
      if (u.prototype = f(h.prototype), u.prototype.constructor = u, b) b(u, h);
      else for (var p in h) if (p != "prototype") if (Object.defineProperties) {
        var _ = Object.getOwnPropertyDescriptor(h, p);
        _ && Object.defineProperty(u, p, _);
      } else u[p] = h[p];
      u.za = h.prototype;
    }
    function v() {
      this.m = false, this.j = null, this.i = void 0, this.h = 1, this.v = this.s = 0, this.l = null;
    }
    function g(u) {
      if (u.m) throw new TypeError("Generator is already running");
      u.m = true;
    }
    v.prototype.u = function(u) {
      this.i = u;
    };
    function S(u, h) {
      u.l = {
        ma: h,
        na: true
      }, u.h = u.s || u.v;
    }
    v.prototype.return = function(u) {
      this.l = {
        return: u
      }, this.h = this.v;
    };
    function A(u, h, p) {
      return u.h = p, {
        value: h
      };
    }
    function w(u) {
      this.h = new v(), this.i = u;
    }
    function V(u, h) {
      g(u.h);
      var p = u.h.j;
      return p ? z(u, "return" in p ? p.return : function(_) {
        return {
          value: _,
          done: true
        };
      }, h, u.h.return) : (u.h.return(h), O(u));
    }
    function z(u, h, p, _) {
      try {
        var E = h.call(u.h.j, p);
        if (!(E instanceof Object)) throw new TypeError("Iterator result " + E + " is not an object");
        if (!E.done) return u.h.m = false, E;
        var C = E.value;
      } catch (M) {
        return u.h.j = null, S(u.h, M), O(u);
      }
      return u.h.j = null, _.call(u.h, C), O(u);
    }
    function O(u) {
      for (; u.h.h; ) try {
        var h = u.i(u.h);
        if (h) return u.h.m = false, {
          value: h.value,
          done: false
        };
      } catch (p) {
        u.h.i = void 0, S(u.h, p);
      }
      if (u.h.m = false, u.h.l) {
        if (h = u.h.l, u.h.l = null, h.na) throw h.ma;
        return {
          value: h.return,
          done: true
        };
      }
      return {
        value: void 0,
        done: true
      };
    }
    function U(u) {
      this.next = function(h) {
        return g(u.h), u.h.j ? h = z(u, u.h.j.next, h, u.h.u) : (u.h.u(h), h = O(u)), h;
      }, this.throw = function(h) {
        return g(u.h), u.h.j ? h = z(u, u.h.j.throw, h, u.h.u) : (S(u.h, h), h = O(u)), h;
      }, this.return = function(h) {
        return V(u, h);
      }, this[Symbol.iterator] = function() {
        return this;
      };
    }
    function B(u) {
      function h(_) {
        return u.next(_);
      }
      function p(_) {
        return u.throw(_);
      }
      return new Promise(function(_, E) {
        function C(M) {
          M.done ? _(M.value) : Promise.resolve(M.value).then(h, p).then(C, E);
        }
        C(u.next());
      });
    }
    function Y(u) {
      return B(new U(new w(u)));
    }
    r("Promise", function(u) {
      function h(M) {
        this.i = 0, this.j = void 0, this.h = [], this.u = false;
        var R = this.l();
        try {
          M(R.resolve, R.reject);
        } catch (L) {
          R.reject(L);
        }
      }
      function p() {
        this.h = null;
      }
      function _(M) {
        return M instanceof h ? M : new h(function(R) {
          R(M);
        });
      }
      if (u) return u;
      p.prototype.i = function(M) {
        if (this.h == null) {
          this.h = [];
          var R = this;
          this.j(function() {
            R.m();
          });
        }
        this.h.push(M);
      };
      var E = a.setTimeout;
      p.prototype.j = function(M) {
        E(M, 0);
      }, p.prototype.m = function() {
        for (; this.h && this.h.length; ) {
          var M = this.h;
          this.h = [];
          for (var R = 0; R < M.length; ++R) {
            var L = M[R];
            M[R] = null;
            try {
              L();
            } catch (H) {
              this.l(H);
            }
          }
        }
        this.h = null;
      }, p.prototype.l = function(M) {
        this.j(function() {
          throw M;
        });
      }, h.prototype.l = function() {
        function M(H) {
          return function(X) {
            L || (L = true, H.call(R, X));
          };
        }
        var R = this, L = false;
        return {
          resolve: M(this.I),
          reject: M(this.m)
        };
      }, h.prototype.I = function(M) {
        if (M === this) this.m(new TypeError("A Promise cannot resolve to itself"));
        else if (M instanceof h) this.L(M);
        else {
          t: switch (typeof M) {
            case "object":
              var R = M != null;
              break t;
            case "function":
              R = true;
              break t;
            default:
              R = false;
          }
          R ? this.F(M) : this.s(M);
        }
      }, h.prototype.F = function(M) {
        var R = void 0;
        try {
          R = M.then;
        } catch (L) {
          this.m(L);
          return;
        }
        typeof R == "function" ? this.M(R, M) : this.s(M);
      }, h.prototype.m = function(M) {
        this.v(2, M);
      }, h.prototype.s = function(M) {
        this.v(1, M);
      }, h.prototype.v = function(M, R) {
        if (this.i != 0) throw Error("Cannot settle(" + M + ", " + R + "): Promise already settled in state" + this.i);
        this.i = M, this.j = R, this.i === 2 && this.K(), this.H();
      }, h.prototype.K = function() {
        var M = this;
        E(function() {
          if (M.D()) {
            var R = a.console;
            typeof R < "u" && R.error(M.j);
          }
        }, 1);
      }, h.prototype.D = function() {
        if (this.u) return false;
        var M = a.CustomEvent, R = a.Event, L = a.dispatchEvent;
        return typeof L > "u" ? true : (typeof M == "function" ? M = new M("unhandledrejection", {
          cancelable: true
        }) : typeof R == "function" ? M = new R("unhandledrejection", {
          cancelable: true
        }) : (M = a.document.createEvent("CustomEvent"), M.initCustomEvent("unhandledrejection", false, true, M)), M.promise = this, M.reason = this.j, L(M));
      }, h.prototype.H = function() {
        if (this.h != null) {
          for (var M = 0; M < this.h.length; ++M) C.i(this.h[M]);
          this.h = null;
        }
      };
      var C = new p();
      return h.prototype.L = function(M) {
        var R = this.l();
        M.T(R.resolve, R.reject);
      }, h.prototype.M = function(M, R) {
        var L = this.l();
        try {
          M.call(R, L.resolve, L.reject);
        } catch (H) {
          L.reject(H);
        }
      }, h.prototype.then = function(M, R) {
        function L(Z, F) {
          return typeof Z == "function" ? function(I) {
            try {
              H(Z(I));
            } catch (rt) {
              X(rt);
            }
          } : F;
        }
        var H, X, W = new h(function(Z, F) {
          H = Z, X = F;
        });
        return this.T(L(M, H), L(R, X)), W;
      }, h.prototype.catch = function(M) {
        return this.then(void 0, M);
      }, h.prototype.T = function(M, R) {
        function L() {
          switch (H.i) {
            case 1:
              M(H.j);
              break;
            case 2:
              R(H.j);
              break;
            default:
              throw Error("Unexpected state: " + H.i);
          }
        }
        var H = this;
        this.h == null ? C.i(L) : this.h.push(L), this.u = true;
      }, h.resolve = _, h.reject = function(M) {
        return new h(function(R, L) {
          L(M);
        });
      }, h.race = function(M) {
        return new h(function(R, L) {
          for (var H = l(M), X = H.next(); !X.done; X = H.next()) _(X.value).T(R, L);
        });
      }, h.all = function(M) {
        var R = l(M), L = R.next();
        return L.done ? _([]) : new h(function(H, X) {
          function W(I) {
            return function(rt) {
              Z[I] = rt, F--, F == 0 && H(Z);
            };
          }
          var Z = [], F = 0;
          do
            Z.push(void 0), F++, _(L.value).T(W(Z.length - 1), X), L = R.next();
          while (!L.done);
        });
      }, h;
    });
    function q(u, h) {
      u instanceof String && (u += "");
      var p = 0, _ = false, E = {
        next: function() {
          if (!_ && p < u.length) {
            var C = p++;
            return {
              value: h(C, u[C]),
              done: false
            };
          }
          return _ = true, {
            done: true,
            value: void 0
          };
        }
      };
      return E[Symbol.iterator] = function() {
        return E;
      }, E;
    }
    r("Array.prototype.keys", function(u) {
      return u || function() {
        return q(this, function(h) {
          return h;
        });
      };
    }), r("Array.prototype.fill", function(u) {
      return u || function(h, p, _) {
        var E = this.length || 0;
        for (0 > p && (p = Math.max(0, E + p)), (_ == null || _ > E) && (_ = E), _ = Number(_), 0 > _ && (_ = Math.max(0, E + _)), p = Number(p || 0); p < _; p++) this[p] = h;
        return this;
      };
    });
    function k(u) {
      return u || Array.prototype.fill;
    }
    r("Int8Array.prototype.fill", k), r("Uint8Array.prototype.fill", k), r("Uint8ClampedArray.prototype.fill", k), r("Int16Array.prototype.fill", k), r("Uint16Array.prototype.fill", k), r("Int32Array.prototype.fill", k), r("Uint32Array.prototype.fill", k), r("Float32Array.prototype.fill", k), r("Float64Array.prototype.fill", k), r("Object.is", function(u) {
      return u || function(h, p) {
        return h === p ? h !== 0 || 1 / h === 1 / p : h !== h && p !== p;
      };
    }), r("Array.prototype.includes", function(u) {
      return u || function(h, p) {
        var _ = this;
        _ instanceof String && (_ = String(_));
        var E = _.length;
        for (p = p || 0, 0 > p && (p = Math.max(p + E, 0)); p < E; p++) {
          var C = _[p];
          if (C === h || Object.is(C, h)) return true;
        }
        return false;
      };
    }), r("String.prototype.includes", function(u) {
      return u || function(h, p) {
        if (this == null) throw new TypeError("The 'this' value for String.prototype.includes must not be null or undefined");
        if (h instanceof RegExp) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
        return this.indexOf(h, p || 0) !== -1;
      };
    });
    var $ = this || self;
    function K(u, h) {
      u = u.split(".");
      var p = $;
      u[0] in p || typeof p.execScript > "u" || p.execScript("var " + u[0]);
      for (var _; u.length && (_ = u.shift()); ) u.length || h === void 0 ? p[_] && p[_] !== Object.prototype[_] ? p = p[_] : p = p[_] = {} : p[_] = h;
    }
    function N(u) {
      var h;
      t: {
        if ((h = $.navigator) && (h = h.userAgent)) break t;
        h = "";
      }
      return h.indexOf(u) != -1;
    }
    var P = Array.prototype.map ? function(u, h) {
      return Array.prototype.map.call(u, h, void 0);
    } : function(u, h) {
      for (var p = u.length, _ = Array(p), E = typeof u == "string" ? u.split("") : u, C = 0; C < p; C++) C in E && (_[C] = h.call(void 0, E[C], C, u));
      return _;
    }, G = {}, Q = null;
    function it(u) {
      var h = u.length, p = 3 * h / 4;
      p % 3 ? p = Math.floor(p) : "=.".indexOf(u[h - 1]) != -1 && (p = "=.".indexOf(u[h - 2]) != -1 ? p - 2 : p - 1);
      var _ = new Uint8Array(p), E = 0;
      return Pt(u, function(C) {
        _[E++] = C;
      }), E !== p ? _.subarray(0, E) : _;
    }
    function Pt(u, h) {
      function p(L) {
        for (; _ < u.length; ) {
          var H = u.charAt(_++), X = Q[H];
          if (X != null) return X;
          if (!/^[\s\xa0]*$/.test(H)) throw Error("Unknown base64 encoding at char: " + H);
        }
        return L;
      }
      Kt();
      for (var _ = 0; ; ) {
        var E = p(-1), C = p(0), M = p(64), R = p(64);
        if (R === 64 && E === -1) break;
        h(E << 2 | C >> 4), M != 64 && (h(C << 4 & 240 | M >> 2), R != 64 && h(M << 6 & 192 | R));
      }
    }
    function Kt() {
      if (!Q) {
        Q = {};
        for (var u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), h = [
          "+/=",
          "+/",
          "-_=",
          "-_.",
          "-_"
        ], p = 0; 5 > p; p++) {
          var _ = u.concat(h[p].split(""));
          G[p] = _;
          for (var E = 0; E < _.length; E++) {
            var C = _[E];
            Q[C] === void 0 && (Q[C] = E);
          }
        }
      }
    }
    var te = typeof Uint8Array < "u", Nt = !(N("Trident") || N("MSIE")) && typeof $.btoa == "function";
    function pe(u) {
      if (!Nt) {
        var h;
        h === void 0 && (h = 0), Kt(), h = G[h];
        for (var p = Array(Math.floor(u.length / 3)), _ = h[64] || "", E = 0, C = 0; E < u.length - 2; E += 3) {
          var M = u[E], R = u[E + 1], L = u[E + 2], H = h[M >> 2];
          M = h[(M & 3) << 4 | R >> 4], R = h[(R & 15) << 2 | L >> 6], L = h[L & 63], p[C++] = H + M + R + L;
        }
        switch (H = 0, L = _, u.length - E) {
          case 2:
            H = u[E + 1], L = h[(H & 15) << 2] || _;
          case 1:
            u = u[E], p[C] = h[u >> 2] + h[(u & 3) << 4 | H >> 4] + L + _;
        }
        return p.join("");
      }
      for (h = ""; 10240 < u.length; ) h += String.fromCharCode.apply(null, u.subarray(0, 10240)), u = u.subarray(10240);
      return h += String.fromCharCode.apply(null, u), btoa(h);
    }
    var Ta = RegExp("[-_.]", "g");
    function Jc(u) {
      switch (u) {
        case "-":
          return "+";
        case "_":
          return "/";
        case ".":
          return "=";
        default:
          return "";
      }
    }
    function Eo(u) {
      if (!Nt) return it(u);
      Ta.test(u) && (u = u.replace(Ta, Jc)), u = atob(u);
      for (var h = new Uint8Array(u.length), p = 0; p < u.length; p++) h[p] = u.charCodeAt(p);
      return h;
    }
    var Rs;
    function Os() {
      return Rs || (Rs = new Uint8Array(0));
    }
    var xa = {}, wt = typeof Uint8Array.prototype.slice == "function", ft = 0, Mt = 0;
    function Qt(u) {
      var h = 0 > u;
      u = Math.abs(u);
      var p = u >>> 0;
      u = Math.floor((u - p) / 4294967296), h && (p = l(pt(p, u)), h = p.next().value, u = p.next().value, p = h), ft = p >>> 0, Mt = u >>> 0;
    }
    var ee = typeof BigInt == "function";
    function pt(u, h) {
      return h = ~h, u ? u = ~u + 1 : h += 1, [
        u,
        h
      ];
    }
    function mn(u, h) {
      this.i = u >>> 0, this.h = h >>> 0;
    }
    function we(u) {
      if (!u) return Re || (Re = new mn(0, 0));
      if (!/^-?\d+$/.test(u)) return null;
      if (16 > u.length) Qt(Number(u));
      else if (ee) u = BigInt(u), ft = Number(u & BigInt(4294967295)) >>> 0, Mt = Number(u >> BigInt(32) & BigInt(4294967295));
      else {
        var h = +(u[0] === "-");
        Mt = ft = 0;
        for (var p = u.length, _ = h, E = (p - h) % 6 + h; E <= p; _ = E, E += 6) _ = Number(u.slice(_, E)), Mt *= 1e6, ft = 1e6 * ft + _, 4294967296 <= ft && (Mt += ft / 4294967296 | 0, ft %= 4294967296);
        h && (h = l(pt(ft, Mt)), u = h.next().value, h = h.next().value, ft = u, Mt = h);
      }
      return new mn(ft, Mt);
    }
    var Re;
    function ai(u, h) {
      return Error("Invalid wire type: " + u + " (at position " + h + ")");
    }
    function vt() {
      return Error("Failed to read varint, encoding is invalid.");
    }
    function Vi(u, h) {
      return Error("Tried to read past the end of the data " + h + " > " + u);
    }
    function Aa() {
      throw Error("Invalid UTF8");
    }
    function hy(u, h) {
      return h = String.fromCharCode.apply(null, h), u == null ? h : u + h;
    }
    var wo = void 0, $c, v2 = typeof TextDecoder < "u", dy, _2 = typeof TextEncoder < "u", my;
    function py(u) {
      if (u !== xa) throw Error("illegal external caller");
    }
    function zs(u, h) {
      if (py(h), this.V = u, u != null && u.length === 0) throw Error("ByteString should be constructed with non-empty values");
    }
    function Wc() {
      return my || (my = new zs(null, xa));
    }
    function yy(u) {
      py(xa);
      var h = u.V;
      return h = h == null || te && h != null && h instanceof Uint8Array ? h : typeof h == "string" ? Eo(h) : null, h == null ? h : u.V = h;
    }
    function b2(u) {
      if (typeof u == "string") return {
        buffer: Eo(u),
        C: false
      };
      if (Array.isArray(u)) return {
        buffer: new Uint8Array(u),
        C: false
      };
      if (u.constructor === Uint8Array) return {
        buffer: u,
        C: false
      };
      if (u.constructor === ArrayBuffer) return {
        buffer: new Uint8Array(u),
        C: false
      };
      if (u.constructor === zs) return {
        buffer: yy(u) || Os(),
        C: true
      };
      if (u instanceof Uint8Array) return {
        buffer: new Uint8Array(u.buffer, u.byteOffset, u.byteLength),
        C: false
      };
      throw Error("Type not convertible to a Uint8Array, expected a Uint8Array, an ArrayBuffer, a base64 encoded string, a ByteString or an Array of numbers");
    }
    function gy(u, h) {
      this.i = null, this.m = false, this.h = this.j = this.l = 0, Ic(this, u, h);
    }
    function Ic(u, h, p) {
      p = p === void 0 ? {} : p, u.S = p.S === void 0 ? false : p.S, h && (h = b2(h), u.i = h.buffer, u.m = h.C, u.l = 0, u.j = u.i.length, u.h = u.l);
    }
    gy.prototype.reset = function() {
      this.h = this.l;
    };
    function Ea(u, h) {
      if (u.h = h, h > u.j) throw Vi(u.j, h);
    }
    function Us(u) {
      var h = u.i, p = u.h, _ = h[p++], E = _ & 127;
      if (_ & 128 && (_ = h[p++], E |= (_ & 127) << 7, _ & 128 && (_ = h[p++], E |= (_ & 127) << 14, _ & 128 && (_ = h[p++], E |= (_ & 127) << 21, _ & 128 && (_ = h[p++], E |= _ << 28, _ & 128 && h[p++] & 128 && h[p++] & 128 && h[p++] & 128 && h[p++] & 128 && h[p++] & 128))))) throw vt();
      return Ea(u, p), E;
    }
    function vy(u, h) {
      if (0 > h) throw Error("Tried to read a negative byte length: " + h);
      var p = u.h, _ = p + h;
      if (_ > u.j) throw Vi(h, u.j - p);
      return u.h = _, p;
    }
    var _y = [];
    function tf() {
      this.h = [];
    }
    tf.prototype.length = function() {
      return this.h.length;
    }, tf.prototype.end = function() {
      var u = this.h;
      return this.h = [], u;
    };
    function by(u, h, p) {
      for (; 0 < p || 127 < h; ) u.h.push(h & 127 | 128), h = (h >>> 7 | p << 25) >>> 0, p >>>= 7;
      u.h.push(h);
    }
    function wa(u, h) {
      for (; 127 < h; ) u.h.push(h & 127 | 128), h >>>= 7;
      u.h.push(h);
    }
    function ef(u, h) {
      if (_y.length) {
        var p = _y.pop();
        Ic(p, u, h), u = p;
      } else u = new gy(u, h);
      this.h = u, this.j = this.h.h, this.i = this.l = -1, this.setOptions(h);
    }
    ef.prototype.setOptions = function(u) {
      u = u === void 0 ? {} : u, this.ca = u.ca === void 0 ? false : u.ca;
    }, ef.prototype.reset = function() {
      this.h.reset(), this.j = this.h.h, this.i = this.l = -1;
    };
    function Sy(u) {
      var h = u.h;
      if (h.h == h.j) return false;
      u.j = u.h.h;
      var p = Us(u.h) >>> 0;
      if (h = p >>> 3, p &= 7, !(0 <= p && 5 >= p)) throw ai(p, u.j);
      if (1 > h) throw Error("Invalid field number: " + h + " (at position " + u.j + ")");
      return u.l = h, u.i = p, true;
    }
    function Mo(u) {
      switch (u.i) {
        case 0:
          if (u.i != 0) Mo(u);
          else t: {
            u = u.h;
            for (var h = u.h, p = h + 10, _ = u.i; h < p; ) if (!(_[h++] & 128)) {
              Ea(u, h);
              break t;
            }
            throw vt();
          }
          break;
        case 1:
          u = u.h, Ea(u, u.h + 8);
          break;
        case 2:
          u.i != 2 ? Mo(u) : (h = Us(u.h) >>> 0, u = u.h, Ea(u, u.h + h));
          break;
        case 5:
          u = u.h, Ea(u, u.h + 4);
          break;
        case 3:
          h = u.l;
          do {
            if (!Sy(u)) throw Error("Unmatched start-group tag: stream EOF");
            if (u.i == 4) {
              if (u.l != h) throw Error("Unmatched end-group tag");
              break;
            }
            Mo(u);
          } while (true);
          break;
        default:
          throw ai(u.i, u.j);
      }
    }
    var Co = [];
    function S2() {
      this.j = [], this.i = 0, this.h = new tf();
    }
    function dr(u, h) {
      h.length !== 0 && (u.j.push(h), u.i += h.length);
    }
    function T2(u, h) {
      if (h = h.R) {
        dr(u, u.h.end());
        for (var p = 0; p < h.length; p++) dr(u, yy(h[p]) || Os());
      }
    }
    var ri = typeof Symbol == "function" && typeof Symbol() == "symbol" ? Symbol() : void 0;
    function Ma(u, h) {
      return ri ? u[ri] |= h : u.A !== void 0 ? u.A |= h : (Object.defineProperties(u, {
        A: {
          value: h,
          configurable: true,
          writable: true,
          enumerable: false
        }
      }), h);
    }
    function Ty(u, h) {
      ri ? u[ri] && (u[ri] &= ~h) : u.A !== void 0 && (u.A &= ~h);
    }
    function Zt(u) {
      var h;
      return ri ? h = u[ri] : h = u.A, h ?? 0;
    }
    function Gn(u, h) {
      ri ? u[ri] = h : u.A !== void 0 ? u.A = h : Object.defineProperties(u, {
        A: {
          value: h,
          configurable: true,
          writable: true,
          enumerable: false
        }
      });
    }
    function nf(u) {
      return Ma(u, 1), u;
    }
    function x2(u, h) {
      Gn(h, (u | 0) & -51);
    }
    function Do(u, h) {
      Gn(h, (u | 18) & -41);
    }
    var af = {};
    function Ro(u) {
      return u !== null && typeof u == "object" && !Array.isArray(u) && u.constructor === Object;
    }
    var Vs, xy = [];
    Gn(xy, 23), Vs = Object.freeze(xy);
    function rf(u) {
      if (Zt(u.o) & 2) throw Error("Cannot mutate an immutable Message");
    }
    function sf(u) {
      var h = u.length;
      (h = h ? u[h - 1] : void 0) && Ro(h) ? h.g = 1 : (h = {}, u.push((h.g = 1, h)));
    }
    function Ay(u) {
      var h = u.i + u.G;
      return u.B || (u.B = u.o[h] = {});
    }
    function Vn(u, h) {
      return h === -1 ? null : h >= u.i ? u.B ? u.B[h] : void 0 : u.o[h + u.G];
    }
    function Pn(u, h, p, _) {
      rf(u), Ls(u, h, p, _);
    }
    function Ls(u, h, p, _) {
      u.j && (u.j = void 0), h >= u.i || _ ? Ay(u)[h] = p : (u.o[h + u.G] = p, (u = u.B) && h in u && delete u[h]);
    }
    function lf(u, h, p, _) {
      var E = Vn(u, h);
      Array.isArray(E) || (E = Vs);
      var C = Zt(E);
      if (C & 1 || nf(E), _) C & 2 || Ma(E, 2), p & 1 || Object.freeze(E);
      else {
        _ = !(p & 2);
        var M = C & 2;
        p & 1 || !M ? _ && C & 16 && !M && Ty(E, 16) : (E = nf(Array.prototype.slice.call(E)), Ls(u, h, E));
      }
      return E;
    }
    function of(u, h) {
      var p = Vn(u, h), _ = p == null ? p : typeof p == "number" || p === "NaN" || p === "Infinity" || p === "-Infinity" ? Number(p) : void 0;
      return _ != null && _ !== p && Ls(u, h, _), _;
    }
    function Ey(u, h, p, _, E) {
      u.h || (u.h = {});
      var C = u.h[p], M = lf(u, p, 3, E);
      if (!C) {
        var R = M;
        C = [];
        var L = !!(Zt(u.o) & 16);
        M = !!(Zt(R) & 2);
        var H = R;
        !E && M && (R = Array.prototype.slice.call(R));
        for (var X = M, W = 0; W < R.length; W++) {
          var Z = R[W], F = h, I = false;
          if (I = I === void 0 ? false : I, Z = Array.isArray(Z) ? new F(Z) : I ? new F() : void 0, Z !== void 0) {
            F = Z.o;
            var rt = I = Zt(F);
            M && (rt |= 2), L && (rt |= 16), rt != I && Gn(F, rt), F = rt, X = X || !!(2 & F), C.push(Z);
          }
        }
        return u.h[p] = C, L = Zt(R), h = L | 33, h = X ? h & -9 : h | 8, L != h && (X = R, Object.isFrozen(X) && (X = Array.prototype.slice.call(X)), Gn(X, h), R = X), H !== R && Ls(u, p, R), (E || _ && M) && Ma(C, 2), _ && Object.freeze(C), C;
      }
      return E || (E = Object.isFrozen(C), _ && !E ? Object.freeze(C) : !_ && E && (C = Array.prototype.slice.call(C), u.h[p] = C)), C;
    }
    function uf(u, h, p) {
      var _ = !!(Zt(u.o) & 2);
      if (h = Ey(u, h, p, _, _), u = lf(u, p, 3, _), !(_ || Zt(u) & 8)) {
        for (_ = 0; _ < h.length; _++) {
          if (p = h[_], Zt(p.o) & 2) {
            var E = Oy(p, false);
            E.j = p;
          } else E = p;
          p !== E && (h[_] = E, u[_] = E.o);
        }
        Ma(u, 8);
      }
      return h;
    }
    function kn(u, h, p) {
      if (p != null && typeof p != "number") throw Error("Value of float/double field must be a number|null|undefined, found " + typeof p + ": " + p);
      Pn(u, h, p);
    }
    function wy(u, h, p, _, E) {
      rf(u);
      var C = Ey(u, p, h, false, false);
      return p = _ ?? new p(), u = lf(u, h, 2, false), E != null ? (C.splice(E, 0, p), u.splice(E, 0, p.o)) : (C.push(p), u.push(p.o)), p.C() && Ty(u, 8), p;
    }
    function Oo(u, h) {
      return u ?? h;
    }
    function Xn(u, h, p) {
      return p = p === void 0 ? 0 : p, Oo(of(u, h), p);
    }
    var zo;
    function A2(u) {
      switch (typeof u) {
        case "number":
          return isFinite(u) ? u : String(u);
        case "object":
          if (u) if (Array.isArray(u)) {
            if (Zt(u) & 128) return u = Array.prototype.slice.call(u), sf(u), u;
          } else {
            if (te && u != null && u instanceof Uint8Array) return pe(u);
            if (u instanceof zs) {
              var h = u.V;
              return h == null ? "" : typeof h == "string" ? h : u.V = pe(h);
            }
          }
      }
      return u;
    }
    function My(u, h, p, _) {
      if (u != null) {
        if (Array.isArray(u)) u = cf(u, h, p, _ !== void 0);
        else if (Ro(u)) {
          var E = {}, C;
          for (C in u) E[C] = My(u[C], h, p, _);
          u = E;
        } else u = h(u, _);
        return u;
      }
    }
    function cf(u, h, p, _) {
      var E = Zt(u);
      _ = _ ? !!(E & 16) : void 0, u = Array.prototype.slice.call(u);
      for (var C = 0; C < u.length; C++) u[C] = My(u[C], h, p, _);
      return p(E, u), u;
    }
    function E2(u) {
      return u.ja === af ? u.toJSON() : A2(u);
    }
    function w2(u, h) {
      u & 128 && sf(h);
    }
    function Cy(u, h, p) {
      if (p = p === void 0 ? Do : p, u != null) {
        if (te && u instanceof Uint8Array) return u.length ? new zs(new Uint8Array(u), xa) : Wc();
        if (Array.isArray(u)) {
          var _ = Zt(u);
          return _ & 2 ? u : h && !(_ & 32) && (_ & 16 || _ === 0) ? (Gn(u, _ | 2), u) : (u = cf(u, Cy, _ & 4 ? Do : p, true), h = Zt(u), h & 4 && h & 2 && Object.freeze(u), u);
        }
        return u.ja === af ? Ry(u) : u;
      }
    }
    function Dy(u, h, p, _, E, C, M) {
      if (u = u.h && u.h[p]) {
        if (_ = Zt(u), _ & 2 ? _ = u : (C = P(u, Ry), Do(_, C), Object.freeze(C), _ = C), rf(h), M = _ == null ? Vs : nf([]), _ != null) {
          for (C = !!_.length, u = 0; u < _.length; u++) {
            var R = _[u];
            C = C && !(Zt(R.o) & 2), M[u] = R.o;
          }
          C = (C ? 8 : 0) | 1, u = Zt(M), (u & C) !== C && (Object.isFrozen(M) && (M = Array.prototype.slice.call(M)), Gn(M, u | C)), h.h || (h.h = {}), h.h[p] = _;
        } else h.h && (h.h[p] = void 0);
        Ls(h, p, M, E);
      } else Pn(h, p, Cy(_, C, M), E);
    }
    function Ry(u) {
      return Zt(u.o) & 2 || (u = Oy(u, true), Ma(u.o, 2)), u;
    }
    function Oy(u, h) {
      var p = u.o, _ = [];
      Ma(_, 16);
      var E = u.constructor.h;
      if (E && _.push(E), E = u.B, E) {
        _.length = p.length, _.fill(void 0, _.length, p.length);
        var C = {};
        _[_.length - 1] = C;
      }
      Zt(p) & 128 && sf(_), h = h || u.C() ? Do : x2, C = u.constructor, zo = _, _ = new C(_), zo = void 0, u.R && (_.R = u.R.slice()), C = !!(Zt(p) & 16);
      for (var M = E ? p.length - 1 : p.length, R = 0; R < M; R++) Dy(u, _, R - u.G, p[R], false, C, h);
      if (E) for (var L in E) Dy(u, _, +L, E[L], true, C, h);
      return _;
    }
    function Ne(u, h, p) {
      u == null && (u = zo), zo = void 0;
      var _ = this.constructor.i || 0, E = 0 < _, C = this.constructor.h, M = false;
      if (u == null) {
        u = C ? [
          C
        ] : [];
        var R = 48, L = true;
        E && (_ = 0, R |= 128), Gn(u, R);
      } else {
        if (!Array.isArray(u) || C && C !== u[0]) throw Error();
        var H = R = Ma(u, 0);
        if ((L = (16 & H) !== 0) && ((M = (32 & H) !== 0) || (H |= 32)), E) {
          if (128 & H) _ = 0;
          else if (0 < u.length) {
            var X = u[u.length - 1];
            if (Ro(X) && "g" in X) {
              _ = 0, H |= 128, delete X.g;
              var W = true, Z;
              for (Z in X) {
                W = false;
                break;
              }
              W && u.pop();
            }
          }
        } else if (128 & H) throw Error();
        R !== H && Gn(u, H);
      }
      this.G = (C ? 0 : -1) - _, this.h = void 0, this.o = u;
      t: {
        if (C = this.o.length, _ = C - 1, C && (C = this.o[_], Ro(C))) {
          this.B = C, this.i = _ - this.G;
          break t;
        }
        h !== void 0 && -1 < h ? (this.i = Math.max(h, _ + 1 - this.G), this.B = void 0) : this.i = Number.MAX_VALUE;
      }
      if (!E && this.B && "g" in this.B) throw Error('Unexpected "g" flag in sparse object of message that is not a group type.');
      if (p) {
        h = L && !M && true, E = this.i;
        var F;
        for (L = 0; L < p.length; L++) M = p[L], M < E ? (M += this.G, (_ = u[M]) ? zy(_, h) : u[M] = Vs) : (F || (F = Ay(this)), (_ = F[M]) ? zy(_, h) : F[M] = Vs);
      }
    }
    Ne.prototype.toJSON = function() {
      return cf(this.o, E2, w2);
    }, Ne.prototype.C = function() {
      return !!(Zt(this.o) & 2);
    };
    function zy(u, h) {
      if (Array.isArray(u)) {
        var p = Zt(u), _ = 1;
        !h || p & 2 || (_ |= 16), (p & _) !== _ && Gn(u, p | _);
      }
    }
    Ne.prototype.ja = af, Ne.prototype.toString = function() {
      return this.o.toString();
    };
    function Uy(u, h, p) {
      if (p) {
        var _ = {}, E;
        for (E in p) {
          var C = p[E], M = C.ra;
          M || (_.J = C.xa || C.oa.W, C.ia ? (_.aa = By(C.ia), M = /* @__PURE__ */ function(R) {
            return function(L, H, X) {
              return R.J(L, H, X, R.aa);
            };
          }(_)) : C.ka ? (_.Z = Hy(C.da.P, C.ka), M = /* @__PURE__ */ function(R) {
            return function(L, H, X) {
              return R.J(L, H, X, R.Z);
            };
          }(_)) : M = _.J, C.ra = M), M(h, u, C.da), _ = {
            J: _.J,
            aa: _.aa,
            Z: _.Z
          };
        }
      }
      T2(h, u);
    }
    var Uo = Symbol();
    function Vy(u, h, p) {
      return u[Uo] || (u[Uo] = function(_, E) {
        return h(_, E, p);
      });
    }
    function Ly(u) {
      var h = u[Uo];
      if (!h) {
        var p = hf(u);
        h = function(_, E) {
          return Yy(_, E, p);
        }, u[Uo] = h;
      }
      return h;
    }
    function M2(u) {
      var h = u.ia;
      if (h) return Ly(h);
      if (h = u.wa) return Vy(u.da.P, h, u.ka);
    }
    function C2(u) {
      var h = M2(u), p = u.da, _ = u.oa.U;
      return h ? function(E, C) {
        return _(E, C, p, h);
      } : function(E, C) {
        return _(E, C, p);
      };
    }
    function Ny(u, h) {
      var p = u[h];
      return typeof p == "function" && p.length === 0 && (p = p(), u[h] = p), Array.isArray(p) && (js in p || Ns in p || 0 < p.length && typeof p[0] == "function") ? p : void 0;
    }
    function jy(u, h, p, _, E, C) {
      h.P = u[0];
      var M = 1;
      if (u.length > M && typeof u[M] != "number") {
        var R = u[M++];
        p(h, R);
      }
      for (; M < u.length; ) {
        p = u[M++];
        for (var L = M + 1; L < u.length && typeof u[L] != "number"; ) L++;
        switch (R = u[M++], L -= M, L) {
          case 0:
            _(h, p, R);
            break;
          case 1:
            (L = Ny(u, M)) ? (M++, E(h, p, R, L)) : _(h, p, R, u[M++]);
            break;
          case 2:
            L = M++, L = Ny(u, L), E(h, p, R, L, u[M++]);
            break;
          case 3:
            C(h, p, R, u[M++], u[M++], u[M++]);
            break;
          case 4:
            C(h, p, R, u[M++], u[M++], u[M++], u[M++]);
            break;
          default:
            throw Error("unexpected number of binary field arguments: " + L);
        }
      }
      return h;
    }
    var Vo = Symbol();
    function By(u) {
      var h = u[Vo];
      if (!h) {
        var p = ff(u);
        h = function(_, E) {
          return Gy(_, E, p);
        }, u[Vo] = h;
      }
      return h;
    }
    function Hy(u, h) {
      var p = u[Vo];
      return p || (p = function(_, E) {
        return Uy(_, E, h);
      }, u[Vo] = p), p;
    }
    var Ns = Symbol();
    function D2(u, h) {
      u.push(h);
    }
    function R2(u, h, p) {
      u.push(h, p.W);
    }
    function O2(u, h, p, _) {
      var E = By(_), C = ff(_).P, M = p.W;
      u.push(h, function(R, L, H) {
        return M(R, L, H, C, E);
      });
    }
    function z2(u, h, p, _, E, C) {
      var M = Hy(_, C), R = p.W;
      u.push(h, function(L, H, X) {
        return R(L, H, X, _, M);
      });
    }
    function ff(u) {
      var h = u[Ns];
      return h || (h = jy(u, u[Ns] = [], D2, R2, O2, z2), js in u && Ns in u && (u.length = 0), h);
    }
    var js = Symbol();
    function U2(u, h) {
      u[0] = h;
    }
    function V2(u, h, p, _) {
      var E = p.U;
      u[h] = _ ? function(C, M, R) {
        return E(C, M, R, _);
      } : E;
    }
    function L2(u, h, p, _, E) {
      var C = p.U, M = Ly(_), R = hf(_).P;
      u[h] = function(L, H, X) {
        return C(L, H, X, R, M, E);
      };
    }
    function N2(u, h, p, _, E, C, M) {
      var R = p.U, L = Vy(_, E, C);
      u[h] = function(H, X, W) {
        return R(H, X, W, _, L, M);
      };
    }
    function hf(u) {
      var h = u[js];
      return h || (h = jy(u, u[js] = {}, U2, V2, L2, N2), js in u && Ns in u && (u.length = 0), h);
    }
    function Yy(u, h, p) {
      for (; Sy(h) && h.i != 4; ) {
        var _ = h.l, E = p[_];
        if (!E) {
          var C = p[0];
          C && (C = C[_]) && (E = p[_] = C2(C));
        }
        if (!E || !E(h, u, _)) {
          E = h, _ = u, C = E.j, Mo(E);
          var M = E;
          if (!M.ca) {
            if (E = M.h.h - C, M.h.h = C, M = M.h, E == 0) E = Wc();
            else {
              if (C = vy(M, E), M.S && M.m) E = M.i.subarray(C, C + E);
              else {
                M = M.i;
                var R = C;
                E = C + E, E = R === E ? Os() : wt ? M.slice(R, E) : new Uint8Array(M.subarray(R, E));
              }
              E = E.length == 0 ? Wc() : new zs(E, xa);
            }
            (C = _.R) ? C.push(E) : _.R = [
              E
            ];
          }
        }
      }
      return u;
    }
    function Gy(u, h, p) {
      for (var _ = p.length, E = _ % 2 == 1, C = E ? 1 : 0; C < _; C += 2) (0, p[C + 1])(h, u, p[C]);
      Uy(u, h, E ? p[0] : void 0);
    }
    function Bs(u, h) {
      return {
        U: u,
        W: h
      };
    }
    var Ln = Bs(function(u, h, p) {
      if (u.i !== 5) return false;
      u = u.h;
      var _ = u.i, E = u.h, C = _[E], M = _[E + 1], R = _[E + 2];
      return _ = _[E + 3], Ea(u, u.h + 4), M = (C << 0 | M << 8 | R << 16 | _ << 24) >>> 0, u = 2 * (M >> 31) + 1, C = M >>> 23 & 255, M &= 8388607, Pn(h, p, C == 255 ? M ? NaN : 1 / 0 * u : C == 0 ? u * Math.pow(2, -149) * M : u * Math.pow(2, C - 150) * (M + Math.pow(2, 23))), true;
    }, function(u, h, p) {
      if (h = of(h, p), h != null) {
        wa(u.h, 8 * p + 5), u = u.h;
        var _ = +h;
        _ === 0 ? 0 < 1 / _ ? ft = Mt = 0 : (Mt = 0, ft = 2147483648) : isNaN(_) ? (Mt = 0, ft = 2147483647) : (_ = (p = 0 > _ ? -2147483648 : 0) ? -_ : _, 34028234663852886e22 < _ ? (Mt = 0, ft = (p | 2139095040) >>> 0) : 11754943508222875e-54 > _ ? (_ = Math.round(_ / Math.pow(2, -149)), Mt = 0, ft = (p | _) >>> 0) : (h = Math.floor(Math.log(_) / Math.LN2), _ *= Math.pow(2, -h), _ = Math.round(8388608 * _), 16777216 <= _ && ++h, Mt = 0, ft = (p | h + 127 << 23 | _ & 8388607) >>> 0)), p = ft, u.h.push(p >>> 0 & 255), u.h.push(p >>> 8 & 255), u.h.push(p >>> 16 & 255), u.h.push(p >>> 24 & 255);
      }
    }), j2 = Bs(function(u, h, p) {
      if (u.i !== 0) return false;
      var _ = u.h, E = 0, C = u = 0, M = _.i, R = _.h;
      do {
        var L = M[R++];
        E |= (L & 127) << C, C += 7;
      } while (32 > C && L & 128);
      for (32 < C && (u |= (L & 127) >> 4), C = 3; 32 > C && L & 128; C += 7) L = M[R++], u |= (L & 127) << C;
      if (Ea(_, R), 128 > L) _ = E >>> 0, L = u >>> 0, (u = L & 2147483648) && (_ = ~_ + 1 >>> 0, L = ~L >>> 0, _ == 0 && (L = L + 1 >>> 0)), _ = 4294967296 * L + (_ >>> 0);
      else throw vt();
      return Pn(h, p, u ? -_ : _), true;
    }, function(u, h, p) {
      h = Vn(h, p), h != null && (typeof h == "string" && we(h), h != null && (wa(u.h, 8 * p), typeof h == "number" ? (u = u.h, Qt(h), by(u, ft, Mt)) : (p = we(h), by(u.h, p.i, p.h))));
    }), B2 = Bs(function(u, h, p) {
      return u.i !== 0 ? false : (Pn(h, p, Us(u.h)), true);
    }, function(u, h, p) {
      if (h = Vn(h, p), h != null && h != null) if (wa(u.h, 8 * p), u = u.h, p = h, 0 <= p) wa(u, p);
      else {
        for (h = 0; 9 > h; h++) u.h.push(p & 127 | 128), p >>= 7;
        u.h.push(1);
      }
    }), Py = Bs(function(u, h, p) {
      if (u.i !== 2) return false;
      var _ = Us(u.h) >>> 0;
      u = u.h;
      var E = vy(u, _);
      if (u = u.i, v2) {
        var C = u, M;
        (M = $c) || (M = $c = new TextDecoder("utf-8", {
          fatal: true
        })), u = E + _, C = E === 0 && u === C.length ? C : C.subarray(E, u);
        try {
          var R = M.decode(C);
        } catch (W) {
          if (wo === void 0) {
            try {
              M.decode(new Uint8Array([
                128
              ]));
            } catch {
            }
            try {
              M.decode(new Uint8Array([
                97
              ])), wo = true;
            } catch {
              wo = false;
            }
          }
          throw !wo && ($c = void 0), W;
        }
      } else {
        R = E, _ = R + _, E = [];
        for (var L = null, H, X; R < _; ) H = u[R++], 128 > H ? E.push(H) : 224 > H ? R >= _ ? Aa() : (X = u[R++], 194 > H || (X & 192) !== 128 ? (R--, Aa()) : E.push((H & 31) << 6 | X & 63)) : 240 > H ? R >= _ - 1 ? Aa() : (X = u[R++], (X & 192) !== 128 || H === 224 && 160 > X || H === 237 && 160 <= X || ((C = u[R++]) & 192) !== 128 ? (R--, Aa()) : E.push((H & 15) << 12 | (X & 63) << 6 | C & 63)) : 244 >= H ? R >= _ - 2 ? Aa() : (X = u[R++], (X & 192) !== 128 || (H << 28) + (X - 144) >> 30 || ((C = u[R++]) & 192) !== 128 || ((M = u[R++]) & 192) !== 128 ? (R--, Aa()) : (H = (H & 7) << 18 | (X & 63) << 12 | (C & 63) << 6 | M & 63, H -= 65536, E.push((H >> 10 & 1023) + 55296, (H & 1023) + 56320))) : Aa(), 8192 <= E.length && (L = hy(L, E), E.length = 0);
        R = hy(L, E);
      }
      return Pn(h, p, R), true;
    }, function(u, h, p) {
      if (h = Vn(h, p), h != null) {
        var _ = false;
        if (_ = _ === void 0 ? false : _, _2) {
          if (_ && /(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/.test(h)) throw Error("Found an unpaired surrogate");
          h = (dy || (dy = new TextEncoder())).encode(h);
        } else {
          for (var E = 0, C = new Uint8Array(3 * h.length), M = 0; M < h.length; M++) {
            var R = h.charCodeAt(M);
            if (128 > R) C[E++] = R;
            else {
              if (2048 > R) C[E++] = R >> 6 | 192;
              else {
                if (55296 <= R && 57343 >= R) {
                  if (56319 >= R && M < h.length) {
                    var L = h.charCodeAt(++M);
                    if (56320 <= L && 57343 >= L) {
                      R = 1024 * (R - 55296) + L - 56320 + 65536, C[E++] = R >> 18 | 240, C[E++] = R >> 12 & 63 | 128, C[E++] = R >> 6 & 63 | 128, C[E++] = R & 63 | 128;
                      continue;
                    } else M--;
                  }
                  if (_) throw Error("Found an unpaired surrogate");
                  R = 65533;
                }
                C[E++] = R >> 12 | 224, C[E++] = R >> 6 & 63 | 128;
              }
              C[E++] = R & 63 | 128;
            }
          }
          h = E === C.length ? C : C.subarray(0, E);
        }
        wa(u.h, 8 * p + 2), wa(u.h, h.length), dr(u, u.h.end()), dr(u, h);
      }
    }), ky = Bs(function(u, h, p, _, E) {
      if (u.i !== 2) return false;
      h = wy(h, p, _), p = u.h.j, _ = Us(u.h) >>> 0;
      var C = u.h.h + _, M = C - p;
      if (0 >= M && (u.h.j = C, E(h, u, void 0, void 0, void 0), M = C - u.h.h), M) throw Error("Message parsing ended unexpectedly. Expected to read " + (_ + " bytes, instead read " + (_ - M) + " bytes, either the data ended unexpectedly or the message misreported its own length"));
      return u.h.h = C, u.h.j = p, true;
    }, function(u, h, p, _, E) {
      if (h = uf(h, _, p), h != null) for (_ = 0; _ < h.length; _++) {
        var C = u;
        wa(C.h, 8 * p + 2);
        var M = C.h.end();
        dr(C, M), M.push(C.i), C = M, E(h[_], u), M = u;
        var R = C.pop();
        for (R = M.i + M.h.length() - R; 127 < R; ) C.push(R & 127 | 128), R >>>= 7, M.i++;
        C.push(R), M.i++;
      }
    });
    function df(u) {
      return function(h, p) {
        t: {
          if (Co.length) {
            var _ = Co.pop();
            _.setOptions(p), Ic(_.h, h, p), h = _;
          } else h = new ef(h, p);
          try {
            var E = hf(u), C = Yy(new E.P(), h, E);
            break t;
          } finally {
            E = h.h, E.i = null, E.m = false, E.l = 0, E.j = 0, E.h = 0, E.S = false, h.l = -1, h.i = -1, 100 > Co.length && Co.push(h);
          }
          C = void 0;
        }
        return C;
      };
    }
    function mf(u) {
      return function() {
        var h = new S2();
        Gy(this, h, ff(u)), dr(h, h.h.end());
        for (var p = new Uint8Array(h.i), _ = h.j, E = _.length, C = 0, M = 0; M < E; M++) {
          var R = _[M];
          p.set(R, C), C += R.length;
        }
        return h.j = [
          p
        ], p;
      };
    }
    function mr(u) {
      Ne.call(this, u);
    }
    x(mr, Ne);
    var Xy = [
      mr,
      1,
      B2,
      2,
      Ln,
      3,
      Py,
      4,
      Py
    ];
    mr.prototype.l = mf(Xy);
    function pf(u) {
      Ne.call(this, u, -1, H2);
    }
    x(pf, Ne), pf.prototype.addClassification = function(u, h) {
      return wy(this, 1, mr, u, h), this;
    };
    var H2 = [
      1
    ], Y2 = df([
      pf,
      1,
      ky,
      Xy
    ]);
    function Hs(u) {
      Ne.call(this, u);
    }
    x(Hs, Ne);
    var Fy = [
      Hs,
      1,
      Ln,
      2,
      Ln,
      3,
      Ln,
      4,
      Ln,
      5,
      Ln
    ];
    Hs.prototype.l = mf(Fy);
    function qy(u) {
      Ne.call(this, u, -1, G2);
    }
    x(qy, Ne);
    var G2 = [
      1
    ], P2 = df([
      qy,
      1,
      ky,
      Fy
    ]);
    function Lo(u) {
      Ne.call(this, u);
    }
    x(Lo, Ne);
    var Ky = [
      Lo,
      1,
      Ln,
      2,
      Ln,
      3,
      Ln,
      4,
      Ln,
      5,
      Ln,
      6,
      j2
    ], k2 = df(Ky);
    Lo.prototype.l = mf(Ky);
    function Qy(u, h, p) {
      if (p = u.createShader(p === 0 ? u.VERTEX_SHADER : u.FRAGMENT_SHADER), u.shaderSource(p, h), u.compileShader(p), !u.getShaderParameter(p, u.COMPILE_STATUS)) throw Error(`Could not compile WebGL shader.

` + u.getShaderInfoLog(p));
      return p;
    }
    function X2(u) {
      return uf(u, mr, 1).map(function(h) {
        var p = Vn(h, 1);
        return {
          index: p ?? 0,
          qa: Xn(h, 2),
          label: Vn(h, 3) != null ? Oo(Vn(h, 3), "") : void 0,
          displayName: Vn(h, 4) != null ? Oo(Vn(h, 4), "") : void 0
        };
      });
    }
    function F2(u) {
      return {
        x: Xn(u, 1),
        y: Xn(u, 2),
        z: Xn(u, 3),
        visibility: of(u, 4) != null ? Xn(u, 4) : void 0
      };
    }
    function yf(u, h) {
      this.i = u, this.h = h, this.m = 0;
    }
    function Zy(u, h, p) {
      return q2(u, h), typeof u.h.canvas.transferToImageBitmap == "function" ? Promise.resolve(u.h.canvas.transferToImageBitmap()) : p ? Promise.resolve(u.h.canvas) : typeof createImageBitmap == "function" ? createImageBitmap(u.h.canvas) : (u.j === void 0 && (u.j = document.createElement("canvas")), new Promise(function(_) {
        u.j.height = u.h.canvas.height, u.j.width = u.h.canvas.width, u.j.getContext("2d", {}).drawImage(u.h.canvas, 0, 0, u.h.canvas.width, u.h.canvas.height), _(u.j);
      }));
    }
    function q2(u, h) {
      var p = u.h;
      if (u.s === void 0) {
        var _ = Qy(p, `
  attribute vec2 aVertex;
  attribute vec2 aTex;
  varying vec2 vTex;
  void main(void) {
    gl_Position = vec4(aVertex, 0.0, 1.0);
    vTex = aTex;
  }`, 0), E = Qy(p, `
  precision mediump float;
  varying vec2 vTex;
  uniform sampler2D sampler0;
  void main(){
    gl_FragColor = texture2D(sampler0, vTex);
  }`, 1), C = p.createProgram();
        if (p.attachShader(C, _), p.attachShader(C, E), p.linkProgram(C), !p.getProgramParameter(C, p.LINK_STATUS)) throw Error(`Could not compile WebGL program.

` + p.getProgramInfoLog(C));
        _ = u.s = C, p.useProgram(_), E = p.getUniformLocation(_, "sampler0"), u.l = {
          O: p.getAttribLocation(_, "aVertex"),
          N: p.getAttribLocation(_, "aTex"),
          ya: E
        }, u.v = p.createBuffer(), p.bindBuffer(p.ARRAY_BUFFER, u.v), p.enableVertexAttribArray(u.l.O), p.vertexAttribPointer(u.l.O, 2, p.FLOAT, false, 0, 0), p.bufferData(p.ARRAY_BUFFER, new Float32Array([
          -1,
          -1,
          -1,
          1,
          1,
          1,
          1,
          -1
        ]), p.STATIC_DRAW), p.bindBuffer(p.ARRAY_BUFFER, null), u.u = p.createBuffer(), p.bindBuffer(p.ARRAY_BUFFER, u.u), p.enableVertexAttribArray(u.l.N), p.vertexAttribPointer(u.l.N, 2, p.FLOAT, false, 0, 0), p.bufferData(p.ARRAY_BUFFER, new Float32Array([
          0,
          1,
          0,
          0,
          1,
          0,
          1,
          1
        ]), p.STATIC_DRAW), p.bindBuffer(p.ARRAY_BUFFER, null), p.uniform1i(E, 0);
      }
      _ = u.l, p.useProgram(u.s), p.canvas.width = h.width, p.canvas.height = h.height, p.viewport(0, 0, h.width, h.height), p.activeTexture(p.TEXTURE0), u.i.bindTexture2d(h.glName), p.enableVertexAttribArray(_.O), p.bindBuffer(p.ARRAY_BUFFER, u.v), p.vertexAttribPointer(_.O, 2, p.FLOAT, false, 0, 0), p.enableVertexAttribArray(_.N), p.bindBuffer(p.ARRAY_BUFFER, u.u), p.vertexAttribPointer(_.N, 2, p.FLOAT, false, 0, 0), p.bindFramebuffer(p.DRAW_FRAMEBUFFER ? p.DRAW_FRAMEBUFFER : p.FRAMEBUFFER, null), p.clearColor(0, 0, 0, 0), p.clear(p.COLOR_BUFFER_BIT), p.colorMask(true, true, true, true), p.drawArrays(p.TRIANGLE_FAN, 0, 4), p.disableVertexAttribArray(_.O), p.disableVertexAttribArray(_.N), p.bindBuffer(p.ARRAY_BUFFER, null), u.i.bindTexture2d(0);
    }
    function K2(u) {
      this.h = u;
    }
    var Q2 = new Uint8Array([
      0,
      97,
      115,
      109,
      1,
      0,
      0,
      0,
      1,
      4,
      1,
      96,
      0,
      0,
      3,
      2,
      1,
      0,
      10,
      9,
      1,
      7,
      0,
      65,
      0,
      253,
      15,
      26,
      11
    ]);
    function Z2(u, h) {
      return h + u;
    }
    function Jy(u, h) {
      window[u] = h;
    }
    function J2(u) {
      var h = document.createElement("script");
      return h.setAttribute("src", u), h.setAttribute("crossorigin", "anonymous"), new Promise(function(p) {
        h.addEventListener("load", function() {
          p();
        }, false), h.addEventListener("error", function() {
          p();
        }, false), document.body.appendChild(h);
      });
    }
    function $2() {
      return Y(function(u) {
        switch (u.h) {
          case 1:
            return u.s = 2, A(u, WebAssembly.instantiate(Q2), 4);
          case 4:
            u.h = 3, u.s = 0;
            break;
          case 2:
            return u.s = 0, u.l = null, u.return(false);
          case 3:
            return u.return(true);
        }
      });
    }
    function gf(u) {
      if (this.h = u, this.listeners = {}, this.l = {}, this.L = {}, this.s = {}, this.v = {}, this.M = this.u = this.ga = true, this.I = Promise.resolve(), this.fa = "", this.D = {}, this.locateFile = u && u.locateFile || Z2, typeof window == "object") var h = window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/";
      else if (typeof location < "u") h = location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/";
      else throw Error("solutions can only be loaded on a web page or in a web worker");
      if (this.ha = h, u.options) {
        h = l(Object.keys(u.options));
        for (var p = h.next(); !p.done; p = h.next()) {
          p = p.value;
          var _ = u.options[p].default;
          _ !== void 0 && (this.l[p] = typeof _ == "function" ? _() : _);
        }
      }
    }
    t = gf.prototype, t.close = function() {
      return this.j && this.j.delete(), Promise.resolve();
    };
    function W2(u) {
      var h, p, _, E, C, M, R, L, H, X, W;
      return Y(function(Z) {
        switch (Z.h) {
          case 1:
            return u.ga ? (h = u.h.files === void 0 ? [] : typeof u.h.files == "function" ? u.h.files(u.l) : u.h.files, A(Z, $2(), 2)) : Z.return();
          case 2:
            if (p = Z.i, typeof window == "object") return Jy("createMediapipeSolutionsWasm", {
              locateFile: u.locateFile
            }), Jy("createMediapipeSolutionsPackedAssets", {
              locateFile: u.locateFile
            }), M = h.filter(function(F) {
              return F.data !== void 0;
            }), R = h.filter(function(F) {
              return F.data === void 0;
            }), L = Promise.all(M.map(function(F) {
              var I = No(u, F.url);
              if (F.path !== void 0) {
                var rt = F.path;
                I = I.then(function(Ct) {
                  return u.overrideFile(rt, Ct), Promise.resolve(Ct);
                });
              }
              return I;
            })), H = Promise.all(R.map(function(F) {
              return F.simd === void 0 || F.simd && p || !F.simd && !p ? J2(u.locateFile(F.url, u.ha)) : Promise.resolve();
            })).then(function() {
              var F, I, rt;
              return Y(function(Ct) {
                if (Ct.h == 1) return F = window.createMediapipeSolutionsWasm, I = window.createMediapipeSolutionsPackedAssets, rt = u, A(Ct, F(I), 2);
                rt.i = Ct.i, Ct.h = 0;
              });
            }), X = function() {
              return Y(function(F) {
                return u.h.graph && u.h.graph.url ? F = A(F, No(u, u.h.graph.url), 0) : (F.h = 0, F = void 0), F;
              });
            }(), A(Z, Promise.all([
              H,
              L,
              X
            ]), 7);
            if (typeof importScripts != "function") throw Error("solutions can only be loaded on a web page or in a web worker");
            return _ = h.filter(function(F) {
              return F.simd === void 0 || F.simd && p || !F.simd && !p;
            }).map(function(F) {
              return u.locateFile(F.url, u.ha);
            }), importScripts.apply(null, o(_)), E = u, A(Z, createMediapipeSolutionsWasm(Module), 6);
          case 6:
            E.i = Z.i, u.m = new OffscreenCanvas(1, 1), u.i.canvas = u.m, C = u.i.GL.createContext(u.m, {
              antialias: false,
              alpha: false,
              va: typeof WebGL2RenderingContext < "u" ? 2 : 1
            }), u.i.GL.makeContextCurrent(C), Z.h = 4;
            break;
          case 7:
            if (u.m = document.createElement("canvas"), W = u.m.getContext("webgl2", {}), !W && (W = u.m.getContext("webgl", {}), !W)) return alert("Failed to create WebGL canvas context when passing video frame."), Z.return();
            u.K = W, u.i.canvas = u.m, u.i.createContext(u.m, true, true, {});
          case 4:
            u.j = new u.i.SolutionWasm(), u.ga = false, Z.h = 0;
        }
      });
    }
    function I2(u) {
      var h, p, _, E, C, M, R, L;
      return Y(function(H) {
        if (H.h == 1) {
          if (u.h.graph && u.h.graph.url && u.fa === u.h.graph.url) return H.return();
          if (u.u = true, !u.h.graph || !u.h.graph.url) {
            H.h = 2;
            return;
          }
          return u.fa = u.h.graph.url, A(H, No(u, u.h.graph.url), 3);
        }
        for (H.h != 2 && (h = H.i, u.j.loadGraph(h)), p = l(Object.keys(u.D)), _ = p.next(); !_.done; _ = p.next()) E = _.value, u.j.overrideFile(E, u.D[E]);
        if (u.D = {}, u.h.listeners) for (C = l(u.h.listeners), M = C.next(); !M.done; M = C.next()) R = M.value, iA(u, R);
        L = u.l, u.l = {}, u.setOptions(L), H.h = 0;
      });
    }
    t.reset = function() {
      var u = this;
      return Y(function(h) {
        u.j && (u.j.reset(), u.s = {}, u.v = {}), h.h = 0;
      });
    }, t.setOptions = function(u, h) {
      var p = this;
      if (h = h || this.h.options) {
        for (var _ = [], E = [], C = {}, M = l(Object.keys(u)), R = M.next(); !R.done; C = {
          X: C.X,
          Y: C.Y
        }, R = M.next()) if (R = R.value, !(R in this.l && this.l[R] === u[R])) {
          this.l[R] = u[R];
          var L = h[R];
          L !== void 0 && (L.onChange && (C.X = L.onChange, C.Y = u[R], _.push(/* @__PURE__ */ function(H) {
            return function() {
              var X;
              return Y(function(W) {
                if (W.h == 1) return A(W, H.X(H.Y), 2);
                X = W.i, X === true && (p.u = true), W.h = 0;
              });
            };
          }(C))), L.graphOptionXref && (R = Object.assign({}, {
            calculatorName: "",
            calculatorIndex: 0
          }, L.graphOptionXref, {
            valueNumber: L.type === 1 ? u[R] : 0,
            valueBoolean: L.type === 0 ? u[R] : false,
            valueString: L.type === 2 ? u[R] : ""
          }), E.push(R)));
        }
        (_.length !== 0 || E.length !== 0) && (this.u = true, this.H = (this.H === void 0 ? [] : this.H).concat(E), this.F = (this.F === void 0 ? [] : this.F).concat(_));
      }
    };
    function tA(u) {
      var h, p, _, E, C, M, R;
      return Y(function(L) {
        switch (L.h) {
          case 1:
            if (!u.u) return L.return();
            if (!u.F) {
              L.h = 2;
              break;
            }
            h = l(u.F), p = h.next();
          case 3:
            if (p.done) {
              L.h = 5;
              break;
            }
            return _ = p.value, A(L, _(), 4);
          case 4:
            p = h.next(), L.h = 3;
            break;
          case 5:
            u.F = void 0;
          case 2:
            if (u.H) {
              for (E = new u.i.GraphOptionChangeRequestList(), C = l(u.H), M = C.next(); !M.done; M = C.next()) R = M.value, E.push_back(R);
              u.j.changeOptions(E), E.delete(), u.H = void 0;
            }
            u.u = false, L.h = 0;
        }
      });
    }
    t.initialize = function() {
      var u = this;
      return Y(function(h) {
        return h.h == 1 ? A(h, W2(u), 2) : h.h != 3 ? A(h, I2(u), 3) : A(h, tA(u), 0);
      });
    };
    function No(u, h) {
      var p, _;
      return Y(function(E) {
        return h in u.L ? E.return(u.L[h]) : (p = u.locateFile(h, ""), _ = fetch(p).then(function(C) {
          return C.arrayBuffer();
        }), u.L[h] = _, E.return(_));
      });
    }
    t.overrideFile = function(u, h) {
      this.j ? this.j.overrideFile(u, h) : this.D[u] = h;
    }, t.clearOverriddenFiles = function() {
      this.D = {}, this.j && this.j.clearOverriddenFiles();
    }, t.send = function(u, h) {
      var p = this, _, E, C, M, R, L, H, X, W;
      return Y(function(Z) {
        switch (Z.h) {
          case 1:
            return p.h.inputs ? (_ = 1e3 * (h ?? performance.now()), A(Z, p.I, 2)) : Z.return();
          case 2:
            return A(Z, p.initialize(), 3);
          case 3:
            for (E = new p.i.PacketDataList(), C = l(Object.keys(u)), M = C.next(); !M.done; M = C.next()) if (R = M.value, L = p.h.inputs[R]) {
              t: {
                var F = u[R];
                switch (L.type) {
                  case "video":
                    var I = p.s[L.stream];
                    if (I || (I = new yf(p.i, p.K), p.s[L.stream] = I), I.m === 0 && (I.m = I.i.createTexture()), typeof HTMLVideoElement < "u" && F instanceof HTMLVideoElement) var rt = F.videoWidth, Ct = F.videoHeight;
                    else typeof HTMLImageElement < "u" && F instanceof HTMLImageElement ? (rt = F.naturalWidth, Ct = F.naturalHeight) : (rt = F.width, Ct = F.height);
                    Ct = {
                      glName: I.m,
                      width: rt,
                      height: Ct
                    }, rt = I.h, rt.canvas.width = Ct.width, rt.canvas.height = Ct.height, rt.activeTexture(rt.TEXTURE0), I.i.bindTexture2d(I.m), rt.texImage2D(rt.TEXTURE_2D, 0, rt.RGBA, rt.RGBA, rt.UNSIGNED_BYTE, F), I.i.bindTexture2d(0), I = Ct;
                    break t;
                  case "detections":
                    for (I = p.s[L.stream], I || (I = new K2(p.i), p.s[L.stream] = I), I.data || (I.data = new I.h.DetectionListData()), I.data.reset(F.length), Ct = 0; Ct < F.length; ++Ct) {
                      rt = F[Ct];
                      var At = I.data, ye = At.setBoundingBox, pn = Ct, je = rt.la, ht = new Lo();
                      if (kn(ht, 1, je.sa), kn(ht, 2, je.ta), kn(ht, 3, je.height), kn(ht, 4, je.width), kn(ht, 5, je.rotation), Pn(ht, 6, je.pa), je = ht.l(), ye.call(At, pn, je), rt.ea) for (At = 0; At < rt.ea.length; ++At) {
                        ht = rt.ea[At], ye = I.data, pn = ye.addNormalizedLandmark, je = Ct, ht = Object.assign({}, ht, {
                          visibility: ht.visibility ? ht.visibility : 0
                        });
                        var ge = new Hs();
                        kn(ge, 1, ht.x), kn(ge, 2, ht.y), kn(ge, 3, ht.z), ht.visibility && kn(ge, 4, ht.visibility), ht = ge.l(), pn.call(ye, je, ht);
                      }
                      if (rt.ba) for (At = 0; At < rt.ba.length; ++At) ye = I.data, pn = ye.addClassification, je = Ct, ht = rt.ba[At], ge = new mr(), kn(ge, 2, ht.qa), ht.index && Pn(ge, 1, ht.index), ht.label && Pn(ge, 3, ht.label), ht.displayName && Pn(ge, 4, ht.displayName), ht = ge.l(), pn.call(ye, je, ht);
                    }
                    I = I.data;
                    break t;
                  default:
                    I = {};
                }
              }
              switch (H = I, X = L.stream, L.type) {
                case "video":
                  E.pushTexture2d(Object.assign({}, H, {
                    stream: X,
                    timestamp: _
                  }));
                  break;
                case "detections":
                  W = H, W.stream = X, W.timestamp = _, E.pushDetectionList(W);
                  break;
                default:
                  throw Error("Unknown input config type: '" + L.type + "'");
              }
            }
            return p.j.send(E), A(Z, p.I, 4);
          case 4:
            E.delete(), Z.h = 0;
        }
      });
    };
    function eA(u, h, p) {
      var _, E, C, M, R, L, H, X, W, Z, F, I, rt, Ct;
      return Y(function(At) {
        switch (At.h) {
          case 1:
            if (!p) return At.return(h);
            for (_ = {}, E = 0, C = l(Object.keys(p)), M = C.next(); !M.done; M = C.next()) R = M.value, L = p[R], typeof L != "string" && L.type === "texture" && h[L.stream] !== void 0 && ++E;
            1 < E && (u.M = false), H = l(Object.keys(p)), M = H.next();
          case 2:
            if (M.done) {
              At.h = 4;
              break;
            }
            if (X = M.value, W = p[X], typeof W == "string") return rt = _, Ct = X, A(At, nA(u, X, h[W]), 14);
            if (Z = h[W.stream], W.type === "detection_list") {
              if (Z) {
                for (var ye = Z.getRectList(), pn = Z.getLandmarksList(), je = Z.getClassificationsList(), ht = [], ge = 0; ge < ye.size(); ++ge) {
                  var Li = k2(ye.get(ge)), aA = Xn(Li, 1), rA = Xn(Li, 2), sA = Xn(Li, 3), lA = Xn(Li, 4), oA = Xn(Li, 5, 0), jo = void 0;
                  jo = jo === void 0 ? 0 : jo, Li = {
                    la: {
                      sa: aA,
                      ta: rA,
                      height: sA,
                      width: lA,
                      rotation: oA,
                      pa: Oo(Vn(Li, 6), jo)
                    },
                    ea: uf(P2(pn.get(ge)), Hs, 1).map(F2),
                    ba: X2(Y2(je.get(ge)))
                  }, ht.push(Li);
                }
                ye = ht;
              } else ye = [];
              _[X] = ye, At.h = 7;
              break;
            }
            if (W.type === "proto_list") {
              if (Z) {
                for (ye = Array(Z.size()), pn = 0; pn < Z.size(); pn++) ye[pn] = Z.get(pn);
                Z.delete();
              } else ye = [];
              _[X] = ye, At.h = 7;
              break;
            }
            if (Z === void 0) {
              At.h = 3;
              break;
            }
            if (W.type === "float_list") {
              _[X] = Z, At.h = 7;
              break;
            }
            if (W.type === "proto") {
              _[X] = Z, At.h = 7;
              break;
            }
            if (W.type !== "texture") throw Error("Unknown output config type: '" + W.type + "'");
            return F = u.v[X], F || (F = new yf(u.i, u.K), u.v[X] = F), A(At, Zy(F, Z, u.M), 13);
          case 13:
            I = At.i, _[X] = I;
          case 7:
            W.transform && _[X] && (_[X] = W.transform(_[X])), At.h = 3;
            break;
          case 14:
            rt[Ct] = At.i;
          case 3:
            M = H.next(), At.h = 2;
            break;
          case 4:
            return At.return(_);
        }
      });
    }
    function nA(u, h, p) {
      var _;
      return Y(function(E) {
        return typeof p == "number" || p instanceof Uint8Array || p instanceof u.i.Uint8BlobList ? E.return(p) : p instanceof u.i.Texture2dDataOut ? (_ = u.v[h], _ || (_ = new yf(u.i, u.K), u.v[h] = _), E.return(Zy(_, p, u.M))) : E.return(void 0);
      });
    }
    function iA(u, h) {
      for (var p = h.name || "$", _ = [].concat(o(h.wants)), E = new u.i.StringList(), C = l(h.wants), M = C.next(); !M.done; M = C.next()) E.push_back(M.value);
      C = u.i.PacketListener.implement({
        onResults: function(R) {
          for (var L = {}, H = 0; H < h.wants.length; ++H) L[_[H]] = R.get(H);
          var X = u.listeners[p];
          X && (u.I = eA(u, L, h.outs).then(function(W) {
            W = X(W);
            for (var Z = 0; Z < h.wants.length; ++Z) {
              var F = L[_[Z]];
              typeof F == "object" && F.hasOwnProperty && F.hasOwnProperty("delete") && F.delete();
            }
            W && (u.I = W);
          }));
        }
      }), u.j.attachMultiListener(E, C), E.delete();
    }
    t.onResults = function(u, h) {
      this.listeners[h || "$"] = u;
    }, K("Solution", gf), K("OptionType", {
      BOOL: 0,
      NUMBER: 1,
      ua: 2,
      0: "BOOL",
      1: "NUMBER",
      2: "STRING"
    });
    function $y(u) {
      switch (u === void 0 && (u = 0), u) {
        case 1:
          return "selfie_segmentation_landscape.tflite";
        default:
          return "selfie_segmentation.tflite";
      }
    }
    function Wy(u) {
      var h = this;
      u = u || {}, this.h = new gf({
        locateFile: u.locateFile,
        files: function(p) {
          return [
            {
              simd: true,
              url: "selfie_segmentation_solution_simd_wasm_bin.js"
            },
            {
              simd: false,
              url: "selfie_segmentation_solution_wasm_bin.js"
            },
            {
              data: true,
              url: $y(p.modelSelection)
            }
          ];
        },
        graph: {
          url: "selfie_segmentation.binarypb"
        },
        listeners: [
          {
            wants: [
              "segmentation_mask",
              "image_transformed"
            ],
            outs: {
              image: {
                type: "texture",
                stream: "image_transformed"
              },
              segmentationMask: {
                type: "texture",
                stream: "segmentation_mask"
              }
            }
          }
        ],
        inputs: {
          image: {
            type: "video",
            stream: "input_frames_gpu"
          }
        },
        options: {
          useCpuInference: {
            type: 0,
            graphOptionXref: {
              calculatorType: "InferenceCalculator",
              fieldName: "use_cpu_inference"
            },
            default: typeof window != "object" || window.navigator === void 0 ? false : "iPad Simulator;iPhone Simulator;iPod Simulator;iPad;iPhone;iPod".split(";").includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document
          },
          selfieMode: {
            type: 0,
            graphOptionXref: {
              calculatorType: "GlScalerCalculator",
              calculatorIndex: 1,
              fieldName: "flip_horizontal"
            }
          },
          modelSelection: {
            type: 1,
            graphOptionXref: {
              calculatorType: "ConstantSidePacketCalculator",
              calculatorName: "ConstantSidePacketCalculatorModelSelection",
              fieldName: "int_value"
            },
            onChange: function(p) {
              var _, E, C;
              return Y(function(M) {
                return M.h == 1 ? (_ = $y(p), E = "third_party/mediapipe/modules/selfie_segmentation/" + _, A(M, No(h.h, _), 2)) : (C = M.i, h.h.overrideFile(E, C), M.return(true));
              });
            }
          }
        }
      });
    }
    t = Wy.prototype, t.close = function() {
      return this.h.close(), Promise.resolve();
    }, t.onResults = function(u) {
      this.h.onResults(u);
    }, t.initialize = function() {
      var u = this;
      return Y(function(h) {
        return A(h, u.h.initialize(), 0);
      });
    }, t.reset = function() {
      this.h.reset();
    }, t.send = function(u) {
      var h = this;
      return Y(function(p) {
        return A(p, h.h.send(u), 0);
      });
    }, t.setOptions = function(u) {
      this.h.setOptions(u);
    }, K("SelfieSegmentation", Wy), K("VERSION", "0.1.1675465747");
  }).call(vf);
  function y2(t) {
    const e = window.SelfieSegmentation || u5.SelfieSegmentation, n = new e({
      locateFile: (i) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${i}`
    });
    return n.setOptions({
      modelSelection: 1,
      selfieMode: true
    }), n.onResults(t), n;
  }
  const c5 = ({ text: t, as: e = "div", typingSpeed: n = 50, initialDelay: i = 0, pauseDuration: a = 2e3, deletingSpeed: r = 30, loop: s = true, className: l = "", showCursor: o = true, hideCursorWhileTyping: c = false, cursorCharacter: f = "|", cursorClassName: d = "", cursorBlinkDuration: m = 0.5, textColors: y = [], variableSpeed: T, onSentenceComplete: b, startOnVisible: x = false, reverseMode: v = false, ...g }) => {
    const [S, A] = D.useState(""), [w, V] = D.useState(0), [z, O] = D.useState(false), [U, B] = D.useState(0), [Y, q] = D.useState(!x), k = D.useRef(null), $ = D.useRef(null), K = D.useMemo(() => Array.isArray(t) ? t : [
      t
    ], [
      t
    ]), N = D.useCallback(() => {
      if (!T) return n;
      const { min: Q, max: it } = T;
      return Math.random() * (it - Q) + Q;
    }, [
      T,
      n
    ]), P = () => y.length === 0 ? "#ffffff" : y[U % y.length];
    D.useEffect(() => {
      if (!x || !$.current) return;
      const Q = new IntersectionObserver((it) => {
        it.forEach((Pt) => {
          Pt.isIntersecting && q(true);
        });
      }, {
        threshold: 0.1
      });
      return Q.observe($.current), () => Q.disconnect();
    }, [
      x
    ]), D.useEffect(() => {
      o && k.current && (io.set(k.current, {
        opacity: 1
      }), io.to(k.current, {
        opacity: 0,
        duration: m,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut"
      }));
    }, [
      o,
      m
    ]), D.useEffect(() => {
      if (!Y) return;
      let Q;
      const it = K[U], Pt = v ? it.split("").reverse().join("") : it, Kt = () => {
        if (z) if (S === "") {
          if (O(false), U === K.length - 1 && !s) return;
          b && b(K[U], U), B((te) => (te + 1) % K.length), V(0), Q = setTimeout(() => {
          }, a);
        } else Q = setTimeout(() => {
          A((te) => te.slice(0, -1));
        }, r);
        else w < Pt.length ? Q = setTimeout(() => {
          A((te) => te + Pt[w]), V((te) => te + 1);
        }, T ? N() : n) : K.length > 1 && (Q = setTimeout(() => {
          O(true);
        }, a));
      };
      return w === 0 && !z && S === "" ? Q = setTimeout(Kt, i) : Kt(), () => clearTimeout(Q);
    }, [
      w,
      S,
      z,
      n,
      r,
      a,
      K,
      U,
      s,
      i,
      Y,
      v,
      T,
      b
    ]);
    const G = c && (w < K[U].length || z);
    return D.createElement(e, {
      ref: $,
      className: `inline-block whitespace-pre-wrap tracking-tight pointer-events-none ${l}`,
      ...g
    }, J.jsx("span", {
      className: "inline",
      style: {
        color: P()
      },
      children: S
    }), o && J.jsx("span", {
      ref: k,
      className: `ml-1 inline-block opacity-100 ${G ? "hidden" : ""} ${d}`,
      children: f
    }));
  }, f5 = () => {
    const t = ES(), e = D.useRef(null), n = D.useRef(null), i = D.useRef(null), a = D.useRef(null), r = D.useRef(null), s = D.useRef(void 0), l = D.useRef(false), o = D.useRef(0), c = D.useRef(null), [f, d] = D.useState(-1), [m, y] = D.useState(false), [T, b] = D.useState(1), [x, v] = D.useState(""), [g, S] = D.useState(false), [A, w] = D.useState(false), V = D.useRef(null), z = 90, O = [
      `\uC6B0\uB9AC\uB294 \uD14D\uC2A4\uD2B8\uB85C \uC138\uC0C1\uC744 \uC774\uD574\uD558\uB824 \uD55C\uB2E4.
\uC218\uB9CE\uC740 \uAE30\uD638\uC758 \uC5BD\uD798 \uC18D\uC5D0\uC11C, \uC6B0\uB9AC\uB294 \uD558\uB098\uC758 \uC758\uBBF8\uB97C \uCC3E\uB294\uB2E4.`,
      `\uD558\uC9C0\uB9CC \uC758\uBBF8\uB294 \uC5B8\uC81C\uB098 \uD769\uC5B4\uC9C4\uB2E4.
\uAC19\uC740 \uBB38\uC7A5\uB3C4, \uC77D\uB294 \uC21C\uAC04\uB9C8\uB2E4 \uB2E4\uB978 \uD754\uC801\uC744 \uB0A8\uAE34\uB2E4.
\uD14D\uC2A4\uD2B8\uB294 \uBA48\uCDB0 \uC788\uC9C0 \uC54A\uB2E4. \uD55C \uBB38\uC7A5\uC774 \uB05D\uB098\uB294 \uC790\uB9AC\uC5D0\uC11C,
\uC774\uBBF8 \uB610 \uB2E4\uB978 \uC758\uBBF8\uAC00 \uD0DC\uC5B4\uB09C\uB2E4.`,
      `\uC6B0\uC5F0\uD788 \uB9DE\uB2FF\uC740 \uAE30\uD638\uB4E4\uC774, \uC7A0\uC2DC \uD558\uB098\uC758 \uC0DD\uBA85\uC744 \uC774\uB8EC\uB2E4.
\uADF8 \uC0DD\uBA85\uC740 \uAE08\uC138 \uC0AC\uB77C\uC9C0\uC9C0\uB9CC, \uB610 \uB2E4\uB978 \uC870\uD569\uC73C\uB85C \uB2E4\uC2DC \uD0DC\uC5B4\uB09C\uB2E4.
\uD14D\uC2A4\uD2B8\uB294 \uBA48\uCD94\uC9C0 \uC54A\uB294\uB2E4. \uB2E8\uC9C0 \uD615\uD0DC\uB97C \uBC14\uAFC0 \uBFD0\uC774\uB2E4.
\uD14D\uC2A4\uD2B8\uB294 \uADF8\uB807\uAC8C, \uB05D\uC5C6\uC774 \uC790\uC2E0\uC744 \uB2E4\uC2DC \uC4F4\uB2E4.`,
      `\uBB34\uC218\uD55C \uC870\uD569 \uC18D\uC5D0\uC11C, \uB2F9\uC2E0\uC740 \uC5B4\uB5A4 \uC758\uBBF8\uB97C \uC77D\uC5B4\uB0B4\uACE0 \uC788\uB098\uC694?
\uC774\uC81C, \uB2F9\uC2E0\uC758 \uD14D\uC2A4\uD2B8\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694.`
    ], U = D.useCallback((Y, q) => {
      const k = Y.length, N = k * (q || 90) / 1e3;
      return console.log(`Duration \uACC4\uC0B0: ${k}\uAE00\uC790, ${N.toFixed(2)}\uCD08`), N;
    }, []), B = D.useCallback(() => {
      const Y = n.current;
      if (!Y) return;
      const q = document.documentElement.clientWidth, k = document.documentElement.clientHeight;
      Y.width = q, Y.height = k;
      const $ = Math.floor(q / (Wi + 1)), K = Math.floor(k / (Wi + 1));
      a.current = new Tc($, K), Cl(a.current, "\uC124\uBA85");
    }, []);
    return fy(() => {
      if (!document.querySelector(".subtitle")) {
        console.error(".subtitle element not found in DOM");
        return;
      }
      V.current && V.current.kill(), console.log(".subtitle element found, creating timeline");
      const q = io.timeline();
      V.current = q;
      const k = U(O[0], z);
      q.to({}, {
        duration: 0.5
      }).call(() => {
        console.log("Stage 1 \uC2DC\uC791"), d(0), v(O[0]), S(true), w(true);
      }).to(".subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.1").call(() => console.log(`Stage 1 \uD0C0\uC774\uD551 \uC2DC\uC791, duration: ${k + 1}\uCD08`)).to({}, {
        duration: k + 1
      }).call(() => {
        console.log("Stage 1 \uD0C0\uC774\uD551 \uC644\uB8CC, \uD398\uC774\uB4DC \uC544\uC6C3 \uC2DC\uC791"), y(true), b(0);
      }).to(".subtitle", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in"
      }).call(() => {
        console.log("Stage 1 \uC885\uB8CC"), w(false), S(false);
      }).to({}, {
        duration: 1
      });
      const $ = U(O[1], z);
      q.call(() => {
        console.log("Stage 2 \uC2DC\uC791"), d(1), v(O[1]), S(true), w(true);
      }).to(".subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.1").to({}, {
        duration: 2,
        onUpdate: function() {
          const P = this.progress();
          b(P * 0.6);
        }
      }).call(() => {
        a.current && Cl(a.current, "\uD558\uB8E8\uB05D");
      }).to({}, {
        duration: $ + 1
      }).to(".subtitle", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in"
      }).call(() => {
        w(false), S(false);
      }).to({}, {
        duration: 1
      });
      const K = U(O[2], z);
      q.call(() => {
        d(2), v(O[2]), S(true), w(true);
      }).to(".subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.1").call(() => {
        a.current && Cl(a.current, "\uAC77\uB2E4");
      }).to({}, {
        duration: K + 1
      }).to(".subtitle", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in"
      }).call(() => {
        w(false), S(false);
      }).to({}, {
        duration: 1
      });
      const N = U(O[3], z);
      q.call(() => {
        d(3), y(false), b(1), v(O[3]), S(true), w(true);
      }).to(".subtitle", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.1").to({}, {
        duration: N + 1
      }).to(".subtitle", {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power2.in"
      }).call(() => {
        w(false), S(false);
      }).to({}, {
        duration: 2
      }).call(() => {
        t("/main");
      }), q.play();
    }, {
      dependencies: []
    }), D.useEffect(() => (B(), window.addEventListener("resize", B), r.current = y2((Y) => {
      Y.segmentationMask && (s.current = Y.segmentationMask);
    }), () => {
      var _a2;
      window.removeEventListener("resize", B), (_a2 = r.current) == null ? void 0 : _a2.close();
    }), [
      B
    ]), D.useEffect(() => {
      const Y = e.current, q = n.current, k = q == null ? void 0 : q.getContext("2d");
      if (!Y || !q || !k) return;
      const $ = async () => {
        var _a2;
        if (!l.current || !m) return;
        const K = performance.now();
        K - o.current >= m2 && (o.current = K, Y.readyState >= 2 && await ((_a2 = r.current) == null ? void 0 : _a2.send({
          image: Y
        })), a.current && s.current && (console.log("Drawing world with segmentation mask"), p2(a.current, s.current, "random", k, Y, true))), c.current = requestAnimationFrame($);
      };
      return m ? (console.log("Starting frame processing, showVideo:", m), l.current && (console.log("Processing already running, canceling old frame"), c.current && cancelAnimationFrame(c.current)), l.current = true, c.current = requestAnimationFrame($)) : (console.log("Stopping frame processing, showVideo:", m), c.current && cancelAnimationFrame(c.current), l.current = false), () => {
        c.current && cancelAnimationFrame(c.current), l.current = false;
      };
    }, [
      m
    ]), D.useEffect(() => {
      (async () => {
        if (m && e.current) {
          console.log("Starting video playback...");
          try {
            await d2(e.current, r5(e.current)), console.log("Video playback started successfully");
          } catch (q) {
            console.error("Failed to start video:", q);
          }
        }
      })();
    }, [
      m
    ]), J.jsxs("div", {
      style: {
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: "black"
      },
      children: [
        J.jsx("video", {
          ref: e,
          id: "inputVideo",
          playsInline: true,
          muted: true,
          style: {
            display: "none"
          }
        }),
        J.jsx("canvas", {
          ref: n,
          id: "game-of-life-canvas",
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: T,
            zIndex: 1,
            transition: "opacity 0.5s ease",
            display: m ? "block" : "none"
          }
        }),
        J.jsx("div", {
          ref: i,
          className: "subtitle",
          style: {
            position: "absolute",
            top: "50%",
            left: "50%",
            textAlign: "center",
            color: "white",
            fontSize: "28px",
            fontFamily: "FunflowSurvivor, sans-serif",
            maxWidth: "80%",
            lineHeight: 1.8,
            zIndex: 10,
            opacity: 0,
            visibility: "visible",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          },
          children: g && f >= 0 && x !== "" && J.jsx(c5, {
            className: "-translate-x-[50%] -translate-y-[50%] pointer-events-none",
            text: x,
            pauseDuration: 0,
            deletingSpeed: 30,
            loop: false,
            showCursor: false,
            hideCursorWhileTyping: true,
            textColors: [
              "#ffffff"
            ],
            initialDelay: 0,
            startOnVisible: false,
            variableSpeed: {
              min: z - 10,
              max: z + 10
            },
            as: "div",
            style: {
              whiteSpace: "pre-line"
            }
          }, `stage-${f}`)
        })
      ]
    });
  }, h5 = ({ canvasRef: t, isProcessing: e = false }) => {
    const n = D.useRef(null), i = () => {
      console.log("Screenshot button clicked"), console.log("canvasRef:", t), console.log("canvasRef.current:", t.current);
      const a = t.current;
      if (!a) {
        console.log("Canvas not found");
        return;
      }
      const r = a.getContext("2d");
      if (!r) {
        console.log("Canvas context not found");
        return;
      }
      if (!r.getImageData(0, 0, a.width, a.height).data.some((c, f) => f % 4 !== 3 && c > 0)) {
        console.log("Canvas appears to be empty");
        return;
      }
      const o = a.toDataURL("image/png");
      n.current && (n.current.href = o, n.current.download = `game-of-life-${(/* @__PURE__ */ new Date()).getTime()}.png`, n.current.click());
    };
    return J.jsxs(J.Fragment, {
      children: [
        J.jsx("button", {
          onClick: i,
          className: "w-full bg-amber-700",
          disabled: !e,
          children: "\uC758\uBBF8 \uCC3E\uC544\uBCF4\uAE30"
        }),
        J.jsx("a", {
          ref: n,
          style: {
            display: "none"
          },
          download: "screenshot.png"
        })
      ]
    });
  }, d5 = () => {
    const t = D.useRef(null), e = D.useRef(null), [n, i] = D.useState("\uBC30\uACE0\uD504\uB2E4"), [a, r] = D.useState("\uBC30\uACE0\uD504\uB2E4"), [s, l] = D.useState(false), [o, c] = D.useState(false), f = D.useRef(null), d = D.useRef(null), m = D.useRef(void 0), y = D.useRef(false), T = D.useRef(0), b = D.useRef(null), x = D.useRef(null), v = D.useCallback(() => {
      const w = e.current;
      if (!w) {
        console.log("setupDOMAndWorld: Canvas not found");
        return;
      }
      console.log("setupDOMAndWorld: Canvas found", w);
      const V = document.documentElement.clientWidth, z = document.documentElement.clientHeight;
      w.width = V, w.height = z, console.log("Canvas size set to:", V, "x", z);
      const O = Math.floor(V / (Wi + 1)), U = Math.floor(z / (Wi + 1));
      f.current = new Tc(O, U), Cl(f.current, n);
    }, [
      n
    ]);
    D.useEffect(() => (v(), window.addEventListener("resize", v), d.current = y2((w) => {
      w.segmentationMask && (m.current = w.segmentationMask);
    }), () => {
      var _a2;
      window.removeEventListener("resize", v), (_a2 = d.current) == null ? void 0 : _a2.close(), x.current && clearTimeout(x.current);
    }), [
      v
    ]), D.useEffect(() => {
      const w = t.current, V = e.current, z = V == null ? void 0 : V.getContext("2d");
      if (!w || !V || !z) return;
      const O = async () => {
        var _a2;
        if (!y.current) return;
        const U = performance.now();
        U - T.current >= m2 && (T.current = U, w.readyState >= 2 && await ((_a2 = d.current) == null ? void 0 : _a2.send({
          image: w
        })), f.current && m.current && p2(f.current, m.current, "random", z, w, s)), b.current = requestAnimationFrame(O);
      };
      return y.current || (y.current = true, c(true), b.current = requestAnimationFrame(O)), () => {
        b.current && cancelAnimationFrame(b.current), y.current = false, c(false);
      };
    }, [
      s
    ]), D.useEffect(() => {
      f.current && Cl(f.current, n);
    }, [
      n
    ]);
    const g = D.useCallback(async () => {
      t.current && await d2(t.current, a5());
    }, []), S = () => {
      l((w) => !w);
    }, A = D.useCallback((w) => {
      r(w), x.current && clearTimeout(x.current), x.current = setTimeout(() => {
        i(w);
      }, 400);
    }, []);
    return D.useEffect(() => {
      g();
    }, [
      g
    ]), J.jsxs(J.Fragment, {
      children: [
        J.jsxs("div", {
          id: "controls",
          className: "font-[FunflowSurvivor]",
          children: [
            J.jsx("div", {
              className: "control-group ",
              children: J.jsx("input", {
                type: "text",
                value: a,
                onChange: (w) => A(w.target.value),
                placeholder: "ex: \uC74F \uCD94\uC6CC"
              })
            }),
            J.jsx("div", {
              className: "w-full my-12 rounded-lg overflow-hidden",
              children: J.jsx(h5, {
                canvasRef: e,
                isProcessing: o
              })
            })
          ]
        }),
        J.jsxs("div", {
          onClick: S,
          children: [
            J.jsx("video", {
              ref: t,
              id: "inputVideo",
              playsInline: true,
              muted: true
            }),
            J.jsx("canvas", {
              ref: e,
              id: "game-of-life-canvas"
            })
          ]
        })
      ]
    });
  }, m5 = () => J.jsx(bC, {
    children: J.jsxs($M, {
      children: [
        J.jsx(Tu, {
          path: "/",
          element: J.jsx(c4, {})
        }),
        J.jsx(Tu, {
          path: "/description",
          element: J.jsx(f5, {})
        }),
        J.jsx(Tu, {
          path: "/main",
          element: J.jsx(d5, {})
        })
      ]
    })
  }), g2 = document.createElement("div");
  document.body.appendChild(g2);
  const p5 = lM.createRoot(g2);
  p5.render(J.jsx(MA.StrictMode, {
    children: J.jsx(m5, {})
  }));
})();
