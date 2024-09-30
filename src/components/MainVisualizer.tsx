'use client'

import React, { useState } from 'react'
import {LoadingSpinner} from './LoadingSpinner'
// @ts-ignore
import {copyToClipboard} from '~/utils'
import { toast } from 'sonner'
import { ArrowRight, Check, Copy, Download, DownloadCloud } from 'lucide-react'
import { downloadJSONFile } from '../../utils/utils'
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
    <div className="ml-2 cursor-pointer">
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
  const [copied, setcopied] = useState(false)

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setParsedJson(parsed)
      setError(null)
    } catch (e) {
      setError('⬆Invalid JSON input.')
      setParsedJson(null)
    }
  }

  const fetchDummyData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://dummyjson.com/products?limit=10')
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
      <div className="flex gap-2 mb-4 flex-row justify-between w-full">
<div className='flex flex-row items-end gap-2'>
  <img
  src='/favicon.svg'
  className='w-8 h-8'
  />
<h1 className="text-2xl font-bold">JSON Visualizer </h1>
<a href='https://github.com/Ebrahim-Ramadan/json-visualizer' target='_blank' className='text-xs text-blue-500 underline '>source code</a>
  </div>       
        {isLoading ?
          <LoadingSpinner/>
        :
          <button
            onClick={fetchDummyData}
            disabled={isLoading}
            className={`px-2 py-1 text-xs flex flex-row items-center gap-2 text-white bg-neutral-800 rounded-full ${isLoading ? 'opacity-50' : 'hover:bg-neutral-700'}`}
          >
            dummyjson
            <DownloadCloud size='16'/>
          </button>
        }
      </div>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder="Paste your JSON here or use dummyjson to load example data..."
        className="w-full h-56 p-2 border border-neutral-600 rounded-xl bg-black/60 focus:border-neutral-500 focus:outline-none"
      />
     
        <div className={`flex flex-row ${error? 'justify-between' : 'justify-end'} items-center w-full my-2`}>
        {error && (
        <div className="bg-red-100 text-red-800 px-2 py-1 font-medium rounded-xl">
          {error}
        </div>
      )}
        <button
          onClick={handleVisualize}
          disabled={isLoading}
          className={`text-sm px-2  md:px-4 md:py-2 py-1 text-blue-200 md:text-base flex flex-row items-center gap-1 font-medium bg-blue-500/50 rounded-full ${isLoading ? 'opacity-50' : 'hover:bg-blue-500/70'}`}
        >
          GO
          <ArrowRight size='16'/>
        </button>
        </div>
        {parsedJson&& 
        <div className="flex md:flex-row space-y-2 flex-col items-center  mb-2 justify-between w-full">
          <div className='flex flex-row items-center md:gap-4 gap-2 justify-start w-full'>
          <button className='flex p-2 rounded-full font-medium text-sm flex-row items-center gap-2 hover:bg-neutral-500 bg-neutral-600' onClick={() => downloadJSONFile(parsedJson, 'json-visualizer-myass.json')}>
            DOWNLOAD
            <Download size='16'/>
          </button>
          <button className='flex p-2 rounded-full font-medium text-sm flex-row items-center gap-2 hover:bg-neutral-500 bg-neutral-600' onClick={() => {
            setcopied(true)
            copyToClipboard(jsonInput)
            toast.success('Content Copied to clipboard')
            setTimeout(() => {
              setcopied(false)
            }, 2000);
          }}>
            {copied ? 'COPIED' : 'COPY'}
            {copied ? <Check size='16'/> : <Copy size='14'/>}
            {/* Copy */}
            
          </button>
            </div>
          <p className='text-neutral-500 text-xs text-end self-end w-full'>
          click on an item to copy its path

          </p>
      </div>
        }
        
      {parsedJson && (
        <div className="bg-black/60 p-4 rounded-xl overflow-auto min-h-72">
          <JsonNode data={parsedJson} isRoot={true} path="" />
        </div>
      )}
    </div>
  )
}

export default Component