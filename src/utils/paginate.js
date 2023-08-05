


export const paginate=(page,size)=>{
    if(!page || page<=0)
    {
        page=1
    }
    if(!size ||size<=0)
    {
        size= 5
    }
    if(size > 20)
    {
        size = 20
    }
    const skip =(page-1)*size

    return {skip,limit:size}

}