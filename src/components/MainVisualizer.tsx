'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

const JsonNode = ({ data, isRoot = false }: { data: JsonValue, isRoot?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot)

  if (typeof data !== 'object' || data === null) {
    return <span className="text-green-600">{JSON.stringify(data)}</span>
  }

  const isArray = Array.isArray(data)
  const items = isArray ? data : Object.entries(data)

  return (
    <div className="ml-4">
      <span
        className="cursor-pointer inline-flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {isArray ? '[' : '{'}
      </span>
      {isExpanded && (
        <div className="ml-4">
          {(items as any[]).map((item, index) => (
            <div key={index}>
              {!isArray && <span className="text-blue-600">{JSON.stringify(item[0])}: </span>}
              <JsonNode data={isArray ? item : item[1]} />
              {index < items.length - 1 && ','}
            </div>
          ))}
        </div>
      )}
      <span>{isArray ? ']' : '}'}</span>
    </div>
  )
}

export function MainVisualizer() {
  const [jsonInput, setJsonInput] = useState('')
  const [parsedJson, setParsedJson] = useState<JsonValue | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setParsedJson(parsed)
      setError(null)
    } catch (e) {
      setError('Invalid JSON input. Please check your JSON and try again.')
      setParsedJson(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">JSON Visualizer</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="w-full h-40 p-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleVisualize}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
      >
        Visualize
      </button>
      {error && (
        <div className="bg-red-100 text-red-800 p-2 rounded-md">
          {error}
        </div>
      )}
      {parsedJson && (
        <div className="bg-black p-4 rounded-md overflow-auto max-h-96">
          <JsonNode data={parsedJson} isRoot={true} />
        </div>
      )}
    </div>
  )
}

export default MainVisualizer
