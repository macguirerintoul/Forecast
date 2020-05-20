const { nativeTheme } = require("electron");
console.log("preload");
const setOSTheme = () => {
	let theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
	console.log("Setting OS theme: ", theme);
	window.localStorage.os_theme = theme;

	//
	// Defined in index.html, so undefined when launching the app.
	// Will be defined for `systemPreferences.subscribeNotification` callback.
	//
	if ("__setTheme" in window) {
		window.__setTheme();
	}
};

nativeTheme.on("updated", () => {
	console.log("native theme updated");
	setOSTheme();
});
