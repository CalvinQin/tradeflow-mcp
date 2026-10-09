# 文件原件、快照续读和隔离回收

执行规格：`apps/server/tests/businessMcpFullsiteOperations.test.ts` 的真实文件流程。媒体管理员的资产/引用/恢复/清理和报关附件是各自权限域，不能把团队文件验收当成媒体永久删除通过。

1. `get_files` query `{path:"team-files/...",limit,offset,search?,type?}` 列本人可读根；`get_files_info` query `{path}` 回读大小。普通文件管理限老板/销售；平台管理权决定可读管理员根，不能接受任意本机绝对路径或目录穿越。展示路径不是上传字节。
2. `post_files_folder` body `{path,name}` 创建目录。`post_files_upload` body `{path}`，files 为 `[{field:"file",filename,mimeType,base64}]`，遵守原 multipart MIME/大小及团队根规则。缺文件400，已上传但媒体登记失败时保留原文件待对账，不能宣称完整登记成功。成功回读 assetId、原路径、实际大小和文件内容hash。
3. `get_files_download` query `{path}` 只取首段，返回credential-bound responseId、totalBytes、sha256、offset/base64/hasMore/nextOffset。后续 `read_business_response_file` args `{responseId,offset:nextOffset,length?}`，不要再次执行GET生成另一份字节。长度上限256KiB，合并全部字节后核对完整hash；跨凭证、岗位降级、原对象不再可读、到期或缓存hash损坏都应拒绝，不绕过。默认7天到期，服务器保存的是原件生成时快照，不声称它会随源文件改变。
4. `post_files_rename` body `{oldPath,newName}`；`post_files_move` body `{from,to}`。回读新路径字节和媒体storage_key。旧路径已失效时，旧GET快照续读按原路径ACL/存在性拒绝；按当前意图重新下载新路径。
5. `post_files_batch_download` body `{files:["<可读完整路径>"],archiveName}`。原件ZIP由网站生成；COMPLETED后只用 `read_business_response_file` `{operationId,offset:nextOffset}` 读原缓存，每次复核各源文件及岗位。原operationId回执重放不能产生不同ZIP；未知结果先查询回执。operationId与responseId二选一，不同时传。
6. `delete_files_delete` query `{path}` prepare后提交。成功是异步隔离/清理入队，不能说已永久物理删除；回读media asset状态及cleanup job直到当前阶段真实完成。QUARANTINED保持隔离区原件hash，源路径应消失。受引用、权限、隔离保留期和生产清理开关约束的永久清理须具体授权及原生预览，不自动开启。

文件是团队/业务资料，发送给外部客户另需具体目标和发送授权。所有写操作固定operationId；400校正已知参数，403停止越权，UNKNOWN/PENDING查原回执和真实对象。MCP文件缓存仅服务已授权原件读取，不能拿responseId当网站或OAuth认证凭据。

## 业务附件：真实暂存票据和引用

执行规格：`apps/server/tests/businessMcpFullsiteMedia.test.ts`。团队文件列表、公开代理和业务对象附件分别按原网站权限判断。

1. `get_business_files_by_kind_by_id` params `{kind:"customer"|"order",id}` 先定位允许访问的业务对象。客户对象不属于本人时原站返回404；不能因此搜索或猜测他人的原始存储路径。
2. `post_business_files_by_kind_by_id_upload` 使用同一params和真实 `files:[{field:"file",filename,mimeType,base64}]`；回读 `storageKey,filename,mime,bytes,stageToken`。媒体暂为STAGED，尚未挂附件；此接口仅返回用途为business-file-stage的顶层JWT，不能用作网站登录或OAuth身份。
3. `post_business_files_by_kind_by_id_attach` body `{stageToken,requestId}`。客户附件固定原requestId，MCP另固定operationId；两层重放不得新增重复文件或FILE_ATTACHMENT活动。订单附件只使用网站允许的field并提供当前editVersion，付款/报关等专用附件仍走原流程。票据绑定当前用户、业务对象和文件，不能换对象或转给另一账号。
4. 回读业务附件列表及媒体ACTIVE引用；`get_business_files_by_kind_by_id_content` query `{storageKey}` 只下载已挂在该对象上的原件。校验全部字节与sha256，续读仍检查当前负责人/岗位；对象转移后原凭证的快照也不能继续读。

## 上传回收、预览与媒体对账

1. `post_upload` 使用真实multipart，body.path为原网站允许的目标根。库存凭证允许老板/打包，销售不能借目标路径绕过权限。返回URL可能含签名查询；业务保存沿用原URL，磁盘核对以登记的media_assets.storage_key为准，不把签名参数当文件名。
2. `post_upload_abandon` body `{urls:[...]}` 最多30项，只回收本人的未引用STAGED文件。queued=0可能表示当前账号不拥有该暂存，不能宣称已清理；回读QUARANTINED和实际隔离字节，重放原operationId不重复执行。
3. `get_public_file_proxy` / `get_public_file_preview` 仍要求网站登录，query `{path}` 只能是允许的上传/报告路径。表格预览是规范化文本，原件另下载并核对；缺路径、穿越或私人根拒绝。公开代理有原网站的范围规则，不推断它等同客户附件的负责人权限。
4. 媒体管理限老板/平台管理员：先 `get_media_admin_summary`，列表 `get_media_admin_assets` 返回items和pagination；`get_media_admin_reconciliation` 与 `get_media_admin_cleanup_dry_run` 只读，不登记、移动或删除。
5. 对账确认后 `post_media_admin_reconciliation` body `{confirm:"REGISTER_REFERENCES_ONLY"}` 仅回填登记与引用；孤立旧文件标legacy_review_required，不因回填自动成为有效业务引用。
6. 隔离前重新核对真实孤立候选和零引用。`post_media_admin_orphans_quarantine` body `{storageKeys,confirm:"MOVE_SELECTED_ORPHANS_TO_30_DAY_QUARANTINE",confirmedCount:storageKeys.length,retentionDays:30}`，prepare并取得具体授权后执行。数量、确认语或保留期不一致停止。核对requestedCount/quarantinedCount/rejectedCount/failedCount、源路径消失、资产QUARANTINED和回收站items；失败/跳过不能算隔离完成。
7. `post_media_admin_assets_by_assetId_restore` 恢复允许资产的原字节，回读completed和ACTIVE状态；恢复不会自动重新绑定旧业务记录。成本凭证另受老板权限，当前媒体清理开关关闭不代表不可逆清理已获授权。

上述规格只覆盖真实上传/引用和可逆隔离恢复，不表示已执行永久清理，也不授权清理验收之外的文件。
