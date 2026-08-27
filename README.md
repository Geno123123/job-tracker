# Job Tracker

> 취업 준비 과정에서 흩어지기 쉬운 **지원 현황 · 자기소개서 · 포트폴리오**를 한 곳에서 관리하는 웹 서비스

취업 준비를 하면서 지원한 회사와 마감일을 스프레드시트로 관리하고, 자기소개서는 문서 파일에 흩어져 있고, 포트폴리오 링크는 매번 다시 찾아야 하는 불편함이 있었습니다. 이 문제를 직접 해결하기 위해 만든 개인 프로젝트입니다.

---

## 기술 스택

| 구분 | 기술 |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 4.1, Spring Data JPA, Spring Security |
| Database | PostgreSQL |
| Auth | JWT (jjwt) |
| Build | Gradle |
| Frontend | React, Vite *(예정)* |
| Infra | Docker, AWS EC2 / RDS / S3, Nginx *(예정)* |
| CI/CD | GitHub Actions *(예정)* |

---

## 주요 기능

### 구현 완료

**인증 / 인가**
- 회원가입 시 BCrypt 기반 비밀번호 단방향 암호화
- JWT 발급 및 `OncePerRequestFilter` 기반 토큰 검증 필터
- `SecurityFilterChain` 람다 DSL 방식의 접근 제어 (인증 경로만 공개, 그 외 전 경로 인증 필요)

**지원 현황 관리**
- 지원 건 등록 / 목록 조회 / 단계 변경 / 삭제
- 지원 단계를 `Enum`으로 관리 (서류 → 코딩테스트 → 면접 → 합격 / 불합격)
- 회사명 입력 시 기존 회사 조회 후 없으면 자동 생성 (find-or-create)
- **소유권 검증** — 수정 · 삭제 시 요청자 본인의 데이터인지 확인하여 타 사용자 데이터 접근 차단
- 채용 공고 원문 보관 (마감 후 사라지는 공고를 면접 준비 시 재확인)

**예외 처리**
- `@RestControllerAdvice` 기반 전역 예외 처리로 일관된 에러 응답 포맷 제공

### 구현 예정

**프로필 / 자기소개서**
- 기본 인적사항 및 포트폴리오 링크 관리
- 자기소개서 문항별 답변 저장, 글자 수 자동 카운트
- 문항 키워드 기반 과거 답변 검색 (자소서 재사용)
- 지원 건과 자기소개서 연결 — "이 회사에 어떤 답변을 냈는지" 추적

**AI 기능**
- 채용 공고 텍스트를 붙여넣으면 LLM이 회사명 · 직무 · 마감일을 자동 추출하여 등록 폼 자동 완성
- 자기소개서 문항과 보유 경험을 매칭하여 관련 경험 추천

**대시보드**
- 단계별 지원 건수, 기간별 지원 추이, 서류 통과율 등 통계 API

**인프라**
- Docker Compose 기반 컨테이너화
- AWS EC2 배포 및 RDS 연동, Nginx 리버스 프록시 + HTTPS 적용
- GitHub Actions CI/CD 파이프라인 구축
- CloudWatch 기반 로그 · 모니터링

---

## 프로젝트 구조

```
src/main/java/com/geno/job_tracker
├── config          # Security 설정, JWT 발급 · 검증
├── controller      # HTTP 요청 처리, 전역 예외 처리
├── domain          # JPA 엔티티
├── dto             # 요청 · 응답 객체 (Java record)
├── repository      # Spring Data JPA 리포지토리
└── service         # 비즈니스 로직
```

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
| `POST` | `/api/applications` | 지원 건 등록 | 필요 |
| `GET` | `/api/applications` | 내 지원 현황 목록 | 필요 |
| `PATCH` | `/api/applications/{id}/status` | 지원 단계 변경 | 필요 |
| `DELETE` | `/api/applications/{id}` | 지원 건 삭제 | 필요 |

인증이 필요한 요청은 `Authorization: Bearer {token}` 헤더를 포함해야 합니다.

---

## 실행 방법

**요구 사항** — Java 21, PostgreSQL

```bash
# 1. 데이터베이스 생성
createdb job_tracker

# 2. 환경 변수 설정
export DB_PASSWORD={PostgreSQL 비밀번호}
export JWT_SECRET={JWT 서명 키}

# 3. 실행
./gradlew bootRun
```

기본 포트는 `8080`이며, 애플리케이션 최초 실행 시 JPA가 스키마를 자동 생성합니다.

---

## 개발 방식

- 기능 단위로 브랜치를 분리하고 Pull Request를 통해 `main`에 병합
- 커밋 메시지는 `feat` · `fix` · `docs` 접두어로 유형 구분
- 민감 정보(DB 비밀번호, JWT 서명 키)는 환경 변수로 분리하여 저장소에 노출되지 않도록 관리