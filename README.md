# storm-watcher

# Install
Go download [node](https://nodejs.org) first.
```
$ git clone https://github.com/kuu/storm-watcher.git
$ cd storm-watcher
$ npm install
```

# Configure

```
$ mkdir config
$ vi config/default.json
{
  "storm": {
    "server": "http://0.0.0.0:8000"
  },
  "flex": {
    "server": "https://unixon.apac.ooyala-flex.com",
    "workflow": 118723,
    "workspace": 116919,
    "user": "Your User ID",
    "pass": "Your Password"
  }
}
```

# Run / Stop

```
$ npm start
$ npm stop
```

# Enable logs

```
$ export DEBUG=storm-watcher
$ npm start
$ tail -f error.log
```
