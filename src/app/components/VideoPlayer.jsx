import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Download } from 'lucide-react';
import { toast } from 'sonner';

export const VideoPlayer = ({
  open,
  onOpenChange,
  title,
  videoUrl,
  onDownload
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Convert Google Drive URL to embeddable format
  const getEmbedUrl = (url) => {
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      // Extract file ID from Google Drive URL
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      const idMatch = url.match(/id=([a-zA-Z0-9_-]+)/);
      if (idMatch) {
        return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
      }
    }
    return url;
  };

  const isGoogleDrive = videoUrl.includes('drive.google.com');
  const embedUrl = getEmbedUrl(videoUrl);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
    } else {
      // Direct download if no handler provided
      try {
        toast.info('Downloading video...');
        const response = await fetch(videoUrl);
        if (!response.ok) throw new Error('Failed to download');
        
        // Get the content type from response headers to determine file format
        const contentType = response.headers.get('content-type') || '';
        let fileExtension = 'mp4'; // Default
        
        // Extract extension from content type
        if (contentType.includes('video/mp4')) fileExtension = 'mp4';
        else if (contentType.includes('video/webm')) fileExtension = 'webm';
        else if (contentType.includes('video/quicktime') || contentType.includes('video/mov')) fileExtension = 'mov';
        else if (contentType.includes('video/x-msvideo') || contentType.includes('video/avi')) fileExtension = 'avi';
        else if (contentType.includes('video/x-matroska') || contentType.includes('video/mkv')) fileExtension = 'mkv';
        else {
          // Try to extract from URL as fallback
          const urlMatch = videoUrl.match(/\.([a-z0-9]+)(?:\?|$)/i);
          if (urlMatch) fileExtension = urlMatch[1].toLowerCase();
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Use detected extension to preserve original format
        link.download = `${title}.${fileExtension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success('Download started');
      } catch (error) {
        console.error('Download error:', error);
        // Fallback: direct link
        const link = document.createElement('a');
        link.href = videoUrl;
        link.target = '_blank';
        
        // Try to extract extension from URL
        const urlMatch = videoUrl.match(/\.([a-z0-9]+)(?:\?|$)/i);
        const fileExtension = urlMatch ? urlMatch[1].toLowerCase() : 'mp4';
        link.download = `${title}.${fileExtension}`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info('Opening download link');
      }
    }
  };

  const handleError = () => {
    setHasError(true);
    toast.error('Video could not be loaded');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden bg-transparent border-0 shadow-none m-2 sm:m-4" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
        <div className="bg-black/90 backdrop-blur-sm rounded-xl overflow-hidden">
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">
            Video player for {title}
          </DialogDescription>
          {/* Header */}
          <div className="bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10 p-2 sm:p-4 flex items-center justify-between">
            <h3 className="text-white font-medium truncate pr-2 sm:pr-4 text-sm sm:text-base">{title}</h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Download className="size-4 sm:size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
              >
                <X className="size-4 sm:size-5" />
              </Button>
            </div>
          </div>

          {/* Video */}
          <div className="relative aspect-video bg-transparent" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
            {isGoogleDrive ? (
              // Use iframe for Google Drive videos
              <iframe
                src={embedUrl}
                className="w-full h-full bg-transparent"
                style={{ backgroundColor: 'transparent', background: 'transparent' }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={title}
              />
            ) : (
              // Use HTML5 video for direct video URLs
              <>
                <video
                  ref={videoRef}
                  className="w-full h-full bg-transparent"
                  style={{ backgroundColor: 'transparent', background: 'transparent' }}
                  src={videoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  onClick={togglePlay}
                  onError={handleError}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Play Overlay */}
                {!isPlaying && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-black/10 cursor-pointer"
                    onClick={togglePlay}
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <div className="bg-white/90 rounded-full p-6 hover:bg-white transition-all hover:scale-110 shadow-lg">
                      <Play className="size-12 text-black" fill="black" />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Controls - Only show for non-Google Drive videos */}
          {!isGoogleDrive && (
            <div className="bg-gradient-to-t from-black/90 to-transparent p-2 sm:p-4 space-y-2">
              {/* Seek Bar */}
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-white text-xs sm:text-sm font-mono min-w-[40px] sm:min-w-[45px]">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${(currentTime / duration) * 100}%, rgb(75, 85, 99) ${(currentTime / duration) * 100}%, rgb(75, 85, 99) 100%)`
                  }}
                />
                <span className="text-white text-xs sm:text-sm font-mono min-w-[40px] sm:min-w-[45px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    {isPlaying ? <Pause className="size-4 sm:size-5" /> : <Play className="size-4 sm:size-5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    {isMuted ? <VolumeX className="size-4 sm:size-5" /> : <Volume2 className="size-4 sm:size-5" />}
                  </Button>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10"
                  >
                    <Maximize className="size-4 sm:size-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};