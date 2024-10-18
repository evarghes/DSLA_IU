'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Save, Send, Plus, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

const courses = [
  'Introduction to Data Science',
  'Data Analysis with Python',
  'Machine Learning Fundamentals',
  'Deep Learning and Neural Networks',
  'Big Data Processing',
  'Data Visualization',
]

const initialSections = [
  'Overview',
  'Learning Objectives',
  'Prerequisites',
  'Key Concepts',
  'Resources',
  'Hands-on Practices',
  'Quizzes',
  'Additional Notes',
  'Community and Support',
  'Feedback Mechanism',
]

const courseOverviews = {
  'Introduction to Data Science': 'Data Science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from structured and unstructured data. This course provides a comprehensive introduction to the core concepts, tools, and techniques used in data science.',
  'Data Analysis with Python': 'Python has become one of the most popular programming languages for data analysis due to its simplicity and powerful libraries. This course focuses on using Python for data manipulation, analysis, and visualization, covering essential libraries such as pandas, NumPy, and Matplotlib.',
  'Machine Learning Fundamentals': 'Machine Learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. This course covers the fundamental concepts, algorithms, and practical applications of machine learning.',
  'Deep Learning and Neural Networks': 'Deep Learning is a subset of machine learning based on artificial neural networks. This course delves into the architecture and training of deep neural networks, covering topics such as convolutional neural networks (CNNs), recurrent neural networks (RNNs), and their applications in various domains.',
  'Big Data Processing': 'Big Data refers to extremely large datasets that may be analyzed computationally to reveal patterns, trends, and associations. This course introduces technologies and frameworks for processing and analyzing big data, including Hadoop, Spark, and distributed computing concepts.',
  'Data Visualization': 'Data Visualization is the graphical representation of information and data. This course explores various techniques and tools for creating effective and compelling visualizations, helping learners to communicate complex data insights in a clear and impactful manner.'
}

