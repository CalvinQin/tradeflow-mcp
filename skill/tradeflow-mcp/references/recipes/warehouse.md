# 只读装箱模拟

执行规格：`apps/server/tests/businessMcpFullsiteSimulation.test.ts`（计算）、`businessMcpFullsiteWarehouse.test.ts`（包装版本/绑定/文件）、`businessMcpFullsitePacking.test.ts`（打包与任务导出）、`businessMcpFullsiteOperations.test.ts`（库存台账）。这些是候选执行规格，是否实际通过以同源指纹验收记录为准。

1. 先读取 `get_products`/`get_products_summary`，核对稳定商品与 variantId、每箱数量、厘米箱规、单件净重与整箱毛重，再读取 `post_products_simulate_container` 的实时契约。BOSS、SALES、PACKER 可计算；原网站仍执行角色校验。
2. 调用 `execute_business_operation`，operation 为 `post_products_simulate_container`，独立 operationId，body 示例：

```json
{"mode":"simulate","selections":[{"productId":"<已读取ID>","quantity":20,"rotationPolicy":"UPRIGHT_ONLY"}],"containerType":"CUSTOM","customContainer":{"length":100,"width":50,"height":50,"maxWeight":100},"maxContainers":1,"usePublishedPackaging":true}
```

自定义货柜尺寸为厘米，载重为千克；也可选 20GP/40GP/40HQ。maxContainers 为 1 至 12，旋转为 ALL/UPRIGHT_ONLY。同一列表不可重复同一规格，先合并数量。

3. 已发布 MASTER 绑定的确认尺寸优先于商品原箱规；其毫米尺寸转为厘米。仅本次试算的 `temporaryPacking:[{productId,variantId?,qtyPerCarton,cartonSize,grossWeight,netWeight}]` 再覆盖这些字段，不保存目录或绑定。自定义纸箱用 `customCartons:[{id,model,cartonCount,length,width,height,grossWeight,rotationPolicy}]`，单位箱、尺寸厘米、毛重千克，不创建商品。
4. 按比例填满改为 mode:"fill"，selections 提供各商品基准数量，fixedSelections 提供固定商品；两组同一规格不能重复。maxQuantity 为每个可缩放商品的数量上限、最多 100 万。核对 factor、selections、allSelections 和 result。factor:0 表示基准组合未能装下，不能报告填满成功。
5. 核对 result.totalUnits/totalCartons/totalCBM/totalWeight/containerCount/placements/unfitCartons/warnings。存在 simulationLimit 时明确说明最多只模拟了 2000 箱，不把有限建模结果当作全部需求可装下。临时箱规计算后回读目录箱规，确认没有保存。通过原 operationId 查询持久回执。

返回 `READ_ONLY_NO_BUSINESS_WRITE`；POST 回执仅记录计算结果。400：参数、缺规格或超出共享算法界限，修正输入。403：本人角色不足。429/SIMULATION_CAPACITY_FULL：计算进程容量满，等待正在计算的任务释放后重试；这是 CPU 容量，不是调用频率限制。504/SIMULATION_TIMEOUT：本次 CPU 计算已终止；检查原回执，不报告成功。取消会终止对应进程并释放容量。503：计算进程未成功运行，可在核对原回执后重试，不能据此填造装箱结果。

## 包装刀模、发布与商品绑定

1. 读取包装列表、设计和具体版本，核对designId/versionId、设计revision、VALID/DRAFT/PROCESSING状态、用途MASTER/PRODUCT和确认尺寸。团队BOSS/SALES/PACKER共享访问，其他岗位仍由网站拒绝。参数化generate接受毫米长宽高；MASTER只能RSC，PRODUCT可用其他预设。imports通过原multipart file字段导入SVG、矢量PDF、ASCII DXF或PDF-compatible AI，202/PROCESSING先轮询版本，不能报告已经解析或发布。
2. 改名/分类和版本revisions带最新baseRevision。修订追加版本并保留原源文件；旧版本有后续依赖时不能删除。source、preview、export.svg和export.pdf保留文件长度与sha256；只读GET文件续读使用responseId，原下载权限与当前岗位仍重新验证。
3. 发布当前VALID版本前展示用途、尺寸、材质和影响，取得授权后prepare并用最新baseRevision调用publish。发布启用应用内的版本，不等于已发送给供应商。绑定再用最新revision、已发布versionId、已读取productId/稳定variantId和level；MASTER只可绑定MASTER层，PRODUCT只可UNIT/INNER。批量resolve只读取有效MASTER绑定，不修改商品或绑定。
4. 装箱试算核对已发布版本的确认毫米尺寸转厘米，稳定规格绑定优先，商品级绑定为回退；临时箱规只对本次试算覆盖。解绑需最新baseRevision；回读历史unboundAt与现有绑定，目录箱规不因解绑重写。
5. 有有效绑定先解绑才能archive；有发布或绑定历史只能保留审计，不能永久删除。草稿永久删除需baseRevision+当前confirmName，单版本删除需confirmVersionNo并保留至少一版；模板、派生版本和绑定依赖仍阻止删除。结果storageDeleted:false表示物理清理延后，30日隔离保留期不等于文件已经消失。
6. ai-suggestions需要真实模型配置；缺配置503、未知结果或处理失败不能编造建议、确认尺寸或已发布状态。只核对前提时明确标为外部前提检查，未完成真实模型执行。

