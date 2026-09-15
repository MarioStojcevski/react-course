type Person = {
  name: string;
  age: number;
};

type Employee = Person & { salary: number };

export const johnPerson: Person = {
  name: 'John',
  age: 30,
};

export const janiceEmployee: Employee = {
  name: 'Janice',
  age: 25,
  salary: 50000,
};