import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Levels from "@/pages/levels";
import LevelDetail from "@/pages/level-detail";
import LessonDetail from "@/pages/lesson-detail";
import Quiz from "@/pages/quiz";
import Progress from "@/pages/progress";
import PlacementTest from "@/pages/placement-test";

const queryClient = new QueryClient();

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/levels" component={Levels} />
        <Route path="/levels/:id" component={LevelDetail} />
        <Route path="/lessons/:id" component={LessonDetail} />
        <Route path="/quiz/:lessonId" component={Quiz} />
        <Route path="/progress" component={Progress} />
        <Route path="/placement-test" component={PlacementTest} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
