import $e, { createContext as me, useMemo as C, useReducer as We, useCallback as w, useContext as ve, useState as se, useEffect as de, useRef as ie } from "react";
var Ee = { exports: {} }, ee = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ae;
function Ue() {
  if (Ae)
    return ee;
  Ae = 1;
  var i = Symbol.for("react.transitional.element"), u = Symbol.for("react.fragment");
  function o(E, s, c) {
    var f = null;
    if (c !== void 0 && (f = "" + c), s.key !== void 0 && (f = "" + s.key), "key" in s) {
      c = {};
      for (var m in s)
        m !== "key" && (c[m] = s[m]);
    } else
      c = s;
    return s = c.ref, {
      $$typeof: i,
      type: E,
      key: f,
      ref: s !== void 0 ? s : null,
      props: c
    };
  }
  return ee.Fragment = u, ee.jsx = o, ee.jsxs = o, ee;
}
var te = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Me;
function He() {
  return Me || (Me = 1, process.env.NODE_ENV !== "production" && function() {
    function i(e) {
      if (e == null)
        return null;
      if (typeof e == "function")
        return e.$$typeof === oe ? null : e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case H:
          return "Fragment";
        case O:
          return "Portal";
        case z:
          return "Profiler";
        case B:
          return "StrictMode";
        case X:
          return "Suspense";
        case Z:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (typeof e.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), e.$$typeof) {
          case re:
            return (e.displayName || "Context") + ".Provider";
          case G:
            return (e._context.displayName || "Context") + ".Consumer";
          case D:
            var t = e.render;
            return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
          case Y:
            return t = e.displayName || null, t !== null ? t : i(e.type) || "Memo";
          case F:
            t = e._payload, e = e._init;
            try {
              return i(e(t));
            } catch {
            }
        }
      return null;
    }
    function u(e) {
      return "" + e;
    }
    function o(e) {
      try {
        u(e);
        var t = !1;
      } catch {
        t = !0;
      }
      if (t) {
        t = console;
        var r = t.error, l = typeof Symbol == "function" && Symbol.toStringTag && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return r.call(
          t,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          l
        ), u(e);
      }
    }
    function E() {
    }
    function s() {
      if (Q === 0) {
        xe = console.log, ke = console.info, we = console.warn, Ce = console.error, _e = console.group, ye = console.groupCollapsed, Se = console.groupEnd;
        var e = {
          configurable: !0,
          enumerable: !0,
          value: E,
          writable: !0
        };
        Object.defineProperties(console, {
          info: e,
          log: e,
          warn: e,
          error: e,
          group: e,
          groupCollapsed: e,
          groupEnd: e
        });
      }
      Q++;
    }
    function c() {
      if (Q--, Q === 0) {
        var e = { configurable: !0, enumerable: !0, writable: !0 };
        Object.defineProperties(console, {
          log: n({}, e, { value: xe }),
          info: n({}, e, { value: ke }),
          warn: n({}, e, { value: we }),
          error: n({}, e, { value: Ce }),
          group: n({}, e, { value: _e }),
          groupCollapsed: n({}, e, { value: ye }),
          groupEnd: n({}, e, { value: Se })
        });
      }
      0 > Q && console.error(
        "disabledDepth fell below zero. This is a bug in React. Please file an issue."
      );
    }
    function f(e) {
      if (le === void 0)
        try {
          throw Error();
        } catch (r) {
          var t = r.stack.trim().match(/\n( *(at )?)/);
          le = t && t[1] || "", Re = -1 < r.stack.indexOf(`
    at`) ? " (<anonymous>)" : -1 < r.stack.indexOf("@") ? "@unknown:0:0" : "";
        }
      return `
` + le + e + Re;
    }
    function m(e, t) {
      if (!e || ue)
        return "";
      var r = fe.get(e);
      if (r !== void 0)
        return r;
      ue = !0, r = Error.prepareStackTrace, Error.prepareStackTrace = void 0;
      var l = null;
      l = P.H, P.H = null, s();
      try {
        var g = {
          DetermineComponentFrameRoot: function() {
            try {
              if (t) {
                var $ = function() {
                  throw Error();
                };
                if (Object.defineProperty($.prototype, "props", {
                  set: function() {
                    throw Error();
                  }
                }), typeof Reflect == "object" && Reflect.construct) {
                  try {
                    Reflect.construct($, []);
                  } catch (N) {
                    var ce = N;
                  }
                  Reflect.construct(e, [], $);
                } else {
                  try {
                    $.call();
                  } catch (N) {
                    ce = N;
                  }
                  e.call($.prototype);
                }
              } else {
                try {
                  throw Error();
                } catch (N) {
                  ce = N;
                }
                ($ = e()) && typeof $.catch == "function" && $.catch(function() {
                });
              }
            } catch (N) {
              if (N && ce && typeof N.stack == "string")
                return [N.stack, ce.stack];
            }
            return [null, null];
          }
        };
        g.DetermineComponentFrameRoot.displayName = "DetermineComponentFrameRoot";
        var d = Object.getOwnPropertyDescriptor(
          g.DetermineComponentFrameRoot,
          "name"
        );
        d && d.configurable && Object.defineProperty(
          g.DetermineComponentFrameRoot,
          "name",
          { value: "DetermineComponentFrameRoot" }
        );
        var a = g.DetermineComponentFrameRoot(), j = a[0], J = a[1];
        if (j && J) {
          var h = j.split(`
`), L = J.split(`
`);
          for (a = d = 0; d < h.length && !h[d].includes(
            "DetermineComponentFrameRoot"
          ); )
            d++;
          for (; a < L.length && !L[a].includes(
            "DetermineComponentFrameRoot"
          ); )
            a++;
          if (d === h.length || a === L.length)
            for (d = h.length - 1, a = L.length - 1; 1 <= d && 0 <= a && h[d] !== L[a]; )
              a--;
          for (; 1 <= d && 0 <= a; d--, a--)
            if (h[d] !== L[a]) {
              if (d !== 1 || a !== 1)
                do
                  if (d--, a--, 0 > a || h[d] !== L[a]) {
                    var K = `
` + h[d].replace(
                      " at new ",
                      " at "
                    );
                    return e.displayName && K.includes("<anonymous>") && (K = K.replace("<anonymous>", e.displayName)), typeof e == "function" && fe.set(e, K), K;
                  }
                while (1 <= d && 0 <= a);
              break;
            }
        }
      } finally {
        ue = !1, P.H = l, c(), Error.prepareStackTrace = r;
      }
      return h = (h = e ? e.displayName || e.name : "") ? f(h) : "", typeof e == "function" && fe.set(e, h), h;
    }
    function p(e) {
      if (e == null)
        return "";
      if (typeof e == "function") {
        var t = e.prototype;
        return m(
          e,
          !(!t || !t.isReactComponent)
        );
      }
      if (typeof e == "string")
        return f(e);
      switch (e) {
        case X:
          return f("Suspense");
        case Z:
          return f("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case D:
            return e = m(e.render, !1), e;
          case Y:
            return p(e.type);
          case F:
            t = e._payload, e = e._init;
            try {
              return p(e(t));
            } catch {
            }
        }
      return "";
    }
    function S() {
      var e = P.A;
      return e === null ? null : e.getOwner();
    }
    function T(e) {
      if (ae.call(e, "key")) {
        var t = Object.getOwnPropertyDescriptor(e, "key").get;
        if (t && t.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function W(e, t) {
      function r() {
        Oe || (Oe = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          t
        ));
      }
      r.isReactWarning = !0, Object.defineProperty(e, "key", {
        get: r,
        configurable: !0
      });
    }
    function _() {
      var e = i(this.type);
      return Pe[e] || (Pe[e] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), e = this.props.ref, e !== void 0 ? e : null;
    }
    function y(e, t, r, l, g, d) {
      return r = d.ref, e = {
        $$typeof: U,
        type: e,
        key: t,
        props: d,
        _owner: g
      }, (r !== void 0 ? r : null) !== null ? Object.defineProperty(e, "ref", {
        enumerable: !1,
        get: _
      }) : Object.defineProperty(e, "ref", { enumerable: !1, value: null }), e._store = {}, Object.defineProperty(e._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(e, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.freeze && (Object.freeze(e.props), Object.freeze(e)), e;
    }
    function b(e, t, r, l, g, d) {
      if (typeof e == "string" || typeof e == "function" || e === H || e === z || e === B || e === X || e === Z || e === ne || typeof e == "object" && e !== null && (e.$$typeof === F || e.$$typeof === Y || e.$$typeof === re || e.$$typeof === G || e.$$typeof === D || e.$$typeof === v || e.getModuleId !== void 0)) {
        var a = t.children;
        if (a !== void 0)
          if (l)
            if (q(a)) {
              for (l = 0; l < a.length; l++)
                R(a[l], e);
              Object.freeze && Object.freeze(a);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else
            R(a, e);
      } else
        a = "", (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (a += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports."), e === null ? l = "null" : q(e) ? l = "array" : e !== void 0 && e.$$typeof === U ? (l = "<" + (i(e.type) || "Unknown") + " />", a = " Did you accidentally export a JSX literal instead of a component?") : l = typeof e, console.error(
          "React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",
          l,
          a
        );
      if (ae.call(t, "key")) {
        a = i(e);
        var j = Object.keys(t).filter(function(h) {
          return h !== "key";
        });
        l = 0 < j.length ? "{key: someKey, " + j.join(": ..., ") + ": ...}" : "{key: someKey}", je[a + l] || (j = 0 < j.length ? "{" + j.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          l,
          a,
          j,
          a
        ), je[a + l] = !0);
      }
      if (a = null, r !== void 0 && (o(r), a = "" + r), T(t) && (o(t.key), a = "" + t.key), "key" in t) {
        r = {};
        for (var J in t)
          J !== "key" && (r[J] = t[J]);
      } else
        r = t;
      return a && W(
        r,
        typeof e == "function" ? e.displayName || e.name || "Unknown" : e
      ), y(e, a, d, g, S(), r);
    }
    function R(e, t) {
      if (typeof e == "object" && e && e.$$typeof !== Ye) {
        if (q(e))
          for (var r = 0; r < e.length; r++) {
            var l = e[r];
            M(l) && x(l, t);
          }
        else if (M(e))
          e._store && (e._store.validated = 1);
        else if (e === null || typeof e != "object" ? r = null : (r = V && e[V] || e["@@iterator"], r = typeof r == "function" ? r : null), typeof r == "function" && r !== e.entries && (r = r.call(e), r !== e))
          for (; !(e = r.next()).done; )
            M(e.value) && x(e.value, t);
      }
    }
    function M(e) {
      return typeof e == "object" && e !== null && e.$$typeof === U;
    }
    function x(e, t) {
      if (e._store && !e._store.validated && e.key == null && (e._store.validated = 1, t = k(t), !Ne[t])) {
        Ne[t] = !0;
        var r = "";
        e && e._owner != null && e._owner !== S() && (r = null, typeof e._owner.tag == "number" ? r = i(e._owner.type) : typeof e._owner.name == "string" && (r = e._owner.name), r = " It was passed a child from " + r + ".");
        var l = P.getCurrentStack;
        P.getCurrentStack = function() {
          var g = p(e.type);
          return l && (g += l() || ""), g;
        }, console.error(
          'Each child in a list should have a unique "key" prop.%s%s See https://react.dev/link/warning-keys for more information.',
          t,
          r
        ), P.getCurrentStack = l;
      }
    }
    function k(e) {
      var t = "", r = S();
      return r && (r = i(r.type)) && (t = `

Check the render method of \`` + r + "`."), t || (e = i(e)) && (t = `

Check the top-level render call using <` + e + ">."), t;
    }
    var I = $e, U = Symbol.for("react.transitional.element"), O = Symbol.for("react.portal"), H = Symbol.for("react.fragment"), B = Symbol.for("react.strict_mode"), z = Symbol.for("react.profiler"), G = Symbol.for("react.consumer"), re = Symbol.for("react.context"), D = Symbol.for("react.forward_ref"), X = Symbol.for("react.suspense"), Z = Symbol.for("react.suspense_list"), Y = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), ne = Symbol.for("react.offscreen"), V = Symbol.iterator, oe = Symbol.for("react.client.reference"), P = I.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, ae = Object.prototype.hasOwnProperty, n = Object.assign, v = Symbol.for("react.client.reference"), q = Array.isArray, Q = 0, xe, ke, we, Ce, _e, ye, Se;
    E.__reactDisabledLog = !0;
    var le, Re, ue = !1, fe = new (typeof WeakMap == "function" ? WeakMap : Map)(), Ye = Symbol.for("react.client.reference"), Oe, Pe = {}, je = {}, Ne = {};
    te.Fragment = H, te.jsx = function(e, t, r, l, g) {
      return b(e, t, r, !1, l, g);
    }, te.jsxs = function(e, t, r, l, g) {
      return b(e, t, r, !0, l, g);
    };
  }()), te;
}
process.env.NODE_ENV === "production" ? Ee.exports = Ue() : Ee.exports = He();
var A = Ee.exports;
const Ge = 216, De = 36, Le = "off", ge = me(null);
ge.displayName = "PickerDataContext";
function he(i) {
  const u = ve(ge);
  if (u === null) {
    const o = new Error(`<${i} /> is missing a parent <Picker /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o, he), o;
  }
  return u;
}
const pe = me(null);
pe.displayName = "PickerActionsContext";
function be(i) {
  const u = ve(pe);
  if (u === null) {
    const o = new Error(`<${i} /> is missing a parent <Picker /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o, be), o;
  }
  return u;
}
function ze(i, u = (o) => o) {
  return i.slice().sort((o, E) => {
    const s = u(o), c = u(E);
    if (s === null || c === null)
      return 0;
    const f = s.compareDocumentPosition(c);
    return f & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : f & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
  });
}
function Fe(i, u) {
  switch (u.type) {
    case "REGISTER_OPTION": {
      const { key: o, option: E } = u;
      let s = [...i[o] || [], E];
      return s = ze(s, (c) => c.element.current), {
        ...i,
        [o]: s
      };
    }
    case "UNREGISTER_OPTION": {
      const { key: o, option: E } = u;
      return {
        ...i,
        [o]: (i[o] || []).filter((s) => s !== E)
      };
    }
    default:
      throw Error(`Unknown action: ${u.type}`);
  }
}
function Ve(i) {
  const {
    style: u,
    children: o,
    value: E,
    onChange: s,
    height: c = Ge,
    itemHeight: f = De,
    wheelMode: m = Le,
    ...p
  } = i, S = C(
    () => ({
      height: f,
      marginTop: -(f / 2),
      position: "absolute",
      top: "50%",
      left: 0,
      width: "100%",
      pointerEvents: "none"
    }),
    [f]
  ), T = C(
    () => ({
      height: `${c}px`,
      position: "relative",
      display: "flex",
      justifyContent: "center",
      overflow: "hidden",
      maskImage: "linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)",
      WebkitMaskImage: "linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent)"
    }),
    [c]
  ), [W, _] = We(Fe, {}), y = C(
    () => ({ height: c, itemHeight: f, wheelMode: m, value: E, optionGroups: W }),
    [c, f, E, W, m]
  ), b = w((x, k) => {
    if (E[x] === k)
      return !1;
    const I = { ...E, [x]: k };
    return s(I, x), !0;
  }, [s, E]), R = w((x, k) => (_({ type: "REGISTER_OPTION", key: x, option: k }), () => _({ type: "UNREGISTER_OPTION", key: x, option: k })), []), M = C(
    () => ({ registerOption: R, change: b }),
    [R, b]
  );
  return /* @__PURE__ */ A.jsxs(
    "div",
    {
      style: {
        ...T,
        ...u
      },
      ...p,
      children: [
        /* @__PURE__ */ A.jsx(pe.Provider, { value: M, children: /* @__PURE__ */ A.jsx(ge.Provider, { value: y, children: o }) }),
        /* @__PURE__ */ A.jsxs(
          "div",
          {
            style: S,
            children: [
              /* @__PURE__ */ A.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: 0,
                    bottom: "auto",
                    left: 0,
                    right: "auto",
                    width: "100%",
                    height: "1px",
                    background: "#d9d9d9",
                    transform: "scaleY(0.5)"
                  }
                }
              ),
              /* @__PURE__ */ A.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "auto",
                    bottom: 0,
                    left: 0,
                    right: "auto",
                    width: "100%",
                    height: "1px",
                    background: "#d9d9d9",
                    transform: "scaleY(0.5)"
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const Te = me(null);
Te.displayName = "PickerColumnDataContext";
function Ie(i) {
  const u = ve(Te);
  if (u === null) {
    const o = new Error(`<${i} /> is missing a parent <Picker.Column /> component.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o, Ie), o;
  }
  return u;
}
function qe({
  style: i,
  children: u,
  name: o,
  ...E
}) {
  const { height: s, itemHeight: c, wheelMode: f, value: m, optionGroups: p } = he("Picker.Column"), S = C(
    () => m[o],
    [m, o]
  ), T = C(
    () => p[o] || [],
    [o, p]
  ), W = C(
    () => {
      let n = T.findIndex((v) => v.value === S);
      return n < 0 && (n = 0), n;
    },
    [T, S]
  ), _ = C(
    () => s / 2 - c * T.length + c / 2,
    [s, c, T]
  ), y = C(
    () => s / 2 - c / 2,
    [s, c]
  ), [b, R] = se(0);
  de(() => {
    R(s / 2 - c / 2 - W * c);
  }, [s, c, W]);
  const M = be("Picker.Column"), x = ie(b);
  x.current = b;
  const k = w(() => {
    let n = 0;
    const v = x.current;
    v >= y ? n = 0 : v <= _ ? n = T.length - 1 : n = -Math.round((v - y) / c), M.change(o, T[n].value) || R(s / 2 - c / 2 - n * c);
  }, [M, s, c, o, y, _, T]), [I, U] = se(0), [O, H] = se(!1), [B, z] = se(0), G = w((n) => {
    n < _ ? n = _ - Math.pow(_ - n, 0.8) : n > y && (n = y + Math.pow(n - y, 0.8)), R(n);
  }, [y, _]), re = w((n) => {
    z(n.targetTouches[0].pageY), U(b);
  }, [b]), D = w((n) => {
    n.cancelable && n.preventDefault(), O || H(!0);
    const v = I + n.targetTouches[0].pageY - B;
    G(v);
  }, [O, I, B, G]), X = w(() => {
    O && (H(!1), z(0), U(0), k());
  }, [k, O]), Z = w(() => {
    O && (H(!1), z(0), R(I), U(0));
  }, [O, I]), Y = ie(null), F = w((n) => {
    if (n.deltaY === 0)
      return;
    let v = n.deltaY * 0.1;
    Math.abs(v) < c && (v = c * Math.sign(v)), f === "normal" && (v = -v);
    const q = b + v;
    G(q);
  }, [c, b, G, f]), ne = w(() => {
    k();
  }, [k]), V = w((n) => {
    f !== "off" && (n.cancelable && n.preventDefault(), F(n), Y.current && clearTimeout(Y.current), Y.current = setTimeout(() => {
      ne();
    }, 200));
  }, [ne, F, Y, f]), oe = ie(null);
  de(() => {
    const n = oe.current;
    return n && (n.addEventListener("touchmove", D, { passive: !1 }), n.addEventListener("wheel", V, { passive: !1 })), () => {
      n && (n.removeEventListener("touchmove", D), n.removeEventListener("wheel", V));
    };
  }, [D, V]);
  const P = C(
    () => ({
      flex: "1 1 0%",
      maxHeight: "100%",
      transitionProperty: "transform",
      transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
      transitionDuration: O ? "0ms" : "300ms",
      transform: `translate3d(0, ${b}px, 0)`
    }),
    [b, O]
  ), ae = C(
    () => ({ key: o }),
    [o]
  );
  return /* @__PURE__ */ A.jsx(
    "div",
    {
      style: {
        ...P,
        ...i
      },
      ref: oe,
      onTouchStart: re,
      onTouchEnd: X,
      onTouchCancel: Z,
      ...E,
      children: /* @__PURE__ */ A.jsx(Te.Provider, { value: ae, children: u })
    }
  );
}
function Je(i) {
  return typeof i == "function";
}
function Be({
  style: i,
  children: u,
  value: o,
  ...E
}) {
  const s = ie(null), { itemHeight: c, value: f } = he("Picker.Item"), m = be("Picker.Item"), { key: p } = Ie("Picker.Item");
  de(
    () => m.registerOption(p, { value: o, element: s }),
    [p, m, o]
  );
  const S = C(
    () => ({
      height: `${c}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }),
    [c]
  ), T = w(() => {
    m.change(p, o);
  }, [m, p, o]);
  return /* @__PURE__ */ A.jsx(
    "div",
    {
      style: {
        ...S,
        ...i
      },
      ref: s,
      onClick: T,
      ...E,
      children: Je(u) ? u({ selected: f[p] === o }) : u
    }
  );
}
const Ze = Object.assign(Ve, {
  Column: qe,
  Item: Be
});
export {
  Ze as default
};
