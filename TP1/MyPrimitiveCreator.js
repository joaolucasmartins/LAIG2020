class MyPrimitiveCreator {
    constructor(reader, scene) {
        this.reader = reader;
        this.scene = scene;
    }

    createRectangle(node, afs, aft) {
        var x1 = this.reader.getFloat(node, "x1");
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var y1 = this.reader.getFloat(node, "y1");
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var x2 = this.reader.getFloat(node, "x2");
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y2 = this.reader.getFloat(node, "y2");
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        return new MyRectangle(this.scene, x1, y1, x2, y2, afs, aft);
    }

    createTriangle(node, afs, aft) {
        var x1 = this.reader.getFloat(node, "x1");
        if (x1 == null || isNaN(x1))
            return "unable to parse field 'x1' of the ";

        var y1 = this.reader.getFloat(node, "y1");
        if (y1 == null || isNaN(y1))
            return "unable to parse field 'y1' of the ";

        var x2 = this.reader.getFloat(node, "x2");
        if (x2 == null || isNaN(x2))
            return "unable to parse field 'x2' of the ";

        var y2 = this.reader.getFloat(node, "y2");
        if (y2 == null || isNaN(y2))
            return "unable to parse field 'y2' of the ";

        var x3 = this.reader.getFloat(node, "x3");
        if (x3 == null || isNaN(x3))
            return "unable to parse field 'x3' of the ";

        var y3 = this.reader.getFloat(node, "y3");
        if (y3 == null || isNaN(y3))
            return "unable to parse field 'y3' of the ";

        return new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, afs, aft);
    }

    createCylinder(node) {
        var bottomRadius = this.reader.getFloat(node, "bottomRadius");
        if (bottomRadius == null || isNaN(bottomRadius))
            return "unable to parse field 'bottomRadius' of the ";

        var topRadius = this.reader.getFloat(node, "topRadius");
        if (topRadius == null || isNaN(topRadius))
            return "unable to parse field 'topRadius' of the ";

        var height = this.reader.getFloat(node, "height");
        if (height == null || isNaN(height))
            return "unable to parse field 'height' of the ";

        var slices = this.reader.getInteger(node, "slices");
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var stacks = this.reader.getInteger(node, "stacks");
        if (stacks == null || isNaN(stacks))
            return "unable to parse field 'stacks' of the ";

        return new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
    }

    createSphere(node) {
        var radius = this.reader.getFloat(node, "radius");
        if (radius == null || isNaN(radius))
            return "unable to parse field 'radius' of the ";

        var slices = this.reader.getInteger(node, "slices");
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var stacks = this.reader.getInteger(node, "stacks");
        if (stacks == null || isNaN(stacks))
            return "unable to parse field 'stacks' of the ";
        return new MySphere(this.scene, radius, slices, stacks);
    }

    createCube(node) {
        return new MyCube(this.scene); // TODO
    }

    createTorus(node) {
        var innerRadius = this.reader.getFloat(node, "inner");
        if (innerRadius == null || isNaN(innerRadius))
            return "unable to parse field 'innerRadius' of the ";

        var outerRadius = this.reader.getFloat(node, "outer");
        if (outerRadius == null || isNaN(outerRadius))
            return "unable to parse field 'outerRadius' of the ";

        var slices = this.reader.getInteger(node, "slices");
        if (slices == null || isNaN(slices))
            return "unable to parse field 'slices' of the ";

        var loops = this.reader.getInteger(node, "loops");
        if (loops == null || isNaN(loops))
            return "unable to parse field 'loops' of the ";

        return new MyTorus(this.scene, innerRadius, outerRadius, slices, loops);
    }

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
        else if (type == "cube")
            primitive = this.createCube(node);
        else if (type == "torus")
            primitive = this.createTorus(node);

        return primitive;
    }
}
