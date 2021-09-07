import { getCustomRepository, Repository } from 'typeorm';
// import bcrypt from 'bcrypt';
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
            throw new Error('Campos obrigatórios não preenchidos');
        }

        const person = await this.personsRepository.findOne({
            user
        });

        if (!person) {
            throw new Error('Usuário não encontrado ou senha incorreta');
        }

        if (person.password !== password) {
            throw new Error('Usuário não encontrado ou senha incorreta');
        }

        // const passwordSuccess = await bcrypt.compare(password, person.password);

        // if (!passwordSuccess) {
        //     throw new Error('Usuário não encontrado ou senha incorreta');
        // }

        const accessToken = jwt.sign(JSON.stringify(person), process.env.ACCESS_TOKEN_SECRET);

        const returnPerson = person;
        returnPerson.password = '';

        return ({accessToken, returnPerson});
    }

    async getUser(token: string): Promise<void> {
        if (!token) {
            throw new Error('Token inválido');
        }

        try {
            const tokenResponse = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if(err){
                    throw new Error('Token inválido');
                }
                user.password = '';
                return user;
            });

            return tokenResponse;
        } catch(err) {
            throw new Error('Token inválido');
        }
    }
}

export { AuthenticationService };