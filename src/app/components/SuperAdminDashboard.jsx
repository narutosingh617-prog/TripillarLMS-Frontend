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
import { LogOut, UserPlus, BookOpen, Users, Trash2, Lock, Pencil, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export const SuperAdminDashboard = () => {
  const { currentUser, logout, users, teachers, addUser, updateUser, deleteUser, subjects, addSubject, updateSubject, semesters } = useApp();

  // Teacher creation state
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);

  // Teacher edit state
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherEmail, setEditTeacherEmail] = useState('');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');
  const [editTeacherDialogOpen, setEditTeacherDialogOpen] = useState(false);

  // Student creation state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  // Student edit state
  const [editingStudent, setEditingStudent] = useState(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentEmail, setEditStudentEmail] = useState('');
  const [editStudentPassword, setEditStudentPassword] = useState('');
  const [editStudentDialogOpen, setEditStudentDialogOpen] = useState(false);

  // Subject creation state
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectSemester, setSubjectSemester] = useState('');
  const [subjectTeacher, setSubjectTeacher] = useState('');
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);

  // Change password state
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  // Password visibility state for each user (keyed by user id)
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const students = users.filter(u => u.role === 'student');

  const handleCreateTeacher = async () => {
    if (!teacherName || !teacherEmail || !teacherPassword) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const newTeacher = {
        name: teacherName,
        email: teacherEmail,
        password: teacherPassword,
        role: 'teacher',
        status: 'active'
      };

      await addUser(newTeacher);
      toast.success('Teacher account created successfully');
      setTeacherName('');
      setTeacherEmail('');
      setTeacherPassword('');
      setTeacherDialogOpen(false);
    } catch (error) {
      console.error('Create teacher error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create teacher account. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setEditTeacherName(teacher.name);
    setEditTeacherEmail(teacher.email);
    setEditTeacherPassword('');
    setEditTeacherDialogOpen(true);
  };

  const handleUpdateTeacher = async () => {
    if (!editTeacherName || !editTeacherEmail) {
      toast.error('Please fill name and email fields');
      return;
    }

    try {
      const updates = {
        name: editTeacherName,
        email: editTeacherEmail
      };

      // Only include password if it's provided
      if (editTeacherPassword && editTeacherPassword.trim() !== '') {
        updates.password = editTeacherPassword;
      }

      await updateUser(editingTeacher.id, updates);
      toast.success('Teacher account updated successfully');
      setEditingTeacher(null);
      setEditTeacherName('');
      setEditTeacherEmail('');
      setEditTeacherPassword('');
      setEditTeacherDialogOpen(false);
    } catch (error) {
      console.error('Update teacher error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update teacher account. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleCreateStudent = async () => {
    if (!studentName || !studentEmail || !studentPassword) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const newStudent = {
        name: studentName,
        email: studentEmail,
        password: studentPassword,
        role: 'student',
        status: 'active'
      };

      await addUser(newStudent);
      toast.success('Student account created successfully');
      setStudentName('');
      setStudentEmail('');
      setStudentPassword('');
      setStudentDialogOpen(false);
    } catch (error) {
      console.error('Create student error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create student account. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditStudentName(student.name);
    setEditStudentEmail(student.email);
    setEditStudentPassword('');
    setEditStudentDialogOpen(true);
  };

  const handleUpdateStudent = async () => {
    if (!editStudentName || !editStudentEmail) {
      toast.error('Please fill name and email fields');
      return;
    }

    try {
      const updates = {
        name: editStudentName,
        email: editStudentEmail
      };

      // Only include password if it's provided
      if (editStudentPassword && editStudentPassword.trim() !== '') {
        updates.password = editStudentPassword;
      }

      await updateUser(editingStudent.id, updates);
      toast.success('Student account updated successfully');
      setEditingStudent(null);
      setEditStudentName('');
      setEditStudentEmail('');
      setEditStudentPassword('');
      setEditStudentDialogOpen(false);
    } catch (error) {
      console.error('Update student error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update student account. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleCreateSubject = async () => {
    if (!subjectName || !subjectCode || !subjectSemester) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const newSubject = {
        subject_name: subjectName,
        subject_code: subjectCode,
        semester_id: subjectSemester,
        teacher_id: (subjectTeacher && subjectTeacher !== '' && subjectTeacher !== 'unassigned') ? subjectTeacher : null
      };

      await addSubject(newSubject);
      toast.success('Subject created successfully');
      setSubjectName('');
      setSubjectCode('');
      setSubjectSemester('');
      setSubjectTeacher('');
      setSubjectDialogOpen(false);
    } catch (error) {
      console.error('Create subject error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to create subject. Please try again.';
      toast.error(errorMessage);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (confirm(`Are you sure you want to deactivate ${userName}?`)) {
      try {
        await deleteUser(userId);
        toast.success('User deactivated successfully');
      } catch (error) {
        toast.error('Failed to deactivate user. Please try again.');
      }
    }
  };

  const handleAssignTeacher = async (subjectId, teacherId) => {
    try {
      // Handle unassign case
      if (teacherId === '__unassign__' || teacherId === '' || teacherId === null) {
        await updateSubject(subjectId, { teacher_id: null });
        toast.success('Teacher unassigned successfully');
      } else {
        await updateSubject(subjectId, { teacher_id: teacherId });
        toast.success('Teacher assigned successfully');
      }
    } catch (error) {
      toast.error('Failed to assign teacher. Please try again.');
    }
  };

  const handleUnassignTeacher = async (subjectId) => {
    try {
      await updateSubject(subjectId, { teacher_id: null });
      toast.success('Teacher unassigned successfully');
    } catch (error) {
      toast.error('Failed to unassign teacher. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
              <p className="text-xs sm:text-sm text-gray-500">Kathmandu University - B.Tech.Ed. IT</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-sm font-medium">{currentUser?.name}</p>
                <Badge variant="secondary" className="text-xs">Super Admin</Badge>
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
        <Tabs defaultValue="teachers" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 overflow-x-auto">
            <TabsTrigger value="teachers" className="text-xs sm:text-sm">Teachers</TabsTrigger>
            <TabsTrigger value="students" className="text-xs sm:text-sm">Students</TabsTrigger>
            <TabsTrigger value="subjects" className="text-xs sm:text-sm">Subjects</TabsTrigger>
          </TabsList>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Teacher Management</CardTitle>
                    <CardDescription className="text-sm">Create and manage teacher accounts</CardDescription>
                  </div>
                  <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <UserPlus className="w-4 h-4 sm:mr-2" />
                        <span className="sm:inline">Create Teacher</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full m-4 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Create New Teacher</DialogTitle>
                        <DialogDescription className="text-sm">Add a new teacher account to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="teacher-name">Full Name</Label>
                          <Input
                            id="teacher-name"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            placeholder="e.g., Dr. Ram Sharma"
                          />
                        </div>
                        <div>
                          <Label htmlFor="teacher-email">Email</Label>
                          <Input
                            id="teacher-email"
                            type="email"
                            value={teacherEmail}
                            onChange={(e) => setTeacherEmail(e.target.value)}
                            placeholder="teacher.name@ku.edu.np"
                          />
                        </div>
                        <div>
                          <Label htmlFor="teacher-password">Password</Label>
                          <Input
                            id="teacher-password"
                            type="password"
                            value={teacherPassword}
                            onChange={(e) => setTeacherPassword(e.target.value)}
                            placeholder="Enter password"
                          />
                        </div>
                        <Button onClick={handleCreateTeacher} className="w-full">
                          Create Teacher Account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[120px]">Password</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachers.map((teacher) => (
                        <TableRow key={teacher.id}>
                          <TableCell className="font-medium">{teacher.name}</TableCell>
                          <TableCell className="text-sm">{teacher.email}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">
                                {visiblePasswords[teacher.id] ? (teacher.password || teacher.plainPassword || '') : '••••••••'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(teacher.id)}
                                title={visiblePasswords[teacher.id] ? 'Hide Password' : 'Show Password'}
                              >
                                {visiblePasswords[teacher.id] ? (
                                  <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                              {teacher.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTeacher(teacher)}
                                disabled={teacher.status === 'inactive'}
                                title="Edit Teacher"
                              >
                                <Pencil className="w-4 h-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(teacher.id, teacher.name)}
                                disabled={teacher.status === 'inactive'}
                                title="Delete Teacher"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Teacher Dialog */}
            <Dialog open={editTeacherDialogOpen} onOpenChange={setEditTeacherDialogOpen}>
              <DialogContent className="w-full m-4 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Edit Teacher</DialogTitle>
                  <DialogDescription className="text-sm">Update teacher account information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-teacher-name">Full Name</Label>
                    <Input
                      id="edit-teacher-name"
                      value={editTeacherName}
                      onChange={(e) => setEditTeacherName(e.target.value)}
                      placeholder="e.g., Dr. Ram Sharma"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-teacher-email">Email</Label>
                    <Input
                      id="edit-teacher-email"
                      type="email"
                      value={editTeacherEmail}
                      onChange={(e) => setEditTeacherEmail(e.target.value)}
                      placeholder="teacher.name@ku.edu.np"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-teacher-password">New Password (Optional)</Label>
                    <Input
                      id="edit-teacher-password"
                      type="password"
                      value={editTeacherPassword}
                      onChange={(e) => setEditTeacherPassword(e.target.value)}
                      placeholder="Leave empty to keep current password"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if you don't want to change the password</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditTeacherDialogOpen(false);
                        setEditingTeacher(null);
                        setEditTeacherName('');
                        setEditTeacherEmail('');
                        setEditTeacherPassword('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateTeacher} className="flex-1">
                      Update Teacher
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Student Management</CardTitle>
                    <CardDescription className="text-sm">Create and manage student accounts</CardDescription>
                  </div>
                  <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <Users className="w-4 h-4 sm:mr-2" />
                        <span className="sm:inline">Create Student</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full m-4 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Create New Student</DialogTitle>
                        <DialogDescription className="text-sm">Add a new student account to the system</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="student-name">Full Name</Label>
                          <Input
                            id="student-name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="e.g., Rajesh Thapa"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-email">Email</Label>
                          <Input
                            id="student-email"
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            placeholder="student.name@student.ku.edu.np"
                          />
                        </div>
                        <div>
                          <Label htmlFor="student-password">Password</Label>
                          <Input
                            id="student-password"
                            type="password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="Enter password"
                          />
                        </div>
                        <Button onClick={handleCreateStudent} className="w-full">
                          Create Student Account
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Name</TableHead>
                        <TableHead className="min-w-[200px]">Email</TableHead>
                        <TableHead className="min-w-[120px]">Password</TableHead>
                        <TableHead className="min-w-[100px]">Status</TableHead>
                        <TableHead className="min-w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell className="text-sm">{student.email}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">
                                {visiblePasswords[student.id] ? (student.password || student.plainPassword || '') : '••••••••'}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => togglePasswordVisibility(student.id)}
                                title={visiblePasswords[student.id] ? 'Hide Password' : 'Show Password'}
                              >
                                {visiblePasswords[student.id] ? (
                                  <EyeOff className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <Eye className="w-4 h-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStudent(student)}
                                disabled={student.status === 'inactive'}
                                title="Edit Student"
                              >
                                <Pencil className="w-4 h-4 text-blue-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(student.id, student.name)}
                                disabled={student.status === 'inactive'}
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Edit Student Dialog */}
            <Dialog open={editStudentDialogOpen} onOpenChange={setEditStudentDialogOpen}>
              <DialogContent className="w-full m-4 max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Edit Student</DialogTitle>
                  <DialogDescription className="text-sm">Update student account information</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-student-name">Full Name</Label>
                    <Input
                      id="edit-student-name"
                      value={editStudentName}
                      onChange={(e) => setEditStudentName(e.target.value)}
                      placeholder="e.g., Rajesh Thapa"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-student-email">Email</Label>
                    <Input
                      id="edit-student-email"
                      type="email"
                      value={editStudentEmail}
                      onChange={(e) => setEditStudentEmail(e.target.value)}
                      placeholder="student.name@student.ku.edu.np"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-student-password">New Password (Optional)</Label>
                    <Input
                      id="edit-student-password"
                      type="password"
                      value={editStudentPassword}
                      onChange={(e) => setEditStudentPassword(e.target.value)}
                      placeholder="Leave empty to keep current password"
                    />
                    <p className="text-xs text-gray-500 mt-1">Leave empty if you don't want to change the password</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditStudentDialogOpen(false);
                        setEditingStudent(null);
                        setEditStudentName('');
                        setEditStudentEmail('');
                        setEditStudentPassword('');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateStudent} className="flex-1">
                      Update Student
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Subject Management</CardTitle>
                    <CardDescription className="text-sm">Create subjects and assign teachers</CardDescription>
                  </div>
                  <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full sm:w-auto">
                        <BookOpen className="w-4 h-4 sm:mr-2" />
                        <span className="sm:inline">Create Subject</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-full m-4 max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Create New Subject</DialogTitle>
                        <DialogDescription className="text-sm">Add a new subject for a semester</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject-name">Subject Name</Label>
                          <Input
                            id="subject-name"
                            value={subjectName}
                            onChange={(e) => setSubjectName(e.target.value)}
                            placeholder="e.g., Database Management Systems"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject-code">Subject Code</Label>
                          <Input
                            id="subject-code"
                            value={subjectCode}
                            onChange={(e) => setSubjectCode(e.target.value)}
                            placeholder="e.g., IT201"
                          />
                        </div>
                        <div>
                          <Label htmlFor="subject-semester">Semester</Label>
                          <Select value={subjectSemester} onValueChange={setSubjectSemester}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                            <SelectContent>
                              {semesters.map((sem) => (
                                <SelectItem key={sem.id} value={sem.id}>
                                  {sem.semester_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="subject-teacher">Assign Teacher (Optional)</Label>
                          <Select 
                            value={subjectTeacher || undefined} 
                            onValueChange={(val) => setSubjectTeacher(val === 'unassigned' ? '' : val)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">No Teacher</SelectItem>
                              {teachers && teachers.length > 0 ? teachers.filter(t => t.status === 'active' || t.isActive === true).map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </SelectItem>
                              )) : (
                                <div className="p-2 text-sm text-gray-500">No teachers available</div>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleCreateSubject} className="w-full">
                          Create Subject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[100px]">Code</TableHead>
                        <TableHead className="min-w-[200px]">Subject Name</TableHead>
                        <TableHead className="min-w-[120px]">Semester</TableHead>
                        <TableHead className="min-w-[150px]">Teacher</TableHead>
                        <TableHead className="min-w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects && subjects.length > 0 ? subjects.map((subject) => {
                        const semester = semesters?.find(s => s.id === subject.semester_id);
                        const teacher = users?.find(u => u.id === subject.teacher_id);
                        
                        return (
                          <TableRow key={subject.id}>
                            <TableCell className="font-medium">{subject.subject_code}</TableCell>
                            <TableCell>{subject.subject_name}</TableCell>
                            <TableCell>{semester?.semester_name || 'N/A'}</TableCell>
                            <TableCell>
                              {(teacher && teacher.name) ? (
                                <span className="text-sm">{teacher.name}</span>
                              ) : (
                                <Select
                                  value={subject.teacher_id || undefined}
                                  onValueChange={(value) => handleAssignTeacher(subject.id, value || null)}
                                >
                                  <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Assign teacher" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="__unassign__">Unassigned</SelectItem>
                                    {teachers && teachers.length > 0 ? teachers.filter(t => t.status === 'active' || t.isActive === true).map((t) => (
                                      <SelectItem key={t.id} value={t.id}>
                                        {t.name}
                                      </SelectItem>
                                    )) : (
                                      <div className="p-2 text-sm text-gray-500">No teachers</div>
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            </TableCell>
                            <TableCell>
                              {teacher && teacher.name ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUnassignTeacher(subject.id)}
                                  className="text-xs sm:text-sm"
                                >
                                  Unassign
                                </Button>
                              ) : null}
                            </TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">No subjects found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
      />
    </div>
  );
};
