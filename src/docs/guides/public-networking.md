 🌿Гільдія Зелений Сад🧝‍♀🧝‍♂:
#!/usr/bin/env python
# pylint: disable=unused-argument

import json
import logging
import os

from telegram import ReplyKeyboardMarkup, ReplyKeyboardRemove, Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)

# Налаштування логування
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(name)

# Стани анкети
(
    ASK_NAME,
    ASK_REASON,
    ASK_HELP,
    MAIN_MENU,
    SHOW_ORDERS,
    TAKE_ORDER,
    COMPLETE_ORDER,
    ADMIN_ADD_ORDER,
    ADMIN_CONFIRM_ORDER,
) = range(9)

# Ім'я файлів для збереження даних
USERS_FILE = "users.json"
ORDERS_FILE = "orders.json"

# ID каналу для повідомлень (встав свій chat_id каналу сюди)
CHANNEL_ID = -1001234567890  # Заміни на свій ID

# Клавіатури
menu_keyboard = [
    ["📝 Заповнити анкету", "📜 Переглянути замовлення"],
    ["📊 Мій профіль", "❓ Допомога"],
]
menu_markup = ReplyKeyboardMarkup(menu_keyboard, resize_keyboard=True)

admin_keyboard = [
    ["➕ Додати замовлення", "📜 Переглянути замовлення"],
    ["⬅️ Назад"],
]
admin_markup = ReplyKeyboardMarkup(admin_keyboard, resize_keyboard=True)

# Завантаження / збереження JSON
def load_json(filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def save_json(filename, data):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# --- АНКЕТА ---

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)
    users = load_json(USERS_FILE)

    if user_id in users and users[user_id].get("profile_complete"):
        await update.message.reply_text(
            "Ласкаво просимо назад у гільдію «Зелений Сад»! Вибери, що хочеш зробити:", reply_markup=menu_markup
        )
        return MAIN_MENU

    await update.message.reply_text(
        "Привіт! Щоб вступити в гільдію «Зелений Сад», будь ласка, відповідай на кілька питань.\n\n"
        "Як тебе звати?"
    )
    return ASK_NAME


async def ask_reason(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)
    users = load_json(USERS_FILE)

    name = update.message.text.strip()
    users[user_id] = users.get(user_id, {})
    users[user_id]["name"] = name
    save_json(USERS_FILE, users)

    await update.message.reply_text(
        f"Прекрасно, {name}! Чому ти хочеш вступити до гільдії «Зелений Сад»?"
    )
    return ASK_REASON


async def ask_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)
    users = load_json(USERS_FILE)

    reason = update.message.text.strip()
    users[user_id]["reason"] = reason
    save_json(USERS_FILE, users)

    await update.message.reply_text(
        "Чудово! А в чому ти можеш допомагати іншим учасникам гільдії?"
    )
    return ASK_HELP


async def finish_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)
    users = load_json(USERS_FILE)

    help_text = update.message.text.strip()
    users[user_id]["help"] = help_text
    users[user_id]["profile_complete"] = True
    users[user_id].setdefault("leaflets", 0)  # листочки-парусники
    save_json(USERS_FILE, users)

    await update.message.reply_text(
        "Дякую! Твоя анкета збережена.\n"
        "Тепер ти можеш переглянути замовлення або свій профіль.",
        reply_markup=menu_markup,
    )
    return MAIN_MENU

# --- ГОЛОВНЕ МЕНЮ ---

async def main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    text = update.message.text

if text == "📝 Заповнити анкету":
        return await start(update, context)
    elif text == "📜 Переглянути замовлення":
        return await show_orders(update, context)
    elif text == "📊 Мій профіль":
        return await show_profile(update, context)
    elif text == "❓ Допомога":
        await update.message.reply_text(
            "Це бот гільдії «Зелений Сад».\n"
            "- Заповни анкету, щоб стати учасником.\n"
            "- Переглядай та виконуй замовлення.\n"
            "- За виконання отримуй листочки-парусники.\n"
            "- Якщо ти адміністратор — можеш додавати замовлення.",
            reply_markup=menu_markup,
        )
        return MAIN_MENU
    else:
        await update.message.reply_text(
            "Обери, будь ласка, одну з доступних команд з меню.", reply_markup=menu_markup
        )
        return MAIN_MENU

# --- ПРОФІЛЬ ---

async def show_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = str(update.effective_user.id)
    users = load_json(USERS_FILE)

    if user_id not in users or not users[user_id].get("profile_complete"):
        await update.message.reply_text(
            "Ти ще не заповнив анкету. Обери '📝 Заповнити анкету' в меню."
        )
        return MAIN_MENU

    user = users[user_id]
    leaflets = user.get("leaflets", 0)
    level = leaflets // 7 + 1
    remain = leaflets % 7

    text = (
        f"👤 Ім'я: {user.get('name')}\n"
        f"🌱 Чому вступив: {user.get('reason')}\n"
        f"🤝 Чим можеш допомагати: {user.get('help')}\n"
        f"⛵ Листочків-парусників: {leaflets} (Рівень {level}, {remain} листочків на поточному паруснику)"
    )
    await update.message.reply_text(text, reply_markup=menu_markup)
    return MAIN_MENU

# --- ЗАМОВЛЕННЯ ---

async def show_orders(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    orders = load_json(ORDERS_FILE)
    if not orders:
        await update.message.reply_text(
            "Поки що замовлень немає. Зачекай, скоро додамо.", reply_markup=menu_markup
        )
        return MAIN_MENU

    # Формуємо список замовлень у вигляді тексту
    text = "📜 Список замовлень:\n"
    for oid, order in orders.items():
        status = "❌ Вільне"
        if order.get("taken_by"):
            status = f"🔒 Взято @{order['taken_by_username']}"
        text += f"{oid}. {order['title']} — {status}\n"

    text += "\nНапиши номер замовлення, щоб взяти його."
    await update.message.reply_text(text, reply_markup=ReplyKeyboardRemove())
    return TAKE_ORDER

async def take_order(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user = update.effective_user
    user_id = str(user.id)
    orders = load_json(ORDERS_FILE)

    order_id = update.message.text.strip()
    if order_id not in orders:
        await update.message.reply_text(
            "Такого замовлення немає. Будь ласка, введи правильний номер."
        )
        return TAKE_ORDER

    order = orders[order_id]
    if order.get("taken_by"):
        await update.message.reply_text(
            "Це замовлення вже взяли. Обери інше, будь ласка."
        )
        return TAKE_ORDER

    # Позначаємо замовлення як взяте
    orders[order_id]["taken_by"] = user_id
    orders[order_id]["taken_by_username"] = user.username or user.first_name
    save_json(ORDERS_FILE, orders)

    await update.message.reply_text(
        f"Ти взяв замовлення #{order_id}: {order['title']}\n"
        "Після виконання надішли команду /done, щоб отримати листочок-парусник."
    )
    return COMPLETE_ORDER

async def complete_order(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user = update.effective_user
    user_id = str(user.id)
    orders = load_json(ORDERS_FILE)
    users = load_json(USERS_FILE)

    # Знаходимо замовлення, яке взяв користувач
    taken_order_id = None
    for oid, order in orders.items():
        if order.get("taken_by") == user_id:
            taken_order_id = oid
            break

if not taken_order_id:
        await update.message.reply_text(
            "У тебе немає активних замовлень. Щоб взяти замовлення — вибери пункт 'Переглянути замовлення'.",
            reply_markup=menu_markup,
        )
        return MAIN_MENU

    # Позначаємо замовлення як виконане (видаляємо «taken_by»)
