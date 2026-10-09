# 分享快照、公开访问与客户提交

执行规格：`apps/server/tests/businessMcpFullsiteSharing.test.ts`。规格存在不代表本轮已通过；最终状态看独立全站验收记录。

1. 读取真实商品及 `post_product_shares` 契约；普通创建 body `{productIds:["<已读取商品ID>"],customerName,customerCompany,title,currency:"USD"}`，最多50款。核对返回 share.id、snapshotVersion 和全部 snapshot.products。网页分享为报价/包装快照，之后目录变化不会自动修改旧分享。
2. 修改 `patch_product_shares_by_id` 或小程序兼容的 `put_product_shares_by_id`，`params:{id}`，body 为 `{snapshot:<回读并修改后的完整快照>}`；不可只提交单个商品。原路由递增 snapshotVersion，当前没有 expectedVersion 校验，不填造该字段。保存后回读 `get_product_shares_by_id`，核对实际版本、customerPrice、visibleFields、单位、箱规和规格。visibleFields 当前只控制页面显示，原生公开DTO仍返回保存的原报价字段，不把隐藏显示描述为数据脱敏。销售只管理本人，老板/打包员按原网站范围管理，会计不可管理。
3. 发布先核对启用规格/商品均有每箱数量、厘米箱规、毛重。用户已明确授权发布该快照时 `prepare_business_action` 绑定 `post_product_shares_by_id_publish` 参数和 operationId，随后执行；票据不构成用户授权。只在返回有效 published.token/accessCode 后组合公司网站公开路径 `/api/public/product-shares/<token>` 及前台对应入口，不伪造链接。访问码、访问token均限定这份分享，不能当网站登录凭证。
4. 公开协议使用原生HTTP：`GET .../<token>/preview` 只读有限预览；`POST .../<token>/unlock` body `{accessCode}` 返回 sessionToken；之后 `GET .../<token>` 和 `POST .../<token>/submissions` 必须带 `x-share-session`。公开提交 body `{customerName,selections:[{productId,variantSku?,quantity}],containerType:"20GP",note}`。核对 submission.id/shareVersion/packingResult，再通过本人MCP `get_product_shares_by_id_submissions` 回读。此原生提交没有operationId幂等契约，网络未知时先回读意向列表，不能盲重发。
5. 客户意向关联到已有本人订单用 `post_product_shares_by_id_submissions_by_submissionId_converted`，`params:{id,submissionId}`，body `{orderId}`，只记录关联，不创建正式订单。回读 convertedOrderId/convertedAt；原网站禁止销售关联他人订单。
6. 重置访问码、撤销、删除均保留具体用户授权和 prepare 票据。`post_product_shares_by_id_reset_code` 回读新访问码，旧码无法再解锁；`post_product_shares_by_id_revoke` 回读 REVOKED 并核对公开入口拒绝；`delete_product_shares_by_id` 删除后回读列表与对象。不要把重置访问码理解为撤销所有此前签发的会话，当前会话边界仍以网站实现为准。

小程序直链是独立渠道：`post_mini_product_shares` body `{productIds:[...]}` 直接生成 tfm_ token，因创建即发布，必须在具体用户授权范围内先用 `prepare_business_action` 绑定参数和 operationId，再执行原操作。原生 `GET /api/public/mini-product-shares/<token>`；网页访问码协议不接受 tfm_ token。`get_mini_product_shares` 查看本人记录，`post_mini_product_shares_by_id_revoke` 撤销后公开GET为404。票据不构成用户授权，不能替用户向客户发送。

401：访问码/会话失效，返回原解锁流程。403：对象权限或分享撤销/过期，停止该操作。400：缺包装资料、空商品或无效柜型，回读并更正已知参数。404：对象/渠道不匹配，不能交换网页和小程序token。包装达2000箱上限时拒绝提交，不能报告全部需求已经装下。未知MCP写入查询原operationId回执，保留已保存快照。
