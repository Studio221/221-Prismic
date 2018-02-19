```
const contentFr = new Content({
	baseUrl: 'ephysiocom',
	debug: true
})
```

```
contentFr.onError((err) => {
	console.log("Something went wrong: ", err)
})
```

```
contentFr.onReady(() => {
	var key = contentFr.get('header.item_1')
})
```