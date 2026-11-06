import { useEffect, useRef, useState } from 'react'
import type { OpenSheetMusicDisplay } from 'opensheetmusicdisplay'

const OSMD_OPTIONS = {
  autoResize: false,
  drawTitle: false,
  drawComposer: false,
  drawLyricist: false,
}

const FULL_SIZE_WIDTH = 1000
const MIN_ZOOM = 0.55
// A4 proportions minus the printed margins and the page header, which only sits above the first page.
const PRINT_PAGE_HEIGHT = 1340

const zoomFor = (width: number) => Math.min(1, Math.max(MIN_ZOOM, width / FULL_SIZE_WIDTH))

interface SheetMusicProps {
  slug: string
  semitones: number
}

export function SheetMusic({ slug, semitones }: SheetMusicProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay>()
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function load() {
      const { OpenSheetMusicDisplay, IntervalTransposeCalculator } = await import('opensheetmusicdisplay')
      if (!isCurrent) return

      const sheet = new OpenSheetMusicDisplay(containerRef.current!, OSMD_OPTIONS)
      sheet.TransposeCalculator = new IntervalTransposeCalculator()
      await sheet.load(`/songs/${slug}.xml`)
      if (isCurrent) setOsmd(sheet)
    }

    load().catch(() => setHasFailed(true))

    return () => {
      isCurrent = false
    }
  }, [slug])

  useEffect(() => {
    if (!osmd) return

    try {
      osmd.Sheet.Transpose = semitones
      osmd.updateGraphic()
      osmd.render()
    } catch {
      setHasFailed(true)
    }
  }, [osmd, semitones])

  useEffect(() => {
    if (!osmd) return

    const sheet = osmd
    const container = containerRef.current!
    let renderedWidth = 0

    const observer = new ResizeObserver(([{ contentRect }]) => {
      if (contentRect.width === renderedWidth) return

      renderedWidth = contentRect.width
      sheet.zoom = zoomFor(renderedWidth)
      sheet.render()
    })

    // Printing changes the container's width, and a render at another zoom would repaginate the score.
    function renderPages() {
      observer.disconnect()
      container.style.width = `${FULL_SIZE_WIDTH}px`
      sheet.zoom = 1
      sheet.setCustomPageFormat(FULL_SIZE_WIDTH, PRINT_PAGE_HEIGHT)
      sheet.render()
    }

    function renderContinuously() {
      container.style.width = ''
      sheet.setPageFormat('Endless')
      renderedWidth = 0
      observer.observe(container)
    }

    observer.observe(container)
    window.addEventListener('beforeprint', renderPages)
    window.addEventListener('afterprint', renderContinuously)

    return () => {
      observer.disconnect()
      window.removeEventListener('beforeprint', renderPages)
      window.removeEventListener('afterprint', renderContinuously)
    }
  }, [osmd])

  return (
    <div className="sheet-frame">
      {hasFailed && <p role="alert">No se pudo cargar la partitura.</p>}
      {!osmd && !hasFailed && (
        <p role="status" className="sheet-status">
          Cargando partitura…
        </p>
      )}
      <noscript>
        <p>Active JavaScript para ver la partitura.</p>
      </noscript>
      <div ref={containerRef} className="sheet" hidden={hasFailed} role="img" aria-label="Partitura" />
    </div>
  )
}
