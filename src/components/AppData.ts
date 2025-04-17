// import { EventEmitter, IEvents } from './base/events';
import {Model} from './base/Model';
import { IItem, IOrderDetails, IDelivery, IContacts, FormError, TPayment } from "../types";
import { triggerEvents } from "../utils/constants";

export class AppDataItem extends Model<IItem> {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
    index: number;
}

export interface IAppState {
    catalog: AppDataItem[]; 
    basketItems: string[];
    basketSum: number;
    preview: AppDataItem | null;
    order: IOrderDetails | null; 
}

export class AppState extends Model<IAppState> {
    catalog: AppDataItem[] = [];
    basketItems: string[] = [];
    basketSum: number = 0;
    preview: AppDataItem | null;

    // Пустой объект заказа
    order: IOrderDetails = this.clearOrder();

    formErrors: FormError = {};

    // Устанавливает каталог и обновляет
    setCatalog(items: AppDataItem[]) {
        this.catalog = items.map(item => new AppDataItem(item, this.events));
        this.events.emit(triggerEvents.itemsChanged, { catalog: this.catalog });
    };

    // Устанавливает превью карточки
    setPreview(item: AppDataItem) {
        this.preview = item;
        this.emitChanges(triggerEvents.preview, item);
    };

    // Добавление товара в корзину заказа
    addToBasket(item: AppDataItem) {
        this.basketItems.push(item.id);

        // Добавляем в сумму товаров в корзине цену добавленного товара
        this.basketSum = this.getBasketSum() + item.price;

        // Добавляем обработчик при изменении корзины
        this.events.emit(triggerEvents.basketChanged, this.basketItems);
    };

    // Удаление товара из корзины заказа
    removeFromBasket(id: string) {
        this.basketItems = this.basketItems.filter(itemId => itemId !== id);

        // Пересчитываем сумму товаров в корзине 
        this.basketSum = this.getBasketSum();

        // Добавляем обработчик при изменении корзины
        this.events.emit(triggerEvents.basketChanged, this.basketItems);
    };

    // Очистка корзины
    clearBasket() {
        this.basketItems = [];
        this.basketSum = 0;
        this.events.emit(triggerEvents.basketChanged, this.basketItems);
    };

    getBasketSum() {
        return this.basketSum;
    };

    // Создает пустой объект заказа
    private clearOrder(): IOrderDetails {
        return {
            payment: '',
            email: '',
            phone: '',
            address: '',
            total: 0,
            items: []
        };
    };

    // Указываем какое количество товара находится в корзине
    getBasketQuantity(): number {
        return this.basketItems.length;
    };

    // Проверка наличия товара в корзине
    isItemInBasket(item: AppDataItem) {
        return this.basketItems.includes(item.id);
    };

    // Устанавливаем поля "Оплата, Доставка"
    setDeliveries(field: keyof IDelivery, value: string) {
        if (field === 'payment') {
            this.order.payment = value as TPayment;  
        };
        if (field === 'address') {
            this.order.address = value;
        };
        this.validateDelivery();
    };

    // Валидация полей "Оплата, Доставка" 
    validateDelivery() { 
        const errors: typeof this.formErrors = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        };
        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты заказа';
        };
        this.formErrors = errors;
        this.events.emit(triggerEvents.deliveryFormErrors, this.formErrors);
        return Object.keys(errors).length === 0;
    }

    // Устанавливаем поля "Email-адрес, Телефон"
    setContacts(field: keyof IContacts, value: string) {
        if (field === 'phone') {
            this.order.phone = value;
        };
        if (field === 'email') {
            this.order.email = value;
        };
        this.validateContacts();
    };

    // Валидация полей "Email-адрес, Телефон"
    validateContacts() {
        const errors: typeof this.formErrors = {};
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        };
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        };
        this.formErrors = errors;
        this.events.emit(triggerEvents.contactsFormErrors, this.formErrors);
        return Object.keys(errors).length === 0;
    };

    // Возвращаем товары, которые были добавлены в корзину
    getBasketProducts(): AppDataItem[] {
        return this.basketItems.map(id => this.catalog.find(item => item.id === id)) as AppDataItem[];
    };

    // Возвращаем собранный заказ товаров
    getCollectedOrder(): IOrderDetails {
        return { 
            ...this.order,
            items: this.basketItems
        };
    };

    // Метод для очистки данных заказа
    resetOrderData() {
        this.order = this.clearOrder();
    }
}