// Интерфейсы данных

// Структура данных товара
export interface IItem {
    // Уникальный идентификатор товара
    id: string;

    // Описание товара
    description: string;

    // Ссылка на изображение товара (url)
    image: string;

    // Название товара
    title: string;

    // Категория товара
    category: string;

    // Цена товара, может быть null
    price: number | null;
}

// Структура формы заказа товара
export interface IOrderDetails {
    // Способ оплаты 
    payment: TPayment;

    // Email-адрес пользователя
    email: string;

    // Контактный телефон пользователя
    phone: string;

    // Адрес доставки товара
    address: string;

    // Общая стоимость товаров в заказе
    total: number;

    // Массив купленных товаров
    items: string[];
}

export interface IOrderResult {
    // Уникальный идентификатор товара
    id: string;

    // Общая стоимость товаров в заказе
    total: number;
}

// Структура выбора оплаты и ввода адреса доставки
export interface IDelivery {
    // Выбор способа оплаты 
    payment: TPayment;

    // Адрес доставки товара
    address: string;
}

// Структура контактных данных пользователя
export interface IContacts {
    // Email-адрес пользователя
    email: string;

    // Контактный телефон пользователя
    phone: string;
}

// Структура списка товаров, полученных из API
export interface IItemList {
    // Количество товаров на главной странице
    total: number;

    // Массив товаров на главной странице
    items: IItem[];
}

// Интерфейс действий пользователя
export interface IActionsCard {
    onClick: (event: MouseEvent) => void;
}

// Типы данных

// Тип для выбора способа оплаты
export type TPayment = 'card' | 'cash' | '';

// Тип ошибки формы
export type FormError = Partial<Record<keyof IOrderDetails, string>>;

// Объект события с обновленным каталогом товаров
export type CatalogChangeEvent = {
    catalog: IItem[]
};