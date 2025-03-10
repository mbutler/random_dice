// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = import.meta.require;

// node_modules/dice-roller-parser/dist/index.js
var require_dist = __commonJS((exports, module) => {
  (function(e, r) {
    if (typeof exports == "object" && typeof module == "object")
      module.exports = r();
    else if (typeof define == "function" && define.amd)
      define([], r);
    else {
      var t = r();
      for (var o in t)
        (typeof exports == "object" ? exports : e)[o] = t[o];
    }
  })(exports, function() {
    return function(e) {
      var r = {};
      function t(o) {
        if (r[o])
          return r[o].exports;
        var n = r[o] = { i: o, l: false, exports: {} };
        return e[o].call(n.exports, n, n.exports, t), n.l = true, n.exports;
      }
      return t.m = e, t.c = r, t.d = function(e2, r2, o) {
        t.o(e2, r2) || Object.defineProperty(e2, r2, { enumerable: true, get: o });
      }, t.r = function(e2) {
        typeof Symbol != "undefined" && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, t.t = function(e2, r2) {
        if (1 & r2 && (e2 = t(e2)), 8 & r2)
          return e2;
        if (4 & r2 && typeof e2 == "object" && e2 && e2.__esModule)
          return e2;
        var o = Object.create(null);
        if (t.r(o), Object.defineProperty(o, "default", { enumerable: true, value: e2 }), 2 & r2 && typeof e2 != "string")
          for (var n in e2)
            t.d(o, n, function(r3) {
              return e2[r3];
            }.bind(null, n));
        return o;
      }, t.n = function(e2) {
        var r2 = e2 && e2.__esModule ? function() {
          return e2.default;
        } : function() {
          return e2;
        };
        return t.d(r2, "a", r2), r2;
      }, t.o = function(e2, r2) {
        return Object.prototype.hasOwnProperty.call(e2, r2);
      }, t.p = "", t(t.s = 0);
    }([function(e, r, t) {
      function o(e2) {
        for (var t2 in e2)
          r.hasOwnProperty(t2) || (r[t2] = e2[t2]);
      }
      Object.defineProperty(r, "__esModule", { value: true }), o(t(1)), o(t(3));
    }, function(e, r, t) {
      Object.defineProperty(r, "__esModule", { value: true });
      const o = t(2);
      r.DiceRoller = class {
        constructor(e2, r2 = 1000) {
          this.randFunction = Math.random, this.maxRollCount = 1000, e2 && (this.randFunction = e2), this.maxRollCount = r2;
        }
        parse(e2) {
          return o.parse(e2);
        }
        roll(e2) {
          const r2 = o.parse(e2);
          return this.rollType(r2);
        }
        rollValue(e2) {
          return this.roll(e2).value;
        }
        rollParsed(e2) {
          return this.rollType(e2);
        }
        rollType(e2) {
          let r2;
          switch (e2.type) {
            case "diceExpression":
              r2 = this.rollDiceExpr(e2);
              break;
            case "group":
              r2 = this.rollGroup(e2);
              break;
            case "die":
              r2 = this.rollDie(e2);
              break;
            case "expression":
              r2 = this.rollExpression(e2);
              break;
            case "mathfunction":
              r2 = this.rollFunction(e2);
              break;
            case "inline":
              r2 = this.rollType(e2.expr);
              break;
            case "number":
              r2 = Object.assign(Object.assign({}, e2), { success: false, valid: true, order: 0 });
              break;
            default:
              throw new Error(`Unable to render ${e2.type}`);
          }
          return e2.label && (r2.label = e2.label), r2;
        }
        rollDiceExpr(e2) {
          const r2 = this.rollType(e2.head), t2 = [r2], o2 = [], n = e2.ops.reduce((e3, r3, n2) => {
            const l = this.rollType(r3.tail);
            switch (l.order = n2, t2.push(l), o2.push(r3.op), r3.op) {
              case "+":
                return e3 + l.value;
              case "-":
                return e3 - l.value;
              default:
                return e3;
            }
          }, r2.value);
          return { dice: t2, ops: o2, success: false, type: "diceexpressionroll", valid: true, value: n, order: 0 };
        }
        rollGroup(e2) {
          let r2 = e2.rolls.map((e3, r3) => Object.assign(Object.assign({}, this.rollType(e3)), { order: r3 }));
          if (e2.mods) {
            const t2 = e2.mods, o2 = (e3) => {
              const r3 = t2.some((e4) => ["failure", "success"].includes(e4.type));
              return e3 = t2.reduce((e4, r4) => this.applyGroupMod(e4, r4), e3), r3 && (e3 = e3.map((e4) => (e4.success || (e4.value = 0, e4.success = true), e4))), e3;
            };
            if (r2.length === 1 && ["die", "diceexpressionroll"].includes(r2[0].type)) {
              const e3 = r2[0];
              let t3 = e3.type === "die" ? e3.rolls : e3.dice.filter((e4) => e4.type !== "number").reduce((e4, r3) => [...e4, ...r3.type === "die" ? r3.rolls : r3.dice], []);
              t3 = o2(t3), e3.value = t3.reduce((e4, r3) => r3.valid ? e4 + r3.value : e4, 0);
            } else
              r2 = o2(r2);
          }
          return { dice: r2, success: false, type: "grouproll", valid: true, value: r2.reduce((e3, r3) => r3.valid ? e3 + r3.value : e3, 0), order: 0 };
        }
        rollDie(e2) {
          const r2 = this.rollType(e2.count);
          if (r2.value > this.maxRollCount)
            throw new Error("Entered number of dice too large.");
          let t2, o2;
          e2.die.type === "fate" ? (o2 = { type: "fate", success: false, valid: false, value: 0, order: 0 }, t2 = Array.from({ length: r2.value }, (e3, r3) => this.generateFateRoll(r3))) : (o2 = this.rollType(e2.die), t2 = Array.from({ length: r2.value }, (e3, r3) => this.generateDiceRoll(o2.value, r3))), e2.mods && (t2 = e2.mods.reduce((e3, r3) => this.applyMod(e3, r3), t2)), e2.targets && (t2 = e2.targets.reduce((e3, r3) => this.applyMod(e3, r3), t2).map((e3) => (e3.success || (e3.value = 0, e3.success = true), e3)));
          let n = false, l = 0;
          if (e2.match) {
            const r3 = e2.match, o3 = t2.reduce((e3, r4) => e3.set(r4.roll, (e3.get(r4.roll) || 0) + 1), new Map), s = new Set(Array.from(o3.entries()).filter(([e3, t3]) => t3 >= r3.min.value).filter(([e3]) => !(r3.mod && r3.expr) || this.successTest(r3.mod, this.rollType(r3.expr).value, e3)).map(([e3]) => e3));
            t2.filter((e3) => s.has(e3.roll)).forEach((e3) => e3.matched = true), r3.count && (n = true, l = s.size);
          }
          return e2.sort && (t2 = this.applySort(t2, e2.sort)), { count: r2, die: o2, rolls: t2, success: false, type: "die", valid: true, value: n ? l : t2.reduce((e3, r3) => r3.valid ? e3 + r3.value : e3, 0), order: 0, matched: n };
        }
        rollExpression(e2) {
          const r2 = this.rollType(e2.head), t2 = [r2], o2 = [], n = e2.ops.reduce((e3, r3) => {
            const n2 = this.rollType(r3.tail);
            switch (t2.push(n2), o2.push(r3.op), r3.op) {
              case "+":
                return e3 + n2.value;
              case "-":
                return e3 - n2.value;
              case "*":
                return e3 * n2.value;
              case "/":
                return e3 / n2.value;
              case "%":
                return e3 % n2.value;
              case "**":
                return e3 ** n2.value;
              default:
                return e3;
            }
          }, r2.value);
          return { dice: t2, ops: o2, success: false, type: "expressionroll", valid: true, value: n, order: 0 };
        }
        rollFunction(e2) {
          const r2 = this.rollType(e2.expr);
          let t2;
          switch (e2.op) {
            case "floor":
              t2 = Math.floor(r2.value);
              break;
            case "ceil":
              t2 = Math.ceil(r2.value);
              break;
            case "round":
              t2 = Math.round(r2.value);
              break;
            case "abs":
              t2 = Math.abs(r2.value);
              break;
            default:
              t2 = r2.value;
          }
          return { expr: r2, op: e2.op, success: false, type: "mathfunction", valid: true, value: t2, order: 0 };
        }
        applyGroupMod(e2, r2) {
          return this.getGroupModMethod(r2)(e2);
        }
        getGroupModMethod(e2) {
          const r2 = (e3) => e3.value;
          switch (e2.type) {
            case "success":
              return this.getSuccessMethod(e2, r2);
            case "failure":
              return this.getFailureMethod(e2, r2);
            case "keep":
              return this.getKeepMethod(e2, r2);
            case "drop":
              return this.getDropMethod(e2, r2);
            default:
              throw new Error(`Mod ${e2.type} is not recognised`);
          }
        }
        applyMod(e2, r2) {
          return this.getModMethod(r2)(e2);
        }
        getModMethod(e2) {
          const r2 = (e3) => e3.roll;
          switch (e2.type) {
            case "success":
              return this.getSuccessMethod(e2, r2);
            case "failure":
              return this.getFailureMethod(e2, r2);
            case "crit":
              return this.getCritSuccessMethod(e2, r2);
            case "critfail":
              return this.getCritFailureMethod(e2, r2);
            case "keep":
              return (t2) => this.getKeepMethod(e2, r2)(t2).sort((e3, r3) => e3.order - r3.order);
            case "drop":
              return (t2) => this.getDropMethod(e2, r2)(t2).sort((e3, r3) => e3.order - r3.order);
            case "explode":
              return this.getExplodeMethod(e2);
            case "compound":
              return this.getCompoundMethod(e2);
            case "penetrate":
              return this.getPenetrateMethod(e2);
            case "reroll":
              return this.getReRollMethod(e2);
            case "rerollOnce":
              return this.getReRollOnceMethod(e2);
            default:
              throw new Error(`Mod ${e2.type} is not recognised`);
          }
        }
        applySort(e2, r2) {
          return e2.sort((e3, t2) => r2.asc ? e3.roll - t2.roll : t2.roll - e3.roll), e2.forEach((e3, r3) => e3.order = r3), e2;
        }
        getCritSuccessMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => o2.map((o3) => {
            if (!o3.valid)
              return o3;
            if (o3.type !== "roll")
              return o3;
            if (o3.success)
              return o3;
            const n = o3;
            return this.successTest(e2.mod, t2.value, r2(o3)) ? n.critical = "success" : n.critical === "success" && (n.critical = null), o3;
          });
        }
        getCritFailureMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => o2.map((o3) => {
            if (!o3.valid)
              return o3;
            if (o3.type !== "roll")
              return o3;
            if (o3.success)
              return o3;
            const n = o3;
            return this.successTest(e2.mod, t2.value, r2(o3)) ? n.critical = "failure" : n.critical === "failure" && (n.critical = null), o3;
          });
        }
        getSuccessMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => o2.map((o3) => o3.valid ? (this.successTest(e2.mod, t2.value, r2(o3)) && (o3.success ? o3.value += 1 : (o3.value = 1, o3.success = true)), o3) : o3);
        }
        getFailureMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => o2.map((o3) => o3.valid ? (this.successTest(e2.mod, t2.value, r2(o3)) && (o3.success ? o3.value -= 1 : (o3.value = -1, o3.success = true)), o3) : o3);
        }
        getKeepMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => {
            if (o2.length === 0)
              return o2;
            o2 = o2.sort((t3, o3) => e2.highlow === "l" ? r2(o3) - r2(t3) : r2(t3) - r2(o3)).sort((e3, r3) => (e3.valid ? 1 : 0) - (r3.valid ? 1 : 0));
            const n = Math.max(Math.min(t2.value, o2.length), 0);
            let l = 0, s = 0;
            const u = o2.reduce((e3, r3) => (r3.valid ? 1 : 0) + e3, 0) - n;
            for (;s < o2.length && l < u; )
              o2[s].valid && (o2[s].valid = false, l++), s++;
            return o2;
          };
        }
        getDropMethod(e2, r2) {
          const t2 = this.rollType(e2.expr);
          return (o2) => {
            o2 = o2.sort((t3, o3) => e2.highlow === "h" ? r2(o3) - r2(t3) : r2(t3) - r2(o3));
            const n = Math.max(Math.min(t2.value, o2.length), 0);
            let l = 0, s = 0;
            for (;s < o2.length && l < n; )
              o2[s].valid && (o2[s].valid = false, l++), s++;
            return o2;
          };
        }
        getExplodeMethod(e2) {
          const r2 = e2.target ? this.rollType(e2.target.value) : null;
          return (t2) => {
            const o2 = r2 ? (t3) => this.successTest(e2.target.mod, r2.value, t3.roll) : (e3) => this.successTest("=", e3.type === "fateroll" ? 1 : e3.die, e3.roll);
            if (t2[0].type === "roll" && o2({ roll: 1 }) && o2({ roll: t2[0].die }))
              throw new Error("Invalid reroll target");
            for (let e3 = 0;e3 < t2.length; e3++) {
              let r3 = t2[e3];
              r3.order = e3;
              let n = 0;
              for (;o2(r3) && n++ < 1000; ) {
                const o3 = this.reRoll(r3, ++e3);
                t2.splice(e3, 0, o3), r3 = o3;
              }
            }
            return t2;
          };
        }
        getCompoundMethod(e2) {
          const r2 = e2.target ? this.rollType(e2.target.value) : null;
          return (t2) => {
            const o2 = r2 ? (t3) => this.successTest(e2.target.mod, r2.value, t3.roll) : (e3) => this.successTest("=", e3.type === "fateroll" ? 1 : e3.die, e3.roll);
            if (t2[0].type === "roll" && o2({ roll: 1 }) && o2({ roll: t2[0].die }))
              throw new Error("Invalid reroll target");
            for (let e3 = 0;e3 < t2.length; e3++) {
              let r3 = t2[e3], n = r3.roll, l = 0;
              for (;o2(r3) && l++ < 1000; ) {
                const o3 = this.reRoll(t2[e3], ++e3);
                n += o3.roll, r3 = o3;
              }
              r3.value = n, r3.roll = n;
            }
            return t2;
          };
        }
        getPenetrateMethod(e2) {
          const r2 = e2.target ? this.rollType(e2.target.value) : null;
          return (t2) => {
            const o2 = r2 ? (t3) => this.successTest(e2.target.mod, r2.value, t3.roll) : (e3) => this.successTest("=", e3.type === "fateroll" ? 1 : e3.die, e3.roll);
            if (r2 && t2[0].type === "roll" && o2(t2[0]) && this.successTest(e2.target.mod, r2.value, 1))
              throw new Error("Invalid reroll target");
            for (let e3 = 0;e3 < t2.length; e3++) {
              let r3 = t2[e3];
              r3.order = e3;
              let n = 0;
              for (;o2(r3) && n++ < 1000; ) {
                const o3 = this.reRoll(r3, ++e3);
                o3.value -= 1, o3.roll -= 1, t2.splice(e3, 0, o3), r3 = o3;
              }
            }
            return t2;
          };
        }
        getReRollMethod(e2) {
          const r2 = e2.target ? this.successTest.bind(null, e2.target.mod, this.rollType(e2.target.value).value) : this.successTest.bind(null, "=", 1);
          return (e3) => {
            if (e3[0].type === "roll" && r2(1) && r2(e3[0].die))
              throw new Error("Invalid reroll target");
            for (let t2 = 0;t2 < e3.length; t2++)
              for (;r2(e3[t2].roll); ) {
                e3[t2].valid = false;
                const r3 = this.reRoll(e3[t2], t2 + 1);
                e3.splice(++t2, 0, r3);
              }
            return e3;
          };
        }
        getReRollOnceMethod(e2) {
          const r2 = e2.target ? this.successTest.bind(null, e2.target.mod, this.rollType(e2.target.value).value) : this.successTest.bind(null, "=", 1);
          return (e3) => {
            if (e3[0].type === "roll" && r2(1) && r2(e3[0].die))
              throw new Error("Invalid reroll target");
            for (let t2 = 0;t2 < e3.length; t2++)
              if (r2(e3[t2].roll)) {
                e3[t2].valid = false;
                const r3 = this.reRoll(e3[t2], t2 + 1);
                e3.splice(++t2, 0, r3);
              }
            return e3;
          };
        }
        successTest(e2, r2, t2) {
          switch (e2) {
            case ">":
              return t2 >= r2;
            case "<":
              return t2 <= r2;
            case "=":
            default:
              return t2 == r2;
          }
        }
        reRoll(e2, r2) {
          switch (e2.type) {
            case "roll":
              return this.generateDiceRoll(e2.die, r2);
            case "fateroll":
              return this.generateFateRoll(r2);
            default:
              throw new Error(`Cannot do a reroll of a ${e2.type}.`);
          }
        }
        generateDiceRoll(e2, r2) {
          const t2 = Math.floor(this.randFunction() * e2) + 1;
          return { critical: t2 === e2 ? "success" : t2 === 1 ? "failure" : null, die: e2, matched: false, order: r2, roll: t2, success: false, type: "roll", valid: true, value: t2 };
        }
        generateFateRoll(e2) {
          const r2 = Math.floor(3 * this.randFunction()) - 1;
          return { matched: false, order: e2, roll: r2, success: false, type: "fateroll", valid: true, value: r2 };
        }
      };
    }, function(e, r, t) {
      function o(e2, r2, t2, n) {
        this.message = e2, this.expected = r2, this.found = t2, this.location = n, this.name = "SyntaxError", typeof Error.captureStackTrace == "function" && Error.captureStackTrace(this, o);
      }
      (function(e2, r2) {
        function t2() {
          this.constructor = e2;
        }
        t2.prototype = r2.prototype, e2.prototype = new t2;
      })(o, Error), o.buildMessage = function(e2, r2) {
        var t2 = { literal: function(e3) {
          return '"' + n(e3.text) + '"';
        }, class: function(e3) {
          var r3, t3 = "";
          for (r3 = 0;r3 < e3.parts.length; r3++)
            t3 += e3.parts[r3] instanceof Array ? l(e3.parts[r3][0]) + "-" + l(e3.parts[r3][1]) : l(e3.parts[r3]);
          return "[" + (e3.inverted ? "^" : "") + t3 + "]";
        }, any: function(e3) {
          return "any character";
        }, end: function(e3) {
          return "end of input";
        }, other: function(e3) {
          return e3.description;
        } };
        function o2(e3) {
          return e3.charCodeAt(0).toString(16).toUpperCase();
        }
        function n(e3) {
          return e3.replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(e4) {
            return "\\x0" + o2(e4);
          }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(e4) {
            return "\\x" + o2(e4);
          });
        }
        function l(e3) {
          return e3.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(e4) {
            return "\\x0" + o2(e4);
          }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(e4) {
            return "\\x" + o2(e4);
          });
        }
        return "Expected " + function(e3) {
          var r3, o3, n2, l2 = new Array(e3.length);
          for (r3 = 0;r3 < e3.length; r3++)
            l2[r3] = (n2 = e3[r3], t2[n2.type](n2));
          if (l2.sort(), l2.length > 0) {
            for (r3 = 1, o3 = 1;r3 < l2.length; r3++)
              l2[r3 - 1] !== l2[r3] && (l2[o3] = l2[r3], o3++);
            l2.length = o3;
          }
          switch (l2.length) {
            case 1:
              return l2[0];
            case 2:
              return l2[0] + " or " + l2[1];
            default:
              return l2.slice(0, -1).join(", ") + ", or " + l2[l2.length - 1];
          }
        }(e2) + " but " + function(e3) {
          return e3 ? '"' + n(e3) + '"' : "end of input";
        }(r2) + " found.";
      }, e.exports = { SyntaxError: o, parse: function(e2, r2) {
        r2 = r2 !== undefined ? r2 : {};
        var t2, n = {}, l = { start: ye }, s = ye, u = { type: "any" }, a = ie("[[", false), c = ie("]]", false), i = function(e3, r3) {
          return r3 && (e3.label = r3), e3;
        }, d = ie(">", false), h = ie("<", false), p = ie("=", false), f = ie("f", false), v = ie("cs", false), g = ie("cf", false), y = ie("m", false), m = ie("t", false), b = ie("k", false), x = ie("l", false), A = ie("h", false), C = ie("d", false), M = ie("{", false), w = ie(",", false), R = ie("}", false), T = ie("+", false), $ = ie("sa", false), E = ie("sd", false), F = ie("!", false), k = ie("!!", false), j = ie("!p", false), _ = ie("r", false), O = ie("ro", false), S = ie("F", false), D = ie("%", false), P = ie("(", false), G = ie(")", false), I = ie("-", false), B = function(e3, r3) {
          if (r3.length == 0)
            return e3;
          return { head: e3, type: "expression", ops: r3.map((e4) => ({ type: "math", op: e4[1], tail: e4[3] })) };
        }, W = ie("*", false), K = ie("/", false), U = ie("**", false), z = ie("floor", false), V = ie("ceil", false), q = ie("round", false), H = ie("abs", false), J = he("integer"), L = /^[0-9]/, N = de([["0", "9"]], false, false), Q = function() {
          return { type: "number", value: parseInt(e2.substring(le, ne), 10) };
        }, X = ie("[", false), Y = /^[^\]]/, Z = de(["]"], true, false), ee = ie("]", false), re = he("whitespace"), te = /^[ \t\n\r]/, oe = de([" ", "\t", `
`, "\r"], false, false), ne = 0, le = 0, se = [{ line: 1, column: 1 }], ue = 0, ae = [], ce = 0;
        if ("startRule" in r2) {
          if (!(r2.startRule in l))
            throw new Error(`Can't start parsing from rule "` + r2.startRule + '".');
          s = l[r2.startRule];
        }
        function ie(e3, r3) {
          return { type: "literal", text: e3, ignoreCase: r3 };
        }
        function de(e3, r3, t3) {
          return { type: "class", parts: e3, inverted: r3, ignoreCase: t3 };
        }
        function he(e3) {
          return { type: "other", description: e3 };
        }
        function pe(r3) {
          var t3, o2 = se[r3];
          if (o2)
            return o2;
          for (t3 = r3 - 1;!se[t3]; )
            t3--;
          for (o2 = { line: (o2 = se[t3]).line, column: o2.column };t3 < r3; )
            e2.charCodeAt(t3) === 10 ? (o2.line++, o2.column = 1) : o2.column++, t3++;
          return se[r3] = o2, o2;
        }
        function fe(e3, r3) {
          var t3 = pe(e3), o2 = pe(r3);
          return { start: { offset: e3, line: t3.line, column: t3.column }, end: { offset: r3, line: o2.line, column: o2.column } };
        }
        function ve(e3) {
          ne < ue || (ne > ue && (ue = ne, ae = []), ae.push(e3));
        }
        function ge(e3, r3, t3) {
          return new o(o.buildMessage(e3, r3), e3, r3, t3);
        }
        function ye() {
          var r3, t3, o2, l2, s2, a2;
          if (r3 = ne, (t3 = Pe()) !== n) {
            for (o2 = [], e2.length > ne ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(u));l2 !== n; )
              o2.push(l2), e2.length > ne ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(u));
            o2 !== n ? (le = r3, a2 = o2, (s2 = t3).root = true, a2 && (s2.label = a2.join("")), r3 = t3 = s2) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function me() {
          var r3, t3, o2;
          return r3 = ne, (t3 = function() {
            var r4, t4, o3, l2, s2;
            if (r4 = ne, (t4 = function() {
              var r5, t5, o4, l3, s3, u3, a3, c3, i2;
              r5 = ne, e2.charCodeAt(ne) === 123 ? (t5 = "{", ne++) : (t5 = n, ce === 0 && ve(M));
              if (t5 !== n)
                if (qe() !== n)
                  if ((o4 = Te()) !== n) {
                    for (l3 = [], s3 = ne, (u3 = qe()) !== n ? (e2.charCodeAt(ne) === 44 ? (a3 = ",", ne++) : (a3 = n, ce === 0 && ve(w)), a3 !== n && (c3 = qe()) !== n && (i2 = Te()) !== n ? s3 = u3 = [u3, a3, c3, i2] : (ne = s3, s3 = n)) : (ne = s3, s3 = n);s3 !== n; )
                      l3.push(s3), s3 = ne, (u3 = qe()) !== n ? (e2.charCodeAt(ne) === 44 ? (a3 = ",", ne++) : (a3 = n, ce === 0 && ve(w)), a3 !== n && (c3 = qe()) !== n && (i2 = Te()) !== n ? s3 = u3 = [u3, a3, c3, i2] : (ne = s3, s3 = n)) : (ne = s3, s3 = n);
                    l3 !== n && (s3 = qe()) !== n ? (e2.charCodeAt(ne) === 125 ? (u3 = "}", ne++) : (u3 = n, ce === 0 && ve(R)), u3 !== n ? (le = r5, t5 = { rolls: [o4, ...l3.map((e3) => e3[3])], type: "group" }, r5 = t5) : (ne = r5, r5 = n)) : (ne = r5, r5 = n);
                  } else
                    ne = r5, r5 = n;
                else
                  ne = r5, r5 = n;
              else
                ne = r5, r5 = n;
              return r5;
            }()) !== n) {
              for (o3 = [], (l2 = we()) === n && (l2 = Re()) === n && (l2 = be()) === n && (l2 = xe());l2 !== n; )
                o3.push(l2), (l2 = we()) === n && (l2 = Re()) === n && (l2 = be()) === n && (l2 = xe());
              o3 !== n && (l2 = qe()) !== n ? ((s2 = Ve()) === n && (s2 = null), s2 !== n ? (le = r4, u2 = t4, c2 = s2, (a2 = o3).length > 0 && (u2.mods = (u2.mods || []).concat(a2)), c2 && (u2.label = c2), r4 = t4 = u2) : (ne = r4, r4 = n)) : (ne = r4, r4 = n);
            } else
              ne = r4, r4 = n;
            var u2, a2, c2;
            return r4;
          }()) === n && (t3 = Ee()) === n && (t3 = ze()), t3 !== n && qe() !== n ? ((o2 = Ve()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = i(t3, o2)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function be() {
          var r3, t3, o2;
          return r3 = ne, e2.charCodeAt(ne) === 62 ? (t3 = ">", ne++) : (t3 = n, ce === 0 && ve(d)), t3 === n && (e2.charCodeAt(ne) === 60 ? (t3 = "<", ne++) : (t3 = n, ce === 0 && ve(h)), t3 === n && (e2.charCodeAt(ne) === 61 ? (t3 = "=", ne++) : (t3 = n, ce === 0 && ve(p)))), t3 !== n && (o2 = De()) !== n ? (le = r3, r3 = t3 = { type: "success", mod: t3, expr: o2 }) : (ne = r3, r3 = n), r3;
        }
        function xe() {
          var r3, t3, o2, l2;
          return r3 = ne, e2.charCodeAt(ne) === 102 ? (t3 = "f", ne++) : (t3 = n, ce === 0 && ve(f)), t3 !== n ? (e2.charCodeAt(ne) === 62 ? (o2 = ">", ne++) : (o2 = n, ce === 0 && ve(d)), o2 === n && (e2.charCodeAt(ne) === 60 ? (o2 = "<", ne++) : (o2 = n, ce === 0 && ve(h)), o2 === n && (e2.charCodeAt(ne) === 61 ? (o2 = "=", ne++) : (o2 = n, ce === 0 && ve(p)))), o2 === n && (o2 = null), o2 !== n && (l2 = De()) !== n ? (le = r3, r3 = t3 = { type: "failure", mod: o2, expr: l2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Ae() {
          var r3, t3, o2, l2;
          return r3 = ne, e2.substr(ne, 2) === "cs" ? (t3 = "cs", ne += 2) : (t3 = n, ce === 0 && ve(v)), t3 !== n ? (e2.charCodeAt(ne) === 62 ? (o2 = ">", ne++) : (o2 = n, ce === 0 && ve(d)), o2 === n && (e2.charCodeAt(ne) === 60 ? (o2 = "<", ne++) : (o2 = n, ce === 0 && ve(h)), o2 === n && (e2.charCodeAt(ne) === 61 ? (o2 = "=", ne++) : (o2 = n, ce === 0 && ve(p)))), o2 === n && (o2 = null), o2 !== n && (l2 = De()) !== n ? (le = r3, r3 = t3 = { type: "crit", mod: o2, expr: l2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Ce() {
          var r3, t3, o2, l2;
          return r3 = ne, e2.substr(ne, 2) === "cf" ? (t3 = "cf", ne += 2) : (t3 = n, ce === 0 && ve(g)), t3 !== n ? (e2.charCodeAt(ne) === 62 ? (o2 = ">", ne++) : (o2 = n, ce === 0 && ve(d)), o2 === n && (e2.charCodeAt(ne) === 60 ? (o2 = "<", ne++) : (o2 = n, ce === 0 && ve(h)), o2 === n && (e2.charCodeAt(ne) === 61 ? (o2 = "=", ne++) : (o2 = n, ce === 0 && ve(p)))), o2 === n && (o2 = null), o2 !== n && (l2 = De()) !== n ? (le = r3, r3 = t3 = { type: "critfail", mod: o2, expr: l2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Me() {
          var r3, t3, o2, l2, s2;
          return r3 = ne, e2.charCodeAt(ne) === 109 ? (t3 = "m", ne++) : (t3 = n, ce === 0 && ve(y)), t3 !== n ? (e2.charCodeAt(ne) === 116 ? (o2 = "t", ne++) : (o2 = n, ce === 0 && ve(m)), o2 === n && (o2 = null), o2 !== n ? ((l2 = ze()) === n && (l2 = null), l2 !== n ? ((s2 = function() {
            var r4, t4, o3;
            return r4 = ne, e2.charCodeAt(ne) === 62 ? (t4 = ">", ne++) : (t4 = n, ce === 0 && ve(d)), t4 === n && (e2.charCodeAt(ne) === 60 ? (t4 = "<", ne++) : (t4 = n, ce === 0 && ve(h)), t4 === n && (e2.charCodeAt(ne) === 61 ? (t4 = "=", ne++) : (t4 = n, ce === 0 && ve(p)))), t4 !== n && (o3 = De()) !== n ? (le = r4, r4 = t4 = { mod: t4, expr: o3 }) : (ne = r4, r4 = n), r4;
          }()) === n && (s2 = null), s2 !== n ? (le = r3, r3 = t3 = function(e3, r4, t4) {
            const o3 = { type: "match", min: r4 || { type: "number", value: 2 }, count: !!e3 };
            return t4 && (o3.mod = t4.mod, o3.expr = t4.expr), o3;
          }(o2, l2, s2)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function we() {
          var r3, t3, o2, l2;
          return r3 = ne, e2.charCodeAt(ne) === 107 ? (t3 = "k", ne++) : (t3 = n, ce === 0 && ve(b)), t3 !== n ? (e2.charCodeAt(ne) === 108 ? (o2 = "l", ne++) : (o2 = n, ce === 0 && ve(x)), o2 === n && (e2.charCodeAt(ne) === 104 ? (o2 = "h", ne++) : (o2 = n, ce === 0 && ve(A))), o2 === n && (o2 = null), o2 !== n ? ((l2 = De()) === n && (l2 = null), l2 !== n ? (le = r3, r3 = t3 = { type: "keep", highlow: o2, expr: l2 || Je }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Re() {
          var r3, t3, o2, l2;
          return r3 = ne, e2.charCodeAt(ne) === 100 ? (t3 = "d", ne++) : (t3 = n, ce === 0 && ve(C)), t3 !== n ? (e2.charCodeAt(ne) === 108 ? (o2 = "l", ne++) : (o2 = n, ce === 0 && ve(x)), o2 === n && (e2.charCodeAt(ne) === 104 ? (o2 = "h", ne++) : (o2 = n, ce === 0 && ve(A))), o2 === n && (o2 = null), o2 !== n ? ((l2 = De()) === n && (l2 = null), l2 !== n ? (le = r3, r3 = t3 = { type: "drop", highlow: o2, expr: l2 || Je }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Te() {
          var r3, t3, o2, l2, s2, u2, a2, c2;
          if (r3 = ne, (t3 = $e()) !== n) {
            for (o2 = [], l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 43 ? (u2 = "+", ne++) : (u2 = n, ce === 0 && ve(T)), u2 !== n && (a2 = qe()) !== n && (c2 = $e()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);l2 !== n; )
              o2.push(l2), l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 43 ? (u2 = "+", ne++) : (u2 = n, ce === 0 && ve(T)), u2 !== n && (a2 = qe()) !== n && (c2 = $e()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);
            o2 !== n ? (le = r3, r3 = t3 = function(e3, r4) {
              if (r4.length == 0)
                return e3;
              return { head: e3, type: "diceExpression", ops: r4.map((e4) => ({ type: "math", op: e4[1], tail: e4[3] })) };
            }(t3, o2)) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function $e() {
          var e3;
          return (e3 = Ee()) === n && (e3 = Pe()), e3;
        }
        function Ee() {
          var r3, t3, o2;
          return r3 = ne, (t3 = function() {
            var r4, t4, o3, l2, s2;
            if (r4 = ne, (t4 = function() {
              var r5, t5, o4, l3;
              if (r5 = ne, (t5 = function() {
                var r6, t6, o5, l4;
                r6 = ne, (t6 = De()) === n && (t6 = null);
                t6 !== n ? (e2.charCodeAt(ne) === 100 ? (o5 = "d", ne++) : (o5 = n, ce === 0 && ve(C)), o5 !== n ? ((l4 = function() {
                  var r7, t7;
                  r7 = ne, e2.charCodeAt(ne) === 70 ? (t7 = "F", ne++) : (t7 = n, ce === 0 && ve(S));
                  t7 === n && (e2.charCodeAt(ne) === 102 ? (t7 = "f", ne++) : (t7 = n, ce === 0 && ve(f)));
                  t7 !== n && (le = r7, t7 = { type: "fate" });
                  return r7 = t7;
                }()) === n && (l4 = function() {
                  var r7, t7;
                  r7 = ne, e2.charCodeAt(ne) === 37 ? (t7 = "%", ne++) : (t7 = n, ce === 0 && ve(D));
                  t7 !== n && (le = r7, t7 = { type: "number", value: "100" });
                  return r7 = t7;
                }()) === n && (l4 = De()), l4 !== n ? (le = r6, t6 = { die: l4, count: t6 || { type: "number", value: 1 }, type: "die" }, r6 = t6) : (ne = r6, r6 = n)) : (ne = r6, r6 = n)) : (ne = r6, r6 = n);
                return r6;
              }()) !== n) {
                for (o4 = [], (l3 = ke()) === n && (l3 = je()) === n && (l3 = Fe()) === n && (l3 = Oe()) === n && (l3 = _e());l3 !== n; )
                  o4.push(l3), (l3 = ke()) === n && (l3 = je()) === n && (l3 = Fe()) === n && (l3 = Oe()) === n && (l3 = _e());
                o4 !== n ? (le = r5, u2 = o4, (s3 = t5).mods = (s3.mods || []).concat(u2), r5 = t5 = s3) : (ne = r5, r5 = n);
              } else
                ne = r5, r5 = n;
              var s3, u2;
              return r5;
            }()) !== n) {
              for (o3 = [], (l2 = Re()) === n && (l2 = we()) === n && (l2 = be()) === n && (l2 = xe()) === n && (l2 = Ce()) === n && (l2 = Ae());l2 !== n; )
                o3.push(l2), (l2 = Re()) === n && (l2 = we()) === n && (l2 = be()) === n && (l2 = xe()) === n && (l2 = Ce()) === n && (l2 = Ae());
              o3 !== n ? ((l2 = Me()) === n && (l2 = null), l2 !== n ? ((s2 = function() {
                var r5, t5;
                r5 = ne, e2.substr(ne, 2) === "sa" ? (t5 = "sa", ne += 2) : (t5 = n, ce === 0 && ve($));
                t5 !== n && (le = r5, t5 = { type: "sort", asc: true });
                return r5 = t5;
              }()) === n && (s2 = function() {
                var r5, t5;
                r5 = ne, e2.substr(ne, 2) === "sd" ? (t5 = "sd", ne += 2) : (t5 = n, ce === 0 && ve(E));
                t5 !== n && (le = r5, t5 = { type: "sort", asc: false });
                return r5 = t5;
              }()), s2 === n && (s2 = null), s2 !== n ? (le = r4, t4 = function(e3, r5, t5, o4) {
                const n2 = r5.filter((e4) => ["success", "failure"].includes(e4.type));
                return r5 = r5.filter((e4) => !n2.includes(e4)), e3.mods = (e3.mods || []).concat(r5), n2.length > 0 && (e3.targets = n2), t5 && (e3.match = t5), o4 && (e3.sort = o4), e3;
              }(t4, o3, l2, s2), r4 = t4) : (ne = r4, r4 = n)) : (ne = r4, r4 = n)) : (ne = r4, r4 = n);
            } else
              ne = r4, r4 = n;
            return r4;
          }()) !== n && qe() !== n ? ((o2 = Ve()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = i(t3, o2)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Fe() {
          var r3, t3, o2;
          return r3 = ne, e2.charCodeAt(ne) === 33 ? (t3 = "!", ne++) : (t3 = n, ce === 0 && ve(F)), t3 !== n ? ((o2 = Se()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = { type: "explode", target: o2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function ke() {
          var r3, t3, o2;
          return r3 = ne, e2.substr(ne, 2) === "!!" ? (t3 = "!!", ne += 2) : (t3 = n, ce === 0 && ve(k)), t3 !== n ? ((o2 = Se()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = { type: "compound", target: o2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function je() {
          var r3, t3, o2;
          return r3 = ne, e2.substr(ne, 2) === "!p" ? (t3 = "!p", ne += 2) : (t3 = n, ce === 0 && ve(j)), t3 !== n ? ((o2 = Se()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = { type: "penetrate", target: o2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function _e() {
          var r3, t3, o2;
          return r3 = ne, e2.charCodeAt(ne) === 114 ? (t3 = "r", ne++) : (t3 = n, ce === 0 && ve(_)), t3 !== n ? ((o2 = Se()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = { type: "reroll", target: o2 || He }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Oe() {
          var r3, t3, o2;
          return r3 = ne, e2.substr(ne, 2) === "ro" ? (t3 = "ro", ne += 2) : (t3 = n, ce === 0 && ve(O)), t3 !== n ? ((o2 = Se()) === n && (o2 = null), o2 !== n ? (le = r3, r3 = t3 = { type: "rerollOnce", target: o2 || He }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Se() {
          var r3, t3, o2;
          return r3 = ne, e2.charCodeAt(ne) === 62 ? (t3 = ">", ne++) : (t3 = n, ce === 0 && ve(d)), t3 === n && (e2.charCodeAt(ne) === 60 ? (t3 = "<", ne++) : (t3 = n, ce === 0 && ve(h)), t3 === n && (e2.charCodeAt(ne) === 61 ? (t3 = "=", ne++) : (t3 = n, ce === 0 && ve(p)))), t3 === n && (t3 = null), t3 !== n && (o2 = De()) !== n ? (le = r3, r3 = t3 = { type: "target", mod: t3, value: o2 }) : (ne = r3, r3 = n), r3;
        }
        function De() {
          var e3;
          return (e3 = Ge()) === n && (e3 = ze()), e3;
        }
        function Pe() {
          var r3;
          return (r3 = function() {
            var r4, t3, o2, l2;
            return r4 = ne, e2.substr(ne, 2) === "[[" ? (t3 = "[[", ne += 2) : (t3 = n, ce === 0 && ve(a)), t3 !== n && (o2 = Pe()) !== n ? (e2.substr(ne, 2) === "]]" ? (l2 = "]]", ne += 2) : (l2 = n, ce === 0 && ve(c)), l2 !== n ? (le = r4, r4 = t3 = { type: "inline", expr: o2 }) : (ne = r4, r4 = n)) : (ne = r4, r4 = n), r4;
          }()) === n && (r3 = Ie()) === n && (r3 = Ge()), r3;
        }
        function Ge() {
          var r3, t3, o2, l2, s2, u2, a2;
          return r3 = ne, e2.charCodeAt(ne) === 40 ? (t3 = "(", ne++) : (t3 = n, ce === 0 && ve(P)), t3 !== n && (o2 = Ie()) !== n ? (e2.charCodeAt(ne) === 41 ? (l2 = ")", ne++) : (l2 = n, ce === 0 && ve(G)), l2 !== n && qe() !== n ? ((s2 = Ve()) === n && (s2 = null), s2 !== n ? (le = r3, u2 = o2, (a2 = s2) && (u2.label = a2), r3 = t3 = u2) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Ie() {
          var r3, t3, o2, l2, s2, u2, a2, c2;
          if (r3 = ne, (t3 = Be()) !== n) {
            for (o2 = [], l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 43 ? (u2 = "+", ne++) : (u2 = n, ce === 0 && ve(T)), u2 === n && (e2.charCodeAt(ne) === 45 ? (u2 = "-", ne++) : (u2 = n, ce === 0 && ve(I))), u2 !== n && (a2 = qe()) !== n && (c2 = Be()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);l2 !== n; )
              o2.push(l2), l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 43 ? (u2 = "+", ne++) : (u2 = n, ce === 0 && ve(T)), u2 === n && (e2.charCodeAt(ne) === 45 ? (u2 = "-", ne++) : (u2 = n, ce === 0 && ve(I))), u2 !== n && (a2 = qe()) !== n && (c2 = Be()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);
            o2 !== n ? (le = r3, r3 = t3 = B(t3, o2)) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function Be() {
          var r3, t3, o2, l2, s2, u2, a2, c2;
          if (r3 = ne, (t3 = We()) !== n) {
            for (o2 = [], l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 42 ? (u2 = "*", ne++) : (u2 = n, ce === 0 && ve(W)), u2 === n && (e2.charCodeAt(ne) === 47 ? (u2 = "/", ne++) : (u2 = n, ce === 0 && ve(K))), u2 !== n && (a2 = qe()) !== n && (c2 = We()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);l2 !== n; )
              o2.push(l2), l2 = ne, (s2 = qe()) !== n ? (e2.charCodeAt(ne) === 42 ? (u2 = "*", ne++) : (u2 = n, ce === 0 && ve(W)), u2 === n && (e2.charCodeAt(ne) === 47 ? (u2 = "/", ne++) : (u2 = n, ce === 0 && ve(K))), u2 !== n && (a2 = qe()) !== n && (c2 = We()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);
            o2 !== n ? (le = r3, r3 = t3 = B(t3, o2)) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function We() {
          var r3, t3, o2, l2, s2, u2, a2, c2;
          if (r3 = ne, (t3 = Ue()) !== n) {
            for (o2 = [], l2 = ne, (s2 = qe()) !== n ? (e2.substr(ne, 2) === "**" ? (u2 = "**", ne += 2) : (u2 = n, ce === 0 && ve(U)), u2 === n && (e2.charCodeAt(ne) === 37 ? (u2 = "%", ne++) : (u2 = n, ce === 0 && ve(D))), u2 !== n && (a2 = qe()) !== n && (c2 = Ue()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);l2 !== n; )
              o2.push(l2), l2 = ne, (s2 = qe()) !== n ? (e2.substr(ne, 2) === "**" ? (u2 = "**", ne += 2) : (u2 = n, ce === 0 && ve(U)), u2 === n && (e2.charCodeAt(ne) === 37 ? (u2 = "%", ne++) : (u2 = n, ce === 0 && ve(D))), u2 !== n && (a2 = qe()) !== n && (c2 = Ue()) !== n ? l2 = s2 = [s2, u2, a2, c2] : (ne = l2, l2 = n)) : (ne = l2, l2 = n);
            o2 !== n ? (le = r3, r3 = t3 = B(t3, o2)) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function Ke() {
          var r3, t3, o2, l2, s2;
          return r3 = ne, (t3 = function() {
            var r4;
            return e2.substr(ne, 5) === "floor" ? (r4 = "floor", ne += 5) : (r4 = n, ce === 0 && ve(z)), r4 === n && (e2.substr(ne, 4) === "ceil" ? (r4 = "ceil", ne += 4) : (r4 = n, ce === 0 && ve(V)), r4 === n && (e2.substr(ne, 5) === "round" ? (r4 = "round", ne += 5) : (r4 = n, ce === 0 && ve(q)), r4 === n && (e2.substr(ne, 3) === "abs" ? (r4 = "abs", ne += 3) : (r4 = n, ce === 0 && ve(H))))), r4;
          }()) !== n && qe() !== n ? (e2.charCodeAt(ne) === 40 ? (o2 = "(", ne++) : (o2 = n, ce === 0 && ve(P)), o2 !== n && qe() !== n && (l2 = Ie()) !== n && qe() !== n ? (e2.charCodeAt(ne) === 41 ? (s2 = ")", ne++) : (s2 = n, ce === 0 && ve(G)), s2 !== n ? (le = r3, r3 = t3 = { type: "mathfunction", op: t3, expr: l2 }) : (ne = r3, r3 = n)) : (ne = r3, r3 = n)) : (ne = r3, r3 = n), r3;
        }
        function Ue() {
          var e3;
          return (e3 = Ke()) === n && (e3 = me()) === n && (e3 = Ge()), e3;
        }
        function ze() {
          var r3, t3, o2, l2;
          if (ce++, r3 = ne, e2.charCodeAt(ne) === 45 ? (t3 = "-", ne++) : (t3 = n, ce === 0 && ve(I)), t3 === n && (t3 = null), t3 !== n) {
            if (o2 = [], L.test(e2.charAt(ne)) ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(N)), l2 !== n)
              for (;l2 !== n; )
                o2.push(l2), L.test(e2.charAt(ne)) ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(N));
            else
              o2 = n;
            o2 !== n ? (le = r3, r3 = t3 = Q()) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return ce--, r3 === n && (t3 = n, ce === 0 && ve(J)), r3;
        }
        function Ve() {
          var r3, t3, o2, l2;
          if (r3 = ne, e2.charCodeAt(ne) === 91 ? (t3 = "[", ne++) : (t3 = n, ce === 0 && ve(X)), t3 !== n) {
            if (o2 = [], Y.test(e2.charAt(ne)) ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(Z)), l2 !== n)
              for (;l2 !== n; )
                o2.push(l2), Y.test(e2.charAt(ne)) ? (l2 = e2.charAt(ne), ne++) : (l2 = n, ce === 0 && ve(Z));
            else
              o2 = n;
            o2 !== n ? (e2.charCodeAt(ne) === 93 ? (l2 = "]", ne++) : (l2 = n, ce === 0 && ve(ee)), l2 !== n ? (le = r3, r3 = t3 = o2.join("")) : (ne = r3, r3 = n)) : (ne = r3, r3 = n);
          } else
            ne = r3, r3 = n;
          return r3;
        }
        function qe() {
          var r3, t3;
          for (ce++, r3 = [], te.test(e2.charAt(ne)) ? (t3 = e2.charAt(ne), ne++) : (t3 = n, ce === 0 && ve(oe));t3 !== n; )
            r3.push(t3), te.test(e2.charAt(ne)) ? (t3 = e2.charAt(ne), ne++) : (t3 = n, ce === 0 && ve(oe));
          return ce--, r3 === n && (t3 = n, ce === 0 && ve(re)), r3;
        }
        const He = { type: "target", mod: "=", value: { type: "number", value: 1 } }, Je = { type: "number", value: 1 };
        if ((t2 = s()) !== n && ne === e2.length)
          return t2;
        throw t2 !== n && ne < e2.length && ve({ type: "end" }), ge(ae, ue < e2.length ? e2.charAt(ue) : null, ue < e2.length ? fe(ue, ue + 1) : fe(ue, ue));
      } };
    }, function(e, r, t) {
      Object.defineProperty(r, "__esModule", { value: true });
      r.DiscordRollRenderer = class {
        render(e2) {
          return this.doRender(e2, true);
        }
        doRender(e2, r2 = false) {
          let t2 = "";
          switch (e2.type) {
            case "diceexpressionroll":
              t2 = this.renderGroupExpr(e2);
              break;
            case "grouproll":
              t2 = this.renderGroup(e2);
              break;
            case "die":
              t2 = this.renderDie(e2);
              break;
            case "expressionroll":
              t2 = this.renderExpression(e2);
              break;
            case "mathfunction":
              t2 = this.renderFunction(e2);
              break;
            case "roll":
              return this.renderRoll(e2);
            case "fateroll":
              return this.renderFateRoll(e2);
            case "number":
              const r3 = e2.label ? ` (${e2.label})` : "";
              return `${e2.value}${r3}`;
            case "fate":
              return "F";
            default:
              throw new Error("Unable to render");
          }
          return e2.valid || (t2 = "~~" + t2.replace(/~~/g, "") + "~~"), r2 ? this.stripBrackets(t2) : e2.label ? `(${e2.label}: ${t2})` : t2;
        }
        renderGroup(e2) {
          const r2 = [];
          for (const t2 of e2.dice)
            r2.push(this.doRender(t2));
          return r2.length > 1 ? `{ ${r2.join(" + ")} } = ${e2.value}` : `{ ${this.stripBrackets(r2[0])} } = ${e2.value}`;
        }
        renderGroupExpr(e2) {
          const r2 = [];
          for (const t2 of e2.dice)
            r2.push(this.doRender(t2));
          return r2.length > 1 ? `(${r2.join(" + ")} = ${e2.value})` : r2[0];
        }
        renderDie(e2) {
          const r2 = [];
          for (const t3 of e2.rolls)
            r2.push(this.doRender(t3));
          let t2 = `${r2.join(", ")}`;
          ["number", "fate"].includes(e2.die.type) && e2.count.type === "number" || (t2 += `[*Rolling: ${this.doRender(e2.count)}d${this.doRender(e2.die)}*]`);
          const o = e2.matched ? ` Match${e2.value === 1 ? "" : "es"}` : "";
          return t2 += ` = ${e2.value}${o}`, `(${t2})`;
        }
        renderExpression(e2) {
          if (e2.dice.length > 1) {
            const r2 = [];
            for (let t2 = 0;t2 < e2.dice.length - 1; t2++)
              r2.push(this.doRender(e2.dice[t2])), r2.push(e2.ops[t2]);
            return r2.push(this.doRender(e2.dice.slice(-1)[0])), r2.push("="), r2.push(e2.value + ""), `(${r2.join(" ")})`;
          }
          return e2.dice[0].type === "number" ? e2.value + "" : this.doRender(e2.dice[0]);
        }
        renderFunction(e2) {
          const r2 = this.doRender(e2.expr);
          return `(${e2.op}${this.addBrackets(r2)} = ${e2.value})`;
        }
        addBrackets(e2) {
          return e2.startsWith("(") || (e2 = `(${e2}`), e2.endsWith(")") || (e2 = `${e2})`), e2;
        }
        stripBrackets(e2) {
          return e2.startsWith("(") && (e2 = e2.substring(1)), e2.endsWith(")") && (e2 = e2.substring(0, e2.length - 1)), e2;
        }
        renderRoll(e2) {
          let r2 = `${e2.roll}`;
          return e2.valid ? e2.success && e2.value === 1 ? r2 = `**${e2.roll}**` : e2.success && e2.value === -1 ? r2 = `*${e2.roll}*` : e2.success || e2.critical !== "success" ? e2.success || e2.critical !== "failure" || (r2 = `*${e2.roll}*`) : r2 = `**${e2.roll}**` : r2 = `~~${e2.roll}~~`, e2.matched && (r2 = `__${r2}__`), r2;
        }
        renderFateRoll(e2) {
          const r2 = e2.roll === 0 ? "0" : e2.roll > 0 ? "+" : "-";
          let t2 = `${e2.roll}`;
          return e2.valid ? e2.success && e2.value === 1 ? t2 = `**${r2}**` : e2.success && e2.value === -1 && (t2 = `*${r2}*`) : t2 = `~~${r2}~~`, e2.matched && (t2 = `__${t2}__`), t2;
        }
      };
    }]);
  });
});

// node_modules/dotenv/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "dotenv",
    version: "16.4.7",
    description: "Loads environment variables from .env file",
    main: "lib/main.js",
    types: "lib/main.d.ts",
    exports: {
      ".": {
        types: "./lib/main.d.ts",
        require: "./lib/main.js",
        default: "./lib/main.js"
      },
      "./config": "./config.js",
      "./config.js": "./config.js",
      "./lib/env-options": "./lib/env-options.js",
      "./lib/env-options.js": "./lib/env-options.js",
      "./lib/cli-options": "./lib/cli-options.js",
      "./lib/cli-options.js": "./lib/cli-options.js",
      "./package.json": "./package.json"
    },
    scripts: {
      "dts-check": "tsc --project tests/types/tsconfig.json",
      lint: "standard",
      pretest: "npm run lint && npm run dts-check",
      test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
      "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
      prerelease: "npm test",
      release: "standard-version"
    },
    repository: {
      type: "git",
      url: "git://github.com/motdotla/dotenv.git"
    },
    funding: "https://dotenvx.com",
    keywords: [
      "dotenv",
      "env",
      ".env",
      "environment",
      "variables",
      "config",
      "settings"
    ],
    readmeFilename: "README.md",
    license: "BSD-2-Clause",
    devDependencies: {
      "@types/node": "^18.11.3",
      decache: "^4.6.2",
      sinon: "^14.0.1",
      standard: "^17.0.0",
      "standard-version": "^9.5.0",
      tap: "^19.2.0",
      typescript: "^4.8.4"
    },
    engines: {
      node: ">=12"
    },
    browser: {
      fs: false
    }
  };
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS((exports, module) => {
  var fs = __require("fs");
  var path = __require("path");
  var os = __require("os");
  var crypto = __require("crypto");
  var packageJson = require_package();
  var version = packageJson.version;
  var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
  function parse(src) {
    const obj = {};
    let lines = src.toString();
    lines = lines.replace(/\r\n?/mg, `
`);
    let match;
    while ((match = LINE.exec(lines)) != null) {
      const key = match[1];
      let value = match[2] || "";
      value = value.trim();
      const maybeQuote = value[0];
      value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
      if (maybeQuote === '"') {
        value = value.replace(/\\n/g, `
`);
        value = value.replace(/\\r/g, "\r");
      }
      obj[key] = value;
    }
    return obj;
  }
  function _parseVault(options) {
    const vaultPath = _vaultPath(options);
    const result = DotenvModule.configDotenv({ path: vaultPath });
    if (!result.parsed) {
      const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
      err.code = "MISSING_DATA";
      throw err;
    }
    const keys = _dotenvKey(options).split(",");
    const length = keys.length;
    let decrypted;
    for (let i = 0;i < length; i++) {
      try {
        const key = keys[i].trim();
        const attrs = _instructions(result, key);
        decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
        break;
      } catch (error) {
        if (i + 1 >= length) {
          throw error;
        }
      }
    }
    return DotenvModule.parse(decrypted);
  }
  function _log(message) {
    console.log(`[dotenv@${version}][INFO] ${message}`);
  }
  function _warn(message) {
    console.log(`[dotenv@${version}][WARN] ${message}`);
  }
  function _debug(message) {
    console.log(`[dotenv@${version}][DEBUG] ${message}`);
  }
  function _dotenvKey(options) {
    if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
      return options.DOTENV_KEY;
    }
    if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
      return process.env.DOTENV_KEY;
    }
    return "";
  }
  function _instructions(result, dotenvKey) {
    let uri;
    try {
      uri = new URL(dotenvKey);
    } catch (error) {
      if (error.code === "ERR_INVALID_URL") {
        const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      throw error;
    }
    const key = uri.password;
    if (!key) {
      const err = new Error("INVALID_DOTENV_KEY: Missing key part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environment = uri.searchParams.get("environment");
    if (!environment) {
      const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
      err.code = "INVALID_DOTENV_KEY";
      throw err;
    }
    const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
    const ciphertext = result.parsed[environmentKey];
    if (!ciphertext) {
      const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
      err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
      throw err;
    }
    return { ciphertext, key };
  }
  function _vaultPath(options) {
    let possibleVaultPath = null;
    if (options && options.path && options.path.length > 0) {
      if (Array.isArray(options.path)) {
        for (const filepath of options.path) {
          if (fs.existsSync(filepath)) {
            possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
          }
        }
      } else {
        possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
      }
    } else {
      possibleVaultPath = path.resolve(process.cwd(), ".env.vault");
    }
    if (fs.existsSync(possibleVaultPath)) {
      return possibleVaultPath;
    }
    return null;
  }
  function _resolveHome(envPath) {
    return envPath[0] === "~" ? path.join(os.homedir(), envPath.slice(1)) : envPath;
  }
  function _configVault(options) {
    _log("Loading env from encrypted .env.vault");
    const parsed = DotenvModule._parseVault(options);
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsed, options);
    return { parsed };
  }
  function configDotenv(options) {
    const dotenvPath = path.resolve(process.cwd(), ".env");
    let encoding = "utf8";
    const debug = Boolean(options && options.debug);
    if (options && options.encoding) {
      encoding = options.encoding;
    } else {
      if (debug) {
        _debug("No encoding is specified. UTF-8 is used by default");
      }
    }
    let optionPaths = [dotenvPath];
    if (options && options.path) {
      if (!Array.isArray(options.path)) {
        optionPaths = [_resolveHome(options.path)];
      } else {
        optionPaths = [];
        for (const filepath of options.path) {
          optionPaths.push(_resolveHome(filepath));
        }
      }
    }
    let lastError;
    const parsedAll = {};
    for (const path2 of optionPaths) {
      try {
        const parsed = DotenvModule.parse(fs.readFileSync(path2, { encoding }));
        DotenvModule.populate(parsedAll, parsed, options);
      } catch (e) {
        if (debug) {
          _debug(`Failed to load ${path2} ${e.message}`);
        }
        lastError = e;
      }
    }
    let processEnv = process.env;
    if (options && options.processEnv != null) {
      processEnv = options.processEnv;
    }
    DotenvModule.populate(processEnv, parsedAll, options);
    if (lastError) {
      return { parsed: parsedAll, error: lastError };
    } else {
      return { parsed: parsedAll };
    }
  }
  function config(options) {
    if (_dotenvKey(options).length === 0) {
      return DotenvModule.configDotenv(options);
    }
    const vaultPath = _vaultPath(options);
    if (!vaultPath) {
      _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
      return DotenvModule.configDotenv(options);
    }
    return DotenvModule._configVault(options);
  }
  function decrypt(encrypted, keyStr) {
    const key = Buffer.from(keyStr.slice(-64), "hex");
    let ciphertext = Buffer.from(encrypted, "base64");
    const nonce = ciphertext.subarray(0, 12);
    const authTag = ciphertext.subarray(-16);
    ciphertext = ciphertext.subarray(12, -16);
    try {
      const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
      aesgcm.setAuthTag(authTag);
      return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
    } catch (error) {
      const isRange = error instanceof RangeError;
      const invalidKeyLength = error.message === "Invalid key length";
      const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
      if (isRange || invalidKeyLength) {
        const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      } else if (decryptionFailed) {
        const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
        err.code = "DECRYPTION_FAILED";
        throw err;
      } else {
        throw error;
      }
    }
  }
  function populate(processEnv, parsed, options = {}) {
    const debug = Boolean(options && options.debug);
    const override = Boolean(options && options.override);
    if (typeof parsed !== "object") {
      const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
      err.code = "OBJECT_REQUIRED";
      throw err;
    }
    for (const key of Object.keys(parsed)) {
      if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
        if (override === true) {
          processEnv[key] = parsed[key];
        }
        if (debug) {
          if (override === true) {
            _debug(`"${key}" is already defined and WAS overwritten`);
          } else {
            _debug(`"${key}" is already defined and was NOT overwritten`);
          }
        }
      } else {
        processEnv[key] = parsed[key];
      }
    }
  }
  var DotenvModule = {
    configDotenv,
    _configVault,
    _parseVault,
    config,
    decrypt,
    parse,
    populate
  };
  exports.configDotenv = DotenvModule.configDotenv;
  exports._configVault = DotenvModule._configVault;
  exports._parseVault = DotenvModule._parseVault;
  exports.config = DotenvModule.config;
  exports.decrypt = DotenvModule.decrypt;
  exports.parse = DotenvModule.parse;
  exports.populate = DotenvModule.populate;
  module.exports = DotenvModule;
});

// dice-roller.js
var import_dice_roller_parser = __toESM(require_dist(), 1);
var import_dotenv = __toESM(require_main(), 1);
import { fetch } from "undici";
import_dotenv.default.config();
var apiKey = process.env.RANDOM_ORG_API_KEY;
async function fetchFromRandomOrg(count) {
  const url = "https://api.random.org/json-rpc/4/invoke";
  const requestBody = {
    jsonrpc: "2.0",
    method: "generateDecimalFractions",
    params: { apiKey, n: count, decimalPlaces: 14, replacement: true },
    id: 42
  };
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody)
  });
  const json = await response.json();
  if (json.error)
    throw new Error(json.error.message);
  return json.result.random.data.map(Number);
}
function countDice(parsed) {
  if (parsed.type === "die")
    return parsed.count.value || 1;
  if (parsed.type === "group" || parsed.type === "diceExpression") {
    return parsed.rolls?.reduce((sum, roll) => sum + countDice(roll), 0) || 0;
  }
  if (parsed.ops) {
    return parsed.ops.reduce((sum, op) => sum + countDice(op.tail || op.expr), countDice(parsed.head));
  }
  return 0;
}
async function rollDice(diceString) {
  const parsed = new import_dice_roller_parser.DiceRoller().parse(diceString);
  const dieCount = Math.min(countDice(parsed), 100);
  const randomNumbers = await fetchFromRandomOrg(dieCount);
  let index = 0;
  const diceRoller = new import_dice_roller_parser.DiceRoller(() => {
    if (index >= randomNumbers.length)
      throw new Error("Not enough random numbers");
    return randomNumbers[index++];
  }, 100);
  const roll = diceRoller.roll(diceString);
  const renderer = new import_dice_roller_parser.DiscordRollRenderer;
  return {
    total: roll.value,
    discord: renderer.render(roll)
  };
}
(async () => {
  const args = process.argv.slice(2);
  const diceString = args.join(" ").trim();
  if (!diceString) {
    console.error("Please provide dice notation as an argument.");
    console.error('Example: bun dice.js "3d6kh2 + 2d8>6"');
    process.exit(1);
  }
  try {
    if (!apiKey)
      throw new Error("API key is missing. Please set RANDOM_ORG_API_KEY in your .env file.");
    const result = await rollDice(diceString);
    console.log(`${diceString} = ${result.total} (${result.discord})`);
  } catch (error) {
    console.error("Rolling dice failed:", error.message);
    process.exit(1);
  }
})();
