import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import axios from "axios"
import {
  FiClock,
  FiCalendar,
  FiAward,
  FiUsers,
  FiStar,
  FiArrowLeft,
  FiFilm,
  FiTag,
  FiMessageCircle,
} from "react-icons/fi"

const MovieDetail = () => {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=e20e14d9`)
        setMovie(res.data)
      } catch (err) {
        console.error("Erreur lors de la récupération des détails", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovie()
  }, [id])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <p className="text-gray-300 mt-4 text-lg">Chargement des détails...</p>
        </motion.div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 font-bold mb-4">Film non trouvé</h2>
          <p className="text-gray-300 mb-6">Impossible de trouver les détails de ce film.</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-md"
          >
            <FiArrowLeft className="mr-2" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // Parse ratings for display
  const ratings = movie.Ratings || []
  const imdbRating = movie.imdbRating !== "N/A" ? Number.parseFloat(movie.imdbRating) : null
  const imdbVotes = movie.imdbVotes !== "N/A" ? movie.imdbVotes : "Non disponible"

  // Calculate rating color
  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-500"
    if (rating >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  // Format genres as array
  const genres = movie.Genre ? movie.Genre.split(", ") : []

  return (
    <motion.div
  initial="hidden"
  animate="visible"
  variants={containerVariants}
  className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 md:p-8 pt-26 md:pt-28" // Adjusted pt-24 for mobile and pt-28 for desktop
>
      {/* Back button */}
      <motion.div variants={itemVariants} className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-300 hover:text-red-500 transition-colors">
          <FiArrowLeft className="mr-2" /> Retour aux résultats
        </Link>
      </motion.div>

      {/* Movie header */}
      <motion.div variants={itemVariants} className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"})`,
            filter: "blur(8px) brightness(0.4)",
          }}
        />
        <div className="absolute inset-0 flex items-end z-20 p-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
            <motion.img
              src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
              alt={movie.Title}
              className="w-32 md:w-48 rounded-lg shadow-2xl border-2 border-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            />
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{movie.Title}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-3">
                  {movie.Year !== "N/A" && (
                    <div className="flex items-center">
                      <FiCalendar className="mr-1 text-red-500" />
                      {movie.Year}
                    </div>
                  )}
                  {movie.Runtime !== "N/A" && (
                    <div className="flex items-center">
                      <FiClock className="mr-1 text-red-500" />
                      {movie.Runtime}
                    </div>
                  )}
                  {movie.Rated !== "N/A" && (
                    <div className="px-2 py-1 bg-red-900/50 rounded-md text-xs">{movie.Rated}</div>
                  )}
                  {imdbRating && (
                    <div className="flex items-center">
                      <FiStar className="mr-1 text-yellow-500" />
                      <span className={getRatingColor(imdbRating)}>{imdbRating}/10</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-black/50 border border-red-900/30 rounded-full text-xs text-gray-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <div className="bg-black/30 border border-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <FiMessageCircle className="mr-2 text-red-500" />
              Synopsis
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {movie.Plot !== "N/A" ? movie.Plot : "Aucun synopsis disponible."}
            </p>
          </div>

          <div className="bg-black/30 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <FiUsers className="mr-2 text-red-500" />
              Distribution
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {movie.Director !== "N/A" && (
                <div>
                  <h3 className="text-red-400 text-sm mb-2">Réalisateur</h3>
                  <p className="text-white">{movie.Director}</p>
                </div>
              )}
              {movie.Writer !== "N/A" && (
                <div>
                  <h3 className="text-red-400 text-sm mb-2">Scénariste</h3>
                  <p className="text-white">{movie.Writer}</p>
                </div>
              )}
              {movie.Actors !== "N/A" && (
                <div className="md:col-span-2">
                  <h3 className="text-red-400 text-sm mb-2">Acteurs</h3>
                  <p className="text-white">{movie.Actors}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Ratings card */}
          <div className="bg-black/30 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <FiStar className="mr-2 text-red-500" />
              Notes
            </h2>
            <div className="space-y-4">
              {imdbRating && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">IMDb</span>
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-yellow-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${imdbRating * 10}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </div>
                    <span className={`font-bold ${getRatingColor(imdbRating)}`}>{imdbRating}</span>
                  </div>
                </div>
              )}
              {ratings.map((rating, index) => {
                if (rating.Source === "Internet Movie Database") return null
                return (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">
                      {rating.Source === "Rotten Tomatoes" ? "Rotten Tomatoes" : rating.Source}
                    </span>
                    <span className="font-bold text-white">{rating.Value}</span>
                  </div>
                )
              })}
              <div className="pt-2 text-xs text-gray-500 text-right">{imdbVotes !== "N/A" && `${imdbVotes} votes`}</div>
            </div>
          </div>

          {/* Details card */}
          <div className="bg-black/30 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center">
              <FiTag className="mr-2 text-red-500" />
              Détails
            </h2>
            <ul className="space-y-3">
              {movie.Released !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Date de sortie</span>
                  <span className="text-white">{movie.Released}</span>
                </li>
              )}
              {movie.Country !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Pays</span>
                  <span className="text-white">{movie.Country}</span>
                </li>
              )}
              {movie.Language !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Langue</span>
                  <span className="text-white">{movie.Language}</span>
                </li>
              )}
              {movie.BoxOffice !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Box Office</span>
                  <span className="text-white">{movie.BoxOffice}</span>
                </li>
              )}
              {movie.Production !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Production</span>
                  <span className="text-white">{movie.Production}</span>
                </li>
              )}
              {movie.Type !== "N/A" && (
                <li className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-white capitalize">{movie.Type}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Awards card */}
          {movie.Awards !== "N/A" && (
            <div className="bg-black/30 border border-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center">
                <FiAward className="mr-2 text-red-500" />
                Récompenses
              </h2>
              <p className="text-gray-300">{movie.Awards}</p>
            </div>
          )}

          {/* Watch button */}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MovieDetail
