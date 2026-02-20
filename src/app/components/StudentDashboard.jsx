import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, Download, FileText, Video, BookOpen, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ContentCard } from './ContentCard';
import { VideoPlayer } from './VideoPlayer';
import { DocumentViewer } from './DocumentViewer';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { toast } from 'sonner';

export const StudentDashboard = () => {
  const { currentUser, logout, subjects, semesters, enrollments, notes, videos, users } = useApp();
  const [selectedSemester, setSelectedSemester] = useState('all');

  // Viewer states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Change password state
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  // Get student's enrolled subjects
  const studentEnrollments = enrollments.filter(
    e => e.student_id === currentUser?.id && e.status === 'active'
  );

  const enrolledSubjects = subjects.filter(s =>
    studentEnrollments.some(e => e.subject_id === s.id)
  );

  // Filter subjects by semester
  const filteredSubjects = selectedSemester === 'all'
    ? enrolledSubjects
    : enrolledSubjects.filter(s => s.semester_id === selectedSemester);

  // Get all notes for enrolled subjects
  const enrolledSubjectIds = enrolledSubjects.map(s => s.id);
  const availableNotes = notes.filter(n => enrolledSubjectIds.includes(n.subject_id));
  const availableVideos = videos.filter(v => enrolledSubjectIds.includes(v.subject_id));

  // Filter by selected semester
  const filteredNotes = selectedSemester === 'all'
    ? availableNotes
    : availableNotes.filter(n => {
        const subject = subjects.find(s => s.id === n.subject_id);
        return subject?.semester_id === selectedSemester;
      });

  const filteredVideos = selectedSemester === 'all'
    ? availableVideos
    : availableVideos.filter(v => {
        const subject = subjects.find(s => s.id === v.subject_id);
        return subject?.semester_id === selectedSemester;
      });

  // Get unique semesters the student is enrolled in
  const enrolledSemesters = Array.from(
    new Set(enrolledSubjects.map(s => s.semester_id))
  ).map(semId => semesters.find(s => s.id === semId)).filter(Boolean);

  const handleViewNote = (note) => {
    setSelectedDocument({
      title: note.title,
      url: note.file_path,
      type: note.file_type,
      fileName: note.file_name
    });
  };

  const handleWatchVideo = (video) => {
    setSelectedVideo({
      title: video.title,
      url: video.video_path
    });
  };

  const handleDownload = async (title, url, fileType = null, fileName = null) => {
    try {
      toast.info(`Downloading ${title}...`);
      
      // Fetch the file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }
      
      // Get the blob
      const blob = await response.blob();
      
      // Create a temporary URL
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Use original file name if available (preserves exact format)
      let downloadFileName;
      if (fileName) {
        // Use the exact original file name from database (includes extension)
        downloadFileName = fileName;
      } else if (fileType) {
        // Use title with original file extension
        downloadFileName = `${title}.${fileType}`;
      } else {
        // For videos: try to detect format from content type or URL
        const contentType = response.headers.get('content-type') || '';
        let detectedExtension = null;
        
        if (contentType.includes('video/')) {
          if (contentType.includes('mp4')) detectedExtension = 'mp4';
          else if (contentType.includes('webm')) detectedExtension = 'webm';
          else if (contentType.includes('quicktime') || contentType.includes('mov')) detectedExtension = 'mov';
          else if (contentType.includes('x-msvideo') || contentType.includes('avi')) detectedExtension = 'avi';
          else if (contentType.includes('x-matroska') || contentType.includes('mkv')) detectedExtension = 'mkv';
        }
        
        if (detectedExtension) {
          downloadFileName = `${title}.${detectedExtension}`;
        } else {
          // Fallback: try to extract from URL
          const urlMatch = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
          downloadFileName = urlMatch ? `${title}.${urlMatch[1].toLowerCase()}` : `${title}.${url.split('.').pop().split('?')[0]}`;
        }
      }
      
      link.download = downloadFileName;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success(`${title} downloaded successfully!`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download ${title}. Trying direct download...`);
      
      // Fallback: open in new tab for direct download
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      
      // Set download attribute with original file name if available
      if (fileName) {
        link.download = fileName; // Exact original filename
      } else if (fileType) {
        link.download = `${title}.${fileType}`;
      } else {
        // Try to extract extension from URL
        const urlMatch = url.match(/\.([a-z0-9]+)(?:\?|$)/i);
        link.download = urlMatch ? `${title}.${urlMatch[1].toLowerCase()}` : title;
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Student Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Kathmandu University - B.Tech.Ed. IT</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <Badge variant="secondary" className="text-xs">Student</Badge>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => setChangePasswordDialogOpen(true)} 
                  variant="outline" 
                  size="sm"
                  className="flex-1 sm:flex-initial"
                >
                  <Lock className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Change Password</span>
                  <span className="sm:hidden">Password</span>
                </Button>
                <Button onClick={logout} variant="outline" size="sm" className="flex-1 sm:flex-initial">
                  <LogOut className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Semester Filter */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <label className="font-medium text-gray-700 text-sm sm:text-base">Filter by Semester:</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {enrolledSemesters.map((semester) => (
                <SelectItem key={semester.id} value={semester.id}>
                  {semester.semester_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="subjects" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 overflow-x-auto">
            <TabsTrigger value="subjects" className="text-xs sm:text-sm">My Subjects</TabsTrigger>
            <TabsTrigger value="notes" className="text-xs sm:text-sm">
              Notes 
              {filteredNotes.length > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{filteredNotes.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="videos" className="text-xs sm:text-sm">
              Videos
              {filteredVideos.length > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">{filteredVideos.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Subjects</CardTitle>
                <CardDescription>
                  Subjects you are currently enrolled in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredSubjects.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No subjects enrolled</p>
                    {selectedSemester !== 'all' && (
                      <p className="text-sm text-gray-400 mt-1">Try selecting a different semester</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSubjects.map((subject) => {
                      const semester = semesters.find(s => s.id === subject.semester_id);
                      const teacher = users.find(u => u.id === subject.teacher_id);
                      const subjectNotes = notes.filter(n => n.subject_id === subject.id).length;
                      const subjectVideos = videos.filter(v => v.subject_id === subject.id).length;

                      return (
                        <Card key={subject.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
                                <CardDescription className="mt-1">
                                  {subject.subject_code}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">{semester?.semester_name}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Teacher:</span> {teacher?.name}
                            </div>
                            <div className="flex gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <FileText className="size-4 text-gray-400" />
                                <span>{subjectNotes} Notes</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Video className="size-4 text-gray-400" />
                                <span>{subjectVideos} Videos</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Notes</CardTitle>
                <CardDescription>
                  View and download notes from your enrolled subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notes available</p>
                    {selectedSemester !== 'all' && (
                      <p className="text-sm text-gray-400 mt-1">Try selecting a different semester</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => {
                      const subject = subjects.find(s => s.id === note.subject_id);
                      const semester = semesters.find(s => s.id === subject?.semester_id);
                      
                      return (
                        <ContentCard
                          key={note.id}
                          id={note.id}
                          title={note.title}
                          type="note"
                          fileType={note.file_type}
                          subjectName={subject?.subject_name || ''}
                          subjectCode={subject?.subject_code || ''}
                          semesterName={semester?.semester_name || ''}
                          uploadedAt={note.uploaded_at}
                          onView={() => handleViewNote(note)}
                          onDownload={() => handleDownload(note.title, note.file_path, note.file_type, note.file_name)}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Lecture Videos</CardTitle>
                <CardDescription>
                  Watch lecture videos from your enrolled subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No videos available</p>
                    {selectedSemester !== 'all' && (
                      <p className="text-sm text-gray-400 mt-1">Try selecting a different semester</p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredVideos.map((video) => {
                      const subject = subjects.find(s => s.id === video.subject_id);
                      const semester = semesters.find(s => s.id === subject?.semester_id);
                      
                      return (
                        <ContentCard
                          key={video.id}
                          id={video.id}
                          title={video.title}
                          type="video"
                          subjectName={subject?.subject_name || ''}
                          subjectCode={subject?.subject_code || ''}
                          semesterName={semester?.semester_name || ''}
                          uploadedAt={video.uploaded_at}
                          onView={() => handleWatchVideo(video)}
                          onDownload={() => handleDownload(video.title, video.video_path, null, null)}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Viewers */}
      {selectedVideo && (
        <VideoPlayer
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
          title={selectedVideo.title}
          videoUrl={selectedVideo.url}
          onDownload={() => handleDownload(selectedVideo.title, selectedVideo.url, null, null)}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          open={!!selectedDocument}
          onOpenChange={(open) => !open && setSelectedDocument(null)}
          title={selectedDocument.title}
          fileUrl={selectedDocument.url}
          fileType={selectedDocument.type}
          onDownload={() => handleDownload(selectedDocument.title, selectedDocument.url, selectedDocument.type, selectedDocument.fileName)}
        />
      )}

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </div>
  );
};
