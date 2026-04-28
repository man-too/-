import request from "@/utile"

/**
 * 库位信息对象
 */
export interface Location {
  id: number | null; // 库位ID
  locationCode: string; // 库位编码 (例如: A-01-02-03)
  capacity: number |null; // 库位容量 (立方米)
  usedCapacity: number |null; // 已使用容量 (立方米)
  status: number |null; // 状态 (1: 启用, 0: 禁用)
}

/**
 * 分页查询参数
 */
export interface LocationQueryParams {
  page: number |null; // 当前页码
  pageSize: number |null; // 每页条数
  locationCode?: string; // 库位编码 (模糊查询)
  status?: number |null; // 状态
  warehouseId: number |null; // 所属仓库ID (必填)
}

/**
 * 新增/编辑库位参数
 */
export interface LocationForm {
  id?: number | null; // 编辑时必填
  locationCode: string; // 库位编码
  capacity: number|null; // 库位容量
}

export default {
  /**
   * 1. 分页 & 条件查询库位信息
   * GET /warehouse-location/page
   */
  getPage(params: LocationQueryParams) {
    return request({
      url: '/warehouse-location/page',
      method: 'get',
      params: params
    })
  },

  /**
   * 2. 新增库位
   * POST /warehouse-location/add
   */
  add(data: LocationForm) {
    return request({
      url: '/warehouse-location/add',
      method: 'post',
      data: data
    })
  },

  /**
   * 3. 编辑库位
   * PUT /warehouse-location/edit
   */
  edit(data: LocationForm) {
    return request({
      url: '/warehouse-location/edit',
      method: 'put',
      data: data
    })
  },

  /**
   * 4. 批量删除库位
   * DELETE /warehouse-location/delete
   */
  delete(ids: string) {
    return request({
      url: '/warehouse-location/delete',
      method: 'delete',
      params: { ids } 
    })
  },

  /**
   * 5. 主键回显 (获取库位详情)
   * GET /warehouse-location/show
   */
  getInfo(id: number) {
    return request({
      url: '/warehouse-location/show',
      method: 'get',
      params: { id }
    })
  }
}