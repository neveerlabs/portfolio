"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

interface SmokeyCursorProps {
  simulationResolution?: number;
  dyeResolution?: number;
  captureResolution?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  pressure?: number;
  pressureIterations?: number;
  curl?: number;
  splatRadius?: number;
  splatForce?: number;
  enableShading?: boolean;
  colorUpdateSpeed?: number;
  backgroundColor?: ColorRGB;
  transparent?: boolean;
  className?: string;
  disabled?: boolean;
  intensity?: number;
  followMouse?: boolean;
  autoColors?: boolean;
}

interface Pointer {
  id: number;
  texcoordX: number;
  texcoordY: number;
  prevTexcoordX: number;
  prevTexcoordY: number;
  deltaX: number;
  deltaY: number;
  down: boolean;
  moved: boolean;
  color: ColorRGB;
}

function pointerPrototype(): Pointer {
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

export default function SmokeyCursor({
simulationResolution=*
dyeResolution=*
captureResolution=*
densityDissipation=*
velocityDissipation=*
pressure=*
pressureIterations=*
curl=*
splatRadius=*
splatForce=*
enableShading=*
colorUpdateSpeed=*
backgroundColor=*
transparent=*
className=*
disabled=*
intensity=*
followMouse=*
autoColors=*
}: SmokeyCursorProps) {
const canvasRef=*
const [mounted, setMounted]=*

useEffect(()=*
    setMounted(true);
  }, []);

useEffect(()=*
const canvas=*
    if (!canvas) return; // Guard canvas early

    let animationId: number;

    // Pointer and config setup
let pointers: Pointer[]=*

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
    if (!gl || !ext) return;

    // If no linear filtering, reduce resolution
    if (!ext.supportLinearFiltering) {
config.DYE_RESOLUTION=*
config.SHADING=*
    }

    function getWebGLContext(canvas: HTMLCanvasElement) {
const params=*
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      };

let gl=*
        "webgl2",
        params
      ) as WebGL2RenderingContext | null;

      if (!gl) {
gl=*
          canvas.getContext(
            "experimental-webgl",
            params
          )) as WebGL2RenderingContext | null;
      }

      if (!gl) {
        throw new Error("Unable to initialize WebGL.");
      }

const isWebGL2=*

let supportLinearFiltering=*
let halfFloat: OES_texture_half_float | null=*

      if (isWebGL2) {
        (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float");
supportLinearFiltering=*
          "OES_texture_float_linear"
        );
      } else {
halfFloat=*
supportLinearFiltering=*
          "OES_texture_half_float_linear"
        );
      }

      gl.clearColor(0, 0, 0, 1);

const halfFloatTexType=*
        ? (gl as WebGL2RenderingContext).HALF_FLOAT
        : (halfFloat && (halfFloat as any).HALF_FLOAT_OES) || 0;

      let formatRGBA: any;
      let formatRG: any;
      let formatR: any;

      if (isWebGL2) {
formatRGBA=*
          gl,
          (gl as WebGL2RenderingContext).RGBA16F,
          gl.RGBA,
          halfFloatTexType
        );
formatRG=*
          gl,
          (gl as WebGL2RenderingContext).RG16F,
          (gl as WebGL2RenderingContext).RG,
          halfFloatTexType
        );
