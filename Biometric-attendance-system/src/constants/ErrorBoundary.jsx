import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorInfo: error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log error information here
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h1>Something went wrong.</h1>
          <p>{this.state.errorInfo?.toString()}</p>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
