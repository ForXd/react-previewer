import { t as compileRspackBrowserProject } from "./rspackBrowser-C4gL5OWV.js";
//#region src/lib/ReactPreview/preview/compilers/rspackBrowser.worker.ts
self.addEventListener("message", (event) => {
	if (event.data.type !== "compile") return;
	compile(event.data);
});
async function compile(request) {
	try {
		const result = await compileRspackBrowserProject(request.input, {
			...request.options,
			useWorker: false
		});
		post({
			type: "compiled",
			id: request.id,
			result
		});
	} catch (error) {
		post({
			type: "error",
			id: request.id,
			message: error instanceof Error ? error.message : String(error),
			stack: error instanceof Error ? error.stack : void 0
		});
	}
}
function post(message) {
	self.postMessage(message);
}
//#endregion

//# sourceMappingURL=rspack-browser-worker.js.map