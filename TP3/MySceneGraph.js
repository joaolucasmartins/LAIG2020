const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var ANIMATIONS_INDEX = 6;
var SPRITESHEETS_INDEX = 7;
var NODES_INDEX = 8;

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
        this.cameras = [];
        this.stop = false;

        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = {}; // Temporary struct that holds nodes before attribution to their parents
        this.materials = {};
        this.textDict = {};
        this.animations = {};
        this.spritesheetDict = {};
        this.textStack = []; //stack used for texture hierarchy
        this.matStack = []; //stack for material hierarchy

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
        this.primitiveCreator = new MyPrimitiveCreator(this.reader, this.scene, this.spritesheetDict);
    }

    /**
     * Distribute descendants.
     * Iterates over descendantNames of the current node and fetches the respective descendant node object.
     * The descendant nodes are saved in the current node.
     * @param {Node} node - where the descendants will be stored
     */
    distributeDescendants(node) {
        if (node.descendantNames == undefined) // Already processed
            return null;

        for (var i = 0; i < node.descendantNames.length; ++i) {
            var currentNodeName = node.descendantNames[i];

            if (!(currentNodeName in this.nodes)) {
                this.onXMLMinorError("Reference to Node '" + currentNodeName + "' in node '" + node.id + "' invalid. Reference ignored.");
                continue;
            }

            if (node.descendants.find(n => (n.id === currentNodeName)) != undefined) {
                this.onXMLMinorError("Repeated reference to Node '" + currentNodeName + "' in node '" + node.id + "'.");
                continue;
            }

            var currNode = this.nodes[currentNodeName];
            node.descendants.push(currNode);
            this.distributeDescendants(currNode);
        }
        delete node.descendantNames; // Not needed anymore

        return null;
    }

    addGameObject(name, placeholder) {
        if (!(name in this.nodes)) {
            this.onXMLMinorError("No specified geometry for " + name + ". Assuming placeholder");
            this.gameObjects[name] = placeholder;
        } else
            this.gameObjects[name] = this.nodes[name];

    }

    postProcessNodes() {
        if (this.rootNode == null)
            return "Root node undefined/missing. Can't continue.";

        this.gameObjects = [];
        let tilePlaceholder = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.addGameObject("whiteTile", tilePlaceholder);
        this.addGameObject("blackTile", tilePlaceholder);
        this.addGameObject("whitePiece", tilePlaceholder);
        this.addGameObject("blackPiece", tilePlaceholder);

        this.distributeDescendants(this.rootNode);
        delete this.nodes; // No need reference to nodes anymore
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
        error = this.postProcessNodes();
        if (error != null) {
            this.onXMLError(error);
            return;
        }
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


        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1) {
            this.onXMLMinorError("tag <animations> missing");
            NODES_INDEX--; // Decrease nodes index if there is no animations tag
            SPRITESHEETS_INDEX--;
        }
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1) {
            this.onXMLMinorError("tag <spritesheets> missing");
            NODES_INDEX--;
        }
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            if ((error = this.parseSpritesheets(nodes[index])) != null)
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
        var id = this.reader.getString(rootNode, 'id', false);
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;


        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length', false);
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Returns a new camera and its id as defined in a given camera Node.
     */
    parseCamera(cameraNode, cameras) {
        var nodeDict = this.createDict(cameraNode);

        var id;
        if ((id = this.reader.getString(cameraNode, "id", false)) == null)
            return "Missing 'id' attribute in a camera";
        var postWarningMsg = "camera with id '" + id + "'";

        // Common attributes for both camera
        var near = this.parseFloat(cameraNode, "near", postWarningMsg);
        if (typeof near === 'string') return near;

        var far = this.parseInt(cameraNode, "far", postWarningMsg);
        if (typeof far === 'string') return far;

        if (!("from" in nodeDict))
            return "Missing 'from' tag in " + postWarningMsg;
        if (!("to" in nodeDict))
            return "Missing 'to' tag in " + postWarningMsg;

        var position = this.parseCoordinates3D(nodeDict["from"], "'from' tag in " + postWarningMsg);
        if (typeof position === 'string') return position;

        var target = this.parseCoordinates3D(nodeDict["to"], "'to' tag in " + postWarningMsg);
        if (typeof target === 'string') return target;

        var camera;
        if (cameraNode.nodeName === "perspective") {
            var angle = this.parseFloat(cameraNode, "angle", postWarningMsg);
            if (typeof angle === 'string') return angle;
            camera = new CGFcamera(angle, near, far, position, target);

        } else if (cameraNode.nodeName === "ortho") {
            var left = this.parseFloat(cameraNode, "left", postWarningMsg);
            if (typeof left === 'string') return left;
            var right = this.parseFloat(cameraNode, "right", postWarningMsg);
            if (typeof right === 'string') return right;
            var top = this.parseFloat(cameraNode, "top", postWarningMsg);
            if (typeof top === 'string') return top;
            var bottom = this.parseFloat(cameraNode, "bottom", postWarningMsg);
            if (typeof bottom === 'string') return bottom;

            var up;
            if (!("up" in nodeDict))
                up = [0, 1, 0];
            else {
                up = this.parseCoordinates3D(nodeDict["up"], "'up' tag in " + postWarningMsg);
                if (typeof up === 'string') return up;
            }

            camera = new CGFcameraOrtho(left, right, top, bottom, near, far, position, target, up);
        } else
            return "Invalid camera type " + cameraNode.nodeName + postWarningMsg;

        cameras[id] = camera;
        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var cameras = {};
        var children = viewsNode.children;
        var error;

        for (var i = 0; i < children.length; i++) {
            var child = children[i];

            if ((error = this.parseCamera(child, cameras)) != null) {
                this.onXMLMinorError(error + ". Camera not parsed.");
                continue;
            }
        }

        var cameraIds = Object.keys(cameras);
        if (cameraIds.length < 1) {
            this.onXMLMinorError("No camera defined. Using default camera.");
            this.scene.initDefaultCamera();
        } else {
            var defaultCameraId = this.reader.getString(viewsNode, "default", false);
            if (defaultCameraId == null) {
                this.onXMLMinorError("No default camera given. Using camera '" + cameraIds[0] + "' as default.");
                defaultCameraId = cameraIds[0];
            } else if (!cameraIds.includes(defaultCameraId)) {
                this.onXMLMinorError("No such camera with id '" + defaultCameraId +
                    "'. Using camera '" + cameraIds[0] + "' as default.");
                defaultCameraId = cameraIds[0];
            }
            this.scene.initCameras(cameras, cameraIds, defaultCameraId);
        }

        return null;
    }

    /**
     * Auxiliary function for parsing xml sections.
     * Saves all the atributes from the current section into a dictionary.
     * The keys are the attribute name and values are the atribute's contents.
     * @param {*} node - section to be saved into dicitonary.
     */
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
            var lightId = this.reader.getString(children[i], 'id', false);
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
                    if (attributeTypes[j] == "boolean") {
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    }
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
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var name = this.reader.getString(children[i], 'id', false);
            if (name == null) {
                this.onXMLMinorError("missing 'id' attribute in a texture.");
                continue;
            }

            var path = this.reader.getString(children[i], 'path', false);
            if (name == null) {
                this.onXMLMinorError("missing 'path' attribute in texture with id " + name);
                continue;
            }

            var text = new CGFtexture(this.scene, path);
            this.textDict[name] = text; // saving texture in Dict for later use
        }

        return null;
    }

    /**
     * Parses the atributes of a <material> node in the xml file.
     * @param {*} id - id of the current material node.
     * @param {*} materialNode - the atributes of the material node.
     */
    parseMaterial(id, materialNode) {
        var nodeDict = this.createDict(materialNode);
        var postWarningMsg = " material with id " + id;

        if (!("specular" in nodeDict))
            return "Missing specular tag in" + postWarningMsg;
        if (!("diffuse" in nodeDict))
            return "Missing diffuse tag in" + postWarningMsg;
        if (!("ambient" in nodeDict))
            return "Missing ambient tag in" + postWarningMsg;
        if (!("emissive" in nodeDict))
            return "Missing emissive tag in" + postWarningMsg;
        if (!("shininess" in nodeDict))
            return "Missing shininess tag in" + postWarningMsg;

        var shininess = this.parseFloat(nodeDict["shininess"], "value", postWarningMsg);
        if (typeof shininess === 'string') return shininess;
        var specular = this.parseColor(nodeDict["specular"], "'specular' tag in" + postWarningMsg);
        if (typeof specular === 'string') return specular;
        var diffuse = this.parseColor(nodeDict["diffuse"], "'diffuse' tag in" + postWarningMsg);
        if (typeof diffuse === 'string') return diffuse;
        var ambient = this.parseColor(nodeDict["ambient"], "'ambient' tag in" + postWarningMsg);
        if (typeof ambient === 'string') return ambient;
        var emissive = this.parseColor(nodeDict["emissive"], "'emissive' tag in" + postWarningMsg);
        if (typeof emissive === 'string') return emissive;

        var appearance = new CGFappearance(this.scene);
        appearance.setShininess(shininess);
        appearance.setSpecular(...specular);
        appearance.setDiffuse(...diffuse);
        appearance.setAmbient(...ambient);
        appearance.setEmission(...emissive);
        this.materials[id] = appearance;

        return null;
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

            if (this.reader.hasAttribute(children[i], 'id')) {
                // Get id of the current material.
                var materialID = this.reader.getString(children[i], 'id', false);

                // Checks for repeated IDs.
                if (this.materials[materialID] != null)
                    return "ID must be unique for each material (conflict: ID = " + materialID + ")";

                var error;
                if ((error = this.parseMaterial(materialID, children[i])) != null)
                    this.onXMLMinorError(error + ". Material not parsed.");
            } else
                this.onXMLMinorError("Missing 'id' attribute in a material");
        }
        return null;
    }

    /**
     * Parses the atributes of a <keyframe> node in the xml file.
     * @param {*} id - id of the current keyframe node.
     * @param {*} keyframeNode - the atributes of the keyframe node.
     */
    parseKeyframe(keyframeNode) {
        var children = keyframeNode.children;
        var transformation = [];
        if (children.length != 5)
            return "invalid number of transformations";


        var translationNode = children[0];
        if (translationNode.nodeName != "translation")
            return "expected 'translationNode' but got " + translationNode.nodeName;
        var translation = this.parseTranslation(translationNode, "in translation node");
        if (typeof translation === "string") return translation;

        var rotationXNode = children[1];
        if (rotationXNode.nodeName != "rotation")
            return "expected 'rotation' but got " + rotationXNode.nodeName;
        var rotationX = this.parseRotation(rotationXNode, "in rotation X node");
        if (typeof rotationX === "string") return rotationX;
        if (rotationX[1] != "x") return "expected rotation in X";

        var rotationYNode = children[2];
        if (rotationYNode.nodeName != "rotation")
            return "expected 'rotation' but got " + rotationYNode.nodeName;
        var rotationY = this.parseRotation(rotationYNode, "in rotation Y node")
        if (typeof rotationY === "string") return rotationY;
        if (rotationY[1] != "y") return "expected rotation in Y";

        var rotationZNode = children[3];
        if (rotationZNode.nodeName != "rotation")
            return "expected 'rotation' but got " + rotationZNode.nodeName;
        var rotationZ = this.parseRotation(rotationZNode, "in rotation Z node")
        if (typeof rotationZ === "string") return rotationZ;
        if (rotationZ[1] != "z") return "expected rotation in Z";

        var scaleNode = children[4];
        if (scaleNode.nodeName != "scale")
            return "expected 'scale' but got " + scaleNode.nodeName;
        var scale = this.parseScale(scaleNode, "in scale node");
        if (typeof scale === "string") return scale;

        var rotation = [rotationX[0], rotationY[0], rotationZ[0]]; // TODO Convert indices to Proprieties
        transformation = new Transformation([translation, rotation, scale]);
        return transformation;
    }

    /**
     * Parses the atributes of a <animation> node in the xml file.
     * @param {*} id - id of the current animation node.
     * @param {*} animationNode - the atributes of the animation node.
     */
    parseAnimation(id, animationNode) {
        // Checks for repeated IDs.
        if (this.animations[id] != null)
            return "ID must be unique for each animation (conflict: ID = " + animationID + ")";

        var postWarningMsg = " animation with id " + id;
        var children = animationNode.children;
        var keyframes = {};

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "keyframe") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in" + postWarningMsg);
                continue;
            }

            if (this.reader.hasAttribute(children[i], 'instant')) {
                // Get instant of the current keyframe.
                var instant = this.parseFloat(children[i], 'instant', postWarningMsg);
                if (typeof instant === 'string') return instant;
                if (instant in keyframes) {
                    this.onXMLMinorError("instant must be unique for each keyframe (conflict: ID = " + instant + ") in" + postWarningMsg);
                    continue;
                }

                var keyframe = this.parseKeyframe(children[i]);
                if (typeof keyframe === 'string')
                    this.onXMLMinorError(keyframe + ". Keyframe with instant '" +
                        instant + "' not parsed in animation '" + id + "'");
                else
                    keyframes[instant] = keyframe;

            } else
                this.onXMLMinorError("Missing 'instant' attribute in a keyframe" + postWarningMsg);
        }

        var animation = new MyKeyFrameAnimation(this.scene, keyframes);
        this.animations[id] = animation;
        return null;
    }

    /**
     * Parses the <animations> block.
     * @param {materials block element} animationsNode
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + "> in 'animations' tag");
                continue;
            }

            if (this.reader.hasAttribute(children[i], 'id')) {
                var animationID = this.reader.getString(children[i], 'id', false);

                var error;
                if ((error = this.parseAnimation(animationID, children[i])) != null)
                    this.onXMLMinorError(error + ". animation not parsed.");
            } else
                this.onXMLMinorError("Missing 'id' attribute in an animation");
        }

        return null;
    }

    parseSpritesheet(node, postWarningMsg) {
        var path;
        if ((path = this.reader.getString(node, 'path', false)) == null)
            return "failed to get path" + postWarningMsg;

        var sizeM = this.parseInt(node, "sizeM", postWarningMsg);
        if (typeof sizeM === 'string') return sizeM;

        var sizeN = this.parseInt(node, "sizeN", postWarningMsg);
        if (typeof sizeN === 'string') return sizeN;

        let sheet = new MySpritesheet(this.scene, path, sizeM, sizeN);
        if (sheet == null)
            return "could not create spritesheet";
        else
            return sheet;
    }

    parseSpritesheets(node) {
        var children = node.children;

        //saving texture id and path in textures dictionary
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var id = this.reader.getString(children[i], 'id', false);
            if (id == null) {
                this.onXMLMinorError("missing 'id' attribute in a spritesheet.");
                continue;
            }

            var spritesheet = this.parseSpritesheet(children[i], " in spritesheet with id " + id);
            if (typeof spritesheet === "string")
                this.onXMLMinorError(spritesheet);
            else {
                if ((id in this.spritesheetDict))
                    this.onXMLMinorError("ID must be unique for each spritesheet (conflict: ID = " + id + ")");
                else
                    this.spritesheetDict[id] = spritesheet;
            }
        }

        return null;
    }

    /**
     * Parses and assigns a texture to the respective node.
     * @param {Node} node - where the texture will be saved.
     * @param {node element} textNode - texture's atributes.
     */
    assignNodeTexture(node, textNode) {
        var afs, aft;
        var textureId, texture;
        if ((textureId = this.reader.getString(textNode, "id", false)) == null)
            return "Missing 'id' attribute in 'texture' tag";

        if (textureId == "clear")
            texture = "clear";
        else { // Get Afs and Aft
            var textureDict = this.createDict(textNode);
            if (!("amplification" in textureDict)) {
                //this.onXMLMinorError("Missing 'amplification' tag in node with id '" + TODO
                //node.id + "'. Using default value 1.0 for afs and aft attributes.");
                afs = 1.0;
                aft = 1.0;
            } else {
                var amplificationNode = textureDict["amplification"];
                afs = this.parseFloat(amplificationNode, "afs", "'texture' tag in node with id '"
                    + node.id + "'. Using default value 1.0");
                aft = this.parseFloat(amplificationNode, "aft", "'texture' tag in node with id '"
                    + node.id + "'. Using default value 1.0");

                if (typeof afs === 'string') {
                    this.onXMLMinorError(afs);
                    afs = 1.0;
                }
                if (typeof aft === 'string') {
                    this.onXMLMinorError(aft);
                    aft = 1.0;
                }
            }

            if (textureId == "null")
                texture = "null"
            else {
                if (!(textureId in this.textDict))
                    return "Undefined texture with id " + texture;
                texture = this.textDict[textureId];
            }
        }

        node.updateTexture(texture, afs, aft);   //saving texture details in node object
        return null;
    }

    /**
     * Parses transformations and assigns them to the curent node.
     * @param {Node} node - where the transformations will be applied.
     * @param {node element} transfNode - atributes from the transformations node.
     */
    parseTransformations(node, transfNode) {
        var children = transfNode.children;
        var matrix = mat4.create(); //identity matrix
        var baseWarningMsg = "node with id '" + node.id + "'. Ignoring transformation.";

        for (var i = 0; i < children.length; i++) {
            var nodeName = children[i].nodeName;

            switch (nodeName) {
                case "translation":
                    var res = this.parseTranslation(children[i], baseWarningMsg);
                    if (typeof res === "string")
                        this.onXMLMinorError(res);

                    mat4.translate(matrix, matrix, res);
                    break;
                case "rotation":
                    var res = this.parseRotation(children[i], baseWarningMsg);
                    if (typeof res === "string")
                        this.onXMLMinorError(res);
                    var rotationAngle = res[0];
                    var axis = [res[1] == "x", res[1] == "y", res[1] == "z"];
                    mat4.rotate(matrix, matrix, rotationAngle, axis);
                    break;

                case "scale":
                    var res = this.parseScale(children[i], baseWarningMsg);
                    if (typeof res === "string")
                        this.onXMLMinorError(res);

                    mat4.scale(matrix, matrix, res);
                    break;

                default:
                    this.onXMLMinorError("Invalid transformation " + nodeName + " in node '" + node.id + "'");
            }

            node.transfMat = matrix;    //assign node transformations
        }
        return null;
    }

    /**
     * Parses node information
     * @param {string} nodeName - id of the node that's being processed.
     * @param {dictionary} nodeDict - dictionary with the node's atributes.
     */
    parseNode(nodeName, nodeDict) {
        var node = new Node(this.scene, nodeName);

        if (nodeName == this.idRoot) {
            this.rootNode = node;
        }

        //node transformations
        if ("transformations" in nodeDict) {
            var error = this.parseTransformations(node, nodeDict["transformations"]);
            if (error != null) {
                this.onXMLMinorError(error + "in node'" + nodeName + "'. No transformations were applied.");
                node.transfMat = mat4.create();
            }
        }

        //parse and assign texture to node
        var error;
        if ((error = this.assignNodeTexture(node, nodeDict["texture"])) != null) {
            this.onXMLMinorError(error + " in node '" + nodeName + "'. Using 'null' texture");
            node.updateTexture("null", 1.0, 1.0);   //saving texture details in node object
        }

        //assign material to current node
        if (!("material" in nodeDict)) {
            this.onXMLMinorError("Missing 'material' tag in node '" + nodeName + "'. Using 'null' material");
            node.setMaterial("null");
        }
        else {
            var materialID = this.reader.getString(nodeDict["material"], "id", false);

            if (materialID == "null")
                node.setMaterial("null");
            else if (!(materialID in this.materials)) {
                this.onXMLMinorError("Invalid material id '" + materialID + "' in node '" + nodeName + "'. Using 'null' material.");
                node.setMaterial("null");
            } else
                node.setMaterial(this.materials[materialID]);
        }

        if ("animationref" in nodeDict) {
            var animationId = this.reader.getString(nodeDict["animationref"], "id", false);
            if (!(animationId))
                this.onXMLMinorError("Invalid animation id '" + animationId + "' in node '" + nodeName + "'");
            else
                node.addAnimation(this.animations[animationId]);
        }

        this.nodes[nodeName] = node;

        var error = this.parseDescendants(node, nodeDict["descendants"].children);
        if (typeof error === "string")
            this.onXMLMinorError(error);
        return null;
    }

    /**
     * Parses <descendants> block of the current node.
     * Saves the desncendants into the node according to their type.
     * @param {Node} node - where the descendants wil be stored.
     * @param {node element} desc - descendants.
     */
    parseDescendants(node, desc) {
        for (var i = 0; i < desc.length; i++) {
            if (desc[i].nodeName == "noderef") {
                var descId = this.reader.getString(desc[i], "id", false);
                if (descId == null) {
                    this.onXMLMinorError("unable to parse field 'id' of a 'noderef' tag in node '"
                        + node.id + "'");
                } else
                    node.descendantNames.push(descId)
            }
            else {  //leaf
                var type = this.reader.getString(desc[i], "type", false);
                var primitive = this.primitiveCreator.createPrimitive(desc[i], type, node.afs, node.aft);
                if (typeof primitive === 'string')
                    this.onXMLMinorError(primitive + "leaf '" + type + "' in node id '" +
                        node.id + "'. Primitive not added.");
                else {
                    if (type == "spriteanim")
                        node.addAnimation(primitive)
                    else
                        node.addPrimitive(primitive);
                }
            }
        }

        if (desc.length == 0)
            return "leaf with id '" + node.id + "' has no descendants.";
        return null;
    }

    /**
    * Parses the <nodes> block.
    * @param {nodes block element} nodesNode
    */
    parseNodes(nodesNode) {
        var children = nodesNode.children;
        this.nodes = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var nodeID = this.reader.getString(children[i], 'id', false);
            if (nodeID == null) {
                this.onXMLMinorError("No ID defined for node number " + i);
                continue;
            }

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null) {
                this.onXMLMinorError("ID must be unique for each node (conflict: ID = " + nodeID + ")");
                continue;
            }

            var nodeDict = this.createDict(children[i]);
            this.parseNode(nodeID, nodeDict);
        }
    }

    /**
     * Parses the bolean value of a node
     * @param {block element} node 
     * @param {string} name - attribute id.
     * @param {string} messageError - message to be displayed in case of error.
     */
    parseBoolean(node, name, messageError) {
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name, false);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false))) {
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");
            boolVal = true;
        }

        return boolVal;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x', false);
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y', false);
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z', false);
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
        var w = this.reader.getFloat(node, 'w', false);
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
        var r = this.reader.getFloat(node, 'r', false);
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g', false);
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b', false);
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a', false);
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    parseTranslation(node, baseWarningMsg) {
        var x = 0, y = 0, z = 0;
        var postWarningMsg = "'translation' tag in " + baseWarningMsg;

        x = this.parseFloat(node, "x", postWarningMsg);
        if (typeof (x = this.parseFloat(node, "x", postWarningMsg)) === 'string')
            return x;

        y = this.parseFloat(node, "y", postWarningMsg);
        if (typeof (y = this.parseFloat(node, "y", postWarningMsg)) === 'string')
            return y;

        z = this.parseFloat(node, "z", postWarningMsg);
        if (typeof (z = this.parseFloat(node, "z", postWarningMsg)) === 'string')
            return z;

        return [x, y, z];
    }

    parseRotation(node, baseWarningMsg) {
        var axis, angle = 0;
        var postWarningMsg = "'rotation' tag in " + baseWarningMsg;
        axis = this.reader.getString(node, "axis", false);

        if (axis != "x" && axis != "y" && axis != "z")
            return "unable to parse field 'axis' of the " + postWarningMsg;
        if (typeof (angle = this.parseFloat(node, "angle", postWarningMsg)) === 'string')
            return angle;

        var rad = angle * DEGREE_TO_RAD;
        return [rad, axis];
    }

    parseScale(node, baseWarningMsg) {
        var sx = 0, sy = 0, sz = 0;
        var postWarningMsg = "'scale' tag in " + baseWarningMsg;

        if (typeof (sx = this.parseFloat(node, "sx", postWarningMsg)) === 'string')
            return sx;

        if (typeof (sy = this.parseFloat(node, "sy", postWarningMsg)) === 'string')
            return sy;

        if (typeof (sz = this.parseFloat(node, "sz", postWarningMsg)) === 'string')
            return sz;

        return [sx, sy, sz];
    }

    /**
     * Parses float value from node.
     * @param {block element} node 
     * @param {string} floatName - attribute id
     * @param {string} messageError - message to be displayed in case of error
     */
    parseFloat(node, floatName, messageError) {
        var res = this.reader.getFloat(node, floatName, false);
        if (res == null || isNaN(res))
            return "unable to parse field '" + floatName + "' of the " + messageError;
        return res;
    }


    /**
     * Parses integer value from node.
     * @param {block element} node 
     * @param {string} intName - attribute id
     * @param {string} messageError - message to be displayed in case of error
     */
    parseInt(node, intName, messageError) {
        var res = this.reader.getInteger(node, intName, false);
        if (res == null || isNaN(res))
            return "unable to parse field '" + intName + "' of the " + messageError;
        return res;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    display() {
        this.rootNode.display(this.matStack, this.textStack);
        //this.scene.orchestrator.display();
        //this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(time) {
        // this.rootNode.update(time);

    }
}
