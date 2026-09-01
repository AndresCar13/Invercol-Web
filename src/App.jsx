import Home from './pages/home/Home.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import PublicProperties from './pages/properties/PublicProperties.jsx';
import PropertyDetail from './pages/properties/PropertyDetail.jsx';
import About from './pages/about/About.jsx';
import Contact from './pages/contact/Contact.jsx';
import PublishProperty from './pages/publish/PublishProperty.jsx';

function App() {
  const path = window.location.pathname;

  if (path === '/admin/login') {
    return <AdminLogin />;
  }

  if (path === '/admin' || path === '/admin/publicaciones') {
    return <AdminDashboard />;
  }

  if (path.startsWith('/inmueble/')) return <PropertyDetail id={path.split('/')[2]} />;
  if (['/venta', '/arriendo', '/corta-estancia'].includes(path)) return <PublicProperties operation={path.slice(1)} />;
  if (path === '/propiedades') return <PublicProperties />;
  if (path === '/nosotros') return <About />;
  if (path === '/contacto') return <Contact />;
  if (['/publicar', '/publica-tu-inmueble', '/vender'].includes(path)) return <PublishProperty />;

  return <Home />;
}

export default App;
