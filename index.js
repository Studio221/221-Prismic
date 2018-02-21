const Prismic = require('prismic.io')
const _ = require('lodash')

const Content = function(CONFIG, errorCallback){

	// Global letiables
	this.documents = {}
	this.readyCallback = null
	this.errorCallback = null
	this.hasData = false

	// Internal logic
	const _d = (message) => {
		if(CONFIG.debug == true){
			console.log(message)
		}
	}

	this.sendReadyCallback = () => {
		this.hasData = true
		this.readyCallback()
	}

	this.getDataFromPrismic = () => {
		Prismic.api('https://'+CONFIG.baseUrl+'.prismic.io/api').then(function(api) {
		  return api.query("")
		}).then((response) => {
			_d('Got '+response.results.length+' documents')
			if(response.results === undefined || response.results.length === 0){
				this.errorCallback('no_data')
			}else{
				this.documents = response.results
				this.sendReadyCallback()
			}
		}, this.errorCallback)
	}

	// Startup
	this.getDataFromPrismic()

	// External logic
	this.onReady = (readyCallback) => {
		this.readyCallback = readyCallback
		if(this.hasData){
			this.sendReadyCallback()
		}
	}

	this.onError = (errorCallback) => {
		this.errorCallback = errorCallback
	}

	this.get = (key) => {
		if(key == undefined || key.length < 1){
			var data = {};
			for(var i in this.documents){
				data = _.merge(data, this.documents[i].data);
			}
			return data;
		}else{
			const splittedKey = key.split('.')
			const selectedDocument = _.find(this.documents, (o) => {
				return o.type == splittedKey[0]
			})
			if(selectedDocument !== undefined){
				if(splittedKey.length == 1){
					return selectedDocument.data;
				}else{
					const selectedValue = selectedDocument.rawJSON[splittedKey[0]][splittedKey[1]]
					if(selectedValue !== undefined){
						return selectedValue;
					}else{
						return 'no_key'
					}
				}
			}else{
				return 'no_document'
			}
		}
	}

	// Return
	return {
		onReady: this.onReady,
		onError: this.onError,
		get: this.get
	}

}

module.exports = Content;