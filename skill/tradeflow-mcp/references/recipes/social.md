# 询盘、邮件与社媒沟通操作配方

执行规格：`apps/server/tests/businessMcpFullsiteInquiries.test.ts`、`businessMcpFullsiteSocialChat.test.ts`、`businessMcpFullsiteNativeSocial.test.ts`。合成隔离数据验证网站原处理器、OAuth、MCP SDK、MySQL和文件；缓存的客户原文是明确的测试资料，不是供应商回执。验收文件和历史通过记录不能代替当前指纹的全站验收。

## 询盘与客户邮件

1. `get_inquiries` query `{id?,search?,status?,page?,limit?,mail?}` 返回 `inquiries,pagination,statusCounts`。原站普通询盘由SALES共享处理；`mail:"all"`包含客户邮件，但客户邮件仍按当前负责人过滤。PACKER/ACCOUNTANT不能操作。
2. `post_inquiries_create` body `{email,inquiry_text,contact_person?,company_name?,country?,country_full_name?,source_url?,visitor_ip?,submitted_at?}`。邮箱和内容必填，原站同步INQUIRY客户来源；不能自行填写 `source_url:"mail:..."`伪造邮件归属。所有写操作保持原operationId。
3. `put_inquiries_by_id` params `{id}` 使用原 `reply_content,reply_subject,reply_format,reply_to,reply_cc,status`等字段。富文本 `reply_format:"html"`会清理脚本和事件属性，收件人/抄送按原规则校验。保存草稿或approved状态不表示已发送，回读必须检查 `sent_at` 和实际成功邮件记录。
4. 手工标签用 `put_inquiries_by_id_tags` body `{tags:[...]}`，最多3个；不能把模型故障写成客户判断。`post_inquiries_by_id_analyze_tags`和`post_inquiries_by_id_ai_reply`缺少真实模型配置时返回原503 `AI_CONFIGURATION_MISSING`，保留原人工标签和草稿。MCP写操作仍按现有保守规则为UNKNOWN；查询同一operationId及对象，不换ID假装生成成功。
5. `post_inquiries_upload_excel` 使用真实 `files:[{field:"file",filename,mimeType,base64}]`，原站接收 `.xlsx`或`.csv`，10MiB限制。回读 `count,batchId`及实际询盘原内容、上传人和客户来源关联；batchId必须对应真实数据库导入批次。不要靠文件名、URL或预览文字代替文件字节。
6. `post_inquiries_customer_by_accountId` params `{accountId}`、body `{email?}`仅从已授权客户的真实联系人邮箱建立/复用邮件往来。`get_inquiries_by_id_threads`回读往来原文；`get_inquiries_by_id_reply_context`提供最新客户来信的Reply-To、To、CC与主题。异主邮件的读取、单条写入和批量写入统一拒绝，不能通过混入可访问ID绕过。
7. `get_inquiries_unread`统计收到且未读的邮件。`post_inquiries_by_id_read` body `{ids:[邮件编号]}`只改变当前往来内received邮件的已读标志；草稿不标为已发送。询盘路径id须完整正整数，`1abc`拒绝，不能依赖parseInt截断。
8. `post_inquiries_by_id_send`需先展示实际收件人、抄送、完整正文和附件并取得具体外发授权；body沿用 `reply_content,to,subject,cc_emails,reply_format,compose_mode:"new"|"reply"|"replyAll",reply_thread_id?`，附件沿原multipart字段发送。`post_inquiries_batch_send` body `{inquiry_ids:[...]}`同样保留敏感确认。没有本人真实邮箱配置时原503 `EMAIL_CONFIGURATION_MISSING`，单发/批发均不能声称送达；`post_inquiries_sync_emails`缺配置原400 `Email not configured`。已发送与已收件须分别凭真实SMTP结果/IMAP记录验证，本轮未进行外发。
9. `delete_inquiries_by_id`和`post_inquiries_batch_delete`删除需具体授权及prepare票据，批量body `{inquiry_ids:[...]}`。回读仅选中的询盘与邮件记录；原关联客户历史保留。失败或UNKNOWN查回执，不更换操作ID重复删除。

