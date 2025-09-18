const KEY = "p3c:courses:v1";

function uuid() {
  try {
    // Modern browsers
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {}
  // Fallback
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).slice(1);
  return `${Date.now()}-${s4()}-${s4()}-${s4()}-${s4()}`;
}

export function loadCourses() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCourses(list) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function upsertCourse(course) {
  const list = loadCourses();
  const idx = list.findIndex(c => c.id === course.id);
  if (idx >= 0) list[idx] = course; else list.unshift(course);
  saveCourses(list);
  return list;
}

export function deleteCourse(id) {
  const list = loadCourses().filter(c => c.id !== id);
  saveCourses(list);
  return list;
}

export function newCourseTemplate() {
  return {
    id: uuid(),
    name: "",
    city: "",
    state: "",
    par3Holes: 1,
    contact: "",
    email: "",
    phone: "",
    status: "inactive",
  };
}
