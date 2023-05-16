export class JourneyModel {
    #_id!: string;
    #title!: string;
    #start_date!: Date;
    #check_points!: CheckPoint[];

    get _id() { return this.#_id}
    set _id(id: string) { this.#_id = id}

    get title() { return this.#title}
    set title(title: string) { this.#title = title}

    get start_date() { return this.#start_date}
    set start_date(start_date: Date) { this.#start_date = start_date}

    get check_points() { return this.#check_points}
    set check_points(check_points: CheckPoint[]) { this.#check_points = check_points}

    constructor() {}
}

class CheckPoint{
    #_id!: string;
    #name!: string;
    #location!: [number];

    get _id() { return this.#_id}
    set _id(id: string) { this.#_id = id}

    get name() { return this.#name}
    set name(name: string) { this.#name = name}

    get location() { return this.#location}
    set location(location: [number]) { this.#location = location}

    constructor() {}
}