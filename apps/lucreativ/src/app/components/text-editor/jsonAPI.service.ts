import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonAPIService {

  async newRequest(
    type: string,
    address: string = '',
    securityKey: string = '',
    apiKey: string = '',
    contentType: string = '',
    operator: string = '',
    path: string = '',
    data: string = '',
    privateFile: string = '',
    newFileData: string = ''
  ): Promise<XMLHttpRequest> {
    const request = new XMLHttpRequest();
    if (address === '') {
      request.open(type, 'https://json.extendsclass.com/bin', true);
    } else {
      request.open(type, 'https://json.extendsclass.com/bin' + address, true);
    }
    request.setRequestHeader(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, post-check=0, pre-check=0'
    );
    request.setRequestHeader('Pragma', 'no-cache');
    request.setRequestHeader('Expires', '0');
    if (securityKey !== '') {
      request.setRequestHeader('Security-key', securityKey);
    }
    if (apiKey !== '') {
      request.setRequestHeader('Api-key', apiKey);
    }
    if (contentType !== '') {
      request.setRequestHeader('Content-type', 'application/' + contentType);
    }
    if (privateFile !== '') {
      request.setRequestHeader('Private', privateFile);
    }
    if (operator !== '') {
      request.send('[{"op":"' + operator + '","path":"' + path + data + '"}]');
    } else if (newFileData !== '') {
      request.send(newFileData);
    } else {
      request.send();
    }
    while (request.readyState !== 4) {
      await new Promise((f) => setTimeout(f, 100));
    }
    return request;
  }
}
