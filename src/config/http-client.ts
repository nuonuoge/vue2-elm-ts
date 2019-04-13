import axios from 'axios';
import { AxiosResponse, AxiosRequestConfig } from 'axios';

export class HttpClient {
  isDevelopment: boolean = true;
  timeout: number = 10000;
  get(url: string, query?: any, option?: AxiosRequestConfig) {
    return axios.get(url, { params: query, timeout: this.timeout, ...option }).then(res => this.handelResponse(res)).catch(error => {
      this.handleError(error);
    });
  }
  post(url: string, body: any, query?: any, option?: AxiosRequestConfig) {
    return axios.post(url, body, { params: query, timeout: this.timeout, ...option }).then(res => this.handelResponse(res)).catch(error => {
      this.handleError(error);
    });
  }
  put(url: string, body?: any, query?: any, option?: AxiosRequestConfig) {
    return axios.put(url, body, { params: query, timeout: this.timeout, ...option }).then(res => this.handelResponse(res)).catch(error => {
      this.handleError(error);
    });
  }
  delete(url: string, query?: any, option?: AxiosRequestConfig) {
    return axios.delete(url, { params: query, timeout: this.timeout, ...option }).then(res => this.handelResponse(res)).catch(error => {
      this.handleError(error);
    });
  }
  /**
   * 返回结果处理
    */
  handelResponse(res: AxiosResponse): any {
    return res.data;
  }

  /**
   * 错误状态码处理
    */

  handleError(result: any) {
    const res = result.response;
    let data: any;
    if (res) {
      switch (res.status) {
        case 400:
          // 如果服务器返回错误信息,就显示服务器的信息,否则显示请求错误
          data = res.data ? res.data : '请求错误';
          break;
        case 401:
          data = res.data ? res.data : '请求要求用户的身份认证';
          break;
        case 404:
          data = res.data ? res.data : '不存在的资源';
          break;
        case 413:
          data = res.data ? res.data : '上传的资源体积过大';
          break;
        case 500:
          data = res.data ? res.data : '服务器内部错误，无法完成请求';
          break;
        case 501:
          data = res.data ? res.data : '服务器不支持请求的功能，无法完成请求';
          break;
        default:
          data = res.data ? res.data : '未分类的错误,status' + res.status;
          break;
      }
    } else {
      data = result.message;
    }
    this.showError(data);
  }
  /**
   * 显示错误的方法
   * 可以自定义,结合 weui, framework7 ,onsenui, ionic 等模态框
   *
   * 在线上环境下打印错误,或者ajax发送错误日志
   *
    */
  showError(msg: string) {
    if (this.isDevelopment) {
      // alert(msg);
      console.log(msg);
    } else {
      console.log(msg);
    }
  }
}
