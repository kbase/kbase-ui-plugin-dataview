# Build Tools and Configuration

These are here (for now) because they are used for the embedded iframe. We don't want integration with kbase-ui to see these.

## Building

-From the repo top level:

```zsh
bash scripts/build.sh
```

(your choice of shell - it is a very simple shell script without any special binding to a shell.)

or

```zsh
npm run build
```


> Only use yarn clean if you want to clean out the stuff installed in vendor, as well as the node and bower packages installed in build.

## Iterating in Development

Use

```text
npm run build-dev
```

to update the source in dist with an unminified copy of all source files. This must be done after an initial build.

## Preparing for a new release

This plugin provides itself in the `dist.tgz` archive file, which is built via the temporary top level `dist` directory. In order to ensure that the dist directory is up-to-date with the source, run `yarn install-dist`.

You can iterate on the raw source locally with `kbase-ui` by removing the dist directory, if it exists, and supplying the plugin via the `plugins` option to kbase-ui's `make dev-start` task. kbase-ui will map the internal plugin directory to the `src/plugin` directory within this repo.