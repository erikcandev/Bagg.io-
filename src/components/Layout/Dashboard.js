import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Button, Link } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Inventory as InventoryIcon, 
         Assignment as AssignmentIcon, People as PeopleIcon, Settings as SettingsIcon,
         Logout as LogoutIcon, Checklist as ChecklistIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logoBaggio from '../../assets/logo-baggio.png';
import { ThemeModeContext } from '../../index';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const drawerWidth = 240;
const appBarHeight = 64; // Altura padrão do AppBar do MUI

function Dashboard({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();
  const { usuarioLogado, logout } = useAuth();
  const themeMode = React.useContext(ThemeModeContext);

  const isAdmin = usuarioLogado?.cargo === 'admin';
  const isGestor = usuarioLogado?.cargo === 'gestor';
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Bens', icon: <InventoryIcon />, path: '/bens' },
    { text: 'Movimentações', icon: <AssignmentIcon />, path: '/movimentacoes' },
    { text: 'Conferências', icon: <ChecklistIcon />, path: '/conferencias' },
    ...(isAdmin ? [
      { text: 'Usuários', icon: <PeopleIcon />, path: '/usuarios' },
      { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
    ] : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawer = (
    <Box sx={{ backgroundColor: (theme) => theme.palette.background.paper, height: '100%', minHeight: '100vh' }}>
      <Toolbar sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        <img src={logoBaggio} alt="Logo Bagg.io" style={{ width: 56, height: 56, marginBottom: 8 }} />
        <Typography variant="h6" noWrap component="div" sx={{ mb: 2, fontWeight: 700 }}>
          Bagg.io
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            component="button"
            key={item.text} 
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{ color: (theme) => theme.palette.text.primary, backgroundColor: (theme) => theme.palette.background.paper }}
          >
            <ListItemIcon sx={{ color: (theme) => theme.palette.text.primary }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: '100%',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <img src={logoBaggio} alt="Logo Bagg.io" style={{ width: 36, height: 36, marginRight: 8 }} />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              Bagg.io
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit" onClick={themeMode.toggleTheme}>
              {themeMode.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <Typography variant="body2">
              {usuarioLogado?.nome}
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer sempre temporário, abre apenas ao clicar no menu */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          mt: `${appBarHeight}px` // Adiciona margem superior igual à altura do AppBar
        }}
      >
        {children}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) => theme.palette.background.paper,
            textAlign: 'center',
            color: (theme) => theme.palette.text.secondary
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Developed by Erik Domingos Candido
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 1 }}>
            <Link
              href="mailto:erikcandido93@gmail.com"
              color="inherit"
              underline="hover"
            >
              Contact
            </Link>
            <Link
              href="https://www.linkedin.com/in/erik-domingos-candido-646628366/"
              color="inherit"
              underline="hover"
              target="_blank"
              rel="noopener"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <LinkedInIcon sx={{ mr: 0.5 }} /> LinkedIn
            </Link>
            <Link
              href="https://github.com/erikcandev"
              color="inherit"
              underline="hover"
              target="_blank"
              rel="noopener"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <GitHubIcon sx={{ mr: 0.5 }} /> GitHub
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard; 