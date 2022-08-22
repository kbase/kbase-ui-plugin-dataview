# Title

This `kbase-ui` plugin implements a viewer, or "landing page", for a subset of KBase [Workspace](https://github.com/kbase/workspace_deluxe) objects.

## Install

For ordinary usage, this plugin is included in [KBase UI](https://github.com/kbase/kbase-ui) via it's `plugin.yml` configuration file. There is no way to run this plugin independently.

For developer use, see [the developer document](docs/development.md).

## Usage

When installed, this plugin is invoked with the following url forms:

- `https://ENV.kbase.us#dataview/WORKSPACE_ID/OBJECT_ID[/OBJECT_VERSION]`

where
- `ENV` - is a KBase deployment environment, typically either `ci`, `next`, `appdev`, or `prod`.
- `WORKSPACE_ID` is a [Workspace identifier](https://github.com/kbase/workspace_deluxe/blob/0964b09a95f9c617547d40c413d57598cd12d04c/workspace.spec#L22)
- `OBJECT_ID` is a [Workspace object identifier](https://github.com/kbase/workspace_deluxe/blob/0964b09a95f9c617547d40c413d57598cd12d04c/workspace.spec#L148)
- `OBJECT_VERSION` is a [Workspace object version](https://github.com/kbase/workspace_deluxe/blob/0964b09a95f9c617547d40c413d57598cd12d04c/workspace.spec#L157)

The object version is optional; if omitted, the most recent version of the object will be displayed.

This url may be used either with or without an `Authorization` header. 

## Development

```
cd tools/node
DIR=`pwd`/../.. docker compose run --rm node sh
npm install
npm run build
npm npm run build-dev
npm run watch

```

## Contributing

PRs accepted.

## License

See license in [LICENSE.md](LICENSE.md).