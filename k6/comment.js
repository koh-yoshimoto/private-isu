import http from "k6/http"
import { check } from "k6"
import { parseHTML } from "k6/html";

import { url } from "./config.js"
import { getAccount } from "./accounts.js"


export default function () {
  const account = getAccount();
  const login_res = http.post(url("/login"),{
    account_name: account.account_name,
    password: account.password,
  });

  check(login_res, {
    "is status 200": (r) => r.status === 200,
  });

  const res = http.get(url(`/@${account.account_name}`));

  const doc = parseHTML(res.body);

  // フォームのhidden要素からcsrf_token, post_idを抽出
   const token = doc.find('input[name="csrf_token"]').first().attr("value");
   const post_id = doc.find('input[name="post_id"]').first().attr("value");

   // /comment に対して、post_id, csrf_token とともにコメント本文をPOST
   const comment_res = http.post(url("/comment"), {
     post_id: post_id,
     csrf_token: token,
     comment: "Hello k6!",
   });

   check(comment_res, {
     "is status 200": (r) => r.status === 200,
   });
}


