# How a Web Page Reaches Your Browser

Typing a web address and pressing Enter feels almost instant. Behind that action, your browser and several internet systems work together to locate a server, request files, and turn the response into a page you can use.

Knowing the main stages makes web development easier to understand—and gives you a better starting point when a page does not load as expected.

## 1. The browser reads the URL

A URL identifies a resource. It can contain a scheme such as `https`, a host name such as `example.com`, an optional port, and a path such as `/about`.

The browser uses these parts to decide how to request the resource and which host it needs to contact. The exact steps can vary depending on the browser, network, and whether information is already cached.

## 2. DNS helps locate the host

People use domain names because they are easier to remember than IP addresses. The Domain Name System (DNS) helps translate a host name, such as `example.com`, into IP address information that allows the browser to reach the right network destination.

The browser or operating system may already have a cached answer. Otherwise, the device uses a DNS resolver to look up the information. DNS does not contain the website's page; it helps the device locate the host that can provide it.

## 3. The browser establishes a connection

After it has the information needed to reach the host, the browser establishes a network connection. The details depend on the protocol being used.

For an HTTPS website, the connection is secured with Transport Layer Security (TLS). During the TLS handshake, the browser and server agree on security settings and establish keys for the connection. TLS protects data in transit through encryption and integrity checks; the server also normally authenticates itself to the browser. The exact connection process differs across HTTP versions and network configurations, so it is not always one identical sequence.

## 4. The browser sends an HTTP request

The browser sends an HTTP request for the resource. A request includes a method—commonly `GET` when retrieving a page—and information such as the path and headers.

The server processes the request and sends an HTTP response. A response contains a status code, headers, and usually a body. The body might contain HTML, another resource, or information explaining why the request could not be fulfilled.

## 5. The browser builds and displays the page

For a typical website, the response includes HTML. As the browser parses that HTML, it can discover other resources such as stylesheets, JavaScript files, fonts, and images, and request them when needed.

The browser then performs several rendering steps:

- **DOM:** HTML is parsed into the Document Object Model, a structured representation of the page.
- **CSSOM:** CSS is processed into the CSS Object Model, which describes how elements should be styled.
- **Render tree:** The browser combines the page structure and applicable styles to determine what should be displayed.
- **Layout:** It calculates the size and position of visible elements.
- **Paint:** It draws the page's visual output to the screen.

JavaScript can also run during loading and change the page's content or behavior. These stages can overlap or repeat as more resources load and the page changes.

## 6. Status codes describe the response

HTTP status codes give a broad indication of what happened to a request. Common examples include:

- **200 OK:** the request succeeded.
- **301 Moved Permanently:** the resource has a permanent new location.
- **302 Found:** the resource is temporarily available at another location.
- **403 Forbidden:** the server refuses access to the requested resource.
- **404 Not Found:** the server cannot find the requested resource.
- **500 Internal Server Error:** the server encountered an unexpected condition.

A status code is useful evidence, but it does not always explain the entire problem. HTTP defines five broad status-code classes: informational, successful, redirection, client error, and server error. Response headers, server logs, and browser developer tools can provide more context.

## Why this matters when building websites

When a page fails to load, identify which part of the process is failing before changing code. A DNS lookup problem is different from a failed connection, an HTTP error, a missing image, or a JavaScript error after the page has loaded.

The browser's Network panel helps you inspect requests, response codes, and loaded resources. The Console can reveal JavaScript errors. Looking at this evidence is usually more reliable than guessing.

## Further reading

- [MDN: How the web works](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works) explains clients and servers, DNS, HTTP, packets, URLs, and response codes.
- [MDN: Transport Layer Security (TLS)](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Transport_Layer_Security) explains how HTTPS protects connections through encryption, integrity, and authentication.
- [MDN: Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path) explains how browsers turn HTML, CSS, and JavaScript into pixels on the screen.
- [MDN: HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) explains the five status-code classes and individual response codes.
