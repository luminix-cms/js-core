# Developing `@luminix/core`

`src/` is the whole product; everything else here is tests, documentation or packaging.

## Two audiences, two trees

| Tree | Written for | Language | Ships |
|---|---|---|---|
| `agents/AGENTS.md` + `agents/references/` | an agent **consuming** the package in an app | English | yes, as `dist/AGENTS.md` + `dist/references/` |
| `AGENTS.md` (this file), `CLAUDE.md` | an agent **developing** the package | English | no |
| `README.md` | a human landing on npm | Portuguese | yes |
| `docs/` | a human reading at tutorial length | Portuguese | no |

`.npmignore` decides what ships, and `postbuild` copies `agents/.` into `dist/`. `npm pack
--dry-run` must list `dist/AGENTS.md` and `dist/references/*.md`, and never this file, `CLAUDE.md`,
`agents/`, `src/` or `tests/`.

A consuming app reads the guide at `node_modules/@luminix/core/dist/AGENTS.md`, so a fix here
reaches it only through a published version.

## Writing `agents/`

- update it when a change is observable from a consuming app: a method, an argument, a query
  parameter, a reducer name, an event, an exception. Internal refactors leave it alone
- an API described there that `src/` does not have is a bug in `agents/`
- it describes the behaviour of this commit. What an older release did belongs to the release notes
- every sentence serves the reader's current task and says something the agent could not get from a
  glance at the repository
- describe the package, not the documentation system: no prose about where the guide ships from,
  how skills are found, or what else exists in the ecosystem. Name the neighbouring package when
  the answer lives outside this one

## Working here

```bash
npm test              # jest
npm run lint          # eslint over src and tests
npm run ci            # lint + test — what CI does not run for you, see Git
npm run build         # tsc typecheck, then vite lib build -> dist/core.js, types/
```

- jest, not vitest, despite the vite build: `jsdom` environment, `ts-jest` for `.ts`, `babel-jest`
  for `.js`. `nanoevents` and `lodash-es` are ESM-only, which is why `transformIgnorePatterns`
  un-ignores them — a new ESM dependency needs the same entry or its import blows up in tests
- `tsconfig.json` sets `noEmit` and excludes `tests/`: `tsc` in the build is a typecheck of `src/`
  alone, and `vite-plugin-dts` is what actually writes `types/`. Test types are never checked
- the build emits a single ES bundle (`dist/core.js`) and declarations in `types/`, both gitignored.
  `@luminix/support` is a peer dependency and stays external — nothing from it is bundled, so a
  symbol imported from it must exist in the version the app installs
- tests boot a real `Application`: `App.withConfiguration(makeConfig()).create()` over the schema in
  `tests/config/manifest.json`, then `App.down()`. `create()` on an application that already has
  services warns and returns without booting, so a missing `App.down()` silently leaves the previous
  container in place for the next test
- `tests/__mocks__/httpservice.ts` swaps the `http` singleton for jest mocks; register its provider
  instead of stubbing axios
- `package.json` carries an empty `version` on purpose — CI stamps it at publish time

## Git

- `v1.x` is the release branch; work on `feat/`/`fix/` branches and merge into it
- every push to `v1.x` runs `.github/workflows/latest.yml`: `npm run test`, `npm run build`,
  `npm publish` under the version computed from the commit subjects, then a GitHub Release. Lint is
  not in that workflow — run `npm run ci` before merging
- semver comes from the commit subject: `(MAJOR)` -> major, `(MINOR)` -> minor, absence -> patch
- commit messages and branch names in português
