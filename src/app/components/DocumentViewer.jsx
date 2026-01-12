import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
        <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <Loader2 className="size-8 animate-spin text-gray-400" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={`${fileUrl}-${currentPage}`}
            src={`${fileUrl}#page=${currentPage}&zoom=${zoom}`}
            className="w-full h-full border-0"
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
        <div className="w-full h-full flex items-center justify-center bg-gray-900 overflow-auto relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
              <Loader2 className="size-8 animate-spin text-white" />
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
        <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <Loader2 className="size-8 animate-spin text-gray-400" />
            </div>
          )}
          {hasError ? (
            <div className="text-center p-8">
              <p className="text-gray-600 mb-4">Preview not available. Please download to view.</p>
              <Button onClick={handleDownload}>
                <Download className="size-4 mr-2" />
                Download to View
              </Button>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              key={fileUrl}
              src={officeViewerUrl}
              className="w-full h-full border-0"
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
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Preview not available for this file type</p>
          <Button onClick={handleDownload}>
            <Download className="size-4 mr-2" />
            Download to View
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Document viewer for {title} - {fileType.toUpperCase()} file
        </DialogDescription>
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
          <h3 className="font-medium truncate pr-4">{title}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
            >
              <Download className="size-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* Viewer */}
        <div className="flex-1 overflow-hidden">
          {renderViewer()}
        </div>

        {/* Controls */}
        <div className="bg-white border-t px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="size-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {zoom}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="size-4" />
            </Button>
          </div>

          {fileType === 'pdf' && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-medium min-w-[80px] text-center">
                Page {currentPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}

          <div className="text-sm text-gray-500 uppercase">
            {fileType}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};