import { useState } from 'react';
import { Search } from 'lucide-react';
import { useExams } from '../context/ExamContext';

export default function SettingsView() {
  const { allExams, selectedCourses, toggleCourse, selectAll, deselectAll } = useExams();
  const [search, setSearch] = useState('');

  // Deduplicate courses by name (same course might appear as lecture entries)
  const uniqueCourses = [];
  const seen = new Set();
  for (const exam of allExams) {
    if (!seen.has(exam.course)) {
      seen.add(exam.course);
      uniqueCourses.push(exam);
    }
  }

  const filtered = uniqueCourses
    .filter((exam) =>
      exam.course.toLowerCase().includes(search.toLowerCase()) ||
      exam.lecturer.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = selectedCourses.includes(a.course) ? 0 : 1;
      const bSelected = selectedCourses.includes(b.course) ? 0 : 1;
      return aSelected - bSelected;
    });

  const selectedCount = selectedCourses.length;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Ders Seçimi</h1>
        <p>Kayıtlı olduğunuz dersleri seçin. Seçimleriniz otomatik olarak kaydedilir.</p>
      </div>

      <div className="settings-search">
        <Search />
        <input
          type="text"
          placeholder="Ders veya öğretim üyesi ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="course-search"
        />
      </div>

      <div className="select-bar">
        <span>{selectedCount} / {uniqueCourses.length} ders seçildi</span>
        <div>
          <button onClick={selectAll}>Tümünü Seç</button>
          <button onClick={deselectAll}>Temizle</button>
        </div>
      </div>

      <div className="course-list">
        {filtered.map((exam, i) => {
          const isSelected = selectedCourses.includes(exam.course);
          return (
            <div
              key={exam.course}
              className={`course-item ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleCourse(exam.course)}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <div className="course-info">
                <div className="course-name">{exam.course}</div>
                <div className="course-meta">
                  {exam.dateStr} · {exam.timeStr}
                  {exam.classroom ? ` · ${exam.classroom}` : ''}
                  {exam.lecturer ? ` · ${exam.lecturer}` : ''}
                </div>
              </div>
              <label className="toggle-switch" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleCourse(exam.course)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
