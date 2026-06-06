import { useLocation } from "wouter";
import { Home, GraduationCap, BookOpen, BarChart3, Library } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "الرئيسية" },
  { path: "/levels", icon: GraduationCap, label: "المستويات" },
  { path: "/books", icon: Library, label: "المكتبة" },
  { path: "/lessons", icon: BookOpen, label: "الدروس" },
  { path: "/progress", icon: BarChart3, label: "تقدمي" },
];

export default function Navbar() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
