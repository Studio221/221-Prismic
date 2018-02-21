# 221-Prismic

## How to use

Import package :
```
let Content = require('221-prismic')
```

Get data from all documents :
```
const conntent = new Content({
	baseUrl: 'myprismicrepo',
	debug: true
})
```

Error callback :
```
conntent.onError((err) => {
	console.log("Something went wrong: ", err)
})
```

Success callback (got data) :
```
conntent.onReady(() => {
	console.log("Got data")
})
```

Get all keys:
```
var key = conntent.get()
```

Get key of doc:
```
var key = conntent.get('header')
```

Get specific key of doc:
```
var key = conntent.get('header.item1')
```

## Links

Github : https://github.com/Studio221/221-Prismic