const {
    launchBrowser,
    enterScene,
    closeBrowser,
    printLog,
    totalTimeout,
    getCurrentPage,
  } = require('../utils/utils');

  describe('should ride vehicle', () => {
    beforeAll(async () => {
        await launchBrowser();
        //Todo: define custom functions here
        // await page.evaluate(async () => {
        // 	window.todo = () => {}
        // })
        await enterScene(
            `https://local.webaverse.com/?src=./packages/puppeteer-previewer/scenes/test-e2e-vehicle.scn`,
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
      'should ride vehicle: hovercraft',
      async () => {
        printLog('should ride vehicle:: hovercraft');
        const page = getCurrentPage();
        //move to sword position and rotate
        printLog('should ride vehicle: move to hovercraft position');
        await page.evaluate(async () => {
            globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
            {x: 2, y: 1.5, z: -12},
            );
        });
        await page.waitForTimeout(2000);

        //ride the hovercraft
        printLog('should ride vehicle: ride the hovercraft');
        await page.keyboard.down('KeyE');
        await page.waitForTimeout(4000);
        await page.keyboard.up('KeyE');
        await page.waitForTimeout(2000);
        const vehicleInfo = await page.evaluate(async () => {
            //Todo: check hovercraft is attached
            try {
                const attachedApp =
                    globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                    app => app.name == 'hovercraft',
                    );
                if (attachedApp.length != 1) return false;
                const instanceId =
                    globalWebaverse.playersManager.localPlayer.getAction(
                    'wear',
                    ).instanceId;
                return {
                    isVehicleRided: attachedApp[0].instanceId == instanceId,
                    position: attachedApp[0].position
                }
            } catch (error) {
                return {
                    isVehicleRided: attachedApp[0].instanceId == instanceId,
                    position: {x: 0, y: 0, z: 0}
                }
            }
        });

        const firstPosition = vehicleInfo.position
        const isVehicleRided = vehicleInfo.isVehicleRided

        const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
        const key = keys[Math.floor(Math.random() * keys.length)];
        await page.keyboard.down(key);
        await page.waitForTimeout(1000);
        const vehicleMove = await page.evaluate(
            async ({firstPosition, key}) => {
                try {
                    const attachedApp =
                        globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                            app => app.name == 'hovercraft',
                        );
                    const currentPosition = attachedApp[0].position;
                    // let isCorrectMove = true;
                    // if (key == 'KeyW') {
                    // if (currentPosition.x <= firstPosition.x) isCorrectMove = false;
                    // } else if (key == 'KeyA') {
                    // if (currentPosition.z >= firstPosition.z) isCorrectMove = false;
                    // } else if (key == 'KeyS') {
                    // if (currentPosition.x >= firstPosition.x) isCorrectMove = false;
                    // } else if (key == 'KeyD') {
                    // if (currentPosition.z <= firstPosition.z) isCorrectMove = false;
                    // }
                    return {
                        currentPosition,
                        // isCorrectMove,
                    };
                } catch (error) {
                    return {
                        currentPosition: {x: 0, y: 0, z: 0},
                        isCorrectMove: false
                    }
                }
            },
            {firstPosition, key},
        );
        await page.keyboard.up(key);
        await page.waitForTimeout(1000);

        //unride the hovercraft
        printLog('should ride vehicle: unride the hovercraft');
        await page.keyboard.press('KeyR');
        await page.evaluate(async () => {
            globalWebaverse.game.dropSelectedApp();
        });

        const isVehicleUnRided = await page.evaluate(async () => {
            try {
            const attachedApp =
                globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                app => app.name == 'hovercraft',
                );
            return attachedApp.length == 0;
            } catch (error) {
            return false;
            }
        });
        await page.waitForTimeout(1000);

        printLog('should ride vehicle: move to zero position');
        await page.evaluate(async () => {
            globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
            {x: 0, y: 1.5, z: 0},
            );
        });
        await page.waitForTimeout(2000);

        expect(isVehicleRided).toBeTruthy();
        expect(vehicleMove.currentPosition).not.toBe(firstPosition);
        // expect(vehicleMove.isCorrectMove).toBeTruthy();
        expect(isVehicleUnRided).toBeTruthy();
      },
      totalTimeout,
    );

    test(
        'should ride vehicle: dragon',
        async () => {
            printLog('should ride vehicle:: dragon');
            const page = getCurrentPage();
            //move to sword position and rotate
            printLog('should ride vehicle: move to dragon position');
            await page.evaluate(async () => {
                globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
                {x: 2, y: 1.5, z: 12},
                );
            });
            await page.waitForTimeout(2000);

            //ride the dragon
            printLog('should ride vehicle: ride the dragon');
            await page.keyboard.down('KeyE');
            await page.waitForTimeout(4000);
            await page.keyboard.up('KeyE');
            await page.waitForTimeout(2000);
            const vehicleInfo = await page.evaluate(async () => {
                //Todo: check dragon is attached
                try {
                    const attachedApp =
                        globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                        app => app.name == 'dragon-mount',
                        );
                    if (attachedApp.length != 1) return false;
                    const instanceId =
                        globalWebaverse.playersManager.localPlayer.getAction(
                        'wear',
                        ).instanceId;
                    return {
                        isVehicleRided: attachedApp[0].instanceId == instanceId,
                        position: attachedApp[0].position
                    }
                } catch (error) {
                    return {
                        isVehicleRided: attachedApp[0].instanceId == instanceId,
                        position: {x: 0, y: 0, z: 0}
                    }
                }
            });

            const firstPosition = vehicleInfo.position
            const isVehicleRided = vehicleInfo.isVehicleRided

            const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
            const key = keys[Math.floor(Math.random() * keys.length)];
            await page.keyboard.down(key);
            await page.waitForTimeout(1000);
            const vehicleMove = await page.evaluate(
                async ({firstPosition, key}) => {
                    try {
                        const attachedApp =
                            globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                                app => app.name == 'dragon-mount',
                            );
                        const currentPosition = attachedApp[0].position;
                        // let isCorrectMove = true;
                        // if (key == 'KeyW') {
                        // if (currentPosition.x <= firstPosition.x) isCorrectMove = false;
                        // } else if (key == 'KeyA') {
                        // if (currentPosition.z >= firstPosition.z) isCorrectMove = false;
                        // } else if (key == 'KeyS') {
                        // if (currentPosition.x >= firstPosition.x) isCorrectMove = false;
                        // } else if (key == 'KeyD') {
                        // if (currentPosition.z <= firstPosition.z) isCorrectMove = false;
                        // }
                        return {
                            currentPosition,
                            // isCorrectMove,
                        };
                    } catch (error) {
                        return {
                            currentPosition: {x: 0, y: 0, z: 0},
                            isCorrectMove: false
                        }
                    }
                },
                {firstPosition, key},
            );
            await page.keyboard.up(key);
            await page.waitForTimeout(1000);

            //unride the dragon
            printLog('should ride vehicle: unride the dragon');
            await page.keyboard.press('KeyR');
            await page.evaluate(async () => {
                globalWebaverse.game.dropSelectedApp();
            });

            const isVehicleUnRided = await page.evaluate(async () => {
                try {
                const attachedApp =
                    globalWebaverse.playersManager.localPlayer.appManager.apps.filter(
                    app => app.name == 'dragon-mount',
                    );
                return attachedApp.length == 0;
                } catch (error) {
                return false;
                }
            });
            await page.waitForTimeout(1000);

            printLog('should ride vehicle: move to zero position');
            await page.evaluate(async () => {
                globalWebaverse.playersManager.localPlayer.characterPhysics.setPosition(
                {x: 0, y: 1.5, z: 0},
                );
            });
            await page.waitForTimeout(2000);

            expect(isVehicleRided).toBeTruthy();
            expect(vehicleMove.currentPosition).not.toBe(firstPosition);
            // expect(vehicleMove.isCorrectMove).toBeTruthy();
            expect(isVehicleUnRided).toBeTruthy();
        },
    totalTimeout,
    );
});
