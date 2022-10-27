const {
  launchBrowser,
  enterScene,
  closeBrowser,
  printLog,
  totalTimeout,
  getCurrentPage,
} = require('../utils/utils');

describe('should npc player works', () => {
  beforeAll(async () => {
    await launchBrowser();
    //Todo: define custom functions here
    // await page.evaluate(async () => {
    // 	window.todo = () => {}
    // })
    await enterScene(
      `https://local.webaverse.com/?src=./packages/puppeteer-previewer/scenes/test-e2e-npc.scn`,
    );
    const page = getCurrentPage();
    await page.click('#root');
    await page.mouse.wheel({deltaY: 300});
    await page.waitForTimeout(2000);
  }, totalTimeout);

  afterAll(async () => {
    await closeBrowser();
  }, totalTimeout);

  test(
    'should npc player works: follow',
    async () => {
      printLog('should npc player works: follow');
      const page = getCurrentPage();
      printLog('should npc player works: go to npc position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: -24.5},
        );
        globalWebaverse.playersManager.localPlayer.characterPhysics.character.lookAt(
          0,
          0,
          -30,
        );
      });
      await page.waitForTimeout(2000);

      printLog('should npc player works: use npc');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isNpcAttached = await page.evaluate(async () => {
        //Todo: check npc is attached
        try {
          const attachedApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'application/npc',
            );
          return attachedApp.length > 0;
        } catch (error) {
          return false;
        }
      });

      const firstWalkPosition = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          return currentNpc.position;
        } catch (error) {
          return {x: 0, y: 0, z: 0};
        }
      });

      //Todo: simulate walk
      printLog('should npc player works: player start walk');
      await page.keyboard.down('KeyS');
      await page.waitForTimeout(3000);

      const npcWalk = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          const avatar = currentNpc.avatar;
          const currentSpeed = avatar.velocity.length();
          const idleWalkFactor = avatar.idleWalkFactor;
          const currentPosition = currentNpc.position;
          return {
            currentSpeed,
            idleWalkFactor,
            currentPosition,
          };
        } catch (error) {
          return {
            currentSpeed: 0,
            idleWalkFactor: 0,
            currentPosition: {x: 0, y: 0, z: 0},
          };
        }
      });

      await page.keyboard.up('KeyS');
      await page.waitForTimeout(1000);

      //run npc
      const firstRunPosition = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          return currentNpc.position;
        } catch (error) {
          return {x: 0, y: 0, z: 0};
        }
      });

      //Todo: simulate run
      printLog('should npc player works: player start run');
      await page.keyboard.down('ShiftRight');
      await page.waitForTimeout(500);
      await page.keyboard.down('KeyS');
      await page.waitForTimeout(3000);

      const npcRun = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          const avatar = currentNpc.avatar;
          const currentSpeed = avatar.velocity.length();
          const walkRunFactor = avatar.walkRunFactor;
          const currentPosition = currentNpc.position;
          return {
            currentSpeed,
            walkRunFactor,
            currentPosition,
          };
        } catch (error) {
          return {
            currentSpeed: 0,
            walkRunFactor: 0,
            currentPosition: {x: 0, y: 0, z: 0},
          };
        }
      });

      await page.keyboard.up('KeyS');
      await page.keyboard.up('ShiftRight');
      await page.waitForTimeout(5000);

      //unuse npc
      printLog('should npc player works: move to near position');
      const currentNpcPosition = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          return currentNpc.position;
        } catch (error) {
          return {x: 0, y: 0, z: 0};
        }
      });

      await page.evaluate(async currentNpcPosition => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: currentNpcPosition.x, y: 1.5, z: currentNpcPosition.z - 0.5},
        );
      }, currentNpcPosition);

      await page.waitForTimeout(5000);

      printLog('should npc player works: unuse npc');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      // await page.evaluate(async () => {
      //     globalWebaverse.game.dropSelectedApp();
      // });
      await page.waitForTimeout(1000);

      const isNpcUnAttached = await page.evaluate(async () => {
        try {
          const attachedApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'application/npc',
            );
          return attachedApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      printLog('should npc player works: move to zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isNpcAttached).toBeTruthy();
      expect(npcWalk.currentSpeed).toBeGreaterThan(0);
      expect(npcWalk.idleWalkFactor).toBeGreaterThan(0.5);
      expect(npcWalk.currentPosition).not.toBe(firstWalkPosition);
      expect(npcRun.currentSpeed).toBeGreaterThan(0.5);
      expect(npcRun.walkRunFactor).toBeGreaterThan(0.5);
      expect(npcRun.currentPosition).not.toBe(firstRunPosition);
      expect(isNpcUnAttached).toBeTruthy();
    },
    totalTimeout,
  );

  test(
    'should npc player works: switch the avatars',
    async () => {
      printLog('should npc player works: follow');
      printLog('should npc player works: move to near position');
      const page = getCurrentPage();

      await page.waitForTimeout(10000);

      let currentNpcPosition = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          return currentNpc.position;
        } catch (error) {
          return {x: 0, y: 0, z: 0};
        }
      });

      await page.waitForTimeout(5000);

      printLog('should npc player works: go to npc position');
      await page.evaluate(async currentNpcPosition => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: currentNpcPosition.x, y: 1.5, z: currentNpcPosition.z},
        );
      }, currentNpcPosition);
      await page.waitForTimeout(2000);

      printLog('should npc player works: use npc');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isNpcAttached = await page.evaluate(async () => {
        //Todo: check npc is attached
        try {
          const attachedApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'application/npc',
            );
          return attachedApp.length > 0;
        } catch (error) {
          return false;
        }
      });

      const currentAvatarName = await page.evaluate(async () => {
        return globalWebaverse.playersManager.localPlayer.name;
      });

      printLog('should npc player works: switch the avatars');
      await page.keyboard.press('KeyG');
      await page.waitForTimeout(2000);

      const switchedAvatarName = await page.evaluate(async () => {
        return globalWebaverse.playersManager.localPlayer.name;
      });

      printLog('should npc player works: switch the avatars');
      await page.keyboard.press('KeyG');
      await page.waitForTimeout(2000);

      const reSwitchedAvatarName = await page.evaluate(async () => {
        return globalWebaverse.playersManager.localPlayer.name;
      });

      //unuse npc
      printLog('should npc player works: move to near position');
      currentNpcPosition = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          return currentNpc.position;
        } catch (error) {
          return {x: 0, y: 0, z: 0};
        }
      });

      await page.evaluate(async currentNpcPosition => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: currentNpcPosition.x, y: 1.5, z: currentNpcPosition.z - 0.5},
        );
      }, currentNpcPosition);

      await page.waitForTimeout(5000);

      printLog('should npc player works: unuse npc');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      // await page.evaluate(async () => {
      //     globalWebaverse.game.dropSelectedApp();
      // });
      await page.waitForTimeout(1000);

      const isNpcUnAttached = await page.evaluate(async () => {
        try {
          const attachedApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'application/npc',
            );
          return attachedApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      printLog('should npc player works: move to zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isNpcAttached).toBeTruthy();
      expect(switchedAvatarName).not.toBe(currentAvatarName);
      expect(reSwitchedAvatarName).toBe(currentAvatarName);
      expect(isNpcUnAttached).toBeTruthy();
    },
    totalTimeout,
  );
});
