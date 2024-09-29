'use client'

import React, { useState } from 'react'
import {LoadingSpinner} from './LoadingSpinner'
import {copyToClipboard} from '~/copy'
import { toast } from 'sonner'
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

interface JsonNodeProps {
  data: JsonValue
  isRoot?: boolean
  path: string
}

const JsonNode: React.FC<JsonNodeProps> = ({ data, isRoot = false, path }) => {
  const [isExpanded, setIsExpanded] = useState(isRoot)

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log(path)
    copyToClipboard(path)
    toast.success(`item path copied`)
  }

  if (typeof data !== 'object' || data === null) {
    return <span className="text-green-600 cursor-pointer" onMouseDown={handleMouseEnter}>{JSON.stringify(data)}</span>
  }

  const isArray = Array.isArray(data)
  const items = isArray ? data : Object.entries(data)

  return (
    <div className="ml-4 cursor-pointer">
      <span
        className=" inline-flex items-center"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseDown={handleMouseEnter}
      >
        {isExpanded ? '▼' : '▶'} {isArray ? '[' : '{'}
      </span>
      {isExpanded && (
        <div className="ml-4">
          {(items as any[]).map((item, index) => (
            <div key={index}>
              {!isArray && (
                <span 
                  className="text-blue-600 hover:text-blue-400" 
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    console.log(`${path}.${item[0]}`)
                    copyToClipboard(`${path}.${item[0]}`)
                    toast.success(`item path copied`)
                  }}
                >
                  {JSON.stringify(item[0])}: 
                </span>
              )}
              <JsonNode 
                data={isArray ? item : item[1]} 
                path={isArray ? `${path}[${index}]` : `${path}.${item[0]}`}
              />
              {index < items.length - 1 && ','}
            </div>
          ))}
        </div>
      )}
      <span>{isArray ? ']' : '}'}</span>
    </div>
  )
}

const Component: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('')
  const [parsedJson, setParsedJson] = useState<JsonValue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const fetchDummyData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://dummyjson.com/products')
      const data = await response.json()
      setJsonInput(JSON.stringify(data, null, 2))
      setParsedJson(data)
    } catch (e) {
      setError('Failed to fetch example data. Please try again.')
      setParsedJson(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 w-full min-h-screen">
      <h1 className="text-2xl font-bold mb-4">JSON Visualizer</h1>
      <div className="flex gap-2 mb-4 flex-row justify-between w-full">
        <button
          onClick={handleVisualize}
          disabled={isLoading}
          className={`px-4 py-2 text-white bg-green-600 rounded-md ${isLoading ? 'opacity-50' : 'hover:bg-green-500'}`}
        >
          Visualize
        </button>
        {isLoading ?
          <LoadingSpinner/>
        :
          <button
            onClick={fetchDummyData}
            disabled={isLoading}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md ${isLoading ? 'opacity-50' : 'hover:bg-blue-500'}`}
          >
            Load Example Data
          </button>
        }
      </div>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here or load example data..."
        className="w-full h-40 p-2 border border-gray-300 rounded-md mb-4"
      />
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      {parsedJson && (
        <div className="bg-black p-4 rounded-md overflow-auto min-h-72">
          <JsonNode data={parsedJson} isRoot={true} path="" />
        </div>
      )}
    </div>
  )
}

export default Component