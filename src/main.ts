import * as core from "@actions/core";
import * as github from "@actions/github";

export default async function run(): Promise<void> {
  try {
    const body = github.context.payload.pull_request?.body;
    if (body) {
      const reqIsNotChecked = /(-\s\[\s\]\s(?!\(optional\)))/g.test(body);
      if (reqIsNotChecked) {
        const notCheckedArray = body.match(/(-\s\[\s\]\s(?!\(optional\)).+)/g);
        const notCheckedList = notCheckedArray?.join(" \r\n ");
        core.setFailed(`Found requirements unchecked: \r\n ${notCheckedList}`);
      } else {
        core.info("All Requirements have been checked");
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
