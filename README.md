# tryhard

fetches a page and monitors it for changes. when a change is detected, sends a push notification to the PushBullet account associated with the API key provided.

## usage

install dependencies:

```
$ npm i
```

write `auth.pii.js` as:

```
module.exports = {
    token: 'YOUR_PUSHBULLET_API_TOKEN'
};
```

use the script as:

```
$ node tryhard.mjs https://url.to/monitor '.elementSelectorToMonitor:nth-of-type(3)'
```

## license

MIT license; see LICENSE.md.
