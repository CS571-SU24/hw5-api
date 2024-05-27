import crypto from 'crypto'

export default class BadgerBudDetail {
    id: string;
    name: string;
    age: string;
    breed: string;
    gender: string;
    colors: string[];
    declawed: boolean;
    imgIds: string[];
    description?: string;

    public constructor(
        id: string,
        name: string,
        age: string,
        breed: string,
        gender: string,
        colors: string[],
        declawed: boolean,
        imgIds: string[],
        description?: string
    ) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.breed = breed;
        this.gender = gender;
        this.colors = [...colors];
        this.declawed = declawed;
        this.imgIds = [...imgIds];
        this.description = description;
    }
}