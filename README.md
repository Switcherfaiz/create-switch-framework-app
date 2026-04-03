# create-switch-framework-app

Status: Under maintenance. Documentation is not ready yet.

create-switch-framework-app is a CLI for initializing apps that use Switch Framework tools.

It can scaffold projects for:

- Web app development
- Electron desktop app development

## Usage

```bash
npx create-switch-framework-app my-app
```

Or install globally:

```bash
npm i -g create-switch-framework-app
create-switch-framework-app my-app
```

## Switch Framework Docs (run locally)
To view the Switch Framework documentation website on your PC:

1. Clone the docs repo:
```bash
git clone https://github.com/Switcherfaiz/switch-framework-docs
```

2. Install dependencies:
```bash
cd switch-framework-docs
npm install
```

3. Start the dev server:
```bash
npm run dev
```

4. Open in your browser:
```text
http://localhost:3000
```

If the port is different, check `switch-framework-docs/package.json` (`switchFramework.port`).

Made by Switcherfaiz
