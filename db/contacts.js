import fs from 'fs/promises';
import path from 'path';
import { checkIfContactExists, format, getId } from '../utils/utils.js';

const CONTACTS_PATH = path.resolve('db', 'contacts.json');
const DEF_CHARSET = 'utf-8';

//
// Contacts
//

let instance;

export default class Contacts {
  constructor() {
    if (instance) return instance;
    instance = this;
  }

  /**
   *
   * Перезаписывает файл новыми данными
   * @param {array} data - данные для записи
   */
  #flush = async data =>
    await fs.writeFile(CONTACTS_PATH, JSON.stringify(data, null, 2));

  /**
   *
   * Читает список всех контактов из файла
   * @param {string} charset - кодировка файла БД
   * @returns {array|null} массив данных
   */
  #readAll = async (charset = DEF_CHARSET) => {
    try {
      const data = await fs.readFile(CONTACTS_PATH, charset);
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  // Actions

  /**
   *
   * Выводит список контактов в виде таблицы
   */
  list = async () => console.table(await this.#readAll());

  /**
   *
   * Возвращает объект контакта по заданному id
   * @param {string} id
   * @returns {object|null} данные контакта с заданным id
   */
  get = async ({ id }) => {
    const list = await this.#readAll();
    return list?.find(itm => itm.id === id) ?? null;
  };

  /**
   *
   * Удаляет контакт с заданным id
   * @param {string} id
   * @returns {object|null} данные удаленного контакта
   */
  remove = async ({ id }) => {
    let removed = null;
    const list = await this.#readAll();

    // удаляем контакт из массива
    const newData = list?.filter(itm => {
      itm.id === id && (removed = itm);
      return itm.id !== id;
    });

    // если контакт успшено удален - сохраняем результат в файл
    if (removed) await this.#flush(newData);

    return removed;
  };

  /**
   *
   * Добавляет контакт
   * @param {object} data - данные нового контакта
   * @returns {object} данные успешно добавленного контакта
   */
  add = async ({ name, email, phone } = {}) => {
    const list = (await this.#readAll()) ?? [];

    const contact = {
      id: getId(),
      name: format.name(name),
      email: format.email(email),
      phone: phone ? format.phone(phone) : null,
    };

    // проверяем, существует ли контакт с таким тел/почтой
    checkIfContactExists(list, contact);

    // пишем контакт в файл
    this.#flush([...list, contact]);

    return contact;
  };
}
