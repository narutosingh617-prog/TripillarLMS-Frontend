import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { FileText, Video, Play, Eye, Download, Trash2, Calendar } from 'lucide-react';

export const ContentCard = ({
  title,
  type,
  fileType,
  subjectName,
  subjectCode,
  semesterName,
  uploadedAt,
  thumbnailUrl,
  onView,
  onDownload,
  onDelete,
  showActions = true
}) => {
  const getFileIcon = () => {
    if (type === 'video') {
      return <Video className="size-16 text-blue-500" />;
    }
    
    const ext = fileType?.toLowerCase();
    if (ext === 'pdf') return <FileText className="size-16 text-red-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="size-16 text-blue-600" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <FileText className="size-16 text-orange-500" />;
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return <FileText className="size-16 text-green-500" />;
    
    return <FileText className="size-16 text-gray-500" />;
  };

  const getThumbnailBackground = () => {
    if (type === 'video') return 'bg-gradient-to-br from-blue-500 to-blue-700';
    
    const ext = fileType?.toLowerCase();
    if (ext === 'pdf') return 'bg-gradient-to-br from-red-500 to-red-700';
    if (['doc', 'docx'].includes(ext || '')) return 'bg-gradient-to-br from-blue-600 to-blue-800';
    if (['ppt', 'pptx'].includes(ext || '')) return 'bg-gradient-to-br from-orange-500 to-orange-700';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'bg-gradient-to-br from-green-500 to-green-700';
    
    return 'bg-gradient-to-br from-gray-500 to-gray-700';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Thumbnail */}
      <div className={`relative aspect-video ${getThumbnailBackground()} flex items-center justify-center overflow-hidden`}>
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center">
            {getFileIcon()}
            {type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/40 rounded-full p-4 group-hover:bg-black/60 transition-colors">
                  <Play className="size-10 text-white" fill="white" />
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Type Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            {type === 'video' ? 'VIDEO' : fileType?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]">
          {title}
        </h3>

        {/* Subject Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {subjectCode}
            </Badge>
            <span className="text-xs sm:text-sm text-gray-600 truncate">{subjectName}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500">
            <Calendar className="size-3" />
            <span className="text-xs">{semesterName}</span>
            <span>•</span>
            <span className="text-xs">{new Date(uploadedAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onView}
              className="flex-1 text-xs sm:text-sm"
              size="sm"
            >
              {type === 'video' ? (
                <>
                  <Play className="size-3 sm:size-4 sm:mr-1" />
                  <span className="hidden sm:inline">Watch</span>
                  <span className="sm:hidden">Play</span>
                </>
              ) : (
                <>
                  <Eye className="size-3 sm:size-4 sm:mr-1" />
                  <span className="hidden sm:inline">View</span>
                  <span className="sm:hidden">Open</span>
                </>
              )}
            </Button>
            
            {onDownload && (
              <Button
                onClick={onDownload}
                variant="outline"
                size="sm"
                className="px-2 sm:px-3"
              >
                <Download className="size-3 sm:size-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                onClick={onDelete}
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-2 sm:px-3"
              >
                <Trash2 className="size-3 sm:size-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
