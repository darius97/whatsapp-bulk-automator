# WhatsApp Bulk Automator

Version 1.0.0 is a browser extension with a React dashboard for importing contacts from spreadsheets, composing message templates, and sending through a connected WhatsApp Web session with configurable randomized delays.

This is an unofficial project and is not affiliated with WhatsApp. Use it only to contact people who have explicitly opted in. Follow WhatsApp's terms, privacy requirements, and applicable laws; automated or bulk messaging may result in account restrictions. The project does not use the official WhatsApp Business Platform API.

## Run locally

Prerequisites: Node.js and npm.

```sh
npm install
npm run dev
```

To build the browser extension:

```sh
npm run build
```

In Chrome, open `chrome://extensions`, enable Developer mode, choose **Load unpacked**, and select the generated `dist` folder. Then open WhatsApp Web and use the extension.

## Data and permissions

The extension requests access to WhatsApp Web and browser tabs/storage. Review the manifests and source before installing. Do not include real contact data in public test files or issue reports.

## License

Apache-2.0. See [LICENSE](LICENSE).
