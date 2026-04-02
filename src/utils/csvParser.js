import Papa from 'papaparse';

/**
 * Parse a Turkish date string like "06.04.2026 Pazartesi" into a JS Date.
 */
function parseTurkishDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(' ')[0]; // "06.04.2026"
  const [day, month, year] = parts.split('.').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Parse the time range "09:00-11:00" into start/end strings.
 */
function parseTimeRange(timeStr) {
  if (!timeStr) return { start: '', end: '' };
  const [start, end] = timeStr.split('-');
  return { start: start?.trim() || '', end: end?.trim() || '' };
}

/**
 * Calculate the difference in calendar days from today.
 * Positive = future, negative = past, 0 = today.
 */
export function daysFromNow(examDate) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const exam = new Date(examDate.getFullYear(), examDate.getMonth(), examDate.getDate());
  const diff = exam - today;
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get a status badge type for the exam.
 */
export function getExamStatus(examDate) {
  const days = daysFromNow(examDate);
  if (days < 0) return 'past';
  if (days === 0) return 'today';
  if (days <= 3) return 'soon';
  return 'upcoming';
}

/**
 * Get a human-readable label for days remaining.
 */
export function getDaysLabel(examDate) {
  const days = daysFromNow(examDate);
  if (days < 0) return `${Math.abs(days)} gün önce`;
  if (days === 0) return 'Bugün!';
  if (days === 1) return 'Yarın';
  return `${days} gün kaldı`;
}

/**
 * Turkish day names for display.
 */
const turkishDays = {
  Pazartesi: 'Pazartesi',
  Salı: 'Salı',
  Çarşamba: 'Çarşamba',
  Perşembe: 'Perşembe',
  Cuma: 'Cuma',
  Cumartesi: 'Cumartesi',
  Pazar: 'Pazar',
};

function getDayName(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.trim().split(' ');
  return parts.length > 1 ? turkishDays[parts[1]] || parts[1] : '';
}

/**
 * Load and parse exam data from CSV.
 * Returns an array of exam objects sorted by date.
 */
export async function loadExams() {
  const response = await fetch('./data.csv');
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const exams = results.data
          .filter((row) => row.Course && row.Course.trim())
          .map((row, index) => {
            const date = parseTurkishDate(row.Date);
            const time = parseTimeRange(row.Time);
            return {
              id: index,
              course: row.Course.trim(),
              date,
              dateStr: row.Date?.trim() || '',
              dayName: getDayName(row.Date),
              timeStart: time.start,
              timeEnd: time.end,
              timeStr: row.Time?.trim() || '',
              classroom: row.Class?.trim() || '',
              lecturer: row.Lecturer?.trim() || '',
            };
          })
          .filter((exam) => exam.date !== null)
          .sort((a, b) => a.date - b.date);

        resolve(exams);
      },
      error: (err) => reject(err),
    });
  });
}
