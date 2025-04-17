import { Component } from "./base/Component";
import { ICardData } from "./Card";
import { IActionsCard } from "../types";
import { ensureElement } from "../utils/utils";

export class CardInBasket extends Component<ICardData> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    // Порядковый номер товара в корзине
    protected _index: HTMLElement;
    
    // Кнопка удаления товара из корзины
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: IActionsCard) {
        super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        // Удаление товара из корзины     
		if (actions?.onClick) {
			this._deleteButton.addEventListener('click', actions.onClick);
		};
    };

    set title(value: string) {
        this.setText(this._title, value);
    };

    set price(value: number | null) {
        this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
        this._deleteButton && (this._deleteButton.disabled = value === null);
	};

    set index(value: number) {
        this.setText(this._index, value);
    };
};