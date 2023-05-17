export class UserModel {
    #_id!: string;
    #first_name!: string;
    #last_name!: string;
    #email!: string;
    #username!: string;
    #password!: string;

    get _id() { return this.#_id}
    set _id(id: string) { this.#_id = id}

    get first_name() { return this.#first_name}
    set first_name(first_name: string) { this.#first_name = first_name}

    get last_name() { return this.#last_name}
    set last_name(last_name: string) { this.#last_name = last_name}

    get email() { return this.#email}
    set email(email: string) { this.#email = email}

    get username() { return this.#username}
    set username(username: string) { this.#username = username}

    get password() { return this.#password}
    set password(password: string) { this.#password = password}

    constructor() {}
}