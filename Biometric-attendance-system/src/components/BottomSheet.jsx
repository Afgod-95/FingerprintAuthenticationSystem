import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './BottomSheet.css';
import { bgColor} from '../constants/Colors';

const BottomSheet = ({ isOpen, onClose, children }) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="backdrop"
          onClick={onClose}
        >
          <motion.div
            className="bottom-sheet"
            style={{backgroundColor: bgColor}}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="handle" style={{cursor: 'pointer'}} onClick={onClose}/>
            <div className="content">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
