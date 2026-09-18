# Job Tracker

> 취업 준비 과정에서 흩어지기 쉬운 **지원 현황 · 자기소개서 · 포트폴리오**를 한 곳에서 관리하는 웹 서비스

**배포 주소** — https://geno-jobtracker.duckdns.org

취업 준비를 하면서 지원한 회사와 마감일을 스프레드시트로 관리하고, 자기소개서는 문서 파일에 흩어져 있고, 포트폴리오 링크는 매번 다시 찾아야 하는 불편함이 있었습니다. 이 문제를 직접 해결하기 위해 만든 개인 프로젝트입니다.

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Java 21, Spring Boot 4.1, Spring Data JPA, Spring Security |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Database | PostgreSQL 18 |
| Auth | JWT (jjwt) |
| Infra | Docker, Docker Compose, AWS EC2 (Ubuntu 24.04), Nginx |
| CI/CD | GitHub Actions, GitHub Container Registry |
| HTTPS | Let's Encrypt (Certbot 자동 갱신) |

---

## 아키텍처

```
사용자
  │  HTTPS
  ▼
Nginx (443)  ── 리버스 프록시
  ├─  /       →  React (Vite)
  └─  /api/*  →  Spring Boot
                     │
                     ▼
                PostgreSQL
```

모든 컨테이너는 Docker Compose로 함께 관리되며, 외부에는 Nginx만 노출됩니다.

**배포 흐름**

```
git push (main)
  → GitHub Actions: 백엔드 이미지 빌드
  → GitHub Container Registry에 업로드
  → EC2 접속 후 이미지 pull · 재시작
```

빌드를 GitHub Actions에서 수행하고 EC2는 완성된 이미지를 받아 실행만 하도록 구성했습니다. 초기에는 EC2에서 직접 Gradle 빌드를 수행했으나 메모리 부족으로 인스턴스가 응답 불능 상태가 되는 문제를 겪고 구조를 변경했습니다.

---

## 주요 기능

**인증 / 인가**
- 회원가입 시 BCrypt 기반 비밀번호 단방향 암호화
- JWT 발급 및 `OncePerRequestFilter` 기반 토큰 검증 필터
- `SecurityFilterChain` 람다 DSL 방식의 접근 제어

**지원 현황 관리**
- 지원 건 등록 · 조회 · 단계 변경 · 삭제
- 지원 단계를 Enum으로 관리 (서류 → 코딩테스트 → 면접 → 합격 / 불합격)
- 회사명 입력 시 기존 회사 조회 후 없으면 자동 생성 (find-or-create)
- **소유권 검증** — 수정 · 삭제 시 요청자 본인의 데이터인지 확인하여 타 사용자 데이터 접근 차단
- 채용 공고 원문 보관 (마감 후 사라지는 공고를 면접 준비 시 재확인)

**자기소개서**
- 문항별 답변 저장, 글자 수 실시간 카운트 및 제한 초과 표시
- 문항 키워드 검색으로 과거에 작성한 답변 재사용
- 지원 건과 연결하거나, 회사에 종속되지 않는 공통 문항으로 저장

**프로필**
- 지원서에 반복 입력하는 인적사항 저장
- 포트폴리오 링크 관리

**대시보드**
- 전체 지원 수, 진행 중인 건수, 마감 임박 건수, 서류 통과율 집계

---

## 도메인 설계

| 엔티티 | 설명 | 관계 |
|---|---|---|
| `User` | 사용자 계정 | — |
| `Profile` | 인적사항 | `User` 1:1 |
| `PortfolioLink` | 포트폴리오 링크 | `User` 1:N |
| `Company` | 회사 | — |
| `Application` | 지원 건 | `User` N:1, `Company` N:1 |
| `CoverLetter` | 자기소개서 문항 · 답변 | `User` N:1, `Application` N:1 *(nullable)* |

