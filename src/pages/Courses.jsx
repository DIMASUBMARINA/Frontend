import { useState } from 'react'
import { useSelector } from 'react-redux'
import CourseCard from '../components/CourseCard'

export default function Courses() {
  const courses     = useSelector((state) => state.data.courses)
  const teachers    = useSelector((state) => state.data.teachers)
  const categories  = useSelector((state) => state.data.categories)
  const enrolledIds = useSelector((state) => state.data.enrolledIds)

  const [searchTerm,       setSearchTerm]       = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categoryNames = ['All', ...new Set(
    courses.map((c) => {
      const cat = categories.find((cat) => cat.id === c.categoryId)
      return cat?.name
    }),
  )]

  const query    = searchTerm.trim().toLowerCase()
  const filtered = courses.filter((course) => {
    const teacher  = teachers.find((t) => t.id === course.teacherId)
    const category = categories.find((c) => c.id === course.categoryId)

    const matchSearch =
      !query ||
      course.name.toLowerCase().includes(query) ||
      course.shortDescription.toLowerCase().includes(query) ||
      teacher?.name.toLowerCase().includes(query) ||
      category?.name.toLowerCase().includes(query)

    const matchCategory =
      selectedCategory === 'All' ||
      category?.name === selectedCategory

    return matchSearch && matchCategory
  })

  return (
    <div className="page-stack">
      <section className="section-heading">
        <h1>All Courses</h1>
        <p>Browse all available programs.</p>
      </section>

      <section className="toolbar card">
        <div className="field">
          <label htmlFor="courses-search">Search</label>
          <input
            id="courses-search"
            name="courses-search"
            placeholder="e.g. React, API, design..."
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="courses-category">Category</label>
          <select
            id="courses-category"
            name="courses-category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categoryNames.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="page-section">
        <p>{filtered.length} course(s) found</p>
        {filtered.length ? (
          <div className="grid grid-courses">
            {filtered.map((course) => {
              const teacher  = teachers.find((t) => t.id === course.teacherId)
              const category = categories.find((c) => c.id === course.categoryId)
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  teacher={teacher}
                  category={category}
                  isEnrolled={enrolledIds.includes(course.id)}
                />
              )
            })}
          </div>
        ) : (
          <div className="empty-state card">
            <h3>Nothing found</h3>
            <p>Try a different search or category.</p>
          </div>
        )}
      </section>
    </div>
  )
}
