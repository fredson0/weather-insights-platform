import { Routes, Route } from 'react-router-dom';

// TODO: Importar páginas conforme implementar
// import { LoginPage } from '@features/auth/components/LoginPage';
// import { DashboardPage } from '@features/dashboard/components/DashboardPage';
// import { UsersPage } from '@features/users/components/UsersPage';
// import { ExplorePage } from '@features/explore/components/ExplorePage';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* TODO: Descomente conforme implementar as páginas */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/" element={<DashboardPage />} /> */}
        {/* <Route path="/users" element={<UsersPage />} /> */}
        {/* <Route path="/explore" element={<ExplorePage />} /> */}
        
        {/* Rota temporária */}
        <Route 
          path="*" 
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">🌦️ GDASH Weather Insights</h1>
                <p className="text-muted-foreground">
                  Frontend configurado! Implemente as páginas em /src/features/
                </p>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
