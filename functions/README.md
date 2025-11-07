# hanaldual-functions

## 프로젝트 개요

이 프로젝트는 Firebase Cloud Functions, OpenAI GPT-4o, SendGrid, Firebase Firestore, FCM (Firebase Cloud Messaging), 그리고 Cheerio 웹 스크래핑을 기반으로 한 자동화된 공지 알림 시스템입니다.

한성대학교 공지사항 게시판을 주기적으로 스크래핑하여, 새로운 게시글을 자동으로 분석하고 관련 키워드 기반으로 사용자에게 이메일 또는 푸시 알림을 발송합니다.

## 주요 기능

### 1. 공지사항 수집 (Scraping)

- `scrape-and-save-new-posts.js`

  - 10분마다 한 번씩 한성대학교 공지사항 페이지를 스크래핑합니다.

  - 새로 등록된 게시글을 감지하고 Firestore의 posts 컬렉션에 저장합니다.

  - 저장 시 게시글의 제목, 본문, 작성자, 첨부파일 여부, 이미지 URL 등을 함께 기록합니다.

### 2. 게시글 분석 (OpenAI GPT-4o)

- `analyze-new-saved-post.js`

  - 새 게시글(posts/{docId})이 Firestore에 추가되면 자동으로 트리거됩니다.

  - GPT-4o 모델을 이용하여 게시글 내용을 요약하고, 사전에 정의된 키워드 목록 중 관련 키워드를 도출합니다.

  - 분석 결과(summary, related_keywords)는 postAnalyses 컬렉션에 저장됩니다.

### 3. 키워드 구독 시스템

- `update-keywords.js`

  - 사용자가 이메일(e_keywords) 또는 푸시(t_keywords) 키워드를 추가/삭제할 때, 해당 키워드를 Firestore keywords 컬렉션에 자동 업데이트합니다.

  - 구독자가 없는 키워드는 자동으로 삭제합니다.

  - `keywords` 문서 구조:

    ```javascript
    {
      "e_subscribers": ["userId1", "userId2"],
      "t_subscribers": ["userId3"]
    }
    ```

### 4. 이메일 발송 (SendGrid)

- `send-email.js`

  - 12시간마다 실행되며, 분석이 완료된 게시글(status: pending)을 대상으로 동작합니다.

  - 키워드별 구독자를 찾아 관련 게시글 목록을 생성하고, SendGrid API를 통해 이메일을 발송합니다.

  - 이메일 전송 후 해당 게시글의 상태를 "dispatched"로 변경하고 발송 시각(dispatchedAt)을 기록합니다.

### 5. 푸시 알림 (Firebase Cloud Messaging)

- `send-push-notification.js`

  - postAnalyses/{docId} 문서가 새로 생성될 때 트리거됩니다.

  - 해당 게시글의 관련 키워드를 구독 중인 사용자에게 FCM을 이용해 푸시 알림을 보냅니다.

  - 등록되지 않은 토큰은 자동으로 Firestore에서 제거됩니다.

- `send-push-welcome.js`

  - 사용자가 새로운 디바이스 토큰을 등록하면 환영 메시지를 발송합니다.

  - `users/{docId}` 문서의 `token` 필드가 갱신될 때 작동합니다.

### 6. 오래된 데이터 정리

- `delete-old-saved-posts.js`

  - 매일 자정마다 실행됩니다.

  - Firestore에서 30일 이상 지난 게시글(posts 컬렉션)을 자동 삭제하여 저장 공간을 최적화합니다.

### 7. 수동 푸시 발송

- `send-push-request.js`

  - HTTP 요청을 통해 수동으로 FCM 메시지를 발송할 수 있습니다.

  - `POST /sendPushRequest`

    요청 본문에 Firebase 메시지 객체를 포함해야 합니다.

## 프로젝트 구조

```bash
functions/
├── config/
│ ├── env.js # 환경 변수 로드
│ ├── firebase.js # Firebase 초기화
│ ├── urls.js # 스크래핑 대상 URL 정의
│ └── utils.js # 유틸리티 함수 (날짜 변환 등)
│
├── requests/
│ └── send-push-request.js
│
├── schedulers/
│ ├── delete-old-saved-posts.js
│ ├── scrape-and-save-new-posts.js
│ └── send-email.js
│
├── services/
│ ├── firestore.js # Firestore CRUD 및 데이터 접근 로직
│ ├── scrap.js # Cheerio 기반 웹 스크래핑
│ ├── openai.js # GPT-4o 게시글 분석
│ └── sendgrid.js # 이메일 전송
│
├── triggers/
│ ├── analyze-new-saved-post.js
│ ├── send-push-notification.js
│ ├── send-push-welcome.js
│ └── update-keywords.js
│
└── index.js
```

## 환경 설정

### `.env`

```bash
OPENAI_API_KEY=sk-xxxx
SENDGRID_API_KEY=SG.xxxxx
```

## 배포 방법

### 패키지 설치

```bash
cd functions
npm install
```

### Functions 배포

```bash
firebase deploy --only functions
```
