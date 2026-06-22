import { EMOTION_TAGS, type EmotionTag } from '../types'
import './EmotionTagPicker.css'

interface Props {
  selected: EmotionTag[]
  onChange: (tags: EmotionTag[]) => void
}

export default function EmotionTagPicker({ selected, onChange }: Props) {
  function toggle(tag: EmotionTag) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag))
    } else {
      onChange([...selected, tag])
    }
  }

  return (
    <div className="tag-picker">
      {EMOTION_TAGS.map((tag) => (
        <button
          key={tag}
          type="button"
          className={`tag-chip${selected.includes(tag) ? ' is-selected' : ''}`}
          onClick={() => toggle(tag)}
          aria-pressed={selected.includes(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
