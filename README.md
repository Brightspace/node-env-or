# node-env-or

[![Build status][https://github.com/Brightspace/node-env-or/actions/workflows/build.yml/badge.svg?query=+branch%3Amain]][https://github.com/Brightspace/node-env-or/actions/workflows/build.yml?query=+branch%3Amain]

Interface for process.env variables that allows setting a default value if none is set

## Usage

```js
const envOr = require('env-or');

const NO_DEFAULT = envOr('NO_DEFAULT');
const WITH_DEFAULT = envOr('WITH_DEFAULT', 'default_value');
const REQUIRED_IN_PROD = envOr.requireInProd('REQUIRED_IN_PROD');
```

### API

#### `envOr(String var[, String|Number|Boolean default])`

Returns `process.env.var`, casted to the same type as `default` (if provided).

If `default` is not provided, the String value from `process.env` will be returned (which may be `undefined`).

If `default` is provided, then it will be returned if _the variable is not available_ **or** _the type conversion is not possible_.

---

#### `envOr.requireInProd(String var[, String|Number|Boolean default])`

If `NODE_ENV` is not set to `production`, acts the same as `envOr`.

If `NODE_ENV=production` and `process.env.var` is not defined, then an error will be thrown.

#### `envOr.on('access', Function listener)`

A listener can be set for the `'access'` event to be notified of the results of environment accesses.

```js
envOr.on('access', console.log);
envOr('MY_FEATURE_ENABLED', true);

EnvironmentAccessedEvent {
  name: 'MY_FEATURE_ENABLED',
  value: true,
  present: false,
  required: false
}
```

#### `envOr.removeListener('access', Function listener)`

Remove a listener for environment accesses that was added with `on`.

## Testing

```js
npm test
```

## Contributing

1. **Fork** the repository. Committing directly against this repository is highly discouraged.

2. Make your modifications in a branch, updating and writing new tests as necessary in the `test` directory.

3. Ensure that all tests pass with `npm test`

4. `rebase` your changes against master. *Do not merge*.

5. Submit a pull request to this repository. Wait for tests to run and someone to chime in.

## Code Style

This repository is configured with [EditorConfig][EditorConfig] and
[ESLint][ESLint]. See the [docs.dev code style article][code style] for
information on installing editor extensions.

[EditorConfig]: http://editorconfig.org/
[ESLint]: http://eslint.org/
[code style]: http://docs.dev.d2l/index.php/JavaScript_Code_Style_(Personal_Learning)
