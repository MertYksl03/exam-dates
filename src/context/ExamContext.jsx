import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loadExams } from '../utils/csvParser';

const STORAGE_KEY = 'exam-dashboard-selected-courses';

const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [allExams, setAllExams] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load CSV on mount
  useEffect(() => {
    loadExams()
      .then((exams) => {
        setAllExams(exams);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load exams:', err);
        setError('Sınav verileri yüklenemedi.');
        setLoading(false);
      });
  }, []);

  // Persist selections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCourses));
  }, [selectedCourses]);

  const toggleCourse = useCallback((courseName) => {
    setSelectedCourses((prev) =>
      prev.includes(courseName)
        ? prev.filter((c) => c !== courseName)
        : [...prev, courseName]
    );
  }, []);

  const selectAll = useCallback(() => {
    setSelectedCourses(allExams.map((e) => e.course));
  }, [allExams]);

  const deselectAll = useCallback(() => {
    setSelectedCourses([]);
  }, []);

  const selectedExams = allExams
    .filter((exam) => selectedCourses.includes(exam.course))
    .sort((a, b) => a.date - b.date);

  const value = {
    allExams,
    selectedCourses,
    selectedExams,
    toggleCourse,
    selectAll,
    deselectAll,
    loading,
    error,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExams() {
  const ctx = useContext(ExamContext);
  if (!ctx) throw new Error('useExams must be used within ExamProvider');
  return ctx;
}
