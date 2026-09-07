"use client";

import React, { useRef, useEffect, useCallback, PropsWithChildren, CSSProperties, forwardRef, useImperativeHandle } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export interface ThreeDSmokeyFrameProps extends PropsWithChildren {
    /** Color of the animated smokey frame (Hex or RGB/RGBA, default: "#00F5FF" Cosmic Cyan) */
    frameColor?: string;
    /** Background interior base color (used when transparentBg is false) */
    frameBgColor?: string;
    /** Whether the interior background is completely transparent (default: true) */
    transparentBg?: boolean;
    /** Normalized frame width from edge toward center (0.01 - 0.50, default: 0.30) */
    frameWidth?: number;
    /** Animation wave and smoke propagation speed multiplier (default: 0.15) */
    speed?: number;
    /** Edge falloff curve exponent (higher values make the frame edge sharper, default: 6.0) */
    falloff?: number;
    /** Granularity and density of the procedural noise smoke (default: 3.0) */
    noiseScale?: number;
    /** Amount of noise turbulence modulating the frame (0.0 - 1.0, default: 1.0) */
    noiseStrength?: number;
    /** Brightness and emission intensity of the smoke (default: 1.2) */
    intensity?: number;
    /** Gamma curve contrast adjustment (default: 2.0) */
    gamma?: number;
    /** Overall canvas opacity (0.0 - 1.0, default: 1.0) */
    opacity?: number;
    /** Whether cursor movement dynamically displaces the smokey field (default: true) */
    interactive?: boolean;
    /** Enable external atmospheric colored glow behind the frame container (default: true) */
    glow?: boolean;
    /** Blur radius for external atmospheric glow in pixels (default: 36) */
    glowBlur?: number;
    /** Opacity for external ambient glow (default: 0.45) */
    glowOpacity?: number;
    /** Border radius for the frame container (default: "16px") */
    radius?: string | number;
    /** Optional class name for the outer container */
    className?: string;
    /** Optional class name for the canvas element */
    canvasClassName?: string;
    /** Optional inline styles */
    style?: CSSProperties;
    /** Maximum device pixel ratio to use for rendering (default: 2) */
    dpr?: number;
}

export interface ThreeDSmokeyFrameHandle {
getCanvas: ()=*
getGL: ()=*
}

/** Utility to parse Hex or RGB strings to normalized [r, g, b] float vectors */
function parseColorToRgb(color: string, fallback: [number, number, number]=*
    if (!color) return fallback;
const clean=*
    if (clean.startsWith("#")) {
let hex=*
if (hex.length=*
hex=*
        }
const num=*
        if (isNaN(num)) return fallback;
        return [
            ((num >> 16) & 255) / 255,
            ((num >> 8) & 255) / 255,
            (num & 255) / 255,
        ];
    }
const match=*
    if (match) {
        return [
            parseInt(match[1], 10) / 255,
            parseInt(match[2], 10) / 255,
            parseInt(match[3], 10) / 255,
        ];
    }
    return fallback;
}

const VERTEX_SHADER=*
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
v_uv=*
gl_Position=*
  }
