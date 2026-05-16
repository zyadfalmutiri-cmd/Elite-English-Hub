import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Levels from "@/pages/levels";
import LevelDetail from "@/pages/level-detail";
import LessonDetail from "@/pages/lesson-detail";
import Quiz from "@/pages/quiz";
import Progress from "@/pages/progress";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/levels" component={Levels} />
        <Route path="/levels/:id" component={LevelDetail} />
        <Route path="/lessons/:id" component={LessonDetail} />
        <Route path="/quiz/:lessonId" component={Quiz} />
        <Route path="/progress" component={Progress} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
