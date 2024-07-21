export declare type Browser = 'aol' | 'edge' | 'edge-ios' | 'yandexbrowser' | 'kakaotalk' | 'samsung' | 'silk' | 'miui' | 'beaker' | 'edge-chromium' | 'chrome' | 'chromium-webview' | 'phantomjs' | 'crios' | 'firefox' | 'fxios' | 'opera-mini' | 'opera' | 'pie' | 'netfront' | 'ie' | 'bb10' | 'android' | 'ios' | 'safari' | 'facebook' | 'instagram' | 'ios-webview' | 'curl' | 'searchbot';
export declare type OperatingSystem = 'iOS' | 'Android OS' | 'BlackBerry OS' | 'Windows Mobile' | 'Amazon OS' | 'Windows 3.11' | 'Windows 95' | 'Windows 98' | 'Windows 2000' | 'Windows XP' | 'Windows Server 2003' | 'Windows Vista' | 'Windows 7' | 'Windows 8' | 'Windows 8.1' | 'Windows 10' | 'Windows ME' | 'Windows CE' | 'Open BSD' | 'Sun OS' | 'Linux' | 'Mac OS' | 'QNX' | 'BeOS' | 'OS/2' | 'Chrome OS';

async function infoClient() {
    const SEARCHBOX_UA_REGEX = /alexa|bot|crawl(er|ing)|facebookexternalhit|feedburner|google web preview|nagios|postrank|pingdom|slurp|spider|yahoo!|yandex/;
    const userAgentRules = [
      ['aol', /AOLShield\/([0-9\._]+)/],
      ['edge', /Edge\/([0-9\._]+)/],
      ['edge-ios', /EdgiOS\/([0-9\._]+)/],
      ['yandexbrowser', /YaBrowser\/([0-9\._]+)/],
      ['kakaotalk', /KAKAOTALK\s([0-9\.]+)/],
      ['samsung', /SamsungBrowser\/([0-9\.]+)/],
      ['silk', /\bSilk\/([0-9._-]+)\b/],
      ['miui', /MiuiBrowser\/([0-9\.]+)$/],
      ['beaker', /BeakerBrowser\/([0-9\.]+)/],
      ['edge-chromium', /EdgA?\/([0-9\.]+)/],
      [
          'chromium-webview',
          /(?!Chrom.*OPR)wv\).*Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/,
      ],
      ['chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/],
      ['phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/],
      ['crios', /CriOS\/([0-9\.]+)(:?\s|$)/],
      ['firefox', /Firefox\/([0-9\.]+)(?:\s|$)/],
      ['fxios', /FxiOS\/([0-9\.]+)/],
      ['opera-mini', /Opera Mini.*Version\/([0-9\.]+)/],
      ['opera', /Opera\/([0-9\.]+)(?:\s|$)/],
      ['opera', /OPR\/([0-9\.]+)(:?\s|$)/],
      ['pie', /^Microsoft Pocket Internet Explorer\/(\d+\.\d+)$/],
      ['pie', /^Mozilla\/\d\.\d+\s\(compatible;\s(?:MSP?IE|MSInternet Explorer) (\d+\.\d+);.*Windows CE.*\)$/],
      ['netfront', /^Mozilla\/\d\.\d+.*NetFront\/(\d.\d)/],
      ['ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/],
      ['ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/],
      ['ie', /MSIE\s(7\.0)/],
      ['bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/],
      ['android', /Android\s([0-9\.]+)/],
      ['ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/],
      ['safari', /Version\/([0-9\._]+).*Safari/],
      ['facebook', /FB[AS]V\/([0-9\.]+)/],
      ['instagram', /Instagram\s([0-9\.]+)/],
      ['ios-webview', /AppleWebKit\/([0-9\.]+).*Mobile/],
      ['ios-webview', /AppleWebKit\/([0-9\.]+).*Gecko\)$/],
      ['curl', /^curl\/([0-9\.]+)$/],
      ['searchbot', SEARCHBOX_UA_REGEX],
    ];
    const operatingSystemRules = [
      ['iOS', /iP(hone|od|ad)/],
      ['Android OS', /Android/],
      ['BlackBerry OS', /BlackBerry|BB10/],
      ['Windows Mobile', /IEMobile/],
      ['Amazon OS', /Kindle/],
      ['Windows 3.11', /Win16/],
      ['Windows 95', /(Windows 95)|(Win95)|(Windows_95)/],
      ['Windows 98', /(Windows 98)|(Win98)/],
      ['Windows 2000', /(Windows NT 5.0)|(Windows 2000)/],
      ['Windows XP', /(Windows NT 5.1)|(Windows XP)/],
      ['Windows Server 2003', /(Windows NT 5.2)/],
      ['Windows Vista', /(Windows NT 6.0)/],
      ['Windows 7', /(Windows NT 6.1)/],
      ['Windows 8', /(Windows NT 6.2)/],
      ['Windows 8.1', /(Windows NT 6.3)/],
      ['Windows 10', /(Windows NT 10.0)/],
      ['Windows ME', /Windows ME/],
      ['Windows CE', /Windows CE|WinCE|Microsoft Pocket Internet Explorer/],
      ['Open BSD', /OpenBSD/],
      ['Sun OS', /SunOS/],
      ['Chrome OS', /CrOS/],
      ['Linux', /(Linux)|(X11)/],
      ['Mac OS', /(Mac_PowerPC)|(Macintosh)/],
      ['QNX', /QNX/],
      ['BeOS', /BeOS/],
      ['OS/2', /OS\/2/],
    ];

    function matchUserAgent(ua: string) {
      return (ua !== '' &&
        userAgentRules.reduce((matched: any, _a: any) => {
            let browser = _a[0], regex = _a[1];
            if (matched) {
              return matched;
            }
            let uaMatch = (regex as RegExp).exec(ua);
            return !!uaMatch && [browser, uaMatch];
        }, false)
      );
    }
    function browserName(ua: string): Browser | null {
      const data = matchUserAgent(ua);
      return data ? data[0] : null;
    }
    function detectOS(ua: string): OperatingSystem | null {
      for (let i = 0, count = operatingSystemRules.length; i < count; i++) {
        let _a = operatingSystemRules[i];
        let os: string | RegExp = _a[0];
        let regex: string | RegExp = _a[1];
        let match = (regex as RegExp).exec(ua);
        if (match) {
          return os as OperatingSystem | null;
        }
      }
      return null;
    }
    const IP = await fetch('https://api.ipify.org/').then(res => res.text());
    return [browserName(navigator.userAgent), detectOS(navigator.userAgent), 'IP: ' + IP].join(', ');
}

export default infoClient;