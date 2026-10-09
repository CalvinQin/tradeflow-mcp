# 企业微信、机器人、客服与员工绑定的真实操作配方

本章使用网站原接口与同一权限。参数先从实时合同确认；渠道 key、员工 userId 先查后用。保存配置、长连接认证、CLI 办公授权、员工绑定、回调验证和消息送达是不同结果，逐项回读，不合并说成“全部连接好了”。

## 平台管理员保存企业微信应用

1. 用 `get_system_wecom` 读取 `config`。老板或网站授予平台管理权限的在职业务员可管理；普通业务员、会计与社媒角色不能因为接入 MCP 就自动管理系统。
2. `put_system_wecom` body 字段为 `enabled`、`corpId`、`agentId`、`miniProgramAppId`、`secret`、`clearSecret`。企业 ID、应用 AgentID、小程序 AppID 必须来自企业后台，不能猜。AgentID 是正整数字符串；小程序 AppID 使用真实 wx 开头值。
3. 新 Secret 由用户通过安全输入提供。`secret: ""` 保留原值；`clearSecret: true` 清除并停用。不要把显示用的星号提交成 Secret。用户授权改配置后准备同一请求的票据并保存。
4. 再读 `config.enabled`、`configured`、`secretConfigured`、`messageReady`、`boundUsers`，准确告诉用户已保存什么。密钥不回读、不出现在聊天或报告。
5. `post_system_wecom_test` 才测试实际企业应用。缺配置、可信 IP、失效凭据或供应商不可用时按原错误处理，不用“保存成功”代替测试结果。

企微加入二维码：读 `get_system_wecom_join`；更新 `post_system_wecom_join` body `{qrCodeUrl}`。只使用真实站内允许路径或 HTTPS 二维码 URL，不把普通网页伪装成二维码。回读 `qrCodeUrl`，与实际网站展示核对。

## 平台管理员管理多个机器人

`get_system_wecom_bots` 返回管理模式、默认 key、最多渠道数和 `channels`；`get_system_wecom_bot` 是默认智能机器人的兼容配置入口。

新建 `post_system_wecom_bots`：

```json
{
  "name": "售后助手",
  "type": "SMART_BOT",
  "botId": "企业微信后台的真实机器人ID",
  "secret": "通过安全输入提供的新密钥",
  "enabled": false,
  "description": "处理售后查询"
}
```

返回 `channelKey` 后，回读 channels 的名称、类型、configured、enabled、activeInMode、runtime。`configured` 只表示必要字段齐全，`runtime.connected` 和认证状态才表示长连接真正可用。

- 修改：`put_system_wecom_bots_by_key`，params `{key}`，body 为用户授权修改的名称、描述、botId、secret、clearSecret、enabled。空 Secret 保留，clearSecret 会停用。
- 默认：`put_system_wecom_bots_by_key_default` params `{key}`。默认只能是 SMART_BOT。切换后回读 defaultBotKey；默认助手不能直接删除。
- 模式：`put_system_wecom_bots_mode` body `{mode:"SINGLE"}` 或 MULTIPLE。SINGLE 仅默认智能机器人连接，MULTIPLE 按各渠道启用状态连接。当前网站会把未知 mode 归一为 SINGLE，因此只发送两个支持值并回读最终 mode。
- 删除：准备 `delete_system_wecom_bots_by_key` 同载荷票据，删除后查 channels；先改默认再删原默认，不能为绕过拒绝更换请求 ID。
- 兼容编辑：`put_system_wecom_bot` 只编辑当前默认机器人；它不创建第二个机器人。
- 重连：默认 `post_system_wecom_bot_reconnect`，指定渠道 `post_system_wecom_bots_by_key_reconnect`。停用渠道重连可能 HTTP 200 且 runtime.state=disabled，这只是保持停用，不是认证成功。读回具体渠道 runtime。

启用和重连会产生真实外部连接，沿用用户本次明确授权。已有配置不能为了测试而覆盖，更不能把测试机器人密钥写进生产。

## 微信客服账号、人工接待与模型

新建同一渠道操作，type 改为 CUSTOMER_SERVICE，填写真实 `openKfId`。可配置 `automaticReplyEnabled`、`humanHandoffEnabled`、`humanServicerUserId`、`aiProvider`、`aiModel`、`welcomeMessage`。修改仍用 `put_system_wecom_bots_by_key`。

自动回复使用实际选择的模型和真实费用；手动开启前核对用户任务、模型配置和费用授权。客户要求人工、材料不足或附件无法自动处理时沿用网站转接机制，不假装已经指定人工接待员。

