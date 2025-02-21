'use client'

import { RenderComponent, ShimmerEffect, useClientFunctions, useFieldProps } from '@payloadcms/ui'
import React, { lazy, Suspense, useEffect, useState } from 'react'

import type { RichTextPlugin, SlateFieldProps } from '../types.js'
import type { EnabledFeatures } from './types.js'

import { createFeatureMap } from './createFeatureMap.js'

const RichTextEditor = lazy(() =>
  import('./RichText.js').then((module) => ({
    default: module.RichText,
  })),
)

export const RichTextField: React.FC<SlateFieldProps> = (props) => {
  const {
    field: { richTextComponentMap },
  } = props

  const { schemaPath } = useFieldProps()
  const clientFunctions = useClientFunctions()
  const [hasLoadedPlugins, setHasLoadedPlugins] = useState(false)

  const [features] = useState<EnabledFeatures>(() => {
    return createFeatureMap(richTextComponentMap as any)
  })

  const [plugins, setPlugins] = useState<RichTextPlugin[]>([])

  useEffect(() => {
    if (!hasLoadedPlugins) {
      const plugins: RichTextPlugin[] = []

      Object.entries(clientFunctions).forEach(([key, plugin]) => {
        if (key.startsWith(`slatePlugin.${schemaPath}.`)) {
          plugins.push(plugin)
        }
      })

      if (plugins.length === features.plugins.length) {
        setPlugins(plugins)
        setHasLoadedPlugins(true)
      }
    }
  }, [hasLoadedPlugins, clientFunctions, schemaPath, features.plugins.length])

  if (!hasLoadedPlugins) {
    return (
      <div>
        <ShimmerEffect height="24px" width="180px" style={{ marginBottom: '8px' }} /> {/* Loading message */}
        {Array.isArray(features.plugins) &&
          features.plugins.map((Plugin, i) => {
            return (
              <React.Fragment key={i}>
                <RenderComponent mappedComponent={Plugin} />
              </React.Fragment>
            )
          })}
      </React.Fragment>
    )
  }

  return (
    <Suspense 
      fallback={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ShimmerEffect height="40px" /> {/* Toolbar */}
          <ShimmerEffect height="30vh" /> {/* Content area */}
        </div>
      }
    >
      <RichTextEditor
        {...props}
        elements={features.elements}
        leaves={features.leaves}
        plugins={plugins}
      />
    </Suspense>
  )
}
