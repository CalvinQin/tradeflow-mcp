# 用自然语言交办产品和订单

用户说“帮我新建/修改”已经授权该普通保存。查清当前权限与实际资料、填原业务契约、保存并回读，连续完成。不要把每个查询、选项填写和普通保存变成再次审批。删除、外发、付款、转交和权限设置仍按相应敏感流程核对明确授权。

## 新建产品

示例任务：“请按照我这份确认过的资料，新建21V无刷工具，单位台，录入电压规格、两电一充选配、箱规和报关要素。”

1. `get_tradeflow_context`，发现 products 分类，读取 `post_products` 契约的 `wireInput.body`。
2. 查当前目录/类目，避免型号重复；单位、规格、选配、价格和报关参数以用户资料为准。图片先通过真实上传端点取得已保存引用。
3. 生成新产品 `id` 和本次 `operationId`；字段为 `model/name/unit/description/declarationElements/hasVariants/variantAxes/variants/options` 等，报价使用 `priceTerm/priceTiersCurrency/priceTiers`。规格稳定身份用 `variantId`，电压映射放 `axisValues`；不要把数据库列名 `product_unit` 当 JSON 参数。
4. 保存产品或规格前读取当前价格模式、汇率与实时 `wireInput.body`。人民币阶梯使用 `priceTiersCurrency: "RMB"`，美元使用 `"USD"`；每档填写 `minQuantity/price`，已知税率填写百分数 `taxRate`，税后金额填写 `priceWithTax`。例如仅在用户确认人民币起订量2、税前68元、税率13%时，才录入 `{"minQuantity":2,"price":68,"taxRate":13,"priceWithTax":76.84}`。旧产品/规格平价字段 `price/priceWithTax/priceCny/priceWithTaxCny` 已退役，不能放在产品或规格顶层；阶梯内部的 `price/priceWithTax` 继续有效。修改时保持已有各币种报价，不用当前汇率覆盖原价，不为测试切换全局价格模式。
5. 执行 `post_products`，回读 `get_products_summary`（query.ids）和必要的完整产品列表/选择器，核对规格、单位、参数与价格。网站没有保存成功时不得声称已经新建；商品目录价与用户确认的订单行单价分开核对。

## 修改产品

示例任务：“把指定产品单位改为件，说明替换为我这份文字，其他规格和选配保留。”

先精确查型号/ID并回读，然后读 `put_products_by_id`。只提交授权修改的字段，原规格稳定ID和选配保留；不要从显示价格反算覆盖历史订单。执行后再读取同一ID。存在多个同型号产品时，把候选提供给用户选择。

## 新建订单

示例任务：“给指定客户建一个订单，选21V规格和两电一充，3件，每件18.50美元，运费7美元，送到这份地址。”

1. 查 `get_customers_workspace` 与客户详情确认唯一客户、本人可用范围和联系方式；查 `get_products_picker`/`get_products_summary` 取得真实产品ID、规格ID、单位和选配。
2. 查 `get_system_order_config` 中本人可见的有效付款档案/记账币种。不能编造付款方式、银行信息、地址或已收款证据。若有多个合理付款档案且任务没有选定，询问这一项；优先读取已经存在的业务资料再提问。
3. 读取 `post_orders.wireInput.body`。需要 `id/customerName/status/currency/paymentMethodId/country/items`；非工厂自提还须 `recipientAddress`。关联客户用 `crmAccountId`，行项目用 `productId/variantId/variantSku/variantName/unit/quantity/unitPrice/options`。业务员归属固定本人，不能伪造 `createdBy`。
4. 经用户给定价格/条款核对后执行。总价由网站计算；上述示例为62.50美元，提交999也不能改变该计算。税、折扣、付款凭证金额及识别签名仍按网站校验。
5. `get_orders_by_id` 回读订单号、客户、规格、单位、数量、价格、币种、总价与状态。PI草稿不等于正式成交或已付款；缺少正式保存必需凭证时准确说明缺项。

## 修改订单

示例任务：“给指定订单增加这条已确认包装备注，保留商品与金额。”

先 `get_orders_by_id` 取得当前 `editVersion`，读取 `put_orders_by_id`，提交该版本和 `remarks`。回读验证总价、币种、商品行、单位和历史附件仍正确。修改数量/价格时保留原 `lineId/variantId/options`，按明确的新条款核对计算；切换币种、收款或审批依网站各自确认流程。409表示版本冲突，停止旧提交，回读并核对新状态；PENDING/UNKNOWN保持原ID查回执，禁止换ID盲重写。

仓库、工资、订单归属和字段权限由原网站实时判断；个人查询不能扩成全公司或全员工读取。目录中的角色候选不保证实际对象授权。

## 规格图组与统一数据（4.36.1）

产品规格通过 `imagesLinkedToProduct` 选择持续双向联动主图组；省略或 false 表示独立图集。关联后主图或规格图片变更同步到所有已链接规格，订单新增图片也沿此关系回流；未链接时订单图只加入目标规格。删除引用不删除历史订单图片。阿里巴巴绑定图库维持实时投影，不固化同步图片。

统一数据以用户选定的来源规格为准，只复制装箱数、单品尺寸、箱规及净重/毛重。保留目标规格的全部价格、阶梯、税率、币种、价格条款，以及 variantId、规格名称、选配绑定、图集和链接状态。开启规格时只填写各规格报价，不再同时填写主产品报价；首次开启仍从主产品继承到第一个规格。不要对历史订单或已发布快照批量重算。规格识别返回必选维度，附加选配不重复收取规格价格；手动维度不得被后台识别覆盖。

Public exhibition catalogue reads expose only active specification packing and quotes when specifications are enabled. Missing specification values remain unknown; never substitute retained parent values or rewrite historical published snapshots to repair display. Explicitly disabled specification mode uses the parent product.
