const Message = require('./EmailMessage')

// 邮件通知
const nodemailer = require('nodemailer');
/**
 * 
 * @param {Number} type 1=>订阅验证 2=>订阅通知 3=>评论通知 4=>忘记密码
 * @param {Object} data 基本信息
 * @param {Object} email 邮箱和网站信息
 * 
 * 扩展只需添加mode对应值,并且在setting添加对应值
 */
function Email({ type, adminInfo, info, callback }) {
	return new Promise((resolve, reject) => {
		const mode = {
			'QQ': 'smtp.qq.com',
			'163': 'smtp.163.com',
		}
		const transporter = nodemailer.createTransport({
			host: mode[adminInfo.base.email_type],
			port: 465,
			secure: true,
			auth: {
				user: adminInfo.administrator.email,
				pass: adminInfo.base.email_pass
			}
		})
		// 读取发送邮件信息
		const msg = Message({ type, adminInfo, url: 'https://xx' })

		transporter.sendMail(msg, (err, res) => {
			console.log('邮件发送结果', err, res)
			if (err) {
				const message = {
					550: '发送失败，邮箱未找到或拒绝访问！',
					535: '发送失败，管理员信息出错，请联系站长！',
					404: '发生未知错误，请联系站长！'
				}
				reject(message[err.responseCode] || message[404])
			} else {
				if (type == 'Forgot Password') {
					resolve('邮件发送成功，请进入邮箱重置密码！')
				} else {
					resolve(res)
				}
				// if (type === 1) {
				// 	callback(1, res.accepted[0] + '，发送邮件成功，请到邮箱内进行激活！！')
				// } else {
				// 	callback(1, res)
				// }
			}
		})
		transporter.close() // 关闭连接池
	})
	console.log('--------')
	console.log(type, adminInfo, info)
}

module.exports = Email
