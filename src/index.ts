import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Basket } from "./components/common/Basket";
import { Modal } from "./components/common/Modal";
import { Success } from "./components/common/Success";
import { AppState, AppDataItem } from "./components/AppData";
import { CardData } from "./components/Card";
import { CardInBasket } from './components/CardInBasket';
import { OrderContactsForm } from './components/OrderContactsForm';
import { OrderDeliveryForm } from './components/OrderDeliveryForm';
import { Page } from "./components/Page";
import { ProjectApi } from './components/ProjectApi';
import { IDelivery, IContacts, CatalogChangeEvent, IOrderDetails, FormError } from './types';
import { API_URL, CDN_URL, triggerEvents } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";

// Добавляем инициализацию событий
const events = new EventEmitter();

// Добавляем инициализацию Api
const api = new ProjectApi(CDN_URL, API_URL);

// Определяем все шаблоны приложения
const appTemplates = {
    catalogCard: ensureElement<HTMLTemplateElement>('#card-catalog'),
    previewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    basketItem: ensureElement<HTMLTemplateElement>('#card-basket'),
    modal: ensureElement<HTMLTemplateElement>('#modal-container'),
    delivery: ensureElement<HTMLTemplateElement>('#order'),
    contact: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success')
};

// Добавляем состояние приложения
const appState = new AppState({}, events);

// Добавляем основные компоненты
const page = new Page(document.body, events);
const modal = new Modal(appTemplates.modal,	events);
const basket = new Basket(cloneTemplate(appTemplates.basket), events);
const delivery = new OrderDeliveryForm(cloneTemplate(appTemplates.delivery), events);
const contact = new OrderContactsForm(cloneTemplate(appTemplates.contact), events);

// Получаем каталог карточек
api.getItemList()
    .then(appState.setCatalog.bind(appState))
    .catch(error => console.log(error));

// Устанавлием обработчик на событие обновления каталога
events.on<CatalogChangeEvent>(triggerEvents.itemsChanged, () => {
    // Обновляем данные каталога на странице
    page.catalog = appState.catalog.map((item: AppDataItem) => {
        // Создаем экземпляр карточки товара
        const card = new CardData(cloneTemplate(appTemplates.catalogCard), {
            // Добавляем обработчик клика по карточке
            onClick: () => events.emit(triggerEvents.itemSelect, item)
        });

        // Отображаем карточку с актуальными данными товара
        return card.render({
            category: item.category,
            title: item.title,
            image: item.image,
            price: item.price
        });
    });
});

// Устанавлием обработчик на событие открытия превью карточки товара
events.on(triggerEvents.itemSelect, (item: AppDataItem) => {
    appState.setPreview(item);
});

// Устанавлием обработчик при открытии превью выбранной карточки
events.on(triggerEvents.preview, (item: AppDataItem) => {
    // Создаем экземпляр карточки
    const card = new CardData(cloneTemplate(appTemplates.previewCard), {
        onClick: () => {
            // Выполняем проверки находится ли товар в корзине
            if (!appState.isItemInBasket(item)) {
                appState.addToBasket(item);
            } else {
                appState.removeFromBasket(item.id);
            };

            // Устанавливаем текст кнопки
            card.button = appState.isItemInBasket(item) ? 'Убрать из корзины' : 'В корзину';
        }
    });

    // Устанавливаем изначальный текст кнопки
    card.button = appState.isItemInBasket(item) ? 'Убрать из корзины' : 'В корзину';

    // Отображаем карточку
    card.render({
        category: item.category,
        title: item.title,
        image: item.image,
        price: item.price,
        description: item.description
    });

    // Выводим модальное окно с карточкой
    modal.render({
        content: card.getContainer()
    });
});

// Устанавливаем обработчик добавления товара в корзину
events.on(triggerEvents.addToBasket, (item: AppDataItem) => {
    appState.addToBasket(item);
    modal.close();
});

