import type { KeyOption } from './keys.ts'
import { downloadMusicXml } from './musicXml.ts'
import { useDropdown } from './useDropdown.ts'

interface ExportMenuProps {
  slug: string
  keyOption: KeyOption
}

export function ExportMenu({ slug, keyOption }: ExportMenuProps) {
  const formats = [
    { label: 'PDF', onSelect: () => window.print() },
    { label: 'XML', onSelect: () => downloadMusicXml(slug, keyOption) },
  ]
  const dropdown = useDropdown({
    itemCount: formats.length,
    initialIndex: 0,
    onChoose: (index) => formats[index].onSelect(),
  })

  return (
    <div className="dropdown" ref={dropdown.rootRef}>
      <button {...dropdown.buttonProps} className="dropdown-button" aria-haspopup="menu">
        Exportar
      </button>
      {dropdown.isOpen && (
        <ul {...dropdown.listProps} className="dropdown-list export-list" role="menu" aria-label="Exportar">
          {formats.map((format, index) => (
            <li key={format.label} {...dropdown.itemProps(index)} role="menuitem" className="dropdown-option">
              {format.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
