# 本人OAuth连接与原生接入管理

执行规格：`apps/server/tests/businessMcpFullsiteNative.test.ts`。本章的认证、动态注册和待连接创建使用网站原协议。BOSS管理列表、改名、改授权、撤销及删除可使用实时发现的 supported 原站管理操作；仍保留原权限和对象范围。当前具体用户授权继续有效；凭证删除、撤销保留明确对象授权。

1. 用户在 MCP 客户端发起 OAuth，随后由用户本人在原网站登录界面输入凭据并核对公司。Agent 不得索要、读取或手工提交登录密码、网站 JWT、浏览器 Cookie 或令牌；不手工 POST 登录接口代替连接器认证。错误登录及 Demo 禁止正式 OAuth 的原网站门禁继续生效，打开登录页不等于已连接。
2. 原 MCP 客户端负责动态注册、回调、PKCE S256、授权码兑换和令牌续期。用户在网站同意页核对实际 clientId/clientName/redirectHost/scopes 后允许或拒绝；业务 Agent 不手工提取 code_verifier、授权码或 token。只有原连接器完成 OAuth 并由 SDK 成功连接 `/api/mcp` 才是连接成功；拒绝不发业务 grant，授权请求按原网站只能消费一次。
3. 网站管理客户端 `POST /api/mcp-consent/clients`，body `{name,redirectUri,requestId:<UUID>}`，仅HTTPS或本机回调。保持同一requestId/相同内容重试，回读 `GET .../clients` 的本人配置；配置本身不发token，不把凭证id当clientId。
4. 新建本人待连接凭证 `POST /api/mcp-consent/connections`，body `{name,requestId:<UUID>}`。保持同一请求编号，核对 pending/active:false；只有原OAuth授权完成后才可使用。`GET .../connections` 只返回本人管理连接，不展示认证密钥。
5. 已明确授权本人凭证撤销时 `POST .../connections/<id>/revoke`，回读active:false/revokedAt；明确删除时 `DELETE .../connections/<id>`，回读列表不再包含对象。删除保留历史业务审计，不能报告历史业务已删除。他人对象404，不能借平台管理员身份绕过本人范围。

`/api/health` 的 status:ok 仅证明此路由响应，不证明数据库、生产或真实业务流程。MCP使用无会话Streamable HTTP POST；有效OAuth访问GET405是协议边界，未认证请求先被401拒绝。无OAuth/无效token401不能计为业务成功。业务权限始终由真实网站链核验，网络未知则查原回执。没有用户具体发送授权时，不把连接、公开链接或配置发给第三方。

## 已废弃的手工MCP密钥入口

POST /api/system/mcp-clients 与 POST /api/system/mcp-clients/:id/rotate 已废弃，BOSS原网站入口返回410；无登录和非BOSS仍按原门禁拒绝。它们不能作为普通MCP业务工具创建或轮换密钥，也不能把410当作连接成功。

从Agent发起原OAuth注册/授权与PKCE，使用本人网页登录并明确同意连接。需要重连时重新发起OAuth。不要恢复手工密钥、猜测凭证、复制其他用户授权或在文档保存Token。

## 微信、企微与忘记密码原生边界

执行规格：`businessMcpFullsiteNativeAuth.test.ts` 和 `businessMcpFullsiteNotifications.test.ts`。这些认证入口走原 HTTP、回调/HTML 或轮询协议，不伪装成普通 MCP 业务操作。

- 微信小程序 `/api/auth/wechat/login`、本人 bind、web-login-session/confirm 和网站 website-oauth-url，企微 `/api/auth/wecom/login` 均需真实供应商配置和授权 code。缺配置原 503 SERVICE_UNAVAILABLE；空 code 400。不能提供合成 identity、消费会话或登录 JWT 冒充成功。
- 原本地未消费 challenge 轮询可返回 pending/expired/revoked；它们不是已登录。无效 scene 400，过期确认 410，已撤销确认 409；缺真实配置确认 503 时仍不消费场景。隔离测试使用原本地 issuer、关闭二维码生成，仅作 pending fixture。
- 微信网站回调无效 state 保留原 HTML 200 的失败 payload，Alibaba 无效 state 保留原 302 到本人个人设置错误页；HTTP 200/302 不是授权成功。正式运行时 `/api/auth/demo/personas` 和 `/api/auth/demo/login` 原 403，不能借 Demo 取得正式访问。
- `/api/auth/forgot-password` 原 `{username}` 请求不直接重置密码。缺值 400、未知用户 404；已知用户 200 仍须读取安全 notification 结果。关闭事件为 skipped/event_disabled，“提醒未发送，请联系管理员重置密码”；saved 只表示记录、sent 只表示渠道接受。不能据 200 声称已通知管理员、已重置或已登录，不能报告或改变原密码。
