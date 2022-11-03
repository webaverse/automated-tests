const puppeteer = require('puppeteer');
const chalk = require('chalk');
const {Url} = require('url');

const totalTimeout = 600 * 1000;
const width = 800;
const height = 400;
// const width = 2400;
// const height = 1200;
let browser;
let page;
let errorLists = []

const isdebug = true;

const printLog = (text, error) => {
  if (isdebug) {
    if (!error) error = '';
    console.log(text, error.toString());
    // process.stderr.write(`${text}\n`);
  }
};

const displayLog = (type, message, message2 = '') => {
  if (!chalk.supportsColor) {
    console.log(type, message, message2);
  }
  if (isdebug) {
    let output = '';
    if (type === 'action') {
      output = `${chalk.reset.white.bgGreen.bold(' ACTION ')} ${message} ${chalk.underline.greenBright(message2)}`;
    } else if (type === 'section') {
      output = `${chalk.reset.black.bgYellowBright.bold(' START ')} ${message} ${chalk.underline.yellowBright(message2)}`;
    } else if (type === 'step') {
      output = `${chalk.reset.white.bold(' STEP ')} ${message} ${chalk.reset.white(message2)}`;
    } else if (type === 'error') {
      output = `${chalk.reset.redBright.bold(' ERROR ')} ${message} ${chalk.reset.white(message2)}`;
    } else if (type === 'browsererror') {
      output = `${chalk.reset.redBright.bold(' BROWSER ERROR ')} ${message} ${chalk.reset.white(message2)}`;
    } else if (type === 'success') {
      output = `${chalk.reset.greenBright.bold(' SUCCESS ')} ${message} ${chalk.reset.white(message2)}`;
    } else if (type === 'info') {
      output = `${chalk.reset.whiteBright.bold(' INFO ')} ${message} ${chalk.underline.greenBright(message2)}`;
    } else if (type === 'log') {
      output = `${chalk.reset.gray.bold(' LOG ')} ${message} ${chalk.underline.greenBright(message2)}`;
    } else if (type === 'passed') {
      output = `${chalk.reset.white.bgGreenBright.bold(' PASSED ')} ${message} ${chalk.underline.greenBright(message2)}`;
    } else if (type === 'fail') {
      output = `${chalk.reset.white.bgRedBright.bold(' FAILED ')} ${message} ${chalk.underline.redBright(message2)}`;
    }
    process.stderr.write(`${output}\n`);
  }
};

const throwErrors = async (text, isQuit) => {
  if (isQuit) await closeBrowser();
  displayLog('error', text);
  // throw Error(text);
};

const getErrorList = () => {
  return errorLists
}

const resetErrorList = () => {
  errorLists = []
}

const setupErrorList = async (page) => {
  const cdp = await page.target().createCDPSession();
  await cdp.send('Log.enable');
  cdp.on('Log.entryAdded', async ({ entry }) => {
    if (entry.level === 'error') {
      const errorMsg = `${entry.text} ${entry.url}`
      const tempMsg = errorMsg.replace(/\s/g, '').toLowerCase()
      if (errorLists.indexOf(tempMsg) === -1) {
        displayLog('error', errorMsg);
        errorLists.push(tempMsg)
      }
    }
  });

  page.on('console', async e => {
    if (e.type() === 'error') {
      const errorMsg = e.text()
      const tempMsg = errorMsg.replace(/\s/g, '').toLowerCase()
      if (errorLists.indexOf(tempMsg) === -1) {
        displayLog('error', errorMsg);
        errorLists.push(tempMsg)
      }
    } else if (e.type() === 'warning') {
      const errorMsg = e.text()
      if (errorMsg.includes('error loading')) {
        const tempMsg = errorMsg.replace(/\s/g, '').toLowerCase()
        if (errorLists.indexOf(tempMsg) === -1) {
          displayLog('error', errorMsg);
          errorLists.push(tempMsg)
        }
      }
    }
  });
}

const getDimensions = () => {
  return {
    width,
    height,
  };
};

const launchBrowser = async () => {
  jest.setTimeout(totalTimeout);
  displayLog('action', 'Start launch browser');
  if (!browser) {
    browser = await puppeteer.launch({
      // headless: !isdebug,
      headless: false,
      args: [
        '--no-sandbox',
        // '--use-gl=egl',
        '--use-gl=swiftshader',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--enable-surface-synchronization',
        '--enable-webgl',
        '--disable-web-security=1',
        '--mute-audio',
      ],
      devtools: true,
    });
  }
  page = (await browser.pages())[0];
  await page.setViewport({width, height});

  setupErrorList(page)
};

const closeBrowser = async () => {
  await browser.close();
};

const getCurrentPage = () => {
  return page;
};

const navigate = async url => {
  if (!browser) {
    throw Error('Cannot navigate without a browser!');
  }
  const context = browser.defaultBrowserContext();

  const parsedUrl = new Url(url);
  context.overridePermissions(url, ['microphone', 'camera']);

  displayLog('action', `Going to url: ${url}`);
  await page.goto(url, {waitUntil: 'load', timeout: totalTimeout});
  // printLog('Complete to ' + url);

  // const granted = await page.evaluate(async () => {
  // 	// @ts-ignore
  // 	return (await navigator.permissions.query({ name: 'camera' })).state
  // })
  // printLog('Granted:', granted
};

const enterScene = async url => {
  await navigate(url);
  await defineFunctions();
  const isSceneLoaded = await page.evaluate(async () => {
    // @ts-ignore
    try {
      if (!window?.globalWebaverse) return;
      await window.globalWebaverse.webaverse?.waitForLoad();
      await window.globalWebaverse.universe?.isSceneLoaded();
      await window.globalWebaverse.universe?.waitForSceneLoaded();
      return await window.waitForUntil(() => {
        const avatar = window.globalWebaverse.playersManager?.localPlayer?.avatar;
        return (avatar?.model && avatar?.model?.visible) || (avatar?.crunchedModel && avatar?.crunchedModel?.visible);
      }, 180000);
    } catch (error) {
      console.error('error loading ', error);
      return false;
    }
  });
  if (!isSceneLoaded) {
    await throwErrors('Cannot load the current scene!', true);
  }
  displayLog('action', `Scene Loaded url: ${url}`);
};

const defineFunctions = async () => {
  // exposeFunction function does not work well
  // await page.exposeFunction('getAngle', getAngle)
  await page.evaluate(async () => {
    // the interval of exposeFunc does not work
    window.waitForUntil = async (fn, timeout) => {
      return await new Promise((resolve, reject) => {
        const startTime = performance.now();
        const timer = setInterval(() => {
          const flag = fn();
          if (flag) {
            clearInterval(timer);
            resolve(true);
          } else {
            const currentTime = performance.now();
            if (currentTime - startTime > timeout) {
              console.error('wait for until - failed 180s');
              clearInterval(timer);
              reject(false);
            }
          }
        }, 100);
      });
    };
  });
};

module.exports = {
  totalTimeout,
  getCurrentPage,
  getDimensions,
  launchBrowser,
  closeBrowser,
  enterScene,
  printLog,
  displayLog,
  getErrorList,
  resetErrorList
};
