// import { apiKey } from "./util";
// import d_fault from "./util"; /* export default사용시 */
// import { apiKey,abc } from "./util";

// 여러 개의 import를 하나의 객체로 묶어 반환 가능
import * as util from "./util"
console.log(util.default);
console.log(util.apiKey);
console.log(util.abc);