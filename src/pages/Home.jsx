"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import MovieCard from "../components/MovieCard"
import { FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { BiCameraMovie } from "react-icons/bi"

const Home = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [featuredCategories, setFeaturedCategories] = useState([
    { title: "Films populaires", query: "avengers" },
    { title: "Séries à découvrir", query: "stranger" },
    { title: "Science Fiction", query: "star wars" },
    { title: "Animation", query: "pixar" },
  ])
  const [activeCategory, setActiveCategory] = useState(0)

  const { search } = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(search)
  const query = searchParams.get("search") || featuredCategories[activeCategory].query

  // Update active category when search changes
  useEffect(() => {
    const currentQuery = searchParams.get("search")
    if (currentQuery) {
      const categoryIndex = featuredCategories.findIndex((cat) => cat.query === currentQuery)
      if (categoryIndex !== -1) {
        setActiveCategory(categoryIndex)
      }

      // Check if the query matches any of our genre categories
      const genreQueries = ["action", "comedy", "drama", "sci-fi", "horror", "animation", "adventure", "fantasy"]
      if (genreQueries.includes(currentQuery.toLowerCase())) {
        // Reset to page 1 when switching genres
        setCurrentPage(1)
      }
    }
  }, [search, featuredCategories])

  const movieTypes = [
    { id: "all", name: "Tous" },
    { id: "movie", name: "Films" },
    { id: "series", name: "Séries" },
    { id: "episode", name: "Épisodes" },
  ]

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true)
      try {
        const typeParam = activeType !== "all" ? `&type=${activeType}` : ""
        const res = await axios.get(
          `http://www.omdbapi.com/?s=${query}${typeParam}&page=${currentPage}&apikey=e20e14d9`,
        )
        setMovies(res.data.Search || [])
        setTotalResults(res.data.totalResults ? Number.parseInt(res.data.totalResults) : 0)
      } catch (err) {
        console.error("Erreur lors de la récupération des films", err)
        setMovies([])
        setTotalResults(0)
      }
      setLoading(false)
    }

    fetchMovies()
  }, [query, activeType, currentPage])

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalResults / 10)) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleCategoryChange = (index) => {
    setActiveCategory(index)
    setCurrentPage(1)
    navigate(`/?search=${featuredCategories[index].query}`)
  }

  // Get title based on search query
  const getPageTitle = () => {
    // Check if it's one of our featured categories
    const featuredCategory = featuredCategories.find((cat) => cat.query === query)
    if (featuredCategory) {
      return featuredCategory.title
    }

    // Check if it's a genre search from navbar
    const genreMap = {
      action: "Films d'Action",
      comedy: "Comédies",
      drama: "Drames",
      "sci-fi": "Science Fiction",
      horror: "Films d'Horreur",
      animation: "Films d'Animation",
      adventure: "Films d'Aventure",
      fantasy: "Films Fantastiques",
      trending: "Films Tendances",
      new: "Nouveaux Films",
    }

    if (genreMap[query.toLowerCase()]) {
      return genreMap[query.toLowerCase()]
    }

    // Default to search query
    return `Résultats pour: ${query}`
  }

  const totalPages = Math.ceil(totalResults / 10)
  const paginationRange = 5
  const startPage = Math.max(1, currentPage - Math.floor(paginationRange / 2))
  const endPage = Math.min(totalPages, startPage + paginationRange - 1)

  return (
    <motion.div
  initial="hidden"
  animate="visible"
  variants={containerVariants}
  className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 md:p-8 pt-26 md:pt-24" // Adjusted pt-24 for mobile and pt-28 for desktop
>
      {/* Featured Categories */}
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Catégories</h2>
        <div className="flex flex-wrap gap-3">
          {featuredCategories.map((category, index) => (
            <motion.button
              key={index}
              onClick={() => handleCategoryChange(index)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === index
                  ? "bg-gradient-to-r from-red-700 to-red-500 text-white"
                  : "bg-black/70 text-gray-300 hover:bg-red-900/50 border border-red-900/30"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.title}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Header with title and filter */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-3xl font-bold mb-4 md:mb-0">
            <span className="text-white">{getPageTitle()}:</span>{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-700 text-transparent bg-clip-text">
              {totalResults} résultats
            </span>
          </h2>

          <motion.div
            className="flex items-center bg-black/50 p-2 rounded-lg border border-red-900/30"
            whileHover={{ scale: 1.02 }}
          >
            <FiFilter className="text-red-500 mr-2" />
            <span className="text-gray-300 mr-3">Filtrer par:</span>
            <div className="flex space-x-2">
              {movieTypes.map((type) => (
                <motion.button
                  key={type.id}
                  onClick={() => {
                    setActiveType(type.id)
                    setCurrentPage(1)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    activeType === type.id
                      ? "bg-gradient-to-r from-red-700 to-red-500 text-white"
                      : "bg-black/70 text-gray-300 hover:bg-red-900/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading ? (
        <motion.div
          className="flex flex-col items-center justify-center mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-gray-300 mt-4 text-lg">Chargement des films...</p>
        </motion.div>
      ) : movies.length > 0 ? (
        <>
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {movies.map((movie, index) => (
              <motion.div
                key={movie.imdbID}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalResults > 10 && (
            <motion.div className="mt-12 flex justify-center items-center" variants={itemVariants}>
              <div className="flex items-center bg-black/50 p-2 rounded-lg border border-red-900/30">
                <motion.button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1 ? "text-gray-600 cursor-not-allowed" : "text-red-500 hover:bg-red-900/30"
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.1 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.9 } : {}}
                >
                  <FiChevronLeft className="w-5 h-5" />
                </motion.button>

                {startPage > 1 && (
                  <>
                    <motion.button
                      onClick={() => handlePageChange(1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      1
                    </motion.button>
                    {startPage > 2 && <span className="text-gray-500 mx-1">...</span>}
                  </>
                )}

                {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                  <motion.button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentPage === page
                        ? "bg-gradient-to-r from-red-700 to-red-500 text-white"
                        : "text-gray-300 hover:bg-red-900/30"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {page}
                  </motion.button>
                ))}

                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && <span className="text-gray-500 mx-1">...</span>}
                    <motion.button
                      onClick={() => handlePageChange(totalPages)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-red-900/30"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {totalPages}
                    </motion.button>
                  </>
                )}

                <motion.button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages ? "text-gray-600 cursor-not-allowed" : "text-red-500 hover:bg-red-900/30"
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.1 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.9 } : {}}
                >
                  <FiChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mt-20 text-center">
          <BiCameraMovie className="text-red-500 text-6xl mb-4" />
          <p className="text-xl text-red-500 font-medium">Aucun film trouvé pour cette recherche.</p>
          <p className="text-gray-400 mt-2 max-w-md">
            Essayez de modifier votre recherche ou de changer les filtres pour trouver des résultats.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Home
