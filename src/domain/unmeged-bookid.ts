export function unMergedBookId(pubId: string, bookId: string) {
    return bookId.includes(pubId)
       ? bookId.split('-')[1]
       : bookId;
}
