# Contributing

Thanks for wanting to help improve this n8n community node. This document
covers how to file issues, propose changes, and get set up locally.

## Filing issues

Before opening an issue, please search existing issues (open + closed)
to avoid duplicates.

- **Bug reports:** include the node version
  (`npm ls @bluemarker/n8n-nodes-teamleader-focus`), your n8n version,
  the resource + operation involved, a minimal workflow reproduction
  (or JSON export), and what you expected vs. what happened. Screenshots
  of the API response help.
- **Feature requests:** describe the workflow use case *first*, then
  the proposed field/operation. That helps evaluate whether it belongs
  in the node vs. as a separate integration.

If you hit a **400 error from the Teamleader API**, check the Teamleader
API changelog at [developer.teamleader.eu](https://developer.teamleader.eu/)
first — the spec occasionally introduces new field shapes that the node
doesn't cover yet.

## Development setup

```bash
git clone https://github.com/bluemarker-be/n8n-nodes-teamleader-focus.git
cd n8n-nodes-teamleader-focus
npm install
npm run build
```

### Available scripts

- `npm run build` — compile TypeScript to `dist/` (n8n loads from here)
- `npm run dev` — hot-reload into a local n8n instance for testing changes live
- `npm run format` — prettier-format all `.ts` files
- `npm run lint` — `n8n-node lint` (may currently fail due to an
  upstream config issue; TypeScript build is the correctness gate)

### Testing locally

There are no unit tests. Verification happens by:

1. `npm run dev` starts n8n with the node hot-loaded
2. Configure a Teamleader OAuth2 credential (needs a registered app at
   [Teamleader Marketplace](https://marketplace.teamleader.eu/))
3. Build a workflow that exercises the resource/operation you changed
4. Confirm the API response matches expectations

For shape-level correctness, always compare the request body your change
produces against `api-specs/<latest>.yaml` — every field, enum value,
and nesting shape must match the spec's REQUEST schema (response schemas
sometimes differ).

## Making a change

1. Fork the repo, create a branch (`git checkout -b fix/some-bug`).
2. Keep the diff focused — one thing per PR.
3. If your change affects a resource's fields or shape, add a spec check
   note in the PR: "Verified against `api-specs/1.220.0.yaml` line X".
4. Update `CHANGELOG.md` under `## [Unreleased]` with a short entry.
5. Open a PR against `main` and describe the workflow impact.

## Code style

- Tabs for indentation (matches n8n community conventions).
- Match existing patterns in `nodes/TeamleaderFocus/*Description.ts` —
  cross-resource consistency matters more than local cleverness.
- Flat UI fields (e.g. `customer_type` + `customer_id`) that nest to
  API shapes (`customer: {type, id}`) belong in the handler
  (`TeamleaderFocus.node.ts`), not the description. See existing
  patterns like `buildFilter`, `nestMoneyFields`, and inline
  transforms per resource.
- Enum values in `Description.ts` files must match the API spec
  exactly. Extra options are silently ignored by the API and
  mislead users.

## Syncing the spec

When Teamleader ships a new API version:

```bash
# 1. Fetch the new spec (from developer.teamleader.eu) into api-specs/
# 2. Diff against previous version to find changes
diff api-specs/1.220.0.yaml api-specs/<new>.yaml | less

# 3. Review CHANGELOG entries at developer.teamleader.eu for the window
# 4. Update descriptions/handlers for new/changed fields
# 5. Delete the older spec if the working range is one version at a time
```

Interim spec bumps land as `chore: add api spec vX.Y` commits.
Feature and fix releases (following semver) consolidate spec-conformance
work into per-release changelog entries.

## Reporting security issues

Please do not file security issues publicly. See [SECURITY.md](SECURITY.md).
