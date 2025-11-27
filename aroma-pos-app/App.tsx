




import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, message, Spin } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MasterLayout from './components/MasterLayout';

// Services
import { authService } from './services/auth.service';
import { catalogService } from './services/catalog.service';
import { systemService } from './services/system.service';
import { orderService } from './services/order.service';

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
import RolePermissions from './pages/RolePermissions';
import Taxes from './pages/Taxes';
import Branches from './pages/Branches';
import Orders from './pages/Orders';

import { MenuItem, Category, ModifierGroup, Device, Employee, Activity, Role, Tax, Branch, Order } from './types';
import { 
    DEFAULT_ROLE_PERMISSIONS, 
    // Fallback Mock Data in case API fails during demo
    MOCK_MENU_ITEMS, MOCK_CATEGORIES, MOCK_MODIFIER_GROUPS, MOCK_DEVICES, MOCK_TAXES, MOCK_EMPLOYEES, MOCK_BRANCHES, MOCK_ORDERS 
} from './constants';

const App: React.FC = () => {
  // Auth State
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
      const match = document.cookie.match(new RegExp('(^| )theme_mode=([^;]+)'));
      if (match) return match[2] === 'dark';
      return false;
  });
  
  // Data State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modifierGroups, setModifierGroups] = useState<ModifierGroup[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<Role, string[]>>(DEFAULT_ROLE_PERMISSIONS);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // --- Initial Data Fetching ---
  useEffect(() => {
      if (currentUser) {
          fetchInitialData();
      }
  }, [currentUser]);

  const fetchInitialData = async () => {
      setIsLoading(true);
      try {
          // In a real scenario, use Promise.all. 
          // For demo robustness, we wrap each in catch to use mocks if API fails
          
          const [
              productsRes, catsRes, modsRes, taxesRes, devicesRes, permsRes, actsRes, branchesRes, ordersRes
          ] = await Promise.allSettled([
              catalogService.getProducts(),
              catalogService.getCategories(),
              catalogService.getModifiers(),
              catalogService.getTaxes(),
              systemService.getDevices(),
              systemService.getPermissions(),
              systemService.getActivities(),
              systemService.getBranches(),
              orderService.getOrders()
          ]);

          // Handle Results or Fallback to Mocks
          setMenuItems(productsRes.status === 'fulfilled' ? productsRes.value : MOCK_MENU_ITEMS);
          setCategories(catsRes.status === 'fulfilled' ? catsRes.value : MOCK_CATEGORIES);
          setModifierGroups(modsRes.status === 'fulfilled' ? modsRes.value : MOCK_MODIFIER_GROUPS);
          setTaxes(taxesRes.status === 'fulfilled' ? taxesRes.value : MOCK_TAXES);
          setDevices(devicesRes.status === 'fulfilled' ? devicesRes.value : MOCK_DEVICES);
          
          if (permsRes.status === 'fulfilled') setRolePermissions(permsRes.value);
          if (actsRes.status === 'fulfilled') setActivities(actsRes.value);
          
          setBranches(branchesRes.status === 'fulfilled' ? branchesRes.value : MOCK_BRANCHES);
          setOrders(ordersRes.status === 'fulfilled' ? ordersRes.value : MOCK_ORDERS);

      } catch (error) {
          console.error("Error loading initial data", error);
          message.error("Failed to load some data. Using local cache.");
      } finally {
          setIsLoading(false);
      }
  };

  // --- Theme Effect ---
  useEffect(() => {
    const themeValue = isDarkMode ? 'dark' : 'light';
    document.cookie = `theme_mode=${themeValue}; path=/; max-age=31536000; SameSite=Lax`;
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.body.style.backgroundColor = '#121212';
    } else {
        document.body.classList.remove('dark-mode');
        document.body.style.backgroundColor = '#f8f9fa';
    }
  }, [isDarkMode]);

  // --- Activity Logger ---
  const logActivity = (action: string, target: string) => {
      const newActivity: Activity = {
          id: Date.now().toString(),
          user: currentUser ? currentUser.name : 'System',
          action: action,
          target: target,
          time: new Date()
      };
      
      // Update UI immediately
      setActivities(prev => [newActivity, ...prev].slice(0, 200));

      // Send to backend
      systemService.logActivity({ 
          action, 
          target, 
          user: currentUser ? currentUser.name : 'System' 
      }).catch(err => console.error("Failed to log activity", err));
  };

  // --- Auth Handlers ---
  const handleLogin = async (user: Employee) => {
      // In a real app, Login component calls authService, returns token/user
      // Here we simulate setting the user
      setCurrentUser(user);
      logActivity('logged in', 'Dashboard');
  };

  const handleLogout = () => {
      authService.logout();
      logActivity('logged out', 'System');
      setCurrentUser(null);
      message.info("Logged out successfully");
  };

  // --- Category Handlers ---
  const handleSaveCategory = async (cat: Category) => {
      try {
          let savedCat;
          if (categories.find(c => c.id === cat.id)) {
              savedCat = await catalogService.updateCategory(cat.id, cat);
              // Fallback for demo if API returns nothing
              savedCat = savedCat || cat; 
              setCategories(prev => prev.map(c => c.id === cat.id ? savedCat : c));
              logActivity('updated category', cat.name);
          } else {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { id, ...newCatData } = cat; // Remove ID for creation usually
              savedCat = await catalogService.createCategory(newCatData);
               // Fallback for demo
              savedCat = savedCat || cat;
              setCategories(prev => [...prev, savedCat]);
              logActivity('created category', cat.name);
          }
          message.success("Category saved");
      } catch (error) {
          message.error("Failed to save category");
      }
  };

  const handleDeleteCategory = async (id: string) => {
      try {
          await catalogService.deleteCategory(id);
          const cat = categories.find(c => c.id === id);
          setCategories(prev => prev.filter(c => c.id !== id));
          message.success("Category deleted");
          if(cat) logActivity('deleted category', cat.name);
      } catch (error) {
          message.error("Failed to delete category");
      }
  };

  // --- Modifier Handlers ---
  const handleSaveModifierGroup = async (group: ModifierGroup) => {
      try {
        let savedGroup;
        if(modifierGroups.find(g => g.id === group.id)) {
            savedGroup = await catalogService.updateModifierGroup(group.id, group);
            savedGroup = savedGroup || group;
            setModifierGroups(prev => prev.map(g => g.id === group.id ? savedGroup : g));
            logActivity('updated modifier group', group.name);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newData } = group;
            savedGroup = await catalogService.createModifierGroup(newData);
            savedGroup = savedGroup || group;
            setModifierGroups(prev => [...prev, savedGroup]);
            logActivity('created modifier group', group.name);
        }
        message.success("Modifier Group saved");
      } catch (e) {
          message.error("Failed to save modifier group");
      }
  };

  const handleDeleteModifierGroup = async (id: string) => {
      try {
        await catalogService.deleteModifierGroup(id);
        const group = modifierGroups.find(g => g.id === id);
        setModifierGroups(prev => prev.filter(g => g.id !== id));
        message.success("Modifier Group deleted");
        if(group) logActivity('deleted modifier group', group.name);
      } catch (e) {
          message.error("Failed to delete modifier group");
      }
  };

  // --- Device Handlers ---
  const handleSaveDevice = async (device: Device) => {
      try {
        let savedDevice;
        if(devices.find(d => d.id === device.id)) {
            savedDevice = await systemService.updateDevice(device.id, device);
            savedDevice = savedDevice || device;
            setDevices(prev => prev.map(d => d.id === device.id ? savedDevice : d));
            logActivity('updated device', device.name);
        } else {
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newData } = device;
            savedDevice = await systemService.createDevice(newData);
            savedDevice = savedDevice || device;
            setDevices(prev => [...prev, savedDevice]);
            logActivity('registered device', device.name);
        }
        message.success("Device saved");
      } catch (e) {
          message.error("Failed to save device");
      }
  };

  const handleDeleteDevice = async (id: string) => {
      try {
        await systemService.deleteDevice(id);
        const dev = devices.find(d => d.id === id);
        setDevices(prev => prev.filter(d => d.id !== id));
        message.success("Device deleted");
        if(dev) logActivity('removed device', dev.name);
      } catch (e) {
          message.error("Failed to delete device");
      }
  };

  // --- Tax Handlers ---
  const handleSaveTax = async (tax: Tax) => {
      try {
        let savedTax;
        if(taxes.find(t => t.id === tax.id)) {
            savedTax = await catalogService.updateTax(tax.id, tax);
            savedTax = savedTax || tax;
            setTaxes(prev => prev.map(t => t.id === tax.id ? savedTax : t));
            logActivity('updated tax', tax.name);
        } else {
             // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newData } = tax;
            savedTax = await catalogService.createTax(newData);
            savedTax = savedTax || tax;
            setTaxes(prev => [...prev, savedTax]);
            logActivity('created tax', tax.name);
        }
        message.success("Tax saved");
      } catch (e) {
          message.error("Failed to save tax");
      }
  };

  const handleDeleteTax = async (id: string) => {
      try {
        await catalogService.deleteTax(id);
        const tax = taxes.find(t => t.id === id);
        setTaxes(prev => prev.filter(t => t.id !== id));
        // Remove from categories in UI state
        setCategories(prev => prev.map(c => ({
            ...c,
            taxIds: c.taxIds ? c.taxIds.filter(tid => tid !== id) : []
        })));
        message.success("Tax deleted");
        if(tax) logActivity('deleted tax', tax.name);
      } catch (e) {
          message.error("Failed to delete tax");
      }
  };

  // --- Branch Handlers ---
  const handleSaveBranch = async (branch: Branch) => {
      try {
        let savedBranch;
        if(branches.find(b => b.id === branch.id)) {
            savedBranch = await systemService.updateBranch(branch.id, branch);
            savedBranch = savedBranch || branch;
            setBranches(prev => prev.map(b => b.id === branch.id ? savedBranch : b));
            logActivity('updated branch', branch.name);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...newData } = branch;
            savedBranch = await systemService.createBranch(newData);
            savedBranch = savedBranch || branch;
            setBranches(prev => [...prev, savedBranch]);
            logActivity('created branch', branch.name);
        }
        message.success("Branch saved");
      } catch (e) {
          message.error("Failed to save branch");
      }
  };

  const handleDeleteBranch = async (id: string) => {
      try {
        await systemService.deleteBranch(id);
        const branch = branches.find(b => b.id === id);
        setBranches(prev => prev.filter(b => b.id !== id));
        message.success("Branch deleted");
        if(branch) logActivity('deleted branch', branch.name);
      } catch (e) {
          message.error("Failed to delete branch");
      }
  };

  // --- Permission Handler ---
  const handleSavePermissions = async (newPermissions: Record<Role, string[]>) => {
      try {
        await systemService.updatePermissions(newPermissions);
        setRolePermissions(newPermissions);
        logActivity('updated role permissions', 'Security Settings');
      } catch (e) {
        message.error("Failed to save permissions");
      }
  };

  const getCurrentUserPermissions = () => {
      if (!currentUser) return [];
      return rolePermissions[currentUser.role] || [];
  };

  const appTheme = {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#6132C0',
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
        Button: { fontWeight: 500, controlHeight: 36, boxShadow: 'none' },
        Layout: { headerBg: isDarkMode ? '#1c1c1c' : '#ffffff', bodyBg: isDarkMode ? '#121212' : '#f8f9fa' },
        Card: { boxShadow: 'none', colorBorderSecondary: isDarkMode ? '#2e2e2e' : '#e6e8eb' },
        Table: { headerBg: '#6132C0', headerColor: '#ffffff', borderColor: isDarkMode ? '#2e2e2e' : '#e6e8eb' },
        Input: { colorBgContainer: isDarkMode ? '#121212' : '#ffffff', activeBorderColor: '#6132C0' },
        Select: { colorBgContainer: isDarkMode ? '#121212' : '#ffffff' }
    }
  };

  if (currentUser && isLoading) {
      return (
          <ConfigProvider theme={appTheme}>
              <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Spin size="large" tip="Loading System..." />
              </div>
          </ConfigProvider>
      );
  }

  return (
    <ConfigProvider theme={appTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} />
          
          <Route path="/" element={currentUser ? <MasterLayout currentUser={currentUser} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onLogout={handleLogout} rolePermissions={rolePermissions} /> : <Navigate to="/login" replace />}>
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
                    taxes={taxes}
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

            <Route path="taxes" element={
                <Taxes 
                    taxes={taxes}
                    onSave={handleSaveTax}
                    onDelete={handleDeleteTax}
                />
            } />
            
            <Route path="branches" element={
                <Branches 
                    branches={branches}
                    onSave={handleSaveBranch}
                    onDelete={handleDeleteBranch}
                />
            } />
            
            <Route path="orders" element={<Orders orders={orders} />} />
            
            <Route path="employees" element={<Employees onLogActivity={logActivity} activities={activities} branches={branches} />} />
            <Route path="roles" element={<RolePermissions rolePermissions={rolePermissions} onSave={handleSavePermissions} />} />
            <Route path="activities" element={<Activities activities={activities} />} />
            <Route path="configuration" element={<Configuration permissions={getCurrentUserPermissions()} />} />
            <Route path="reports" element={<Reports isDarkMode={isDarkMode} permissions={getCurrentUserPermissions()} />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
