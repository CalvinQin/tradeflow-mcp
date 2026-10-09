# 展会目录、留资与访问记录

先调用 `get_tradeflow_context`，按本人的 BOSS / SALES 身份发现操作并读取实时契约。展会成员、线索负责人和 CRM 负责人由原网站核验；加入某个展会不授权浏览其他展会。普通保存沿用当前任务授权与同一 `operationId`，金额、付款、客户联系方式和翻译内容不得编造。

## 建展会与发布目录

1. BOSS 用 `post_exhibitions` 提交真实名称、起止日期、成员和兜底负责人；回读 `get_exhibitions_by_id`。成员管理使用 `put_exhibitions_by_id_members`，保留至少一个有效成员。
2. `put_exhibitions_by_id_catalog` 保存当前目录配置：已存在的 featured / hidden 商品编号、语言、币种、价格显示和背景图片。价格与商品信息从原网站读取，`sourceLocale` 以回读的实际目录为准。
3. `post_exhibitions_by_id_publish` 创建发布版本。保留原操作 ID 重查；重放不会再创建版本。发布后修改商品价格不会改写已发布快照。
4. SALES 使用 `get_exhibitions_by_id_my_channel` 获取本人渠道。公开渠道码只用于公开客户页、二维码和留资原协议，不能作为登录令牌。目录、二维码、事件、照片、名片 OCR 和目录 PDF 使用其登记的原生协议。
5. `post_exhibitions_by_id_end` 结束后公开目录隐藏价格；`post_exhibitions_by_id_close` 关闭后停止公开留资。关闭不意味着原目录 GET 必须返回 404，按当前网站状态回读。

## 翻译重试是异步任务

`post_exhibitions_by_id_catalog_translations_by_locale_retry` 需要已发布版本和已启用语言。HTTP 200 / MCP COMPLETED 只表示原网站已处理重试请求；不能报告“翻译完成”。回读 `get_exhibitions_by_id` 中 `catalog.translations`，继续观察 PENDING，READY 后再核对实际内容；FAILED 时保留原文并报告失败。重复查询或回执重放继续用原 `operationId`，不要为不确定结果另建重试请求。新的重试必须有明确重试意图。

隔离验收实际验证了重试请求、数据库尝试记录、缺模型时 FAILED 且没有生成内容、同 ID 不重复执行；未验证付费模型产出。发布成功也不能替代语言任务完成。

## 留资、名片和兴趣照片

1. 内部名片先通过 `post_upload` 上传真实字节，`body.path` 为 `exhibition_business_cards`。保留原响应的 `assetId` 和 `uploadToken`，使用正确 storage key，不能把签名 URL 的 query 当成文件名。
2. 未建档时调用 `post_exhibition_ocr_business_card_preview`，请求体是 `storageKey` / `uploadToken`。原件按首段的 `operationId` 经 `read_business_response_file` 续读，核对完整字节数与 SHA-256。每块复核本人、票据期限和是否已建档；建档后使用客户或线索附件入口。
3. `post_exhibition_ocr_business_card` 使用 `imageUrl` / `businessCardUploadToken`。OCR 未配置返回 503 `OCR_PROVIDER_NOT_CONFIGURED`，不产生识别内容或占用额度。MCP UNKNOWN 保留原 ID 查回执，不换 ID 重做识别，不把上传成功描述为 OCR 成功。
4. 产品参考照片通过 `post_exhibitions_by_id_interest_photos` 的真实 multipart `files` 上传。保存返回的 `photo.storageKey` / `photo.uploadToken`，只能用于其所属展会和当前上传者。
5. `post_exhibitions_by_id_leads` 至少提供客户或公司名称及一种有效联系方式。带入已核对的名片票据、兴趣商品编号、照片票据与可选目标价；不要借留资修改历史目录价格。
6. 默认 E 级暂不安排跟进，留资不创建初次任务；现有 E 级不能同时提交首次跟进日期。再次遇到暂缓或关闭客户也不会自动重启任务。先按客户工作台修改分级或状态，再按原业务规则安排跟进。
7. 原联系人准确匹配时保留已有 CRM 负责人。联系方式分别命中不同客户时停止自动合并，交由用户核对。公开留资需真实同意和稳定 `clientRequestId`；同 ID 改内容返回冲突。

公开照片和 OCR 必须使用 multipart；JSON 缺文件及时返回 400。公开 OCR 失败会移除暂存图片，只有成功且人工核对后的名片能力才可用于留资。

## 线索推进与离线同步

使用 `get_exhibitions_by_id_leads_page` 保留网站分页字段，第一页不代表全部线索；`get_exhibition_leads_by_id` 回读当前对象。PATCH / PUT 只提交已确认的资料、记录或负责人字段，原网站禁止伪造系统活动。

`post_exhibition_leads_by_id_activities` 记录实际跟进；完成已有任务使用 `post_exhibition_leads_by_id_followups_by_taskId_complete`，按原状态和日期规则回读。`post_exhibition_leads_by_id_conversions` 只绑定已有、已核对的目标，原生去重不会重复创建转化记录。

`post_exhibition_sync` 提交每条原离线 `clientRequestId`，逐条检查 `results` / `summary`，HTTP 200 不意味着每项成功。同一客户请求 ID 重放只返回原线索。

线索的名片、兴趣照片原件使用 `get_exhibition_leads_by_id_business_card` / `get_exhibition_leads_by_id_interests_by_interestId_photo`；每次继续读字节都复核当前对象权限。删除线索调用 `delete_exhibition_leads_by_id` 会走 CRM 客户删除规则，须先展示真实对象和影响并按已有明确授权执行。

## 背景图片与永久删除

背景上传使用 `post_upload`，路径为 `exhibition-backgrounds/<展会ID>`。删除 `delete_exhibitions_by_id_background_images` 前先从草稿移除图片，再发布新版本；草稿或当前发布版本仍引用时返回 409。旧发布版本仍有媒体引用时，网站可以返回 `queuedForQuarantine:false` 并保留原件；不能据此宣称文件已隔离或删除。未引用图片进入 30 天隔离队列；原网站还会在响应后处理本人主动触发的隔离任务，即使自动清理关闭，也可能已经移入隔离区。按真实队列和原件状态报告，隔离不等于彻底销毁。

永久删除先用 `get_exhibitions_by_id_deletion_preview` 核对名称、记录数量和保留 CRM 范围。只有 BOSS 可执行 `delete_exhibitions_by_id_permanent`：

- `body.confirmationName` 必须是原展会完整名称。
- `headers['x-delete-password']` 使用用户提供的当前删除密码；该头仅此操作可用，不能传 Authorization、Cookie、工作区或任意头。
- 保留 `prepare_business_action` 的内容绑定票据和原 `operationId`；预览密码脱敏，修改密码或名称后旧票据失效。
- 原网站删除展会及其展会记录，保留 CRM 客户；回读真实保留对象和媒体隔离结果，不把展会删除当作客户数据永久删除。

密码不得写入日志、配方、交接或知识库。已授权的真实影响可以继续执行，确认票据本身不构成人类授权。

## 访问记录

`get_exhibitions_by_id_analytics` / `get_exhibitions_by_id_visits` 回读本人可见的渠道和访问统计。删除访问记录使用原 `channelId`、`sessionId` 和 `throughEventId` 高水位；`delete_exhibitions_by_id_visits` 只删除截至该事件的记录，保留预览之后的新访问。不能伪造其他渠道或把统计数量当成客户成单。
