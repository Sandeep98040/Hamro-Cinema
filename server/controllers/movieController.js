const Movie = require('../models/Movie')
const Showtime = require('../models/Showtime')


exports.getMovies = async (req, res, next) => {
	try {
		const movies = await Movie.find().sort({ createdAt: -1 })
		res.status(200).json({ success: true, count: movies.length, data: movies })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}

exports.getShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}
exports.getUnreleasedShowingMovies = async (req, res, next) => {
	try {
		const showingShowtime = await Showtime.aggregate([
			{ $match: { showtime: { $gte: new Date() }, isRelease: true } },
			{
				$lookup: {
					from: 'movies', // Replace "movies" with the actual collection name of your movies
					localField: 'movie',
					foreignField: '_id',
					as: 'movie'
				}
			},
			{
				$group: {
					_id: '$movie',
					count: { $sum: 1 }
				}
			},
			{
				$unwind: '$_id'
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: ['$$ROOT', '$_id']
					}
				}
			},
			{
				$sort: { count: -1, updatedAt: -1 }
			}
		])

		res.status(200).json({ success: true, data: showingShowtime })
	} catch (err) {
		console.log(err)
		res.status(400).json({ success: false, message: err })
	}
}


exports.getMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}


exports.createMovie = async (req, res, next) => {
	try {
		const movie = await Movie.create(req.body)
		res.status(201).json({
			success: true,
			data: movie
		})
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}


exports.updateMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		})

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}
		res.status(200).json({ success: true, data: movie })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}


exports.deleteMovie = async (req, res, next) => {
	try {
		const movie = await Movie.findById(req.params.id)

		if (!movie) {
			return res.status(400).json({ success: false, message: `Movie not found with id of ${req.params.id}` })
		}

		await movie.deleteOne()
		res.status(200).json({ success: true })
	} catch (err) {
		res.status(400).json({ success: false, message: err })
	}
}
