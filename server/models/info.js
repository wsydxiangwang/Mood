// 信息
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
	base: {
		adminAvatar: {
			type: String,
			default: '/assets/admin-avatar.jpg'
		},
		adminName: {
			type: String,
			default: '一个名字'
		},
		websiteName: {
			type: String,
			default: '一个网站'
		},
		websiteAddress: {
			type: String,
			default: 'https://xxx.com'
		},
		websiteDescribe: String,
		seo: String,
		fileUploadType: {
			type: String,
			default: '服务器'
		},
		emailType: String,
		emailPass: String
	},

	website: {
		email: String,
		name: {
			type: String,
			default: '站长的名字'
		},
		mark: {
			type: String,
			default: '我是站长'
		},
		verificationCode: {
			type: String,
			default: 'admin123123'
		},
		comment: {
			type: Boolean,
			default: false
		},
		message: {
			type: Boolean,
			default: false
		},
		subscribe: {
			type: Boolean,
			default: false
		}
	},

	bgMusic: {
		mood: String,
		letter: String,
		subscribe: String,
		message: String,
		about: String
	},

	other: {
		icpNumber: String,
		icpLink: String
	},

	cover: {
		date: String,
		title: String,
		link: String,
		color: {
			type: String,
			default: 'rgb(147, 48, 14, 0.6)'
		},
		image: {
			type: String,
			default: '/assets/cover.jpg'
		},
		describe: String
	},

	ossAliyun: {
		bucket: String,
		region: String,
		accessKeySecret: String,
		accessKeyId: String,
		domain: String
	}
})

module.exports = mongoose.model('Info', schema)