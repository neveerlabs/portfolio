"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from "react";
function pointerPrototype() {
    return {
        id: -1,
        texcoordX: 0,
        texcoordY: 0,
        prevTexcoordX: 0,
        prevTexcoordY: 0,
        deltaX: 0,
        deltaY: 0,
        down: false,
        moved: false,
        color: { r: 0, g: 0, b: 0 },
    };
}
export default function SmokeyCursor({ simulationResolution=*
const canvasRef=*
useEffect(()=*
const canvas=*
        if (!canvas)
            return; // Guard canvas early
        // Pointer and config setup
let pointers=*
        // All these are guaranteed numbers due to destructuring defaults
        // So we cast them to remove TS warnings:
let config=*
            SIM_RESOLUTION: simulationResolution,
            DYE_RESOLUTION: dyeResolution,
            CAPTURE_RESOLUTION: captureResolution,
            DENSITY_DISSIPATION: densityDissipation,
            VELOCITY_DISSIPATION: velocityDissipation,
            PRESSURE: pressure,
            PRESSURE_ITERATIONS: pressureIterations,
            CURL: curl,
            SPLAT_RADIUS: splatRadius,
            SPLAT_FORCE: splatForce,
            SHADING: enableShading,
            COLOR_UPDATE_SPEED: colorUpdateSpeed,
            PAUSED: false,
            BACK_COLOR: backgroundColor,
            TRANSPARENT: transparent,
        };
        // Get WebGL context (WebGL1 or WebGL2)
const { gl, ext }=*
        if (!gl || !ext)
            return;
        // If no linear filtering, reduce resolution
        if (!ext.supportLinearFiltering) {
config.DYE_RESOLUTION=*
config.SHADING=*
        }
        function getWebGLContext(canvas) {
const params=*
                alpha: true,
                depth: false,
                stencil: false,
                antialias: false,
                preserveDrawingBuffer: false,
            };
let gl=*
            if (!gl) {
gl=*
                    canvas.getContext("experimental-webgl", params));
            }
            if (!gl) {
                throw new Error("Unable to initialize WebGL.");
            }
const isWebGL2=*
let supportLinearFiltering=*
let halfFloat=*
            if (isWebGL2) {
                gl.getExtension("EXT_color_buffer_float");
supportLinearFiltering=*
            }
            else {
halfFloat=*
supportLinearFiltering=*
            }
            gl.clearColor(0, 0, 0, 1);
const halfFloatTexType=*
                ? gl.HALF_FLOAT
                : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;
            let formatRGBA;
            let formatRG;
            let formatR;
            if (isWebGL2) {
formatRGBA=*
formatRG=*
formatR=*
            }
            else {
formatRGBA=*
formatRG=*
formatR=*
            }
            return {
                gl,
                ext: {
                    formatRGBA,
                    formatRG,
                    formatR,
                    halfFloatTexType,
                    supportLinearFiltering,
                },
            };
        }
        function getSupportedFormat(gl, internalFormat, format, type) {
            if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
                // For WebGL2 fallback:
                if ("drawBuffers" in gl) {
const gl2=*
                    switch (internalFormat) {
                        case gl2.R16F:
                            return getSupportedFormat(gl2, gl2.RG16F, gl2.RG, type);
                        case gl2.RG16F:
                            return getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, type);
                        default:
                            return null;
                    }
                }
                return null;
            }
            return { internalFormat, format };
        }
        function supportRenderTextureFormat(gl, internalFormat, format, type) {
const texture=*
            if (!texture)
                return false;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
const fbo=*
            if (!fbo)
                return false;
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
const status=*
return status=*
        }
        function hashCode(s) {
            if (!s.length)
                return 0;
let hash=*
for (let i=*
hash=*
hash |=*
            }
            return hash;
        }
        function addKeywords(source, keywords) {
            if (!keywords)
                return source;
let keywordsString=*
            for (const keyword of keywords) {
keywordsString +=*
            }
            return keywordsString + source;
        }
