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
			  win: {
			  	target: [
			  		"nsis",
			  		"portable"
			  	]
			  },
			  mac: {
			  	target: [
			  		"dmg",
			  		"zip"
			  	]
			  }
    	}
    }
  }
};
