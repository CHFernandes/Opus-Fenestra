import { getCustomRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Person } from '../entities/Person';
import { PersonsRepository } from '../repositories/PersonsRepository';

type ReturnToken = {
    accessToken: string;
    returnPerson: Person;
}

class AuthenticationService {
    private personsRepository: Repository<Person>;

    constructor() {
        this.personsRepository = getCustomRepository(PersonsRepository);
    }

    async login( user: string, password: string ): Promise<ReturnToken> {
        if(!password || !user) {
            throw new Error('Mandatory values not filled');
        }

        const person = await this.personsRepository.findOne({
            user
        });

        if (!person) {
            throw new Error('User not found or password mismatch');
        }

        if (person.password !== password) {
            throw new Error('User not found or password mismatch');
        }

        // const passwordSuccess = await bcrypt.compare(password, person.password);

        // if (!passwordSuccess) {
        //     throw new Error('User not found or password mismatch');
        // }

        const accessToken = jwt.sign(JSON.stringify(person), process.env.ACCESS_TOKEN_SECRET);

        const returnPerson = person;
        returnPerson.password = '';

        return ({accessToken, returnPerson});
    }

    async getUser(token: string): Promise<void> {
        const tokenResponse = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err){
                throw new Error('Invalid Token');
            }
            user.password = '';
            return user;
        });

        return tokenResponse;
    }
}

export { AuthenticationService };