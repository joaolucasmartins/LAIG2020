attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform float sizeM;
uniform float sizeN;
uniform float m;
uniform float n;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
// uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = vec2(n / sizeN, m / sizeM);
    if (aTextureCoord.x == 1.0)
        vTextureCoord.x += 1.0 / sizeN;
    if (aTextureCoord.y == 1.0)
        vTextureCoord.y += 1.0 / sizeM;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
