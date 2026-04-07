import { SwitchComponent } from 'switch-framework';
import { navigate, goBack } from 'switch-framework/router';

export class SwUserNotFoundScreen extends SwitchComponent {
  static screenName = '+not-found';
  static path = '/+not-found';
  static title = 'Not Found';
  static tag = 'sw-user-not-found-screen';
  static layout = 'stack';

  static get observedAttributes() {
    return ['path'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'path' && oldVal !== newVal) {
      this._renderToShadow();
    }
  }

  connected() {
    this.shadowRoot.getElementById('home')?.addEventListener('click', () => {
      navigate('home');
    });

    this.shadowRoot.getElementById('back')?.addEventListener('click', () => {
      goBack();
    });
  }

  render() {
    const path = this.getAttribute('path') || (typeof window !== 'undefined' ? window.location.pathname : '') || '';

    return `
      <div class="wrap">
        <div class="card">
          <div class="code">404</div>
          <div class="h">This screen does not exist</div>
          <div class="p">No screen is registered for:</div>
          <div class="path">${path}</div>

          <div class="row">
            <button class="btn" id="home">Go to Home</button>
            <button class="btn secondary" id="back">Go Back</button>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          min-height: 100dvh;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        * {
          box-sizing: border-box;
          font-family: inherit;
        }

        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .card {
          width: min(680px, 100%);
          background: transparent;
          border: none;
          border-radius: 18px;
          padding: 18px;
          box-shadow: none;
        }

        .code {
          font-weight: 1000;
          font-size: 44px;
          line-height: 1;
          color: var(--main_text, #000);
        }

        .h {
          margin-top: 10px;
          font-weight: 1000;
          font-size: 20px;
          color: var(--main_text, #000);
        }

        .p {
          margin-top: 6px;
          color: var(--sub_text, #666);
          font-weight: 800;
        }

        .path {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 14px;
          background: var(--surface_2, #f5f5f5);
          border: 1px solid var(--border_light, #e5e5e5);
          font-weight: 900;
          color: var(--main_text, #000);
          word-break: break-word;
        }

        .row {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn {
          border: none;
          background: linear-gradient(135deg, #0091ff 0%, #0073e6 100%);
          color: #fff;
          font-weight: 1000;
          border-radius: 999px;
          padding: 10px 14px;
          cursor: pointer;
        }

        .btn:hover {
          opacity: 0.9;
        }

        .btn.secondary {
          background: var(--surface_2, #f5f5f5);
          color: var(--main_text, #000);
        }

        .btn.secondary:hover {
          background: var(--surface_3, #eee);
        }
      </style>
    `;
  }
}

export default SwUserNotFoundScreen;
