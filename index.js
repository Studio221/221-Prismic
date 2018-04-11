const Prismic = require('prismic.io')
const _ = require('lodash')

const Content = function(CONFIG, errorCallback){

	// Global letiables
	this.documents = {}
	this.readyCallback = null
	this.errorCallback = null
	this.hasData = false

	// Config settings
	CONFIG.lang == undefined ? CONFIG.lang = 'fr-fr' : null;

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
		  return api.query(Prismic.Predicates.at('document.type', 'recipe'), {
        pageSize : 100,
		  	lang : CONFIG.lang
		  })
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

	const _cleanEntry = (selectedValue, selectedDocument, key) => {
		if(selectedValue.type == 'StructuredText'){
			selectedValue.value = selectedDocument.getStructuredText(key).asHtml()
		}
		return selectedValue
	}

	const _cleanDocument = (selectedDocument) => {
		let data = selectedDocument.data
		for(var key in data){
			data[key] = _cleanEntry(data[key], selectedDocument, key)
		}
		return data
	}

	const _cleanDocuments = (selectedDocument) => {
		let data = selectedDocument.data
		for(var key in data){
			data[key] = _cleanEntry(data[key], selectedDocument, key)
		}
		return data
	}

	this.get = (key) => {
		if(key == undefined || key.length < 1){
			var data = {}
			for(var i in this.documents){
				let newData = _cleanDocument(this.documents[i])
				data = _.merge(data, newData)
			}
			return data
		}else{
			const splittedKey = key.split('.')
			const selectedDocument = _.find(this.documents, (o) => {
				return o.type == splittedKey[0]
			})
			if(selectedDocument !== undefined){
				if(splittedKey.length == 1){
					return _cleanDocument(selectedDocument)
				}else{
					let selectedValue = selectedDocument.data[key]
					if(selectedValue !== undefined){
						selectedValue = _cleanEntry(selectedValue, selectedDocument, key)
						return selectedValue
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

// const content = new Content({
// 	baseUrl: 'e-physio',
// 	debug: true,
// 	lang: 'fr-fr'
// })

// content.onError((err) => {
// 	console.log("Something went wrong: ", err)
// })

// content.onReady(() => {
// 	console.log("Got data")
// 	var value = content.get('ter')
// 	console.log(value)
// })

module.exports = Content
