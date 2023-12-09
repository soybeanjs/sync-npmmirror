# syncmirror

## Usage

### use npx

#### sync single package

```bash
npx syncmirror -s @soybeanjs/cli
```
#### sync multi packages

```bash
npx syncmirror -s @soybeanjs/cli,@soybeanjs/eslint-config
```

### use api

```ts
import { sync } from 'syncmirror'

// 1. sync single package
// if not provide the name, it will use the package.json name
sync();
// sync the package with name @soybeanjs/cli
sync('@soybeanjs/cli');

// 2. sync multi packages
sync(['@soybeanjs/cli', '@soybeanjs/eslint-config']);

// 3. with options
sync('@soybeanjs/cli', {
  cwd: process.cwd(),
  log: true,
  timeout: 1000 * 60,
});
```

### help

```bash
npx syncmirror -h
```