function compileShader(type, source, keywords=*
const shaderSource=*
const shader=*
            if (!shader)
                return null;
            gl.shaderSource(shader, shaderSource);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.trace(gl.getShaderInfoLog(shader));
            }
            return shader;
        }
        function createProgram(vertexShader, fragmentShader) {
            if (!vertexShader || !fragmentShader)
                return null;
const program=*
            if (!program)
                return null;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.trace(gl.getProgramInfoLog(program));
            }
            return program;
        }
        function getUniforms(program) {
let uniforms=*
const uniformCount=*
for (let i=*
const uniformInfo=*
                if (uniformInfo) {
uniforms[uniformInfo.name]=*
                }
            }
            return uniforms;
        }
        class Program {
            program;
            uniforms;
            constructor(vertexShader, fragmentShader) {
this.program=*
this.uniforms=*
            }
            bind() {
                if (this.program)
                    gl.useProgram(this.program);
            }
        }
        class Material {
            vertexShader;
            fragmentShaderSource;
            programs;
            activeProgram;
            uniforms;
            constructor(vertexShader, fragmentShaderSource) {
this.vertexShader=*
this.fragmentShaderSource=*
this.programs=*
this.activeProgram=*
this.uniforms=*
            }
            setKeywords(keywords) {
let hash=*
                for (const kw of keywords) {
hash +=*
                }
let program=*
if (program=*
const fragmentShader=*
program=*
this.programs[hash]=*
                }
if (program=*
                    return;
                if (program) {
this.uniforms=*
                }
this.activeProgram=*
            }
            bind() {
                if (this.activeProgram) {
                    gl.useProgram(this.activeProgram);
                }
            }
        }
        // -------------------- Shaders --------------------
const baseVertexShader=*
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
vUv=*
vL=*
vR=*
vT=*
vB=*
gl_Position=*
      }
    `);
const copyShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
gl_FragColor=*
      }
    `);
const clearShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
gl_FragColor=*
      }
    `);
const displayShaderSource=*
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform sampler2D uDithering;
      uniform vec2 ditherScale;
      uniform vec2 texelSize;

      vec3 linearToGamma (vec3 color) {
color=*
          return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
      }

      void main () {
vec3 c=*
          #ifdef SHADING
vec3 lc=*
vec3 rc=*
vec3 tc=*
vec3 bc=*

float dx=*
float dy=*

vec3 n=*
vec3 l=*

float diffuse=*
c *=*
          #endif

float a=*
gl_FragColor=*
      }
    `;
const splatShader=*
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
vec2 p=*
p.x *=*
vec3 splat=*
vec3 base=*
gl_FragColor=*
      }
    `);
const advectionShader=*
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
vec2 st=*
vec2 iuv=*
vec2 fuv=*

vec4 a=*
vec4 b=*
vec4 c=*
vec4 d=*

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
          #ifdef MANUAL_FILTERING
vec2 coord=*
vec4 result=*
          #else
vec2 coord=*
vec4 result=*
          #endif
float decay=*
gl_FragColor=*
      }
    `, ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]);
const divergenceShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
float L=*
float R=*
float T=*
float B=*

vec2 C=*
if (vL.x < 0.0) { L=*
if (vR.x > 1.0) { R=*
if (vT.y > 1.0) { T=*
if (vB.y < 0.0) { B=*

float div=*
gl_FragColor=*
      }
    `);
const curlShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
float L=*
float R=*
float T=*
float B=*
float vorticity=*
gl_FragColor=*
      }
    `);
const vorticityShader=*
      precision highp float;
      precision highp sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
float L=*
float R=*
float T=*
float B=*
float C=*

vec2 force=*
force /=*
force *=*
force.y *=*

vec2 velocity=*
velocity +=*
velocity=*
gl_FragColor=*
      }
    `);
const pressureShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
float L=*
float R=*
float T=*
float B=*
float C=*
float divergence=*
float pressure=*
gl_FragColor=*
      }
    `);
