import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, message } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './components/MasterLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Employees from './pages/Employees';
import Categories from './pages/Categories';
import Modifiers from './pages/Modifiers';
import Devices from './pages/Devices';
import Configuration from './pages/Configuration';
import Reports from './pages/Reports';
import Activities from './pages/Activities';

import { MenuItem, Category, ModifierGroup, Device, Employee, Activity } from './types';
import { MOCK_MENU_ITEMS, MOCK_CATEGORIES, MOCK_MODIFIER_GROUPS, MOCK_DEVICES, MOCK_EMPLOYEES } from './constants';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>(MOCK_MODIFIER_GROUPS);
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);

  // Activity Log State
  const [activities, setActivities] = useState<Activity[]>([
      { id: '1', user: 'System', action: 'initialized', target: 'Aroma POS', time: new Date() }
  ]);

  // Logging Helper
  const logActivity = (action: string, target: string) => {
      const newActivity: Activity = {
          id: Date.now().toString(),
          user: currentUser ? currentUser.name : 'System',
          action: action,
          target: target,
          time: new Date()
      };
      // Keep only last 200 activities
      setActivities(prev => [newActivity, ...prev].slice(0, 200));
  };

  // Update body background when theme changes
  useEffect(() => {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#121212';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.style.backgroundColor = '#f8f9fa';
    }
  }, [isDarkMode]);

  const handleLogin = (user: Employee) => {
      setCurrentUser(user);
      // We can't use currentUser state immediately here for logging because it's async
      // So we manually pass the user name
      setActivities(prev => [{
          id: Date.now().toString(),
          user: user.name,
          action: 'logged in',
          target: 'Dashboard',
          time: new Date()
      }, ...prev]);
  };

  const handleLogout = () => {
      logActivity('logged out', 'System');
      setCurrentUser(null);
      message.info("Logged out successfully");
  };

  // --- Category Handlers ---
  const handleSaveCategory = (cat: Category) => {
      if(categories.find(c => c.id === cat.id)) {
          setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
          logActivity('updated category', cat.name);
      } else {
          setCategories(prev => [...prev, cat]);
          logActivity('created category', cat.name);
      }
      message.success("Category saved");
  };
  const handleDeleteCategory = (id: string) => {
      const cat = categories.find(c => c.id === id);
      setCategories(prev => prev.filter(c => c.id !== id));
      message.success("Category deleted");
      if(cat) logActivity('deleted category', cat.name);
  };

  // --- Modifier Handlers ---
  const handleSaveModifierGroup = (group: ModifierGroup) => {
      if(modifierGroups.find(g => g.id === group.id)) {
          setModifierGroups(prev => prev.map(g => g.id === group.id ? group : g));
          logActivity('updated modifier group', group.name);
      } else {
          setModifierGroups(prev => [...prev, group]);
          logActivity('created modifier group', group.name);
      }
      message.success("Modifier Group saved");
  };
  const handleDeleteModifierGroup = (id: string) => {
      const group = modifierGroups.find(g => g.id === id);
      setModifierGroups(prev => prev.filter(g => g.id !== id));
      message.success("Modifier Group deleted");
      if(group) logActivity('deleted modifier group', group.name);
  };

  // --- Device Handlers ---
  const handleSaveDevice = (device: Device) => {
      if(devices.find(d => d.id === device.id)) {
          setDevices(prev => prev.map(d => d.id === device.id ? device : d));
          logActivity('updated device', device.name);
      } else {
          setDevices(prev => [...prev, device]);
          logActivity('registered device', device.name);
      }
      message.success("Device saved");
  };
  const handleDeleteDevice = (id: string) => {
      const dev = devices.find(d => d.id === id);
      setDevices(prev => prev.filter(d => d.id !== id));
      message.success("Device deleted");
      if(dev) logActivity('removed device', dev.name);
  };

  const appTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#6132C0', // Aroma POS Purple
      fontFamily: "'Inter', sans-serif",
      borderRadius: 6,
      
      ...(!isDarkMode && {
        colorBgLayout: '#f8f9fa',
        colorBgContainer: '#ffffff',
        colorBorder: '#e6e8eb',
        colorText: '#1f2937',
        colorTextSecondary: '#6b7280',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.02)',
      }),

      ...(isDarkMode && {
        colorBgLayout: '#121212',
        colorBgContainer: '#1c1c1c',
        colorBorder: '#2e2e2e',
        colorText: '#ededed',
        colorTextSecondary: '#a1a1a1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }),
    },
    components: {
        Button: {
            fontWeight: 500,
            controlHeight: 36,
            boxShadow: 'none',
        },
        Layout: {
            headerBg: isDarkMode ? '#1c1c1c' : '#ffffff',
            bodyBg: isDarkMode ? '#121212' : '#f8f9fa',
        },
        Card: {
            boxShadow: 'none',
            colorBorderSecondary: isDarkMode ? '#2e2e2e' : '#e6e8eb',
        },
        Table: {
            headerBg: '#6132C0',
            headerColor: '#ffffff',
            borderColor: isDarkMode ? '#2e2e2e' : '#e6e8eb',
            headerSplitColor: 'transparent',
        },
        Input: {
            colorBgContainer: isDarkMode ? '#121212' : '#ffffff',
            activeBorderColor: '#6132C0',
            hoverBorderColor: '#8b5cf6',
        },
        Select: {
            colorBgContainer: isDarkMode ? '#121212' : '#ffffff',
        }
    }
  };

  return (
    <ConfigProvider theme={appTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
          
          {/* Protected Routes */}
          <Route path="/" element={currentUser ? <MasterLayout currentUser={currentUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
            <Route index element={<Dashboard isDarkMode={isDarkMode} activities={activities} />} />
            
            <Route path="menu" element={
                <Menu 
                    menuItems={menuItems}
                    setMenuItems={setMenuItems}
                    categories={categories}
                    modifierGroups={modifierGroups}
                    devices={devices}
                    currentUser={currentUser}
                    onLogActivity={logActivity}
                />
            } />
            
            <Route path="categories" element={
                <Categories 
                    categories={categories} 
                    devices={devices} 
                    onSave={handleSaveCategory} 
                    onDelete={handleDeleteCategory} 
                />
            } />
            
            <Route path="modifiers" element={
                <Modifiers 
                    groups={modifierGroups} 
                    onSave={handleSaveModifierGroup} 
                    onDelete={handleDeleteModifierGroup} 
                />
            } />
            
            <Route path="devices" element={
                <Devices 
                    devices={devices} 
                    onSave={handleSaveDevice} 
                    onDelete={handleDeleteDevice} 
                />
            } />
            
            <Route path="employees" element={<Employees onLogActivity={logActivity} activities={activities} />} />
            <Route path="activities" element={<Activities activities={activities} />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="reports" element={<Reports isDarkMode={isDarkMode} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;