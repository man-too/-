import request from "@/utile"
/** 仓库信息对象 */
export interface Warehouse {
  id: number |null;               // 仓库ID
  warehouseName: string;    // 仓库名称
  address: string;          // 仓库地址
  capacity: number | null;         // 仓库容量 (立方米)
  usedCapacity: number | null;     // 已使用容量
  status: number;           // 状态 (1: 启用, 0: 禁用)
  updateTime: string;       // 更新时间
  managerName: string;      // 管理员名称
}

/** 管理员下拉选项 */
export interface ManagerOption {
  id: number;
  name: string;
}

/** 分页查询参数 */
export interface WarehouseQueryParams {
  warehouseName?: string;   // 仓库名称
  address?: string;          // 仓库地址 (注意：接口文档中此处拼写为 adress)
  managerId?: number | null;       // 管理员ID
  page: number;             // 当前页码
  pageSize: number;         // 每页条数
}

/** 新增/编辑仓库参数 */
export interface WarehouseForm {
  id?: number | null;              
  warehouseName: string;
  address?: string;         
  managerId: number |null;
  capacity: number | null;
}

export default {
  /**
   * 1. 分页 & 条件查询仓库信息
   * GET /warehouse-info/page
   */
  getPage(params: WarehouseQueryParams) {
    return request({
      url: '/warehouse-info/page',
      method: 'get',
      params:params
    })
  },

  /**
   * 2. 新增仓库
   * POST /warehouse-info/add
   */
  add(data: WarehouseForm) {
    return request({
      url: '/warehouse-info/add',
      method: 'post',
      data:data
    })
  },

  /**
   * 3. 编辑仓库
   * PUT /warehouse-info/edit
   */
  edit(data: WarehouseForm) {
   return request(
    {
        url: '/warehouse-info/edit',
        method: 'put',
        data:data
    }
)},

  /**
   * 4. 禁用或启用仓库
   * PUT /warehouse-info/{status}/{id}
   */
  changeStatus(status: number, id: number) {
    return request({
      url: `/warehouse-info/${status}/${id}`,
      method: 'put'
    })
  },

  /**
   * 5. 批量删除仓库
   * DELETE /warehouse-info/delete
   */
  delete(ids: string) {
    return request({
      url: '/warehouse-info/delete',
      method: 'delete',
      params: { ids }
    })
  },

  /**
   * 6. 主键回显 (获取详情)
   * GET /warehouse-info/show
   */
  getInfo(id: number | null | undefined) {
    return request({
      url: '/warehouse-info/show',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 7. 获取管理员列表 (下拉框)
   * GET /warehouse-user/list
   */
  getManagerList() {
    return request({
      url: '/warehouse-user/list',
      method: 'get',
    })
  }
}
