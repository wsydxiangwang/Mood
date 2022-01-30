module.exports = (app, plugin, model) => {
	const express = require('express')
	const router = express.Router()

	let { Myself } = model
	let { RequestResult } = plugin

	router.post('/myself', (req, res) => {
		if (req.body._id) {
			Myself.findByIdAndUpdate(
				req.body._id,
				req.body,
				(err, doc) => {
					res.send(RequestResult(err, doc))
				})
		} else {
			Myself.create(req.body, (err, doc) => {
				res.send(RequestResult(err, doc))
			})
		}
	})

	router.get('/myself', (req, res) => {
		Myself.findOne((err, doc) => {
			if (doc) {
				res.send(RequestResult({
					status: 'success',
					data: doc
				}))
			} else {
				res.send(RequestResult({
					status: 'error',
					data: err
				}))
			}
		})
	})

	app.use('/admin/api', router)
}