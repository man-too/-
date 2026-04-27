#include <stdio.h>
#include <stdlib.h>
#include <string.h>
typedef int Status;
#define  OVERFLOW -2
#define  OK 1
#define ERROR -1
#define MAXSIZE 100

struct book
{char no[20];//书号
char name[50];//书名
float price;//价格
}；
typedef struct book ElemType;
typedef struct {
      ElemType *elem;
      int length;
}SqList;

void createlist(SqList& L,int n){
	int i;
	L.length=n;
	L.elem=new book[MAXSIZE];
	for(i=0;i<n;i++){
		scanf("%s,%s,%f",L.elem[i].no,L.elem[i].name,&L.elem[i].price);}
}
void printlist(SqList& L){
	int i;
	for(i=0;i<L.length;i++){
	printf("%s,%s,%f",L.elem[i].no,L.elem[i].name,L.elem[i].price);
	}
}
int search(SqList& L,char e[]){
	int i,n;
	n=0;
	n++;
	for(i=0;i<L.length;i++){
		if(!(strcmp(L.elem[i].no,e))){
			
			return n;
			break;
		}
	}	
	return -1;
	
}
/*在i之前插入一个元素*/
void insert(SqList& L,book e,int i){
	int n=i-1;/*输入与下标对齐*/
	int j;
	for(j=L.length-1;j>=n;j--){
		L.elem[j+1]=L.elem[j];
	}
	L.elem[n]=e;
	L.length++;
}
int Delete(SqList& L,char e[]){
	int i;book temp;
	for(i=0;i<L.length;i++){
		if(!(strcmp(L.elem[i].no,e))){
			
			for(;i<L.length-1;i++){
				L.elem[i]=L.elem[i+1];
				
			}
			L.length--;
			return 1;
			break;
		}
		
	}
	return -1;
}
int main(){
	SqList Q;int n=4;char e[]="hello";
	book a={
	"nihao",
	"shijie",
	40
	};
	printf("请输入书籍/n");
createlist(Q,n);
printf("书籍列表/n");
printlist(Q);
printf("请选择要查找的书籍/n");
if(search(Q,e)==-1){
printf("查找失败\n");}
printf("请选择要插入的书本以及插入位置\n")；
insert(Q,a,3);
printf("请输入要删除的书籍\n");
if(Delete(Q,e)==-1){
	printf("没有找到要删除的书籍");
	}
system("pause");
return 0;
}