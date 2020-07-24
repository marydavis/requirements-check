# requirements-check

A GitHub action that checks that all non-optional Requirements in a list have been checked.

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
