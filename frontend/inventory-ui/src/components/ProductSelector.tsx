interface Props {
  value: number
  onChange: (v: number) => void
  options: number[]
}

export default function ProductSelector({ value, onChange, options }: Props) {
  return (
    <select
      className="border p-2 rounded"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    >
      {options.map(p => (
        <option key={p} value={p}>
          Product {p}
        </option>
      ))}
    </select>
  )
}
