"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { GiFilmSpool } from "react-icons/gi"
import { FiSun, FiMoon, FiChevronDown, FiSearch, FiX } from "react-icons/fi"
import { BiCameraMovie, BiTrendingUp, BiHistory, BiBookmark } from "react-icons/bi"

const Navbar = () => {
  const [query, setQuery] = useState("")
  const [darkMode, setDarkMode] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Categories with icons and search queries
  const categories = [
    { name: "Action", query: "action", icon: "🔥" },
    { name: "Comédie", query: "comedy", icon: "😂" },
    { name: "Drame", query: "drama", icon: "🎭" },
    { name: "Science-Fiction", query: "sci-fi", icon: "🚀" },
    { name: "Horreur", query: "horror", icon: "👻" },
    { name: "Animation", query: "animation", icon: "🎬" },
    { name: "Aventure", query: "adventure", icon: "🌋" },
    { name: "Fantastique", query: "fantasy", icon: "🧙" },
  ]

  // Check if we're on a search page with a specific category
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const currentQuery = searchParams.get("search")

    if (currentQuery) {
      const matchingCategory = categories.find((cat) => cat.query.toLowerCase() === currentQuery.toLowerCase())
      if (matchingCategory) {
        setCategoriesOpen(false)
      }
    }
  }, [location.search])

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`)
      setQuery("")
      setSearchOpen(false)
    }
  }

  const handleCategoryClick = (categoryQuery) => {
    navigate(`/?search=${encodeURIComponent(categoryQuery)}`)
    setCategoriesOpen(false)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  const searchVariants = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "100%",
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/20" : "bg-gradient-to-r from-black to-red-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <motion.div variants={itemVariants} className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-red-500 to-red-700 p-2 rounded-full shadow-lg"
              >
                <GiFilmSpool className="text-white text-xl" />
              </motion.div>
              <motion.h1 className="text-xl font-bold flex items-center" whileHover={{ scale: 1.05 }}>
                <span className="bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">Movie</span>
                <span className="text-white">Flix</span>
              </motion.h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Quick Links */}
            <motion.div variants={itemVariants} className="flex items-center space-x-6">
              <Link
                to="/?search=trending"
                className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
              >
                <BiTrendingUp className="mr-1" />
                <span>Tendances</span>
              </Link>
              <Link to="/?search=new" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                <BiHistory className="mr-1" />
                <span>Nouveautés</span>
              </Link>
              <Link to="/favorites" className="flex items-center text-gray-300 hover:text-red-500 transition-colors">
                <BiBookmark className="mr-1" />
                <span>Favoris</span>
              </Link>
            </motion.div>

            {/* Categories Dropdown */}
            <motion.div className="relative" variants={itemVariants}>
              <motion.button
                className="flex items-center text-gray-300 hover:text-red-500 transition-colors"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BiCameraMovie className="mr-1" />
                <span>Catégories</span>
                <motion.div animate={{ rotate: categoriesOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown className="ml-1" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    className="absolute mt-2 w-64 bg-black/90 backdrop-blur-md rounded-xl shadow-xl py-2 z-10 border border-red-900/30 overflow-hidden"
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {categories.map((category, index) => (
                        <motion.button
                          key={category.name}
                          onClick={() => handleCategoryClick(category.query)}
                          className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-red-900/50 hover:text-white rounded-lg transition-colors"
                          whileHover={{ x: 5, backgroundColor: "rgba(153, 27, 27, 0.3)" }}
                          custom={index}
                          variants={{
                            hidden: { opacity: 0, x: -10 },
                            visible: (i) => ({
                              opacity: 1,
                              x: 0,
                              transition: { delay: i * 0.05 },
                            }),
                          }}
                        >
                          <span className="mr-2 text-lg">{category.icon}</span>
                          {category.name}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle Button (Mobile) */}
            <motion.button
              variants={itemVariants}
              className="md:hidden p-2 rounded-full hover:bg-red-900/30 text-gray-300 hover:text-red-500 transition-colors"
              onClick={() => setSearchOpen(!searchOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {searchOpen ? <FiX /> : <FiSearch />}
            </motion.button>

            {/* Search Form (Desktop) */}
            <motion.form onSubmit={handleSubmit} className="hidden md:flex relative" variants={itemVariants}>
              <input
                type="text"
                placeholder="Rechercher un film..."
                className="px-4 py-2 pr-10 rounded-full bg-black/50 text-white border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 w-56 transition-all focus:w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <motion.button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-red-500 hover:text-red-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSearch />
              </motion.button>
            </motion.form>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-red-900/30 transition-colors text-gray-300 hover:text-red-500"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              variants={itemVariants}
              whileHover={{
                scale: 1.2,
                rotate: 15,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              {darkMode ? <FiSun className="text-yellow-300 text-xl" /> : <FiMoon className="text-gray-300 text-xl" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search Form */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              onSubmit={handleSubmit}
              className="mt-3 relative md:hidden"
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <input
                type="text"
                placeholder="Rechercher un film..."
                className="w-full px-4 py-2 pr-10 rounded-full bg-black/50 text-white border border-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              <motion.button
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiSearch />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Mobile Categories */}
        <motion.div className="mt-3 md:hidden overflow-x-auto pb-2 -mx-4 px-4" variants={itemVariants}>
          <div className="flex space-x-2 w-max">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => handleCategoryClick(category.query)}
                className="flex items-center text-sm bg-black/50 border border-red-900/30 px-3 py-1 rounded-full text-gray-200 hover:bg-red-900 hover:text-white whitespace-nowrap"
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: { delay: i * 0.05 + 0.3 },
                  }),
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar
