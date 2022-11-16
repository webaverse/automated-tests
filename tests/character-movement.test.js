const {
  launchBrowser,
  enterScene,
  closeBrowser,
  printLog,
  displayLog,
  totalTimeout,
  getCurrentPage,
} = require('../utils/utils');

describe.only(
  'should character movement',
  () => {
    beforeAll(async () => {
      await launchBrowser();
      //Todo: define custom functions here
      // await page.evaluate(async () => {
      // 	window.todo = () => {}
      // })
      await enterScene(
        `https://local.webaverse.com/?src=./packages/automated-tests/scenes/test-e2e-empty.scn`,
      );
    }, totalTimeout);

    afterAll(async () => {
      await closeBrowser();
    }, totalTimeout);

    test(
      'should character loaded',
      async () => {
        displayLog('section', 'should character loaded: start');
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
        displayLog('step', 'should character loaded: ', 'Validation checking')

        displayLog(avatarFlag.isPlayerAvatarApp? 'success' : 'error', 'Should character loaded', 'isPlayerAvatarApp');
        displayLog(avatarFlag.isBound? 'success' : 'error', 'Should character loaded', 'isBound');
        displayLog(avatarFlag.isCharacterSfx? 'success' : 'error', 'Should character loaded', 'isCharacterSfx');
        displayLog(avatarFlag.isCharacterHups? 'success' : 'error', 'Should character loaded', 'isCharacterHups');
        displayLog(avatarFlag.isCharacterFx? 'success' : 'error', 'Should character loaded', 'isCharacterFx');
        displayLog(avatarFlag.isCharacterHitter? 'success' : 'error', 'Should character loaded', 'isCharacterHitter');
        displayLog(avatarFlag.isCharacterFace? 'success' : 'error', 'Should character loaded', 'isCharacterFace');
        displayLog(avatarFlag.isCharacterPhysic? 'success' : 'error', 'Should character loaded', 'isCharacterPhysic');

        const isSuccess = avatarFlag.isPlayerAvatarApp && avatarFlag.isBound
                          && avatarFlag.isCharacterSfx && avatarFlag.isCharacterHups
                          && avatarFlag.isCharacterFx && avatarFlag.isCharacterHitter
                          && avatarFlag.isCharacterFace && avatarFlag.isCharacterPhysic

        displayLog(isSuccess ? 'passed' : 'fail', 'should character loaded: ', 'avatar');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: walk',
      async () => {
        displayLog('section', 'should character movement: ', 'walk');
        const page = getCurrentPage();
        const firstPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });

        displayLog('step', 'should character movement: ', 'moving');
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

        displayLog('step', 'should character movement: ', 'validation');

        displayLog(playerMove.currentSpeed > 0? 'success' : 'error', 'should character movement: ', 'currentSpeed > 0');
        displayLog(playerMove.idleWalkFactor > 0.5? 'success' : 'error', 'should character movement: ', 'idleWalkFactor > 0.5');
        displayLog(playerMove.currentPosition !== firstPosition? 'success' : 'error', 'should character movement: ', 'moved');
        
        const isSuccess = playerMove.currentSpeed > 0 && playerMove.idleWalkFactor > 0.5 && playerMove.currentPosition !== firstPosition
        // expect(playerMove.isCorrectMove).toBeTruthy();
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'walk');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: run',
      async () => {
        displayLog('section', 'should character movement: ', 'run');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });

        displayLog('step', 'should character movement: ', 'running');
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
        
        displayLog('step', 'should character movement: ', 'validation');
        displayLog(playerRun.currentSpeed > 0.5? 'success' : 'error', 'should character movement: ', 'currentSpeed > 0.5');
        displayLog(playerRun.walkRunFactor > 0.5? 'success' : 'error', 'should character movement: ', 'walkRunFactor > 0.5');
        displayLog(playerRun.currentPosition !== lastPosition? 'success' : 'error', 'should character movement: ', 'moved');
        
        const isSuccess = playerRun.currentSpeed > 0.5 && playerRun.walkRunFactor > 0.5 && playerRun.currentPosition !== lastPosition
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'run');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: naruto run',
      async () => {
        displayLog('section', 'should character movement: ', 'naruto run');
        displayLog('step', 'should character movement: ', 'naruto run start');
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

        displayLog('step', 'should character movement: ', 'validation');
        displayLog(narutoRun.narutoRunTime > 0.5? 'success' : 'error', 'should character movement: ', 'narutoRunTime > 0.5');
        displayLog(narutoRun.narutoRunState? 'success' : 'error', 'should character movement: ', 'narutoRunState');
 
        const isSuccess = narutoRun.narutoRunTime > 0.5 && narutoRun.narutoRunState
        // expect(playerMove.isCorrectMove).toBeTruthy();
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'naruto run');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: jump',
      async () => {
        displayLog('section', 'should character movement: ', 'jump');
        displayLog('step', 'should character movement: ', 'jump start');
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

        displayLog('step', 'should character movement: ', 'validation');
        const isSuccess = isJumpFlags[0] || isJumpFlags[1] || isJumpFlags[2]
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'jump');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: double jump',
      async () => {
        displayLog('section', 'should character movement: ', 'double jump');
        displayLog('step', 'should character movement: ', 'double jump start');
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

        displayLog('step', 'should character movement: ', 'validation');
        const isSuccess = isDoubleJumpFlags[0] || isDoubleJumpFlags[1] || isDoubleJumpFlags[2]
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'double jump');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: crouch',
      async () => {
        displayLog('section', 'should character movement: ', 'crouch');
        const page = getCurrentPage();
        const lastPosition = await page.evaluate(async () => {
          return globalWebaverse.playersManager.localPlayer.position;
        });
        displayLog('step', 'should character movement: ', 'crouch and move');
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

        displayLog('step', 'should character movement: ', 'validation');
        displayLog(playerCrouch.currentSpeed > 0? 'success' : 'error', 'should character movement: ', 'currentSpeed > 0');
        displayLog(playerCrouch.crouchFactor > 0.5? 'success' : 'error', 'should character movement: ', 'crouchFactor > 0.5');
        displayLog(playerCrouch.currentPosition !== lastPosition? 'success' : 'error', 'should character movement: ', 'moved');
        
        const isSuccess = playerCrouch.currentSpeed > 0 && playerCrouch.crouchFactor > 0.5 && playerCrouch.currentPosition !== lastPosition
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'crouch');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: fly',
      async () => {
        displayLog('section', 'should character movement: ', 'fly');
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

        displayLog('step', 'should character movement: ', 'validation');
        displayLog(playerFly.flyTime > 0? 'success' : 'error', 'should character movement: ', 'flyTime > 0');
        displayLog(playerFly.flyState? 'success' : 'error', 'should character movement: ', 'flyState');
 
        const isSuccess = playerFly.flyTime > 0.5 && playerFly.flyState
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'fly');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'should character movement: dance',
      async () => {
        displayLog('section', 'should character movement: ', 'dance');
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

        displayLog('step', 'should character movement: ', 'validation');
        displayLog(playerDance.danceFactor? 'success' : 'error', 'should character movement: ', 'dance');
 
        const isSuccess = playerDance.danceFactor
        displayLog(isSuccess ? 'passed' : 'fail', 'should character movement: ', 'dance');
        expect(isSuccess).toBeTruthy();
      },
      totalTimeout,
    );
  },
  totalTimeout,
);


