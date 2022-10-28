const {
  launchBrowser,
  enterScene,
  closeBrowser,
  printLog,
  totalTimeout,
  getCurrentPage,
} = require('../utils/utils');
const sceneUrls = require('../../scenes/scenes.json');
const request = require('request');

describe('should switch scene works', () => {
  ``;
  beforeAll(async () => {
    await launchBrowser();
    //Todo: define custom functions here
    // await page.evaluate(async () => {
    // 	window.todo = () => {}
    // })
    await enterScene(`https://local.webaverse.com/`);
  }, totalTimeout);

  afterAll(async () => {
    await closeBrowser();
  }, totalTimeout);

  test.each(sceneUrls)(
    'should scene switch works %s',
    async sceneUrl => {
      printLog('should profile ui view works: ', sceneUrl);

      const page = getCurrentPage();
      await page.evaluate(async (sceneUrl) => {
        document.querySelector('._button_1fev9_13').click();
        console.log(`======================= ${sceneUrl} =======================`)
      }, sceneUrl);

      const mousePos = await page.evaluate(async sceneUrl => {
        const nodeLists = document.querySelectorAll('div._room_1fev9_22');
        let mouseX, mouseY;
        nodeLists.forEach(nodeElement => {
          const url = nodeElement.querySelector('div').innerHTML;
          const lastIndex = url.lastIndexOf('/');
          const name = url.slice(lastIndex + 1);
          if (sceneUrl == name) {
            //scroll to view
            nodeElement.scrollIntoView();
            //mouse position
            const rect = nodeElement.getBoundingClientRect();
            mouseX = (rect.left + rect.right) / 2;
            mouseY = (rect.top + rect.bottom) / 2;
          }
        });
        return {
          x: mouseX,
          y: mouseY,
        };
      }, sceneUrl);

      await page.mouse.move(mousePos.x, mousePos.y);
      await page.waitForTimeout(500);
      await page.mouse.click(mousePos.x, mousePos.y);
      await page.waitForTimeout(500);

      let isPageError = false;
      page.on('pageerror', async err => {
        printLog('==error==', err);
        isPageError = true;
      });

      const result = await page.evaluate(async () => {
        // @ts-ignore
        try {
          await window.globalWebaverse.webaverse?.waitForLoad();
          await window.globalWebaverse.universe?.waitForSceneLoaded();
          const loadedApps =
            window.globalWebaverse.world.appManager.getApps();
          const loadedAppCount = loadedApps.length
          //add some validation code here
          return {
            isSceneLoaded: true,
            loadedAppCount,
          };
        } catch (error) {
          console.error('webaverse scene errored', error);
          return {
            isSceneLoaded: false,
            loadedAppCount: 0,
          };
        }
      });

      const appCount = await new Promise(function (resolve, reject) {
        request(
          `https://webaverse.github.io/scenes/${sceneUrl}`,
          function (error, response, body) {
            try {
              if (!error && response.statusCode == 200) {
                var importedJSON = JSON.parse(body);
                resolve(importedJSON.objects ? importedJSON.objects.length : 0);
              } else {
                reject(0);
              }
            } catch (error) {
              reject(0);
            }
          },
        );
      });

      console.log("appCount=======================", appCount)
      console.log("result=======================", result.isSceneLoaded, result.loadedAppCount)
      console.log("isPageError=======================", isPageError)
      expect(result.isSceneLoaded).toBeTruthy();
      expect(result.loadedAppCount).toBeGreaterThanOrEqual(appCount);
      expect(!isPageError).toBeTruthy();
    },
    totalTimeout * 10,
  );
});
