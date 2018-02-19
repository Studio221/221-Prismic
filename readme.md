# How to use

Get data from all documents :
```
const contentFr = new Content({
	baseUrl: 'ephysiocom',
	debug: true
})
```

Error callback :
```
contentFr.onError((err) => {
	console.log("Something went wrong: ", err)
})
```

Success callback (got data) :
```
contentFr.onReady(() => {
	console.log("Got data")
})
```

Get key :
```
var key = contentFr.get('header.item_1')
```