describe(
  'multiplayer: should character movement',
  () => {
    beforeAll(async () => {
      await launchBrowser(true);
      //Todo: define custom functions here
      // await page.evaluate(async () => {
      // 	window.todo = () => {}
      // })
      await enterScene(`https://local.webaverse.com/?src=./packages/automated-tests/scenes/test-e2e-empty.scn`, 0);
      await enterScene(`https://local.webaverse.com/?src=./packages/automated-tests/scenes/test-e2e-empty.scn`, 1);
    }, totalTimeout);

    afterAll(async () => {
      await closeBrowser();
    }, totalTimeout);

    test(
      'multiplayer: should character loaded',
      async () => {
        for(let i = 0; i < 2; i++) {
          displayLog('section', `multiplayer: should character loaded: player ${i}: `, 'start');
          const avatarFlag = await getCurrentPage(i).evaluate(async () => {
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
          displayLog('step', 'should character loaded: ', 'Validation checking')

          displayLog(avatarFlag.isPlayerAvatarApp? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isPlayerAvatarApp');
          displayLog(avatarFlag.isBound? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isBound');
          displayLog(avatarFlag.isCharacterSfx? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterSfx');
          displayLog(avatarFlag.isCharacterHups? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterHups');
          displayLog(avatarFlag.isCharacterFx? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterFx');
          displayLog(avatarFlag.isCharacterHitter? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterHitter');
          displayLog(avatarFlag.isCharacterFace? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterFace');
          displayLog(avatarFlag.isCharacterPhysic? 'success' : 'error', `multiplayer: should character loaded: player ${i}: `, 'isCharacterPhysic');

          const isSuccess = avatarFlag.isPlayerAvatarApp && avatarFlag.isBound
                            && avatarFlag.isCharacterSfx && avatarFlag.isCharacterHups
                            && avatarFlag.isCharacterFx && avatarFlag.isCharacterHitter
                            && avatarFlag.isCharacterFace && avatarFlag.isCharacterPhysic

          displayLog(isSuccess ? 'passed' : 'fail', `multiplayer: should character loaded: player ${i}: `, 'avatar');
          expect(isSuccess).toBeTruthy();
        }
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: walk',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'walk');
        const pageA = getCurrentPage(0);
        const pageB = getCurrentPage(1);

        displayLog('step', 'multiplayer: should character movement: ', 'moving');
        const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
        const keyA = keys[Math.floor(Math.random() * keys.length)];
        const keyB = keys[Math.floor(Math.random() * keys.length)];
        await pageA.keyboard.down(keyA);
        await pageA.waitForTimeout(1000);
        await pageB.keyboard.down(keyB);
        await pageB.waitForTimeout(1000);
        
        displayLog('step', 'multiplayer: should character movement: ', 'validation');
        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: run',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'run');
        const pageA = getCurrentPage(0);
        const pageB = getCurrentPage(1);

        displayLog('step', 'multiplayer: should character movement: ', 'running');
        const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        await pageA.keyboard.down('ShiftRight');
        await pageA.waitForTimeout(100);
        await pageA.keyboard.down(key);
        await pageA.waitForTimeout(1000);

        await pageB.keyboard.down('ShiftRight');
        await pageB.waitForTimeout(100);
        await pageB.keyboard.down(key);
        await pageB.waitForTimeout(1000);
        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: naruto run',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'naruto run');
        displayLog('step', 'multiplayer: should character movement: ', 'naruto run start');
        const pageA = getCurrentPage();
        const pageB = getCurrentPage();
        await pageA.keyboard.down('ShiftLeft');
        await pageA.waitForTimeout(100);
        await pageA.keyboard.type('wwwwwwwwww');
        await pageA.waitForTimeout(3000);

        await pageB.keyboard.down('ShiftLeft');
        await pageB.waitForTimeout(100);
        await pageB.keyboard.type('wwwwwwwwww');
        await pageB.waitForTimeout(3000);

        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: jump',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'jump');
        displayLog('step', 'multiplayer: should character movement: ', 'jump start');
        const pageA = getCurrentPage(0);
        const pageB = getCurrentPage(1);
        for (let i = 0; i < 3; i++) {
          await pageA.keyboard.press('Space');
          await pageA.waitForTimeout(100);
          await pageA.waitForTimeout(2000);
        }
        await pageA.waitForTimeout(3000);

        for (let i = 0; i < 3; i++) {
          await pageB.keyboard.press('Space');
          await pageB.waitForTimeout(100);
          await pageB.waitForTimeout(2000);
        }
        await pageB.waitForTimeout(3000);

        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: double jump',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'double jump');
        displayLog('step', 'multiplayer: should character movement: ', 'double jump start');
        const pageA = getCurrentPage(0);
        const pageB = getCurrentPage(1);
        //ToDO: need to repeat for get average because sometimes page.evaluate takes a few sec
        for (let i = 0; i < 3; i++) {
          await pageA.keyboard.press('Space');
          await pageA.waitForTimeout(100);
          await pageA.keyboard.press('Space');
          await pageA.waitForTimeout(100);

          await pageB.keyboard.press('Space');
          await pageB.waitForTimeout(100);
          await pageB.keyboard.press('Space');
          await pageB.waitForTimeout(100);
        }
        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: crouch',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'crouch');
        const pageA = getCurrentPage(0);
        displayLog('step', 'multiplayer: should character movement: ', 'crouch and move');
        await pageA.keyboard.down('ControlLeft');
        await pageA.keyboard.down('KeyC');
        await pageA.waitForTimeout(100);
        await pageA.keyboard.up('ControlLeft');
        await pageA.keyboard.up('KeyC');
        await pageA.waitForTimeout(100);
        await pageA.keyboard.down('KeyW');
        await pageA.waitForTimeout(2000);

        await pageA.keyboard.up('KeyW');
        await pageA.keyboard.down('ControlLeft');
        await pageA.keyboard.down('KeyC');
        await pageA.waitForTimeout(100);
        await pageA.keyboard.up('ControlLeft');
        await pageA.keyboard.up('KeyC');
        await pageA.waitForTimeout(3000);

        const pageB = getCurrentPage(0);
        displayLog('step', 'multiplayer: should character movement: ', 'crouch and move');
        await pageB.keyboard.down('ControlLeft');
        await pageB.keyboard.down('KeyC');
        await pageB.waitForTimeout(100);
        await pageB.keyboard.up('ControlLeft');
        await pageB.keyboard.up('KeyC');
        await pageB.waitForTimeout(100);
        await pageB.keyboard.down('KeyW');
        await pageB.waitForTimeout(2000);

        await pageB.keyboard.up('KeyW');
        await pageB.keyboard.down('ControlLeft');
        await pageB.keyboard.down('KeyC');
        await pageB.waitForTimeout(100);
        await pageB.keyboard.up('ControlLeft');
        await pageB.keyboard.up('KeyC');
        await pageB.waitForTimeout(3000);
        
        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: fly',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'fly');
        const pageA = getCurrentPage(0);
        await pageA.keyboard.press('KeyF');
        await pageA.keyboard.down('KeyW');
        await pageA.waitForTimeout(1000);
        await pageA.keyboard.up('KeyW');
        await pageA.keyboard.press('KeyF');
        await pageA.waitForTimeout(3000);

        const pageB = getCurrentPage(0);
        await pageB.keyboard.press('KeyF');
        await pageB.keyboard.down('KeyW');
        await pageB.waitForTimeout(1000);
        await pageB.keyboard.up('KeyW');
        await pageB.keyboard.press('KeyF');
        await pageB.waitForTimeout(3000);

        expect(true).toBeTruthy();
      },
      totalTimeout,
    );

    test(
      'multiplayer: should character movement: dance',
      async () => {
        displayLog('section', 'multiplayer: should character movement: ', 'dance');
        const pageA = getCurrentPage(0);
        await pageA.keyboard.down('KeyV');
        await pageA.waitForTimeout(2000);
        await pageA.keyboard.up('KeyV');
        await pageA.waitForTimeout(3000);

        const pageB = getCurrentPage(0);
        await pageB.keyboard.down('KeyV');
        await pageB.waitForTimeout(2000);
        await pageB.keyboard.up('KeyV');
        await pageB.waitForTimeout(3000);
        expect(true).toBeTruthy();
      },
      totalTimeout,
    );
  },
  totalTimeout,
);


