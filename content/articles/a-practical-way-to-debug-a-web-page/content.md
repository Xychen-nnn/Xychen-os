# A Practical Way to Debug a Web Page

When a website behaves unexpectedly, changing several files at once can make the problem harder to understand. A more reliable approach is to reproduce the issue, collect evidence, isolate a likely cause, make a focused change, and test again.

This workflow is useful for common HTML, CSS, JavaScript, and network problems.

## 1. Describe the problem

Write down what you expected and what actually happened. Include the page, the action that triggers the issue, the browser, and whether the problem happens every time.

“Button is broken” is vague. “On the Explore page, selecting a category changes the URL but the article list stays the same” gives you a specific behavior to investigate.

## 2. Reproduce the issue

Repeat the same steps and note whether the result is consistent. If it happens only sometimes, check whether screen size, network conditions, browser state, or selected settings make a difference.

A reliable reproduction gives you a way to compare behavior before and after a change.

## 3. Check the Console

Open the browser's developer tools and inspect the Console. JavaScript errors can identify a problem such as a missing variable, an invalid operation, or a failed script.

Read the full message and note the file and line number when available. An early error can cause several later errors, so start with the first relevant message rather than trying to fix every line at once.

## 4. Inspect Network requests

Open the Network panel, reload the page, and reproduce the issue. Look for failed requests, unexpected status codes, incorrect request URLs, and responses that do not contain the data the page expects.

For example:
- A missing image may point to an incorrect file path or filename.
- An API request returning an error may explain why a data-driven section is empty.
- A successful request with unexpected response data may indicate a mismatch between the API and the page code.

A status code alone may not explain the cause. Inspect the request, response headers, and response body where appropriate.

## 5. Inspect the page structure and styles

For a layout problem, use the Elements or Inspector panel. Select the affected element and examine its HTML, computed CSS, dimensions, and parent elements.

You can temporarily toggle a CSS declaration in developer tools to test whether it causes the problem. These edits are temporary and do not change the source file.

## 6. Form a hypothesis and make one focused change

Use the evidence you collected to identify a likely cause. Change the smallest relevant part of the code, then repeat the same steps that originally reproduced the issue.

Avoid unrelated refactoring during a bug fix. Keeping the change focused makes it easier to understand, review, and reverse if necessary.

## 7. Verify the fix and check for regressions

Test the original scenario again. Then check nearby behavior that could be affected, such as another category, a smaller screen, keyboard navigation, or a different page using the same component.

Also check the Console and Network panel for new errors. A fix is not complete just because one screenshot looks correct; it should work across the relevant states and not break related functionality.

## A useful debugging habit

Treat console messages, network responses, and computed styles as evidence. Debugging is a process of narrowing down causes—not guessing which line of code looks suspicious.

## Further reading

- [MDN — What are browser developer tools?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools)
- [MDN — Your first website](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website)
