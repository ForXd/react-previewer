import { b as e, d as t, f as n, n as r, r as i, s as a, u as o } from "./constant-CGZrxPcN.js";
//#region \0rolldown/runtime.js
var s = Object.defineProperty, c = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), l = (e, t) => {
	let n = {};
	for (var r in e) s(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t || s(n, Symbol.toStringTag, { value: "Module" }), n;
}, u = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), d = /* @__PURE__ */ l({
	RspackBrowserPreviewCompiler: () => m,
	compileRspackBrowserProject: () => h,
	createRspackBrowserConfig: () => g
}), f = "main.js", p = [
	"Rspack browser compilation requires cross-origin isolation because @rspack/browser uses SharedArrayBuffer.",
	"Serve the preview page with Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp,",
	"or use the Babel compiler mode in environments that cannot provide those headers."
].join(" "), m = class {
	constructor(t = {}) {
		e(this, "options", void 0), e(this, "worker", null), e(this, "nextRequestId", 0), e(this, "pendingCompiles", /* @__PURE__ */ new Map()), e(this, "handleWorkerMessage", (e) => {
			let t = e.data, n = this.pendingCompiles.get(t.id);
			if (!n) return;
			if (this.pendingCompiles.delete(t.id), t.type === "compiled") {
				n.resolve(T(n.entryFile, t.result));
				return;
			}
			let r = Error(t.message);
			t.stack && (r.stack = t.stack), n.reject(r);
		}), e(this, "handleWorkerError", (e) => {
			this.rejectPendingCompiles(e.error instanceof Error ? e.error : Error(e.message));
		}), this.options = t;
	}
	async compile(e) {
		if (this.shouldUseWorker()) return this.compileInWorker(e);
		let t = await h(e, this.options);
		return T(e.entryFile, t);
	}
	cleanup(e) {
		if (e) {
			E(e);
			return;
		}
		this.worker?.terminate(), this.worker = null, this.rejectPendingCompiles(/* @__PURE__ */ Error("Rspack browser compiler worker was terminated"));
	}
	shouldUseWorker() {
		return this.options.useWorker === !1 ? !1 : typeof Worker < "u" && typeof window < "u" && typeof document < "u";
	}
	compileInWorker(e) {
		let t = this.getWorker(), n = ++this.nextRequestId;
		return new Promise((r, i) => {
			this.pendingCompiles.set(n, {
				entryFile: e.entryFile,
				resolve: r,
				reject: i
			}), t.postMessage({
				type: "compile",
				id: n,
				input: e,
				options: j(this.options)
			});
		});
	}
	getWorker() {
		return this.worker ? this.worker : (this.worker = this.options.workerFactory?.() ?? M(), this.worker.addEventListener("message", this.handleWorkerMessage), this.worker.addEventListener("error", this.handleWorkerError), this.worker);
	}
	rejectPendingCompiles(e) {
		for (let t of this.pendingCompiles.values()) t.reject(e);
		this.pendingCompiles.clear();
	}
};
async function h(e, t = {}, n) {
	let r = n ?? await N(), i = t.outputFileName ?? f, a = e.sourceAttributeNames ?? t.sourceAttributeNames, o = _(e.files, a, e.depsInfo), s = r.builtinMemFs.volume;
	s.reset?.(), s.fromJSON(o, "/");
	let c = g(e, t, r), l;
	await new Promise((e, t) => {
		r.rspack(c, (n, r) => {
			if (l = r, n) {
				t(n);
				return;
			}
			if (r?.hasErrors?.()) {
				t(Error(O(r)));
				return;
			}
			e();
		});
	});
	let u = s.readFileSync(`/dist/${i}`, "utf-8"), d = C(typeof u == "string" ? u : new TextDecoder().decode(u), y(e.depsInfo));
	return {
		outputFileName: i,
		output: `${b(s, l)}${d}`,
		transformedFiles: Object.keys(e.files).length
	};
}
function g(e, t = {}, r) {
	let a = t.outputFileName ?? f, o = y(e.depsInfo), s = new Set(Object.keys(o)), c = n(o, i).dependencies;
	return {
		mode: "development",
		context: "/",
		target: ["web", "es2020"],
		entry: D(e.entryFile),
		devtool: !1,
		output: {
			path: "/dist",
			filename: a,
			chunkFilename: "[name].js",
			module: !0,
			library: { type: "module" },
			environment: { module: !0 }
		},
		experiments: {
			outputModule: !0,
			buildHttp: { allowedUris: ["https://"] }
		},
		resolve: { extensions: [
			".tsx",
			".ts",
			".jsx",
			".js",
			".json",
			".css"
		] },
		module: { rules: [{
			test: /\.[cm]?[jt]sx?$/,
			use: [{
				loader: "builtin:swc-loader",
				options: { jsc: {
					parser: {
						syntax: "typescript",
						tsx: !0
					},
					transform: { react: {
						runtime: "automatic",
						development: !1
					} }
				} }
			}]
		}, {
			test: /\.css$/,
			type: "css/auto"
		}] },
		externalsType: "module",
		externals: [(e, t) => {
			let n = e.request;
			if (n && S(n, o, s)) {
				t(null, n, "module");
				return;
			}
			t();
		}],
		optimization: {
			minimize: !1,
			splitChunks: !1,
			runtimeChunk: !1
		},
		plugins: w(t.cdnDomain ?? "https://esm.sh", c, o, r)
	};
}
function _(e, t, n) {
	let r = { "/package.json": JSON.stringify({ type: "module" }) };
	for (let [i, o] of Object.entries(e)) r[D(i)] = v(i) ? a(o, {
		filename: i,
		files: e,
		depsInfo: n,
		sourceAttributeNames: t
	}) : o;
	return r;
}
function v(e) {
	return /\.[jt]sx$/i.test(e);
}
function y(e) {
	let t = {
		...r,
		"react-dom/client": r["react-dom"],
		"react/jsx-runtime": r.react,
		"react/jsx-dev-runtime": r.react,
		...e
	};
	for (let n of Object.keys(t)) {
		let { packageName: r, subPath: i } = o(n);
		!i || !e[r] || e[n] || (t[n] = e[r]);
	}
	return t;
}
function b(e, t) {
	let n = x(t).filter((e) => e.endsWith(".css"));
	return n.length === 0 ? "" : `${n.map((t) => {
		let n = e.readFileSync(`/dist/${t}`, "utf-8"), r = typeof n == "string" ? n : new TextDecoder().decode(n);
		return `await window.__reactPreviewInjectStyle(${JSON.stringify(t)}, ${JSON.stringify(r)});`;
	}).join("\n")}\n`;
}
function x(e) {
	let t = e?.toJson?.({ assets: !0 });
	return A(t) ? t.assets.map((e) => e.name).filter((e) => typeof e == "string") : [];
}
function S(e, n, r) {
	return r.has(e) || !!t(e, n, i);
}
function C(e, n) {
	let r = (e) => t(e, n, i) ?? e;
	return e.replace(/(\bfrom\s*["'])([^"']+)(["'])/g, (e, t, n, i) => {
		let a = r(n);
		return a === n ? e : `${t}${a}${i}`;
	}).replace(/(\bimport\s*\(\s*["'])([^"']+)(["']\s*\))/g, (e, t, n, i) => {
		let a = r(n);
		return a === n ? e : `${t}${a}${i}`;
	});
}
function w(e, t, n, r) {
	return r?.BrowserHttpImportEsmPlugin ? [new r.BrowserHttpImportEsmPlugin({
		domain: e,
		dependencyVersions: n,
		dependencyUrl(e) {
			return t[e.request] ?? t[e.packageName];
		}
	})] : [];
}
function T(e, t) {
	let n = new Blob([t.output], { type: "application/javascript" }), r = URL.createObjectURL(n);
	return {
		fileUrls: new Map([[e, r], [t.outputFileName, r]]),
		entryFile: e,
		transformedFiles: t.transformedFiles,
		cleanup: () => URL.revokeObjectURL(r)
	};
}
function E(e) {
	e.cleanup?.();
}
function D(e) {
	return `/src/${e.replace(/^\/+/, "")}`;
}
function O(e) {
	let t = e.toJson?.({ errors: !0 });
	return k(t) ? t.errors.map((e) => e.message || String(e)).join("\n") : e.toString?.({ errors: !0 }) || "Rspack browser compilation failed";
}
function k(e) {
	return typeof e == "object" && !!e && Array.isArray(e.errors);
}
function A(e) {
	return typeof e == "object" && !!e && Array.isArray(e.assets);
}
function j(e) {
	return {
		cdnDomain: e.cdnDomain,
		outputFileName: e.outputFileName,
		useWorker: !1,
		sourceAttributeNames: e.sourceAttributeNames
	};
}
function M() {
	return new Worker(new URL(
		/* @vite-ignore */
		"./rspack-browser-worker.js",
		import.meta.url
	), {
		type: "module",
		name: "react-previewer-rspack-browser"
	});
}
async function N() {
	if (globalThis.crossOriginIsolated === !1) throw Error(p);
	return await import("@rspack/browser");
}
//#endregion
export { u as i, d as n, c as r, h as t };

//# sourceMappingURL=rspackBrowser-CQRtaM8Y.js.map