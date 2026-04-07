import { SwitchComponent } from 'switch-framework';
import { getSystemTheme} from 'switch-framework/themes';

export class SwStarterSplashScreen extends SwitchComponent {
  static tag = 'sw-starter-splash';

  onMount() {
    this.updateLogo();
  }


  updateLogo() {

    const isDark = getSystemTheme() || 'light';
    const logoImg = this.select('.logo');
    if (logoImg) {
      logoImg.src = isDark=="dark"
        ? '/assets/files/Switch_framework_logo_white.svg'
        : '/assets/files/Switch_framework_logo_purple.svg';
    }
  }

  render() {
    return `
       <div class="wrap">
        <div class="card">
          <div class="logo-container">
            <img class="logo" src="/assets/files/Switch_framework_logo_purple.svg" alt="Switch Framework" />
          </div>
          <div class="title">Switch Framework</div>
          <div class="linear-loader-container">
            <div class="linear-loader">
              <div class="linear-loader-bar"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  styleSheet() {
    return `
      <style>
        :host {
          position: fixed;
          inset: 0;
          display: block;
          background: var(--page_background, #fff);
          z-index: 9999;
        }

        * {
          box-sizing: border-box;
          font-family: var(--font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
        }

        .wrap {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 18px;
          position: relative;
        }

        .card {
          width: min(520px, 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          animation: fadeInScale 0.6s ease-out;
        }

        .logo {
          width: 80px;
          height: 80px;
          object-fit: contain;
          animation: rotateLogo 2s linear infinite;
        }

        .title {
          font-weight: 700;
          font-size: 24px;
          color: var(--main_text, #000);
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .sub {
          font-weight: 600;
          font-size: 13px;
          color: var(--sub_text, #666);
          animation: fadeIn 0.8s ease-out 0.3s both;
        }

        .linear-loader-container {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          width: min(280px, 80%);
          animation: fadeIn 0.8s ease-out 0.4s both;
        }

        .linear-loader {
          width: 100%;
          height: 4px;
          background: var(--surface_2, rgba(0,0,0,0.1));
          border-radius: 2px;
          overflow: hidden;
        }

        .linear-loader-bar {
          height: 100%;
          width: 40%;
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 25%, #a855f7 50%, #ec4899 75%, #f43f5e 100%);
          border-radius: 2px;
          animation: linearProgress 1.5s ease-in-out infinite;
          background-size: 200% 100%;
        }

        @keyframes rotateLogo {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes linearProgress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(75%);
          }
          100% {
            transform: translateX(250%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      </style>
    `;
  }
}
