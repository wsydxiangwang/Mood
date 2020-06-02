const nodemailer  = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    service: 'qq',
    port: 465,
    secure: true,
    auth: {
        user: '1915398623@qq.com',
        pass: 'svyeadahaxbybafj'
    }
});

function emailFn(item){
    const name = item.type === 1 ? item.data.reply_name : 'Libai';
    const data = {
        name: name,
        title: item.title,
        email: item.type === 1 ? item.data.reply_email : '1915398623@qq.com',
        content: `
            <center>
                <table style="max-width:800px;letter-spacing: 0.2px;">
                    <tbody>
                        <tr>
                            <td>
                                <div style="padding: 30px;color: #303030;border-radius: 8px;box-shadow: 0 0 10px #eee;padding: 1.5rem;">
                                    <h2 style="font-size: 16px;font-weight: 400;font-style: oblique;font-size:font-size: 1rem;">hi，${name}，你今天笑了么～</h2>
                                    <p style="text-indent: 2em;color:#303030;font-size: 0.9rem;line-height: 24px;">偷偷告诉你一件事，您在《<a href="${item.url}">${item.title}</a>》的心情中，收到一条新的回复啦，赶紧<a href="${item.url}">回来看看</a>是哪位神仙眼光这么好，竟然选到了世界上最棒的人～</p>
                                    <p style="text-align: right;margin-top: 40px;font-size:0.9rem">—— 白茶</p>
                                    <div style="background: #eff5fb;border-left: 4px solid #c2e1ff;padding: 14px;margin-top: 30px;border-radius: 9px;font-size: 0.85rem;color: #7d7f7f;line-height: 24px;">如果我们没有机会见面，那我在这儿提前预祝你早安、午安以及晚安<br>愿你所见皆彩虹，所遇皆良人，所求皆所愿，所盼皆所期<br>接受所有完美和不完美，永远相信美好的事情即将发生～～</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </center>
        `
    }
    // 发送邮件
    sendMail(data, (state) => {
        console.log(state)
    })
}

// 参数：接收邮箱，标题，内容
function sendMail(data, call) {
    let mailOptions = {
        from: '"你好，我是李白!" <wsydxiangwang@qq.com>',
        to: data.email,
        subject: data.title + ' | 白茶',
        html: data.content,
    };
    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            call(error)
        } else {
            call('Email sentd')
        }
    });
    transporter.close(); // 如果没用，关闭连接池
}

module.exports = emailFn