## WhatsApp本地账号、会话与私有附件

1. `get_social_accounts_config`只返回实际接入配置是否就绪。`post_social_accounts` body `{name,accountKind:"PERSONAL"|"BUSINESS_APP",requestId:UUID}`创建本人离线扫码账号；创建成功不表示手机绑定或平台授权。`get_social_accounts_by_id_qr`只能由账号拥有者/老板读取；OFFLINE时qr和expiresAt为null，不能生成伪扫码图。
2. `patch_social_accounts_by_id` body `{expectedRevision,name?,members?,action?:"update"|"connect"|"disconnect"}`是账号管理敏感操作，保留prepare票据。成员须是有效业务岗位；仅账号拥有者/老板可改。原版本陈旧409；撤成员后立即失去会话和旧文件快照访问权。connect需要真实手机和运行时，本轮未连接；disconnect保留业务历史。
3. `get_social_channels`回读当前可访问账号、成员、版本与连接状态，不返回凭据。老板和SOCIAL_OPERATOR按原监督权限读取，SALES按拥有者/成员访问。`put_social_channels`仅老板配置，保留敏感确认；新配置原字段 `name,phoneNumberId,wabaId,apiVersion,enabled,accessToken,appSecret,verifyToken`，编辑保留id/expectedRevision，不能换绑已有号码。隔离测试仅存不可用合成凭据且enabled=false，不据configured文案称平台授权。
4. `post_social_conversations` body `{channelId,phone,name?}`仅在可访问的有效账号建立/复用会话，phone为带国家代码的国际号码。`get_social_conversations`按原filter/page/channelId等查询；`get_social_conversations_by_id` query `{before?}`读取50条原消息及nextBefore，下一页沿原游标，不重组或编造历史。
5. `patch_social_conversations_by_id` body `{expectedRevision,requestId,customerId?,handlerId?,state?,markRead?,reason?}`使用原会话版本和请求ID。客户仍须当前业务权限，接待人须有效且可访问该账号；变更回读客户/接待/状态、未读与SOCIAL_HANDOFF活动。旧版本409，别把同一请求键换内容重试。
6. `get_social_conversations_by_id_customer_workspace`先读取 `customerId,version,revision,sourceHash,stage,tasks,nextDate`。`post_social_conversations_by_id_followup`人工body `{requestId:UUID,expectedRevision,expectedVersion,customerId,mode:"manual",content,stage,nextDate?}`，使用当前版本。E/DORMANT客户可原样暂停、nextDate为null，背景不被替换；AI/automatic/summary模式必须使用原站真实总结凭证，不能伪造insightToken。
7. `post_social_conversations_by_id_upload` params `{id}`及真实files字段file暂存私有附件，原20MiB限制，回读 `filename,mime,bytes,stageToken`。仅顶层用途social-chat-file的票据保留，绑定当前用户和会话，不能当作网站或OAuth登录凭据。非multipart请求及时400，不能等待已消耗的JSON流。
8. `post_social_conversations_by_id_reply` body `{intentId,expectedRevision,confirmed:true,text?}`或原 `upload:{stageToken,caption?}`/template/media，只能选择一种消息。需要具体外发授权及prepare确认，原平台窗口/模板/附件与会话权限都保留。没有真实扫码运行时时仍保留failed意图和私有附件，仅在确定未开始transport的typed离线错误返回 `prerequisite:{status:"unavailable",connected:false,reason:"account_offline"}`；这是未就绪结果，不能把HTTP200、MCP COMPLETED或FAILED意图称为平台接受/送达。UNKNOWN/PENDING只查询原intent和operationId。
9. `get_social_conversations_by_id_reply_by_intentId`仅回读本人原发送意图。`get_social_conversations_by_id_media_by_messageId`按当前会话权限读取真实私有附件；首段及每次 `read_business_response_file`续读仍走原GET权限链。核对totalBytes/sha256，撤成员后旧responseId也失效。附件存在不表示已外发。
10. `post_social_conversations_by_id_translate` body `{language,messageId}`或 `{language,text}`两者选一；保存的messageId必须属当前会话。`post_social_conversations_by_id_insights`需关联客户和真实消息。模型缺配置原503，无译文、总结或新客户背景。本轮只验证真实前提拒绝。
11. WEB账号 `get_social_channels_by_id_templates`原空数组不能当作获准Meta模板；CLOUD模板需真实授权。`get_social_staff`返回有效业务人员；`get_social_metrics`按原角色只BOSS/SOCIAL_OPERATOR，from/to为有效日期且最多93天，SALES仍403。接受、失败与待发不等于delivered/read事件。

