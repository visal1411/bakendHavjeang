import { 
  X, 
  User, 
  Home as HomeIcon, 
  History, 
  Bookmark, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Sidebar navigation component with smooth slide-in animation
 */
export const Sidebar = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  const handleMenuItemClick = (tab) => {
    onTabChange(tab);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with fade animation */}
          <motion.div 
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />

          {/* Sidebar with slide animation */}
          <motion.div 
            className="fixed top-0 left-0 bottom-0 w-full max-w-[320px] sm:max-w-[360px] bg-white z-[70] shadow-2xl flex flex-col"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative flex-shrink-0 h-48 bg-gradient-to-br from-primary to-blue-700 px-6 pt-8 pb-6 safe-area-top">
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
                  <User className="w-8 h-8 text-white" strokeWidth={2.5} />
                </motion.div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Customer</h2>
                  <p className="text-sm text-white/80">Phnom Penh, Cambodia</p>
                </div>
              </motion.div>
            </div>

            {/* Navigation Menu with stagger animation */}
            <motion.nav 
              className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide"
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
                {/* Menu items array for cleaner code */}
                {[
                  { id: 'explore', icon: HomeIcon, label: 'Explore', subtitle: 'Find nearby mechanics' },
                  { id: 'history', icon: History, label: 'History', subtitle: 'Your service history' },
                  { id: 'saved', icon: Bookmark, label: 'Saved', subtitle: 'Favorite mechanics' },
                  { id: 'profile', icon: User, label: 'Profile', subtitle: 'Manage your account' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <motion.div
                      key={item.id}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 }
                      }}
                    >
                      <motion.button
                        onClick={() => handleMenuItemClick(item.id)}
                        className={cn(
                          "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all min-h-[60px]",
                          isActive 
                            ? 'bg-primary text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-100'
                        )}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ x: isActive ? 0 : 4 }}
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <motion.div 
                          className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center",
                            isActive ? 'bg-white/20' : 'bg-gray-100'
                          )}
                          whileHover={{ rotate: 5 }}
                        >
                          <Icon className="w-6 h-6" strokeWidth={2.5} />
                        </motion.div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-base">{item.label}</div>
                          <div className={cn(
                            "text-xs",
                            isActive ? 'text-white/80' : 'text-gray-500'
                          )}>
                            {item.subtitle}
                          </div>
                        </div>
                        <motion.div
                          animate={isActive ? { x: [0, 5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>

            {/* Footer with animation */}
            <motion.div 
              className="flex-shrink-0 px-4 pb-6 pt-4 border-t border-gray-100 bg-white safe-area-bottom"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all min-h-[60px]"
                whileTap={{ scale: 0.97 }}
                whileHover={{ x: 4 }}
                aria-label="Logout from account"
              >
                <motion.div 
                  className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center"
                  whileHover={{ rotate: 10 }}
                >
                  <LogOut className="w-6 h-6" strokeWidth={2.5} />
                </motion.div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-base">Logout</div>
                  <div className="text-xs text-red-500">Sign out of your account</div>
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