const gradientSubtractShader=*
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
float L=*
float R=*
float T=*
float B=*
vec2 velocity=*
velocity.xy -=*
gl_FragColor=*
      }
    `);
        // -------------------- Fullscreen Triangles --------------------
const blit=*
const buffer=*
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
const elemBuffer=*
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);
return (target, doClear=*
                if (!gl)
                    return;
                if (!target) {
                    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                }
                else {
                    gl.viewport(0, 0, target.width, target.height);
                    gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
                }
                if (doClear) {
                    gl.clearColor(0, 0, 0, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                }
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            };
        })();
        // FBO variables
        let dye;
        let velocity;
        let divergence;
        let curlFBO;
        let pressureFBO;
        // WebGL Programs
const copyProgram=*
const clearProgram=*
const splatProgram=*
const advectionProgram=*
const divergenceProgram=*
const curlProgram=*
const vorticityProgram=*
const pressureProgram=*
const gradienSubtractProgram=*
const displayMaterial=*
        // -------------------- FBO creation --------------------
        function createFBO(w, h, internalFormat, format, type, param) {
            gl.activeTexture(gl.TEXTURE0);
const texture=*
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
const fbo=*
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            gl.viewport(0, 0, w, h);
            gl.clear(gl.COLOR_BUFFER_BIT);
const texelSizeX=*
const texelSizeY=*
            return {
                texture,
                fbo,
                width: w,
                height: h,
                texelSizeX,
                texelSizeY,
                attach(id) {
                    gl.activeTexture(gl.TEXTURE0 + id);
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    return id;
                },
            };
        }
        function createDoubleFBO(w, h, internalFormat, format, type, param) {
const fbo1=*
const fbo2=*
            return {
                width: w,
                height: h,
                texelSizeX: fbo1.texelSizeX,
                texelSizeY: fbo1.texelSizeY,
                read: fbo1,
                write: fbo2,
                swap() {
const tmp=*
this.read=*
this.write=*
                },
            };
        }
        function resizeFBO(target, w, h, internalFormat, format, type, param) {
const newFBO=*
            copyProgram.bind();
            if (copyProgram.uniforms.uTexture)
                gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
            blit(newFBO, false);
            return newFBO;
        }
        function resizeDoubleFBO(target, w, h, internalFormat, format, type, param) {
if (target.width=*
                return target;
target.read=*
target.write=*
target.width=*
target.height=*
target.texelSizeX=*
target.texelSizeY=*
            return target;
        }
        function initFramebuffers() {
const simRes=*
const dyeRes=*
const texType=*
const rgba=*
const rg=*
const r=*
const filtering=*
            gl.disable(gl.BLEND);
            if (!dye) {
dye=*
            }
            else {
dye=*
            }
            if (!velocity) {
velocity=*
            }
            else {
velocity=*
            }
divergence=*
curlFBO=*
pressureFBO=*
        }
        function updateKeywords() {
const displayKeywords=*
            if (config.SHADING)
                displayKeywords.push("SHADING");
            displayMaterial.setKeywords(displayKeywords);
        }
        function getResolution(resolution) {
const w=*
const h=*
const aspectRatio=*
let aspect=*
const min=*
const max=*
            if (w > h) {
                return { width: max, height: min };
            }
            return { width: min, height: max };
        }
        function scaleByPixelRatio(input) {
const pixelRatio=*
            return Math.floor(input * pixelRatio);
        }
        // -------------------- Simulation Setup --------------------
        updateKeywords();
        initFramebuffers();
let lastUpdateTime=*
let colorUpdateTimer=*
        function updateFrame() {
const dt=*
            if (resizeCanvas())
                initFramebuffers();
            updateColors(dt);
            applyInputs();
            step(dt);
            render(null);
            requestAnimationFrame(updateFrame);
        }
        function calcDeltaTime() {
const now=*
let dt=*
dt=*
lastUpdateTime=*
            return dt;
        }
        function resizeCanvas() {
const width=*
const height=*
if (canvas.width !=*
canvas.width=*
canvas.height=*
                return true;
            }
            return false;
        }
        function updateColors(dt) {
colorUpdateTimer +=*
if (colorUpdateTimer >=*
colorUpdateTimer=*
pointers.forEach((p)=*
p.color=*
                });
            }
        }
        function applyInputs() {
            for (const p of pointers) {
                if (p.moved) {
p.moved=*
                    splatPointer(p);
                }
            }
        }
        function step(dt) {
            gl.disable(gl.BLEND);
            // Curl
            curlProgram.bind();
            if (curlProgram.uniforms.texelSize) {
                gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (curlProgram.uniforms.uVelocity) {
                gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
            }
            blit(curlFBO);
            // Vorticity
            vorticityProgram.bind();
            if (vorticityProgram.uniforms.texelSize) {
                gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (vorticityProgram.uniforms.uVelocity) {
                gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
            }
            if (vorticityProgram.uniforms.uCurl) {
                gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1));
            }
            if (vorticityProgram.uniforms.curl) {
                gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
            }
            if (vorticityProgram.uniforms.dt) {
                gl.uniform1f(vorticityProgram.uniforms.dt, dt);
            }
            blit(velocity.write);
            velocity.swap();
            // Divergence
            divergenceProgram.bind();
            if (divergenceProgram.uniforms.texelSize) {
                gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (divergenceProgram.uniforms.uVelocity) {
                gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
            }
            blit(divergence);
            // Clear pressure
            clearProgram.bind();
            if (clearProgram.uniforms.uTexture) {
                gl.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0));
            }
            if (clearProgram.uniforms.value) {
                gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
            }
            blit(pressureFBO.write);
            pressureFBO.swap();
            // Pressure
            pressureProgram.bind();
            if (pressureProgram.uniforms.texelSize) {
                gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (pressureProgram.uniforms.uDivergence) {
                gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
            }
for (let i=*
                if (pressureProgram.uniforms.uPressure) {
                    gl.uniform1i(pressureProgram.uniforms.uPressure, pressureFBO.read.attach(1));
                }
                blit(pressureFBO.write);
                pressureFBO.swap();
            }
            // Gradient Subtract
            gradienSubtractProgram.bind();
            if (gradienSubtractProgram.uniforms.texelSize) {
                gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (gradienSubtractProgram.uniforms.uPressure) {
                gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressureFBO.read.attach(0));
            }
            if (gradienSubtractProgram.uniforms.uVelocity) {
                gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1));
            }
            blit(velocity.write);
            velocity.swap();
            // Advection - velocity
            advectionProgram.bind();
            if (advectionProgram.uniforms.texelSize) {
                gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
            if (!ext.supportLinearFiltering &&
                advectionProgram.uniforms.dyeTexelSize) {
                gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
            }
const velocityId=*
            if (advectionProgram.uniforms.uVelocity) {
                gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
            }
            if (advectionProgram.uniforms.uSource) {
                gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
            }
            if (advectionProgram.uniforms.dt) {
                gl.uniform1f(advectionProgram.uniforms.dt, dt);
            }
            if (advectionProgram.uniforms.dissipation) {
                gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
            }
            blit(velocity.write);
            velocity.swap();
            // Advection - dye
            if (!ext.supportLinearFiltering &&
                advectionProgram.uniforms.dyeTexelSize) {
                gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
            }
            if (advectionProgram.uniforms.uVelocity) {
                gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
            }
            if (advectionProgram.uniforms.uSource) {
                gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
            }
            if (advectionProgram.uniforms.dissipation) {
                gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
            }
            blit(dye.write);
            dye.swap();
        }
        function render(target) {
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
            drawDisplay(target);
        }
        function drawDisplay(target) {
const width=*
const height=*
            displayMaterial.bind();
            if (config.SHADING && displayMaterial.uniforms.texelSize) {
                gl.uniform2f(displayMaterial.uniforms.texelSize, 1 / width, 1 / height);
            }
            if (displayMaterial.uniforms.uTexture) {
                gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
            }
            blit(target, false);
        }
        // -------------------- Interaction --------------------
        function splatPointer(pointer) {
const dx=*
const dy=*
            splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
        }
        function clickSplat(pointer) {
const color=*
color.r *=*
color.g *=*
color.b *=*
const dx=*
const dy=*
            splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
        }
        function splat(x, y, dx, dy, color) {
            splatProgram.bind();
            if (splatProgram.uniforms.uTarget) {
                gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
            }
            if (splatProgram.uniforms.aspectRatio) {
                gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
            }
            if (splatProgram.uniforms.point) {
                gl.uniform2f(splatProgram.uniforms.point, x, y);
            }
            if (splatProgram.uniforms.color) {
                gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
            }
            if (splatProgram.uniforms.radius) {
                gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100));
            }
            blit(velocity.write);
            velocity.swap();
            if (splatProgram.uniforms.uTarget) {
                gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
            }
            if (splatProgram.uniforms.color) {
                gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
            }
            blit(dye.write);
            dye.swap();
        }
        function correctRadius(radius) {
            // Use non-null assertion (canvas can't be null here)
const aspectRatio=*
            if (aspectRatio > 1)
radius *=*
            return radius;
        }
        function updatePointerDownData(pointer, id, posX, posY) {
pointer.id=*
pointer.down=*
pointer.moved=*
pointer.texcoordX=*
pointer.texcoordY=*
pointer.prevTexcoordX=*
pointer.prevTexcoordY=*
pointer.deltaX=*
pointer.deltaY=*
pointer.color=*
        }
        function updatePointerMoveData(pointer, posX, posY, color) {
pointer.prevTexcoordX=*
pointer.prevTexcoordY=*
pointer.texcoordX=*
pointer.texcoordY=*
pointer.deltaX=*
pointer.deltaY=*
pointer.moved=*
                Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
pointer.color=*
        }
        function updatePointerUpData(pointer) {
pointer.down=*
        }
        function correctDeltaX(delta) {
const aspectRatio=*
            if (aspectRatio < 1)
delta *=*
            return delta;
        }
        function correctDeltaY(delta) {
const aspectRatio=*
            if (aspectRatio > 1)
delta /=*
            return delta;
        }
        function generateColor() {
const c=*
c.r *=*
c.g *=*
c.b *=*
            return c;
        }
        function HSVtoRGB(h, s, v) {
let r=*
const i=*
const f=*
const p=*
const q=*
const t=*
            switch (i % 6) {
                case 0:
r=*
g=*
b=*
                    break;
                case 1:
r=*
g=*
b=*
                    break;
                case 2:
r=*
g=*
b=*
                    break;
                case 3:
r=*
g=*
b=*
                    break;
                case 4:
r=*
g=*
b=*
                    break;
                case 5:
r=*
g=*
b=*
                    break;
            }
            return { r, g, b };
        }
        function wrap(value, min, max) {
const range=*
if (range=*
                return min;
            return ((value - min) % range) + min;
        }
        // -------------------- Event Listeners --------------------
window.addEventListener("mousedown", (e)=*
const pointer=*
const posX=*
const posY=*
            updatePointerDownData(pointer, -1, posX, posY);
            clickSplat(pointer);
        });
        // Start rendering on first mouse move
        function handleFirstMouseMove(e) {
const pointer=*
const posX=*
const posY=*
const color=*
            updateFrame();
            updatePointerMoveData(pointer, posX, posY, color);
            document.body.removeEventListener("mousemove", handleFirstMouseMove);
        }
        document.body.addEventListener("mousemove", handleFirstMouseMove);
window.addEventListener("mousemove", (e)=*
const pointer=*
const posX=*
const posY=*
const color=*
            updatePointerMoveData(pointer, posX, posY, color);
        });
        // Start rendering on first touch
        function handleFirstTouchStart(e) {
const touches=*
const pointer=*
for (let i=*
const posX=*
const posY=*
                updateFrame();
                updatePointerDownData(pointer, touches[i].identifier, posX, posY);
            }
            document.body.removeEventListener("touchstart", handleFirstTouchStart);
        }
        document.body.addEventListener("touchstart", handleFirstTouchStart);
window.addEventListener("touchstart", (e)=*
const touches=*
const pointer=*
for (let i=*
const posX=*
const posY=*
                updatePointerDownData(pointer, touches[i].identifier, posX, posY);
            }
        }, false);
window.addEventListener("touchmove", (e)=*
const touches=*
const pointer=*
for (let i=*
const posX=*
const posY=*
                updatePointerMoveData(pointer, posX, posY, pointer.color);
            }
        }, false);
window.addEventListener("touchend", (e)=*
const touches=*
const pointer=*
for (let i=*
                updatePointerUpData(pointer);
            }
        });
        // ------------------------------------------------------------
    }, [
        simulationResolution,
        dyeResolution,
        captureResolution,
        densityDissipation,
        velocityDissipation,
        pressure,
        pressureIterations,
        curl,
        splatRadius,
        splatForce,
        enableShading,
        colorUpdateSpeed,
        backgroundColor,
        transparent,
    ]);
    return (_jsx("div", { className: "fixed top-0 left-0 z-50 pointer-events-none w-full h-full cursor-none", children: _jsx("canvas", { ref: canvasRef, id: "fluid", className: "w-screen h-screen block" }) }));
}
