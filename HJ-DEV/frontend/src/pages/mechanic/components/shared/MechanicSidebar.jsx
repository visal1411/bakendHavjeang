import { 
  X, 
  Wrench,
  LayoutDashboard, 
  ClipboardList, 
  History,
  User,
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Mechanic Sidebar Component
 * 
 * Simplified navigation with clear, non-technical language
 */
export const MechanicSidebar = ({ isOpen, onClose, activeSection, onSectionChange }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleMenuItemClick = (section) => {
    onSectionChange(section);
    onClose();
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      description: 'Job requests & earnings'
    },
    {
      id: 'services',
      label: 'My Services',
      icon: ClipboardList,
      description: 'What I can fix'
    },
    {
      id: 'history',
      label: 'Job History',
      icon: History,
      description: 'Past completed jobs'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: User,
      description: 'Account & settings'
    }
  ];
  const itemVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div 
            className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] sm:max-w-[360px] bg-white z-[70] shadow-2xl flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative flex-shrink-0 h-48 bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-6">
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
                whileTap={{ scale: 0.9, rotate: 90 }}
                whileHover={{ scale: 1.1 }}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </motion.button>
              
              <motion.div 
                className="flex items-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Wrench className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    {user?.name || 'Mechanic'}
                  </h2>
                  <p className="text-sm text-white/90">Roadside Mechanic</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Menu */}
            <motion.nav 
              className="flex-1 px-4 py-6 overflow-y-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.15
                  }
                }
              }}
            >
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`
                        w-full group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-primary text-white shadow-md' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                      variants={itemVariant}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`
                        w-11 h-11 rounded-xl flex items-center justify-center transition-all
                        ${isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                        }
                      `}>
                        <Icon 
                          className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} 
                          strokeWidth={2.5} 
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {item.label}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          isActive 
                            ? 'text-white translate-x-0.5' 
                            : 'text-gray-400 group-hover:translate-x-0.5'
                        }`} 
                      />
                    </motion.button>
                  );
                })}
              </div>
            </motion.nav>

            {/* Footer - Logout */}
            <motion.div 
              className="flex-shrink-0 px-4 pb-6 border-t border-gray-100"
              variants={itemVariant}
            >
              <motion.button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all group"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-all">
                  <LogOut className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <span className="flex-1 text-left font-semibold text-sm">Sign Out</span>
                <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
