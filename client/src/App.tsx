import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Modelos from "./pages/Modelos";
import Cidades from "./pages/Cidades";
import Videos from "./pages/Videos";
import Audios from "./pages/Audios";
import Admin from "./pages/Admin";
import AgeVerificationModal from "./components/AgeVerificationModal";
import WhatsAppButton from "./components/WhatsAppButton";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/perfil/:id" component={Profile} />
      <Route path="/modelos" component={Modelos} />
      <Route path="/cidades" component={Cidades} />
      <Route path="/videos" component={Videos} />
      <Route path="/audios" component={Audios} />
      <Route path="/admin" component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <AgeVerificationModal />
          <WhatsAppButton />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
