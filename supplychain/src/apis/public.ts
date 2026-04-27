import request from "@/utile";

export default {
    /**
     * 获取所有父分类列表
     * 接口: /product/categorylist/parent
     */
    getParentCategoryList() {
        return request({
            url: '/product/categorylist/parent',
            method: 'get'
        })
    },

    /**
     * 获取所有子分类列表
     * 接口: /product/categorylist/son
     */
    getSonCategoryList() {
        return request({
            url: '/product/categorylist/son',
            method: 'get'
        })
    },

    /**
     * 根据父类ID获取子分类列表
     * 接口: /product/categorylist/parent/{parentId}
     * @param parentId 父分类ID
     */
    getSonCategoryByParentId(parentId: number | string) {
        return request({
            url: `/product/categorylist/parent/${parentId}`,
            method: 'get'
        })
    },

    /**
     * 根据子分类ID获取父分类信息
     * 接口: /product/categorylist/son/{id}
     * @param id 子分类ID
     */
    getParentCategoryBySonId(id: number | string) {
        return request({
            url: `/product/categorylist/son/${id}`,
            method: 'get'
        })
    }
}