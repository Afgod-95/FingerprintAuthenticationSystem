import React, { useEffect, useRef } from 'react';
import Lottie from 'react-lottie-player';
import { motion } from 'framer-motion';
import errorAnimation from '../assets/Error.json';
import successAnimation from '../assets/Success.json';
import { bgColor } from '../constants/Colors';

const ErrorMessages = ({ errorMessage, visible, onClose }) => {
    const fadeAnim = useRef({ opacity: 0 });

    useEffect(() => {
        if (visible) {
            fadeAnim.current = { opacity: 1 };
        } else {
            fadeAnim.current = { opacity: 0 };
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <motion.div style={{ ...styles.modalContainer, ...fadeAnim.current }}>
            <div style={styles.modalContent}>
                <Lottie
                    animationData={errorAnimation}
                    play
                    loop={false}
                    style={styles.lottieStyle}
                />
                <div style={styles.messageContainer}>
                    <span style={{ ...styles.messageText, ...styles.errorText }}>Error: </span>
                    <span style={styles.messageText}>{errorMessage}</span>
                </div>
                <button style={styles.closeButton} onClick={onClose}>
                    <span style={styles.closeButtonText}>Close</span>
                </button>
            </div>
        </motion.div>
    );
};

const SuccessMessages = ({ successMessage, visible, onClose }) => {
    const fadeAnim = useRef({ opacity: 0 });

    useEffect(() => {
        if (visible) {
            fadeAnim.current = { opacity: 1 };
        } else {
            fadeAnim.current = { opacity: 0 };
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <motion.div style={{ ...styles.modalContainer, ...fadeAnim.current }}>
            <div style={styles.modalContent}>
                <Lottie
                    animationData={successAnimation}
                    play
                    loop={false}
                    style={styles.lottieStyle}
                />
                <div style={styles.messageContainer}>
                    <span style={{ ...styles.messageText, ...styles.successText }}>Success: </span>
                    <span style={styles.messageText}>{successMessage}</span>
                </div>
            </div>
        </motion.div>
    );
};

const styles = {
    modalContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        width: 'calc(100% - 50px)',
        maxWidth: '400px',
        backgroundColor: bgColor,
        borderRadius: '20px',
        padding: '15px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    lottieStyle: {
        width: '150px',
        height: '150px',
        backgroundColor: bgColor,
    },
    messageContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
    },
    messageText: {
        color: '#FFF',
    },
    errorText: {
        fontWeight: 'bold',
        color: '#FF0000',
        marginRight: '5px',
    },
    successText: {
        fontWeight: 'bold',
        color: '#04d120',
        marginRight: '5px',
    },
    closeButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#FF0000',
        borderRadius: '10px',
        border: 'none',
        cursor: 'pointer',
    },
    closeButtonText: {
        color: '#FFF',
    },
};

export { ErrorMessages, SuccessMessages };
