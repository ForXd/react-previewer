const require_rolldown_runtime = require("./rolldown-runtime-BqCkTl7Q.cjs");
const require_constant = require("./constant-B81PAp3m.cjs");
//#region src/lib/ReactPreview/preview/compilers/rspackBrowser.ts
var rspackBrowser_exports = /* @__PURE__ */ require_rolldown_runtime.__exportAll({
	RspackBrowserPreviewCompiler: () => RspackBrowserPreviewCompiler,
	compileRspackBrowserProject: () => compileRspackBrowserProject,
	createRspackBrowserConfig: () => createRspackBrowserConfig
});
var DEFAULT_OUTPUT_FILE = "main.js";
var RspackBrowserPreviewCompiler = class {
	constructor(options = {}) {
		require_constant._defineProperty(this, "options", void 0);
		require_constant._defineProperty(this, "worker", null);
		require_constant._defineProperty(this, "nextRequestId", 0);
		require_constant._defineProperty(this, "pendingCompiles", /* @__PURE__ */ new Map());
		require_constant._defineProperty(this, "handleWorkerMessage", (event) => {
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
		require_constant._defineProperty(this, "handleWorkerError", (event) => {
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
	const sourceAttributeNames = input.sourceAttributeNames ?? options.sourceAttributeNames;
	const projectFiles = createProjectFiles(input.files, sourceAttributeNames);
	const volume = rspackModule.builtinMemFs.volume;
	volume.reset?.();
	volume.fromJSON(projectFiles, "/");
	const config = createRspackBrowserConfig(input, options, rspackModule);
	let compilationStats;
	await new Promise((resolve, reject) => {
		rspackModule.rspack(config, (error, stats) => {
			compilationStats = stats;
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
	const outputText = typeof output === "string" ? output : new TextDecoder().decode(output);
	return {
		outputFileName,
		output: `${createCssInjectionRuntime(volume, compilationStats)}${outputText}`,
		transformedFiles: Object.keys(input.files).length
	};
}
function createRspackBrowserConfig(input, options = {}, rspackBrowserModule) {
	const outputFileName = options.outputFileName ?? DEFAULT_OUTPUT_FILE;
	const allDeps = getRspackDependencies(input.depsInfo);
	const externalRequests = new Set(Object.keys(allDeps));
	const dependencyLinks = require_constant.transformDepsToEsmLinks(allDeps, require_constant.TRANSFORM_OPTIONS).dependencies;
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
		module: { rules: [{
			test: /\.[cm]?[jt]sx?$/,
			use: [{
				loader: "builtin:swc-loader",
				options: { jsc: {
					parser: {
						syntax: "typescript",
						tsx: true
					},
					transform: { react: {
						runtime: "automatic",
						development: false
					} }
				} }
			}]
		}, {
			test: /\.css$/,
			type: "css/auto"
		}] },
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
function createProjectFiles(files, sourceAttributeNames) {
	const projectFiles = { "/package.json": JSON.stringify({ type: "module" }) };
	for (const [fileName, content] of Object.entries(files)) projectFiles[toProjectPath(fileName)] = isJSXSourceFile(fileName) ? require_constant.injectJSXSourceInfo(content, {
		filename: fileName,
		files,
		sourceAttributeNames
	}) : content;
	return projectFiles;
}
function isJSXSourceFile(fileName) {
	return /\.[jt]sx$/i.test(fileName);
}
function getRspackDependencies(depsInfo) {
	return {
		...require_constant.DEFAULT_DEPENDENCIES,
		"react-dom/client": require_constant.DEFAULT_DEPENDENCIES["react-dom"],
		"react/jsx-runtime": require_constant.DEFAULT_DEPENDENCIES.react,
		"react/jsx-dev-runtime": require_constant.DEFAULT_DEPENDENCIES.react,
		...depsInfo
	};
}
function createCssInjectionRuntime(volume, stats) {
	const cssAssets = getRspackAssetNames(stats).filter((assetName) => assetName.endsWith(".css"));
	if (cssAssets.length === 0) return "";
	return `${cssAssets.map((assetName) => {
		const content = volume.readFileSync(`/dist/${assetName}`, "utf-8");
		const cssText = typeof content === "string" ? content : new TextDecoder().decode(content);
		return `await window.__reactPreviewInjectStyle(${JSON.stringify(assetName)}, ${JSON.stringify(cssText)});`;
	}).join("\n")}\n`;
}
function getRspackAssetNames(stats) {
	const json = stats?.toJson?.({ assets: true });
	if (!isStatsJsonWithAssets(json)) return [];
	return json.assets.map((asset) => asset.name).filter((name) => typeof name === "string");
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
function isStatsJsonWithAssets(value) {
	return typeof value === "object" && value !== null && Array.isArray(value.assets);
}
function serializeRspackOptions(options) {
	return {
		cdnDomain: options.cdnDomain,
		outputFileName: options.outputFileName,
		useWorker: false,
		sourceAttributeNames: options.sourceAttributeNames
	};
}
function createDefaultRspackWorker() {
	return new Worker(new URL(
		/* @vite-ignore */
		"./rspack-browser-worker.js",
		{}.url
	), {
		type: "module",
		name: "react-previewer-rspack-browser"
	});
}
async function loadRspackBrowserModule() {
	return await import("@rspack/browser");
}
//#endregion
Object.defineProperty(exports, "compileRspackBrowserProject", {
	enumerable: true,
	get: function() {
		return compileRspackBrowserProject;
	}
});
Object.defineProperty(exports, "rspackBrowser_exports", {
	enumerable: true,
	get: function() {
		return rspackBrowser_exports;
	}
});

//# sourceMappingURL=rspackBrowser-_u7AN6lk.cjs.map