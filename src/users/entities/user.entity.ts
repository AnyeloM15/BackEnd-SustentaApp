import { Register } from 'src/register/entities/register.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkShift } from './work-shift.entity';

// @Entity('users')  // El decorador es obligatorio para que TypeORM la registre como entidad
// export class User {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @Column({ unique: true })
//     matricula: string;

//     @Column()
//     password: string;

//     @Column()
//     email: string;

//     @Column()
//     fullName: string;

//     @Column({ default: 'user' })
//     role: string;

//     @Column({ default: false })
//     isPenalized: boolean;

//     @OneToMany(() => Register, register => register.user)
//     register: Register[];
// }
@Entity('users')
    export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    matricula: string;

    @Column({ type: 'varchar', nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    fullName: string;

    @Column({ type: 'varchar', length: 50, default: 'user' })
    role: string;

    @Column({ type: 'boolean', default: false })
    isPenalized: boolean;

    @ManyToOne(() => WorkShift, (shift) => shift.users, { eager: true })
    shift: WorkShift;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    owed_hours: number;

    @OneToMany(() => Register, (register) => register.user)
    registers: Register[];
    }