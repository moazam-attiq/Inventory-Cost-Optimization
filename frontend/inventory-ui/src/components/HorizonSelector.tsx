interface Props {
  value: number
  onChange: (v: number) => void
  options: number[] // dynamically passed horizons
}

export default function HorizonSelector({ value, onChange, options }: Props) {
  return (
    <select
      className="border p-2 rounded hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    >
      {options.map(h => (
        <option key={h} value={h}>
          {h} Days
        </option>
      ))}
    </select>
  )
}