formatR=*
          gl,
          (gl as WebGL2RenderingContext).R16F,
          (gl as WebGL2RenderingContext).RED,
          halfFloatTexType
        );
      } else {
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

    function getSupportedFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ): { internalFormat: number; format: number } | null {
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

    function supportRenderTextureFormat(
      gl: WebGLRenderingContext | WebGL2RenderingContext,
      internalFormat: number,
      format: number,
      type: number
    ) {
const texture=*
      if (!texture) return false;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        4,
        4,
        0,
        format,
        type,
        null
      );

const fbo=*
      if (!fbo) return false;

      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
const status=*
return status=*
    }

    function hashCode(s: string) {
      if (!s.length) return 0;
let hash=*
for (let i=*
hash=*
hash |=*
      }
      return hash;
    }

    function addKeywords(source: string, keywords: string[] | null) {
      if (!keywords) return source;
let keywordsString=*
      for (const keyword of keywords) {
keywordsString +=*
      }
      return keywordsString + source;
    }

    function compileShader(
      type: number,
      source: string,
keywords: string[] | null=*
    ): WebGLShader | null {
const shaderSource=*
const shader=*
      if (!shader) return null;
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.trace(gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(
      vertexShader: WebGLShader | null,
      fragmentShader: WebGLShader | null
    ): WebGLProgram | null {
      if (!vertexShader || !fragmentShader) return null;
const program=*
      if (!program) return null;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.trace(gl.getProgramInfoLog(program));
      }
      return program;
    }

    function getUniforms(program: WebGLProgram) {
let uniforms: Record<string, WebGLUniformLocation | null>=*
const uniformCount=*
for (let i=*
const uniformInfo=*
        if (uniformInfo) {
uniforms[uniformInfo.name]=*
            program,
            uniformInfo.name
          );
        }
      }
      return uniforms;
    }

    class Program {
      program: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(
        vertexShader: WebGLShader | null,
        fragmentShader: WebGLShader | null
      ) {
this.program=*
this.uniforms=*
      }

      bind() {
        if (this.program) gl.useProgram(this.program);
      }
    }

    class Material {
      vertexShader: WebGLShader | null;
      fragmentShaderSource: string;
      programs: Record<number, WebGLProgram | null>;
      activeProgram: WebGLProgram | null;
      uniforms: Record<string, WebGLUniformLocation | null>;

      constructor(
        vertexShader: WebGLShader | null,
        fragmentShaderSource: string
      ) {
this.vertexShader=*
this.fragmentShaderSource=*
this.programs=*
this.activeProgram=*
this.uniforms=*
      }

      setKeywords(keywords: string[]) {
let hash=*
        for (const kw of keywords) {
hash +=*
        }
let program=*
if (program=*
const fragmentShader=*
            gl.FRAGMENT_SHADER,
            this.fragmentShaderSource,
            keywords
          );
program=*
this.programs[hash]=*
        }
if (program=*
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
      gl.VERTEX_SHADER,
      `
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
    `
    );

const copyShader=*
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
gl_FragColor=*
      }
    `
    );

const clearShader=*
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      precision mediump sampler2D;
      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
gl_FragColor=*
      }
    `
    );

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
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

const advectionShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `,
      ext.supportLinearFiltering ? null : ["MANUAL_FILTERING"]
    );

const divergenceShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

const curlShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

const vorticityShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

const pressureShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

const gradientSubtractShader=*
      gl.FRAGMENT_SHADER,
      `
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
    `
    );

    // -------------------- Fullscreen Triangles --------------------
const blit=*
const buffer=*
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
        gl.STATIC_DRAW
      );
const elemBuffer=*
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array([0, 1, 2, 0, 2, 3]),
        gl.STATIC_DRAW
      );
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(0);

return (target: FBO | null, doClear=*
        if (!gl) return;
        if (!target) {
          gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
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

    // Types for Framebuffers
    interface FBO {
      texture: WebGLTexture;
      fbo: WebGLFramebuffer;
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
attach: (id: number)=*
    }

    interface DoubleFBO {
      width: number;
      height: number;
      texelSizeX: number;
      texelSizeY: number;
      read: FBO;
      write: FBO;
swap: ()=*
    }

    // FBO variables
    let dye: DoubleFBO;
    let velocity: DoubleFBO;
    let divergence: FBO;
    let curlFBO: FBO;
    let pressureFBO: DoubleFBO;

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
      baseVertexShader,
      gradientSubtractShader
    );
const displayMaterial=*

    // -------------------- FBO creation --------------------
    function createFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): FBO {
      gl.activeTexture(gl.TEXTURE0);
const texture=*
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        internalFormat,
        w,
        h,
        0,
        format,
        type,
        null
      );
const fbo=*
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0
      );
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
        attach(id: number) {
          gl.activeTexture(gl.TEXTURE0 + id);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return id;
        },
      };
    }

    function createDoubleFBO(
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ): DoubleFBO {
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

    function resizeFBO(
      target: FBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
const newFBO=*
      copyProgram.bind();
      if (copyProgram.uniforms.uTexture)
        gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
      blit(newFBO, false);
      return newFBO;
    }

    function resizeDoubleFBO(
      target: DoubleFBO,
      w: number,
      h: number,
      internalFormat: number,
      format: number,
      type: number,
      param: number
    ) {
if (target.width=*
target.read=*
        target.read,
        w,
        h,
        internalFormat,
        format,
        type,
        param
      );
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
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      } else {
dye=*
          dye,
          dyeRes.width,
          dyeRes.height,
          rgba.internalFormat,
          rgba.format,
          texType,
          filtering
        );
      }

      if (!velocity) {
velocity=*
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      } else {
velocity=*
          velocity,
          simRes.width,
          simRes.height,
          rg.internalFormat,
          rg.format,
          texType,
          filtering
        );
      }

divergence=*
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
curlFBO=*
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
pressureFBO=*
        simRes.width,
        simRes.height,
        r.internalFormat,
        r.format,
        texType,
        gl.NEAREST
      );
    }

    function updateKeywords() {
const displayKeywords: string[]=*
      if (config.SHADING) displayKeywords.push("SHADING");
      displayMaterial.setKeywords(displayKeywords);
    }

    function getResolution(resolution: number) {
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

    function scaleByPixelRatio(input: number) {
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
      if (resizeCanvas()) initFramebuffers();
      updateColors(dt);
      applyInputs();
      step(dt);
      render(null);
animationId=*
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
if (canvas!.width !=*
canvas!.width=*
canvas!.height=*
        return true;
      }
      return false;
    }

    function updateColors(dt: number) {
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

    function step(dt: number) {
      gl.disable(gl.BLEND);

      // Curl
      curlProgram.bind();
      if (curlProgram.uniforms.texelSize) {
        gl.uniform2f(
          curlProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (curlProgram.uniforms.uVelocity) {
        gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
      }
      blit(curlFBO);

      // Vorticity
      vorticityProgram.bind();
      if (vorticityProgram.uniforms.texelSize) {
        gl.uniform2f(
          vorticityProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (vorticityProgram.uniforms.uVelocity) {
        gl.uniform1i(
          vorticityProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
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
        gl.uniform2f(
          divergenceProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (divergenceProgram.uniforms.uVelocity) {
        gl.uniform1i(
          divergenceProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      blit(divergence);

      // Clear pressure
      clearProgram.bind();
      if (clearProgram.uniforms.uTexture) {
        gl.uniform1i(
          clearProgram.uniforms.uTexture,
          pressureFBO.read.attach(0)
        );
      }
      if (clearProgram.uniforms.value) {
        gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
      }
      blit(pressureFBO.write);
      pressureFBO.swap();

      // Pressure
      pressureProgram.bind();
      if (pressureProgram.uniforms.texelSize) {
        gl.uniform2f(
          pressureProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (pressureProgram.uniforms.uDivergence) {
        gl.uniform1i(
          pressureProgram.uniforms.uDivergence,
          divergence.attach(0)
        );
      }
for (let i=*
        if (pressureProgram.uniforms.uPressure) {
          gl.uniform1i(
            pressureProgram.uniforms.uPressure,
            pressureFBO.read.attach(1)
          );
        }
        blit(pressureFBO.write);
        pressureFBO.swap();
      }

      // Gradient Subtract
      gradienSubtractProgram.bind();
      if (gradienSubtractProgram.uniforms.texelSize) {
        gl.uniform2f(
          gradienSubtractProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (gradienSubtractProgram.uniforms.uPressure) {
        gl.uniform1i(
          gradienSubtractProgram.uniforms.uPressure,
          pressureFBO.read.attach(0)
        );
      }
      if (gradienSubtractProgram.uniforms.uVelocity) {
        gl.uniform1i(
          gradienSubtractProgram.uniforms.uVelocity,
          velocity.read.attach(1)
        );
      }
      blit(velocity.write);
      velocity.swap();

      // Advection - velocity
      advectionProgram.bind();
      if (advectionProgram.uniforms.texelSize) {
        gl.uniform2f(
          advectionProgram.uniforms.texelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
      }
      if (
        !ext.supportLinearFiltering &&
        advectionProgram.uniforms.dyeTexelSize
      ) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          velocity.texelSizeX,
          velocity.texelSizeY
        );
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
        gl.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.VELOCITY_DISSIPATION
        );
      }
      blit(velocity.write);
      velocity.swap();

      // Advection - dye
      if (
        !ext.supportLinearFiltering &&
        advectionProgram.uniforms.dyeTexelSize
      ) {
        gl.uniform2f(
          advectionProgram.uniforms.dyeTexelSize,
          dye.texelSizeX,
          dye.texelSizeY
        );
      }
      if (advectionProgram.uniforms.uVelocity) {
        gl.uniform1i(
          advectionProgram.uniforms.uVelocity,
          velocity.read.attach(0)
        );
      }
      if (advectionProgram.uniforms.uSource) {
        gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
      }
      if (advectionProgram.uniforms.dissipation) {
        gl.uniform1f(
          advectionProgram.uniforms.dissipation,
          config.DENSITY_DISSIPATION
        );
      }
      blit(dye.write);
      dye.swap();
    }

    function render(target: FBO | null) {
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      drawDisplay(target);
    }

    function drawDisplay(target: FBO | null) {
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
    function splatPointer(pointer: Pointer) {
const dx=*
const dy=*
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
    }

    function clickSplat(pointer: Pointer) {
const color=*
color.r *=*
color.g *=*
color.b *=*
const dx=*
const dy=*
      splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: ColorRGB
    ) {
      splatProgram.bind();
      if (splatProgram.uniforms.uTarget) {
        gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
      }
      if (splatProgram.uniforms.aspectRatio) {
        gl.uniform1f(
          splatProgram.uniforms.aspectRatio,
          canvas!.width / canvas!.height
        );
      }
      if (splatProgram.uniforms.point) {
        gl.uniform2f(splatProgram.uniforms.point, x, y);
      }
      if (splatProgram.uniforms.color) {
        gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0);
      }
      if (splatProgram.uniforms.radius) {
        gl.uniform1f(
          splatProgram.uniforms.radius,
          correctRadius(config.SPLAT_RADIUS / 100)!
        );
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

    function correctRadius(radius: number) {
      // Use non-null assertion (canvas can't be null here)
const aspectRatio=*
if (aspectRatio > 1) radius *=*
      return radius;
    }

    function updatePointerDownData(
      pointer: Pointer,
      id: number,
      posX: number,
      posY: number
    ) {
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

    function updatePointerMoveData(
      pointer: Pointer,
      posX: number,
      posY: number,
      color: ColorRGB
    ) {
pointer.prevTexcoordX=*
pointer.prevTexcoordY=*
pointer.texcoordX=*
pointer.texcoordY=*
pointer.deltaX=*
        pointer.texcoordX - pointer.prevTexcoordX
      )!;
pointer.deltaY=*
        pointer.texcoordY - pointer.prevTexcoordY
      )!;
pointer.moved=*
        Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
pointer.color=*
    }

    function updatePointerUpData(pointer: Pointer) {
pointer.down=*
    }

    function correctDeltaX(delta: number) {
const aspectRatio=*
if (aspectRatio < 1) delta *=*
      return delta;
    }

    function correctDeltaY(delta: number) {
const aspectRatio=*
if (aspectRatio > 1) delta /=*
      return delta;
    }

    function generateColor(): ColorRGB {
const c=*
c.r *=*
c.g *=*
c.b *=*
      return c;
    }

    function HSVtoRGB(h: number, s: number, v: number): ColorRGB {
let r=*
g=*
b=*
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

    function wrap(value: number, min: number, max: number) {
const range=*
if (range=*
      return ((value - min) % range) + min;
    }

    // -------------------- Event Listeners --------------------
const handleMouseDown=*
const pointer=*
const posX=*
const posY=*
      updatePointerDownData(pointer, -1, posX, posY);
      clickSplat(pointer);
    };

    // Start rendering on first mouse move
    function handleFirstMouseMove(e: MouseEvent) {
const pointer=*
const posX=*
const posY=*
const color=*
      updateFrame();
      updatePointerMoveData(pointer, posX, posY, color);
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
    }

const handleMouseMove=*
const pointer=*
const posX=*
const posY=*
const color=*
      updatePointerMoveData(pointer, posX, posY, color);
    };

    // Start rendering on first touch
    function handleFirstTouchStart(e: TouchEvent) {
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

const handleTouchStart=*
const touches=*
const pointer=*
for (let i=*
const posX=*
const posY=*
        updatePointerDownData(pointer, touches[i].identifier, posX, posY);
      }
    };

const handleTouchMove=*
const touches=*
const pointer=*
for (let i=*
const posX=*
const posY=*
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
    };

const handleTouchEnd=*
const touches=*
const pointer=*
for (let i=*
        updatePointerUpData(pointer);
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mousemove", handleFirstMouseMove);
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("touchstart", handleFirstTouchStart);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

return ()=*
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mousemove", handleFirstMouseMove);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("touchstart", handleFirstTouchStart);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
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
    mounted,
  ]);

  if (!mounted) return null;

  return createPortal(
<div className=*
      <canvas
ref=*
id=*
className=*
      ></canvas>
    </div>,
    document.body
  );
}
