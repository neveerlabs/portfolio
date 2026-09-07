"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
const vertexSmokeySource=*
  attribute vec4 a_position;
  void main() {
gl_Position=*
  }
`;
const fragmentSmokeySource=*
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
vec2 uv=*
vec2 centeredUV=*

float time=*

    // Normalize mouse input (0.0 - 1.0)
vec2 mouse=*
vec2 rippleCenter=*

vec2 distortion=*
for (float i=*
distortion.x +=*
distortion.y +=*
    }

float wave=*
float glow=*

fragColor=*
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
/**
 * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
 * This ensures Tailwind's JIT mode can correctly detect and generate the CSS.
 */
const blurClassMap=*
    none: "backdrop-blur-none",
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
    "2xl": "backdrop-blur-2xl",
    "3xl": "backdrop-blur-3xl",
};
/**
 * A React component that renders an interactive WebGL shader background.
 * The background features a turbulent, glowing wave pattern that responds to mouse movement.
 * An optional backdrop blur can be applied over the shader.
 *
 * @param {SmokeyBackgroundProps} props - The component props.
 * @returns {JSX.Element} The rendered SmokeyBackground component.
 */
function SmokeyBackground({ backdropBlurAmount=*
className=*
const canvasRef=*
const [mousePosition, setMousePosition]=*
const [isHovering, setIsHovering]=*
    // Helper to convert hex color to RGB (0-1 range)
const hexToRgb=*
const r=*
const g=*
const b=*
        return [r, g, b];
    };
useEffect(()=*
const canvas=*
        if (!canvas)
            return;
const gl=*
        if (!gl) {
            console.error("WebGL not supported");
            return;
        }
const compileShader=*
const shader=*
            if (!shader)
                return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };
const vertexShader=*
const fragmentShader=*
        if (!vertexShader || !fragmentShader)
            return;
const program=*
        if (!program)
            return;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program linking error:", gl.getProgramInfoLog(program));
            return;
        }
        gl.useProgram(program);
const positionBuffer=*
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
const positionLocation=*
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
const iResolutionLocation=*
const iTimeLocation=*
const iMouseLocation=*
const uColorLocation=*
let startTime=*
        // Set the initial color
const [r, g, b]=*
        gl.uniform3f(uColorLocation, r, g, b);
const render=*
const width=*
const height=*
canvas.width=*
canvas.height=*
            gl.viewport(0, 0, width, height);
const currentTime=*
            gl.uniform2f(iResolutionLocation, width, height);
            gl.uniform1f(iTimeLocation, currentTime);
            gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : 0, isHovering ? height - mousePosition.y : 0);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        };
const handleMouseMove=*
const rect=*
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            });
        };
const handleMouseEnter=*
            setIsHovering(true);
        };
const handleMouseLeave=*
            setIsHovering(false);
            setMousePosition({ x: 0, y: 0 });
        };
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("mouseenter", handleMouseEnter);
        canvas.addEventListener("mouseleave", handleMouseLeave);
        render();
return ()=*
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("mouseenter", handleMouseEnter);
            canvas.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [isHovering, mousePosition, color]); // Add color to the dependency array
    // Get the correct Tailwind CSS class from the map
const finalBlurClass=*
    return (_jsxs("div", { className: `w-full max-w-screen h-full overflow-hidden ${className}`, children: [_jsx("canvas", { ref: canvasRef, className: "absolute inset-0 w-full max-w-screen h-full overflow-hidden", style: { display: "block" } }), _jsx("div", { className: `absolute inset-0 ${finalBlurClass}` })] }));
}
export default SmokeyBackground;
