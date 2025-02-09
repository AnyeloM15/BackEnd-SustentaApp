import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('register')
export class Register {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, user => user.register,{onDelete: 'CASCADE'})
    user: User

    @Column()
    startDateTime: Date

    @Column( { nullable: true})
    endDateTime: Date

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    hours: number;

    @Column({default: false})
    completed: boolean
}