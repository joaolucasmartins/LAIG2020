//From https://github.com/EvanHahn/ScriptInclude
include = function () {function f() {var a = this.readyState; (!a || /ded|te/.test(a)) && (c--, !c && e && d())} var a = arguments, b = document, c = a.length, d = a[c - 1], e = d.call; e && c--; for (var g, h = 0; c > h; h++)g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g)};
serialInclude = function (a) {var b = console, c = serialInclude.l; if (a.length > 0) c.splice(0, 0, a); else b.log("Done!"); if (c.length > 0) {if (c[0].length > 1) {var d = c[0].splice(0, 1); b.log("Loading " + d + "..."); include(d, function () {serialInclude([]);});} else {var e = c[0][0]; c.splice(0, 1); e.call();};} else b.log("Finished.");}; serialInclude.l = new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}
//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MyInterface.js',
    'primitives/MyRectangle.js', 'primitives/MyTriangle.js', 'primitives/MyCylinder.js', 'primitives/MyTorus.js', 'primitives/MySphere.js',
    'primitives/MyPlane.js', 'primitives/MyPatch.js', 'primitives/MyDefBarrel.js', 'primitives/MyCircle.js', 'primitives/MyRectangleXZ.js',
    'animations/MyAnimation.js', 'animations/MyKeyFrameAnimation.js', 'animations/MySpriteAnimation.js', 'animations/MyFunctionalAnimation.js', 'animations/MyCameraAnimation.js',

    'appearances/ClearTexture.js', 'appearances/NullTexture.js', 'appearances/NullMaterial.js', 'appearances/MyTexture.js',
    'appearances/MyMaterial.js', 'Node.js', 'MyPrimitiveCreator.js', 'Utils.js',
    'sprites/MySpritesheet.js', 'sprites/MySpriteText.js', 'MySceneGraph.js',
    'primitives/MyGameBoard.js', 'primitives/MyTile.js', 'primitives/MyPiece.js', 'primitives/MyCamera.js',
    'gamelogic/MyPrologInterface.js', 'gamelogic/MyGameOrchestrator.js', 'gamelogic/MyGameState.js',
    'gamelogic/MyGameMove.js', 'gamelogic/MyGameSequence.js', 'gamelogic/MyAnimator.js', 'gamelogic/MyNodeCreator.js',
    'primitives/menu/MyMenuPanel.js', 'primitives/menu/MyButton.js',
    'primitives/menu/MyActionButton.js', 'primitives/menu/MyThemeButton.js', 'primitives/menu/MyLevelButton.js',
    'primitives/menu/MyModeButton.js', 'primitives/menu/MyCounterButton.js', 'primitives/MyScoreBoard.js',
    'primitives/MyTimer.js', 'primitives/MyPawnPiece.js', 'primitives/MySquarePiece.js',
    'primitives/MyStatusDisplayer.js',

    main = function () {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        // get file name provided in URL, e.g. http://localhost/myproj/?file=myfile.xml 
        // or use "demo.xml" as default (assumes files in subfolder "scenes", check MySceneGraph constructor) 
        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        //var myGraph = new MySceneGraph(filename, myScene);

        // start
        app.run();
    }

]);
