import { IEvents } from "./base/events";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import { IDelivery } from "../types";
import { triggerEvents } from "../utils/constants";

export class OrderDeliveryForm extends Form<IDelivery> {
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);

        // Проходим по массиву кнопок и добавляем обработчик событий при клике
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => this.handlePayment(button, events));
        });
    };

    // Функция для добавления класса active
    private handlePayment(clickedButton: HTMLButtonElement, events: IEvents) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button === clickedButton);
        });
        // Подписываемся на событие при выборе способа оплаты
        events.emit(triggerEvents.paymentChange, { field: 'payment', value: clickedButton.name });
    };

    // Сеттер для установки значения поля "Адрес доставки"
    set address(address: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = address;
    };

    // Метод для снятия активного класса с кнопки
    resetPaymentButtons() {
        this._paymentButtons.forEach(button => {
            button.classList.remove('button_alt-active');
        });
    };
}