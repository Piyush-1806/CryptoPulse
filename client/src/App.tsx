import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Architecture from "@/pages/architecture";
import ApiDocs from "@/pages/api-docs";
import Performance from "@/pages/performance";
import Caching from "@/pages/caching";
import UmlDiagram from "@/pages/uml";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/architecture" component={Architecture} />
      <Route path="/api-docs" component={ApiDocs} />
      <Route path="/performance" component={Performance} />
      <Route path="/caching" component={Caching} />
      <Route path="/uml" component={UmlDiagram} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
