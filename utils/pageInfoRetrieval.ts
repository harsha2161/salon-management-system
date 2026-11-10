import { NextRequest } from "next/server";

export default function PageInfoRetrieval(request : NextRequest){

    const pageNumber = parseInt(request.nextUrl.searchParams.get("pageNumber") || "1")
    const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "10")

    return {
        pageNumber : pageNumber,
        pageSize : pageSize
    }
}