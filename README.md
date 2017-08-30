# MoscowDay
Приложение для праздника «День города – Москва».  

## Важно (прочитайте, пожалуйста)
Не хотим, чтобы это выглядило как оправдание, но перед просмотром кода – важно знать:
1. Это первый опыт работы с React и Cordova для всех участников команды.
2. От менеджера была установка — сделать максимально быстро. Даже если пострадает архитектура. Ведь после проверки гипотезы код планировалось переписать.
3. Получив опыт, мы видим здесь много недочетов. Например:
    - Выбрали паттерн проектирования архитектуры Atomic Design, но в большинстве случаев игнорировали его методологию и делали так, чтобы работало.
    - Не использовали Redux. Общение между компонентами стало морокой, приходилось прокидывать состояние через передачу контекста родителя в пропсах (омг).
    - Не правильно спроектированная архитектура переходов по приложению (роутинг), и как итог – не работающая физическая кнопка "назад" на мобильных устройствах.
    - Порой методом тыка делались вещи, которые не до конца осознаны.
    - В некоторых местах приходилось "жестко" перерендеривать компоненты.
    - Не вынесены константы.
    - Не вынесены стили, нет реюзабельности.
    - Инлайн-стили.
    - Не было единой методологии наименования стилей.
    - Иерархия компонентов не идеальна.
    - Не полностью использовались PropTypes.
    - Не использовались DefaultTypes.
    - Не весь код покрыт комментариями и/или документацией.
    - Код не покрыт тестами.
    - В некоторых местах код дублируется.
    - Не реализована обработка ошибок.
    - Карта:
        - Не декомпозирован файл компонента Map.
        - Не вынесена разметка и стили некоторых баллунов.
    - Можно было разбить проект на еще более мелкие модули.
4. Так же важно отметить, что мы не отнеслись с должной серьезностью к код-ревью (отчасти из-за сроков), опирались только на флоу разработки.
5. Для приложения было важно отслеживать метрику. Было решено подключить AppMetrica. Однако в данном плагине был найден баг (который на самом деле баг Cordova, об этом ниже), который не позволял собрать приложение под iOS.  В чем соль: при добавлении плагина в проект, Cordova его берет из интернета и устанавливает. Проблема в том, что Cordova игнорирует так называемые Symbolic Links (файлы, которые являются ссылкой на другой файл). И как итог – не работающий фреймворк AppMetrica. Баг был исправлен, теперь AppMetrica заводится и работает корректно. [Форк репозитория](https://github.com/Tamik/metrica-plugin-cordova) плагина AppMetrica для Cordova с исправленным багом.

## Требования
Для запуска данного приложения требуется глобально установленный пакет Apache Cordova.

## Установка
- `npm install -g cordova` – установить/обновить Apache Cordova
- `git clone https://github.com/Tamik/MoscowDay` – склонировать данный репозиторий
- `cd MoscowDay` – перейти в директорию данного проекта
- `npm install` – установить все требуемые зависимости
- `npm run dev` - запустить dev-окружение приложения
- `cordova platform add [platform-name]` – установить указанную платформу и зависимости к ней
- `cordova run [platform-name]` - запустить приложение на указанной платформе
- ???
- PROFIT!

## Регламент
Основной веткой для разработки является `develop`. Для разработки отдельных фич каждый разработчик создает собственную ветку,
где ведет разработку. Затем, доведя разработку своей фичи до стабильного состояния – можно отправить pull request в
ветку `develop`. После код-ревью фича вливается в ветку `develop`.  
Когда в `develop` качество приложения начнет соответствовать заданным требованиям – `develop` вливается в
ветку `master`. После этого создается `tag` и приложение билдится для продакшена.
