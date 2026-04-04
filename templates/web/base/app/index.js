import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework/router';

export class SwIndexScreen extends SwitchComponent {
  static screenName = 'index';
  static path = '/';
  static title = 'Welcome';
  static tag = 'sw-index-screen';
  static layout = 'stack';

  connected() {
    this.shadowRoot.querySelector('#go_home')?.addEventListener('click', () => {
      navigate('home');
    });
  }

  render() {
    return `
      <div class="wrap">
        <div class="spacer-top"></div>

        <div class="hero">
          <div class="logo-container">
            <img class="logo" src="/assets/files/Switch_framework_logo_round_purple.svg" alt="Switch Framework" />
          </div>
          <div class="title">Introducing<br>Switch Framework</div>
        </div>

        <div class="spacer-middle"></div>

        <div class="section">
          <div class="label">GET STARTED</div>
          
          <div class="card">
            <div class="row">
              <div class="l">Try editing</div>
              <div class="r">src/app/index.js</div>
            </div>
            <div class="row">
              <div class="l">Dev tools</div>
              <div class="r">cmd+d</div>
            </div>
            <div class="row">
              <div class="l">Fresh start</div>
              <div class="r">npm reset project</div>
            </div>
          </div>
        </div>

        <button id="go_home" class="btn-primary">Go To Tabs</button>

        <div class="spacer-bottom"></div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100vh;
          padding: 0;
          font-family: 'Montserrat', sans-serif;
          background: var(--bg, #fff);
        }

        * {
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
        }

        .wrap {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 16px;
        }

        .spacer-top {
          flex: 0.5;
          min-height: 20px;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          text-align: center;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border-radius: 40px;
          box-shadow: 0 25px 50px rgba(79, 70, 229, 0.35);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .logo {
          width: 100px;
          height: 100px;
          object-fit: contain;
        }

        .title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          color: var(--main_text, #000);
          font-size: 42px;
          line-height: 1.05;
          letter-spacing: -0.8px;
        }

        .spacer-middle {
          flex: 1;
          min-height: 30px;
        }

        .section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
        }

        .label {
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 1.2px;
          color: var(--sub_text, #666);
          text-transform: uppercase;
          padding: 0 12px;
        }

        .card {
          width: 100%;
          background: #f5f5f5;
          border-radius: 20px;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        :root[data-theme="dark"] .card {
          background: rgba(255, 255, 255, 0.08);
        }

        .row {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          transition: background 0.2s ease;
        }

        .row:active {
          background: rgba(0, 0, 0, 0.08);
        }

        :root[data-theme="dark"] .row {
          background: rgba(255, 255, 255, 0.06);
        }

        :root[data-theme="dark"] .row:active {
          background: rgba(255, 255, 255, 0.12);
        }

        .l {
          font-weight: 600;
          color: var(--main_text, #000);
          font-size: 14px;
        }

        .r {
          font-weight: 500;
          color: var(--sub_text, #666);
          background: rgba(0, 0, 0, 0.05);
          padding: 6px 12px;
          border-radius: 999px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 11px;
          white-space: nowrap;
        }

        :root[data-theme="dark"] .r {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-primary {
          width: 100%;
          max-width: 400px;
          padding: 14px 20px;
          margin-top: 20px;
          margin-bottom: 0;
          background: linear-gradient(135deg, #0091ff 0%, #0073e6 100%);
          color: white;
          border: none;
          border-radius: 18px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 20px rgba(0, 145, 255, 0.25);
        }

        .btn-primary:active {
          transform: scale(0.97);
          box-shadow: 0 4px 12px rgba(0, 145, 255, 0.2);
        }

        :root[data-theme="dark"] .btn-primary {
          box-shadow: 0 8px 20px rgba(0, 145, 255, 0.3);
        }

        .spacer-bottom {
          flex: 1;
          min-height: 20px;
        }

        @media (max-width: 600px) {
          .title {
            font-size: 32px;
          }
        }
      </style>
    `;
  }
}
