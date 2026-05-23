import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ConfirmModal from '../components/ConfirmModal'
import { useToast } from '../hooks/useToast.js'
import {
  courseAdded, courseUpdated, courseRemoved,
  teacherAdded, teacherUpdated, teacherRemoved,
  categoryAdded, categoryUpdated, categoryRemoved,
} from '../store/dataSlice.js'
import * as api from '../api.js'

function getEmptyCourseForm(teachers, categories) {
  return {
    name: '',
    shortDescription: '',
    description: '',
    categoryId: categories[0]?.id ?? '',
    teacherId: teachers[0]?.id ?? '',
    lessons: 12,
    level: 'Beginner',
  }
}

function getEmptyTeacherForm() {
  return { name: '', subject: '', rating: 4.8, bio: '' }
}

function getEmptyCategoryForm() {
  return { name: '', description: '' }
}

export default function Admin() {
  const dispatch = useDispatch()
  const toast    = useToast()
  const courses    = useSelector((state) => state.data.courses)
  const teachers   = useSelector((state) => state.data.teachers)
  const categories = useSelector((state) => state.data.categories)

  const [courseForm,   setCourseForm]   = useState(() => getEmptyCourseForm(teachers, categories))
  const [teacherForm,  setTeacherForm]  = useState(getEmptyTeacherForm)
  const [categoryForm, setCategoryForm] = useState(getEmptyCategoryForm)

  const [editingCourseId,   setEditingCourseId]   = useState(null)
  const [editingTeacherId,  setEditingTeacherId]  = useState(null)
  const [editingCategoryId, setEditingCategoryId] = useState(null)

  const [confirm, setConfirm] = useState(null)

  useEffect(() => {
    if (!teachers.length) {
      setCourseForm((prev) => ({ ...prev, teacherId: '' }))
    } else if (!teachers.some((t) => t.id === courseForm.teacherId)) {
      setCourseForm((prev) => ({ ...prev, teacherId: teachers[0].id }))
    }
  }, [teachers])

  useEffect(() => {
    if (!categories.length) {
      setCourseForm((prev) => ({ ...prev, categoryId: '' }))
    } else if (!categories.some((c) => c.id === courseForm.categoryId)) {
      setCourseForm((prev) => ({ ...prev, categoryId: categories[0].id }))
    }
  }, [categories])

  const resetCourseForm   = () => { setCourseForm(getEmptyCourseForm(teachers, categories)); setEditingCourseId(null) }
  const resetTeacherForm  = () => { setTeacherForm(getEmptyTeacherForm());  setEditingTeacherId(null) }
  const resetCategoryForm = () => { setCategoryForm(getEmptyCategoryForm()); setEditingCategoryId(null) }

  const handleCourseChange   = (e) => setCourseForm((p)   => ({ ...p, [e.target.name]: e.target.value }))
  const handleTeacherChange  = (e) => setTeacherForm((p)  => ({ ...p, [e.target.name]: e.target.value }))
  const handleCategoryChange = (e) => setCategoryForm((p) => ({ ...p, [e.target.name]: e.target.value }))

  const handleCourseSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...courseForm, lessons: Number(courseForm.lessons) || 0 }
    try {
      if (editingCourseId) {
        const course = await api.updateCourse(editingCourseId, payload)
        dispatch(courseUpdated(course))
        toast('Course updated.', 'success')
      } else {
        const course = await api.createCourse(payload)
        dispatch(courseAdded(course))
        toast('Course added.', 'success')
      }
      resetCourseForm()
    } catch (err) {
      toast(err.message || 'Error saving course.', 'error')
    }
  }

  const handleTeacherSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...teacherForm, rating: Number(teacherForm.rating) }
    try {
      if (editingTeacherId) {
        const teacher = await api.updateTeacher(editingTeacherId, payload)
        dispatch(teacherUpdated(teacher))
        toast('Teacher updated.', 'success')
      } else {
        const teacher = await api.createTeacher(payload)
        dispatch(teacherAdded(teacher))
        toast('Teacher added.', 'success')
      }
      resetTeacherForm()
    } catch (err) {
      toast(err.message || 'Error saving teacher.', 'error')
    }
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategoryId) {
        const category = await api.updateCategory(editingCategoryId, categoryForm)
        dispatch(categoryUpdated(category))
        toast('Category updated.', 'success')
      } else {
        const category = await api.createCategory(categoryForm)
        dispatch(categoryAdded(category))
        toast('Category added.', 'success')
      }
      resetCategoryForm()
    } catch (err) {
      toast(err.message || 'Error saving category.', 'error')
    }
  }

  const startEditCourse = (course) => {
    setEditingCourseId(course.id)
    setCourseForm({
      name: course.name,
      shortDescription: course.shortDescription,
      description: course.description,
      categoryId: course.categoryId,
      teacherId: course.teacherId,
      lessons: course.lessons,
      level: course.level,
    })
  }

  const startEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id)
    setTeacherForm({ name: teacher.name, subject: teacher.subject, rating: teacher.rating, bio: teacher.bio })
  }

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id)
    setCategoryForm({ name: cat.name, description: cat.description ?? '' })
  }

  return (
    <div className="page-stack">
      <section className="section-heading">
        <h1>Admin Panel</h1>
        <p>Manage courses, teachers and categories.</p>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <h2>Categories</h2>
          <p>{categories.length} total</p>
        </div>

        <div className="admin-grid">
          <form className="card form-card" onSubmit={handleCategorySubmit}>
            <div className="form-heading">
              <h3>{editingCategoryId ? 'Edit category' : 'Add category'}</h3>
              {editingCategoryId && (
                <button className="button button-ghost" onClick={resetCategoryForm} type="button">Cancel</button>
              )}
            </div>

            <div className="field">
              <label htmlFor="cat-name">Name</label>
              <input id="cat-name" name="name" required type="text" value={categoryForm.name} onChange={handleCategoryChange} />
            </div>

            <div className="field">
              <label htmlFor="cat-description">Description</label>
              <textarea id="cat-description" name="description" rows="4" value={categoryForm.description} onChange={handleCategoryChange} />
            </div>

            <button className="button button-primary" type="submit">
              {editingCategoryId ? 'Save changes' : 'Add category'}
            </button>
          </form>

          <div className="card list-panel">
            {categories.length === 0 && (
              <p style={{ padding: '1rem', color: 'var(--color-text-subtle)' }}>No categories yet.</p>
            )}
            {categories.map((cat) => {
              const inUse = courses.some((c) => c.categoryId === cat.id)
              return (
                <article className="list-item" key={cat.id}>
                  <div>
                    <h3>{cat.name}</h3>
                    {cat.description && <p>{cat.description}</p>}
                    <div className="meta-row subtle">
                      <span>{courses.filter((c) => c.categoryId === cat.id).length} course(s)</span>
                    </div>
                  </div>
                  <div className="action-row">
                    <button className="button button-ghost" onClick={() => startEditCategory(cat)} type="button">Edit</button>
                    <button
                      className="button button-danger"
                      disabled={inUse}
                      onClick={() => setConfirm({ type: 'category', id: cat.id })}
                      type="button"
                    >
                      {inUse ? 'In use' : 'Delete'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <h2>Courses</h2>
          <p>{courses.length} total</p>
        </div>

        <div className="admin-grid">
          <form className="card form-card" onSubmit={handleCourseSubmit}>
            <div className="form-heading">
              <h3>{editingCourseId ? 'Edit course' : 'Add course'}</h3>
              {editingCourseId && (
                <button className="button button-ghost" onClick={resetCourseForm} type="button">Cancel</button>
              )}
            </div>

            <div className="field">
              <label htmlFor="course-name">Name</label>
              <input id="course-name" name="name" required type="text" value={courseForm.name} onChange={handleCourseChange} />
            </div>

            <div className="field">
              <label htmlFor="course-short">Short description</label>
              <input id="course-short" name="shortDescription" required type="text" value={courseForm.shortDescription} onChange={handleCourseChange} />
            </div>

            <div className="field">
              <label htmlFor="course-description">Description</label>
              <textarea id="course-description" name="description" required rows="5" value={courseForm.description} onChange={handleCourseChange} />
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="course-category">Category</label>
                <select id="course-category" name="categoryId" value={courseForm.categoryId} onChange={handleCourseChange}>
                  {categories.length ? (
                    categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)
                  ) : (
                    <option value="">Add a category first</option>
                  )}
                </select>
              </div>

              <div className="field">
                <label htmlFor="course-teacher">Teacher</label>
                <select id="course-teacher" name="teacherId" required value={courseForm.teacherId} onChange={handleCourseChange}>
                  {teachers.length ? (
                    teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)
                  ) : (
                    <option value="">Add a teacher first</option>
                  )}
                </select>
              </div>
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="course-lessons">Lessons</label>
                <input id="course-lessons" min="1" name="lessons" required type="number" value={courseForm.lessons} onChange={handleCourseChange} />
              </div>

              <div className="field">
                <label htmlFor="course-level">Level</label>
                <input id="course-level" name="level" required type="text" value={courseForm.level} onChange={handleCourseChange} />
              </div>
            </div>

            <button className="button button-primary" disabled={!teachers.length || !categories.length} type="submit">
              {editingCourseId ? 'Save changes' : 'Add course'}
            </button>
          </form>

          <div className="card list-panel">
            {courses.map((course) => {
              const teacher  = teachers.find((t) => t.id === course.teacherId)
              const category = categories.find((c) => c.id === course.categoryId)
              return (
                <article className="list-item" key={course.id}>
                  <div>
                    <h3>{course.name}</h3>
                    <p>{course.shortDescription}</p>
                    <div className="meta-row subtle">
                      <span>{category?.name ?? course.courseCategory?.name ?? '—'}</span>
                      <span>{teacher?.name ?? 'Teacher TBD'}</span>
                    </div>
                  </div>
                  <div className="action-row">
                    <button className="button button-ghost" onClick={() => startEditCourse(course)} type="button">Edit</button>
                    <button className="button button-danger" onClick={() => setConfirm({ type: 'course', id: course.id })} type="button">Delete</button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-heading">
          <h2>Teachers</h2>
          <p>{teachers.length} total</p>
        </div>

        <div className="admin-grid">
          <form className="card form-card" onSubmit={handleTeacherSubmit}>
            <div className="form-heading">
              <h3>{editingTeacherId ? 'Edit teacher' : 'Add teacher'}</h3>
              {editingTeacherId && (
                <button className="button button-ghost" onClick={resetTeacherForm} type="button">Cancel</button>
              )}
            </div>

            <div className="field">
              <label htmlFor="teacher-name">Name</label>
              <input id="teacher-name" name="name" required type="text" value={teacherForm.name} onChange={handleTeacherChange} />
            </div>

            <div className="split-fields">
              <div className="field">
                <label htmlFor="teacher-subject">Subject</label>
                <input id="teacher-subject" name="subject" required type="text" value={teacherForm.subject} onChange={handleTeacherChange} />
              </div>

              <div className="field">
                <label htmlFor="teacher-rating">Rating</label>
                <input id="teacher-rating" max="5" min="1" name="rating" required step="0.1" type="number" value={teacherForm.rating} onChange={handleTeacherChange} />
              </div>
            </div>

            <div className="field">
              <label htmlFor="teacher-bio">Bio</label>
              <textarea id="teacher-bio" name="bio" required rows="5" value={teacherForm.bio} onChange={handleTeacherChange} />
            </div>

            <button className="button button-primary" type="submit">
              {editingTeacherId ? 'Save changes' : 'Add teacher'}
            </button>
          </form>

          <div className="card list-panel">
            {teachers.map((teacher) => {
              const isAssigned = courses.some((c) => c.teacherId === teacher.id)
              return (
                <article className="list-item" key={teacher.id}>
                  <div>
                    <h3>{teacher.name}</h3>
                    <p>{teacher.bio}</p>
                    <div className="meta-row subtle">
                      <span>{teacher.subject}</span>
                      <span>Rating: {teacher.rating}</span>
                    </div>
                  </div>
                  <div className="action-row">
                    <button className="button button-ghost" onClick={() => startEditTeacher(teacher)} type="button">Edit</button>
                    <button
                      className="button button-danger"
                      disabled={isAssigned}
                      onClick={() => setConfirm({ type: 'teacher', id: teacher.id })}
                      type="button"
                    >
                      {isAssigned ? 'In use' : 'Delete'}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {confirm && (
        <ConfirmModal
          message={
            confirm.type === 'course'    ? 'This course will be permanently deleted.'    :
            confirm.type === 'teacher'   ? 'This teacher will be permanently deleted.'   :
                                          'This category will be permanently deleted.'
          }
          onCancel={() => setConfirm(null)}
          onConfirm={async () => {
            try {
              if (confirm.type === 'course') {
                await api.deleteCourse(confirm.id)
                dispatch(courseRemoved(confirm.id))
              } else if (confirm.type === 'teacher') {
                await api.deleteTeacher(confirm.id)
                dispatch(teacherRemoved(confirm.id))
              } else {
                await api.deleteCategory(confirm.id)
                dispatch(categoryRemoved(confirm.id))
              }
              toast('Deleted successfully.', 'success')
            } catch (err) {
              toast(err.message || 'Delete failed.', 'error')
            }
            setConfirm(null)
          }}
        />
      )}
    </div>
  )
}
