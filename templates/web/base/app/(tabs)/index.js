import { SwitchComponent } from 'switch-framework';
import 'switch-framework-icons';

export class SwHomeScreen extends SwitchComponent {
  static screenName = 'home';
  static path = '/home';
  static title = 'Home';
  static tag = 'sw-home-screen';
  static layout = 'tabs';

  render() {
    return `
      <div class="wrap">
        <div class="hero">
          <div class="orb">
            <sw-icon name="house" size="36"></sw-icon>
          </div>
          <h1>You are in a tab</h1>
          <p>This screen is a child of <code>TabLayout</code> from <code>switch-framework-router</code>. The bar below is <code>components/SwTabBar.js</code>.</p>
        </div>

        <div class="section">
          <div class="label">Edit these files</div>
          <div class="list">
            <div class="row" style="--i:0">
              <sw-icon name="file_code" size="16"></sw-icon>
              <span class="l">This screen</span>
              <span class="r">app/(tabs)/index.js</span>
            </div>
            <div class="row" style="--i:1">
              <sw-icon name="table_columns" size="16"></sw-icon>
              <span class="l">Tabs layout</span>
              <span class="r">app/(tabs)/_layout.js</span>
            </div>
            <div class="row" style="--i:2">
              <sw-icon name="icons" size="16"></sw-icon>
              <span class="l">Icon in the bar</span>
              <span class="r">&lt;sw-icon name="house"&gt;</span>
            </div>
          </div>
        </div>
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
          font-family: var(--font);
          background: var(--page_background);
        }

        * { box-sizing: border-box; font-family: inherit; }

        .wrap {
          max-width: 480px;
          margin: 0 auto;
          padding: 36px 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .hero { text-align: center; animation: rise 0.55s ease both; }

        .orb {
          width: 88px;
          height: 88px;
          margin: 0 auto 16px;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          background: linear-gradient(145deg, var(--main_color, #4f46e5), #7c3aed);
          box-shadow: 0 18px 36px rgba(79, 70, 229, 0.28);
          animation: pop 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: var(--main_text, #111);
        }

        .hero p {
          margin: 0 auto;
          max-width: 38ch;
          color: var(--sub_text, #666);
          font-weight: 600;
          line-height: 1.45;
        }

        code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 11px;
          background: rgba(0,0,0,0.06);
          padding: 1px 6px;
          border-radius: 999px;
        }

        .label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: var(--sub_text, #666);
          padding: 0 6px 8px;
        }

        .list {
          background: var(--surface_3, #f4f4f5);
          border-radius: 20px;
          padding: 6px;
          display: flex;
          flex-direction: column;
        }

        .row {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 14px;
          animation: rise 0.5s ease both;
          animation-delay: calc(0.08s * var(--i, 0) + 0.2s);
        }

        .row sw-icon { color: var(--main_color, #4f46e5); }
        .l { font-weight: 700; font-size: 14px; color: var(--main_text, #111); }
        .r {
          font-size: 11px;
          font-weight: 600;
          color: var(--sub_text, #666);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          background: rgba(0,0,0,0.05);
          padding: 5px 10px;
          border-radius: 999px;
        }

        @keyframes pop {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: none; }
        }

        @keyframes rise {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
      </style>
    `;
  }
}
