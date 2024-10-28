import React from 'react';
import { TimeBlockProvider } from '@context/TimeBlockContext';
import { ViewProvider } from '@context/ViewContext';
import { ThemeProvider } from '@context/ThemeContext';
import { NotificationProvider } from '@context/NotificationContext';
import { CalendarContainer } from '@components/Calendar';
import { Analytics } from '@components/Analytics/Analytics';
import { Sidebar } from '@components/Navigation/Sidebar';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { Menu } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = React.useState<'calendar' | 'analytics'>('calendar');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <ThemeProvider defaultTheme="dark">
          <TimeBlockProvider>
            <ViewProvider>
              <div className="flex h-screen bg-background text-foreground">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary text-primary-foreground shadow-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div
                  className={`${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                  } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out`}
                >
                  <Sidebar
                    activeView={activeView}
                    onViewChange={(view) => {
                      setActiveView(view);
                      setIsSidebarOpen(false);
                    }}
                    onClose={() => setIsSidebarOpen(false)}
                  />
                </div>

                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                <main className="flex-1 overflow-hidden w-full lg:w-auto">
                  <div className="h-full p-4 lg:p-6 pt-16 lg:pt-6">
                    <div className="max-w-[1400px] mx-auto h-full">
                      {activeView === 'calendar' ? <CalendarContainer /> : <Analytics />}
                    </div>
                  </div>
                </main>
              </div>
            </ViewProvider>
          </TimeBlockProvider>
        </ThemeProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;