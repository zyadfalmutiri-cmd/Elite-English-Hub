import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { Loader2 } from "lucide-react";
import { PWAUpdatePrompt } from "@/components/pwa-update-prompt";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import VoiceChat from "@/pages/voice-chat";

import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Levels from "@/pages/levels";
import LevelDetail from "@/pages/level-detail";
import LessonDetail from "@/pages/lesson-detail";
import Quiz from "@/pages/quiz";
import Progress from "@/pages/progress";
import PlacementTest from "@/pages/placement-test";
import Subscription from "@/pages/subscription";
import AiChat from "@/pages/ai-chat";
import Pronunciation from "@/pages/pronunciation";
import More from "@/pages/more";
import About from "@/pages/about";
import SavedWords from "@/pages/saved-words";
import InteractiveQuiz from "@/pages/interactive-quiz";
import EnglishUS from "@/pages/english-us";
import EnglishUK from "@/pages/english-uk";

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

  if (!user) return <LoginPage />;

  return (
    <Switch>
      <Route path="/voice-chat" component={VoiceChat} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/levels" component={Levels} />
            <Route path="/levels/:id" component={LevelDetail} />
            <Route path="/lessons/:id" component={LessonDetail} />
            <Route path="/quiz/:lessonId" component={Quiz} />
            <Route path="/progress" component={Progress} />
            <Route path="/placement-test" component={PlacementTest} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/ai-chat" component={AiChat} />
            <Route path="/pronunciation" component={Pronunciation} />
            <Route path="/more" component={More} />
            <Route path="/about" component={About} />
            <Route path="/saved-words" component={SavedWords} />
            <Route path="/interactive-quiz" component={InteractiveQuiz} />
            <Route path="/english-us" component={EnglishUS} />
            <Route path="/english-uk" component={EnglishUK} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
            <PWAUpdatePrompt />
            <PWAInstallPrompt />
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
