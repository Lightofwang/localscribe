# LocalScribe — 演示视频脚本（定稿，2026-11-20）

目标：公开的 YouTube 视频，3 分钟以内，英文旁白 + 烧录字幕
（和 GhostFeed 同样的做法：旁白由 AI 生成，本人不配音）。
旁白约 250 词，实测音频总长 87.7 秒；加上画面演示的停顿，
成片预计 2:00–2:30。

状态：定稿。应用已端到端跑通，本地与云端两条路径在 localhost 和
线上站（localscribe-1120.netlify.app）都验证过：绿色设备端徽章
（Gemini Nano 状态为 available）和 High-quality 模式下的蓝色云端
徽章。场景 3 按正文录即可；文末的 Nano 不可用备选文案不需要了。
旁白已于 2026-11-20 生成：6 个场景片段 + 完整版 narration-full.mp3
+ subtitles.srt，详见 narration-clips/CUT-GUIDE.md。

## 场景 1 — 开场钩子（0:00–0:18）

> "Last month, I noticed my browser had quietly downloaded a small AI model
> onto my laptop. I didn't ask for it. So I switched it off. That moment is
> why I built LocalScribe."

画面：LocalScribe 首页，主标语可见——"Paste sensitive text.
See exactly where it is processed."

说明：这个开场用的是作者本人的真实经历（Chrome 悄悄在本地启了
一个小模型，被他关掉了）。作者已于 2026-11-15 确认：保留这个开场。

## 场景 2 — 问题（0:18–0:40）

> "Every day we paste contracts, resumes, and emails into AI tools — and we
> have no idea where the words go. LocalScribe answers one question, on
> every single result: was this processed on your device, or in the cloud?"

画面：四个动作按钮——Summarize、Key points、Translate、Polish——
和引擎徽章区域。

## 场景 3 — 本地演示（0:40–1:15）

> "Here's a contract. I paste it in, hit Summarize — and look at the badge.
> Green: processed on this device by Gemini Nano. The text never left the
> browser. LocalScribe runs on Firebase AI Logic, which tries the on-device
> model first."

画面：点 "Try the sample contract"（Acme Ltd / Beta Studio，$12,000，
45 天，签约付 50%），点 Summarize，停留在绿色徽章及其说明上：
"Processed on this device by Gemini Nano. Your text did not leave
this browser."

## 场景 4 — 四个动作、无对话（1:15–1:45）

> "Same idea, four jobs: summarize, key points, translate, polish. Each one
> is a single request — that's all the on-device model supports, so there's
> no chat history being built up anywhere. History lives only in this
> browser, and one click clears it."

画面：对同一份合同点 Key points，再 Translate 译成中文；
滚到 History，点 Clear。

## 场景 5 — 云端回退、绝不沉默（1:45–2:15）

> "Sometimes the cloud is the right call — a long document, or you want the
> best quality. So there's a High-quality mode. Turn it on, and the badge
> turns blue and tells you why: processed in the cloud, because you chose
> it. Cloud fallback is never silent here. If the local model can't handle
> a request, the badge says so."

画面：勾上 High-quality mode，再点一次 Summarize，停留在蓝色徽章上：
"Processed in the cloud (Gemini) — you chose High-quality mode."

## 场景 6 — 收尾（2:15–2:30）

> "LocalScribe: paste sensitive text, see exactly where it is processed.
> Built with Firebase AI Logic — on-device Gemini Nano first, Gemini in the
> cloud when you say so."

画面：LocalScribe 首页 + 两个链接：localscribe-1120.netlify.app
和 github.com/Lightofwang/localscribe。

## 制作注意事项（来自 GhostFeed 视频的教训，2026-11-11）

- 烧录字幕放在画面下三分之一，避开应用的顶部标题和引擎徽章
  ——GhostFeed 的字幕曾在 0:30 / 0:48 / 1:25 / 1:36 / 2:00 和画面
  标题重叠。
- 导出前检查字幕里 "Gemini Nano" 和 "Firebase AI Logic" 的拼写
  （GhostFeed 的字幕曾在 2:00 把 "Kiro" 写成 "Kira"）。
- 旁白片段按场景分段生成（同 GhostFeed 的片段 + 剪辑指南做法）；
  每段先听一遍，确认内容和场景对得上再剪。
- 视频链接在 2026-12-01 06:00 CST 截止前随时可在 Devpost 上更换。

## 备选文案（场景 3，仅当 Nano 不可用时——本次不需要）

> "Here's a contract. I paste it in, hit Summarize — and the badge tells
> me the truth: this browser has no local model, so the request went to the
> cloud, and the badge says why. LocalScribe never pretends a cloud answer
> came from your device."

画面：带回退说明的蓝色徽章。脚本其余部分不变——产品的承诺就是
那块看得见的徽章，无论哪条路径处理请求。
