import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/authService';
import * as userService from '../services/userService';
import * as semesterService from '../services/semesterService';
import * as subjectService from '../services/subjectService';
import * as enrollmentService from '../services/enrollmentService';
import * as noteService from '../services/noteService';
import * as videoService from '../services/videoService';

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize: Check for existing session
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  // Load all data when user is logged in
  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, semestersRes, subjectsRes, enrollmentsRes, notesRes, videosRes] = await Promise.all([
        userService.getAllUsers().catch(() => ({ data: [] })),
        semesterService.getAllSemesters().catch(() => ({ data: [] })),
        subjectService.getAllSubjects().catch(() => ({ data: [] })),
        enrollmentService.getAllEnrollments().catch(() => ({ data: [] })),
        noteService.getAllNotes().catch(() => ({ data: [] })),
        videoService.getAllVideos().catch(() => ({ data: [] })),
      ]);

      setUsers(usersRes.data || []);
      setSemesters(semestersRes.data || []);
      setSubjects(subjectsRes.data || []);
      setEnrollments(enrollmentsRes.data || []);
      setNotes(notesRes.data || []);
      setVideos(videosRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authLogin(email, password);
      setCurrentUser(response.user);
      await loadData();
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setCurrentUser(null);
    setUsers([]);
    setSemesters([]);
    setSubjects([]);
    setEnrollments([]);
    setNotes([]);
    setVideos([]);
  };

  const addUser = async (user) => {
    try {
      const response = await userService.createUser(user);
      setUsers([...users, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add user error:', error);
      throw error;
    }
  };

  const updateUser = async (id, updates) => {
    try {
      const response = await userService.updateUser(id, updates);
      setUsers(users.map((u) => (u.id === id ? response.data : u)));
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      setUsers(users.map((u) => (u.id === id ? { ...u, status: 'inactive' } : u)));
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  };

  const addSubject = async (subject) => {
    try {
      const response = await subjectService.createSubject(subject);
      setSubjects([...subjects, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add subject error:', error);
      throw error;
    }
  };

  const updateSubject = async (id, updates) => {
    try {
      const response = await subjectService.updateSubject(id, updates);
      setSubjects(subjects.map((s) => (s.id === id ? response.data : s)));
      return response.data;
    } catch (error) {
      console.error('Update subject error:', error);
      throw error;
    }
  };

  const deleteSubject = async (id) => {
    try {
      await subjectService.deleteSubject(id);
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Delete subject error:', error);
      throw error;
    }
  };

  const addEnrollment = async (enrollment) => {
    try {
      const response = await enrollmentService.createEnrollment(enrollment);
      setEnrollments([...enrollments, response.data]);
      return response.data;
    } catch (error) {
      console.error('Add enrollment error:', error);
      throw error;
    }
  };

  const updateEnrollment = async (id, updates) => {
    try {
      const response = await enrollmentService.updateEnrollment(id, updates);
      setEnrollments(enrollments.map((e) => (e.id === id ? response.data : e)));
      return response.data;
    } catch (error) {
      console.error('Update enrollment error:', error);
      throw error;
    }
  };

  const deleteEnrollment = async (id) => {
    try {
      await enrollmentService.deleteEnrollment(id);
      setEnrollments(enrollments.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Delete enrollment error:', error);
      throw error;
    }
  };

  const addNote = async (formData) => {
    try {
      const response = await noteService.createNote(formData);
      setNotes([...notes, response.data]);
      await loadData(); // Reload to get updated list
      return response.data;
    } catch (error) {
      console.error('Add note error:', error);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Delete note error:', error);
      throw error;
    }
  };

  const addVideo = async (formData) => {
    try {
      const response = await videoService.createVideo(formData);
      setVideos([...videos, response.data]);
      await loadData(); // Reload to get updated list
      return response.data;
    } catch (error) {
      console.error('Add video error:', error);
      throw error;
    }
  };

  const deleteVideo = async (id) => {
    try {
      await videoService.deleteVideo(id);
      setVideos(videos.filter((v) => v.id !== id));
    } catch (error) {
      console.error('Delete video error:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        users,
        addUser,
        updateUser,
        deleteUser,
        semesters,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        enrollments,
        addEnrollment,
        updateEnrollment,
        deleteEnrollment,
        notes,
        addNote,
        deleteNote,
        videos,
        addVideo,
        deleteVideo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
