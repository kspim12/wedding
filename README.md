# 하고FS 모바일 청첩장

김동률 · 김효정 / 2026년 11월 28일 토요일 낮 12시 / 잠실 더베네치아.
하고FS 팀원에게 전하는 초대장으로 계좌 정보는 포함하지 않습니다.

## 실행

Java 17 이상에서 IntelliJ의 `com.ryul.wedding.WeddingApplication.main()`을 실행하고
http://localhost:8080 에 접속합니다. `PORT` 환경 변수로 포트를 바꿀 수 있습니다.
Gradle 환경이 준비되어 있으면 `./gradlew run`으로도 실행할 수 있습니다.

Gradle 다운로드 없이 실행하려면:

```sh
mkdir -p build/classes/java/main
javac -d build/classes/java/main src/main/java/com/ryul/wedding/WeddingApplication.java
java -cp build/classes/java/main:src/main/resources com.ryul.wedding.WeddingApplication
```

## 파일

- `src/main/resources/web/index.html`: 본문, 예식 정보와 길찾기 링크
- `src/main/resources/web/style.css`: 모바일 우선 반응형 스타일
- `src/main/resources/web/app.js`: 달력, D-day, 사진 갤러리, 공유 및 일정 저장
- `src/main/resources/web/photos/`: 원본에서 긴 변 1600px로 줄인 공개용 사진 27장
- `src/main/resources/img/`: 보존한 원본 사진 (웹 서버에서 제공하지 않음)

사진은 9장씩 더 볼 수 있고, 확대 화면에서 화살표·키보드·스와이프로 넘깁니다.
공유 기능은 기기의 기본 공유 창을 사용하고, 미지원 환경에서는 링크를 복사합니다.
주소·링크 복사는 HTTPS 또는 localhost에서 사용할 수 있으며, 권한이 없으면 직접 복사할 수 있는 창을 표시합니다.
일정 저장은 `.ics` 파일을 다운로드합니다.

예식장 주소와 교통 정보 출처: https://www.thevenezia.co.kr/location/

## Firebase 배포

- 주소: https://hago-fs-wedding.web.app
- 프로젝트: `dongryul-hyojeong-wedding`
- 배포 계정: `kspim61@gmail.com`
- Hosting 사이트: `hago-fs-wedding`

```sh
firebase deploy --only hosting --project dongryul-hyojeong-wedding --account kspim61@gmail.com
```

`firebase.json`은 `src/main/resources/web`만 배포합니다. Java 서버와 원본 사진은 업로드하지 않습니다.
팀 전용 문구는 접근 제한 기능이 아니며, 배포된 청첩장은 링크를 가진 누구나 열람할 수 있습니다.
공유 미리보기 이미지와 URL은 배포 주소를 기준으로 설정했습니다.
