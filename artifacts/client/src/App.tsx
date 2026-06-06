import { useState, useEffect } from "react";
import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage.tsx";
import LevelsPage from "./pages/LevelsPage.tsx";
import LessonsPage from "./pages/LessonsPage.tsx";
import LessonDetailPage from "./pages/LessonDetailPage.tsx";
import QuizPage from "./pages/QuizPage.tsx";
import BooksPage from "./pages/BooksPage.tsx";
import BookReadPage from "./pages/BookReadPage.tsx";
import BookQuizPage from "./pages/BookQuizPage.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import Navbar from "./components/Navbar.tsx";

export default function App() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/levels" component={LevelsPage} />
        <Route path="/lessons" component={LessonsPage} />
        <Route path="/lessons/:id" component={LessonDetailPage} />
        <Route path="/quiz/:lessonId" component={QuizPage} />
        <Route path="/books" component={BooksPage} />
        <Route path="/books/:id" component={BookReadPage} />
        <Route path="/books/:id/quiz" component={BookQuizPage} />
        <Route path="/progress" component={ProgressPage} />
      </Switch>
      <Navbar />
    </div>
  );
}