`;

const FRAGMENT_SHADER=*
  precision highp float;
  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_frameWidth;
  uniform float u_falloff;
  uniform float u_noiseScale;
  uniform float u_noiseStrength;
  uniform float u_intensity;
  uniform float u_gamma;
  uniform float u_opacity;
  uniform vec3 u_frameColor;
  uniform vec3 u_frameBgColor;
  uniform float u_transparentBg;
  uniform vec2 u_mouse;
  uniform float u_isHovered;

  // Simplex 2D noise generator
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
const vec4 C=*
                       -0.577350269189626, 0.024390243902439);
vec2 i=*
vec2 x0=*
vec2 i1=*
vec4 x12=*
x12.xy -=*
i=*
vec3 p=*
          + i.x + vec3(0.0, i1.x, 1.0 ));
vec3 m=*
m=*
m=*
vec3 x=*
vec3 h=*
vec3 ox=*
vec3 a0=*
m *=*
    vec3 g;
g.x=*
g.yz=*
    return 130.0 * dot(m, g);
  }

  // 5-Octave Fractional Brownian Motion for lush smoke tendrils
  float fbm(vec2 p) {
float total=*
float amp=*
float freq=*
for(int i=*
total +=*
freq *=*
amp *=*
    }
    return total;
  }

  void main() {
vec2 uv=*
float aspect=*

    // Aspect ratio correction for noise sampling
vec2 noiseUV=*
    if (aspect > 1.0) {
noiseUV.x *=*
    } else {
noiseUV.y /=*
    }

    // Interactive mouse turbulence displacement
    if (u_isHovered > 0.0) {
vec2 mouseUV=*
if (aspect > 1.0) mouseUV.x *=*
float dMouse=*
float mouseInfluence=*
noiseUV +=*
    }

    // Animated volumetric noise field
float t=*
float noise1=*
float noise2=*
float combinedNoise=*

    // Distance calculation from all 4 boundaries (0 at boundary, 0.5 at center)
vec2 distToEdge=*
float minAxisDist=*

    // Normalize distance based on the frameWidth parameter
float frameDist=*

// Invert so frame edge=*
float edgeStrength=*
edgeStrength=*

    // Modulate edge with procedural smoke noise
float modulatedFrame=*

    // Apply intensity multiplier and gamma curve for rich contrast
float finalGlow=*
finalGlow=*

    // Render with transparent background or blended solid background
    if (u_transparentBg > 0.5) {
float alpha=*
gl_FragColor=*
    } else {
vec3 finalColor=*
gl_FragColor=*
    }
  }
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
const shader=*
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export const ThreeDSmokeyFrame=*
    children,
frameColor=*
    frameBgColor,
transparentBg=*
frameWidth=*
speed=*
falloff=*
noiseScale=*
noiseStrength=*
intensity=*
gamma=*
opacity=*
interactive=*
glow=*
glowBlur=*
glowOpacity=*
radius=*
    className,
    canvasClassName,
    style,
dpr=*
}, ref)=*
const containerRef=*
const canvasRef=*
const glRef=*
const animFrameRef=*
const isVisibleRef=*

const { resolvedTheme, theme }=*
const isLightMode=*
const effectiveBgColor=*

const mousePosRef=*
const isHoveredRef=*
const startTimeRef=*

const parsedRadius=*

useImperativeHandle(ref, ()=*
getCanvas: ()=*
getGL: ()=*
    }));

useEffect(()=*
const canvas=*
        if (!canvas) return;

const gl=*
            alpha: true,
            antialias: true,
            depth: false,
            preserveDrawingBuffer: false,
        });

        if (!gl) {
            console.warn("WebGL not supported for ThreeDSmokeyFrame");
            return;
        }

glRef.current=*
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

const vs=*
const fs=*
        if (!vs || !fs) return;

const program=*
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        // Quad Geometry Buffers
const positionBuffer=*
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1,
            ]),
            gl.STATIC_DRAW
        );

const positionLocation=*
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Uniform Locations
const uniforms=*
            resolution: gl.getUniformLocation(program, "u_resolution"),
            time: gl.getUniformLocation(program, "u_time"),
            speed: gl.getUniformLocation(program, "u_speed"),
            frameWidth: gl.getUniformLocation(program, "u_frameWidth"),
            falloff: gl.getUniformLocation(program, "u_falloff"),
            noiseScale: gl.getUniformLocation(program, "u_noiseScale"),
            noiseStrength: gl.getUniformLocation(program, "u_noiseStrength"),
            intensity: gl.getUniformLocation(program, "u_intensity"),
            gamma: gl.getUniformLocation(program, "u_gamma"),
            opacity: gl.getUniformLocation(program, "u_opacity"),
            frameColor: gl.getUniformLocation(program, "u_frameColor"),
            frameBgColor: gl.getUniformLocation(program, "u_frameBgColor"),
            transparentBg: gl.getUniformLocation(program, "u_transparentBg"),
            mouse: gl.getUniformLocation(program, "u_mouse"),
            isHovered: gl.getUniformLocation(program, "u_isHovered"),
        };

const handleResize=*
            if (!canvas || !gl) return;
const targetDpr=*
const displayWidth=*
const displayHeight=*

if (canvas.width !=*
canvas.width=*
canvas.height=*
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        handleResize();

const resizeObserver=*
            handleResize();
        });
        resizeObserver.observe(canvas);

const intersectionObserver=*
([entry])=*
isVisibleRef.current=*
            },
            { threshold: 0.05 }
        );
        intersectionObserver.observe(canvas);

let currentHover=*

const render=*
            if (isVisibleRef.current && gl && canvas) {
                handleResize();

const time=*
const fColor=*
const bColor=*

                // Smooth hover transition
const targetHover=*
currentHover +=*

                gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
                gl.uniform1f(uniforms.time, time);
                gl.uniform1f(uniforms.speed, speed);
                gl.uniform1f(uniforms.frameWidth, frameWidth);
                gl.uniform1f(uniforms.falloff, falloff);
                gl.uniform1f(uniforms.noiseScale, noiseScale);
                gl.uniform1f(uniforms.noiseStrength, noiseStrength);
                gl.uniform1f(uniforms.intensity, intensity);
                gl.uniform1f(uniforms.gamma, gamma);
                gl.uniform1f(uniforms.opacity, opacity);
                gl.uniform3f(uniforms.frameColor, fColor[0], fColor[1], fColor[2]);
                gl.uniform3f(uniforms.frameBgColor, bColor[0], bColor[1], bColor[2]);
                gl.uniform1f(uniforms.transparentBg, transparentBg ? 1.0 : 0.0);
                gl.uniform2f(uniforms.mouse, mousePosRef.current.x, mousePosRef.current.y);
                gl.uniform1f(uniforms.isHovered, currentHover);

                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }

animFrameRef.current=*
        };

animFrameRef.current=*

return ()=*
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            if (gl) {
                gl.deleteProgram(program);
                gl.deleteShader(vs);
                gl.deleteShader(fs);
                gl.deleteBuffer(positionBuffer);
            }
        };
    }, [
        frameColor,
        effectiveBgColor,
        transparentBg,
        frameWidth,
        speed,
        falloff,
        noiseScale,
        noiseStrength,
        intensity,
        gamma,
        opacity,
        dpr,
    ]);

const handleMouseMove=*
        if (!interactive || !containerRef.current) return;
const rect=*
const x=*
const y=*
mousePosRef.current=*
    }, [interactive]);

const handleMouseEnter=*
if (interactive) isHoveredRef.current=*
    }, [interactive]);

const handleMouseLeave=*
if (interactive) isHoveredRef.current=*
    }, [interactive]);

    return (
        <div
ref=*
onMouseMove=*
onMouseEnter=*
onMouseLeave=*
className=*
style=*
                borderRadius: parsedRadius,
                ...style,
            }}
        >
            {/* Ambient Atmosphere Glow Backdrop */}
            {glow && (
                <div
className=*
style=*
                        borderRadius: parsedRadius,
                        filter: `blur(${glowBlur}px)`,
                        background: `radial-gradient(ellipse at center, ${frameColor} 0%, transparent 75%)`,
                        opacity: glowOpacity,
                    }}
                />
            )}

            {/* WebGL Canvas Shader Output */}
            <canvas
ref=*
className=*
style=*
                    borderRadius: parsedRadius,
                }}
            />

            {/* Slotted Children Content Layer */}
            {children && (
                <div
className=*
style=*
                        borderRadius: parsedRadius,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
});

ThreeDSmokeyFrame.displayName=*

export default ThreeDSmokeyFrame;
