import request from "@/utile";
export default{
    getparentcategory(params?: any){
        return request({
            url:'/category/page/parent',
            method:'get',
            params:params
        })
    },
    getsoncategory(params?: any){
        return request({
            url:'/category/page/son',
            method:'get',
            params:params
        })
    },
    addcategory(data:any){
        return request({
            url:'/category/add',
            method:'post',
             data:data
        })
    },
    editcategory(data:any){
        return request({
            url:'/category/edit',
            method:'put',
            data:data
        })
    },
    deletecategory(ids: string | number[]){
        const idsParam = Array.isArray(ids) ? ids.join(',') : ids
        return request({
            url:'/category/delete',
            method:'delete',
            params:{ ids: idsParam }
        })
    },
    showcategory(id:string){
        return request({
            url:'/category/show',
            method:'get',
            params:{id}
        })
    },
    editstatus(status: number, id: number) {
        return request({
          url: `/category/status/${status}`,
          method: 'put',
          data: {id}
        })
      }
}
export type {}