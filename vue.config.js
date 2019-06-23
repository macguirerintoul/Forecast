module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/styles/_variables.scss";`
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
    	builderOptions: {
        productName: "Forecast",
        appId: "com.mrintoul.forecast",
			  win: {
			  	target: [
			  		"nsis",
			  		"portable"
			  	]
			  },
			  mac: {
          category: 'public.app-category.productivity',
          gatekeeperAssess : false,
			  	target: [
			  		"dmg",
			  		"zip"
			  	]
			  }
    	}
    }
  }
};