const initialCourseResources = {
  'Introduction to Data Science': [
    { title: 'Data Science for Beginners - A Curriculum', url: 'https://github.com/microsoft/Data-Science-For-Beginners' },
    { title: 'Introduction to Data Science (Coursera)', url: 'https://www.coursera.org/specializations/introduction-data-science' },
    { title: 'Data Science: Foundations using R Specialization', url: 'https://www.coursera.org/specializations/data-science-foundations-r' },
  ],
  'Data Analysis with Python': [
    { title: 'Python for Data Analysis (Book)', url: 'https://wesmckinney.com/book/' },
    { title: 'Data Analysis with Python (Coursera)', url: 'https://www.coursera.org/learn/data-analysis-with-python' },
    { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
  ],
  'Machine Learning Fundamentals': [
    { title: 'Machine Learning by Andrew Ng (Coursera)', url: 'https://www.coursera.org/learn/machine-learning' },
    { title: 'Introduction to Machine Learning with Python', url: 'https://github.com/amueller/introduction_to_ml_with_python' },
    { title: 'Scikit-Learn Documentation', url: 'https://scikit-learn.org/stable/documentation.html' },
  ],
  'Deep Learning and Neural Networks': [
    { title: 'Deep Learning Specialization (Coursera)', url: 'https://www.coursera.org/specializations/deep-learning' },
    { title: 'TensorFlow Documentation', url: 'https://www.tensorflow.org/learn' },
    { title: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' },
  ],
  'Big Data Processing': [
    { title: 'Big Data Specialization (Coursera)', url: 'https://www.coursera.org/specializations/big-data' },
    { title: 'Apache Spark Documentation', url: 'https://spark.apache.org/docs/latest/' },
    { title: 'Hadoop Documentation', url: 'https://hadoop.apache.org/docs/' },
  ],
  'Data Visualization': [
    { title: 'Data Visualization with Python (Coursera)', url: 'https://www.coursera.org/learn/python-for-data-visualization' },
    { title: 'Matplotlib Documentation', url: 'https://matplotlib.org/stable/contents.html' },
    { title: 'D3.js Documentation', url: 'https://d3js.org/' },
  ],
}

export default function DataScienceHub() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCourse, setActiveCourse] = useState('')
  const [courseContent, setCourseContent] = useState({})
  const [editMode, setEditMode] = useState({})
  const [courseResources, setCourseResources] = useState(initialCourseResources)

  useEffect(() => {
    const savedContent = localStorage.getItem('courseContent')
    const savedResources = localStorage.getItem('courseResources')
    if (savedContent) {
      const parsedContent = JSON.parse(savedContent)
      setCourseContent(parsedContent)
      // Initialize editMode for all saved courses
      const initialEditMode = Object.keys(parsedContent).reduce((acc, course) => {
        acc[course] = Object.keys(parsedContent[course]).reduce((sectionAcc, section) => {
          sectionAcc[section] = false
          return sectionAcc
        }, {})
        return acc
      }, {})
      setEditMode(initialEditMode)
    }
    if (savedResources) {
      setCourseResources(JSON.parse(savedResources))
    }
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const handleCourseClick = (course) => {
    setActiveCourse(course)
    setIsMenuOpen(false)
    if (!courseContent[course]) {
      const newContent = {
        ...courseContent,
        [course]: {
          'Overview': courseOverviews[course],
          ...initialSections.reduce((acc, section) => {
            if (section !== 'Overview') {
              acc[section] = ''
            }
            return acc
          }, {})
        }
      }
      setCourseContent(newContent)
      localStorage.setItem('courseContent', JSON.stringify(newContent))
      setEditMode(prevMode => ({
        ...prevMode,
        [course]: initialSections.reduce((acc, section) => ({ ...acc, [section]: false }), {}),
      }))
    }
  }

  const handleContentEdit = (course, section, content) => {
    const newContent = {
      ...courseContent,
      [course]: {
        ...courseContent[course],
        [section]: content,
      },
    }
    setCourseContent(newContent)
    localStorage.setItem('courseContent', JSON.stringify(newContent))
  }

  const toggleEditMode = (course, section) => {
    setEditMode(prevMode => ({
      ...prevMode,
      [course]: {
        ...(prevMode[course] || {}),
        [section]: !(prevMode[course] && prevMode[course][section]),
      },
    }))
  }

  const handleSaveSection = (course, section) => {
    toggleEditMode(course, section)
    console.log(`Saved ${section} for ${course}`)
  }

  const handleDeploy = (course) => {
    console.log(`Deploying ${course}`)
    alert(`${course} has been deployed!`)
  }

  const handleResourceEdit = (course, index, field, value) => {
    const newResources = [...courseResources[course]]
    newResources[index] = { ...newResources[index], [field]: value }
    setCourseResources({ ...courseResources, [course]: newResources })
    localStorage.setItem('courseResources', JSON.stringify({ ...courseResources, [course]: newResources }))
  }

  const handleAddResource = (course) => {
    const newResources = [...courseResources[course], { title: '', url: '' }]
    setCourseResources({ ...courseResources, [course]: newResources })
    localStorage.setItem('courseResources', JSON.stringify({ ...courseResources, [course]: newResources }))
  }

  const handleRemoveResource = (course, index) => {
    const newResources = courseResources[course].filter((_, i) => i !== index)
    setCourseResources({ ...courseResources, [course]: newResources })
    localStorage.setItem('courseResources', JSON.stringify({ ...courseResources, [course]: newResources }))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <Link href="/" className="text-white flex items-center space-x-2 px-4" onClick={() => setActiveCourse('')}>
          <span className="text-2xl font-extrabold">DS Topics</span>
        </Link>
        <div className="space-y-3">
          {courses.map((course) => (
            <button
              key={course}
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
              onClick={() => handleCourseClick(course)}
            >
              {course}
            </button>
          ))}
        </div>
      </nav>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {activeCourse || 'Data Science Learning Accelerator Hub'}
            </h1>
            <button onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            {!activeCourse ? (
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  Welcome to the Data Science Learning Accelerator Hub
                </h1>
                <p className="text-xl text-gray-600">
                  Choose a course from the menu to get started on your data science journey.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(courseContent[activeCourse] || {}).map(([section, content]) => (
                  <div key={section} className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-gray-800">{section}</h2>
                      {section !== 'Feedback Mechanism' && (
                        <Button
                          onClick={() => editMode[activeCourse]?.[section] ? handleSaveSection(activeCourse, section) : toggleEditMode(activeCourse, section)}
                          className="flex items-center"
                        >
                          {editMode[activeCourse]?.[section] ? <Save className="mr-2" size={16} /> : 'Edit'}
                          {editMode[activeCourse]?.[section] ? 'Save' : ''}
                        </Button>
                      )}
                    </div>
                    {editMode[activeCourse]?.[section] ? (
                      section === 'Resources' ? (
                        <div className="space-y-4">
                          {courseResources[activeCourse].map((resource, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <Input
                                value={resource.title}
                                onChange={(e) => handleResourceEdit(activeCourse, index, 'title', e.target.value)}
                                placeholder="Resource Title"
                                className="flex-grow"
                              />
                              <Input
                                value={resource.url}
                                onChange={(e) => handleResourceEdit(activeCourse, index, 'url', e.target.value)}
                                placeholder="Resource URL"
                                className="flex-grow"
                              />
                              <Button onClick={() => handleRemoveResource(activeCourse, index)} variant="destructive">
                                <Trash size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button onClick={() => handleAddResource(activeCourse)} className="mt-2">
                            <Plus size={16} className="mr-2" /> Add Resource
                          </Button>
                        </div>
                      ) : (
                        <Textarea
                          value={content}
                          onChange={(e) => handleContentEdit(activeCourse, section, e.target.value)}
                          className="w-full p-2 border rounded"
                          rows={5}
                        />
                      )
                    ) : (
                      section === 'Resources' ? (
                        <div className="prose max-w-none">
                          <ul className="list-disc pl-5 space-y-2">
                            {courseResources[activeCourse].map((resource, index) => (
                              <li key={index}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  {resource.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : section === 'Feedback Mechanism' ? (
                        <div className="prose max-w-none">
                          <p>We value your feedback! Please use the form below to submit your thoughts, suggestions, or concerns about the course.</p>
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            alert('Feedback submitted successfully!');
                            // Here you would typically send the feedback to a server
                          }} className="space-y-4 mt-4">
                            <div>
                              <label htmlFor="feedback" className="block text-sm font-medium  text-gray-700">Your Feedback</label>
                              <Textarea id="feedback" name="feedback" required className="mt-1" rows={4} />
                            </div>
                            <Button type="submit">Submit Feedback</Button>
                          </form>
                        </div>
                      ) : (
                        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content || `Add ${section} content here...` }} />
                      )
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button onClick={() => handleDeploy(activeCourse)} className="flex items-center">
                    <Send className="mr-2" size={16} />
                    Deploy Course
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
