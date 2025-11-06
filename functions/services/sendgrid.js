import { ENV } from "../config/env.js";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(ENV.SENDGRID_API_KEY);

export const sendGrid = async (to, keywords, posts) => {
  const msg = {
    to: to,
    from: "hanaldual@wizley.io",
    subject: "[한알두알] 새로운 공지사항이 도착했어요!",
    text: getEmailText(keywords, posts),
    html: getEmailHtml(keywords, posts),
  };

  await sgMail.send(msg);
};

const getEmailText = (keywords, posts) => {
  return `----------------
    새로운 공지사항이 도착했어요!
    ----------------

    ${posts
      .map(
        (post) => `${post.title} / ${post.author} (${post.link})
        ${post.content}`
      )
      .join("\n")}
    —

    [${keywords
      .map((keyword) => `"${keyword}"`)
      .join(", ")}] 해당 키워드를 구독하셨기 때문에 이 메일을 받으셨습니다.

    수신 설정(https://hanaldual.wizley.io)
    개발자 Wizley`;
};

const getEmailHtml = (keywords, posts) => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>[한알두알] 새로운 공지사항이 도착했어요!</title>
      </head>

      <body style="margin:0; padding:0; background-color:#ffffff; font-family:Arial, sans-serif; color:#24292E;">
        <div style="width:100%; max-width:600px; margin:0 auto; background-color:#ffffff;">
          <div style="padding:16px;">
            <img
              src="https://hanaldual.wizley.io/icon192.png"
              alt="hanaldual"
              width="32"
              height="32"
              style="display:block;"
            />

            <h2 style="margin-top:8px; font-size:24px; color:#24292E;">
              새로운 공지사항이 도착했어요!
            </h2>

            <div style="margin-top:12px; border:1px solid #e1e4e8; border-radius:6px; overflow:hidden;">
              ${posts
                .map(
                  (
                    post
                  ) => `<div style="padding:16px 24px; border-bottom:1px solid #e1e4e8;">
                    <a
                      href="${post.link}"
                      target="_blank"
                      style="text-decoration:none; color:#24292E; font-size:14px; font-weight:600;"
                    >
                      <span>${post.title}</span>
                      <span style="font-weight:400;"> / ${post.author}</span>
                    </a>
                    <p style="font-size:14px; color:#24292E; margin-top:8px; line-height:1.5;">
                      ${post.content}
                    </p>
                  </div>`
                )
                .join("")}
            </div>

            <div style="padding-top:48px; text-align:center; font-size:13px; color:#666666;">
              <span style="display:block; margin-bottom:8px;">—</span>

              <p style="margin:0 0 8px 0;">
                [${keywords.join(
                  ", "
                )}] 해당 키워드를 구독하셨기 때문에 이 메일을 받으셨습니다.
              </p>

              <a
                href="https://hanaldual.wizley.io"
                target="_blank"
                style="color:#3b82f6; text-decoration:none;"
              >
                수신 설정
              </a>

              <p style="margin-top:16px;">개발자 Wizley</p>
            </div>
          </div>
        </div>
      </body>
    </html>`;
};
