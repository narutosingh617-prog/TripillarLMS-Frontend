import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Upload, FileText, Video, Image as ImageIcon, X, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const UploadDialog = ({
  open,
  onOpenChange,
  uploadType,
  subjects,
  onUpload
}) => {
  const [title, setTitle] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // Allowed file types
  const allowedTypes = uploadType === 'note'
    ? {
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
      }
    : {
        'video/mp4': ['.mp4'],
        'video/x-matroska': ['.mkv'],
        'video/x-msvideo': ['.avi'],
        'video/quicktime': ['.mov']
      };

  const maxFileSize = uploadType === 'note' ? 50 * 1024 * 1024 : 500 * 1024 * 1024; // 50MB for notes, 500MB for videos

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  const validateFile = (file) => {
    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = Object.values(allowedTypes).some(exts => 
      exts.includes(fileExtension)
    );

    if (!isValidType) {
      toast.error(`Invalid file type. Please upload ${uploadType === 'note' ? 'PDF, DOC, DOCX, PPT, or PPTX' : 'MP4, MKV, AVI, or MOV'} files only.`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      toast.error(`File size exceeds ${uploadType === 'note' ? '50MB' : '500MB'} limit.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setShowPreview(true);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '')); // Set title from filename without extension
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleUpload = async () => {
    if (!title || !selectedSubject || !selectedFile) {
      toast.error('Please fill all required fields');
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubject);
    if (!subject) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);
      formData.append('subject_id', selectedSubject);

      // Simulate progress (in real app, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Call the onUpload callback which will handle the API call
      await onUpload(formData);

      setUploadProgress(100);
      setUploadComplete(true);
      clearInterval(progressInterval);

      // Reset form after success
      setTimeout(() => {
        setTitle('');
        setSelectedSubject('');
        setSelectedFile(null);
        setShowPreview(false);
        setUploadProgress(0);
        setUploadComplete(false);
        setIsUploading(false);
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setShowPreview(false);
    setUploadProgress(0);
    setUploadComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="size-12 text-muted-foreground" />;
    
    if (uploadType === 'video') {
      return <Video className="size-12 text-blue-500" />;
    }
    
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="size-12 text-red-500" />;
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="size-12 text-blue-600" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <FileText className="size-12 text-orange-500" />;
    
    return <FileText className="size-12 text-gray-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] w-full max-h-[90vh] overflow-y-auto bg-transparent border-0 shadow-none m-2 sm:m-4" style={{ backgroundColor: 'transparent' }}>
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              {uploadType === 'note' ? <FileText className="size-5 text-primary" /> : <Video className="size-5 text-primary" />}
              Upload {uploadType === 'note' ? 'Notes' : 'Lecture Video'}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {uploadType === 'note' 
                ? 'Upload PDF, DOC, DOCX, PPT, or PPTX files (max 50MB)'
                : 'Upload MP4, MKV, AVI, or MOV files (max 500MB)'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Selection Area */}
            {!showPreview && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-primary bg-primary/5 scale-[1.02]' 
                    : 'border-gray-300 hover:border-primary/50 hover:bg-gray-50/50'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-3 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <Upload className={`size-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">
                      {isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {uploadType === 'note' 
                        ? 'PDF, DOC, DOCX, PPT, PPTX (max 50MB)'
                        : 'MP4, MKV, AVI, MOV (max 500MB)'}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" className="mt-2">
                    Browse Files
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={Object.keys(allowedTypes).join(',')}
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}

            {/* File Preview */}
            {showPreview && selectedFile && (
              <div className="border rounded-xl p-4 bg-gray-50/50 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-gray-700">{selectedFile.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{formatFileSize(selectedFile.size)}</span>
                      <span>•</span>
                      <span className="uppercase bg-gray-100 px-2 py-0.5 rounded text-xs">{selectedFile.name.split('.').pop()}</span>
                    </div>
                    
                    {/* Upload Progress */}
                    {isUploading && (
                      <div className="mt-3 space-y-1">
                        <Progress value={uploadProgress} className="h-2 bg-gray-200" />
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="animate-pulse">Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </p>
                      </div>
                    )}
                    
                    {/* Upload Complete */}
                    {uploadComplete && (
                      <div className="flex items-center gap-2 mt-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                        <Check className="size-4" />
                        <span className="text-sm font-medium">Upload complete!</span>
                      </div>
                    )}
                  </div>
                  
                  {!isUploading && !uploadComplete && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removeFile}
                      className="flex-shrink-0 hover:bg-gray-200"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Form Fields */}
            {showPreview && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title / Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title or description"
                    disabled={isUploading || uploadComplete}
                    className="bg-white/50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={selectedSubject} 
                    onValueChange={setSelectedSubject}
                    disabled={isUploading || uploadComplete}
                  >
                    <SelectTrigger className="bg-white/50 border-gray-200">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name} (Semester {subject.semester})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Auto-Tagged Information */}
                <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertCircle className="size-4 text-blue-600" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">Auto-tagged Information</p>
                      <ul className="text-blue-700 mt-2 space-y-1 text-xs">
                        <li>• Upload date & time: {new Date().toLocaleString()}</li>
                        <li>• File will be linked to selected subject and semester</li>
                        <li>• Students enrolled in this subject will have instant access</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isUploading}
                    className="flex-1 bg-white/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || uploadComplete || !title || !selectedSubject}
                    className="flex-1 bg-primary text-white hover:bg-primary/90"
                  >
                    {isUploading ? 'Uploading...' : uploadComplete ? 'Uploaded!' : 'Upload'}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
