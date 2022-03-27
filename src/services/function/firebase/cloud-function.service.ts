import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ICloudFunctions } from '../icloud-function';


@Injectable()
export class CloudFunctionService implements ICloudFunctions {

  constructor(private functions: Functions) {}

  call(name: string, data?: any) {
    let callable = httpsCallable(this.functions, name);
    return callable(data);
  }
  
}


