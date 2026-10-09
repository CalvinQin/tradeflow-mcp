# 文件、业务附件与媒体治理

先使用 get_tradeflow_context 核对本人身份与当前契约。以下是业务执行指南，章节存在不表示该场景已经实际验收；以独立验收清单及真实证据状态为准。

## 共用前提与回读

明确本人允许的团队目录或业务对象、文件来源/MIME/尺寸；查引用/影响、媒体登记与清理开关、当前状态及对象ACL。

使用真实multipart或base64字节上传，保存原路径/媒体id/上传票据。移动、重命名、挂附件沿用原网站规则；孤立文件先对账/dry-run，确认引用为零后执行隔离。

读文件信息和完整原件hash；回读业务附件引用、资产状态、隔离/恢复与审计。跨对象/跨角色下载应被拒绝。

URL和本机路径不是上传字节。删除响应可能先返回202与QUARANTINE_PENDING；原网站响应结束后异步处理用户触发的可逆隔离，须继续回读QUARANTINED、DONE任务与隔离区原件hash。MEDIA_CLEANUP_ENABLED=false仍允许这类可逆隔离，不能仅凭响应说已永久删除。STAGED/ACTIVE/QUARANTINED/PURGED分别处理；永久删除需原密码/确认规则及明确授权。只清理自己验收创建的对象，公开预览仍有独立协议/权限。

具体执行顺序、输入和失败恢复见[本领域操作配方](../recipes/files.md)；仅其中明确列出的流程有执行规格，其余候选仍须补齐实际验收。

<a id="files"></a>
## 文件管理

自然语言任务：请按当前权限完成“文件管理”所需操作，并回读实际结果。业务步骤：

1. 先确认当前文件夹再上传或新建目录。
2. 预览不等于下载到本地。
3. 上传完成后确认文件可打开。
4. 移动前检查是否有业务页面引用。
5. 先看引用与影响提示。
6. 永久删除前完成必要归档。

角色候选：BOSS、SALES。前置对象：local-png、local-pdf、local-xlsx、team-folder、media-asset、referenced-file、orphan-file；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `delete_files_delete`：DELETE /api/files/delete
- `delete_public_logistics_share_by_token_shipping_labels`：DELETE /api/public/logistics-share/:token/shipping-labels（excluded，使用原协议）
- `get_business_files_by_kind_by_id`：GET /api/business-files/:kind/:id
- `get_business_files_by_kind_by_id_content`：GET /api/business-files/:kind/:id/content
- `get_files`：GET /api/files
- `get_files_download`：GET /api/files/download
- `get_files_info`：GET /api/files/info
- `get_public_exhibition_channels_by_code`：GET /api/public/exhibition-channels/:code（excluded，使用原协议）
- `get_public_exhibition_channels_by_code_qr`：GET /api/public/exhibition-channels/:code/qr（excluded，使用原协议）
- `get_public_file_preview`：GET /api/public/file-preview
- `get_public_file_proxy`：GET /api/public/file-proxy
- `get_public_logistics_share_by_token`：GET /api/public/logistics-share/:token（excluded，使用原协议）
- `get_public_mini_product_shares_by_token`：GET /api/public/mini-product-shares/:token（excluded，使用原协议）
- `get_public_product_shares_by_token`：GET /api/public/product-shares/:token（excluded，使用原协议）
- `get_public_product_shares_by_token_preview`：GET /api/public/product-shares/:token/preview（excluded，使用原协议）
- `post_business_files_by_kind_by_id_attach`：POST /api/business-files/:kind/:id/attach
- `post_business_files_by_kind_by_id_upload`：POST /api/business-files/:kind/:id/upload
- `post_files_batch_download`：POST /api/files/batch-download
- `post_files_folder`：POST /api/files/folder
- `post_files_move`：POST /api/files/move
- `post_files_rename`：POST /api/files/rename
- `post_files_upload`：POST /api/files/upload
- `post_public_exhibition_channels_by_code_business_card_ocr`：POST /api/public/exhibition-channels/:code/business-card-ocr（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_catalog_download`：POST /api/public/exhibition-channels/:code/catalog-download（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_events`：POST /api/public/exhibition-channels/:code/events（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_interest_photos`：POST /api/public/exhibition-channels/:code/interest-photos（excluded，使用原协议）
- `post_public_exhibition_channels_by_code_leads`：POST /api/public/exhibition-channels/:code/leads（excluded，使用原协议）
- `post_public_logistics_share_by_token_shipping_labels`：POST /api/public/logistics-share/:token/shipping-labels（excluded，使用原协议）
- `post_public_product_shares_by_token_submissions`：POST /api/public/product-shares/:token/submissions（excluded，使用原协议）
- `post_public_product_shares_by_token_unlock`：POST /api/public/product-shares/:token/unlock（excluded，使用原协议）
- `post_upload`：POST /api/upload
- `post_upload_abandon`：POST /api/upload/abandon
- `post_upload_base64`：POST /api/upload/base64

验收情景编号：`capability:files`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。

<a id="media"></a>
## 媒体治理

自然语言任务：请按当前权限完成“媒体治理”所需操作，并回读实际结果。业务步骤：

1. STAGED、ACTIVE、QUARANTINE 与 PURGED 含义不同。
2. 孤立文件需要先确认是否真的无引用。
3. 查看引用实体与路径。
4. 必要时先运行对账，再处理异常。
5. 确认隔离时间、引用为零和审计记录。
6. PURGED 记录保留用于追溯。

角色候选：PLATFORM_ADMIN。前置对象：local-png、local-pdf、local-xlsx、team-folder、media-asset、referenced-file、orphan-file；具体必填值先查网站契约与已授权数据，缺失商业事实再询问，不编造值。

发现操作类别后，读取下列候选的 get_business_operation_contract；列表是任务索引，具体权限和字段仍以实时网站为准。

- `get_media_admin_assets`：GET /api/media-admin/assets
- `get_media_admin_cleanup_dry_run`：GET /api/media-admin/cleanup/dry-run
- `get_media_admin_reconciliation`：GET /api/media-admin/reconciliation
- `get_media_admin_summary`：GET /api/media-admin/summary
- `get_media_admin_trash`：GET /api/media-admin/trash
- `post_media_admin_assets_by_assetId_restore`：POST /api/media-admin/assets/:assetId/restore
- `post_media_admin_orphans_quarantine`：POST /api/media-admin/orphans/quarantine
- `post_media_admin_reconciliation`：POST /api/media-admin/reconciliation
- `post_upload`：POST /api/upload
- `post_upload_abandon`：POST /api/upload/abandon
- `post_upload_base64`：POST /api/upload/base64

验收情景编号：`capability:media`。普通保存保持原operationId，沿用当前任务中目标与范围明确的用户授权，必要的版本和商业信息完整时连续执行，不重复索要同一授权。敏感操作保留prepare票据和网站原确认/版本要求；已有具体授权继续有效，票据本身不构成人类授权。未知结果查回执及对象，不换ID重做。
