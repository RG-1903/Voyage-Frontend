import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const Button = ({ children, className, variant = 'primary', icon: Icon, ...props }) => {
    
    // UPDATED: Removed "transition-all duration-300" to prevent conflict with Framer Motion
    const baseClasses = "px-8 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg group";

    const variants = {
        primary: "bg-teal-600 text-white hover:bg-teal-700 hover:shadow-glow-teal",
        secondary: "bg-white text-teal-700 hover:bg-slate-100 hover:shadow-glow-white",
    };

    return (
        <motion.button
            // This transition now has full control and will be instant
            whileHover={{ 
                scale: 1.05, 
                y: -2, 
                transition: { type: 'spring', stiffness: 400, damping: 15 } 
            }}
            whileTap={{ scale: 0.95, y: 0 }}
            className={cn(baseClasses, variants[variant], className)}
            {...props}
        >
            {children}
            {Icon && <Icon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />}
        </motion.button>
    );
};

export default Button;