// Устанавливаем обработчик удаления товара из корзины
events.on(triggerEvents.deleteFromBasket, (item: AppDataItem) => {
    appState.removeFromBasket(item.id);
});

// Устанавлием обработчик на открытие модального окна при открытии корзины
events.on(triggerEvents.basketOpen, () => {
    modal.render({
        content: basket.render()
    });
});

// Устанавлием обработчик при открытии корзины
events.on(triggerEvents.basketChanged, () => {
    // Обновляем счетчик товаров в шапке
    page.counter = appState.getBasketQuantity();

    // Добавляем карточки товаров в корзину
    basket.items = appState.basketItems.map((id, index) => {
        // Находим товар в каталоге по ID
        const cardInBasket = appState.catalog.find((item) => {
            return item.id === id;
        });

        // Создаем карточку товара для корзины
        const card = new CardInBasket(cloneTemplate(appTemplates.basketItem), {
            onClick: () => appState.removeFromBasket(cardInBasket.id)
        });

        // Возваращем готовую карточку с данными
        return card.render({
            title: cardInBasket.title,
            price: cardInBasket.price,
            index: index + 1
        })
    });

    // Пересчитываем сумму товаров в корзине
    const totalPrice = appState.getBasketProducts().reduce((sum, item) => sum + item.price, 0);

    // Отображаем общую сумму товаров в корзине
    basket.total = totalPrice;

    // Сохраняем сумму товаров для оформления заказа
    appState.order.total = totalPrice;
});

// Слушатель открытия формы заказа
events.on(triggerEvents.orderOpen, () => {
    modal.render({
        content: delivery.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

// Добавляем слушатель при выборе способа оплаты
events.on(triggerEvents.paymentChange, (data: { field: keyof IDelivery; value: string }) => {
    appState.setDeliveries(data.field, data.value);
});

// Добавляем слушатель при изменении адреса доставки
events.on(triggerEvents.addressChange, (data: { field: keyof IDelivery; value: string }) => {
    appState.setDeliveries(data.field, data.value);
});

// Добавляем слушатель на валидацию полей "Оплата" и "Адрес доставки"
events.on(triggerEvents.deliveryFormErrors, (errors: FormError) => {
    const { payment, address } = errors;
    delivery.valid = !payment && !address
    delivery.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

// Слушать открытия формы контактных данных
events.on(triggerEvents.orderSumbit, () => {
    modal.render({
        content: contact.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

// Добавляем слушатель при изменении контактных данных
events.on(triggerEvents.contactsChange, (data: {field: keyof IContacts, value: string}) => {
    appState.setContacts(data.field, data.value)
});

// Добавляем слушатель на валидацию полей "Email" и "Телефон"
events.on(triggerEvents.contactsFormErrors, (errors: FormError) => {
    const { phone, email } = errors;
    contact.valid = !phone && !email;
    contact.errors = Object.values({ phone, email }).filter(i => !!i).join('; ');
});

// Оформляем заказ и выводим окно с сообщением об успешной оплате
events.on(triggerEvents.contactsSumbit, () => {
    // Отправляем собранный заказ товаров на сервер
    api.orderPlaced(appState.getCollectedOrder())
        .then(() => {
            const totalOrder = appState.order.total;
            appState.clearBasket();
            appState.resetOrderData();
            delivery.resetPaymentButtons();
            const successOrder = new Success(cloneTemplate(appTemplates.success), {
                onClick: () => modal.close()
            });
            modal.render({
                content: successOrder.render()
            });
            successOrder.orderSum = totalOrder;
        })
        .catch(error => console.log(error));
});

// Блокируем прокрутку страницы если открыта модальное окно
events.on(triggerEvents.modalOpen, () => {
    page.locked = true;
});

// Разблокируем прокрутку страницы если модальное окно закрыто
events.on(triggerEvents.modalClose, () => {
    page.locked = false;
});