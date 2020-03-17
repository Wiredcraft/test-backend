# Developer's Guide

We use Visual Studio Code for developing LoopBack and recommend the same to our
users.

## VSCode setup

Install the following extensions:

- [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Development workflow

### Stepup the test mongo database

```shell
make start-dbs
```

### Fetch the env file

```shell
make fetch-env
```

### Build task

1. Start the build task (Cmd+Shift+B) to run TypeScript compiler in the
   background, watching and recompiling files as you change them. Compilation
   errors will be shown in the VSCode's "PROBLEMS" window.

2. Or you can run the build task in the CMD.

```shell
  npm run build:watch
```

### Stepup the application

1. Execute "Launch Program" from the Command Palette (Cmd+Shift+P) to re-run the
   test suite and lint the code for both programming and style errors. Linting
   errors will be shown in VSCode's "PROBLEMS" window. Failed tests are printed
   to terminal output only.

2. Or just press the F5.
