# Step 1: Node.js 환경에서 React 앱 빌드
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 의존성 설치 (npm modules 다운로드)
RUN npm install

# 프로젝트 코드 복사
COPY . .

# Tailwind CSS 설정 파일 생성
RUN npx tailwindcss init -p

# React 앱 빌드 (dist 폴더 생성)
RUN npm run build

# Step 2: Nginx를 사용해 정적 파일 제공
FROM nginx:alpine

# Nginx 기본 설정을 교체
COPY nginx.conf /etc/nginx/nginx.conf

# React 빌드된 정적 파일을 Nginx로 복사
COPY --from=build /app/build /usr/share/nginx/html

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]