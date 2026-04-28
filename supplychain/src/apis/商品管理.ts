 import request from "@/utile";
 interface pagequery {
    pageSize:number,
    page:number,
    productCode?:string,
    productName?:string,
    min?:number,
    max?:number,
    start?:string,
    end?:string,
    categroyId?:number
 }
 interface editformtype{
        id?: number | null,
        categoryName: string,
        productName: string,
        productCode: string,
        categoryId: number | null,
        price: number | null,
        spec: string,
        unit: string,
        costPrice:number | null,
        weight:number | null,
        volume:number | null ,
 }
export default{
    getgoodlist(params?:pagequery){
        return request({
            url:'/product/page',
            method:'get',
            params:params
        })
    },
    edit(data:editformtype){
        return request({
            url:'/product/edit',
            method:'put',
            data:data
        })
    },
    geteditdata(id:string){
        return request({
            url:'/product/show',
            method:'get',
            params:{id}
        })
    },

    delete(id:string){
        return request({
            url:'/product/delete',
            method:'delete',
            params:{id}
        })
    },
    add(data:any){
        return request({
            url:'/product/add',
            method:'post',
            data:data
        })
    },
}
export type {editformtype}
