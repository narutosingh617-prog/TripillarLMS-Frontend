import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const DocumentViewer = ({
  open,
  onOpenChange,
  title,
  fileUrl,
  fileType,
  onDownload
}) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);

  // Reset states when dialog opens/closes or fileUrl changes
  useEffect(() => {
    if (open && fileUrl) {
      setIsLoading(true);
      setHasError(false);
      setCurrentPage(1);
      setZoom(100);
    }
  }, [open, fileUrl]);

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      // Direct download if no handler provided
      try {
        toast.info(`Downloading ${title}...`);
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('Failed to download');
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Use original file type extension if available
        const downloadFileName = fileType ? `${title}.${fileType}` : `${title}.${fileUrl.split('.').pop().split('?')[0]}`;
        link.download = downloadFileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success('Download started');
      } catch (error) {
        // Fallback: direct link
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        const downloadFileName = fileType ? `${title}.${fileType}` : title;
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info('Opening download link');
      }
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const zoomIn = () => {
    if (zoom < 200) {
      setZoom(prev => Math.min(prev + 10, 200));
    }
  };

  const zoomOut = () => {
    if (zoom > 50) {
      setZoom(prev => Math.max(prev - 10, 50));
    }
  };

  const renderViewer = () => {
    // For PDF files
    if (fileType === 'pdf') {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50/50 relative backdrop-blur-sm">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={`${fileUrl}-${currentPage}`}
            src={`${fileUrl}#page=${currentPage}&zoom=${zoom}`}
            className="w-full h-full border-0 bg-transparent"
            title={title}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ display: isLoading ? 'none' : 'block' }}
          />
        </div>
      );
    }

    // For images
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType.toLowerCase())) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900/50 backdrop-blur-sm overflow-auto relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-10 animate-spin text-white" />
                <p className="text-sm text-white/70">Loading image...</p>
              </div>
            </div>
          )}
          <img
            src={fileUrl}
            alt={title}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${zoom / 100})`, display: isLoading ? 'none' : 'block' }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      );
    }

    // For DOC/DOCX/PPT/PPTX - use Google Docs Viewer or Office Online
    if (['doc', 'docx', 'ppt', 'pptx'].includes(fileType.toLowerCase())) {
      // Try Office Online viewer first (better for Office files)
      const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
      const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50/50 relative backdrop-blur-sm">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading document...</p>
              </div>
            </div>
          )}
          {hasError ? (
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="size-8 text-muted-foreground" />
              </div>
              <p className="text-gray-600 mb-4 text-lg">Preview not available</p>
              <p className="text-sm text-muted-foreground mb-4">This file type cannot be previewed in browser</p>
              <Button onClick={handleDownload} className="bg-primary text-white hover:bg-primary/90">
                <Download className="size-4 mr-2" />
                Download to View
              </Button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={fileUrl}
              src={officeViewerUrl}
              className="w-full h-full border-0 bg-transparent"
              title={title}
              onLoad={handleIframeLoad}
              onError={() => {
                // Fallback to Google Viewer if Office Viewer fails
                if (iframeRef.current) {
                  iframeRef.current.src = googleViewerUrl;
                }
                handleIframeError();
              }}
              style={{ display: isLoading ? 'none' : 'block' }}
            />
          )}
        </div>
      );
    }

    // Fallback for unsupported formats
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50/50 backdrop-blur-sm">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileText className="size-8 text-muted-foreground" />
          </div>
          <p className="text-gray-600 mb-4 text-lg">Preview not available</p>
          <p className="text-sm text-muted-foreground mb-4">This file type is not supported for preview</p>
          <Button onClick={handleDownload} className="bg-primary text-white hover:bg-primary/90">
            <Download className="size-4 mr-2" />
            Download to View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] sm:h-[90vh] p-0 overflow-hidden bg-transparent border-0 shadow-none m-2 sm:m-4" style={{ backgroundColor: 'transparent' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Document viewer for {title} - {fileType.toUpperCase()} file
          </DialogDescription>
          {/* Header */}
          <div className="bg-gradient-to-b from-white to-gray-50 border-b px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between flex-shrink-0">
            <h3 className="font-medium truncate pr-2 sm:pr-4 text-gray-700 text-sm sm:text-base">{title}</h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="bg-white hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-9"
              >
                <Download className="size-3 sm:size-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="hover:bg-gray-100 h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="size-4 sm:size-5" />
              </Button>
            </div>
          </div>

          {/* Viewer */}
          <div className="flex-1 overflow-hidden">
            {renderViewer()}
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-t from-white to-gray-50 border-t px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 flex-shrink-0">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 50}
                className="bg-white hover:bg-gray-50 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
              >
                <ZoomOut className="size-3 sm:size-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 200}
                className="bg-white hover:bg-gray-50 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
              >
                <ZoomIn className="size-3 sm:size-4" />
              </Button>
            </div>

            {fileType === 'pdf' && (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage <= 1}
                  className="bg-white hover:bg-gray-50 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                >
                  <ChevronLeft className="size-3 sm:size-4" />
                </Button>
                <span className="text-xs sm:text-sm font-medium min-w-[70px] sm:min-w-[80px] text-center">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="bg-white hover:bg-gray-50 h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
                >
                  <ChevronRight className="size-3 sm:size-4" />
                </Button>
              </div>
            )}

            <div className="text-xs sm:text-sm text-muted-foreground uppercase font-medium bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
              {fileType}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
