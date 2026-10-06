import { SwitchComponent } from 'switch-framework';
import { navigate } from 'switch-framework-router';
import { getSystemTheme, getTheme, useThemesChangesSubscriber } from 'switch-framework/themes';
import 'switch-framework-icons';

export class SwIndexScreen extends SwitchComponent {
  static screenName = 'index';
  static path = '/';
  static title = 'Welcome';
  static tag = 'sw-index-screen';
  static layout = 'stack';

  onMount() {
    this.updateLogo();
    this.addOnDestroy(useThemesChangesSubscriber((theme) => this.updateLogo(theme)));
    this.listener('#go_home', 'click', () => navigate('home'));
  }

  currentTheme(theme) {
    if (theme) return theme;
    if (typeof getTheme === 'function') {
      const t = getTheme();
      if (t) return t;
    }
    if (typeof getSystemTheme === 'function') {
      const t = getSystemTheme();
      if (t) return t;
    }
    return 'light';
  }

  updateLogo(theme) {
    const logoImg = this.select('.logo');
    if (!logoImg) return;
    logoImg.src = this.currentTheme(theme) === 'dark'
      ? '/assets/files/Switch_framework_logo_white.svg'
      : '/assets/files/Switch_framework_logo_purple.svg';
  }

  render() {
    return `
      <div class="wrap">
        <div class="hero">
          <div class="logo-container">
            <img class="logo" src="/assets/files/Switch_framework_logo_round_purple.svg" alt="Switch Framework" />
          </div>
          <h1 class="title">Switch Framework</h1>
          <p class="lede">No-build ESM. Layouts, icons, and navigation are already wired for 0.3.0.</p>
        </div>

        <div class="cards">
          <article class="card" style="--i:0">
            <sw-icon name="cube" size="20"></sw-icon>
            <div>
              <h2>Components</h2>
              <p><code>SwitchComponent</code> + state live in <code>switch-framework</code>. Edit <code>app/index.js</code>.</p>
            </div>
          </article>
          <article class="card" style="--i:1">
            <sw-icon name="route" size="20"></sw-icon>
            <div>
              <h2>Router</h2>
              <p>Import <code>RootLayout</code>, <code>TabLayout</code>, and <code>navigate</code> from <code>switch-framework-router</code>.</p>
            </div>
          </article>
          <article class="card" style="--i:2">
            <sw-icon name="icons" size="20"></sw-icon>
            <div>
              <h2>Icons</h2>
              <p><code>import 'switch-framework-icons'</code> then <code>&lt;sw-icon name="house"&gt;</code>. Classes stay <code>switch_icon_*</code>.</p>
            </div>
          </article>
          <article class="card" style="--i:3">
            <sw-icon name="stethoscope" size="20"></sw-icon>
            <div>
              <h2>Doctor</h2>
              <p>Optional CLI: <code>npx switch-framework-doctor</code> checks versions before the browser does.</p>
            </div>
          </article>
        </div>

        <button id="go_home" class="btn-primary" type="button">Open tabs</button>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        @import url('/switch-framework-icons/style.css');

        :host {
          display: block;
          width: 100%;
          min-height: 100%;
          font-family: var(--font);
          background: var(--page_background);
        }

        * { box-sizing: border-box; font-family: inherit; }

        .wrap {
          max-width: 560px;
          margin: 0 auto;
          min-height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          padding: 48px 20px 32px;
        }

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
          animation: rise 0.7s ease both;
        }

        .logo-container {
          width: 112px;
          height: 112px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3.2s ease-in-out infinite;
        }

        .logo { width: 88px; height: 88px; object-fit: contain; }

        .title {
          margin: 0;
          font-weight: 800;
          font-size: clamp(28px, 6vw, 40px);
          letter-spacing: -0.7px;
          color: var(--main_text, #111);
        }

        .lede {
          margin: 0;
          max-width: 36ch;
          color: var(--sub_text, #666);
          font-weight: 600;
          line-height: 1.45;
        }

        .cards {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 18px;
          background: var(--surface_3, #f4f4f5);
          animation: rise 0.6s ease both;
          animation-delay: calc(0.12s * var(--i, 0) + 0.15s);
        }

        .card sw-icon { color: var(--main_color, #4f46e5); margin-top: 2px; flex-shrink: 0; }

        .card h2 {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 800;
          color: var(--main_text, #111);
        }

        .card p {
          margin: 0;
          font-size: 13px;
          line-height: 1.45;
          color: var(--sub_text, #666);
          font-weight: 600;
        }

        .card code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px;
          background: rgba(0,0,0,0.06);
          padding: 1px 6px;
          border-radius: 999px;
        }

        .btn-primary {
          width: 100%;
          padding: 14px 20px;
          border: none;
          border-radius: 18px;
          background: var(--main_color, #4f46e5);
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          animation: rise 0.6s ease both;
          animation-delay: 0.7s;
          transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .btn-primary:active { transform: scale(0.98); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: none; }
        }
      </style>
    `;
  }
}
