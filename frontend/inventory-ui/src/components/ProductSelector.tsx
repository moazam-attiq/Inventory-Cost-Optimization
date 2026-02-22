import { products } from "../data/products"

interface Props {
  value: number
  onChange: (v: number) => void
  options: number[]   // allowed product IDs
}

export default function ProductSelector({ value, onChange, options }: Props) {

  const filteredProducts = products.filter(p =>
    options.includes(p.id)
  )

  return (
    <select
      className="border p-2 rounded"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    >
      {filteredProducts.map(product => (
        <option key={product.id} value={product.id}>
          {product.name}
        </option>
      ))}
    </select>
  )
}