## 打包记录、照片与任务导出

1. 从本人或仓库授权订单读取editVersion、状态和历史商品行。PACKER仅修改仓库字段，不能修改PI草稿、金额、单位或商品数量。PUT订单保存packingDetails/packingImages/packedBy/packedAt时传editVersion；409重新读取。保存后回读箱数、尺寸、毛重、照片与状态，核对历史金额和行身份保持。
2. `get_orders_by_id_packing_print`提供非财务任务投影，确认订单、负责人、客户/交付地址、商品规格数量、唛头、备注和已有箱规；不把投影当财务明细。团队仓库读权限和普通订单本人范围不同，按原网站契约核对。
3. `post_orders_by_id_packing_print_export`只接受format为pdf/docx/images与excludedImages的有效商品索引；原服务器生成PDF、Word或分页PNG。核对原件内容和完整文件sha256；文件有operationId时用原operationId续读，图页dataUrl按实际返回解码验证，不把空页或缺图称为成功。
4. `get_orders_by_id_packing_images_zip`读取真实打包照片归档，`post_orders_by_id_packing_list`生成真实XLSX。核对ZIP照片原字节、XLSX发票编号/商品/箱规及本人范围；报关会计权限取决于needsCustoms，不能按角色名称猜测。导出不改已记录价格、数量、付款或库存；结果未知沿原MCP operationId查询。

## 库存台账

读取enabled categories、summary与records，按IN-OUT+有符号ADJUST核对库存与未发货锁定数量。BOSS/PACKER/平台管理员可写，其他岗位只读；原网站要求有效凭证，正向入库/盘盈填写进货总金额。编辑或撤回只适用于未撤回的手动记录，系统关联订单记录不能手动改或撤回。预检先合并相同productId+variantSku需求，不把预检回执当真实扣减库存。操作后回读台账、汇总与凭证media引用。

1. “指定规格入库／出库／盘点”先查 `get_inventory_categories`、`get_inventory_summary` 和完整商品，核对实际productId、启用类目、单位及规格。库存字段是variantSku：从同商品的稳定variantId找到其真实sku，不能把variantId直接当SKU，也不能漏掉所选规格而写入父产品桶。型号/规格有歧义先核实，数量沿该商品单位，不自行把台换成箱。
2. 凭证先通过原受管上传取得真实URL，例如 `post_upload_base64` 的真实image字节、filename及path="inventory_vouchers"；沿当前上传角色和MIME/大小契约，不能伪造路径。`post_inventory_in` body为 `{productId,variantSku?,quantity,reason,voucherImages:[原URL],purchaseAmount}`；OUT用 `post_inventory_out` 同字段但无需进货金额，ADJUST用 `post_inventory_adjust`。IN/OUT为正整数，ADJUST为有符号非零整数；正向入库/盘盈必须填写核实的进货总金额，缺金额不能自动填0，实际零金额另按事实登记。
3. 使用本次原operationId保存后，按productId及所选variantSku回读 `get_inventory_records_by_productId` 和汇总，核对原record.id、数量正负、金额、凭证及原单位。台账成功不等于供应商发货或已实际付款；UNKNOWN/PENDING查原回执和同规格记录，不重复加减库存。启用类目设置是完整categories保存，保留已有启用类目，不因一次入库覆盖团队配置。
4. 编辑 `put_inventory_records_by_id` 先读原记录，保留未改的type、quantity、reason、voucherImages及正向记录的purchaseAmount；这不是只传数量的局部补丁，不更换原商品/规格。撤回 `post_inventory_records_by_id_revoke` 沿具体授权和prepare，回读is_revoked及库存恢复；系统关联记录、已撤回记录或409都停止核对，不新建反向记录绕过保护。
