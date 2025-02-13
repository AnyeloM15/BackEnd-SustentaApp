import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity ('work_shifts')
export class WorkShift {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type: 'varchar', length: 50, nullable: false})
    name : string;

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    requiredHours : number; 

    @OneToMany(() => User, user => user.shift)
    users : User[];
}