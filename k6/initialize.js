import http from "k6/http"
import { sleep } from "k6";

import { url } from "./config.js";

// /initializeに10秒のタイムアウトを指定してGETリクエストし、完了後1秒待機する
export default function () {
  http.get(url("/initialize"), {
    timeout: "10s",
  });
  sleep(1);
 }
