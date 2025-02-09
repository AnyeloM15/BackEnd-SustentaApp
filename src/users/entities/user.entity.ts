import { Register } from 'src/register/entities/register.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')  // El decorador es obligatorio para que TypeORM la registre como entidad
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    matricula: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    fullName: string;

    @Column({ default: 'user' })
    role: string;

    @Column({ default: false })
    isPenalized: boolean;

    @OneToMany(() => Register, register => register.user)
    register: Register[];
}
