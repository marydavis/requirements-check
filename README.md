# requirements-check

A GitHub action that checks that all non-optional Requirements in a list have been checked.

This action checks the PR Description for a list and will required they are checked unless `(optional)` is added after the checkbox.

Example:

- [x] Rebase master
- [x] Bump version # (major.minor.patch) in version file
- [ ] (optional) Approved by UX team



## Workflow

Setup a Workflow on `pull_request`

By default, a workflow only runs when a pull_request's activity type is opened, synchronize, or reopened.

You will need to add the type `edited` to run the check when a list item is checked/unchecked

Example:

```
on:
  pull_request:
    types: [edited, opened, reopened, synchronize]
    branches: [ master ]
```

## Action

Add to your workfow:

```
name: Requirements Check
uses: marydavis/requirements-check@v1
```

## Example Workflow

```
name: PR Check
on:
  pull_request:
    types: [ opened, synchronize, reopened, edited ]

jobs:
  pr_ready_check:
    runs-on: ubuntu-latest
    name: PR Ready Check
    steps:
    - uses: actions/checkout@v2

    - name: Check Format
    - uses: npm run format-check

    - name: Requirements Check
    - uses: marydavis/requirements-check@v1
```

## Protect branch

Prevent PRs from being merged to a protected branch by going to:
Settings => Branches => Branch protection rules (Add Rule) => Enter Branch Name => Check `Require status checks to pass before merging` => Select the status check you created

*Note: Status won't show until it has run at least once*
