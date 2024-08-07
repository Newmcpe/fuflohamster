# fuflohamster

Бот, автоматически прокачивающий аккаунт в Hamster Kombat

## Модули

| Модуль                                      | Статус |
|---------------------------------------------|:------:|
| Автокликер                                  |   ✅    |
| Покупка наиболее выгодных улучшений         |   ✅    |
| Накрутка рефералов из пула токенов Telegram |   ✅    |
| Разгадывание ежедневного комбо              |   ✅    |
| Разгадывание шифра (Азбука Морзе)           |   ✅    |
| Автовыполнение задач из раздела Earn        |   ✅    |

## Функционал

| Функция                                                                           | Статус |
|-----------------------------------------------------------------------------------|:------:|
| Настройка прокси для каждого аккаунта                                             |   ✅    |
| Редактирование задержек между нажатиями, перезарядкой энергии, покупкой улучшений |   ⌛    |
| Возможность включения и выключения модулей                                        |   ⌛    |
| Управление ботом из Telegram-бота                                                 | ⌛(30%) |
| Накрутка рефералов, используя собственную базу аккаунтов                          |   ✅    |
| Закупка аккаунтов для накрутки через Lzt Market                                   |   ✅    |

## Запуск

Требования:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- Создать Telegram-приложение [здесь](https://my.telegram.org/)

```bash
pnpm install
copy .env-example .env # Укажите API_ID и API_HASH своего приложения в Telegram
pnpm start
```