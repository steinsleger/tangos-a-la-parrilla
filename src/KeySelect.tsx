import type { KeyOption } from './keys.ts'
import { useDropdown } from './useDropdown.ts'

interface KeySelectProps {
  options: KeyOption[]
  selected: string
  onChange: (keyName: string) => void
}

function CheckIcon() {
  return (
    <svg className="key-check" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function KeySelect({ options, selected, onChange }: KeySelectProps) {
  const selectedIndex = options.findIndex((option) => option.name === selected)
  const dropdown = useDropdown({
    itemCount: options.length,
    initialIndex: selectedIndex,
    onChoose: (index) => onChange(options[index].name),
  })

  return (
    <div className="dropdown" ref={dropdown.rootRef}>
      <button {...dropdown.buttonProps} className="dropdown-button" aria-haspopup="listbox">
        Tono: <strong>{options[selectedIndex].name}</strong>
      </button>
      {dropdown.isOpen && (
        <ul {...dropdown.listProps} className="dropdown-list key-list" role="listbox" aria-label="Tono">
          {options.map((option, index) => (
            <li
              key={option.name}
              {...dropdown.itemProps(index)}
              role="option"
              aria-selected={index === selectedIndex}
              className="dropdown-option"
              data-original={option.isOriginal}
              data-selected={index === selectedIndex}
            >
              {index === selectedIndex ? <CheckIcon /> : <span className="key-check" />}
              <span className="key-name">{option.name}</span>
              {option.isOriginal && <span className="key-badge">Original</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
