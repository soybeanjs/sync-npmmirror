# sync-npmmirror

## Usage

### use npx

#### sync single package

```bash
npx sync-npmmirror -s @soybeanjs/cli
```
#### sync multi packages

```bash
npx sync-npmmirror -s @soybeanjs/cli,@soybeanjs/eslint-config
```

### use api

```ts
import { sync } from 'sync-npmmirror'

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
npx sync-npmmirror -h
```
