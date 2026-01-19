'use client'

import { useEffect, useRef } from 'react'

export function HydrationDebugger() {
  const hasLogged = useRef(false)

  useEffect(() => {
    // #region agent log
    if (typeof window !== 'undefined' && !hasLogged.current) {
      const htmlElement = document.documentElement
      const htmlAttributes = Array.from(htmlElement.attributes).map(attr => ({
        name: attr.name,
        value: attr.value
      }))
      const hasJetskiAttr = htmlElement.hasAttribute('data-jetski-tab-id')
      const jetskiValue = htmlElement.getAttribute('data-jetski-tab-id')
      
      fetch('http://127.0.0.1:7243/ingest/953ddd6d-c7ea-4260-83a9-980ef548b30d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'HydrationDebugger.tsx:useEffect',
          message: 'Client-side HTML element attributes check',
          data: {
            allAttributes: htmlAttributes,
            hasJetskiAttr,
            jetskiValue,
            htmlOuterHTML: htmlElement.outerHTML.substring(0, 500),
            timestamp: Date.now()
          },
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'A'
        })
      }).catch(() => {})
      
      hasLogged.current = true
    }
    // #endregion agent log
  }, [])

  // #region agent log
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAttributes = () => {
        const htmlElement = document.documentElement
        const hasJetskiAttr = htmlElement.hasAttribute('data-jetski-tab-id')
        
        fetch('http://127.0.0.1:7243/ingest/953ddd6d-c7ea-4260-83a9-980ef548b30d', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: 'HydrationDebugger.tsx:checkAttributes',
            message: 'Attribute check after potential extension injection',
            data: {
              hasJetskiAttr,
              jetskiValue: htmlElement.getAttribute('data-jetski-tab-id'),
              timestamp: Date.now()
            },
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1',
            hypothesisId: 'A'
          })
        }).catch(() => {})
      }
      
      // Check immediately
      checkAttributes()
      
      // Check after a short delay (to catch extension injection)
      setTimeout(checkAttributes, 100)
      setTimeout(checkAttributes, 500)
      setTimeout(checkAttributes, 1000)
    }
  }, [])
  // #endregion agent log

  return null
}
