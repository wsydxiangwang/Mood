// 邮件通知
const nodemailer = require('nodemailer');
/**
 * 
 * @param {Number} type 1=>订阅验证 2=>订阅通知 3=>评论通知
 * @param {Object} data 基本信息
 * @param {Object} email 邮箱和网站信息
 * 
 * 扩展只需添加mode对应值,并且在setting添加对应值
 */
function email(type, data, email){    
    const mode = {
        'QQ': 'smtp.qq.com',
        '163': 'smtp.163.com',
    }

    const transporter = nodemailer.createTransport({
            host: mode[email.mode],
            port: 465,
            secure: true,
            auth: {
                user: email.address,
                pass: email.pass
            }
        })

    const options = [
        {
            from: `${email.web_name} <${email.address}>`, 
            to: data.email,
            subject: `心情小镇发来邮箱订阅的验证~~`,
            html: `
                <center>
                    <table style="max-width:800px;letter-spacing: 0.2px;">
                        <tbody>
                            <tr>
                                <td>
                                    <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                        <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，陌生人，你今天笑了么～</h2>
                                        <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">感谢您百忙之中，关注白茶的心情小镇，茫茫人海之中，莫大的缘分才使得你我的相遇~~<a href="${data.url}">点我进行验证(24小时内有效)</a>~~美好的一天加油~~</p>
                                        <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— ${email.web_name}</p>
                                        <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安～～<br>愿所有的美好如约而至，愿所有的黑暗都能看到希望，我们微笑前行～～<br>人生没有完美，也许有些遗憾才美～～永远相信美好的事情即将发生～～</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            `
        },
        {
            from: `${email.web_name} <${email.address}>`, 
            to: data.email,
            subject: '发布了新的文章，快来看一看啦~',
            html: `
                <center>
                    <table style="max-width:800px;letter-spacing: 0.2px;">
                        <tbody>
                            <tr>
                                <td>
                                    <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                        <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，陌生人，你今天笑了么～</h2>
                                        <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">白茶的心情小镇，给你带来一刻美好的消息，新的心情文章已经发布了，快点来看一看啦《<a href="${data.url}">${data.title}</a>》，希望你喜欢，期待你的评论哦~~美好的一天加油~~</p>
                                        <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— ${email.web_name}</p>
                                        <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安～～<br>愿所有的美好如约而至，愿所有的黑暗都能看到希望，我们微笑前行～～<br>人生没有完美，也许有些遗憾才美～～永远相信美好的事情即将发生～～</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            `
        },
        {
            from: `${email.web_name} <${email.address}>`, 
            to: data.email,
            subject: data.title + ' | ' + email.web_name,
            html: `
                <center>
                    <table style="max-width:800px;letter-spacing: 0.2px;">
                        <tbody>
                            <tr>
                                <td>
                                    <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                        <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，${data.name}，你今天笑了么～</h2>
                                        <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">偷偷告诉你一件事，您在《<a href="${data.url}">${data.title}</a>》的心情中，收到一条新的回复啦，赶紧<a href="${data.url}">回来看看</a>是哪位神仙眼光这么好，竟然选到了世界上最棒的人～</p>
                                        <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— ${email.web_name}</p>
                                        <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安～～<br>愿所有的美好如约而至，愿所有的黑暗都能看到希望，我们微笑前行～～<br>人生没有完美，也许有些遗憾才美～～永远相信美好的事情即将发生～～</div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </center>
            `
        }
    ]    
    
    transporter.sendMail(options[type-1], (err, res) => err ? console.log(err) : console.log('Message sent: ' + res.response))
    transporter.close(); // 关闭连接池
}
module.exports = email
