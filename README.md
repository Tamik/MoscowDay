# MoscowDay
Приложение в честь праздника «День города – Москва».  

## Требования

Для запуска данного приложения требуется глобально установленный пакет Apache Cordova.

## Установка

- `npm install -g cordova` – установить/обновить Apache Cordova;
- `git clone https://github.com/Tamik/MoscowDay` – склонировать данный репозиторий;
- `cd MoscowDay` – перейти в директорию данного проекта;
- `npm install` – установить все требуемые зависимости;
- `cordova platform add [platform-name]` – установить указанную платформу и зависимости к ней;
- `cordova run [platform-name]` - запустить приложение на указанной платформе;
- `npm run dev` - запустить webpack-dev-сервер приложения;
- ???
- PROFIT!

### Регламент
Основной веткой для разработки является `develop`. Для разработки отдельных фич каждый разработчик создает собственную ветку,
где ведет разработку. Затем, доведя разработку своей фичи до стабильного состояния – можно отправить pull request в
ветку `develop`. После код-ревью фича вливается в ветку `develop`.  
Когда в `develop` качество приложения начнет соответствовать заданным требованиям – `develop` сквашится и вливается в
ветку `master`. После этого создается релиз-тег и приложение билдится для продакшена.  
  
---
  
Дайте мне уже поспать.
