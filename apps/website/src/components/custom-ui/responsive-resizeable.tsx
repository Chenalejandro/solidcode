import { useState } from "react"
import { useMediaQuery } from "react-responsive"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Define a type for our panel data
type PanelData = {
  id: string
  title: string
  content: string
}

export function ResponsiveResizeable() {
  const isDesktop = useMediaQuery({ minWidth: 600 })

  // Define our panel data
  const [panels, setPanels] = useState([
    { id: "one", title: "One", content: "Content for panel one" },
    { id: "two", title: "Two", content: "Content for panel two" },
    { id: "three", title: "Three", content: "Content for panel three" },
  ] as const)

  // Function to render a panel's content
  const renderPanelContent = (panel: PanelData) => (
    <div className="flex h-full items-center justify-center p-6 flex-col">
      <span className="font-semibold">{panel.title}</span>
      <p className="mt-2">{panel.content}</p>
    </div>
  )

  if (isDesktop) {
    return (
      <ResizablePanelGroup direction="horizontal" className="max-w-md rounded-lg border md:min-w-[450px]">
        <ResizablePanel defaultSize={50}>{renderPanelContent(panels[0])}</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>{renderPanelContent(panels[1])}</ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>{renderPanelContent(panels[2])}</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

  return (
    <Tabs defaultValue={panels[0].id} className="max-w-md rounded-lg border md:min-w-[450px]">
      <TabsList className="grid w-full grid-cols-3">
        {panels.map((panel) => (
          <TabsTrigger key={panel.id} value={panel.id}>
            {panel.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.map((panel) => (
        <TabsContent key={panel.id} value={panel.id}>
          {renderPanelContent(panel)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
