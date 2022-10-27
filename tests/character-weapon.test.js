const {
  launchBrowser,
  enterScene,
  closeBrowser,
  printLog,
  totalTimeout,
  getCurrentPage,
  getDimensions,
} = require('../utils/utils');

describe('should wear and use weapon', () => {
  beforeAll(async () => {
    await launchBrowser();
    //Todo: define custom functions here
    // await page.evaluate(async () => {
    // 	window.todo = () => {}
    // })
    await enterScene(
      `https://local.webaverse.com/?src=./packages/puppeteer-previewer/scenes/test-e2e-weapon.scn`,
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
    'should wear and use weapon: sword',
    async () => {
      printLog('should wear and use weapon: sword');
      const page = getCurrentPage();
      //move to sword position and rotate
      printLog('should wear and use sword: move to sword position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(2000);

      //grab the sword
      printLog('should wear and use sword: grab the sword');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check sword is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'sword',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC01
      printLog('should wear and use sword: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 7.5},
        );
        globalWebaverse.playersManager.localPlayer.characterPhysics.character.lookAt(
          0,
          0,
          -10,
        );
      });
      await page.waitForTimeout(2000);

      //attack
      printLog('should wear and use sword: attack');
      await page.mouse.down();
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuMouseDown();
      });
      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC01',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });
      await page.waitForTimeout(8000);
      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const useTime =
          globalWebaverse.playersManager.localPlayer.avatar.useTime;
        const useAnimation =
          globalWebaverse.playersManager.localPlayer.avatar.useAnimation;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC01',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          useTime,
          useAnimation,
          npcHealth,
        };
      });
      await page.evaluate(async () => {
        globalWebaverse.game.menuMouseUp();
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);

      //move to sword position
      printLog('should wear and use sword: move to sword position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(2000);

      //ungrab the sword
      printLog('should wear and use sword: ungrab the sword');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);
      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check sword is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'sword',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use sword: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(attackResult.useTime).toBeGreaterThan(0);
      expect(attackResult.useAnimation).toMatch(/combo/);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: silsword',
    async () => {
      printLog('should wear and use weapon: silsword');
      const page = getCurrentPage();
      //move to silsword position and rotate
      printLog('should wear and use silsword: move to silsword position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 2, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(2000);

      //grab the silsword
      printLog('should wear and use silsword: grab the silsword');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check silsword is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'silsword',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC01
      printLog('should wear and use silsword: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 2, y: 1.5, z: 7.5},
        );
        globalWebaverse.playersManager.localPlayer.characterPhysics.character.lookAt(
          2,
          0,
          -10,
        );
      });
      await page.waitForTimeout(5000);

      //attack
      printLog('should wear and use silsword: attack');
      await page.mouse.down();
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuMouseDown();
      });
      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC02',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });
      await page.waitForTimeout(8000);
      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const useAnimationCombo =
          globalWebaverse.playersManager.localPlayer.avatar.useAnimationCombo;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC02',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          useAnimationCombo,
          npcHealth,
        };
      });
      await page.evaluate(async () => {
        globalWebaverse.game.menuMouseUp();
      });
      await page.mouse.up();
      await page.waitForTimeout(2000);

      //move to sword position
      printLog('should wear and use silsword: move to silsword position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 2, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the silsword
      printLog('should wear and use silsword: ungrab the silsword');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check silsword is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'silsword',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use silsword: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(attackResult.useAnimationCombo.length).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: pistol',
    async () => {
      printLog('should wear and use weapon: pistol');
      const page = getCurrentPage();
      //move to pistol position and rotate
      printLog('should wear and use pistol: move to pistol position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 4, y: 1.5, z: 1.9},
        );
      });
      await page.waitForTimeout(2000);

      //grab the pistol
      printLog('should wear and use pistol: grab the pistol');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check pistol is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'pistol',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC01
      printLog('should wear and use pistol: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 3.85, y: 1.5, z: 8.5},
        );
      });
      await page.waitForTimeout(5000);

      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC03',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });

      printLog('should wear and use pistol: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      const playerCrouchFactor = await page.evaluate(async () => {
        const avatar = globalWebaverse.playersManager.localPlayer.avatar;
        const crouchFactor = avatar.crouchFactor;
        return crouchFactor;
      });

      //attack
      printLog('should wear and use pistol: attack');
      // await page.mouse.down({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuAim();
      });

      for (let i = 0; i < 10; i++) {
        await page.mouse.down({button: 'left'});
        await page.evaluate(async () => {
          //ToDo: we should try run mouse down manually because of this issue.
          //https://github.com/puppeteer/puppeteer/issues/4562
          globalWebaverse.game.menuMouseDown();
        });
        await page.waitForTimeout(200);
        await page.evaluate(async () => {
          globalWebaverse.game.menuMouseUp();
        });
        await page.mouse.up({button: 'left'});
        await page.waitForTimeout(300);
      }

      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const aimState =
          globalWebaverse.playersManager.localPlayer.avatar.aimState;
        const aimTime =
          globalWebaverse.playersManager.localPlayer.avatar.aimTime;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC03',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          aimState,
          aimTime,
          npcHealth,
        };
      });

      // await page.mouse.up({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuUnaim();
      });

      await page.waitForTimeout(2000);

      printLog('should wear and use pistol: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      //move to sword position
      printLog('should wear and use pistol: move to pistol position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 4, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the pistol
      printLog('should wear and use pistol: ungrab the pistol');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check pistol is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'pistol',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use pistol: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(playerCrouchFactor).toBeGreaterThan(0);
      expect(attackResult.aimState).toBeTruthy();
      expect(attackResult.aimTime).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: machine-gun',
    async () => {
      printLog('should wear and use weapon: machine-gun');
      const page = getCurrentPage();
      //move to machine-gun position and rotate
      printLog(
        'should wear and use machine-gun: move to machine-gun position',
      );
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 6, y: 1.5, z: 1.9},
        );
      });
      await page.waitForTimeout(2000);

      //grab the pistol
      printLog('should wear and use machine-gun: grab the machine-gun');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check machine-gun is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'Thompson',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC04
      printLog('should wear and use machine-gun: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 5.85, y: 1.5, z: 8.5},
        );
      });
      await page.waitForTimeout(5000);

      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC04',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });

      printLog('should wear and use machine-gun: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      const playerCrouchFactor = await page.evaluate(async () => {
        const avatar = globalWebaverse.playersManager.localPlayer.avatar;
        const crouchFactor = avatar.crouchFactor;
        return crouchFactor;
      });

      //attack
      printLog('should wear and use machine-gun: attack');
      // await page.mouse.down({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuAim();
      });

      await page.mouse.down();
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuMouseDown();
      });
      await page.waitForTimeout(5000);
      await page.evaluate(async () => {
        globalWebaverse.game.menuMouseUp();
      });
      await page.mouse.up();

      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const aimState =
          globalWebaverse.playersManager.localPlayer.avatar.aimState;
        const aimTime =
          globalWebaverse.playersManager.localPlayer.avatar.aimTime;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC04',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          aimState,
          aimTime,
          npcHealth,
        };
      });

      // await page.mouse.up({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuUnaim();
      });

      await page.waitForTimeout(2000);

      printLog('should wear and use machine-gun: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      //move to sword position
      printLog(
        'should wear and use machine-gun: move to machine-gun position',
      );
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 6, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the machine-gun
      printLog('should wear and use machine-gun: ungrab the machine-gun');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check machine-gun is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'Thompson',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use machine-gun: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(playerCrouchFactor).toBeGreaterThan(0);
      expect(attackResult.aimState).toBeTruthy();
      expect(attackResult.aimTime).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: uzi',
    async () => {
      printLog('should wear and use weapon: uzi');
      const page = getCurrentPage();
      //move to uzi position and rotate
      printLog('should wear and use uzi: move to uzi position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 8, y: 1.5, z: 1.9},
        );
      });
      await page.waitForTimeout(2000);

      //grab the pistol
      printLog('should wear and use uzi: grab the uzi');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check uzi is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'Uzi',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC05
      printLog('should wear and use uzi: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 7.85, y: 1.5, z: 8.5},
        );
      });
      await page.waitForTimeout(5000);

      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC05',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });

      printLog('should wear and use uzi: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      const playerCrouchFactor = await page.evaluate(async () => {
        const avatar = globalWebaverse.playersManager.localPlayer.avatar;
        const crouchFactor = avatar.crouchFactor;
        return crouchFactor;
      });

      //attack
      printLog('should wear and use uzi: attack');
      // await page.mouse.down({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuAim();
      });

      await page.mouse.down();
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuMouseDown();
      });
      await page.waitForTimeout(5000);
      await page.evaluate(async () => {
        globalWebaverse.game.menuMouseUp();
      });
      await page.mouse.up();

      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const aimState =
          globalWebaverse.playersManager.localPlayer.avatar.aimState;
        const aimTime =
          globalWebaverse.playersManager.localPlayer.avatar.aimTime;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC05',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          aimState,
          aimTime,
          npcHealth,
        };
      });

      // await page.mouse.up({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuUnaim();
      });

      await page.waitForTimeout(2000);

      printLog('should wear and use uzi: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      //move to sword position
      printLog('should wear and use uzi: move to uzi position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 8, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the uzi
      printLog('should wear and use uzi: ungrab the uzi');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check uzi is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'Uzi',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use uzi: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(playerCrouchFactor).toBeGreaterThan(0);
      expect(attackResult.aimState).toBeTruthy();
      expect(attackResult.aimTime).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: bow',
    async () => {
      printLog('should wear and use weapon: bow');
      const page = getCurrentPage();
      //move to bow position and rotate
      printLog('should wear and use bow: move to bow position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -2, y: 1.5, z: 1.9},
        );
      });
      await page.waitForTimeout(2000);

      //grab the bow
      printLog('should wear and use bow: grab the bow');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check bow is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'bow',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC01
      printLog('should wear and use bow: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -2.15, y: 1.5, z: 8.8},
        );
      });
      await page.waitForTimeout(5000);

      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC06',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });

      printLog('should wear and use bow: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      const playerCrouchFactor = await page.evaluate(async () => {
        const avatar = globalWebaverse.playersManager.localPlayer.avatar;
        const crouchFactor = avatar.crouchFactor;
        return crouchFactor;
      });

      //attack
      printLog('should wear and use bow: attack');
      // await page.mouse.down({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuAim();
      });

      for (let i = 0; i < 3; i++) {
        await page.mouse.down({button: 'left'});
        await page.evaluate(async () => {
          //ToDo: we should try run mouse down manually because of this issue.
          //https://github.com/puppeteer/puppeteer/issues/4562
          globalWebaverse.game.menuMouseDown();
        });
        await page.waitForTimeout(8000);
        await page.evaluate(async () => {
          globalWebaverse.game.menuMouseUp();
        });
        await page.mouse.up({button: 'left'});
        await page.waitForTimeout(300);
      }

      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const aimState =
          globalWebaverse.playersManager.localPlayer.avatar.aimState;
        const aimTime =
          globalWebaverse.playersManager.localPlayer.avatar.aimTime;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC06',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          aimState,
          aimTime,
          npcHealth,
        };
      });

      // await page.mouse.up({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuUnaim();
      });

      await page.waitForTimeout(2000);

      printLog('should wear and use bow: crouch to front of target');
      await page.keyboard.down('ControlLeft');
      await page.keyboard.down('KeyC');
      await page.waitForTimeout(100);
      await page.keyboard.up('ControlLeft');
      await page.keyboard.up('KeyC');
      await page.waitForTimeout(100);

      //move to sword position
      printLog('should wear and use bow: move to bow position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -2, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the bow
      printLog('should wear and use bow: ungrab the bow');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check bow is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'bow',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use bow: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(playerCrouchFactor).toBeGreaterThan(0);
      expect(attackResult.aimState).toBeTruthy();
      expect(attackResult.aimTime).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );

  test(
    'should wear and use weapon: rpg',
    async () => {
      printLog('should wear and use weapon: rpg');
      const page = getCurrentPage();
      //move to rpg position and rotate
      printLog('should wear and use rpg: move to rpg position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -4, y: 1.5, z: 1.9},
        );
      });
      await page.waitForTimeout(2000);

      //grab the rpg
      printLog('should wear and use rpg: grab the rpg');
      await page.keyboard.down('KeyE');
      await page.waitForTimeout(4000);
      await page.keyboard.up('KeyE');
      await page.waitForTimeout(2000);
      const isWeaponAttached = await page.evaluate(async () => {
        //Todo: check rpg is attached
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'rpg',
            );
          if (swordApp.length != 1) return false;
          const instanceId =
            globalWebaverse.playersManager.localPlayer.getAction(
              'wear',
            ).instanceId;
          return swordApp[0].instanceId == instanceId;
        } catch (error) {
          return false;
        }
      });

      //move to front of target //NPC01
      printLog('should wear and use rpg: move to front of target');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -4.15, y: 1.5, z: 12},
        );
      });
      await page.waitForTimeout(5000);

      const currentNpcHealth = await page.evaluate(async () => {
        try {
          const currentNpc = globalWebaverse.npcManager.npcs.filter(
            npc => npc.name == 'NPC07',
          )[0];
          const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
          return npcApp.hitTracker.hp;
        } catch (error) {
          return 0;
        }
      });

      //attack
      printLog('should wear and use rpg: attack');
      // await page.mouse.down({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuAim();
      });

      for (let i = 0; i < 3; i++) {
        await page.mouse.down({button: 'left'});
        await page.evaluate(async () => {
          //ToDo: we should try run mouse down manually because of this issue.
          //https://github.com/puppeteer/puppeteer/issues/4562
          globalWebaverse.game.menuMouseDown();
        });
        await page.waitForTimeout(5000);
        await page.evaluate(async () => {
          globalWebaverse.game.menuMouseUp();
        });
        await page.mouse.up({button: 'left'});
        await page.waitForTimeout(1000);
      }

      const attackResult = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        const aimState =
          globalWebaverse.playersManager.localPlayer.avatar.aimState;
        const aimTime =
          globalWebaverse.playersManager.localPlayer.avatar.aimTime;
        const currentNpc = globalWebaverse.npcManager.npcs.filter(
          npc => npc.name == 'NPC07',
        )[0];
        const npcApp = globalWebaverse.npcManager.getAppByNpc(currentNpc);
        const npcHealth = npcApp.hitTracker.hp;
        return {
          aimState,
          aimTime,
          npcHealth,
        };
      });

      // await page.mouse.up({button: "right"});
      await page.evaluate(async () => {
        //ToDo: we should try run mouse down manually because of this issue.
        //https://github.com/puppeteer/puppeteer/issues/4562
        globalWebaverse.game.menuUnaim();
      });
      await page.waitForTimeout(2000);

      //move to sword position
      printLog('should wear and use rpg: move to rpg position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: -4, y: 1.5, z: 1.5},
        );
      });
      await page.waitForTimeout(5000);

      //ungrab the rpg
      printLog('should wear and use rpg: ungrab the rpg');
      await page.keyboard.press('KeyR');
      await page.evaluate(async () => {
        globalWebaverse.game.dropSelectedApp();
      });
      await page.waitForTimeout(1000);

      const isWeaponUnAttached = await page.evaluate(async () => {
        //Todo: check player attack animation work
        //Todo: check npc health damaged
        //Todo: we might have more option to validation
        //Todo: check rpg is attached on the hand
        try {
          const swordApp =
            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
              app => app.name == 'rpg',
            );
          return swordApp.length == 0;
        } catch (error) {
          return false;
        }
      });

      await page.waitForTimeout(2000);
      //goto zero position
      printLog('should wear and use bow: goto zero position');
      await page.evaluate(async () => {
        globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
          {x: 0, y: 1.5, z: 0},
        );
      });
      await page.waitForTimeout(2000);

      expect(isWeaponAttached).toBeTruthy();
      expect(attackResult.aimState).toBeTruthy();
      expect(attackResult.aimTime).toBeGreaterThan(0);
      expect(isWeaponUnAttached).toBeTruthy();
      //Todo: we need check it later
      // expect(attackResult.npcHealth).toBeLessThan(currentNpcHealth);
    },
    totalTimeout,
  );
});
