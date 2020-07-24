import * as core from "@actions/core";
import * as github from "@actions/github";
import run from "../src/main";
import { WebhookPayload } from "@actions/github/lib/interfaces";

beforeAll(() => {
  jest.spyOn(core, "info").mockImplementation(jest.fn());
  jest.spyOn(core, "setFailed").mockImplementation(jest.fn());
});

beforeEach(() => {
  jest.resetModules();
  github.context.payload = {
    pull_request: {
      number: 8675309,
      body: "test",
    },
  } as WebhookPayload;
});
describe("validate checks Requirement lists", () => {
  it("does nothing if no PR body", async () => {
    github.context.payload = {
      pull_request: {
        number: 8675309,
        body: undefined,
      },
    };
    const infoMock = jest.spyOn(core, "info");
    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(infoMock).not.toHaveBeenCalled();
    expect(setFailedMock).not.toHaveBeenCalled();
  });
  it("passes if no checkboxes", async () => {
    const infoMock = jest.spyOn(core, "info");
    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(infoMock).toHaveBeenCalledWith("All Requirements have been checked");
  });
  it("passes if all checkboxes are checked", async () => {
    github.context.payload = {
      pull_request: {
        number: 8675309,
        body: "- [x] checked - [x] another checked",
      },
    };
    const infoMock = jest.spyOn(core, "info");
    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(infoMock).toHaveBeenCalledWith("All Requirements have been checked");
  });
  it("passes if only optional checkboxes are unchecked", async () => {
    github.context.payload = {
      pull_request: {
        number: 8675309,
        body: "- [x] checked - [ ] (optional) another checked",
      },
    };
    const infoMock = jest.spyOn(core, "info");
    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(setFailedMock).not.toHaveBeenCalled();
    expect(infoMock).toHaveBeenCalledWith("All Requirements have been checked");
  });
  it("fails if any required checkboxes are unchecked", async () => {
    github.context.payload = {
      pull_request: {
        number: 8675309,
        body:
          "- [x] checked - [ ] (optional) another checked - [ ] should be checked",
      },
    };
    const infoMock = jest.spyOn(core, "info");
    const setFailedMock = jest.spyOn(core, "setFailed");
    await run();
    expect(infoMock).not.toHaveBeenCalled();
    expect(setFailedMock).toHaveBeenCalledWith(
      "Found requirements unchecked: \r\n - [ ] should be checked"
    );
  });
});
