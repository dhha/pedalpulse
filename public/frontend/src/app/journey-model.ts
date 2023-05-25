import { FormGroup } from "@angular/forms";

export class Journey {
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

    fillfromForm(journeyForm: FormGroup) {
        this.title = journeyForm.value.title;
        this.start_date = journeyForm.value.start_date ? (new Date(journeyForm.value.start_date)): new Date();
        this.check_points = [];
        
        if(journeyForm.value.start_point) {
            const checkPoint = new CheckPoint(journeyForm.value.start_point, [journeyForm.value.start_lng??0, journeyForm.value.start_lat??0]);
            this.check_points.push(checkPoint);
        }
        
        if(journeyForm.value.end_point) {
            const checkPoint = new CheckPoint(journeyForm.value.end_point, [journeyForm.value.end_lng??0, journeyForm.value.end_lat??0]);
            this.check_points.push(checkPoint);
        }
    }

    toJson() {
        let checkPointJson:any = [];
        this.check_points.forEach(check => {
            checkPointJson.push(check.toJson());
        });

        return {"title": this.title, "start_date": this.start_date, "check_points": checkPointJson}
    }
}

export class CheckPoint{
    #_id!: string;
    #name!: string;
    #location!: number[];

    get _id() { return this.#_id}
    set _id(id: string) { this.#_id = id}

    get name() { return this.#name}
    set name(name: string) { this.#name = name}

    get location() { return this.#location}
    set location(location: number[]) { this.#location = location}

    constructor(name: string, location: number[]) {
        this.name = name;
        this.location = location;
    }

    toJson() {
        return {"name": this.name, "location": [this.location.at(0)??0, this.location.at(1)??0]};
    }
}