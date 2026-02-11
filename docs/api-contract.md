# API 契约（Mock 先行）

## 统一响应结构
```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "traceId": "trace-xxx"
}
```

## 1. 认证
### POST `/api/auth/verify`
- request
```json
{
  "role": "student",
  "realName": "张三",
  "idNumber": "4401************",
  "selfieToken": "selfie-pass-token"
}
```
- response.data
```json
{ "verified": true }
```

## 2. 智能体
### POST `/api/chat/extract`
- request
```json
{ "scene": "project", "text": "我需要电商小程序，预算5000" }
```
- response.data
```json
{
  "scene": "project",
  "intent": "intent:project",
  "extracted": { "budget": 5000, "description": "..." },
  "followUpQuestion": "请补充时间安排",
  "reportDraft": "..."
}
```

## 3. 报告
### POST `/api/reports/generate`
- request
```json
{ "scene": "project", "payload": { "projectType": "小程序" } }
```
- response.data
```json
{
  "reportId": "report-xxx",
  "reportContent": "...",
  "downloadUrl": "/mock-assets/sample-report.pdf"
}
```

## 4. 匹配
### POST `/api/matching/search`
- request
```json
{ "scene": "tutor", "payload": {} }
```
- response.data
```json
[
  {
    "id": "cand-tutor-1",
    "scene": "tutor",
    "name": "王同学",
    "major": "数学与应用数学",
    "tags": ["初中数学"],
    "experience": "1.5年经验",
    "rating": 4.9,
    "matchScore": 95,
    "price": "￥120/小时"
  }
]
```

### GET `/api/profiles/:id`
- response.data：单个候选详情对象。

## 5. 订单
### POST `/api/orders/create`
- request
```json
{
  "scene": "project",
  "targetId": "cand-project-1",
  "amount": 299,
  "channel": "wechat"
}
```
- response.data：订单对象（初始 `pending`）

### POST `/api/orders/pay`
- request
```json
{ "orderId": "order-xxx", "status": "paid" }
```
- response.data：更新后的订单对象

### GET `/api/orders/:id/status`
- response.data：订单对象

## 6. 申请与投诉
### POST `/api/applications`
- request：候选ID + 人才画像
- response.data
```json
{ "accepted": true }
```

### POST `/api/complaints`
- request
```json
{
  "scene": "tutor",
  "againstId": "cand-tutor-1",
  "reason": "迟到",
  "evidence": "截图1"
}
```
- response.data：投诉记录

## 7. 消息与返利
### GET `/api/messages`
- response.data：消息数组

### POST `/api/messages/read`
- request
```json
{ "ids": ["msg-1", "msg-2"] }
```
- response.data
```json
{ "success": true }
```

### GET `/api/referral/summary`
- response.data：返利汇总与流水

### POST `/api/referral/withdraw`
- request
```json
{ "amount": 100, "accountType": "wechat", "accountNo": "wx-demo" }
```
- response.data
```json
{ "success": true, "remain": 172 }
```

