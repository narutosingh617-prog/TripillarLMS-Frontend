import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { LogOut, Upload, Video, FileText, UserPlus, Trash2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { UploadDialog } from './UploadDialog';
import { ContentCard } from './ContentCard';
import { VideoPlayer } from './VideoPlayer';
import { DocumentViewer } from './DocumentViewer';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export const TeacherDashboard = () => {
  const {
    currentUser,
    logout,
    subjects,
    semesters,
    users,
    enrollments,
    addEnrollment,
    updateEnrollment,
    notes,
    addNote,
    deleteNote,
    videos,
    addVideo,
    deleteVideo
  } = useApp();

  // Upload dialog states
  const [noteUploadDialogOpen, setNoteUploadDialogOpen] = useState(false);
  const [videoUploadDialogOpen, setVideoUploadDialogOpen] = useState(false);

  // Viewer states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Enroll student state
  const [enrollSubject, setEnrollSubject] = useState('');
  const [enrollStudentEmail, setEnrollStudentEmail] = useState('');
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  // Change password state
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  // Get teacher's assigned subjects
  const teacherSubjects = subjects.filter(s => s.teacher_id === currentUser?.id);
  const teacherSubjectIds = teacherSubjects.map(s => s.id);

  // Get notes and videos for teacher's subjects
  const teacherNotes = notes.filter(n => teacherSubjectIds.includes(n.subject_id));
  const teacherVideos = videos.filter(v => teacherSubjectIds.includes(v.subject_id));

  // Get enrollments for teacher's subjects
  const teacherEnrollments = enrollments.filter(e => 
    teacherSubjectIds.includes(e.subject_id) && e.status === 'active'
  );

  // Handle note upload from UploadDialog
  const handleNoteUpload = async (formData) => {
    try {
      await addNote(formData);
      toast.success('Note uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload note. Please try again.');
      throw error;
    }
  };

  // Handle video upload from UploadDialog
  const handleVideoUpload = async (formData) => {
    try {
      await addVideo(formData);
      toast.success('Video uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload video. Please try again.');
      throw error;
    }
  };

  const handleEnrollStudent = async () => {
    if (!enrollSubject || !enrollStudentEmail) {
      toast.error('Please fill all fields');
      return;
    }

    const student = users.find(u => u.email === enrollStudentEmail && u.role === 'student');
    if (!student) {
      toast.error('Student not found with this email');
      return;
    }

    const subject = subjects.find(s => s.id === enrollSubject);
    if (!subject) {
      toast.error('Subject not found');
      return;
    }

    // Check if already enrolled
    const existingEnrollment = enrollments.find(
      e => e.student_id === student.id && e.subject_id === enrollSubject
    );

    if (existingEnrollment) {
      if (existingEnrollment.status === 'active') {
        toast.error('Student is already enrolled in this subject');
        return;
      } else {
        // Reactivate enrollment
        await updateEnrollment(existingEnrollment.id, { status: 'active' });
        toast.success('Student enrollment reactivated');
      }
    } else {
      const newEnrollment = {
        id: `e${Date.now()}`,
        student_id: student.id,
        subject_id: enrollSubject,
        semester_id: subject.semester_id,
        status: 'active'
      };

      await addEnrollment(newEnrollment);
      toast.success('Student enrolled successfully');
    }

    setEnrollSubject('');
    setEnrollStudentEmail('');
    setEnrollDialogOpen(false);
  };

  const handleRemoveEnrollment = async (enrollmentId) => {
    if (confirm('Are you sure you want to remove this student from the subject?')) {
      try {
        await updateEnrollment(enrollmentId, { status: 'inactive' });
        toast.success('Student removed from subject');
      } catch (error) {
        toast.error('Failed to remove student. Please try again.');
      }
    }
  };

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

  const handleDeleteNote = async (noteId, title) => {
    if (confirm(`Delete "${title}"?`)) {
      try {
        await deleteNote(noteId);
        toast.success('Note deleted successfully');
      } catch (error) {
        toast.error('Failed to delete note. Please try again.');
      }
    }
  };

  const handleDeleteVideo = async (videoId, title) => {
    if (confirm(`Delete "${title}"?`)) {
      try {
        await deleteVideo(videoId);
        toast.success('Video deleted successfully');
      } catch (error) {
        toast.error('Failed to delete video. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Teacher Dashboard</h1>
            <p className="text-sm text-gray-500">Kathmandu University - B.Tech.Ed. IT</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <Badge variant="secondary">Teacher</Badge>
            </div>
            <Button 
              onClick={() => setChangePasswordDialogOpen(true)} 
              variant="outline" 
              size="sm"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects">My Subjects</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Subjects</CardTitle>
                <CardDescription>Subjects you are teaching</CardDescription>
              </CardHeader>
              <CardContent>
                {teacherSubjects.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No subjects assigned yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teacherSubjects.map((subject) => {
                      const semester = semesters.find(s => s.id === subject.semester_id);
                      const subjectNotes = notes.filter(n => n.subject_id === subject.id).length;
                      const subjectVideos = videos.filter(v => v.subject_id === subject.id).length;
                      const subjectEnrollments = enrollments.filter(
                        e => e.subject_id === subject.id && e.status === 'active'
                      ).length;

                      return (
                        <Card key={subject.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{subject.subject_name}</CardTitle>
                            <CardDescription>
                              {subject.subject_code} • {semester?.semester_name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Notes:</span>
                              <Badge variant="outline">{subjectNotes}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Videos:</span>
                              <Badge variant="outline">{subjectVideos}</Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Enrolled Students:</span>
                              <Badge variant="outline">{subjectEnrollments}</Badge>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Notes Management</CardTitle>
                    <CardDescription>Upload and manage course notes</CardDescription>
                  </div>
                  <Button 
                    disabled={teacherSubjects.length === 0}
                    onClick={() => setNoteUploadDialogOpen(true)}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Note
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {teacherNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notes uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Upload Note" to add your first note</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacherNotes.map((note) => {
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
                          onDelete={() => handleDeleteNote(note.id, note.title)}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Lecture Videos</CardTitle>
                    <CardDescription>Upload and manage lecture videos</CardDescription>
                  </div>
                  <Button 
                    disabled={teacherSubjects.length === 0}
                    onClick={() => setVideoUploadDialogOpen(true)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {teacherVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No videos uploaded yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Upload Video" to add your first video</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacherVideos.map((video) => {
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
                          onDelete={() => handleDeleteVideo(video.id, video.title)}
                        />
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Enrollment</CardTitle>
                    <CardDescription>Enroll students in your subjects</CardDescription>
                  </div>
                  <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
                    <DialogTrigger asChild>
                      <Button disabled={teacherSubjects.length === 0}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Enroll Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Enroll Student</DialogTitle>
                        <DialogDescription>Enroll a student in your subject</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="enroll-subject">Subject</Label>
                          <Select value={enrollSubject} onValueChange={setEnrollSubject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {teacherSubjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.subject_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="relative">
                          <Label htmlFor="enroll-email">Student Email</Label>
                          <Input
                            id="enroll-email"
                            type="email"
                            value={enrollStudentEmail}
                            onChange={(e) => {
                              setEnrollStudentEmail(e.target.value);
                              setShowEmailSuggestions(e.target.value.length > 0);
                            }}
                            onFocus={() => {
                              if (enrollStudentEmail.length > 0) {
                                setShowEmailSuggestions(true);
                              }
                            }}
                            onBlur={() => {
                              // Delay hiding to allow click on suggestion
                              setTimeout(() => setShowEmailSuggestions(false), 200);
                            }}
                            placeholder="student.name@student.ku.edu.np"
                          />
                          {showEmailSuggestions && enrollStudentEmail && (
                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                              {users
                                .filter(u => 
                                  u.role === 'student' && 
                                  u.email.toLowerCase().includes(enrollStudentEmail.toLowerCase())
                                )
                                .slice(0, 5)
                                .map((student) => (
                                  <div
                                    key={student.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                      setEnrollStudentEmail(student.email);
                                      setShowEmailSuggestions(false);
                                    }}
                                  >
                                    <div className="font-medium text-sm">{student.name}</div>
                                    <div className="text-xs text-gray-500">{student.email}</div>
                                  </div>
                                ))}
                              {users.filter(u => 
                                u.role === 'student' && 
                                u.email.toLowerCase().includes(enrollStudentEmail.toLowerCase())
                              ).length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                  No students found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button onClick={handleEnrollStudent} className="w-full">
                          Enroll Student
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherEnrollments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-gray-500">
                          No students enrolled yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      teacherEnrollments.map((enrollment) => {
                        const student = users.find(u => u.id === enrollment.student_id);
                        const subject = subjects.find(s => s.id === enrollment.subject_id);
                        const semester = semesters.find(s => s.id === enrollment.semester_id);
                        
                        return (
                          <TableRow key={enrollment.id}>
                            <TableCell>{student?.name}</TableCell>
                            <TableCell>{student?.email}</TableCell>
                            <TableCell>{subject?.subject_name}</TableCell>
                            <TableCell>{semester?.semester_name}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEnrollment(enrollment.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Upload Dialogs */}
      <UploadDialog
        open={noteUploadDialogOpen}
        onOpenChange={setNoteUploadDialogOpen}
        uploadType="note"
        subjects={teacherSubjects.map(s => ({
          id: s.id,
          name: s.subject_name,
          code: s.subject_code,
          semester: semesters.find(sem => sem.id === s.semester_id)?.semester_number,
          teacher_id: s.teacher_id
        }))}
        onUpload={handleNoteUpload}
      />

      <UploadDialog
        open={videoUploadDialogOpen}
        onOpenChange={setVideoUploadDialogOpen}
        uploadType="video"
        subjects={teacherSubjects.map(s => ({
          id: s.id,
          name: s.subject_name,
          code: s.subject_code,
          semester: semesters.find(sem => sem.id === s.semester_id)?.semester_number,
          teacher_id: s.teacher_id
        }))}
        onUpload={handleVideoUpload}
      />

      {/* Viewers */}
      {selectedVideo && (
        <VideoPlayer
          open={!!selectedVideo}
          onOpenChange={(open) => !open && setSelectedVideo(null)}
          title={selectedVideo.title}
          videoUrl={selectedVideo.url}
          onDownload={() => handleDownload(selectedVideo.title, selectedVideo.url)}
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