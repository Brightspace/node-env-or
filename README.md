# node-env-or

[![Build Status](https://magnum.travis-ci.com/Brightspace/node-env-or.svg?token=Cab9cPiYKusHs1TWpuUv)](https://magnum.travis-ci.com/Brightspace/node-env-or)

Interface for process.env variables that allows setting a default value if none is set

## Usage

```js
const envOr = require('@d2l/env-or');

const MY_VAR = envOr('MY_VAR', 'default_value');
```

## Contributing

1. **Fork** the repository. Committing directly against this repository is highly discouraged.

2. Make your modifications in a branch, updating and writing new tests as necessary in the `test` directory.

3. Ensure that all tests pass with `npm test`

4. `rebase` your changes against master. *Do not merge*.

5. Submit a pull request to this repository. Wait for tests to run and someone to chime in.

## Code Style

This repository is configured with [EditorConfig][EditorConfig], [jscs][jscs]
and [JSHint][JSHint] rules. See the [docs.dev code style article][code style]
for information on installing editor extensions.

[EditorConfig]: http://editorconfig.org/
[jscs]: http://jscs.info/
[JSHint]: http://jshint.com/
[code style]: http://docs.dev.d2l/index.php/JavaScript_Code_Style_(Personal_Learning)
