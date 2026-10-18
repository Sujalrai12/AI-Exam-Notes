import React, { useEffect, useRef, useState } from 'react'
import mermaid from "mermaid"


mermaid.initialize({
    startOnLoad:false,
    theme:"default",
    // Mermaid's default parse-error renderer injects a large error diagram into
    // the document. Keep failures inside this component instead.
    suppressErrorRendering:true
})

const cleanMermaidChart = (diagram) => {
    if (!diagram) return "";

    let clean = diagram
        .replace(/```(?:mermaid)?/gi, "")
        // Model responses can contain one or several levels of JSON escaping.
        .replace(/\\+r\\+n/gi, "\n")
        .replace(/\\+[nr]/gi, "\n")
        .replace(/\\+t/gi, " ")
        .replace(/\r\n?/g, "\n")
        .trim();

    if (!/^\s*(?:graph|flowchart)\b/i.test(clean)) {
        clean = `graph TD\n${clean}`;
    }

    return clean;
};


export const MermaidSetup = ({diagram}) => {
    const containerRef = useRef(null)
    const [renderError, setRenderError] = useState(false)

    useEffect(()=>{
        if(!diagram || !containerRef.current) return ;
        setRenderError(false)
        
        const renderDiagram = async ()=>{
            try {
                containerRef.current.innerHTML = "";
                const uniqueId = `mermaid-${Math.random()
                    .toString(36)
                    .substring(2,9)
                }`

                const safeChart = cleanMermaidChart(diagram);

                const {svg} = await mermaid.render(uniqueId, safeChart);

                containerRef.current.innerHTML = svg;
            } catch (error) {
                console.error("Mermaid render failed:", error)
                setRenderError(true)
            }
        }
        renderDiagram();
    },[diagram])
  return (
    <div className='bg-white border rounded-lg p-4 overflow-x-auto'>
        <div ref={containerRef}/>
        {renderError && <p role="status" className="mt-2 text-sm text-muted">This diagram could not be displayed. Try generating the notes again.</p>}
    </div>
  )
}
