var l = Object.defineProperty;
var h = (n, s, e) => s in n ? l(n, s, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[s] = e;
var c = (n, s, e) => h(n, typeof s != "symbol" ? s + "" : s, e);
let a = {};
function u(n) {
  return new Promise((s, e) => {
    if (a[n]) {
      s(a[n]);
      return;
    }
    const t = fetch(n).then((r) => r.text()).then((r) => {
      const o = document.createElement("div");
      return o.innerHTML = r.trim(), a[n] = r, s(r), r;
    }).catch((r) => (e(r), null));
    a[n] = t;
  });
}
class d extends HTMLElement {
  constructor() {
    super();
    c(this, "renderRoot");
    this.getAttribute("shadow") === "false" ? this.renderRoot = this : this.renderRoot = this.attachShadow({ mode: "open" });
  }
  static get observedAttributes() {
    return ["src"];
  }
  connectedCallback() {
    this.loadSVG();
  }
  attributeChangedCallback(e, t, r) {
    e === "src" && t !== r && this.loadSVG();
  }
  async loadSVG() {
    const e = this.getAttribute("src");
    if (!e) {
      console.error("Missing src attribute");
      return;
    }
    try {
      const t = await u(e);
      if (!t)
        throw new Error("No SVG element found in the response");
      this.attachSVG(t);
    } catch (t) {
      console.error(t);
    }
  }
  attachSVG(e) {
    const t = document.createElement("div");
    t.innerHTML = this.applyReplacements(e);
    const r = t.querySelector("svg");
    this.transferAttributes(r), this.renderRoot.innerHTML = "", this.renderRoot.appendChild(r);
  }
  transferAttributes(e) {
    Array.from(this.attributes).forEach((t) => {
      t.name !== "src" && t.name !== "shadow" && e.setAttribute(t.name, t.value);
    });
  }
  applyReplacements(e) {
    return this.querySelectorAll("embed-svg-replace").forEach((r) => {
      const o = r.getAttribute("pattern"), i = r.getAttribute("value");
      o && i && (e = e.replace(new RegExp(o, "g"), i));
    }), e;
  }
}
customElements.define("embed-svg", d);
export {
  d as EmbedSVG
};
