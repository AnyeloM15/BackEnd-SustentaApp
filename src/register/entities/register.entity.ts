import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// @Entity('register')
// export class Register {
//     @PrimaryGeneratedColumn()
//     id: number

//     @ManyToOne(() => User, user => user.register,{onDelete: 'CASCADE'})
//     user: User




//     @Column({default: false})
//     completed: boolean
// }

@Entity('register')
export class Register {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    startDateTime: Date

    @Column( { nullable: true})
    endDateTime: Date
    
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    hours: number;

    @Column({ type: 'boolean', default: false })
    completed: boolean;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    reduced_hours: number;

    @ManyToOne(() => User, (user) => user.registers)
    user: User;
    }