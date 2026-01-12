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
import { LogOut, UserPlus, BookOpen, Users, Trash2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toast } from 'sonner';
import { ChangePasswordDialog } from './ChangePasswordDialog';

export const SuperAdminDashboard = () => {
  const { currentUser, logout, users, addUser, updateUser, deleteUser, subjects, addSubject, updateSubject, semesters } = useApp();

  // Teacher creation state
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);

  // Student creation state
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  // Subject creation state
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectSemester, setSubjectSemester] = useState('');
  const [subjectTeacher, setSubjectTeacher] = useState('');
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);

  // Change password state
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);

  const teachers = users.filter(u => u.role === 'teacher');
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
      toast.error('Failed to create teacher account. Please try again.');
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
      toast.error('Failed to create student account. Please try again.');
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
        teacher_id: subjectTeacher || null
      };

      await addSubject(newSubject);
      toast.success('Subject created successfully');
      setSubjectName('');
      setSubjectCode('');
      setSubjectSemester('');
      setSubjectTeacher('');
      setSubjectDialogOpen(false);
    } catch (error) {
      toast.error('Failed to create subject. Please try again.');
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
      await updateSubject(subjectId, { teacher_id: teacherId });
      toast.success('Teacher assigned successfully');
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Kathmandu University - B.Tech.Ed. IT</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <Badge variant="secondary">Super Admin</Badge>
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
        <Tabs defaultValue="teachers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
          </TabsList>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Teacher Management</CardTitle>
                    <CardDescription>Create and manage teacher accounts</CardDescription>
                  </div>
                  <Dialog open={teacherDialogOpen} onOpenChange={setTeacherDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Create Teacher
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Teacher</DialogTitle>
                        <DialogDescription>Add a new teacher account to the system</DialogDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                            {teacher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(teacher.id, teacher.name)}
                            disabled={teacher.status === 'inactive'}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>Create and manage student accounts</CardDescription>
                  </div>
                  <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Users className="w-4 h-4 mr-2" />
                        Create Student
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Student</DialogTitle>
                        <DialogDescription>Add a new student account to the system</DialogDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(student.id, student.name)}
                            disabled={student.status === 'inactive'}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subject Management</CardTitle>
                    <CardDescription>Create subjects and assign teachers</CardDescription>
                  </div>
                  <Dialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Create Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Subject</DialogTitle>
                        <DialogDescription>Add a new subject for a semester</DialogDescription>
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
                          <Select value={subjectTeacher} onValueChange={setSubjectTeacher}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select teacher" />
                            </SelectTrigger>
                            <SelectContent>
                              {teachers.filter(t => t.status === 'active').map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => {
                      const semester = semesters.find(s => s.id === subject.semester_id);
                      const teacher = users.find(u => u.id === subject.teacher_id);
                      
                      return (
                        <TableRow key={subject.id}>
                          <TableCell>{subject.subject_code}</TableCell>
                          <TableCell>{subject.subject_name}</TableCell>
                          <TableCell>{semester?.semester_name}</TableCell>
                          <TableCell>
                            {teacher ? (
                              <span>{teacher.name}</span>
                            ) : (
                              <Select
                                value={subject.teacher_id || undefined}
                                onValueChange={(value) => handleAssignTeacher(subject.id, value)}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Assign teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                  {teachers.filter(t => t.status === 'active').map((t) => (
                                    <SelectItem key={t.id} value={t.id}>
                                      {t.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </TableCell>
                          <TableCell>
                            {teacher && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUnassignTeacher(subject.id)}
                              >
                                Unassign
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
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