## 原生入口与待验范围

`/api/social/webhook`继续走原校验口令、原始body和回调签名协议；坏JSON/格式400，缺签名或未匹配授权账号403，本轮没有制造供应商入站或送达事件。`/api/social/mcp`的本人OAuth列表、改名和删除走原站管理，跨所有者404；旧手工密钥创建/rotate保持410，不能恢复旧密钥。删除本人的OAuth访问保留业务历史，旧access token立即401。

真实Meta/WhatsApp授权、入站同步和外发送达、模型生成结果仍需独立实证。此配方不能据缺配置、历史阶段通过或条目存在称全站验收完成。Alibaba 独立步骤见 `alibaba.md`。

## Meta 连接、资产与改动预览

执行规格：`apps/server/tests/businessMcpFullsiteMetaAds.test.ts`。BOSS 管理连接，BOSS/SOCIAL_OPERATOR 使用工作台；SALES/PACKER 无此范围。合成缓存的账号、主页和 scopes 只验证本地约束，不证明真实授权。

1. `post_meta_ads_connections` 沿原 `{name,apiVersion,allowManagement,accessToken,...}` 契约并保留敏感 prepare/确认；缺访问令牌原 400，不会创建连接。`get_meta_ads_connections` 回读当前配置，不返回 secrets/accessToken/pageTokens。`post_meta_ads_connections_by_id_sync` 仅 BOSS，body `{expectedRevision}`；旧版本 409，不覆盖缓存。
2. `get_meta_ads_connections_by_id_accounts_by_accountId_ads` 用原 level/since/until/after 等筛选，详情 `get_meta_ads_connections_by_id_accounts_by_accountId_objects_by_objectId` 仍核对该连接内资产。不存在资产 404、无效日期 400。非 Demo 且缺用户访问令牌时，这些入口和同步/广告预览原 503 `META_CONFIGURATION_MISSING`，在 Graph transport 前停止，不能把网络失败或空结果当取到广告数据。
3. `get_meta_ads_connections_by_id_pages_by_pageId` 和 `post_meta_ads_connections_by_id_pages_by_pageId_preview` 使用本主页授权、task 和原 metadata scope。缺本主页令牌同为原 503 `META_CONFIGURATION_MISSING`，不会回退到用户令牌；其他主页 404。主页预览 body `{patch:<原允许字段>}`，广告预览 `post_meta_ads_connections_by_id_accounts_by_accountId_preview` body `{level,id,patch}`；预览必须读取真实供应商对象后由原站产生确认票，不能编造对象或签名。
4. `post_meta_ads_connections_by_id_execute` body `{operationId,confirmationToken}`，使用原真实预览票，先展示具体外部改动并取得发送授权与敏感 prepare。原站复核操作者、连接、资产、对象版本和授权后提交；UNKNOWN/PENDING 只通过 `get_meta_ads_connections_by_id_operations_by_operationId` 查原 operationId。NOT_SUBMITTED 不是平台接受。无效签名 403 仅证明拒绝，本轮 execute 成功未验，不能据该拒绝记外部前提通过。
5. 具体授权删除本地连接时 `delete_meta_ads_connections_by_id` 仅 BOSS，body `{expectedRevision}`，保留 prepare，回读 removed:true/列表消失和同一 MCP operationId 重放。删除配置不证明撤销平台授权。缺配置写操作的 MCP UNKNOWN 保留保守回执语义；确认原未开始 transport，也不伪造 ACCEPTED。

