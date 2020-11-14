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

        return primitive;
    }
}
