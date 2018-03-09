# 221-Prismic

## How to use

Import package :
```
let Content = require('221-prismic')
```

Get data from all documents :
```
const content = new Content({
	baseUrl: 'myprismicrepo',
	debug: true,
	lang: 'fr-fr'
})
```

Error callback :
```
content.onError((err) => {
	console.log("Something went wrong: ", err)
})
```

Success callback (got data) :
```
content.onReady(() => {
	console.log("Got data")
})
```

Get all keys:
```
var key = content.get()
```

Get keys of doc:
```
var key = content.get('header')
```

Get specific keys of doc:
```
var key = content.get('header.item1')
```

## Links

Github : https://github.com/Studio221/221-Prismic