export class FileUtil{

   static rename(file:File, newNameWithExt:string) {
        return new File([file], newNameWithExt, {
          type: file.type,
          lastModified: file.lastModified,
        });
    } 
}