## Meta 执行的两层票据与原对象复核

本节依据原生源码说明合法执行与历史恢复；尚无本流程真实供应商改动成功实证。缺令牌503、无效票403和书面配方都不能替代真实预览、提交及回执。

1. BOSS 用原连接与 `post_meta_ads_connections_by_id_sync` 保存真实授权资产及当前 revision；业务操作者仅 BOSS/SOCIAL_OPERATOR。广告管理须 allowManagement、ads_management 和本账号 MANAGE/ADVERTISE task；主页管理须 pages_manage_metadata、本主页管理 task 和本主页令牌。用原广告/主页读取接口选定真实对象，核对当前内容及归属，合成缓存不能充当官方授权对象。
2. 广告预览 `post_meta_ads_connections_by_id_accounts_by_accountId_preview`，params `{id,accountId}`、body `{level,id,patch}`；主页预览 `post_meta_ads_connections_by_id_pages_by_pageId_preview`，params `{id,pageId}`、body `{patch}`。原服务会 Graph GET 实际对象并检查资产归属，才返回原 operationId 和 confirmationToken。新提交的原票有效10分钟，绑定操作者、连接、revision、对象、patch、对象 fingerprint 和原预览 UUID；不得自行签票或拼接其他人的预览。
3. 展示实际对象、原值、拟改字段与外部影响，取得具体修改授权后，按敏感契约调用 `prepare_business_action`，再调用 `execute_business_operation` 执行 `post_meta_ads_connections_by_id_execute`。prepare 和 execute 的对象与 body 保持一致。两层字段分别保存：

| 用途 | operationId | confirmationToken |
|---|---|---|
| MCP 外层执行参数 | 本凭证持久写入的操作编号；重试与查询沿同一编号 | 本次 prepare 返回的内容绑定确认票，放在 execute 顶层 |
| 原 Meta body | 原预览返回的 UUID，放在 body.operationId | 原预览返回的 Meta 签名票，放在 body.confirmationToken |

4. 新提交使用 body `{operationId:<原预览UUID>,confirmationToken:<原预览票>}`。原服务先核验签名/操作者/连接/当前管理权限，无已有历史回执时再核对期限和 revision，重新 Graph GET 原对象并比对 fingerprint；事务预留 PENDING 后，在发送前再次核对连接与权限。过期、连接或对象变化时保留用户修改意图，重新读取并预览，再针对新内容确认，不能沿旧票强行提交。
5. 简单字段修改也会真实 Graph POST；creativeText 还可能先创建替换素材，再关联原广告。只有真实供应商 response.success=true 才返回 ACCEPTED；ACCEPTED 是供应商接受，仍须原对象回读核对最终字段。UNKNOWN/PENDING 或 CREATIVE_CREATED 阶段查询 `get_meta_ads_connections_by_id_operations_by_operationId` 的原 Meta UUID及 `get_business_operation_result` 的外层 MCP 编号，不换键重发、删除中间素材或推断最终生效。
6. 已存在合法历史回执时，原服务仍先验证原签名、操作者、连接及当前管理权限，再读取同 scope/原 UUID 的结果；此分支可恢复历史结果而不重复 Graph 提交。必须使用真实原预览票和对应真实历史记录。没有历史回执时，过期票不能发起新修改。重放只证明旧结果恢复，不能声称本轮新提交成功；不得预置 ACCEPTED/PENDING 回执、签造票据或拿 Demo 响应补正式证据。

源码依据：仓库 `apps/server/services/social/metaAdsService.ts` 的 `previewMetaChange` / `previewMetaPageChange` / `executeMetaChange` / `metaOperationResult` 及原 `sign` / `verify`，`apps/server/routes/metaAdsRoutes.ts`；MCP 外层用途依据 `apps/server/services/businessMcpDispatchService.ts` 与 `apps/server/services/registerFullBusinessMcpTools.ts`。
