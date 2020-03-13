const nodemailer  = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    port: 465,
    secure: true,
    auth: {
        user: '1915398623@qq.com',
        pass: 'svyeadahaxbybafj'
    }
});

// 参数：接收邮箱，标题，内容
function sendMail(data, call) {
    let mailOptions = {
        from: 'wsydxiangwang@qq.com',
        to: data.email,
        subject: data.title,
        html: data.content,
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            call(error)
        } else {
            call('Message sent')
        }
    });
    transporter.close(); // 如果没用，关闭连接池
}

module.exports = {
    sendMail
}