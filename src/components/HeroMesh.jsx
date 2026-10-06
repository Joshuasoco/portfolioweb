import { useEffect, useRef } from 'react'

// Animated mesh gradient with film grain, adapted from the open-source
// uiarc.dev hero-section block (HeroMesh). Colors come from the CSS variables
// `--mesh-base` and `--mesh-1` onward, so light and dark each set their own palette.
// It draws at 30fps only while on screen, and one still frame under reduced motion.

const PERIOD = 20
const TRAVEL = 0.075
const BREATH = 0.08
const MAX = 8
const FRAME = 1000 / 30

const VS = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }'
const FS = `
precision mediump float;
uniform vec2 uRes;
uniform vec3 uBase;
uniform vec4 uP[${MAX}];
uniform vec3 uC[${MAX}];
uniform int uN;
uniform float uGrain;
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec3 col = uBase;
  for (int i = 0; i < ${MAX}; i++) {
    if (i >= uN) break;
    vec4 p = uP[i];
    float d = length((uv - p.xy) / max(p.z, 1e-4));
    col = mix(col, uC[i], 1.0 - smoothstep(0.0, 1.0, d));
  }
  float n = hash(floor(gl_FragCoord.xy)) + hash(floor(gl_FragCoord.xy) + 19.19) - 1.0;
  float lum = dot(col, vec3(.2126, .7152, .0722));
  col += n * (uGrain * .1 * (.55 + 1.8 * lum * (1.0 - lum)) + .6 / 255.0);
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`

function hashOf(text) {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Resolves any CSS color to sRGB through a one-pixel 2D canvas.
function toRgb(color, scratch) {
  scratch.clearRect(0, 0, 1, 1)
  scratch.fillStyle = '#000'
  scratch.fillStyle = color
  scratch.fillRect(0, 0, 1, 1)
  const [r, g, b] = scratch.getImageData(0, 0, 1, 1).data
  return [r / 255, g / 255, b / 255]
}

// Static CSS version of the same mesh, shown until the canvas paints (or without WebGL).
function cssMesh(points) {
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => [
    t,
    Math.round((1 - t * t * (3 - 2 * t)) * 100),
  ])
  const layers = points.map(
    (p, i) =>
      `radial-gradient(ellipse ${p.spread * 100}% ${p.spread * 100}% at ${p.x * 100}% ${p.y * 100}%, ${stops
        .map(
          ([t, a]) =>
            `color-mix(in srgb, var(--mesh-${i + 1}) ${a}%, transparent) ${t * 100}%`,
        )
        .join(', ')})`,
  )
  return {
    backgroundColor: 'var(--mesh-base)',
    backgroundImage: layers.reverse().join(', '),
  }
}

export function HeroMesh({ points, grain = 0.35, speed = 1, className = '' }) {
  const root = useRef(null)
  const canvas = useRef(null)
  const key = JSON.stringify(points)

  useEffect(() => {
    const host = root.current
    const node = canvas.current
    if (!host || !node) return
    const gl = node.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    const scratch = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true })
    if (!gl || !scratch) return

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const u = Object.fromEntries(
      ['uRes', 'uBase', 'uP', 'uC', 'uN', 'uGrain'].map((name) => [
        name,
        gl.getUniformLocation(prog, name),
      ]),
    )

    const pts = JSON.parse(key).slice(0, MAX)
    const drift = pts.map((_, i) => {
      const h = hashOf(`mesh-${i}`)
      return {
        ph1: (h % 628) / 100,
        ph2: ((h >>> 10) % 628) / 100,
        k1: 1 + ((h >>> 20) % 2),
        k2: 1 + ((h >>> 22) % 2),
      }
    })
    const P = new Float32Array(MAX * 4)
    const C = new Float32Array(MAX * 3)
    let base = [1, 1, 1]

    const readColors = () => {
      const css = getComputedStyle(host)
      base = toRgb(
        css.getPropertyValue('--mesh-base').trim() || '#fff',
        scratch,
      )
      pts.forEach((_, i) => {
        const c = toRgb(
          css.getPropertyValue(`--mesh-${i + 1}`).trim() || '#fff',
          scratch,
        )
        C.set(c, i * 3)
      })
    }

    let width = 0
    let height = 0
    const size = () => {
      width = Math.max(1, Math.round(host.clientWidth))
      height = Math.max(1, Math.round(host.clientHeight))
      node.width = width
      node.height = height
    }

    let t = hashOf(key) % PERIOD
    const draw = () => {
      const a = (2 * Math.PI * t) / PERIOD
      pts.forEach((p, i) => {
        const d = drift[i]
        P[i * 4] = p.x + TRAVEL * Math.sin(a * d.k1 + d.ph1)
        P[i * 4 + 1] = p.y + TRAVEL * Math.cos(a * d.k2 + d.ph2)
        P[i * 4 + 2] = p.spread * (1 + BREATH * Math.sin(a + d.ph1 * 0.7))
      })
      gl.viewport(0, 0, width, height)
      gl.uniform2f(u.uRes, width, height)
      gl.uniform3f(u.uBase, base[0], base[1], base[2])
      gl.uniform4fv(u.uP, P)
      gl.uniform3fv(u.uC, C)
      gl.uniform1i(u.uN, pts.length)
      gl.uniform1f(u.uGrain, grain)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      host.dataset.painted = ''
    }

    readColors()
    size()
    draw()

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const moving = !reduced && speed > 0
    let visible = false
    let frame = 0
    let last = 0
    const tick = (now) => {
      frame = requestAnimationFrame(tick)
      if (now - last < FRAME) return
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0
      last = now
      t = (t + dt * speed) % PERIOD
      draw()
    }
    const sync = () => {
      const run = moving && visible && document.visibilityState === 'visible'
      if (run && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      }
      if (!run && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(host)
    const ro = new ResizeObserver(() => {
      size()
      draw()
    })
    ro.observe(host)
    const scheme = matchMedia('(prefers-color-scheme: dark)')
    const theme = () => {
      readColors()
      draw()
    }
    scheme.addEventListener('change', theme)
    document.addEventListener('visibilitychange', sync)

    return () => {
      cancelAnimationFrame(frame)
      io.disconnect()
      ro.disconnect()
      scheme.removeEventListener('change', theme)
      document.removeEventListener('visibilitychange', sync)
      delete host.dataset.painted
    }
  }, [key, grain, speed])

  return (
    <div
      ref={root}
      className={`mesh ${className}`.trim()}
      style={cssMesh(points)}
      aria-hidden="true"
    >
      <canvas ref={canvas} className="mesh__canvas" />
    </div>
  )
}
