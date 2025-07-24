import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Plan from "./Plan/Plan";

const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col">
      {" "}
      <Tabs defaultValue="tabs" className="flex flex-1 flex-col items-center">
        <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="track-tab"
            className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Track
          </TabsTrigger>
          <TabsTrigger
            value="plan-tab"
            className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Plan
          </TabsTrigger>
          <TabsTrigger
            value="analyze-tab"
            className="data-[state=active]:after:bg-primary relative rounded-none py-2 text-xl after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Analyze
          </TabsTrigger>
        </TabsList>
        <TabsContent value="track-tab">
          <div className="flex flex-1 flex-col">Content for Tab 1</div>
        </TabsContent>
        <TabsContent value="plan-tab">
          <div className="flex flex-1 flex-col">
            <Plan />
          </div>
        </TabsContent>
        <TabsContent value="analyze-tab">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
