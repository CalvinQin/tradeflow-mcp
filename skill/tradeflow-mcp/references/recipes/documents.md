# 贸易单据原流程配方

此配方描述原网站步骤与恢复规则。五类表单为pi、commercial_invoice、packing_list、sales_contract、customs_declaration；正式报关还须订单needsCustoms与真实商业字段。合成验收资料不能用于正式报价、付款或报关。章节存在不代表全站已通过。

## 独立单据

1. 查`get_trade_documents_company_profiles`及已授权付款档案；用`post_trade_documents_blank`提交type和一次性UUID requestId。MCP写操作另保留原operationId。丢失响应查回执，再用同requestId核对原单据。
2. `get_trade_documents_blank`保留search/cursor；`get_trade_documents_blank_by_documentId`读取document.content/revision。SALES只访问本人独立单据或有权订单的已关联单据。
3. `put_trade_documents_blank_by_documentId`提交完整content与baseRevision。未完成草稿可保存；未知公司资料、币种、客户、数量、收款档案与报关字段应补真实依据。409先读取新版本合并，不覆盖他人的内容。
4. preview/export用原content，query.format为pdf或xlsx；导出时检查完整性和报关缺项。首次响应得到真实原件file，随后`read_business_response_file`用同operationId/nextOffset读取全部字节，核对totalBytes/sha256，并打开PDF/XLSX核对文字、金额与分页。读取失败JSON包含code/message/statusCode。
5. `post_trade_documents_blank_by_documentId_order`需最新baseRevision、USD/RMB、客户或收货人、有效paymentProfileId、产品描述和正数量。成功回读document.orderId、订单商品行、服务端金额、历史单价与档案。网站层重复转换返回同订单；MCP同operationId回读原回执。
6. 删除先展示准确单据与影响，获授权后prepare，再带baseRevision调用delete；409重新核对，成功读回不存在。

## 订单单据、版本与来源

1. 从本人订单详情取得orderId/editVersion，用`get_trade_documents_by_orderId_by_type`取得单据。SALES/BOSS首次读取可能生成并保存源快照；PACKER仅packing_list，缺正式记录时返回revision0临时核对稿。读取不代表正式商业确认。
2. `put_trade_documents_by_orderId_by_type`使用当前baseRevision与完整content，至少保留发票编号和一行产品。历史目录更新不应改变订单或单据已保存的价格、单位、规格和算法。
3. 订单来源变化且单据有手工编辑时，读取返回sourceStale。明确核对后以最新baseRevision调用sync：未手改字段跟随来源，手工字段保留，双方都改的字段返回conflicts。先解决冲突并保存，再继续写回或正式输出。
4. versions读历史revision/reason；restore使用目标历史revision和当前baseRevision，新增历史版本，不能把当前单据直接降版。恢复不改订单。
5. preview与export仍走原角色/对象门禁；PACKER可核对packing_list预览，不能修改或导出正式销售单据。ACCOUNTANT不能进入销售单据工作台。缓存续读必须重新核对当前对象归属。

## 已保存PI审核写回

1. 只用当前已保存且draft、无conflicts的PI；读取订单expectedVersion与单据baseRevision，生成稳定审核operationId。`post_trade_documents_by_orderId_by_type_writeback_review`返回errors/preview/differences及目的限定审核票据。
2. 展示PI编号、收件资料、唛头、备注、原商品行身份、数量、单价、运费、折扣与总价差异；审核期间订单未写入。客户身份、币种、付款档案和原凭证保持。errors非空、币种不同、受保护历史金额、已确认单据均先停下核对。
3. 在明确授权范围内使用原`post_orders_imports_confirm`入口，body包含审核token与confirmed:true，另保留MCP operationId和prepare票据。审核token不能用于网站登录或其它目的。
4. 确认时网站再次验证订单editVersion、PI修订和状态、本人权限及附件。409刷新后重新审核；结果未知沿原MCP operationId及原审核operationId查询，不换ID盲重试。
5. `get_orders_imports_operations_by_operationId`查询原审核操作，再读订单金额、历史lineId/单位/单价和收件字段。真实写回一次后原审核编号重试由网站回执返回replayed。

单据PDF/XLSX、保存、合并、恢复和写回需要真实证据；报关附件上传/状态、物流与正式付款另有原流程，不能由本配方或模板存在推定完成。

## 旧订单 PI 下载与结果未知

`get_orders_by_id_pi`可能先为旧订单保存缺失的发票编号，再生成文件或进行英文翻译，因此需要稳定MCP operationId。若中文品名或备注需要真实模型而模型未配置，原接口可在发票编号已保存后返回503；此时回执为UNKNOWN。沿原operationId查询，并回读订单invoiceNumber核对已有变化，不换新编号重复调用。文件有`file.operationId`时用该operationId续读；其他只读GET文件使用responseId，每次只传一种标识。核对完整字节长度与sha256，当前订单权限仍需通过。
