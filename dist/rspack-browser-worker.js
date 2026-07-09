import { t as e } from "./rspackBrowser-CQRtaM8Y.js";
//#region src/lib/ReactPreview/preview/compilers/rspackBrowser.worker.ts
self.addEventListener("message", (e) => {
	e.data.type === "compile" && t(e.data);
});
async function t(t) {
	try {
		let r = await e(t.input, {
			...t.options,
			useWorker: !1
		});
		n({
			type: "compiled",
			id: t.id,
			result: r
		});
	} catch (e) {
		n({
			type: "error",
			id: t.id,
			message: e instanceof Error ? e.message : String(e),
			stack: e instanceof Error ? e.stack : void 0
		});
	}
}
function n(e) {
	self.postMessage(e);
}
//#endregion

//# sourceMappingURL=rspack-browser-worker.js.map