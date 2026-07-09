import { n as e } from "./rolldown-runtime-DnwLefa7.js";
import { d as t, f as n, n as r, p as i, r as a, s as o, x as s } from "./constant-DUnqHhWT.js";
//#region src/lib/ReactPreview/preview/compilers/rspackBrowser.ts
var c = /* @__PURE__ */ e({
	RspackBrowserPreviewCompiler: () => d,
	compileRspackBrowserProject: () => f,
	createRspackBrowserConfig: () => p
}), l = "main.js", u = [
	"Rspack browser compilation requires cross-origin isolation because @rspack/browser uses SharedArrayBuffer.",
	"Serve the preview page with Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp,",
	"or use the Babel compiler mode in environments that cannot provide those headers."
].join(" "), d = class {
	constructor(e = {}) {
		s(this, "options", void 0), s(this, "worker", null), s(this, "nextRequestId", 0), s(this, "pendingCompiles", /* @__PURE__ */ new Map()), s(this, "handleWorkerMessage", (e) => {
			let t = e.data, n = this.pendingCompiles.get(t.id);
			if (!n) return;
			if (this.pendingCompiles.delete(t.id), t.type === "compiled") {
				n.resolve(C(n.entryFile, t.result));
				return;
			}
			let r = Error(t.message);
			t.stack && (r.stack = t.stack), n.reject(r);
		}), s(this, "handleWorkerError", (e) => {
			this.rejectPendingCompiles(e.error instanceof Error ? e.error : Error(e.message));
		}), this.options = e;
	}
	async compile(e) {
		if (this.shouldUseWorker()) return this.compileInWorker(e);
		let t = await f(e, this.options);
		return C(e.entryFile, t);
	}
	cleanup(e) {
		if (e) {
			w(e);
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
				options: k(this.options)
			});
		});
	}
	getWorker() {
		return this.worker ? this.worker : (this.worker = this.options.workerFactory?.() ?? A(), this.worker.addEventListener("message", this.handleWorkerMessage), this.worker.addEventListener("error", this.handleWorkerError), this.worker);
	}
	rejectPendingCompiles(e) {
		for (let t of this.pendingCompiles.values()) t.reject(e);
		this.pendingCompiles.clear();
	}
};
async function f(e, t = {}, n) {
	let r = n ?? await j(), i = t.outputFileName ?? l, a = e.sourceAttributeNames ?? t.sourceAttributeNames, o = m(e.files, a, e.depsInfo), s = r.builtinMemFs.volume;
	s.reset?.(), s.fromJSON(o, "/");
	let c = p(e, t, r), u;
	await new Promise((e, t) => {
		r.rspack(c, (n, r) => {
			if (u = r, n) {
				t(n);
				return;
			}
			if (r?.hasErrors?.()) {
				t(Error(E(r)));
				return;
			}
			e();
		});
	});
	let d = s.readFileSync(`/dist/${i}`, "utf-8"), f = x(typeof d == "string" ? d : new TextDecoder().decode(d), g(e.depsInfo)), h = _(s, u), y = v(s, i);
	return {
		outputFileName: i,
		output: h ? `${f}\n${h}` : f,
		transformedFiles: Object.keys(e.files).length,
		...y ? { sourceMap: y } : {}
	};
}
function p(e, t = {}, n) {
	let r = t.outputFileName ?? l, o = g(e.depsInfo), s = new Set(Object.keys(o)), c = i(o, a).dependencies;
	return {
		mode: "development",
		context: "/",
		target: ["web", "es2020"],
		entry: T(e.entryFile),
		devtool: "source-map",
		output: {
			path: "/dist",
			filename: r,
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
			if (n && b(n, o, s)) {
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
		plugins: S(t.cdnDomain ?? "https://esm.sh", c, o, n)
	};
}
function m(e, t, n) {
	let r = { "/package.json": JSON.stringify({ type: "module" }) };
	for (let [i, a] of Object.entries(e)) r[T(i)] = h(i) ? o(a, {
		filename: i,
		files: e,
		depsInfo: n,
		sourceAttributeNames: t
	}) : a;
	return r;
}
function h(e) {
	return /\.[jt]sx$/i.test(e);
}
function g(e) {
	let n = {
		...r,
		"react-dom/client": r["react-dom"],
		"react/jsx-runtime": r.react,
		"react/jsx-dev-runtime": r.react,
		...e
	};
	for (let r of Object.keys(n)) {
		let { packageName: i, subPath: a } = t(r);
		!a || !e[i] || e[r] || (n[r] = e[i]);
	}
	return n;
}
function _(e, t) {
	let n = y(t).filter((e) => e.endsWith(".css"));
	return n.length === 0 ? "" : `${n.map((t) => {
		let n = e.readFileSync(`/dist/${t}`, "utf-8"), r = typeof n == "string" ? n : new TextDecoder().decode(n);
		return `await window.__reactPreviewInjectStyle(${JSON.stringify(t)}, ${JSON.stringify(r)});`;
	}).join("\n")}\n`;
}
function v(e, t) {
	try {
		let n = e.readFileSync(`/dist/${t}.map`, "utf-8");
		return typeof n == "string" ? n : new TextDecoder().decode(n);
	} catch {
		return;
	}
}
function y(e) {
	let t = e?.toJson?.({ assets: !0 });
	return O(t) ? t.assets.map((e) => e.name).filter((e) => typeof e == "string") : [];
}
function b(e, t, r) {
	return r.has(e) || !!n(e, t, a);
}
function x(e, t) {
	let r = (e) => n(e, t, a) ?? e;
	return e.replace(/(\bfrom\s*["'])([^"']+)(["'])/g, (e, t, n, i) => {
		let a = r(n);
		return a === n ? e : `${t}${a}${i}`;
	}).replace(/(\bimport\s*\(\s*["'])([^"']+)(["']\s*\))/g, (e, t, n, i) => {
		let a = r(n);
		return a === n ? e : `${t}${a}${i}`;
	});
}
function S(e, t, n, r) {
	return r?.BrowserHttpImportEsmPlugin ? [new r.BrowserHttpImportEsmPlugin({
		domain: e,
		dependencyVersions: n,
		dependencyUrl(e) {
			return t[e.request] ?? t[e.packageName];
		}
	})] : [];
}
function C(e, t) {
	let n = new Blob([t.output], { type: "application/javascript" }), r = URL.createObjectURL(n);
	return {
		fileUrls: new Map([[e, r], [t.outputFileName, r]]),
		sourceMaps: t.sourceMap ? new Map([[r, t.sourceMap]]) : void 0,
		entryFile: e,
		transformedFiles: t.transformedFiles,
		cleanup: () => URL.revokeObjectURL(r)
	};
}
function w(e) {
	e.cleanup?.();
}
function T(e) {
	return `/src/${e.replace(/^\/+/, "")}`;
}
function E(e) {
	let t = e.toJson?.({ errors: !0 });
	return D(t) ? t.errors.map((e) => e.message || String(e)).join("\n") : e.toString?.({ errors: !0 }) || "Rspack browser compilation failed";
}
function D(e) {
	return typeof e == "object" && !!e && Array.isArray(e.errors);
}
function O(e) {
	return typeof e == "object" && !!e && Array.isArray(e.assets);
}
function k(e) {
	return {
		cdnDomain: e.cdnDomain,
		outputFileName: e.outputFileName,
		useWorker: !1,
		sourceAttributeNames: e.sourceAttributeNames
	};
}
function A() {
	return new Worker(new URL(
		/* @vite-ignore */
		"./rspack-browser-worker.js",
		import.meta.url
	), {
		type: "module",
		name: "react-previewer-rspack-browser"
	});
}
async function j() {
	if (globalThis.crossOriginIsolated === !1) throw Error(u);
	return await import("@rspack/browser");
}
//#endregion
export { c as n, f as t };

//# sourceMappingURL=rspackBrowser-CFB5s4IO.js.map