`CoverLetter`의 `Application` 참조를 `nullable`로 둔 이유는, 특정 회사에 종속되지 않는 **범용 문항 답변**(예: 지원동기 기본안)도 저장하여 재사용할 수 있도록 하기 위함입니다.

---

## API

| Method | Endpoint | 설명 | 인증 |
|---|---|---|---|
| `POST` | `/api/auth/signup` | 회원가입 | — |
| `POST` | `/api/auth/login` | 로그인 (JWT 발급) | — |
| `GET` | `/api/users/me` | 내 정보 조회 | 필요 |
| `GET` `POST` | `/api/applications` | 지원 현황 조회 · 등록 | 필요 |
| `PATCH` | `/api/applications/{id}/status` | 지원 단계 변경 | 필요 |
| `DELETE` | `/api/applications/{id}` | 지원 건 삭제 | 필요 |
| `GET` `POST` | `/api/cover-letters` | 자기소개서 조회 · 등록 *(`?keyword=` 검색)* | 필요 |
| `PUT` `DELETE` | `/api/cover-letters/{id}` | 자기소개서 수정 · 삭제 | 필요 |
| `GET` `PUT` | `/api/profile` | 프로필 조회 · 저장 | 필요 |
| `GET` `POST` | `/api/portfolio-links` | 포트폴리오 링크 조회 · 등록 | 필요 |
| `PUT` `DELETE` | `/api/portfolio-links/{id}` | 포트폴리오 링크 수정 · 삭제 | 필요 |
| `GET` | `/api/dashboard` | 대시보드 통계 | 필요 |

인증이 필요한 요청은 `Authorization: Bearer {token}` 헤더를 포함해야 합니다.

---

## 프로젝트 구조

```
job-tracker/
├── .github/workflows/     # CI/CD 파이프라인
├── backend/
│   ├── src/main/java/com/geno/job_tracker
│   │   ├── config         # Security 설정, JWT 발급 · 검증
│   │   ├── controller     # HTTP 요청 처리, 전역 예외 처리
│   │   ├── domain         # JPA 엔티티
│   │   ├── dto            # 요청 · 응답 객체 (Java record)
│   │   ├── repository     # Spring Data JPA 리포지토리
│   │   └── service        # 비즈니스 로직
│   └── Dockerfile         # 멀티스테이지 빌드
├── frontend/
│   ├── src
│   │   ├── api            # axios 인스턴스, 토큰 인터셉터
│   │   ├── components     # 공통 레이아웃, 모달
│   │   ├── pages          # 로그인 · 대시보드 · 자기소개서 · 프로필
│   │   └── types.ts       # 백엔드 DTO 대응 타입
│   ├── nginx.conf         # 리버스 프록시 · HTTPS 설정
│   └── Dockerfile.dev
└── docker-compose.yml
```

---

## 실행 방법

**요구 사항** — Docker, Docker Compose

```bash
git clone https://github.com/Geno123123/job-tracker.git
cd job-tracker

# 환경 변수 설정 (.env.example 참고)
cp .env.example .env
# DB_PASSWORD, JWT_SECRET 값 입력

docker compose up --build -d
```

`http://localhost`로 접속할 수 있습니다.

---

## 개발 방식

- 기능 단위로 브랜치를 분리하고 Pull Request를 통해 `main`에 병합
- 커밋 메시지는 `feat` · `fix` · `docs` · `refactor` 접두어로 유형 구분
- 민감 정보(DB 비밀번호, JWT 서명 키)는 환경 변수로 분리하여 저장소에 노출되지 않도록 관리

---

## 개선 예정

- 채용 공고 텍스트를 붙여넣으면 회사명 · 직무 · 마감일을 자동 추출하는 기능
- Refresh Token을 활용한 토큰 자동 재발급
- 배포 서버 접근 방식을 SSH 직접 노출에서 AWS Systems Manager 기반으로 전환
- 테스트 코드 작성 및 CI 단계에 검증 추가