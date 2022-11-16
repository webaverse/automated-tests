const puppeteer = require('puppeteer');
const chalk = require('chalk');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require("path");

const width = 800;
const height = 400;
// const width = 2400;
// const height = 1200;
let browsers = [];
let pages = [];
let errorLists = []
let totalTimeout = 60000

const isdebug = true;

const printLog = (text, error) => {
  if (isdebug) {
    if (!error) error = '';
    console.log(text, error.toString());
    // process.stderr.write(`${text}\n`);
  }
};


let workbook
let worksheet

const setupExcel = async () => {
  workbook = new ExcelJS.Workbook();
  worksheet = workbook.addWorksheet('My Sheet');
  worksheet.columns = [
    { header: 'type', key: 'type', width: 10 },
    { header: 'Message', key: 'message', width: 80 },
    { header: 'Message 2', key: 'message2', width: 40}
  ];
}

const displayLog = async (type, message, message2 = '') => {
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
    if (worksheet && workbook
      && (type == 'section'
      || type == 'error'
      || type == 'browsererror'
      || type == 'success'
      || type == 'passed'
      || type == 'fail')
      ) {
      worksheet.addRow({type, message, message2});
      await workbook.xlsx.writeFile("./test.xlsx");
    }
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
        displayLog('error', entry.text, entry.url);
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

const launchBrowser = async (isMulti) => {
  jest.setTimeout(totalTimeout);
  displayLog('action', 'Start launch browsers');
  let browserCount = isMulti ? 2 : 1
  for (let i = 0; i < browserCount; i++) {
    const browser = await puppeteer.launch({
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
    browsers.push(browser)

    const page = (await browser.pages())[0];
    await page.setViewport({width, height});
    setupErrorList(page)
    pages.push(page)
  }
  setupExcel()
};

const closeBrowser = async () => {
  browsers.forEach(async (browser) => {
    await browser.close();
  })
  browsers = []
};

const getCurrentPage = (playerIndex = 0) => {
  return pages[playerIndex];
};

const navigate = async (url, playerIndex = 0) => {
  // const browser = browsers[playerIndex]
  const page = pages[playerIndex]
  // if (!browser) {
  //   throw Error('Cannot navigate without a browser!');
  // }
  // const context = browser.defaultBrowserContext();

  // const parsedUrl = new Url(url);
  // context.overridePermissions(url, ['microphone', 'camera']);

  displayLog('action', `Going to url: ${url}`);

  await page.goto(url, {waitUntil: 'load', timeout: totalTimeout});
  // printLog('Complete to ' + url);

  // const granted = await page.evaluate(async () => {
  // 	// @ts-ignore
  // 	return (await navigator.permissions.query({ name: 'camera' })).state
  // })
  // printLog('Granted:', granted
};

const enterScene = async (url, playerIndex = 0) => {
  await navigate(url, playerIndex);
  const page = pages[playerIndex]
  await defineFunctions(page);
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

const defineFunctions = async (page) => {
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

const getAppCountFromScene = async (sceneUrl) => {
  let appCount = 0
  try {
    const data = await fs.readFileSync(path.resolve(__dirname, `../../scenes/${sceneUrl}`))
    const result = JSON.parse(data)
    if (result && result.objects) {
      appCount = result.objects.length
    }
  } catch (error) {
    debugger
  }
  return appCount
}

module.exports = {
  totalTimeout,
  getCurrentPage,
  getDimensions,
  launchBrowser,
  closeBrowser,
  enterScene,
  printLog,
  getAppCountFromScene,
  displayLog,
  getErrorList,
  resetErrorList
};
