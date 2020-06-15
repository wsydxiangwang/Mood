const nodemailer  = require("nodemailer");

/**
 * @param {Object} data 邮箱发送数据
 * @param {Object} adminObj 管理员信息
 */
const emailFn = (infoObj, adminObj) => {
    const data = {
        name: infoObj.name,
        title: infoObj.title,
        email: infoObj.email,
        content: `
            <center>
                <table style="max-width:800px;letter-spacing: 0.2px;">
                    <tbody>
                        <tr>
                            <td>
                                <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                    <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，${infoObj.name}，你今天笑了么～</h2>
                                    <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">偷偷告诉你一件事，您在《<a href="${infoObj.url}">${infoObj.title}</a>》的心情中，收到一条新的回复啦，赶紧<a href="${infoObj.url}">回来看看</a>是哪位神仙眼光这么好，竟然选到了世界上最棒的人～</p>
                                    <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— ${adminObj.website_name}</p>
                                    <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安～～<br>愿所有的美好如约而至，愿所有的黑暗都能看到希望，我们微笑前行～～<br>人生没有完美，也许有些遗憾才美～～永远相信美好的事情即将发生～～</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </center>
        `
    }
    const transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',
        service: 'qq',
        port: 465,
        secure: true,
        auth: {
            user: adminObj.email,
            pass: adminObj.email_pass
        }
    });

    // 发送邮件
    sendMail(data, adminObj, transporter, (state) => {
        console.log(state)
    })
}

/**
 * 
 * @param {Object} data 邮箱发送数据
 * @param {Object} adminObj 管理员信息
 * @param {Object} transporter 邮件发送方法
 * @param {Function} call CallBack 
 */
const sendMail = (data, adminObj, transporter, call) => {
    const mailOptions = {
        from: `"你好，我是${adminObj.email_name}!" <${adminObj.email}>`,
        to: data.email,
        subject: data.title + ' | ' + adminObj.website_name,
        html: data.content,
    };
    transporter.sendMail(mailOptions, (error, response) => error ? call(error) : call('Email sentd'));
    transporter.close(); // 关闭连接池
}

module.exports = emailFn