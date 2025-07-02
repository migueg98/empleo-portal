
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log specific error types for debugging
    if (error.name === 'ChunkLoadError') {
      console.error('ChunkLoadError detected - likely a deployment issue');
    } else if (error.message?.includes('supabase')) {
      console.error('Supabase-related error detected');
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunkError = this.state.error?.name === 'ChunkLoadError';
      const isSupabaseError = this.state.error?.message?.includes('supabase') || 
                             this.state.error?.message?.includes('RLS') ||
                             this.state.error?.message?.includes('Row Level Security');

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              {isChunkError && 'Error de Carga de Recursos'}
              {isSupabaseError && 'Error de Base de Datos'}
              {!isChunkError && !isSupabaseError && 'Algo salió mal'}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isChunkError && (
                <p className="mb-4">
                  No se pudieron cargar algunos recursos de la aplicación. Esto puede ocurrir después de una actualización. 
                  Por favor, recarga la página para obtener la última versión.
                </p>
              )}
              {isSupabaseError && (
                <p className="mb-4">
                  Hubo un problema al acceder a los datos. Esto puede deberse a permisos insuficientes o problemas de conexión. 
                  Por favor, verifica tu conexión e inténtalo de nuevo.
                </p>
              )}
              {!isChunkError && !isSupabaseError && (
                <p className="mb-4">
                  Ha ocurrido un error inesperado en la aplicación. Por favor, recarga la página o vuelve al inicio.
                </p>
              )}
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 mb-4 p-2 bg-gray-100 rounded text-xs">
                  <summary className="cursor-pointer font-medium">Detalles del Error (Solo desarrollo)</summary>
                  <pre className="mt-2 whitespace-pre-wrap text-red-600">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button onClick={this.handleReload} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recargar Página
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al Inicio
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
