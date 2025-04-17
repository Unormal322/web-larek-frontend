import { IEvents } from "./base/events";
import { ensureAllElements, ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import { IContacts } from "../types";

// Форма с полями ввода телефона и email-адреса
export class OrderContactsForm extends Form<IContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    };

    set email(email: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = email;
    };

    set phone(phone: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = phone;
    };
}