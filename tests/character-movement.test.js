const {
  launchBrowser,
  enterScene,
  closeBrowser,
  printLog,
  totalTimeout,
  getCurrentPage,
} = require('../utils/utils');

describe(
  'should character movement',
  () => {
    beforeAll(async () => {
      await launchBrowser();
      //Todo: define custom functions here
      // await page.evaluate(async () => {
      // 	window.todo = () => {}
      // })
      await enterScene(
        `https://local.webaverse.com/?src=./packages/puppeteer-previewer/scenes/test-e2e-empty.scn`,
      );
    }, totalTimeout);

    afterAll(async () => {
      await closeBrowser();
    }, totalTimeout);

    test(
      'should character loaded',
      async () => {
        printLog('should character loaded');
        const avatarFlag = await getCurrentPage().evaluate(async () => {
          const localPlayer = globalWebaverse.playersManager.localPlayer;
          const isPlayerAvatarApp = !!localPlayer.getAvatarApp();
          const isBound = localPlayer.isBound();
          // const isLocalPlayer = localPlayer.isLocalPlayer;
          const isCharacterSfx =
            localPlayer.avatarCharacterSfx && !!localPlayer.avatarCharacterSfx.character;
          const isCharacterHups =
            localPlayer.characterHups && !!localPlayer.characterHups.character;
          const isCharacterFx =
            localPlayer.avatarCharacterFx && !!localPlayer.avatarCharacterFx.character;
          const isCharacterHitter =
            localPlayer.characterHitter && !!localPlayer.characterHitter.character;
          const isCharacterFace =
            localPlayer.avatarFace &&
            !!localPlayer.avatarFace.character;
          const isCharacterPhysic =
            localPlayer.characterPhysics &&
            localPlayer.characterPhysics.characterHeight > 0 &&
            localPlayer.characterPhysics.lastGrounded;
          return {
            isPlayerAvatarApp,
            isBound,
            // isLocalPlayer,
            isCharacterSfx,
            isCharacterHups,
            isCharacterFx,
            isCharacterHitter,
            isCharacterFace,
            isCharacterPhysic,
          };
        });
        expect(avatarFlag.isPlayerAvatarApp).toBeTruthy();
        expect(avatarFlag.isBound).toBeTruthy();
        expect(avatarFlag.isCharacterSfx).toBeTruthy();
        expect(avatarFlag.isCharacterHups).toBeTruthy();
        expect(avatarFlag.isCharacterFx).toBeTruthy();
        expect(avatarFlag.isCharacterHitter).toBeTruthy();
        expect(avatarFlag.isCharacterFace).toBeTruthy();
        expect(avatarFlag.isCharacterPhysic).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: walk',
      async () => {
        printLog('should character movement: walk');
        const page = getCurrentPage();
        const firstPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        await page.keyboard.down(key);
        await page.waitForTimeout(1000);
        const playerMove = await page.evaluate(
          async ({firstPosition, key}) => {
            const avatar = globalWebaverse.playersManager.localPlayer.avatar;
            const currentSpeed = avatar.velocity.length();
            const idleWalkFactor = avatar.idleWalkFactor;
            const currentPosition = globalWebaverse.playersManager.localPlayer.position;
            // let isCorrectMove = true;
            // if (key === 'KeyW') {
            //   if (currentPosition.x <= firstPosition.x) isCorrectMove = false;
            // } else if (key === 'KeyA') {
            //   if (currentPosition.z >= firstPosition.z) isCorrectMove = false;
            // } else if (key === 'KeyS') {
            //   if (currentPosition.x >= firstPosition.x) isCorrectMove = false;
            // } else if (key === 'KeyD') {
            //   if (currentPosition.z <= firstPosition.z) isCorrectMove = false;
            // }
            return {
              currentSpeed,
              idleWalkFactor,
              currentPosition,
              // isCorrectMove,
            };
          },
          {firstPosition, key},
        );
        await page.keyboard.up(key);
        await page.waitForTimeout(3000);
        expect(playerMove.currentSpeed).toBeGreaterThan(0);
        expect(playerMove.idleWalkFactor).toBeGreaterThan(0.5);
        expect(playerMove.currentPosition).not.toBe(firstPosition);
        // expect(playerMove.isCorrectMove).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: run',
      async () => {
        printLog('should character movement: run');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        await page.keyboard.down('ShiftRight');
        await page.waitForTimeout(100);
        await page.keyboard.down(key);
        await page.waitForTimeout(1000);
        const playerRun = await page.evaluate(async () => {
          const avatar = globalWebaverse.playersManager.localPlayer.avatar;
          const currentSpeed = avatar.velocity.length();
          const walkRunFactor = avatar.walkRunFactor;
          const currentPosition = globalWebaverse.playersManager.localPlayer.position;
          return {
            currentSpeed,
            walkRunFactor,
            currentPosition,
          };
        });
        await page.keyboard.up(key);
        await page.keyboard.up('ShiftRight');
        await page.waitForTimeout(3000);
        expect(playerRun.currentSpeed).toBeGreaterThan(0.5);
        expect(playerRun.walkRunFactor).toBeGreaterThan(0.5);
        expect(playerRun.currentPosition).not.toBe(lastPosition);
      },
      totalTimeout,
    );

    test(
      'should character movement: naruto run',
      async () => {
        printLog('should character movement: naruto run');
        const page = getCurrentPage();
        await page.keyboard.down('ShiftLeft');
        await page.waitForTimeout(100);
        await page.keyboard.type('wwwwwwwwww');
        await page.waitForTimeout(3000);

        const narutoRun = await page.evaluate(async () => {
          const avatar = globalWebaverse.playersManager.localPlayer.avatar;
          const narutoRunTime = avatar.narutoRunTime;
          const narutoRunState = avatar.narutoRunState;
          return {
            narutoRunTime,
            narutoRunState,
          };
        });
        await page.keyboard.up('ShiftLeft');
        await page.waitForTimeout(5000);
        expect(narutoRun.narutoRunTime).toBeGreaterThan(0.5);
        expect(narutoRun.narutoRunState).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: jump',
      async () => {
        printLog('should character movement: jump');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        const isJumpFlags = [];
        //ToDO: need to repeat for get average because sometimes page.evaluate takes a few sec
        for (let i = 0; i < 3; i++) {
          await page.keyboard.press('Space');
          await page.waitForTimeout(100);
          const isJump = await page.evaluate(async lastPosition => {
            const avatar =
              window.globalWebaverse.playersManager?.localPlayer?.avatar;
            const jumpState = avatar.jumpState;
            const jumpTime = avatar.jumpTime;
            const currentPosition = globalWebaverse.playersManager.localPlayer.position;
            console.log(jumpTime, jumpState, lastPosition, currentPosition);
            return (
              jumpTime > 0 &&
              jumpState &&
              currentPosition.y - lastPosition.y > 0
            );
          }, lastPosition);
          isJumpFlags.push(isJump);
          await page.waitForTimeout(2000);
        }
        await page.waitForTimeout(3000);
        expect(isJumpFlags[0] || isJumpFlags[1] || isJumpFlags[2]).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: double jump',
      async () => {
        printLog('should character movement: double jump');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        const isDoubleJumpFlags = [];
        //ToDO: need to repeat for get average because sometimes page.evaluate takes a few sec
        for (let i = 0; i < 3; i++) {
          await page.keyboard.press('Space');
          await page.waitForTimeout(100);
          await page.keyboard.press('Space');
          await page.waitForTimeout(100);
          const isDoubleJump = await page.evaluate(async lastPosition => {
            const avatar = globalWebaverse.playersManager.localPlayer.avatar;
            const doubleJumpState = avatar.doubleJumpState;
            const doubleJumpTime = avatar.doubleJumpTime;
            const currentPosition = globalWebaverse.playersManager.localPlayer.position;
            console.log(doubleJumpTime, doubleJumpState);
            return (
              doubleJumpTime > 0 &&
              doubleJumpState &&
              currentPosition.y - lastPosition.y > 0
            );
          }, lastPosition);
          isDoubleJumpFlags.push(isDoubleJump);
          await page.waitForTimeout(5000);
        }
        await page.waitForTimeout(3000);
        expect(
          isDoubleJumpFlags[0] || isDoubleJumpFlags[1] || isDoubleJumpFlags[2],
        ).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: crouch',
      async () => {
        printLog('should character movement: crouch');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        await page.keyboard.down('ControlLeft');
        await page.keyboard.down('KeyC');
        await page.waitForTimeout(100);
        await page.keyboard.up('ControlLeft');
        await page.keyboard.up('KeyC');
        await page.waitForTimeout(100);
        await page.keyboard.down('KeyW');
        await page.waitForTimeout(2000);
        const playerCrouch = await page.evaluate(async () => {
          const avatar = globalWebaverse.playersManager.localPlayer.avatar;
          const currentSpeed = avatar.velocity.length();
          const crouchFactor = avatar.crouchFactor;
          const currentPosition = globalWebaverse.playersManager.localPlayer.position;
          return {
            currentSpeed,
            crouchFactor,
            currentPosition,
          };
        });
        await page.keyboard.up('KeyW');
        await page.keyboard.down('ControlLeft');
        await page.keyboard.down('KeyC');
        await page.waitForTimeout(100);
        await page.keyboard.up('ControlLeft');
        await page.keyboard.up('KeyC');
        await page.waitForTimeout(3000);
        expect(playerCrouch.currentSpeed).toBeGreaterThan(0);
        expect(playerCrouch.crouchFactor).toBeGreaterThan(0);
        expect(playerCrouch.currentPosition).not.toBe(lastPosition);
      },
      totalTimeout,
    );

    test(
      'should character movement: fly',
      async () => {
        printLog('should character movement: fly');
        const page = getCurrentPage();
        await page.keyboard.press('KeyF');
        await page.keyboard.down('KeyW');
        await page.waitForTimeout(1000);
        const playerFly = await page.evaluate(async () => {
          const avatar = globalWebaverse.playersManager.localPlayer.avatar;
          const flyState = avatar.flyState;
          const flyTime = avatar.flyTime;
          return {
            flyTime,
            flyState,
          };
        });
        await page.keyboard.up('KeyW');
        await page.keyboard.press('KeyF');
        await page.waitForTimeout(3000);
        expect(playerFly.flyTime).toBeGreaterThan(0);
        expect(playerFly.flyState).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: dance',
      async () => {
        printLog('should character movement: dance');
        const page = getCurrentPage();
        await page.keyboard.down('KeyV');
        await page.waitForTimeout(2000);
        const playerDance = await page.evaluate(async () => {
          const avatar = globalWebaverse.playersManager.localPlayer.avatar;
          const danceFactor = avatar.danceFactor;
          return {
            danceFactor,
          };
        });
        await page.keyboard.up('KeyV');
        await page.waitForTimeout(3000);
        expect(playerDance.danceFactor).toBeTruthy();
      },
      totalTimeout,
    );
  },
  totalTimeout,
);
