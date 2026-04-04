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

## Component Example

Here's a simple counter component that increments when clicked:

```javascript
// components/Counter.js
import { SwitchComponent, createState, updateState, getState } from 'switch-framework';

// Create state outside the component (or in a static block)
createState('counter', 0);

export class Counter extends SwitchComponent {
  static tag = 'sw-counter';
  
  // Subscribe to state changes for auto re-render
  static { this.useState('counter'); }

  onMount() {
    // Use delegated listener for click events
    this.listener('#inc', 'click', () => {
      updateState('counter', (n) => (n ?? 0) + 1);
    });
  }

  render() {
    const count = getState('counter') ?? 0;
    return `
      <div class="counter-wrap">
        <button id="inc" class="counter-btn">Count: ${count}</button>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        .counter-wrap { display: flex; justify-content: center; padding: 20px; }
        .counter-btn { 
          padding: 12px 24px; 
          font-size: 16px; 
          font-weight: 600;
          background: var(--main_color, #6366f1);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Montserrat', sans-serif;
        }
        .counter-btn:hover { opacity: 0.9; }
        .counter-btn:active { transform: scale(0.98); }
      </style>
    `;
  }
}
```

Then use it in any screen:

```javascript
// app/index.js
import { Counter } from '../components/Counter.js';

// In your render() method:
return `<sw-counter></sw-counter>`;
```

Made by Switcherfaiz
