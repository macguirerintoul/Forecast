import Vue from "vue";
import Notifications from "vue-notification";
import App from "./App.vue";

Vue.use(Notifications);

Vue.config.productionTip = false;

new Vue({
	render: (h) => h(App),
}).$mount("#app");
