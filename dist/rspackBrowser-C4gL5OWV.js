import { _ as _defineProperty, n as DEFAULT_DEPENDENCIES, o as transformDepsToEsmLinks, r as TRANSFORM_OPTIONS, s as CodeTransformer } from "./constant-DnVzDmYr.js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, { get: (a, b) => (typeof require !== "undefined" ? require : a)[b] }) : x)(function(x) {
	if (typeof require !== "undefined") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + x + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
});
//#endregion
//#region src/lib/ReactPreview/preview/compilers/rspackBrowser.ts
var rspackBrowser_exports = /* @__PURE__ */ __exportAll({
	RspackBrowserPreviewCompiler: () => RspackBrowserPreviewCompiler,
	compileRspackBrowserProject: () => compileRspackBrowserProject,
	createRspackBrowserConfig: () => createRspackBrowserConfig
});
var DEFAULT_OUTPUT_FILE = "main.js";
var RspackBrowserPreviewCompiler = class {
	constructor(options = {}) {
		_defineProperty(this, "options", void 0);
		_defineProperty(this, "worker", null);
		_defineProperty(this, "nextRequestId", 0);
		_defineProperty(this, "pendingCompiles", /* @__PURE__ */ new Map());
		_defineProperty(this, "handleWorkerMessage", (event) => {
			const message = event.data;
			const pending = this.pendingCompiles.get(message.id);
			if (!pending) return;
			this.pendingCompiles.delete(message.id);
			if (message.type === "compiled") {
				pending.resolve(createPreviewCompileResult(pending.entryFile, message.result));
				return;
			}
			const error = new Error(message.message);
			if (message.stack) error.stack = message.stack;
			pending.reject(error);
		});
		_defineProperty(this, "handleWorkerError", (event) => {
			this.rejectPendingCompiles(event.error instanceof Error ? event.error : new Error(event.message));
		});
		this.options = options;
	}
	async compile(input) {
		if (this.shouldUseWorker()) return this.compileInWorker(input);
		const result = await compileRspackBrowserProject(input, this.options);
		return createPreviewCompileResult(input.entryFile, result);
	}
	cleanup(result) {
		if (result) {
			revokePreviewCompileResult(result);
			return;
		}
		this.worker?.terminate();
		this.worker = null;
		this.rejectPendingCompiles(/* @__PURE__ */ new Error("Rspack browser compiler worker was terminated"));
	}
	shouldUseWorker() {
		if (this.options.useWorker === false) return false;
		return typeof Worker !== "undefined" && typeof window !== "undefined" && typeof document !== "undefined";
	}
	compileInWorker(input) {
		const worker = this.getWorker();
		const id = ++this.nextRequestId;
		return new Promise((resolve, reject) => {
			this.pendingCompiles.set(id, {
				entryFile: input.entryFile,
				resolve,
				reject
			});
			worker.postMessage({
				type: "compile",
				id,
				input,
				options: serializeRspackOptions(this.options)
			});
		});
	}
	getWorker() {
		if (this.worker) return this.worker;
		this.worker = this.options.workerFactory?.() ?? createDefaultRspackWorker();
		this.worker.addEventListener("message", this.handleWorkerMessage);
		this.worker.addEventListener("error", this.handleWorkerError);
		return this.worker;
	}
	rejectPendingCompiles(error) {
		for (const pending of this.pendingCompiles.values()) pending.reject(error);
		this.pendingCompiles.clear();
	}
};
async function compileRspackBrowserProject(input, options = {}, rspackBrowserModule) {
	const rspackModule = rspackBrowserModule ?? await loadRspackBrowserModule();
	const outputFileName = options.outputFileName ?? DEFAULT_OUTPUT_FILE;
	const transformer = new CodeTransformer();
	await transformer.initialize();
	const transformedFiles = await transformer.transformFileContents(input.files, input.depsInfo, { importResolution: "preserve" });
	const projectFiles = createProjectFiles(input.files, transformedFiles);
	const volume = rspackModule.builtinMemFs.volume;
	volume.reset?.();
	volume.fromJSON(projectFiles, "/");
	const config = createRspackBrowserConfig(input, options, rspackModule);
	await new Promise((resolve, reject) => {
		rspackModule.rspack(config, (error, stats) => {
			if (error) {
				reject(error);
				return;
			}
			if (stats?.hasErrors?.()) {
				reject(new Error(formatRspackStatsErrors(stats)));
				return;
			}
			resolve();
		});
	});
	const output = volume.readFileSync(`/dist/${outputFileName}`, "utf-8");
	return {
		outputFileName,
		output: typeof output === "string" ? output : new TextDecoder().decode(output),
		transformedFiles: transformedFiles.size
	};
}
function createRspackBrowserConfig(input, options = {}, rspackBrowserModule) {
	const outputFileName = options.outputFileName ?? DEFAULT_OUTPUT_FILE;
	const allDeps = {
		...DEFAULT_DEPENDENCIES,
		...input.depsInfo
	};
	const externalRequests = new Set(Object.keys(allDeps));
	const dependencyLinks = transformDepsToEsmLinks(allDeps, TRANSFORM_OPTIONS).dependencies;
	const externalizeKnownDependencies = (context, callback) => {
		const request = context.request;
		if (request && externalRequests.has(request)) {
			callback(null, request, "module");
			return;
		}
		callback();
	};
	return {
		mode: "development",
		context: "/",
		target: ["web", "es2020"],
		entry: toProjectPath(input.entryFile),
		devtool: false,
		output: {
			path: "/dist",
			filename: outputFileName,
			chunkFilename: "[name].js",
			module: true,
			library: { type: "module" },
			environment: { module: true }
		},
		experiments: {
			outputModule: true,
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
		externalsType: "module",
		externals: [externalizeKnownDependencies],
		optimization: {
			minimize: false,
			splitChunks: false,
			runtimeChunk: false
		},
		plugins: createRspackBrowserPlugins(options.cdnDomain ?? "https://esm.sh", dependencyLinks, allDeps, rspackBrowserModule)
	};
}
function createProjectFiles(files, transformedFiles) {
	const projectFiles = { "/package.json": JSON.stringify({ type: "module" }) };
	for (const [fileName, content] of Object.entries(files)) projectFiles[toProjectPath(fileName)] = transformedFiles.get(fileName) ?? content;
	return projectFiles;
}
function createRspackBrowserPlugins(domain, dependencyLinks, dependencyVersions, rspackBrowserModule) {
	if (!rspackBrowserModule?.BrowserHttpImportEsmPlugin) return [];
	return [new rspackBrowserModule.BrowserHttpImportEsmPlugin({
		domain,
		dependencyVersions,
		dependencyUrl(request) {
			return dependencyLinks[request.request] ?? dependencyLinks[request.packageName];
		}
	})];
}
function createPreviewCompileResult(entryFile, result) {
	const blob = new Blob([result.output], { type: "application/javascript" });
	const url = URL.createObjectURL(blob);
	return {
		fileUrls: new Map([[entryFile, url], [result.outputFileName, url]]),
		entryFile,
		transformedFiles: result.transformedFiles,
		cleanup: () => URL.revokeObjectURL(url)
	};
}
function revokePreviewCompileResult(result) {
	result.cleanup?.();
}
function toProjectPath(fileName) {
	return `/src/${fileName.replace(/^\/+/, "")}`;
}
function formatRspackStatsErrors(stats) {
	const json = stats.toJson?.({ errors: true });
	if (isStatsJsonWithErrors(json)) return json.errors.map((error) => error.message || String(error)).join("\n");
	return stats.toString?.({ errors: true }) || "Rspack browser compilation failed";
}
function isStatsJsonWithErrors(value) {
	return typeof value === "object" && value !== null && Array.isArray(value.errors);
}
function serializeRspackOptions(options) {
	return {
		cdnDomain: options.cdnDomain,
		outputFileName: options.outputFileName,
		useWorker: false
	};
}
function createDefaultRspackWorker() {
	return new Worker(new URL(
		/* @vite-ignore */
		"./rspack-browser-worker.js",
		import.meta.url
	), {
		type: "module",
		name: "react-previewer-rspack-browser"
	});
}
async function loadRspackBrowserModule() {
	return await import("@rspack/browser");
}
//#endregion
export { __require as i, rspackBrowser_exports as n, __commonJSMin as r, compileRspackBrowserProject as t };

//# sourceMappingURL=rspackBrowser-C4gL5OWV.js.map