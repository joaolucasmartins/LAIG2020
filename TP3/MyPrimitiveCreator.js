/**
 * MyPrimitiveCreator
 * @constructor
 * @param {GCFXMLreader} reader 
 * @param {GCFscene} scene
 */
class MyPrimitiveCreator {
    constructor(reader, scene, spritesheets) {
        this.reader = reader;
        this.scene = scene;
        this.spritesheets = spritesheets;
    }

    /**
     * Parse <leaf> node (Rectangle)
     * @param {node element} node 
     * @param {float} afs - texture amplification
     * @param {float} aft - texture amplification
     */
    createRectangle(node, afs, aft) {
        var x1 = this.reader.getFloat(node, "x1", false);
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var y1 = this.reader.getFloat(node, "y1", false);
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var x2 = this.reader.getFloat(node, "x2", false);
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y2 = this.reader.getFloat(node, "y2", false);
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        return new MyRectangle(this.scene, x1, y1, x2, y2, afs, aft);
    }

    /**
    * Parse <leaf> node (Triangle)
    * @param {node element} node 
    * @param {float} afs - texture amplification
    * @param {float} aft - texture amplification
    */
    createTriangle(node, afs, aft) {
        var x1 = this.reader.getFloat(node, "x1", false);
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var y1 = this.reader.getFloat(node, "y1", false);
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var x2 = this.reader.getFloat(node, "x2", false);
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y2 = this.reader.getFloat(node, "y2", false);
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        var x3 = this.reader.getFloat(node, "x3", false);
        if (x3 == null || isNaN(x3))
            return "unable to parse field 'x3' of the ";

        var y3 = this.reader.getFloat(node, "y3", false);
        if (y3 == null || isNaN(y3))
            return "unable to parse field 'y3' of the ";

        return new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, afs, aft);
    }

    /**
    * Parse <leaf> node (Cylinder)
    * @param {node element} node 
    */
    createCylinder(node) {
        var bottomRadius = this.reader.getFloat(node, "bottomRadius", false);
        if (bottomRadius == null || isNaN(bottomRadius))
            return "unable to parse field 'bottomRadius' of the ";

        var topRadius = this.reader.getFloat(node, "topRadius", false);
        if (topRadius == null || isNaN(topRadius))
            return "unable to parse field 'topRadius' of the ";

        var height = this.reader.getFloat(node, "height", false);
        if (height == null || isNaN(height))
            return "unable to parse field 'height' of the ";

        var slices = this.reader.getInteger(node, "slices", false);
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var stacks = this.reader.getInteger(node, "stacks", false);
        if (stacks == null || isNaN(stacks))
            return "unable to parse field 'stacks' of the ";

        return new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
    }

    /**
    * Parse <leaf> node (Sphere)
    * @param {node element} node 
    */
    createSphere(node) {
        var radius = this.reader.getFloat(node, "radius", false);
        if (radius == null || isNaN(radius))
            return "unable to parse field 'radius' of the ";

        var slices = this.reader.getInteger(node, "slices", false);
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var stacks = this.reader.getInteger(node, "stacks", false);
        if (stacks == null || isNaN(stacks))
            return "unable to parse field 'stacks' of the ";
        return new MySphere(this.scene, radius, slices, stacks);
    }

    /**
    * Parse <leaf> node (Torus)
    * @param {node element} node 
    */
    createTorus(node) {
        var innerRadius = this.reader.getFloat(node, "inner", false);
        if (innerRadius == null || isNaN(innerRadius))
            return "unable to parse field 'innerRadius' of the ";

        var outerRadius = this.reader.getFloat(node, "outer", false);
        if (outerRadius == null || isNaN(outerRadius))
            return "unable to parse field 'outerRadius' of the ";

        var slices = this.reader.getInteger(node, "slices", false);
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var loops = this.reader.getInteger(node, "loops", false);
        if (loops == null || isNaN(loops))
            return "unable to parse field 'loops' of the ";

        return new MyTorus(this.scene, innerRadius, outerRadius, slices, loops);
    }

    /**
    * Parse <leaf> node (SpriteText)
    * @param {node element} node 
    */
    createSpriteText(node) {
        var text = this.reader.getString(node, "text", false);
        if (text == null)
            return "unable to parse field 'text' of the ";

        return new MySpriteText(this.scene, text);
    }

    /**
    * Parse <leaf> node (SpriteAnim)
    * @param {node element} node
    */
    createSpriteAnim(node) {
        var ssid = this.reader.getString(node, "ssid", false);
        if (ssid == null)
            return "unable to parse field 'ssid' of the ";

        if (!(ssid in this.spritesheets))
            return "unknown spritesheet with id '" + ssid + "'";

        var startCell = this.reader.getInteger(node, "startCell", false);
        if (startCell == null || isNaN(startCell))
            return "unable to parse field 'startCell' of the ";

        var endCell = this.reader.getInteger(node, "endCell", false);
        if (endCell == null || isNaN(endCell))
            return "unable to parse field 'endCell' of the ";

        var duration = this.reader.getFloat(node, "duration", false);
        if (duration == null || isNaN(duration))
            return "unable to parse field 'outerRadius' of the ";

        return new MySpriteAnimation(this.scene, this.spritesheets[ssid], startCell, endCell, duration);
    }

    /**
    * Parse <leaf> node (Plane)
    * @param {node element} node 
    */
    createPlane(node) {
        var npartsU = this.reader.getInteger(node, "npartsU", false);
        if (npartsU == null || isNaN(npartsU))
            return "unable to parse field 'npartsU' of the ";

        var npartsV = this.reader.getInteger(node, "npartsV", false);
        if (npartsV == null || isNaN(npartsV))
            return "unable to parse field 'npartsV' of the ";

        return new MyPlane(this.scene, npartsU, npartsV);
    }

    parseControlPoints(node, nPointsU, nPointsV) {
        var controlPoints = [];

        for (let i = 0; i < node.length; i++) {
            var x = this.reader.getFloat(node[i], "x", false);
            if (x == null || isNaN(x))
                return "unable to parse field 'x' of the ";

            var y = this.reader.getFloat(node[i], "y", false);
            if (y == null || isNaN(y))
                return "unable to parse field 'y' of the ";

            var z = this.reader.getFloat(node[i], "z", false);
            if (z == null || isNaN(z))
                return "unable to parse field 'z' of the ";

            var point = [x, y, z, 1.0];
            controlPoints.push(point);
        }

        let nPoints = nPointsU * nPointsV;
        if (controlPoints.length != nPoints)
            return "expected " + nPoints + " control points but got " + nPoints + " in ";

        var ret = [];
        var auxMat = [];
        var cnt = 0;

        for (var i = 0; i < nPointsU; i++) {
            for (var j = 0; j < nPointsV; j++) {
                //console.log(i, j, cnt);
                auxMat.push(controlPoints[cnt++]);
            }
            ret.push(auxMat);
            auxMat = [];
        }
        return ret;
    }
    /**
    * Parse <leaf> node (Plane)
    * @param {node element} node 
    */
    createPatch(node) {
        var npointsU = this.reader.getInteger(node, "npointsU", false);
        if (npointsU == null || isNaN(npointsU))
            return "unable to parse field 'npointsU' of the ";

        var npointsV = this.reader.getInteger(node, "npointsV", false);
        if (npointsV == null || isNaN(npointsV))
            return "unable to parse field 'npointsV' of the ";
        var npartsU = this.reader.getInteger(node, "npartsU", false);
        if (npartsU == null || isNaN(npartsU))
            return "unable to parse field 'npartsU' of the ";

        var npartsV = this.reader.getInteger(node, "npartsV", false);
        if (npartsV == null || isNaN(npartsV))
            return "unable to parse field 'npartsV' of the ";

        var controlPoints = this.parseControlPoints(node.children, npointsU, npointsV);
        if (typeof controlPoints === "string")
            return "unable to parse control points with error " + controlPoints;

        return new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoints);
    }

    /**
    * Parse <leaf> node (Barrel)
    * @param {node element} node 
    */
    createBarrel(node) {
        var base = this.reader.getFloat(node, "base", false);
        if (base == null || isNaN(base))
            return "unable to parse field 'base' of the ";
        var middle = this.reader.getFloat(node, "middle", false);
        if (middle == null || isNaN(middle))
            return "unable to parse field 'middle' of the ";
        var height = this.reader.getFloat(node, "height", false);
        if (height == null || isNaN(height))
            return "unable to parse field 'height' of the ";

        var slices = this.reader.getInteger(node, "slices", false);
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";
        var stacks = this.reader.getInteger(node, "stacks", false);
        if (stacks == null || isNaN(stacks))
            return "unable to parse field 'stacks' of the ";

        var tilt = this.reader.getFloat(node, "tilt", false);
        if (tilt == null) // Not specified
            return new MyDefBarrel(this.scene, base, middle, height, slices, stacks);
        else if (isNaN(tilt) || tilt <= 0 || tilt >= 90)
            return "unable to parse field 'tilt' of the ";
        else // given tilt
            return new MyDefBarrel(this.scene, base, middle, height, slices, stacks, tilt);
    }

    /**
    * Parse <leaf> node (Circle)
    * @param {node element} node 
    */
    createCircle(node) {
        var radius = this.reader.getFloat(node, "radius", false);
        if (radius == null || isNaN(radius))
            return "unable to parse field 'radius' of the ";

        var slices = this.reader.getFloat(node, "slices", false);
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        return new MyCircle(this.scene, radius, slices);
    }

    createGameBoard(node) {
        var x1 = this.reader.getFloat(node, "x1", false);
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var x2 = this.reader.getFloat(node, "x2", false);
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y1 = this.reader.getFloat(node, "y1", false);
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var y2 = this.reader.getFloat(node, "y2", false);
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        return new MyGameBoard(this.scene, x1, x2, y1, y2);
    }

    parseButton(node, afs, aft) {
        var x1 = this.reader.getFloat(node, "x1", false);
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var y1 = this.reader.getFloat(node, "y1", false);
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var x2 = this.reader.getFloat(node, "x2", false);
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y2 = this.reader.getFloat(node, "y2", false);
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        var id = this.reader.getInteger(node, "id", false);
        if (id == null || isNaN(id))
            return "unable to parse field 'id' of the ";

        var selected = this.reader.getBoolean(node, "selected", false);
        if (selected == null || isNaN(selected))
            return "unnable to parse field 'selected' of the ";

        return [id, x1,y1,x2,y2, afs, aft, selected];
    }
    createButton(type, node, afs, aft) {
        
        let values = this.parseButton(node, afs, aft);

        if (typeof values === "string") 
            return values;

        if (type == "actionButton")
            return new MyActionButton(this.scene, ...values);
        else if (type == "themeButton")
            return new MyThemeButton(this.scene, ...values);
        else if (type == "levelButton")
            return new MyLevelButton(this.scene, ...values);
        else if (type == "modeButton")
            return new MyModeButton(this.scene, ...values);
        else if (type == "counterButton") {
            var value = this.reader.getInteger(node, "value", false)
            if (value == null || isNaN(value))
                return "unnable to parse field 'value' of the ";
            return new MyCounterButton(this.scene, ...values, value);
        }
        return new MyButton(this.scene, ...values, afs, aft);
    }

    /**
    * Create primitive switcher.
    * @param {node element} node 
    * @param {string} type - leaf type
    * @param {float} afs - texture amplification
    * @param {float} aft - texture amplification
    */
    createPrimitive(node, type, afs = 1, aft = 1) {
        var primitive;
        if (type == "rectangle")
            primitive = this.createRectangle(node, afs, aft);
        else if (type == "triangle")
            primitive = this.createTriangle(node, afs, aft);
        else if (type == "cylinder")
            primitive = this.createCylinder(node);
        else if (type == "sphere")
            primitive = this.createSphere(node);
        else if (type == "torus")
            primitive = this.createTorus(node);
        else if (type == "spritetext")
            primitive = this.createSpriteText(node);
        else if (type == "spriteanim")
            primitive = this.createSpriteAnim(node);
        else if (type == "plane")
            primitive = this.createPlane(node);
        else if (type == "patch")
            primitive = this.createPatch(node);
        else if (type == "defbarrel")
            primitive = this.createBarrel(node);
        else if (type == "circle")
            primitive = this.createCircle(node);
        else if (type == "gameboard")
            primitive = this.createGameBoard(node);
        else if (type.includes("Button"))
            primitive = this.createButton(type, node, afs, aft);
        else
            primitive = "type '" + type + "' is not a valid type in ";

        return primitive;
    }
}