`post_system_wecom_bots_by_key_test_customer_service` 测试客服账号确实授权给当前企业应用；`post_system_wecom_bots_by_key_customer_service_entry` 获取官方客户入口。入口必须来自成功返回的官方 HTTPS URL，不自行拼接。客服复用企业主应用和已验证回调；只保存 openKfId 不代表获得客服 API 权限。

## CLI 办公授权与机器人导入

先 `get_system_wecom_cli` 读 installed、authorized、creationState、capability、linkedManagedBotKey。CLI 授权和机器人长连接不是同一权限。

- `post_system_wecom_cli_authorize` 启动官方扫码授权；用户本人完成扫码，Agent 等实际 authorized 回读，不代用户登录。
- `post_system_wecom_cli_test` 核对真正支持的办公能力，checks 未通过不承诺可用。
- `post_system_wecom_cli_import` body `{name}` 将已获官方 CLI 凭据的机器人导入管理列表；先取实际已授权状态，缺密钥或尚未授权就停止。它不会凭一个名称生成可用机器人。
- `post_system_wecom_bots_by_key_connect_cli` 将已有 SMART_BOT 配置连接到官方 CLI，先核对 Bot ID 与安全保存的 Secret；客服渠道不能使用此入口。

不能读取服务器私有 CLI 文件或用另一个员工的授权替代当前连接。操作返回 UNKNOWN 时先查询原 operationId 和配置，不重复启动新的授权或导入。

## 员工绑定、状态查询与解绑

本人 `get_auth_wecom_binding` 和 `get_auth_wechat_binding`；平台管理员 `get_system_wecom_bindings` 查询员工列表。其他员工的身份并不能通过本人接口指定 userId 读取。

`post_auth_wecom_bind` body `{code}` 只能使用官方登录过程给当前用户生成的有效临时 code，不从聊天中捡一个 code 或猜造。微信绑定入口 `post_auth_wechat_binding_session` body `{intent:"bind"}`；已绑定要 intent=rebind。系统需真实微信小程序配置才能生成扫码二维码。

`post_auth_wechat_binding_scene` body `{includeQrCode:false}` 能创建本人绑定场景，但不含二维码且尚未绑定。不要把“创建场景”报告成“微信绑定完成”。二维码仍需原网站官方流程。保存返回场景后 `get_auth_wechat_binding_session` query `{sessionId}` 查看 pending/completed/expired/revoked；他人场景返回404，不能改挂。

本人解绑 `delete_auth_wecom_binding`、`delete_auth_wechat_binding`；管理员解除指定员工 `delete_system_wecom_bindings_by_userId` params `{userId}`。普通平台管理员不能解除老板企微绑定，老板仍按网站规则管理。解绑微信同时撤销未消费的绑定场景；回读 bound=false。已明确要求解绑时准备票据后执行，不额外反复询问。

## 回调配置与验证

先保存真实 corpId，再 `post_system_wecom_callback_credentials` 生成新凭证。密钥生成会让旧验证状态失效，不可为了重试消息随意重新生成。MCP 可回读 callbackConfigured、callbackUrl、callbackVerifiedAt、callbackLastReceivedAt；token 与 EncodingAESKey 继续脱敏。本人需在网站的一次性凭证界面完成安全复制，不把配对密钥贴在对话里。

GET/POST `/api/system/wecom/callback` 是企业微信签名、时间戳和 AES 协议端点，不是普通 MCP 写操作。签名、过期、企业 receiveId 错误必须拒绝。精确明文验证通过只代表回调协议验证，不代表某条客服消息已成功处理或回复。

## 公告广播、测试消息与工作台同步

用户明确授权公告外发后，准备 `post_system_announcement_wecom_broadcast` 票据，body `{title,content}`。标题最多64字符，正文最多1900字符。返回 HTTP 200 仍要读 `result.status`、sent、failed、skipped、reason。status=skipped、reason=not_configured、sent=0 时大白话报告：“没有发出去，企微还没配置好。”不能报告成功送达或自动再发。

本人管理员测试消息 `post_system_wecom_test_message`；缺绑定返回原错误，先完成实际绑定。`post_system_wecom_workbench_sync` 同步已绑定员工工作台，读 total、synced、failed；没有配置或真实授权不能宣称同步。

读回原回执是查询结果，不再次外发。网络中断或 UNKNOWN 时保留原 operationId；确定原业务尚未开始才按合同处理重试。

## 维护与验收

`apps/server/tests/businessMcpFullsiteWecom.test.ts` 真实走 OAuth/SDK/原网站/隔离数据库，核对加密、回读、角色与回调协议；真实外部配置缺失单独分类。配方与测试源码变更后重跑当前指纹验收，旧证据不累计成最终成功。新增企微功能同时更新实时合同、本章、验收场景和页面教程。
