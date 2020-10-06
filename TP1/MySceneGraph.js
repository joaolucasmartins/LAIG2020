const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;
var DEF_FOV = 0.4;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = {}; // Temporary struct that holds nodes before attribution to their parents
        this.materials = {};
        this.textDict = {};

        this.rootNode = null;
        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    distributeDescendants(node) {
        for (var i = 0; i < node.descendantNames.length; ++i) {
            var currentNodeName = node.descendantNames[i];
            if (!(currentNodeName in this.nodes)) {
                this.onXMLError("Node " + currentNodeName + " missing");
                return true;
            }

            var currNode = this.nodes[currentNodeName];
            node.descendants.push(currNode);
            this.distributeDescendants(currNode);
        }
        return null;
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        // TODO Check for acyclic graphs
        this.distributeDescendants(this.rootNode);
        delete this.nodes;

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;


        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    parseCamera(cameraNode) {
        var nodeDict = this.createDict(cameraNode);

        var near = this.reader.getFloat(cameraNode, "near", true);
        var far = this.reader.getInteger(cameraNode, "far", true);
        //var angle = this.reader.getFloat(cameraNode, "angle", true); // TODO

        if (!("from" in nodeDict || "to" in nodeDict))
            this.onXMLError("Invalid camera syntax!");

        var position = this.parseCoordinates3D(nodeDict["from"], "From 3d coords failed")
        var target = this.parseCoordinates3D(nodeDict["to"], "To 3d coords failed")

        return new CGFcamera(DEF_FOV, near, far, position, target);
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var cameras = [];
        var children = viewsNode.children;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            var childName = child.nodeName;

            if ("perspective" == childName) {
                cameras.push(this.parseCamera(child));
            } else if ("ortho" == childName) {
            }
        }
        if (cameras.length < 1)
            this.onXMLError("No camera!");

        delete this.scene.camera;
        this.scene.initCameras(cameras);

        return null;
    }

    createDict(node) {
        var children = node.children;
        var dict = {};
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName in dict)
                return children[i].nodeName;
            dict[children[i].nodeName] = children[i];
        }
        return dict;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        this.ambient = [];
        this.background = [];

        var nodeDict = this.createDict(illuminationsNode);

        var color = this.parseColor(nodeDict["ambient"], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(nodeDict["background"], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        //saving texture id and path in textures dictionary
        for (var i = 0; i < children.length; i++) {
            var path = this.reader.getString(children[i], 'path', true);
            var name = this.reader.getString(children[i], 'id', true);

            var text = new CGFtexture(this.scene, path);
            this.textDict[name] = text; //saving texture in Dict for further use
        }

        return null;
    }


    parseMaterial(materialNode) {
        var nodeDict = this.createDict(materialNode);

        if (!("specular" in nodeDict || "diffuse" in nodeDict || "specular" in nodeDict ||
            "ambient" in nodeDict || "emissive" in nodeDict))
            this.onXMLError("Invalid material syntax!");

        var appearance = new CGFappearance(this.scene);
        var shininess = this.reader.getFloat(nodeDict["shininess"], "value", true);
        var specular = this.parseColor(nodeDict["specular"], materialNode.nodeName + " couldn't get color");
        var diffuse = this.parseColor(nodeDict["diffuse"], materialNode.nodeName + " couldn't get color");
        var ambient = this.parseColor(nodeDict["ambient"], materialNode.nodeName + " couldn't get color");
        var emissive = this.parseColor(nodeDict["emissive"], materialNode.nodeName + " couldn't get color");

        appearance.setShininess(shininess);
        appearance.setSpecular(specular);
        appearance.setDiffuse(diffuse);
        appearance.setAmbient(ambient);
        appearance.setEmission(emissive);
        return appearance;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.

            if (this.reader.hasAttribute(children[i], 'id')) {
                var materialID = this.reader.getString(children[i], 'id');
                if (materialID == null)
                    return "no ID defined for material";

                // Checks for repeated IDs.
                if (this.materials[materialID] != null)
                    return "ID must be unique for each light (conflict: ID = " + materialID + ")";

                this.materials[materialID] = this.parseMaterial(children[i]);
            }

            this.materials[materialID] = null; //inherit material from parent
        }
        return null;
    }

    /**
     * Assigns a texture to the respective node
     * @param {node element} node 
     * @param {texture nodes} textNode 
     */
    assignNodeTexture(node, textNode) {

        var afs = 1, dfs = 1; //amplification

        var name = null;

        //check if texture field is null
        name = this.reader.getString(textNode, "id", true);

        if (name != "null") {

            if (!(name in this.textDict))
                this.onXMLError("Undefined node texture!");

            if (textNode.children.length != 0) { //verification for non mandatory fields
                afs = this.reader.getFloat(textNode.children[0], "afs", false);
                dfs = this.reader.getFloat(textNode.children[0], "aft", false);
            }

            node.updateTexture(this.textDict[name], afs, dfs);   //saving texture details in node object
        }

        return null;
    }

    parseTransformations(node, transfNode) {

        var children = transfNode.children;

        var matrix = mat4.create(); //identity matrix

        for (var i = 0; i < children.length; i++) {
            var nodeName = children[i].nodeName;

            var x = 0, y = 0, z = 0;
            var axis, angle = 0;
            switch (nodeName) {

                case "translation":

                    x = this.reader.getFloat(children[i], "x", true);
                    y = this.reader.getFloat(children[i], "y", true);
                    z = this.reader.getFloat(children[i], "z", true);
                    mat4.translate(matrix, matrix, vec3.fromValues(x, y, z));
                    break;

                case "rotation":

                    axis = this.reader.getString(children[i], "axis", true);
                    angle = this.reader.getFloat(children[i], "angle", true);
                    var rad = angle * DEGREE_TO_RAD;
                    mat4.rotate(matrix, matrix, rad, vec3.fromValues(axis == "x", axis == "y", axis == "z"));
                    break;

                case "scale":

                    x = this.reader.getFloat(children[i], "sx", true);
                    y = this.reader.getFloat(children[i], "sy", true);
                    z = this.reader.getFloat(children[i], "sz", true);
                    mat4.scale(matrix, matrix, vec3.fromValues(x, y, z));
                    break;
                default:
                    this.onXMLError("Invalid Transformation!");

            }

            node.transfMat = matrix;    //assign node transformations

        }
    }

    /**
     * Parses node information
     * @param {node element} node 
     */
    parseNode(nodeName, nodeDict) {

        if (!("material" in nodeDict || "texture" in nodeDict))
            this.onXMLError("Missing mandatory fields (node)!");

        var node = new Node(this.scene, nodeName, null, null);

        if (nodeName == this.idRoot) {
            this.rootNode = node;
        }

        //parse and assign texture to node
        this.assignNodeTexture(node, nodeDict["texture"]);

        //assign material to current node
        var materialID = this.reader.getString(nodeDict["material"], "id", true);

        if (materialID != "null") {
            if (!(materialID in this.materials))
                this.onXMLError("Invalid material id!");

            node.setMaterial(this.materials[materialID]);
        }

        //node transformations
        if ("transformations" in nodeDict) {
            this.parseTransformations(node, nodeDict["transformations"]);
        }

        // TODO Verify
        this.nodes[nodeName] = node;
        this.parseDescendants(node, nodeDict["descendants"].children);
    }

    parseDescendants(node, desc) {
        for (var i = 0; i < desc.length; i++) {
            if (desc[i].nodeName == "noderef") {
                var descId = this.reader.getString(desc[i], "id", true);
                node.descendantNames.push(descId)
            }
            else {  //leaf
                var type = this.reader.getString(desc[i], "type", true);
                node.addPrimitive(type, desc[i], this.reader);
            }
        }
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        var grandChildren = [];
        this.nodes = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');

            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            var name = this.reader.getString(children[i], "id", true);

            var nodeDict = this.createDict(children[i]);
            this.parseNode(name, nodeDict);
        }
    }

    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
        this.rootNode.display();
    }
}
