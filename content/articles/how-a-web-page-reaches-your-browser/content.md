# How a Web Page Reaches Your Browser

Typing a URL and pressing Enter feels instant. Behind that small action, several systems cooperate: the browser, the network, name-resolution services, web servers, and the code that turns a response into a page.

Understanding the sequence makes web development less mysterious and helps when something goes wrong.

## 1. The browser interprets the address

A URL identifies a resource. Its parts can specify a scheme such as `https`, a host name, an optional port, and a path. The browser uses these details to determine where and how to request the resource.

## 2. DNS helps find the server

People use domain names because they are easier to remember than numeric network addresses. The Domain Name System (DNS) helps resolve a host name to the network address needed to contact the destination.

DNS is not the website itself. It is one of the systems that helps the browser find where the website is hosted.

## 3. The browser sends an HTTP request

After it has the information needed to connect, the browser sends an HTTP request. A request includes a method—commonly `GET` when retrieving a page—and a path, along with headers that provide additional context.

The server receives the request and decides how to respond. The response includes a status code, headers, and usually a body containing the requested resource or an explanation of why it could not be provided.

## 4. The response is turned into a page

For a typical website, the browser receives HTML and may discover additional files such as CSS, JavaScript, fonts, and images. It requests those resources and uses them to construct and display the page.

HTML describes structure, CSS controls presentation, and JavaScript can add behavior. These parts work together, but they have different responsibilities.

## 5. Status codes help explain the result

A few familiar HTTP status codes are:

- **200 OK:** the request succeeded.
- **301 or 302:** the resource has been redirected.
- **403 Forbidden:** the server understood the request but refuses access.
- **404 Not Found:** the requested resource could not be found.
- **500 Internal Server Error:** the server encountered an unexpected problem.

A status code is a clue, not always the complete explanation. Response headers, server logs, and browser developer tools can provide more context.

## Why this matters when building websites

When a page fails to load, identify which stage is failing before changing code. A DNS problem is different from a missing file, and a server error is different from a JavaScript error after the page has loaded.

The useful habit is to inspect the request and response rather than guessing. The browser's Network panel is often the best place to begin.

## Further reading

The MDN guide linked in the sources explains clients and servers, DNS, TCP/IP, HTTP requests, and common response codes in more detail.
