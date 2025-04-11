"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiStar, FiClock, FiFilm } from "react-icons/fi"

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Placeholder rating since the Search API doesn't return ratings
  const rating = movie.imdbRating || "7.5"

  // Placeholder description since the Search API doesn't return plot
  const description = movie.Plot || "Cliquez pour voir plus de détails sur ce film."

  return (
    <motion.div
      className="relative rounded-lg overflow-hidden shadow-lg h-96 bg-black/40 border border-gray-800"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/movie/${movie.imdbID}`} className="block h-full">
        {/* Poster Image */}
        <div className="h-full w-full relative">
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
            alt={movie.Title}
            className="w-full h-full object-cover transition-all duration-500"
            style={{
              filter: isHovered ? "brightness(0.2) blur(2px)" : "brightness(0.8)",
            }}
          />

          {/* Movie Type Badge */}
          <div className="absolute top-3 right-3 bg-red-600/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {movie.Type === "movie" ? "Film" : movie.Type === "series" ? "Série" : "Épisode"}
          </div>

          {/* Content that shows on hover */}
          <motion.div
            className="absolute inset-0 p-4 flex flex-col justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <motion.h3
                className="text-xl font-bold text-white mb-2"
                initial={{ y: -20 }}
                animate={{ y: isHovered ? 0 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {movie.Title}
              </motion.h3>

              <motion.p
                className="text-gray-300 text-sm line-clamp-3 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col space-y-2"
              initial={{ y: 20 }}
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center text-sm text-gray-300">
                <FiClock className="mr-2 text-red-500" />
                <span>Année: {movie.Year}</span>
              </div>

              <div className="flex items-center text-sm text-gray-300">
                <FiStar className="mr-2 text-yellow-500" />
                <span>Note: {rating}/10</span>
              </div>

              <div className="flex items-center text-sm text-gray-300">
                <FiFilm className="mr-2 text-red-500" />
                <span>Type: {movie.Type === "movie" ? "Film" : movie.Type === "series" ? "Série" : "Épisode"}</span>
              </div>

              <motion.div
                className="mt-2 bg-gradient-to-r from-red-700 to-red-500 text-white text-center py-2 rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir les détails
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

export default MovieCard
